"use client";

import { useState, useRef, useMemo, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { KIDS, type KidId } from "@/lib/kids";
import { useTTS, OPENAI_VOICE } from "@/lib/tts";
import { getCourse } from "@/lib/curriculum-spine";
import { courseProgress, markLessonComplete } from "@/lib/curriculum-spine/progress";
import { courseSequence } from "@/lib/curriculum-spine/types";
import { saveResult, MASTERY_PCT } from "@/lib/curriculum-spine/results";
import { queueSignoff } from "@/lib/curriculum-spine/signoff";
import { reportLessonToHomeward, subjectToTitle, dailyLessonId, TIER_META, type LessonTier } from "@/lib/homeward";
import type { SpineLesson } from "@/lib/curriculum-spine/types";

const TUTOR: Record<string, { name: string; emoji: string }> = {
  titus: { name: "Buck", emoji: "🎣" },
  mercy: { name: "Princess Rose", emoji: "🌹" },
  lois: { name: "Princess Crystal", emoji: "❄️" },
  truma: { name: "Lydia", emoji: "🪻" },
};

// Friendly display name for a subject in the lesson header. The curriculum key
// (e.g. "prealgebra") is a routing slug, not what the child should read: Truma's
// pre-algebra course IS Dimensions Math 5, so it shows "Dimensions Math". Anything
// not mapped falls back to a title-cased version of the slug.
const SUBJECT_LABEL: Record<string, string> = {
  prealgebra: "Dimensions Math",
  dogtraining: "Dog Training",
};

// Warm per-tutor opener spoken before the authored teaching text. Kept here (not
// AI-generated) so the tutor starts talking instantly, no LLM round-trip for the
// opening. The AI is only called when the child asks a question.
const OPENERS: Record<string, string> = {
  titus: "Well hey there, Titus! Let's dig into this.",
  mercy: "Hi sweet Mercy! Let's learn this together.",
  lois:  "Hi Lois! Let's learn something fun.",
  truma: "Hello, Truma. Let's get into it.",
};

// Split authored teaching text into one-idea-at-a-time beats so the tutor teaches
// (and the screen reveals) a single sentence at a time, never a dense wall.
function splitSentences(text: string): string[] {
  const parts = text.match(/[^.!?]+[.!?]+(?:["')\]]+)?|\S[^.!?]*$/g);
  return (parts ?? [text]).map((s) => s.trim()).filter(Boolean);
}

// A runtime beat. Teaching beats show/speak one idea; a "try" beat is an inline
// "your turn" check with authored (LLM-free) feedback, the heart of teach → try
// → respond. Built either from a lesson's authored `interactive` script or, for
// lessons without one, auto-derived from `teach`/`workedExample`/`memoryWork`.
type Beat =
  | { kind: "teach" | "example" | "memory"; text: string; say: string; visual?: string }
  | {
      kind: "try";
      prompt: string;
      say: string;
      choices: string[];
      correctIndex: number;
      onRight: string;
      onWrong: string;
      visual?: string;
    };

interface Props {
  kidId: string;
  subject: string;
  lesson: SpineLesson;
}

type Phase = "teach" | "quiz" | "result";

/**
 * A real taught lesson: the tutor teaches from authored content shown on a
 * readout (Buck reads it aloud), the child works an authored mastery quiz, and
 * the lesson is scored against the classical 80% threshold. At mastery it is
 * recorded, earns coins, and is queued for Mom to sign off. Below 80% the child
 * reviews and tries again, nothing is marked complete.
 */
export default function TaughtLesson({ kidId, subject, lesson }: Props) {
  const router = useRouter();
  const kid = KIDS[kidId as KidId];
  const tutor = TUTOR[kidId] ?? TUTOR.titus;
  const colorHex = kid?.colorHex ?? (kidId === "truma" ? "#0BABB9" : "#2563eb");
  // Littles (Lois xlarge, Mercy large) can't read, so their pictures and text run
  // much larger. A big picture on every beat is the point for them.
  const visualSize = kid?.uiSize === "xlarge" ? "text-8xl" : kid?.uiSize === "large" ? "text-7xl" : "text-5xl";
  const beatTextSize = kid?.uiSize === "xlarge" ? "text-3xl" : kid?.uiSize === "large" ? "text-2xl" : "text-xl";
  const { speak, unlockAudio, stopAudio, pauseAudio, resumeAudio, speaking, paused } = useTTS(OPENAI_VOICE[kidId] ?? "onyx");

  // Littles (Lois xlarge, Mercy large) can't read, so the tutor reads each answer
  // choice aloud and we highlight the choice being spoken, in sync.
  const isLittle = kid?.uiSize === "xlarge" || kid?.uiSize === "large";
  const [spokenChoice, setSpokenChoice] = useState<number | null>(null);
  const readSeqRef = useRef(0);
  const cancelChoiceRead = () => { readSeqRef.current++; setSpokenChoice(null); };
  // Speak one line, calling `done` when it ends. A generous fallback timer means the
  // read-aloud sequence can never permanently stall even if the audio end signal is missed.
  const speakThen = (text: string, done: () => void) => {
    let fired = false;
    const finish = () => { if (fired) return; fired = true; done(); };
    const timer = setTimeout(finish, 3000 + text.length * 130);
    speak(text, () => { clearTimeout(timer); finish(); });
  };
  // Read the prompt, then each choice in turn, highlighting the one being spoken.
  // Older kids (who can read) just hear the prompt, exactly as before.
  const readPromptAndChoices = (promptText: string, choices: string[]) => {
    const myId = ++readSeqRef.current;
    const alive = () => myId === readSeqRef.current;
    setSpokenChoice(null);
    if (!isLittle) { if (promptText) speak(promptText); return; }
    speakThen(promptText, () => {
      if (!alive()) return;
      let i = 0;
      const step = () => {
        if (!alive() || i >= choices.length) { if (alive()) setSpokenChoice(null); return; }
        const idx = i++;
        setSpokenChoice(idx);
        speakThen(choices[idx], () => { if (alive()) step(); });
      };
      step();
    });
  };

  const quiz = lesson.quiz ?? [];
  const [phase, setPhase] = useState<Phase>("teach");
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const startTime = useRef<number>(Date.now());
  const persisted = useRef(false);

  // ── Paced teaching: one idea on screen and spoken at a time ────────────────
  const [begun, setBegun] = useState(false);
  const [beatIdx, setBeatIdx] = useState(0);

  // Live elapsed timer. Counts up from mount toward the lesson tier's real length
  // so the child (and Mom) can see the session is genuinely worth its coins. Shown
  // only on Truma's lessons; the little ones are not put on a clock.
  const [elapsedSec, setElapsedSec] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setElapsedSec(Math.floor((Date.now() - startTime.current) / 1000));
    }, 1000);
    return () => clearInterval(id);
  }, []);
  const showTimer = kidId === "truma";
  const targetMin = TIER_META[(lesson.tier ?? "standard") as LessonTier].minutes;
  const clock = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  const timerPill = showTimer ? (
    <div
      className="flex items-center gap-1.5 text-white text-xs font-black tabular-nums"
      aria-label={`${clock(elapsedSec)} of about ${targetMin} minutes`}
    >
      <span aria-hidden="true">⏱</span>
      <span>{clock(elapsedSec)}</span>
      <span className="font-bold opacity-70">/ {targetMin}:00</span>
    </div>
  ) : null;
  // Selection for the CURRENT "try" beat (reset whenever the beat changes).
  const [trySelected, setTrySelected] = useState<number | null>(null);
  // Whether this lesson uses the authored interactive script (vs. the derived
  // sentence-by-sentence readout). Drives the opener behavior.
  const isInteractive = !!lesson.interactive?.length;
  const beats = useMemo<Beat[]>(() => {
    // Authored interactive script → teach → try → respond, verbatim.
    if (lesson.interactive?.length) {
      return lesson.interactive.map((b): Beat =>
        b.kind === "try"
          ? { kind: "try", prompt: b.prompt, say: b.say ?? b.prompt, choices: b.choices, correctIndex: b.correctIndex, onRight: b.onRight, onWrong: b.onWrong, visual: b.visual }
          : { kind: b.kind, text: b.text, say: b.say ?? b.text, visual: b.visual }
      );
    }
    // Fallback: derive paced beats from the plain authored fields.
    const arr: Beat[] = [];
    splitSentences(lesson.teach).forEach((s) => arr.push({ kind: "teach", text: s, say: s }));
    (lesson.workedExample?.split("\n").filter(Boolean) ?? []).forEach((s, i) =>
      arr.push({ kind: "example", text: s, say: i === 0 ? `Here is an example. ${s}` : s })
    );
    if (lesson.memoryWork) arr.push({ kind: "memory", text: lesson.memoryWork, say: `Here's the part to remember. ${lesson.memoryWork}` });
    return arr;
  }, [lesson]);
  const atLastBeat = beatIdx >= beats.length - 1;
  const curBeat = beats[beatIdx];
  // A "try" beat is resolved only once the correct choice is tapped; teaching
  // beats are always resolved. This gates the Next / quiz buttons so a child
  // can't skip past a check without getting it right (they may retry freely).
  const beatResolved = !curBeat || curBeat.kind !== "try" || trySelected === curBeat.correctIndex;

  // Lesson content handed to the tutor so Buck teaches THIS lesson by voice and
  // can answer the child's questions about it.
  const lessonContext = useMemo(() => {
    const ex = lesson.workedExample ? ` Worked example: ${lesson.workedExample.replace(/\n+/g, " ")}` : "";
    const mem = lesson.memoryWork ? ` Memory work: ${lesson.memoryWork}` : "";
    return `"${lesson.title}". Objective: ${lesson.objective} Teaching: ${lesson.teach}${ex}${mem}`;
  }, [lesson]);

  type Msg = { role: "user" | "assistant"; content: string };
  const [convo, setConvo] = useState<Msg[]>([]);
  const convoRef = useRef<Msg[]>([]);
  useEffect(() => { convoRef.current = convo; }, [convo]);
  const [talking, setTalking] = useState(false); // waiting on / speaking as the tutor
  const [listening, setListening] = useState(false);
  const [askText, setAskText] = useState("");
  const started = useRef(false);
  const recognitionRef = useRef<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any

  const sendToTutor = useCallback(async (message: string, hidden: boolean) => {
    setTalking(true);
    const history = convoRef.current.map((m) => ({ role: m.role, content: m.content }));
    if (!hidden) setConvo((prev) => [...prev, { role: "user", content: message }]);
    try {
      const res = await fetch("/api/kid-tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kidId, subject, message, lessonContext, conversationHistory: history }),
      });
      if (!res.ok) throw new Error("tutor");
      const text = await res.text();
      setConvo((prev) => [...prev, { role: "assistant", content: text }]);
      speak(text);
    } catch {
      setConvo((prev) => [...prev, { role: "assistant", content: "Oops, I lost my train of thought. Tap and ask me again. 😊" }]);
    } finally {
      setTalking(false);
    }
  }, [kidId, subject, lessonContext, speak]);

  function learnWithBuck() {
    unlockAudio();
    if (!begun) {
      setBegun(true);
      setBeatIdx(0);
      setTrySelected(null);
      started.current = true;
      setConvo([]);
      // Interactive lessons author the tutor's greeting into the first beat, so
      // speak it verbatim. Derived-readout lessons get the generic opener first.
      // Either way this is a single request, no LLM round-trip.
      const b0 = beats[0];
      if (isLittle && b0?.kind === "try") {
        readPromptAndChoices(b0.say ?? lesson.teach, b0.choices);
      } else {
        const first = b0?.say ?? lesson.teach;
        speak(isInteractive ? first : `${OPENERS[kidId] ?? "Let's learn this together."} ${first}`);
      }
    } else {
      // Re-say the current beat.
      stopAudio();
      cancelChoiceRead();
      const cb = beats[beatIdx];
      if (isLittle && cb?.kind === "try") readPromptAndChoices(cb.say, cb.choices);
      else speak(cb?.say ?? "");
    }
  }

  function nextBeat() {
    if (beatIdx < beats.length - 1) {
      const n = beatIdx + 1;
      setBeatIdx(n);
      setTrySelected(null);
      stopAudio();
      cancelChoiceRead();
      const nb = beats[n];
      if (isLittle && nb?.kind === "try") readPromptAndChoices(nb.say, nb.choices);
      else speak(nb?.say ?? "");
    }
  }

  // Answer the current "try" beat. Deterministic scoring, authored feedback spoken
  // aloud. A child may retry after a wrong tap (we don't lock until they get it).
  function tapTry(idx: number) {
    if (curBeat?.kind !== "try") return;
    if (trySelected === curBeat.correctIndex) return; // already resolved
    setTrySelected(idx);
    cancelChoiceRead();
    stopAudio();
    speak(idx === curBeat.correctIndex ? curBeat.onRight : curBeat.onWrong);
  }

  // Web Speech mic, let the child ask a question out loud, hands-free.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition; // eslint-disable-line @typescript-eslint/no-explicit-any
    if (!SR) return;
    const r = new SR();
    r.continuous = false; r.interimResults = false; r.lang = "en-US";
    r.onresult = (e: any) => { const t = e.results[0]?.[0]?.transcript?.trim(); setListening(false); if (t) sendToTutor(t, false); }; // eslint-disable-line @typescript-eslint/no-explicit-any
    r.onend = () => setListening(false);
    r.onerror = () => setListening(false);
    recognitionRef.current = r;
    return () => { try { r.abort(); } catch { /* noop */ } };
  }, [sendToTutor]);

  function askByVoice() {
    unlockAudio();
    stopAudio();
    try { recognitionRef.current?.start(); setListening(true); } catch { /* already listening */ }
  }

  // Ask by typing — works in every browser (Brave blocks the voice mic).
  function submitAsk() {
    const q = askText.trim();
    if (!q || talking) return;
    setAskText("");
    unlockAudio();
    sendToTutor(q, false);
  }

  // Read each quiz question aloud as it appears, in the tutor's voice, so a child
  // who can't yet read (Mercy, Lois) can still take the quiz. Uses the SAME speak()
  // path as the teaching beats, so a baked prompt plays instantly and free; an
  // un-baked one falls back to live synthesis. Fires only on question change.
  useEffect(() => {
    if (phase !== "quiz") return;
    const q = quiz[qIndex];
    if (q) readPromptAndChoices(q.prompt, q.choices);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, qIndex]);

  const stripMd = (t: string) =>
    t.replace(/\*\*(.+?)\*\*/g, "$1").replace(/\*(.+?)\*/g, "$1").replace(/__(.+?)__/g, "$1").replace(/`(.+?)`/g, "$1");
  const lastTutorMsg = stripMd([...convo].reverse().find((m) => m.role === "assistant")?.content ?? "");
  const hasMic = typeof window !== "undefined" && ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition); // eslint-disable-line @typescript-eslint/no-explicit-any

  function startQuiz() {
    stopAudio();
    setPhase("quiz");
    setQIndex(0);
    setSelected(null);
    setCorrectCount(0);
  }

  function answer(idx: number) {
    if (selected !== null) return;
    cancelChoiceRead();
    stopAudio();
    setSelected(idx);
    if (idx === quiz[qIndex].correctIndex) setCorrectCount((c) => c + 1);
  }

  function next() {
    if (qIndex + 1 < quiz.length) {
      setQIndex((i) => i + 1);
      setSelected(null);
    } else {
      finish();
    }
  }

  function finish() {
    const total = quiz.length;
    const correct = correctCount;
    const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
    const date = new Date().toISOString().slice(0, 10);

    if (!persisted.current) {
      persisted.current = true;
      // Record the attempt either way so the Plan reflects reality.
      saveResult(kidId, subject, {
        lessonId: lesson.id,
        date,
        correct,
        total,
        pct,
        seconds: Math.round((Date.now() - startTime.current) / 1000),
      });
      // Only mastery counts as "done": mark complete, earn coins, queue for Mom.
      if (pct >= MASTERY_PCT) {
        markLessonComplete(kidId, subject, lesson.id);
        queueSignoff({ kidId, subject, lessonId: lesson.id, lessonTitle: lesson.title, date, pct, correct, total });
        // Coins are minted in Homeward (the single family ledger), not locally.
        // Report the lesson with its tier; Homeward credits the coins + splits at payday.
        const minutesEarned = Math.max(0, Math.round((Date.now() - startTime.current) / 60000));
        reportLessonToHomeward({ kid: kidId, subject, lessonId: dailyLessonId(kidId, subject), minutesEarned, lessonTitle: subjectToTitle(subject), tier: (lesson.tier ?? "standard") as LessonTier });
      }
    }
    setPhase("result");
  }

  function retry() {
    persisted.current = false;
    setBegun(false);
    setBeatIdx(0);
    setPhase("teach");
  }

  // A gentle mid-lesson escape hatch. Leaving before the quiz finishes records
  // nothing (results only persist in finish()), so there is NO penalty: the lesson
  // simply stays not-yet-done. Stops the tutor first so it doesn't keep talking.
  const exitButton = (
    <button
      onClick={() => { stopAudio(); router.back(); }}
      aria-label="Leave the lesson and go back to the hub"
      className="flex-shrink-0 text-white font-bold text-sm rounded-full px-3 py-1.5 active:scale-95 transition-transform"
      style={{ background: "rgba(255,255,255,0.22)" }}>
      ✕ Exit
    </button>
  );

  // ─── Result screen ────────────────────────────────────────────────────────
  if (phase === "result") {
    const total = quiz.length;
    const pct = total > 0 ? Math.round((correctCount / total) * 100) : 0;
    const mastered = pct >= MASTERY_PCT;
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 text-center"
        style={{ background: `linear-gradient(160deg, ${colorHex}22, #fff)` }}>
        <div className="text-7xl mb-3">{mastered ? "🎉" : "💪"}</div>
        <h1 className="text-3xl font-black mb-2" style={{ color: colorHex, fontFamily: "Georgia, serif" }}>
          {mastered ? "You mastered it!" : "Not quite yet"}
        </h1>
        <p className="text-lg font-bold mb-1" style={{ color: colorHex }}>
          {correctCount} / {total} correct · {pct}%
        </p>
        <p className="text-sm text-gray-500 mb-6 max-w-xs">
          {mastered
            ? "That's at or above 80%. This lesson is done and sent to Mom to sign off."
            : `Mastery is 80% in our school. Review the lesson with ${tutor.name} and try the quiz again, you've got this.`}
        </p>

        {mastered && (
          <>
            <div className="mb-3 px-5 py-3 rounded-2xl font-black text-base shadow-md"
              style={{ background: "linear-gradient(135deg, #FFFBEB, #FEF3C7)", border: "2px solid #F59E0B", color: "#92400E" }}>
              🪙 +{TIER_META[(lesson.tier ?? "standard") as LessonTier].coins} coins earned, a brain gig!
            </div>
            <div className="mb-6 px-5 py-3 rounded-2xl font-bold text-sm shadow-sm"
              style={{ background: `${colorHex}12`, border: `1.5px solid ${colorHex}30`, color: colorHex }}>
              📋 Sent to Mom for sign-off
            </div>
          </>
        )}

        <div className="flex flex-col gap-3 w-full max-w-xs">
          {!mastered && (
            <>
              <button onClick={retry} className="w-full py-4 rounded-2xl font-black text-white text-lg shadow-lg active:scale-95 transition-transform"
                style={{ backgroundColor: colorHex }}>
                Review & try again
              </button>
            </>
          )}
          <button onClick={() => router.back()}
            className="w-full py-3 rounded-2xl font-bold text-base active:scale-95 transition-transform"
            style={{ backgroundColor: mastered ? colorHex : "transparent", color: mastered ? "#fff" : colorHex, border: mastered ? "none" : `2px solid ${colorHex}55` }}>
            Back to Hub
          </button>
        </div>
      </div>
    );
  }

  // ─── Quiz screen ──────────────────────────────────────────────────────────
  if (phase === "quiz") {
    const q = quiz[qIndex];
    const answered = selected !== null;
    const isCorrect = answered && selected === q.correctIndex;
    return (
      <div className="min-h-screen flex flex-col" style={{ background: `linear-gradient(180deg, ${colorHex}12 0%, #fff 28%)` }}>
        <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 shadow-sm" style={{ backgroundColor: colorHex }}>
          <div className="flex items-center gap-2 text-white">
            <span className="text-2xl">{kid?.emoji ?? "🌟"}</span>
            <div>
              <div className="font-black text-sm leading-none">{lesson.title}</div>
              <div className="text-xs opacity-80">{SUBJECT_LABEL[subject] ?? subjectToTitle(subject)} · quiz</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {timerPill}
            <div className="text-white text-sm font-bold">{qIndex + 1} / {quiz.length}</div>
            {exitButton}
          </div>
        </div>

        <div className="flex-1 flex flex-col max-w-lg mx-auto w-full px-4 py-6 gap-5">
          <p className="text-xl font-bold text-gray-800 text-center px-2">{q.prompt}</p>
          <button onClick={() => readPromptAndChoices(q.prompt, q.choices)}
            className="self-center -mt-2 text-sm font-bold rounded-full px-4 py-1.5 active:scale-95 transition-transform"
            style={{ background: `${colorHex}12`, color: colorHex, border: `1.5px solid ${colorHex}40` }}>
            🔊 Hear it again
          </button>
          <div className="grid grid-cols-2 gap-3">
            {q.choices.map((choice, idx) => {
              let bg = "white", border = `1.5px solid ${colorHex}40`, color = "#1f2937";
              const spoken = !answered && spokenChoice === idx;
              if (answered) {
                if (idx === q.correctIndex) { bg = "#f0fdf4"; border = "2px solid #22c55e"; color = "#15803d"; }
                else if (idx === selected) { bg = "#fef2f2"; border = "2px solid #ef4444"; color = "#dc2626"; }
              } else if (spoken) { bg = `${colorHex}1f`; border = `2.5px solid ${colorHex}`; }
              return (
                <button key={idx} onClick={() => answer(idx)} disabled={answered}
                  className="text-base py-5 px-4 rounded-3xl font-black shadow-sm active:scale-95 transition-all disabled:cursor-default"
                  style={{ backgroundColor: bg, border, color, boxShadow: spoken ? `0 0 0 5px ${colorHex}33` : undefined }}>
                  {choice}
                </button>
              );
            })}
          </div>

          {answered && (
            <div className="rounded-2xl p-4 text-center" style={{ background: isCorrect ? "#f0fdf4" : "#fff7ed", border: `1.5px solid ${isCorrect ? "#22c55e" : "#f59e0b"}55` }}>
              <p className="font-black text-lg mb-1" style={{ color: isCorrect ? "#15803d" : "#b45309" }}>
                {isCorrect ? "✅ Right!" : "🔄 Not quite"}
              </p>
              {q.explanation && <p className="text-sm text-gray-700 leading-relaxed">{q.explanation}</p>}
              <button onClick={next} className="mt-3 px-8 py-3 rounded-2xl font-black text-white text-base shadow-md active:scale-95 transition-transform"
                style={{ backgroundColor: colorHex }}>
                {qIndex + 1 < quiz.length ? "Next →" : "See my score"}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ─── Teach screen, ONE idea at a time (paced), not a wall ──────────────────
  const beat = beats[beatIdx];
  const kindLabel =
    beat?.kind === "example" ? "Example"
    : beat?.kind === "memory" ? "Remember this"
    : beat?.kind === "try" ? "Your turn"
    : "Let's learn";
  return (
    <div className="min-h-screen flex flex-col" style={{ background: `linear-gradient(180deg, ${colorHex}12 0%, #fff 28%)` }}>
      <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 shadow-sm" style={{ backgroundColor: colorHex }}>
        <div className="flex items-center gap-2 text-white">
          <span className="text-2xl">{kid?.emoji ?? "🌟"}</span>
          <div>
            <div className="font-black text-sm leading-none">{lesson.title}</div>
            <div className="text-xs opacity-80">{SUBJECT_LABEL[subject] ?? subjectToTitle(subject)} · lesson</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {timerPill}
          {exitButton}
        </div>
      </div>

      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full px-4 py-5 gap-4">
        {/* Lesson title, front and center at the top */}
        <div>
          <div className="text-xs font-bold uppercase tracking-wider opacity-70" style={{ color: colorHex }}>
            {SUBJECT_LABEL[subject] ?? subjectToTitle(subject)}
          </div>
          <h1 className="text-2xl md:text-3xl font-black leading-tight" style={{ color: colorHex, fontFamily: "Georgia, serif" }}>
            {lesson.title}
          </h1>
        </div>
        {/* Tutor row + play / say-it-again control */}
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center text-3xl shadow-md"
            style={{ backgroundColor: colorHex + "20", border: `2px solid ${colorHex}40` }}>
            {tutor.emoji}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-black text-gray-800 leading-tight">{tutor.name} is teaching</p>
            <p className="text-sm text-gray-500 truncate">{lesson.objective}</p>
          </div>
          <button
            onClick={talking ? undefined : speaking ? pauseAudio : paused ? resumeAudio : learnWithBuck}
            disabled={talking}
            aria-label={speaking ? "Pause" : paused ? "Resume" : begun ? "Say it again" : `Learn it with ${tutor.name}`}
            className="flex-shrink-0 w-20 h-20 rounded-full flex items-center justify-center text-4xl text-white shadow-md active:scale-95 transition-transform disabled:opacity-60"
            style={{ backgroundColor: colorHex }}>
            {talking ? "…" : speaking ? "⏸" : begun ? "🔁" : "▶"}
          </button>
        </div>

        {/* Q&A bubble, only when the child asked a question */}
        {(talking || (begun && lastTutorMsg)) && (
          <div className="rounded-3xl rounded-tl-lg p-4 shadow-sm bg-white" style={{ border: `1.5px solid ${colorHex}30` }}>
            {talking && !lastTutorMsg ? (
              <div className="flex gap-1 items-center py-1">
                <span className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: colorHex }} />
                <span className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: colorHex, animationDelay: "150ms" }} />
                <span className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: colorHex, animationDelay: "300ms" }} />
              </div>
            ) : (
              <p className="text-base text-gray-800 leading-relaxed whitespace-pre-wrap">{lastTutorMsg}</p>
            )}
          </div>
        )}

        {!begun ? (
          /* Start card, nothing dense on screen yet */
          <div className="rounded-3xl p-6 shadow-sm bg-white text-center" style={{ border: `1.5px solid ${colorHex}25` }}>
            <p className="text-base text-gray-600 mb-4">We&apos;ll take this one little step at a time.</p>
            <button onClick={learnWithBuck}
              className="w-full py-4 rounded-2xl font-black text-white text-lg shadow-lg active:scale-95 transition-transform"
              style={{ backgroundColor: colorHex }}>
              ▶ Learn it with {tutor.name}
            </button>
          </div>
        ) : (
          <>
            {beat?.kind === "try" ? (
              /* "Your turn" — inline check with authored, instant feedback */
              <div className="rounded-3xl p-6 shadow-sm flex flex-col gap-4"
                style={{ border: `2px solid ${colorHex}45`, background: `${colorHex}0a` }}>
                <div className="text-xs font-bold uppercase tracking-wide" style={{ color: colorHex }}>
                  ✋ {kindLabel}
                </div>
                <p className="text-xl font-bold text-gray-800 leading-snug">{beat.prompt}</p>
                {beat.visual && (
                  <div className={`rounded-2xl px-4 py-3 text-center leading-none text-gray-800 whitespace-pre-wrap ${(kid?.uiSize === "xlarge" || kid?.uiSize === "large") ? `select-none ${visualSize}` : "font-mono text-lg"}`}
                    style={{ background: "#fff", border: `1.5px dashed ${colorHex}55` }}>
                    {beat.visual}
                  </div>
                )}
                <div className="grid grid-cols-2 gap-3">
                  {beat.choices.map((choice, idx) => {
                    const resolved = trySelected === beat.correctIndex;
                    const spoken = trySelected === null && spokenChoice === idx;
                    let bg = "#fff", border = `1.5px solid ${colorHex}40`, color = "#1f2937";
                    if (trySelected !== null) {
                      if (idx === beat.correctIndex && (idx === trySelected || resolved)) { bg = "#f0fdf4"; border = "2px solid #22c55e"; color = "#15803d"; }
                      else if (idx === trySelected) { bg = "#fef2f2"; border = "2px solid #ef4444"; color = "#dc2626"; }
                    } else if (spoken) { bg = `${colorHex}1f`; border = `2.5px solid ${colorHex}`; }
                    return (
                      <button key={idx} onClick={() => tapTry(idx)} disabled={resolved}
                        className="text-base py-5 px-4 rounded-3xl font-black shadow-sm active:scale-95 transition-all disabled:cursor-default"
                        style={{ backgroundColor: bg, border, color, boxShadow: spoken ? `0 0 0 5px ${colorHex}33` : undefined }}>
                        {choice}
                      </button>
                    );
                  })}
                </div>
                {trySelected !== null && (
                  <div className="rounded-2xl p-4"
                    style={{ background: trySelected === beat.correctIndex ? "#f0fdf4" : "#fff7ed", border: `1.5px solid ${trySelected === beat.correctIndex ? "#22c55e" : "#f59e0b"}55` }}>
                    <p className="font-black text-base mb-1" style={{ color: trySelected === beat.correctIndex ? "#15803d" : "#b45309" }}>
                      {trySelected === beat.correctIndex ? "✅ Yes!" : "🔄 Try once more"}
                    </p>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {trySelected === beat.correctIndex ? beat.onRight : beat.onWrong}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              /* ONE teaching idea on screen at a time */
              <div className="rounded-3xl p-6 shadow-sm min-h-[8rem] flex flex-col justify-center"
                style={{
                  border: `1.5px solid ${beat?.kind === "memory" ? "#c48a1a55" : colorHex + "30"}`,
                  background: beat?.kind === "memory" ? "#fef9ec" : beat?.kind === "example" ? `${colorHex}0a` : "#fff",
                }}>
                <div className="text-xs font-bold uppercase tracking-wide mb-2"
                  style={{ color: beat?.kind === "memory" ? "#b45309" : colorHex }}>
                  {beat?.kind === "memory" ? "🧠 " : beat?.kind === "example" ? "✏️ " : ""}{kindLabel}
                </div>
                {beat && "visual" in beat && beat.visual && (
                  <div className={`text-center leading-none mb-3 select-none ${visualSize}`}>{beat.visual}</div>
                )}
                <p className={`${beatTextSize} text-gray-800 leading-relaxed whitespace-pre-wrap ${kid?.uiSize === "xlarge" || kid?.uiSize === "large" ? "text-center" : ""}`}
                  style={{ fontWeight: beat?.kind === "memory" ? 700 : 400 }}>
                  {beat && "text" in beat ? beat.text : ""}
                </p>
              </div>
            )}

            {/* Progress dots */}
            <div className="flex items-center justify-center gap-1.5">
              {beats.map((_, i) => (
                <span key={i} className="rounded-full transition-all"
                  style={{ width: i === beatIdx ? 20 : 7, height: 7, backgroundColor: i <= beatIdx ? colorHex : `${colorHex}30` }} />
              ))}
            </div>

            {/* Next, or the quiz once every idea has been taught. A "try" check
                must be answered correctly (beatResolved) before moving on. */}
            {!atLastBeat ? (
              <button onClick={nextBeat} disabled={talking || !beatResolved}
                className="w-full py-4 rounded-2xl font-black text-white text-lg shadow-lg active:scale-95 transition-transform disabled:opacity-40"
                style={{ backgroundColor: colorHex }}>
                Next ▸
              </button>
            ) : (
              <button onClick={startQuiz} disabled={!beatResolved}
                className="w-full py-4 rounded-2xl font-black text-white text-lg shadow-lg active:scale-95 transition-transform disabled:opacity-40"
                style={{ backgroundColor: colorHex }}>
                I&apos;m ready, quiz me 🎯
              </button>
            )}
          </>
        )}

        {/* Ask a question — typing works everywhere; the mic is a bonus when supported. */}
        {begun && (
          <div className="flex flex-col gap-2">
            {talking && (
              <p className="text-sm text-center" style={{ color: colorHex }}>{tutor.name} is thinking…</p>
            )}
            {lastTutorMsg && !talking && (
              <div className="rounded-2xl px-4 py-3 text-sm leading-relaxed"
                style={{ background: `${colorHex}0d`, border: `1px solid ${colorHex}25`, color: "#1f2937" }}>
                {lastTutorMsg}
              </div>
            )}
            <div className="flex items-center gap-2">
              <input
                value={askText}
                onChange={(e) => setAskText(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") submitAsk(); }}
                placeholder={`Ask ${tutor.name} a question…`}
                disabled={talking}
                className="flex-1 rounded-2xl px-4 py-3 text-base outline-none disabled:opacity-60"
                style={{ border: `1.5px solid ${colorHex}40` }}
              />
              <button onClick={submitAsk} disabled={talking || !askText.trim()}
                className="rounded-2xl px-5 py-3 font-black text-white active:scale-95 transition-transform disabled:opacity-40"
                style={{ backgroundColor: colorHex }}>
                Ask
              </button>
              {hasMic && (
                <button onClick={askByVoice} disabled={listening || talking}
                  aria-label={`Ask ${tutor.name} by voice`}
                  className="rounded-2xl px-3 py-3 font-bold active:scale-95 transition-transform disabled:opacity-60"
                  style={{ backgroundColor: `${colorHex}12`, color: colorHex, border: `1.5px solid ${colorHex}40` }}>
                  {listening ? "🎤…" : "🎤"}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
