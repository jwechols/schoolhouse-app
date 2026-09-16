"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useTTS, OPENAI_VOICE } from "@/lib/tts";
import { useRouter } from "next/navigation";
import { KIDS } from "@/lib/kids";
import type { KidId } from "@/lib/kids";
import type { LessonTurnRequest } from "@/app/api/lesson/route";
import { reportLessonToHomeward, subjectToTitle, dailyLessonId, TIER_META, tierForDuration, type LessonTier } from "@/lib/homeward";
import { getCourse } from "@/lib/curriculum-spine";
import { courseProgress, markLessonComplete } from "@/lib/curriculum-spine/progress";
import { saveResult } from "@/lib/curriculum-spine/results";
import { courseSequence } from "@/lib/curriculum-spine/types";
import type { SpineLesson } from "@/lib/curriculum-spine/types";

// Randomize choice order so the correct answer isn't always in the same slot.
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface Question {
  text: string;
  choices: string[];
  correct_index: number;
  concept: string;
  difficulty: number;
}

interface CatechismCmd {
  question: string;
  answer: string;
}

interface VerseCmd {
  reference: string;
  text: string;
}

interface VisualCmd {
  emoji: string;
  caption: string;
}

interface EndLessonCmd {
  summary: string;
  review_concepts: string[];
}

type LessonPhase = "loading" | "teach_intro" | "speaking" | "waiting_answer" | "catechism_reveal" | "teach_ready" | "done";

interface LessonState {
  phase: LessonPhase;
  currentText: string;
  pendingQuestion: Question | null;
  pendingVerse: VerseCmd | null;
  pendingCatechism: CatechismCmd | null;
  catechismRevealed: boolean;
  pendingVisual: VisualCmd | null;
  endLesson: EndLessonCmd | null;
  turnNumber: number;
  weaknessMap: Record<string, number>;
  sessionHistory: Array<{ role: "user" | "assistant"; content: string }>;
  timeRemaining: number;
  lastAssistantText: string;
}

interface Props {
  kidId: string;
  subject: string;
  durationMinutes: number;
  parentNotes: string;
  /** Teach this specific spine lesson (a-la-carte / Mom-chosen). Omit to teach
   *  the kid's current lesson in the sequence. */
  lessonId?: string;
  /** Coin tier the child picked in the length menu. Omit → derived from durationMinutes. */
  tier?: LessonTier;
}

// ─── Kid tutor config ─────────────────────────────────────────────────────────

