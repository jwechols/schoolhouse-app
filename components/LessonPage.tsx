"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { KidProfile } from "@/lib/kids";
import type { SubjectCurriculum, CurriculumQuestion } from "@/lib/curriculum";
import KidTutorChat from "@/components/KidTutorChat";
import { burstConfetti } from "@/lib/confetti";
import { addXP, recordSession, checkBadges } from "@/lib/progress";
import { playCorrect, playWrong } from "@/lib/sounds";
import { useTTS, OPENAI_VOICE } from "@/lib/tts";
import { recordAnswer, loadMastery, getMasteryPct } from "@/lib/adaptive-learning";
import { reportLessonToHomeward, dailyLessonId } from "@/lib/homeward";

interface Props {
  profile: KidProfile;
  curriculum: SubjectCurriculum;
}

const QUESTIONS_PER_LESSON = 3;
const XP_PER_CORRECT = 20;

// EVERY subject is AI-generated now, mastery-calibrated, fresh each session.
// The static curriculum questions are the offline/failure fallback (shuffled,
// so even the fallback isn't the same 3 questions forever).
const isDynamic = true;

// Rolling accuracy for this kid+subject from the adaptive store (null = no data yet)
function subjectMasteryPct(kidId: string, subject: string): number | null {
  try {
    const rec = loadMastery(kidId)[subject];
    if (!rec || rec.total < 3) return null;
    return getMasteryPct(rec);
  } catch { return null; }
}

function assessLevelFor(kidId: string): string | null {
  try {
    const raw = localStorage.getItem(`assessment-${kidId}`);
    return raw ? (JSON.parse(raw)?.level ?? null) : null;
  } catch { return null; }
}

function shuffled<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type Phase = "concept" | "playing" | "feedback" | "done" | "generating";

