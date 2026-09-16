"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { burstConfetti } from "@/lib/confetti";
import { addXP, recordSession, checkBadges } from "@/lib/progress";
import { playCorrect, playWrong } from "@/lib/sounds";
import type { SubjectCurriculum } from "@/lib/curriculum";

interface Props {
  curriculum: SubjectCurriculum;
}

const COLOR = "#1b3a6b"; // Truma navy
const GOLD = "#c48a1a";
const QUESTIONS_PER_SESSION = 5;
const XP_PER_CORRECT = 20;

function recordSubjectPracticed(subjectId: string) {
  if (typeof window === "undefined") return;
  try {
    const today = new Date().toISOString().slice(0, 10);
    const key = `truma-subject-${subjectId}`;
    const raw = localStorage.getItem(key);
    const prev = raw ? JSON.parse(raw) : { sessions: 0, lastDate: "" };
    localStorage.setItem(key, JSON.stringify({
      sessions: (prev.sessions || 0) + 1,
      lastDate: today,
    }));
  } catch {
    /* ignore */
  }
}

export default function TrumaCurriculumPractice({ curriculum }: Props) {
  const router = useRouter();
  const [questions] = useState(() =>
    [...curriculum.questions]
      .sort(() => Math.random() - 0.5)
      .slice(0, QUESTIONS_PER_SESSION)
      // Shuffle each question's choices too, so the correct answer isn't always first.
      .map((q) => ({ ...q, choices: [...q.choices].sort(() => Math.random() - 0.5) }))
  );
  const [phase, setPhase] = useState<"concept" | "playing" | "feedback" | "done">("concept");
  const [current, setCurrent] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [shake, setShake] = useState(false);
  const [xpDisplay, setXpDisplay] = useState(0);

  const q = questions[current];

  function handleAnswer(choice: string, e: React.MouseEvent<HTMLButtonElement>) {
    if (phase !== "playing") return;
    setSelected(choice);
    if (choice === q.answer) {
      setCorrect((c) => c + 1);
      setPhase("feedback");
      playCorrect();
      burstConfetti(e.clientX, e.clientY, COLOR);
    } else {
      setShake(true);
      playWrong();
      setTimeout(() => setShake(false), 600);
      setPhase("feedback");
    }
  }

  function handleNext() {
    if (current + 1 >= questions.length) {
      setPhase("done");
    } else {
      setCurrent((c) => c + 1);
      setSelected(null);
      setShake(false);
      setPhase("playing");
    }
  }

  // Animate XP and persist
  useEffect(() => {
    if (phase === "done") {
      const target = correct * XP_PER_CORRECT;
      addXP("truma", target);
      recordSession("truma", curriculum.subjectId);
      checkBadges("truma");
      recordSubjectPracticed(curriculum.subjectId);

      let cur = 0;
      const step = Math.max(1, Math.floor(target / 30));
      const interval = setInterval(() => {
        cur = Math.min(cur + step, target);
        setXpDisplay(cur);
        if (cur >= target) clearInterval(interval);
      }, 40);
      return () => clearInterval(interval);
    }
  }, [phase, correct, curriculum.subjectId]);

  // ── CONCEPT SCREEN ─────────────────────────────────────────────────────────
  if (phase === "concept") {
    return (
      <main
        className="min-h-screen px-4 py-8 max-w-lg md:max-w-2xl mx-auto flex flex-col"
        style={{ background: "linear-gradient(160deg, #1b3a6b12 0%, #ffffff 100%)" }}
      >
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => router.push("/hub")}
            className="text-gray-400 hover:text-gray-600 text-sm"
          >
            ← Hub
          </button>
          <span className="text-2xl">{curriculum.emoji}</span>
        </div>

        <div
          className="rounded-3xl p-6 mb-6 shadow-md flex-1"
          style={{ backgroundColor: COLOR + "0d", border: `2px solid ${COLOR}20` }}
        >
          <h1 className="text-2xl font-black mb-4" style={{ color: COLOR, fontFamily: "Georgia, serif" }}>
            {curriculum.subjectLabel}
          </h1>
          <p className="text-gray-700 leading-relaxed text-base">{curriculum.concept}</p>
        </div>

        <button
          onClick={() => setPhase("playing")}
          className="w-full py-5 rounded-3xl font-black text-white text-xl shadow-xl hover:opacity-90 active:scale-95 transition-all"
          style={{ backgroundColor: COLOR }}
        >
          Start Practice ({questions.length} Qs) →
        </button>
      </main>
    );
  }

  // ── DONE SCREEN ─────────────────────────────────────────────────────────────
  if (phase === "done") {
    const pct = Math.round((correct / questions.length) * 100);
    return (
      <main
        className="min-h-screen flex flex-col items-center justify-center px-4 text-center"
        style={{ background: "linear-gradient(160deg, #1b3a6b 0%, #0f2547 100%)" }}
      >
        <div className="text-9xl mb-4 animate-bounce">
          {pct >= 80 ? "🏆" : pct >= 60 ? "⭐" : "💪"}
        </div>
        <h1 className="text-4xl font-black text-white mb-2" style={{ fontFamily: "Georgia, serif" }}>
          {pct >= 80 ? "Excellent!" : pct >= 60 ? "Good work!" : "Keep at it!"}
        </h1>
        <p className="text-5xl font-black mb-2" style={{ color: GOLD }}>{pct}%</p>
        <p className="text-blue-200 mb-2">{correct}/{questions.length} correct</p>
        {xpDisplay > 0 && (
          <div
            className="inline-block text-xl font-black px-5 py-2 rounded-full mb-6"
            style={{ backgroundColor: GOLD + "20", color: GOLD }}
          >
            +{xpDisplay} XP ⚡
          </div>
        )}
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <button
            onClick={() => {
              setCurrent(0);
              setCorrect(0);
              setSelected(null);
              setXpDisplay(0);
              setPhase("concept");
            }}
            className="py-5 rounded-3xl font-black text-white text-xl shadow-xl"
            style={{ backgroundColor: GOLD }}
          >
            Practice Again
          </button>
          <button
            onClick={() => router.push("/hub")}
            className="py-4 rounded-3xl font-black text-blue-200 text-base"
            style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
          >
            ← Hub
          </button>
        </div>
      </main>
    );
  }

  // ── PRACTICE SCREEN ─────────────────────────────────────────────────────────
  const isCorrect = selected === q.answer;
  const isWrong = selected !== null && selected !== q.answer;

  return (
    <main
      className="min-h-screen flex flex-col px-4 py-6 max-w-lg md:max-w-2xl mx-auto"
      style={{ background: "linear-gradient(160deg, #1b3a6b08 0%, #ffffff 100%)" }}
    >
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => router.push("/hub")}
          className="text-gray-400 text-sm hover:text-gray-600"
        >
          ← Hub
        </button>
        <span className="text-sm font-bold text-gray-500">
          {current + 1}/{questions.length}
        </span>
        <span
          className="text-sm font-bold px-3 py-1 rounded-full"
          style={{ backgroundColor: COLOR + "15", color: COLOR }}
        >
          {curriculum.emoji} {curriculum.subjectLabel}
        </span>
      </div>

      {/* Progress bar */}
      <div className="bg-gray-100 rounded-full h-2 mb-5 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${((current + (phase === "feedback" ? 1 : 0)) / questions.length) * 100}%`,
            backgroundColor: COLOR,
          }}
        />
      </div>

      {/* Question */}
      <div
        className="rounded-3xl p-6 mb-5 shadow-md"
        style={{
          border: `2px solid ${COLOR}20`,
          animation: shake ? "shake 0.5s ease-in-out" : undefined,
        }}
        ref={undefined}
      >
        <p className="text-xl font-black text-gray-800 leading-snug">{q.prompt}</p>
      </div>

      {/* Choices */}
      <div className="flex flex-col gap-3 mb-5">
        {q.choices.map((choice) => {
          let bg = "#ffffff";
          let border = "#e5e7eb";
          let textColor = "#1f2937";
          if (phase === "feedback") {
            if (choice === q.answer) { bg = "#dcfce7"; border = "#16a34a"; textColor = "#15803d"; }
            else if (choice === selected) { bg = "#fee2e2"; border = "#dc2626"; textColor = "#dc2626"; }
            else { bg = "#f9fafb"; textColor = "#9ca3af"; }
          }
          return (
            <button
              key={choice}
              onClick={(e) => handleAnswer(choice, e)}
              disabled={phase === "feedback"}
              className="rounded-2xl p-4 text-left font-bold text-base shadow-sm transition-all duration-150 active:scale-95"
              style={{ backgroundColor: bg, border: `2px solid ${border}`, color: textColor }}
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
          <div
            className="rounded-2xl p-4 mb-3 text-sm font-bold"
            style={{
              backgroundColor: isCorrect ? "#dcfce7" : "#fef9c3",
              color: isCorrect ? "#15803d" : "#854d0e",
            }}
          >
            {isCorrect ? "✅ Correct!" : `💡 ${q.hint}`}
          </div>
          <button
            onClick={handleNext}
            className="w-full py-4 rounded-3xl font-black text-white text-lg shadow-lg hover:opacity-90 active:scale-95"
            style={{ backgroundColor: COLOR }}
          >
            {current + 1 >= questions.length ? "See Results 🏆" : "Next →"}
          </button>
        </div>
      )}

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-5px); }
          80% { transform: translateX(5px); }
        }
      `}</style>
    </main>
  );
}