const TUTOR_AVATARS: Record<string, { name: string; emoji: string }> = {
  titus:  { name: "Buck",    emoji: "🎣" },
  mercy:  { name: "Princess Rose",    emoji: "🌹" },
  lois:   { name: "Princess Crystal", emoji: "❄️" },
  truma:  { name: "Lydia",  emoji: "🪻" },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function parseCommands(text: string): {
  cleanText: string;
  commands: Array<{ type: string; [key: string]: unknown }>;
} {
  const lines = text.split("\n");
  const cleanLines: string[] = [];
  const commands: Array<{ type: string; [key: string]: unknown }> = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("[CMD:") && trimmed.endsWith("]")) {
      try {
        const jsonStr = trimmed.slice(5, -1);
        const cmd = JSON.parse(jsonStr);
        commands.push(cmd);
      } catch {
        cleanLines.push(line);
      }
    } else {
      cleanLines.push(line);
    }
  }

  return { cleanText: cleanLines.join("\n").trim(), commands };
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function LessonConductor({ kidId, subject, durationMinutes, parentNotes, lessonId, tier }: Props) {
  const router = useRouter();
  const kid = KIDS[kidId as KidId];
  const tutor = TUTOR_AVATARS[kidId] ?? { name: "Buck", emoji: "🎣" };
  const { speak: ttsSpeak, unlockAudio } = useTTS(OPENAI_VOICE[kidId] ?? "nova");

  const [state, setState] = useState<LessonState>({
    phase: "loading",
    currentText: "",
    pendingQuestion: null,
    pendingVerse: null,
    pendingCatechism: null,
    catechismRevealed: false,
    pendingVisual: null,
    endLesson: null,
    turnNumber: 0,
    weaknessMap: {},
    sessionHistory: [],
    timeRemaining: durationMinutes * 60,
    lastAssistantText: "",
  });

  const [typedAnswer, setTypedAnswer] = useState("");
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [answerFeedback, setAnswerFeedback] = useState<"correct" | "incorrect" | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [earnedCoins, setEarnedCoins] = useState(0);
  // The curriculum-spine lesson this session teaches (if the subject has a course).
  // Captured once so it stays stable across turns; marked complete when the lesson ends.
  const spineLessonRef = useRef<SpineLesson | null>(null);
  // Two-phase lesson: the tutor GUIDES the teaching module first, then the mastery quiz.
  const lessonModeRef = useRef<"teach" | "assess">("teach");
  // How many teaching segments have been delivered this lesson. The quiz stays
  // locked until the tutor has really taught (MIN_TEACH_SEGMENTS below), so a
  // lesson is a taught lesson, not one paragraph then a quiz.
  const [teachTurns, setTeachTurns] = useState(0);
  const correctRef = useRef(0);  // graded questions answered correctly this session
  const gradedRef = useRef(0);   // graded (multiple-choice) questions answered

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const recognitionRef = useRef<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any
  const speechBubbleRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const streamedAssistantText = useRef("");
  const lessonStartTime = useRef<number>(Date.now());
  const homewardReported = useRef(false);

  // ── Timer ────────────────────────────────────────────────────────────────────

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setState((prev) => {
        if (prev.phase === "done") return prev;
        const next = prev.timeRemaining - 1;
        if (next <= 0) {
          clearInterval(timerRef.current!);
          return { ...prev, timeRemaining: 0 };
        }
        return { ...prev, timeRemaining: next };
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // ── Homeward gig credit, fire once when lesson completes ───────────────────
  useEffect(() => {
    if (state.phase !== "done" || homewardReported.current) return;
    homewardReported.current = true;
    // Record the score (so Mom sees how they did, not just that they finished)
    // and mark the spine lesson complete so the Plan advances.
    if (spineLessonRef.current) {
      const total = gradedRef.current;
      const correct = correctRef.current;
      saveResult(kidId, subject, {
        lessonId: spineLessonRef.current.id,
        date: new Date().toISOString().slice(0, 10),
        correct,
        total,
        pct: total > 0 ? Math.round((correct / total) * 100) : 0,
        seconds: Math.round((Date.now() - lessonStartTime.current) / 1000),
      });
      markLessonComplete(kidId, subject, spineLessonRef.current.id);
    }
    // Coins are minted in Homeward (the single family ledger), not locally. The tier
    // the child picked (or the session length) sets the coins; report it so Homeward
    // credits them and splits give/tax/save/spend at payday.
    const lessonTier: LessonTier = tier ?? tierForDuration(durationMinutes);
    const elapsedSeconds = Math.round((Date.now() - lessonStartTime.current) / 1000);
    const minutesEarned = Math.round(elapsedSeconds / 60);
    if (minutesEarned >= 5) setEarnedCoins(TIER_META[lessonTier].coins);
    reportLessonToHomeward({
      kid: kidId,
      subject,
      lessonId: dailyLessonId(kidId, subject),
      minutesEarned,
      lessonTitle: subjectToTitle(subject),
      tier: lessonTier,
    });
  }, [state.phase, kidId, subject]);

  // ── Speech synthesis ─────────────────────────────────────────────────────────

  const speakText = useCallback((text: string, onEnd?: () => void) => {
    if (!text.trim()) return;
    ttsSpeak(text, onEnd);
  }, [ttsSpeak]);

  // ── Send a turn to the lesson engine ────────────────────────────────────────

  const sendTurn = useCallback(
    async (opts: {
      kidAnswer?: string;
      lastConcept?: string;
      lastCorrect?: boolean;
    }) => {
      setIsStreaming(true);
      streamedAssistantText.current = "";

      setState((prev) => ({
        ...prev,
        phase: "speaking",
        currentText: "",
        pendingQuestion: null,
        pendingVerse: null,
        pendingCatechism: null,
        catechismRevealed: false,
        pendingVisual: null,
        selectedChoice: null,
      }));

      setSelectedChoice(null);
      setAnswerFeedback(null);

      // Follow the curriculum spine: teach the kid's CURRENT lesson for this subject.
      if (!spineLessonRef.current) {
        const course = getCourse(kidId, subject);
        if (course) {
          spineLessonRef.current = lessonId
            ? courseSequence(course).find((l) => l.id === lessonId) ?? courseProgress(course).current
            : courseProgress(course).current;
        }
      }
      const sl = spineLessonRef.current;
      const notes = sl
        ? `${parentNotes ? parentNotes + " " : ""}FOLLOW THE CURRICULUM, teach this specific lesson now: "${sl.title}". Objective: ${sl.objective} Teaching content: ${sl.teach}${sl.memoryWork ? ` Memory work to reinforce: ${sl.memoryWork}` : ""}`
        : parentNotes;

      const request: LessonTurnRequest = {
        kidId,
        subject,
        duration_minutes: durationMinutes,
        parent_notes: notes,
        session_history: state.sessionHistory,
        weakness_map: state.weaknessMap,
        turn_number: state.turnNumber,
        kid_answer: opts.kidAnswer,
        last_concept: opts.lastConcept,
        last_correct: opts.lastCorrect,
        phase: lessonModeRef.current,
      };

      try {
        const res = await fetch("/api/lesson", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(request),
        });

        if (!res.ok || !res.body) {
          setState((prev) => ({
            ...prev,
            phase: "waiting_answer",
            currentText: "Oops, I had a hiccup! Try tapping the button again.",
          }));
          setIsStreaming(false);
          return;
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let accumulated = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          accumulated += chunk;

          // Parse as we go, update the display text (strip CMD lines). We do NOT
          // speak per chunk anymore: that fired many overlapping TTS calls that
          // talked over each other. The whole turn is spoken ONCE after the stream.
          const { cleanText } = parseCommands(accumulated);
          setState((prev) => ({ ...prev, currentText: cleanText }));
        }

        // Final parse, extract all commands, then speak the whole turn ONCE.
        const { cleanText: finalText, commands } = parseCommands(accumulated);
        streamedAssistantText.current = accumulated;
        if (finalText.trim()) speakText(finalText);

        // Process commands
        let newQuestion: Question | null = null;
        let newVerse: VerseCmd | null = null;
        let newCatechism: CatechismCmd | null = null;
        let newVisual: VisualCmd | null = null;
        let endCmd: EndLessonCmd | null = null;
        const newWeaknessMap = { ...state.weaknessMap };

        for (const cmd of commands) {
          if (cmd.type === "question") {
            // Shuffle choices and remap the correct index so the answer isn't
            // predictably in the same position.
            const rawChoices = cmd.choices as string[];
            const correctText = rawChoices[cmd.correct_index as number];
            const shuffledChoices = shuffle(rawChoices);
            newQuestion = {
              text: cmd.text as string,
              choices: shuffledChoices,
              correct_index: Math.max(0, shuffledChoices.indexOf(correctText)),
              concept: cmd.concept as string,
              difficulty: (cmd.difficulty as number) ?? 1,
            };
          } else if (cmd.type === "catechism") {
            newCatechism = {
              question: cmd.question as string,
              answer: cmd.answer as string,
            };
          } else if (cmd.type === "verse") {
            newVerse = {
              reference: cmd.reference as string,
              text: cmd.text as string,
            };
          } else if (cmd.type === "visual") {
            newVisual = {
              emoji: cmd.emoji as string,
              caption: cmd.caption as string,
            };
          } else if (cmd.type === "end_lesson") {
            endCmd = {
              summary: cmd.summary as string,
              review_concepts: (cmd.review_concepts as string[]) ?? [],
            };
          } else if (cmd.type === "record_weakness") {
            const conceptId = cmd.concept_id as string;
            newWeaknessMap[conceptId] = (newWeaknessMap[conceptId] ?? 0) + 1;
          }
        }

        // Determine new phase
        let newPhase: LessonPhase = "waiting_answer";
        if (endCmd) newPhase = "done";
        else if (newQuestion) newPhase = "waiting_answer";
        else if (newCatechism) newPhase = "catechism_reveal";
        // Teaching phase produced no question/end → show the "ready to be quizzed" gate.
        else if (lessonModeRef.current === "teach") newPhase = "teach_ready";
        // Count each delivered teaching segment so the quiz stays locked until the
        // tutor has really taught.
        if (newPhase === "teach_ready") setTeachTurns((n) => n + 1);

        // Build user message that was sent
        const turnUserMsg =
          state.turnNumber === 0
            ? `[START LESSON] Subject: ${subject}.`
            : opts.kidAnswer !== undefined
            ? `[KID ANSWERED: ${opts.lastCorrect ? "CORRECT" : "INCORRECT"}] Concept: "${opts.lastConcept ?? ""}". Answer: "${opts.kidAnswer}".`
            : `[CONTINUE LESSON] Turn ${state.turnNumber}.`;

        setState((prev) => ({
          ...prev,
          phase: newPhase,
          currentText: finalText,
          pendingQuestion: newQuestion,
          pendingVerse: newVerse,
          pendingCatechism: newCatechism,
          catechismRevealed: false,
          pendingVisual: newVisual,
          endLesson: endCmd,
          weaknessMap: newWeaknessMap,
          turnNumber: prev.turnNumber + 1,
          sessionHistory: [
            ...prev.sessionHistory,
            { role: "user", content: turnUserMsg },
            { role: "assistant", content: accumulated },
          ],
          lastAssistantText: accumulated,
        }));
      } catch (err) {
        console.error("sendTurn error:", err);
        setState((prev) => ({
          ...prev,
          phase: "waiting_answer",
          currentText: "Something went wrong, let's try again!",
        }));
      } finally {
        setIsStreaming(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [kidId, subject, durationMinutes, parentNotes, lessonId, state.sessionHistory, state.weaknessMap, state.turnNumber, speakText]
  );

  // ── Start lesson on mount ────────────────────────────────────────────────────

  useEffect(() => {
    // FAST OPEN: speak the lesson's authored teaching text immediately instead of
    // waiting for the AI to compose an intro. The AI is only called when the kid
    // taps "quiz me" (assess phase). Falls back to the AI teach turn only if this
    // subject has no authored spine lesson.
    if (!spineLessonRef.current) {
      const course = getCourse(kidId, subject);
      if (course) {
        spineLessonRef.current = lessonId
          ? courseSequence(course).find((l) => l.id === lessonId) ?? courseProgress(course).current
          : courseProgress(course).current;
      }
    }
    const sl = spineLessonRef.current;
    if (sl && sl.teach) {
      // Show the teaching text and wait for a Play tap. The tap is the iOS audio
      // gesture (the real lag fix) and starts the lesson. No canned opener.
      setState((prev) => ({
        ...prev,
        phase: "teach_intro",
        currentText: sl.teach,
        turnNumber: 1,
        sessionHistory: [
          { role: "user", content: `[START LESSON] Subject: ${subject}.` },
          { role: "assistant", content: sl.teach },
        ],
      }));
    } else {
      sendTurn({});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Auto-scroll speech bubble ────────────────────────────────────────────────

  useEffect(() => {
    if (speechBubbleRef.current) {
      // Show new teaching from the TOP so the kid reads from the beginning,
      // instead of being scrolled to the bottom of the passage.
      speechBubbleRef.current.scrollTop = 0;
    }
  }, [state.currentText]);

  // ── Speech recognition setup ─────────────────────────────────────────────────

  useEffect(() => {
    if (typeof window === "undefined") return;
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition; // eslint-disable-line @typescript-eslint/no-explicit-any
    if (!SpeechRecognition) return;

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = "en-US";

    recognitionRef.current.onresult = (event: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
      const transcript = event.results[0][0].transcript;
      setTypedAnswer(transcript);
      // Auto-submit voice answer after brief delay
      setTimeout(() => {
        if (transcript.trim()) {
          handleFreeformSubmit(transcript.trim());
        }
      }, 500);
    };

    return () => {
      recognitionRef.current?.abort();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Handle multiple-choice answer ───────────────────────────────────────────

  function handleChoiceClick(choiceIndex: number) {
    if (!state.pendingQuestion || isStreaming) return;
    const correct = choiceIndex === state.pendingQuestion.correct_index;
    gradedRef.current += 1;
    if (correct) correctRef.current += 1;
    setSelectedChoice(choiceIndex);
    setAnswerFeedback(correct ? "correct" : "incorrect");

    // Update weakness map immediately for wrong answers
    if (!correct) {
      setState((prev) => ({
        ...prev,
        weaknessMap: {
          ...prev.weaknessMap,
          [state.pendingQuestion!.concept]:
            (prev.weaknessMap[state.pendingQuestion!.concept] ?? 0) + 1,
        },
      }));
    }

    // Delay before sending next turn so kid sees feedback
    setTimeout(() => {
      sendTurn({
        kidAnswer: state.pendingQuestion!.choices[choiceIndex],
        lastConcept: state.pendingQuestion!.concept,
        lastCorrect: correct,
      });
    }, correct ? 1000 : 1800);
  }

  // ── Handle freeform text/voice submit ────────────────────────────────────────

  function handleFreeformSubmit(answer?: string) {
    const ans = (answer ?? typedAnswer).trim();
    if (!ans || isStreaming) return;
    setTypedAnswer("");
    sendTurn({ kidAnswer: ans, lastConcept: state.pendingCatechism?.question });
  }

  // ── Continue button (no question pending) ────────────────────────────────────

  function handleContinue() {
    if (isStreaming) return;
    sendTurn({});
  }

  // Kid finished the teaching module and is ready for the mastery quiz.
  function handleStartQuiz() {
    if (isStreaming) return;
    lessonModeRef.current = "assess";
    sendTurn({});
  }

  // ▶ Play: the kid's tap is the iOS audio gesture, so the voice starts reliably
  // and right away instead of being blocked or delayed on mount.
  function handleStartLesson() {
    unlockAudio();
    const sl = spineLessonRef.current;
    if (sl?.teach) speakText(sl.teach);
    setTeachTurns(1); // the authored teach is segment 1
    setState((prev) => ({ ...prev, phase: "teach_ready" }));
  }

  // ── Mic button ────────────────────────────────────────────────────────────────

  function handleMicClick() {
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.start();
    } catch {
      // Already started, ignore
    }
  }

  // ── Catechism reveal ──────────────────────────────────────────────────────────

  function handleCatechismReveal() {
    setState((prev) => ({ ...prev, catechismRevealed: true }));
    if (state.pendingCatechism) {
      speakText(state.pendingCatechism.answer);
    }
  }

  // ─── Render helpers ──────────────────────────────────────────────────────────

  const isXLarge = kid?.uiSize === "xlarge";
  const isLarge = kid?.uiSize === "large" || isXLarge;

  // Truma isn't in the KIDS record (she uses the Hub, not /kids/[kid])
  // Provide her color and emoji manually as fallback
  const TRUMA_DEFAULTS = { colorHex: "#1b3a6b", emoji: "📖", name: "Truma" };
  const colorHex = kid?.colorHex ?? (kidId === "truma" ? TRUMA_DEFAULTS.colorHex : "#2563eb");

  const textSizeClass = isXLarge
    ? "text-2xl"
    : isLarge
    ? "text-xl"
    : "text-lg";

  const buttonSizeClass = isXLarge
    ? "text-2xl py-6 px-4"
    : isLarge
    ? "text-xl py-5 px-4"
    : "text-base py-4 px-4";

  // ─── Done screen ─────────────────────────────────────────────────────────────

  if (state.phase === "done" && state.endLesson) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center px-6 py-12 text-center"
        style={{ background: `linear-gradient(160deg, ${colorHex}22, #fff)` }}
      >
        <div className="text-8xl mb-4">{tutor.emoji}</div>
        <h1
          className="text-4xl font-black mb-3"
          style={{ color: colorHex, fontFamily: "Georgia, serif" }}
        >
          Lesson Complete!
        </h1>
        <p className="text-lg text-gray-700 mb-6 max-w-sm leading-relaxed">
          {state.endLesson.summary}
        </p>
        {state.endLesson.review_concepts.length > 0 && (
          <div className="bg-white rounded-2xl p-5 shadow-md mb-6 max-w-sm w-full text-left">
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-2">
              Review these concepts:
            </p>
            <ul className="space-y-1">
              {state.endLesson.review_concepts.map((c) => (
                <li key={c} className="text-sm text-gray-700">
                  • {c}
                </li>
              ))}
            </ul>
          </div>
        )}
        {earnedCoins > 0 && (
          <div className="mb-6 px-5 py-3 rounded-2xl font-black text-base shadow-md"
            style={{ background: "linear-gradient(135deg, #FFFBEB, #FEF3C7)", border: "2px solid #F59E0B", color: "#92400E" }}>
            🪙 +{earnedCoins} coins earned, a brain gig!
          </div>
        )}
        <button
          onClick={() => router.back()}
          className="px-8 py-4 rounded-2xl font-black text-white text-lg shadow-lg"
          style={{ backgroundColor: colorHex }}
        >
          Back to Hub
        </button>
      </div>
    );
  }

  // ─── Main lesson UI ───────────────────────────────────────────────────────────

  const timerPct = Math.round((state.timeRemaining / (durationMinutes * 60)) * 100);

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: `linear-gradient(180deg, ${colorHex}15 0%, #ffffff 30%)` }}
    >
      {/* Header bar */}
      <div
        className="sticky top-0 z-20 flex items-center justify-between px-4 py-3 shadow-sm"
        style={{ backgroundColor: colorHex }}
      >
        <div className="flex items-center gap-2 text-white">
          <span className="text-2xl">{kid?.emoji ?? (kidId === "truma" ? TRUMA_DEFAULTS.emoji : "🌟")}</span>
          <div>
            <div className="font-black text-sm leading-none">{spineLessonRef.current?.title ?? (kid?.name ?? (kidId === "truma" ? TRUMA_DEFAULTS.name : kidId))}</div>
            <div className="text-xs opacity-80">{subjectToTitle(subject)} · lesson</div>
          </div>
        </div>

        {/* Timer */}
        <div className="flex items-center gap-2 text-white">
          <div className="text-sm font-bold">{formatTime(state.timeRemaining)}</div>
          <div className="w-16 h-2 bg-white/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-1000"
              style={{ width: `${timerPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col max-w-lg md:max-w-2xl mx-auto w-full px-4 pb-4 pt-4 gap-4">

        {/* Tutor avatar + speech bubble */}
        <div className="flex items-start gap-3">
          <div
            className="flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center text-3xl shadow-md"
            style={{ backgroundColor: colorHex + "20", border: `2px solid ${colorHex}40` }}
          >
            {tutor.emoji}
          </div>

          <div
            ref={speechBubbleRef}
            className="flex-1 rounded-3xl rounded-tl-lg p-4 shadow-sm max-h-48 overflow-y-auto"
            style={{
              backgroundColor: "white",
              border: `1.5px solid ${colorHex}30`,
              minHeight: "4rem",
            }}
          >
            {state.phase === "loading" || (isStreaming && !state.currentText) ? (
              <div className="flex gap-1 items-center py-1">
                <span className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: colorHex, animationDelay: "0ms" }} />
                <span className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: colorHex, animationDelay: "150ms" }} />
                <span className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: colorHex, animationDelay: "300ms" }} />
              </div>
            ) : (
              <p className={`${textSizeClass} text-gray-800 leading-relaxed whitespace-pre-wrap`}>
                {state.currentText}
                {isStreaming && (
                  <span className="inline-block w-1 h-5 ml-0.5 rounded animate-pulse" style={{ backgroundColor: colorHex }} />
                )}
              </p>
            )}
          </div>
        </div>

        {/* Visual panel */}
        {state.pendingVisual && (
          <div
            className="rounded-3xl p-5 text-center shadow-sm"
            style={{ backgroundColor: colorHex + "10", border: `1.5px solid ${colorHex}25` }}
          >
            <div className="text-5xl mb-2 tracking-widest">{state.pendingVisual.emoji}</div>
            <p className="text-sm text-gray-600 font-medium">{state.pendingVisual.caption}</p>
          </div>
        )}

        {/* ▶ Start the lesson — the tap unlocks iOS audio so the voice plays right away */}
        {state.phase === "teach_intro" && (
          <div className="rounded-3xl p-5 shadow-md text-center" style={{ backgroundColor: colorHex + "0d", border: `1.5px solid ${colorHex}30` }}>
            <button
              onClick={handleStartLesson}
              className="w-full py-5 rounded-2xl font-black text-white text-xl shadow-md active:scale-95 transition-transform"
              style={{ backgroundColor: colorHex }}
            >
              ▶ Start the lesson
            </button>
          </div>
        )}

        {/* Teach → Quiz gate: shown after the tutor has guided the teaching module */}
        {state.phase === "teach_ready" && (
          <div
            className="rounded-3xl p-5 shadow-md text-center"
            style={{ backgroundColor: colorHex + "0d", border: `1.5px solid ${colorHex}30` }}
          >
            {spineLessonRef.current?.memoryWork && (
              <div className="mb-4">
                <div className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-1">
                  🧠 Remember this
                </div>
                <p className={`${textSizeClass} font-bold text-gray-800`}>
                  {spineLessonRef.current.memoryWork}
                </p>
              </div>
            )}
            {teachTurns < 3 ? (
              <button
                onClick={handleContinue}
                disabled={isStreaming}
                className="w-full py-4 rounded-2xl font-black text-white text-lg shadow-md active:scale-95 transition-transform disabled:opacity-50"
                style={{ backgroundColor: colorHex }}
              >
                Keep teaching me! ➡️
              </button>
            ) : (
              <>
                <button
                  onClick={handleStartQuiz}
                  disabled={isStreaming}
                  className="w-full py-4 rounded-2xl font-black text-white text-lg shadow-md active:scale-95 transition-transform disabled:opacity-50"
                  style={{ backgroundColor: colorHex }}
                >
                  I&apos;m ready, quiz me! 🎯
                </button>
                <button
                  onClick={handleContinue}
                  disabled={isStreaming}
                  className="mt-3 text-sm font-bold underline disabled:opacity-50"
                  style={{ color: colorHex }}
                >
                  teach me more first
                </button>
              </>
            )}
          </div>
        )}

        {/* Catechism card */}
        {state.pendingCatechism && (
          <div
            className="rounded-3xl p-5 shadow-md"
            style={{ backgroundColor: "#fef9ec", border: "1.5px solid #c48a1a40" }}
          >
            <div className="text-xs font-bold uppercase tracking-wide text-amber-700 mb-2">
              ✝️ Catechism
            </div>
            <p className={`${textSizeClass} font-bold text-gray-800 mb-3`}>
              Q: {state.pendingCatechism.question}
            </p>
            {state.catechismRevealed ? (
              <div
                className="rounded-2xl p-3 text-center"
                style={{ backgroundColor: "#c48a1a15" }}
              >
                <p className={`${textSizeClass} font-black`} style={{ color: "#c48a1a" }}>
                  A: {state.pendingCatechism.answer}
                </p>
                <p className="text-sm text-amber-700 mt-2">Say it out loud! 🗣️</p>
                <button
                  onClick={handleContinue}
                  className="mt-3 px-6 py-2 rounded-2xl font-bold text-white text-sm"
                  style={{ backgroundColor: "#c48a1a" }}
                >
                  I said it! Continue →
                </button>
              </div>
            ) : (
              <button
                onClick={handleCatechismReveal}
                className="w-full py-3 rounded-2xl font-bold text-white"
                style={{ backgroundColor: "#c48a1a" }}
              >
                Tap to see the answer
              </button>
            )}
          </div>
        )}

        {/* Verse card */}
        {state.pendingVerse && (
          <div
            className="rounded-3xl p-5 shadow-md"
            style={{ backgroundColor: "#f0fdf4", border: "1.5px solid #2d6a4f40" }}
          >
            <div className="text-xs font-bold uppercase tracking-wide text-green-700 mb-2">
              📖 Memory Verse
            </div>
            <p className="text-sm font-bold text-green-700 mb-1">{state.pendingVerse.reference}</p>
            <p className={`${textSizeClass} text-gray-800 italic leading-relaxed mb-3`}>
              &ldquo;{state.pendingVerse.text}&rdquo;
            </p>
            <p className="text-sm text-green-700 font-medium">Say it with me! 🗣️</p>
            <button
              onClick={handleContinue}
              className="mt-3 px-6 py-2 rounded-2xl font-bold text-white text-sm"
              style={{ backgroundColor: "#2d6a4f" }}
            >
              I said it! Continue →
            </button>
          </div>
        )}

        {/* Multiple-choice question panel */}
        {state.pendingQuestion && !isStreaming && (
          <div className="flex flex-col gap-3">
            <p className={`${textSizeClass} font-bold text-gray-800 text-center px-2`}>
              {state.pendingQuestion.text}
            </p>
            <div className="grid grid-cols-2 gap-3">
              {state.pendingQuestion.choices.map((choice, idx) => {
                let bg = "white";
                let border = `1.5px solid ${colorHex}40`;
                let textColor = "#1f2937";

                if (selectedChoice !== null) {
                  if (idx === state.pendingQuestion!.correct_index) {
                    bg = "#f0fdf4";
                    border = "2px solid #22c55e";
                    textColor = "#15803d";
                  } else if (idx === selectedChoice) {
                    bg = "#fef2f2";
                    border = "2px solid #ef4444";
                    textColor = "#dc2626";
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleChoiceClick(idx)}
                    disabled={selectedChoice !== null}
                    className={`${buttonSizeClass} rounded-3xl font-black shadow-sm hover:shadow-md active:scale-95 transition-all duration-150 disabled:cursor-not-allowed`}
                    style={{ backgroundColor: bg, border, color: textColor }}
                  >
                    {choice}
                  </button>
                );
              })}
            </div>

            {/* Answer feedback */}
            {answerFeedback && (
              <div
                className={`text-center py-3 rounded-2xl font-black text-lg ${
                  answerFeedback === "correct" ? "text-green-700 bg-green-50" : "text-red-700 bg-red-50"
                }`}
              >
                {answerFeedback === "correct"
                  ? "✅ Great work!"
                  : "🔄 Not quite, let's try again!"}
              </div>
            )}
          </div>
        )}

        {/* Continue button (when no question/catechism is pending and not streaming) */}
        {!isStreaming &&
          !state.pendingQuestion &&
          !state.pendingCatechism &&
          !state.pendingVerse &&
          state.phase === "waiting_answer" && (
            <button
              onClick={handleContinue}
              className={`w-full ${buttonSizeClass} rounded-3xl font-black text-white shadow-lg hover:shadow-xl active:scale-95 transition-all`}
              style={{ backgroundColor: colorHex }}
            >
              Continue →
            </button>
          )}
      </div>

      {/* Input row */}
      {!state.pendingQuestion && state.phase !== "done" && (
        <div
          className="sticky bottom-0 z-10 flex items-center gap-3 px-4 py-4 border-t"
          style={{ backgroundColor: "white", borderColor: colorHex + "20" }}
        >
          {/* Mic button */}
          <button
            onClick={handleMicClick}
            className="flex-shrink-0 w-12 h-12 rounded-full shadow-md flex items-center justify-center text-2xl hover:scale-105 active:scale-95 transition-all"
            style={{ backgroundColor: colorHex + "15", border: `2px solid ${colorHex}30` }}
            title="Speak your answer"
          >
            🎤
          </button>

          {/* Text input */}
          <input
            ref={inputRef}
            type="text"
            value={typedAnswer}
            onChange={(e) => setTypedAnswer(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleFreeformSubmit();
            }}
            placeholder="Type your answer…"
            className={`flex-1 rounded-2xl border px-4 py-3 ${isLarge ? "text-xl" : "text-base"} focus:outline-none focus:ring-2`}
            style={{
              borderColor: colorHex + "40",
              // @ts-expect-error CSS variable
              "--tw-ring-color": colorHex,
            }}
            disabled={isStreaming}
          />

          <button
            onClick={() => handleFreeformSubmit()}
            disabled={!typedAnswer.trim() || isStreaming}
            className="flex-shrink-0 w-12 h-12 rounded-full shadow-md flex items-center justify-center text-xl font-black text-white disabled:opacity-40 hover:scale-105 active:scale-95 transition-all"
            style={{ backgroundColor: colorHex }}
          >
            →
          </button>
        </div>
      )}
    </div>
  );
}