export default function LessonPage({ profile, curriculum }: Props) {
  const router = useRouter();
  // Truma's hub is /hub (she's not in KidId, her track pages pass a cast profile)
  const hubPath = (profile.id as string) === "truma" ? "/hub" : `/kids/${profile.id}/hub`;

  const [phase, setPhase] = useState<Phase>(isDynamic ? "generating" : "concept");
  const [current, setCurrent] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [showTutor, setShowTutor] = useState(false);
  const [shake, setShake] = useState(false);
  const [visible, setVisible] = useState(true); // fade transition
  const [xpDisplay, setXpDisplay] = useState(0); // animated count-up on done screen
  const [sessionCount, setSessionCount] = useState(0); // how many explore-more rounds done
  // iOS Safari TTS unlock overlay, shown to Lois + Mercy until they tap the 🔊 button
  const [ttsUnlockDone, setTtsUnlockDone] = useState(false);

  // Dynamic question state
  const [dynQuestions, setDynQuestions] = useState<CurriculumQuestion[]>([]);
  const [dynError, setDynError] = useState(false);

  const questionCardRef  = useRef<HTMLDivElement>(null);
  // OpenAI TTS via the shared hook. unlockAudio() must run inside a user-gesture
  // handler (the 🔊 overlay button or the first answer tap) to satisfy iOS Safari.
  const { speak, unlockAudio, stopAudio } = useTTS(OPENAI_VOICE[profile.id] ?? "nova");

  const isXLarge = profile.uiSize === "xlarge";
  const isLarge = profile.uiSize === "large" || isXLarge;

  const autoSpeak = isXLarge || isLarge; // Lois + Mercy get auto-TTS

  // Static fallback set, shuffled once per mount so repeats vary. Also shuffle each
  // question's choices so the correct answer isn't always in the same slot.
  const fallbackRef = useRef<CurriculumQuestion[] | null>(null);
  if (fallbackRef.current === null) {
    fallbackRef.current = shuffled(curriculum.questions)
      .slice(0, QUESTIONS_PER_LESSON)
      .map((q) => ({ ...q, choices: shuffled(q.choices) }));
  }

  // Active question set: AI-generated, else the shuffled static fallback
  const questions: CurriculumQuestion[] =
    dynQuestions.length > 0 ? dynQuestions : fallbackRef.current;
  const q = questions[current] ?? questions[0];

  // Lesson timer, for Homeward gig credit (minutes actually spent learning)
  const startedAtRef = useRef<number>(Date.now());
  const [homewardMinutes, setHomewardMinutes] = useState<number | null>(null);

  // ── Fetch AI-generated questions ──────────────────────────────────────────

  const generateQuestions = useCallback(async () => {
    setPhase("generating");
    setDynError(false);
    setCurrent(0);
    setCorrect(0);
    setSelected(null);
    setShake(false);
    // Fresh round = fresh gig clock
    startedAtRef.current = Date.now();
    setHomewardMinutes(null);

    // Read covered topics from localStorage to ensure variety across sessions
    const storageKey = `elc_covered_${profile.id}_${curriculum.subjectId}`;
    let covered: string[] = [];
    if (typeof window !== "undefined") {
      try { covered = JSON.parse(localStorage.getItem(storageKey) ?? "[]"); } catch { /* ignore */ }
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15-second hard timeout

    try {
      const res = await fetch("/api/generate-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kidId: profile.id,
          subject: curriculum.subjectId,
          coveredTopics: covered,
          count: 5,
          // Progressive-challenge context: the generator calibrates difficulty
          concept: curriculum.concept,
          masteryPct: subjectMasteryPct(profile.id, curriculum.subjectId),
          assessLevel: assessLevelFor(profile.id),
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      if (!res.ok) throw new Error(`API error ${res.status}`);
      const data = await res.json();
      const newQs: CurriculumQuestion[] = Array.isArray(data?.questions) ? data.questions : [];
      if (newQs.length === 0) throw new Error("Empty or malformed question array");

      // Save question prompts to localStorage so next session avoids repeating them
      const newCovered = [
        ...covered,
        ...newQs.map((q: CurriculumQuestion) => q.prompt.slice(0, 70)),
      ].slice(-40); // keep last 40 topics (rolling window)
      if (typeof window !== "undefined") {
        localStorage.setItem(storageKey, JSON.stringify(newCovered));
      }

      setDynQuestions(newQs);
      setPhase("concept");
    } catch {
      clearTimeout(timeoutId);
      setDynError(true);
      // Fall back to static curriculum questions, show a subtle notice, not an error
      setDynQuestions([]);
      setPhase("concept");
    }
  }, [profile.id, curriculum.subjectId]);

  // Fetch on first mount for dynamic subjects
  useEffect(() => {
    if (isDynamic) generateQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleAnswer(choice: string, e: React.MouseEvent<HTMLButtonElement>) {
    if (phase !== "playing") return;
    // Tapping an answer counts as a user gesture, unlock audio if not done yet
    unlockAudio();
    setSelected(choice);
    const isCorrect = choice === q.answer;
    // Feed the adaptive-mastery store, this is what drives progressive difficulty
    try { recordAnswer(profile.id, curriculum.subjectId, isCorrect); } catch { /* ignore */ }
    if (isCorrect) {
      setCorrect((c) => c + 1);
      setPhase("feedback");
      playCorrect();
      burstConfetti(e.clientX, e.clientY, profile.colorHex);
    } else {
      setShake(true);
      playWrong();
      setTimeout(() => setShake(false), 600);
      setPhase("feedback");
    }
  }

  function handleNext() {
    // Fade out
    setVisible(false);
    setTimeout(() => {
      if (current + 1 >= questions.length) {
        setPhase("done");
      } else {
        setCurrent((c) => c + 1);
        setSelected(null);
        setShake(false);
        setPhase("playing");
      }
      setVisible(true);
    }, 200);
  }

  // ── Auto-read question aloud for Lois + Mercy ──────────────────────────────
  useEffect(() => {
    if (!autoSpeak || phase !== "playing") return;

    // Build the speech: prompt + choices read aloud so Lois can hear all options
    let speechText = q.prompt;
    if (isXLarge) {
      // Lois (3): read every choice so she can listen and tap
      q.choices.forEach((c, i) => {
        speechText += `. Choice ${i + 1}: ${c}`;
      });
    }

    const timer = setTimeout(() => speak(speechText), 350);
    return () => {
      clearTimeout(timer);
      stopAudio();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, phase]);

  // ── Auto-read hint on wrong answer ─────────────────────────────────────────
  useEffect(() => {
    if (!autoSpeak || phase !== "feedback") return;
    if (selected === q.answer) {
      // Correct, celebrate aloud
      const timer = setTimeout(
        () => speak(isXLarge ? "Yes! That's right! Amazing!" : "That's right! Great job!"),
        400
      );
      return () => clearTimeout(timer);
    } else if (q.hint) {
      // Wrong, read the hint
      const timer = setTimeout(() => speak("Hint: " + q.hint), 700);
      return () => clearTimeout(timer);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, selected]);

  // ── Animate XP on done screen + persist progress + Homeward gig credit ─────
  useEffect(() => {
    if (phase === "done") {
      const target = correct * XP_PER_CORRECT;
      addXP(profile.id, target);
      recordSession(profile.id, curriculum.subjectId);
      checkBadges(profile.id);

      // Homeward economy: real learning minutes become gig points the kid can
      // choose to spend on TV time or bank toward Friday payday.
      // Homeward enforces its own rules (5-min minimum, 60-min daily cap,
      // one credit per subject per day), we just report honestly.
      const minutes = Math.round((Date.now() - startedAtRef.current) / 60000);
      if (minutes >= 1) {
        setHomewardMinutes(minutes);
        reportLessonToHomeward({
          kid: profile.id,
          subject: curriculum.subjectId,
          lessonId: dailyLessonId(profile.id, curriculum.subjectId),
          minutesEarned: minutes,
          lessonTitle: curriculum.subjectLabel,
        });
      }

      let cur = 0;
      const step = Math.max(1, Math.floor(target / 30));
      const interval = setInterval(() => {
        cur = Math.min(cur + step, target);
        setXpDisplay(cur);
        if (cur >= target) clearInterval(interval);
      }, 40);
      return () => clearInterval(interval);
    }
  }, [phase, correct, profile.id, curriculum.subjectId, curriculum.subjectLabel]);

  const fontBase = isXLarge ? "text-2xl" : isLarge ? "text-xl" : "text-base";
  const fontLg = isXLarge ? "text-4xl" : isLarge ? "text-3xl" : "text-2xl";

  // ── Auto-read concept text when concept screen appears ─────────────────────
  // Only after the kid has tapped the 🔊 overlay, before that, audio isn't
  // unlocked on iOS and the fetch-then-play would silently fail.
  useEffect(() => {
    if (!autoSpeak || !ttsUnlockDone || phase !== "concept") return;
    const timer = setTimeout(() => speak(curriculum.concept), 600);
    return () => {
      clearTimeout(timer);
      stopAudio();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, ttsUnlockDone]);

  // ── GENERATING SCREEN (while AI fetches questions) ─────────────────────────
  if (phase === "generating") {
    const loadingMessages = [
      `Opening the Word… 📖`,
      `Finding fresh questions…`,
      `Preparing your lesson…`,
    ];
    return (
      <main
        className="min-h-screen flex flex-col items-center justify-center px-4 text-center"
        style={{ background: `linear-gradient(160deg, ${profile.colorHex}12 0%, #fff 100%)` }}
      >
        <div
          className={`mb-6 ${isXLarge ? "text-9xl" : "text-8xl"}`}
          style={{ animation: "spin 2s linear infinite", display: "inline-block" }}
        >
          {curriculum.emoji}
        </div>
        <p className={`font-black text-gray-700 mb-2 ${isLarge ? "text-2xl" : "text-xl"}`}>
          {loadingMessages[sessionCount % loadingMessages.length]}
        </p>
        <p className={`text-gray-400 ${isLarge ? "text-lg" : "text-base"}`}>
          Every session explores new territory 🌿
        </p>
        <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
      </main>
    );
  }

  // ── CONCEPT SCREEN ─────────────────────────────────────────────────────────
  if (phase === "concept") {
    return (
      <>
      {/* iOS TTS unlock overlay, covers the concept screen until the kid taps 🔊.
          This satisfies iOS Safari's requirement that audio playback starts from a
          user-gesture handler. Without this, all auto-TTS silently fails. */}
      {autoSpeak && !ttsUnlockDone && (
        <div
          style={{
            position: "fixed", inset: 0, zIndex: 99999,
            background: "rgba(0,0,0,0.55)",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            gap: "1.5rem",
          }}
        >
          <div style={{ fontSize: isXLarge ? "5rem" : "4rem" }}>🔊</div>
          <p style={{
            color: "white", fontWeight: 900, textAlign: "center", padding: "0 2rem",
            fontSize: isXLarge ? "2rem" : "1.5rem", lineHeight: 1.3,
          }}>
            {isXLarge ? "Tap to turn on sound!" : "Tap to turn on sound!"}
          </p>
          <button
            onPointerDown={() => {
              unlockAudio();
              setTtsUnlockDone(true);
            }}
            style={{
              background: profile.colorHex, color: "white", border: "none",
              borderRadius: 999, padding: isXLarge ? "1.5rem 3rem" : "1rem 2.5rem",
              fontWeight: 900, fontSize: isXLarge ? "2rem" : "1.4rem",
              boxShadow: `0 6px 32px ${profile.colorHex}80`,
              cursor: "pointer",
            }}
          >
            🔊 Turn On Sound
          </button>
        </div>
      )}
      <main
        className="min-h-screen px-4 py-8 max-w-lg md:max-w-2xl mx-auto flex flex-col"
        style={{ background: `linear-gradient(160deg, ${profile.colorHex}12 0%, #fff 100%)` }}
      >
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => router.push(hubPath)}
            className="text-gray-400 hover:text-gray-600 text-sm font-medium"
          >
            ← Back to Hub
          </button>
          <span
            className="text-sm font-bold px-3 py-1 rounded-full"
            style={{ backgroundColor: profile.colorHex + "20", color: profile.colorHex }}
          >
            {curriculum.emoji} {curriculum.subjectLabel}
          </span>
        </div>

        <div className={`text-center mb-6 ${isXLarge ? "text-9xl" : "text-7xl"}`}>
          {curriculum.emoji}
        </div>

        <h1
          className={`font-black text-center mb-6 ${fontLg}`}
          style={{ fontFamily: "Georgia, serif", color: profile.colorHex }}
        >
          {curriculum.subjectLabel}
        </h1>

        <div
          className="bg-white rounded-3xl shadow-md p-6 mb-8"
          style={{ borderLeft: `5px solid ${profile.colorHex}` }}
        >
          <p className={`text-gray-700 leading-relaxed font-medium ${fontBase}`}>
            {curriculum.concept}
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onPointerDown={() => { unlockAudio(); setTtsUnlockDone(true); }}
            onClick={() => setPhase("playing")}
            className="w-full py-5 rounded-3xl font-black text-white shadow-xl hover:opacity-90 hover:scale-105 active:scale-95 transition-all duration-200"
            style={{
              backgroundColor: profile.colorHex,
              fontSize: isLarge ? "1.25rem" : "1rem",
            }}
          >
            Let&apos;s Practice! 🚀
          </button>

          {profile.tutorEnabled && (
            <button
              onClick={() => setShowTutor(true)}
              className="w-full py-4 rounded-3xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all"
              style={{ fontSize: isLarge ? "1.1rem" : "0.9rem" }}
            >
              🤖 Ask Your Tutor
            </button>
          )}
        </div>

        {showTutor && (
          <KidTutorChat
            kidId={profile.id}
            kidName={profile.name}
            colorHex={profile.colorHex}
            subject={curriculum.subjectLabel}
            onClose={() => setShowTutor(false)}
          />
        )}

        {/* Subtle notice when AI fetch timed out or failed, uses saved questions */}
        {dynError && (
          <p className="text-center text-gray-400 text-xs mt-4">
            Using saved questions
          </p>
        )}
      </main>
      </>
    );
  }

  // ── DONE SCREEN ────────────────────────────────────────────────────────────
  if (phase === "done") {
    const pct = Math.round((correct / questions.length) * 100);
    const earnedXP = correct * XP_PER_CORRECT;

    return (
      <main
        className="min-h-screen flex flex-col items-center justify-center px-4 py-12 text-center"
        style={{ background: `linear-gradient(160deg, ${profile.colorHex}18 0%, #fff 70%)` }}
      >
        <div className={`mb-5 ${isXLarge ? "text-9xl" : "text-8xl"} animate-bounce`}>
          {pct >= 80 ? "🏆" : pct >= 60 ? "⭐" : "💪"}
        </div>
        <h1
          className={`font-black mb-3 ${fontLg}`}
          style={{ fontFamily: "Georgia, serif", color: profile.colorHex }}
        >
          {pct >= 80 ? "You crushed it!" : pct >= 60 ? "Nice work!" : "Keep it up!"}
        </h1>
        <p className={`text-gray-500 mb-2 ${isLarge ? "text-2xl" : "text-xl"}`}>
          {correct} / {questions.length} correct
        </p>
        <p
          className={`font-black mb-4 ${isLarge ? "text-5xl" : "text-4xl"}`}
          style={{ color: profile.colorHex }}
        >
          {pct}%
        </p>

        {earnedXP > 0 && (
          <div
            className="text-3xl font-black mb-3 px-6 py-3 rounded-2xl"
            style={{ backgroundColor: profile.colorHex + "20", color: profile.colorHex }}
          >
            +{xpDisplay} XP ⚡
          </div>
        )}

        {/* Homeward gig credit, learning minutes become points (TV time or payday money) */}
        {homewardMinutes !== null && homewardMinutes >= 5 && (
          <div
            className="font-bold mb-3 px-5 py-2 rounded-full text-base"
            style={{ backgroundColor: "#f0fdf4", border: "1.5px solid #86efac", color: "#15803d" }}
          >
            🎓 {homewardMinutes} min of gig points earned in Homeward!
          </div>
        )}

        {/* Growth line, show the kid their own progress (learning how to learn) */}
        {(() => {
          const m = subjectMasteryPct(profile.id, curriculum.subjectId);
          if (m === null) return null;
          return (
            <p className={`text-gray-500 mb-6 ${isLarge ? "text-lg" : "text-sm"} font-semibold`}>
              📈 Your {curriculum.subjectLabel} strength: {m}%
              {m >= 80 ? ", next lesson gets harder. You're ready! 🔥" : m >= 50 ? ", growing every session! 💪" : ", every try makes you stronger! 🌱"}
            </p>
          );
        })()}

        <div className="flex flex-col gap-3 w-full max-w-xs">
          {/* Dynamic subjects: Explore More! generates a fresh set of AI questions */}
          {isDynamic && (
            <button
              onClick={() => {
                setSessionCount((n) => n + 1);
                setXpDisplay(0);
                generateQuestions();
              }}
              className="px-8 py-4 rounded-3xl font-black text-white shadow-xl active:scale-95 transition-all"
              style={{
                backgroundColor: profile.colorHex,
                fontSize: isLarge ? "1.3rem" : "1.1rem",
                boxShadow: `0 4px 18px ${profile.colorHex}50`,
              }}
            >
              Explore More! 🚀
            </button>
          )}
          <button
            onClick={() => {
              setCurrent(0);
              setCorrect(0);
              setSelected(null);
              setXpDisplay(0);
              // Dynamic: re-fetch; Static: just replay the concept screen
              if (isDynamic) {
                setSessionCount((n) => n + 1);
                generateQuestions();
              } else {
                setPhase("concept");
              }
            }}
            className="px-8 py-4 rounded-3xl font-black text-white shadow-lg hover:opacity-90 transition-all"
            style={{
              backgroundColor: isDynamic ? `${profile.colorHex}bb` : profile.colorHex,
              fontSize: isLarge ? "1.25rem" : "1rem",
            }}
          >
            {isDynamic ? "These Questions Again 🔄" : "Study Again 🔄"}
          </button>
          <button
            onClick={() => router.push(hubPath)}
            className="px-8 py-4 rounded-3xl font-black text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all"
            style={{ fontSize: isLarge ? "1.25rem" : "1rem" }}
          >
            Back to Hub 🏠
          </button>
        </div>
        {isDynamic && (
          <p className="mt-6 text-gray-400 text-sm">
            Session {sessionCount + 1} · Topics expand every time you explore 🌿
          </p>
        )}
      </main>
    );
  }

  // ── QUESTION SCREEN ────────────────────────────────────────────────────────
  const progressPct = (current / questions.length) * 100;

  return (
    <main
      className="min-h-screen px-4 py-6 max-w-lg md:max-w-2xl mx-auto flex flex-col"
      style={{ background: `linear-gradient(160deg, ${profile.colorHex}10 0%, #fff 100%)` }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => router.push(hubPath)}
          className="text-gray-400 hover:text-gray-600 text-sm font-medium"
        >
          ← Hub
        </button>
        <span className="text-sm font-bold text-gray-500">
          {curriculum.emoji} {curriculum.subjectLabel}
        </span>
        <span className="text-sm font-bold text-gray-500">
          {current + 1}/{questions.length}
        </span>
      </div>

      {/* Progress bar */}
      <div className="bg-gray-100 rounded-full h-3 mb-6 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${progressPct}%`, backgroundColor: profile.colorHex }}
        />
      </div>

      <div className="text-right mb-3">
        <span
          className="text-sm font-bold px-3 py-1 rounded-full"
          style={{ backgroundColor: profile.colorHex + "22", color: profile.colorHex }}
        >
          ✅ {correct} correct
        </span>
      </div>

      {/* Question card with fade + shake */}
      <div
        ref={questionCardRef}
        className="bg-white rounded-3xl shadow-md p-6 mb-6 text-center font-bold text-gray-800 leading-snug"
        style={{
          fontSize: isXLarge ? "1.75rem" : isLarge ? "1.4rem" : "1.2rem",
          fontFamily: "Georgia, serif",
          opacity: visible ? 1 : 0,
          transition: "opacity 0.2s ease",
          animation: shake && phase === "feedback" ? "lessonShake 0.5s ease-in-out" : undefined,
        }}
      >
        {q.prompt}
      </div>

      {/* Choices */}
      <div
        className="flex flex-col gap-3 mb-4"
        style={{ opacity: visible ? 1 : 0, transition: "opacity 0.2s ease" }}
      >
        {q.choices.map((choice) => {
          let style: React.CSSProperties = {
            border: "2px solid #e5e7eb",
            backgroundColor: "#ffffff",
            color: "#1f2937",
          };
          if (phase === "feedback") {
            if (choice === q.answer) {
              style = { border: "2px solid #16a34a", backgroundColor: "#dcfce7", color: "#15803d" };
            } else if (choice === selected) {
              style = { border: "2px solid #dc2626", backgroundColor: "#fee2e2", color: "#dc2626" };
            } else {
              style = { border: "2px solid #e5e7eb", backgroundColor: "#f9fafb", color: "#9ca3af" };
            }
          }
          return (
            <button
              key={choice}
              onClick={(e) => handleAnswer(choice, e)}
              disabled={phase === "feedback"}
              className="rounded-2xl font-bold shadow-sm transition-all duration-150 text-left hover:shadow-md"
              style={{
                ...style,
                padding: isXLarge ? "1.75rem 1.25rem" : isLarge ? "1.25rem" : "1rem 1.25rem",
                minHeight: isXLarge ? "80px" : isLarge ? "60px" : undefined,
                fontSize: isXLarge ? "1.4rem" : isLarge ? "1.2rem" : "1rem",
                cursor: phase === "feedback" ? "default" : "pointer",
              }}
            >
              {phase === "feedback" && choice === q.answer && "✅ "}
              {phase === "feedback" && choice === selected && choice !== q.answer && "❌ "}
              {choice}
            </button>
          );
        })}
      </div>

      {/* Feedback */}
      {phase === "feedback" && (
        <div>
          {selected !== q.answer && (
            <div className="bg-amber-50 text-amber-700 rounded-2xl p-4 mb-3 text-sm font-medium">
              💡 Hint: {q.hint}
            </div>
          )}
          {selected === q.answer && (
            <div className="bg-green-50 text-green-700 rounded-2xl p-4 mb-3 text-sm font-bold text-center">
              🎉 Yes! That&apos;s right! +{XP_PER_CORRECT} XP ⚡
            </div>
          )}

          <div className="flex flex-col gap-2">
            <button
              onClick={handleNext}
              className="w-full py-4 rounded-3xl font-black text-white shadow-lg hover:opacity-90 transition-all"
              style={{
                backgroundColor: profile.colorHex,
                fontSize: isLarge ? "1.25rem" : "1rem",
              }}
            >
              {current + 1 >= questions.length ? "See Results! 🏆" : "Next →"}
            </button>

            {profile.tutorEnabled && (
              <button
                onClick={() => setShowTutor(true)}
                className="w-full py-3 rounded-2xl font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 transition-all text-sm"
              >
                🤖 Ask Your Tutor
              </button>
            )}
          </div>
        </div>
      )}

      {showTutor && (
        <KidTutorChat
          kidId={profile.id}
          kidName={profile.name}
          colorHex={profile.colorHex}
          subject={curriculum.subjectLabel}
          currentQuestion={q.prompt}
          onClose={() => setShowTutor(false)}
        />
      )}

      <style>{`
        @keyframes lessonShake {
          0%, 100% { transform: translateX(0); }
          15% { transform: translateX(-10px); }
          30% { transform: translateX(10px); }
          45% { transform: translateX(-7px); }
          60% { transform: translateX(7px); }
          75% { transform: translateX(-4px); }
          90% { transform: translateX(4px); }
        }
      `}</style>
    </main>
  );
}
