"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { KidId } from "@/lib/kids";

interface AssessmentQuestion {
  prompt: string;
  choices: string[];
  answer: string;
  subject: string;
}

// Assessment questions per kid, 8–10 questions, age-appropriate
const ASSESSMENT_QUESTIONS: Record<KidId, AssessmentQuestion[]> = {
  titus: [
    { prompt: "What is 3 × 4?", choices: ["10", "12", "14", "7"], answer: "12", subject: "math" },
    { prompt: "What is 5 × 5?", choices: ["20", "25", "30", "15"], answer: "25", subject: "math" },
    { prompt: "Which word is a VERB?", choices: ["Dog", "Blue", "Jump", "House"], answer: "Jump", subject: "grammar" },
    { prompt: "Which is a complete sentence?", choices: ["The big dog.", "She loves pizza.", "Running fast.", "Under the tree."], answer: "She loves pizza.", subject: "grammar" },
    { prompt: "What do plants need to make food?", choices: ["Darkness and soil", "Sunlight, water, and air", "Snow and rain", "Animals"], answer: "Sunlight, water, and air", subject: "science" },
    { prompt: "What do we call it when a caterpillar becomes a butterfly?", choices: ["Hibernation", "Migration", "Metamorphosis", "Photosynthesis"], answer: "Metamorphosis", subject: "science" },
    { prompt: "What does the word 'gospel' mean?", choices: ["Good rules", "Good news", "God's book", "A great story"], answer: "Good news", subject: "bible" },
    { prompt: "How are we saved?", choices: ["By being good enough", "By God's grace, it's a gift", "By working hard", "By being better than others"], answer: "By God's grace, it's a gift", subject: "bible" },
    { prompt: "What fraction is 1 out of 4 equal parts?", choices: ["1/3", "1/4", "1/2", "2/4"], answer: "1/4", subject: "math" },
    { prompt: "What punctuation ends a question?", choices: [".", "!", "?", ","], answer: "?", subject: "grammar" },
  ],
  mercy: [
    { prompt: "🐶🐶🐶 How many dogs?", choices: ["2", "3", "4"], answer: "3", subject: "counting" },
    { prompt: "What number comes AFTER 7?", choices: ["6", "8", "9"], answer: "8", subject: "counting" },
    { prompt: "🍎 + 🍎 = ? (1 + 1)", choices: ["1", "2", "3"], answer: "2", subject: "counting" },
    { prompt: "What sound does B make?", choices: ["/b/ like Ball", "/p/ like Pop", "/d/ like Dog"], answer: "/b/ like Ball", subject: "phonics" },
    { prompt: "Which word RHYMES with 'cat'?", choices: ["Dog", "Hat", "Cup"], answer: "Hat", subject: "phonics" },
    { prompt: "Which word starts with the /S/ sound?", choices: ["Moon", "Sun", "Run"], answer: "Sun", subject: "phonics" },
    { prompt: "Who made the whole world? 🌍", choices: ["God made it", "It made itself", "People made it"], answer: "God made it", subject: "bible" },
    { prompt: "God loves ___.", choices: ["Only good kids", "Everyone He made 💕", "Only grown-ups"], answer: "Everyone He made 💕", subject: "bible" },
  ],
  lois: [], // Lois skips assessment, too young
};

export interface AssessmentResult {
  kidId: KidId;
  scores: Record<string, { correct: number; total: number }>;
  level: "beginner" | "on-track" | "advanced";
  completedAt: string;
}

function computeLevel(correct: number, total: number): "beginner" | "on-track" | "advanced" {
  if (total === 0) return "beginner";
  const pct = correct / total;
  if (pct >= 0.8) return "advanced";
  if (pct >= 0.5) return "on-track";
  return "beginner";
}

interface Props {
  kidId: KidId;
  grade: string;
  name: string;
  colorHex: string;
  emoji: string;
}

export default function KidAssessment({ kidId, grade, name, colorHex, emoji }: Props) {
  const router = useRouter();
  const questions = ASSESSMENT_QUESTIONS[kidId];
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [phase, setPhase] = useState<"intro" | "playing" | "feedback" | "done">("intro");
  const [correctBySubject, setCorrectBySubject] = useState<Record<string, { correct: number; total: number }>>({});
  const [totalCorrect, setTotalCorrect] = useState(0);

  // Lois: skip straight to hub
  useEffect(() => {
    if (kidId === "lois") {
      router.replace(`/kids/lois/hub`);
    }
  }, [kidId, router]);

  if (kidId === "lois") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400 text-xl">Loading…</p>
      </div>
    );
  }

  function handleAnswer(choice: string) {
    if (phase !== "playing") return;
    setSelected(choice);
    setPhase("feedback");

    const q = questions[current];
    const isCorrect = choice === q.answer;

    setCorrectBySubject((prev) => {
      const existing = prev[q.subject] ?? { correct: 0, total: 0 };
      return {
        ...prev,
        [q.subject]: {
          correct: existing.correct + (isCorrect ? 1 : 0),
          total: existing.total + 1,
        },
      };
    });

    if (isCorrect) setTotalCorrect((c) => c + 1);
  }

  function handleNext() {
    if (current + 1 >= questions.length) {
      // Save result to localStorage
      const result: AssessmentResult = {
        kidId,
        scores: correctBySubject,
        level: computeLevel(totalCorrect, questions.length),
        completedAt: new Date().toISOString(),
      };
      localStorage.setItem(`assessment-${kidId}`, JSON.stringify(result));
      setPhase("done");
    } else {
      setCurrent((c) => c + 1);
      setSelected(null);
      setPhase("playing");
    }
  }

  const q = questions[current];
  const progress = (current / questions.length) * 100;

  // ── INTRO SCREEN ─────────────────────────────────────────────────────────
  if (phase === "intro") {
    return (
      <main
        className="min-h-screen flex flex-col items-center justify-center px-4 py-12 text-center"
        style={{ background: `linear-gradient(160deg, ${colorHex}18 0%, #fff 70%)` }}
      >
        <div className="text-8xl mb-5">{emoji}</div>
        <h1
          className="text-4xl font-black mb-3"
          style={{ fontFamily: "Georgia, serif", color: colorHex }}
        >
          Hey {name}! 👋
        </h1>
        <p className="text-gray-600 text-lg mb-2 max-w-sm">
          Let&apos;s see what you already know!
        </p>
        <p className="text-gray-400 text-base mb-8 max-w-xs">
          This isn&apos;t a scary test, it&apos;s just a fun quiz so your tutor knows the
          best way to help you. No pressure! 🚀
        </p>
        <div
          className="rounded-2xl px-5 py-3 mb-8 text-sm font-bold"
          style={{ backgroundColor: colorHex + "18", color: colorHex }}
        >
          {questions.length} quick questions &bull; Takes about 3 minutes
        </div>
        <button
          onClick={() => setPhase("playing")}
          className="px-10 py-5 rounded-3xl font-black text-white text-xl shadow-xl hover:opacity-90 transition-all hover:scale-105 active:scale-95"
          style={{ backgroundColor: colorHex }}
        >
          Let&apos;s Go! 🚀
        </button>
        <button
          onClick={() => router.push(`/kids/${kidId}/hub`)}
          className="mt-4 text-sm text-gray-400 hover:text-gray-600 underline transition-colors"
        >
          Skip for now
        </button>
      </main>
    );
  }

  // ── DONE SCREEN ──────────────────────────────────────────────────────────
  if (phase === "done") {
    const pct = Math.round((totalCorrect / questions.length) * 100);
    const level = computeLevel(totalCorrect, questions.length);
    const levelEmoji = level === "advanced" ? "🏆" : level === "on-track" ? "⭐" : "💪";
    const levelLabel =
      level === "advanced"
        ? "You're a superstar!"
        : level === "on-track"
        ? "Great start!"
        : "Ready to learn!";

    return (
      <main
        className="min-h-screen flex flex-col items-center justify-center px-4 py-12 text-center"
        style={{ background: `linear-gradient(160deg, ${colorHex}18 0%, #fff 70%)` }}
      >
        <div className="text-9xl mb-5">{levelEmoji}</div>
        <h1
          className="text-4xl font-black mb-3"
          style={{ fontFamily: "Georgia, serif", color: colorHex }}
        >
          {levelLabel}
        </h1>
        <p className="text-gray-500 text-lg mb-1">
          {totalCorrect} out of {questions.length} correct
        </p>
        <p
          className="text-5xl font-black mb-6"
          style={{ color: colorHex }}
        >
          {pct}%
        </p>
        <div
          className="rounded-2xl px-5 py-4 mb-8 max-w-xs"
          style={{ backgroundColor: colorHex + "15", color: colorHex }}
        >
          <p className="font-bold text-sm">
            {level === "advanced"
              ? "You already know a lot! Let's try some fun challenges!"
              : level === "on-track"
              ? "You know some great things! Let's build on that!"
              : "This is the perfect time to learn, let's explore together!"}
          </p>
        </div>
        <button
          onClick={() => router.push(`/kids/${kidId}/hub`)}
          className="px-10 py-5 rounded-3xl font-black text-white text-xl shadow-xl hover:opacity-90 transition-all"
          style={{ backgroundColor: colorHex }}
        >
          Go to My Hub! 🏠
        </button>
      </main>
    );
  }

  // ── QUESTION SCREEN ───────────────────────────────────────────────────────
  return (
    <main
      className="min-h-screen px-4 py-6 max-w-lg md:max-w-2xl mx-auto flex flex-col"
      style={{ background: `linear-gradient(160deg, ${colorHex}10 0%, #fff 100%)` }}
    >
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => router.push(`/kids/${kidId}/hub`)}
          className="text-gray-400 hover:text-gray-600 text-sm font-medium"
        >
          ← Skip
        </button>
        <span className="text-sm font-bold" style={{ color: colorHex }}>
          {emoji} Quick Quiz
        </span>
        <span className="text-sm font-bold text-gray-500">
          {current + 1}/{questions.length}
        </span>
      </div>

      <div className="bg-gray-100 rounded-full h-3 mb-6 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${progress}%`, backgroundColor: colorHex }}
        />
      </div>

      <div className="text-center mb-4">
        <span
          className="text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide"
          style={{ backgroundColor: colorHex + "20", color: colorHex }}
        >
          {q.subject}
        </span>
      </div>

      <div
        className="bg-white rounded-3xl shadow-md p-6 mb-6 text-center font-bold text-gray-800 leading-snug text-xl"
        style={{ fontFamily: "Georgia, serif" }}
      >
        {q.prompt}
      </div>

      <div className="flex flex-col gap-3 mb-6">
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
              onClick={() => handleAnswer(choice)}
              disabled={phase === "feedback"}
              className="rounded-2xl font-bold shadow-sm transition-all duration-150 text-left px-5 py-4 text-base"
              style={{ ...style, cursor: phase === "feedback" ? "default" : "pointer" }}
            >
              {phase === "feedback" && choice === q.answer && "✅ "}
              {phase === "feedback" && choice === selected && choice !== q.answer && "❌ "}
              {choice}
            </button>
          );
        })}
      </div>

      {phase === "feedback" && (
        <div>
          <div
            className="rounded-2xl p-4 mb-4 text-center text-sm font-bold"
            style={
              selected === q.answer
                ? { backgroundColor: "#dcfce7", color: "#15803d" }
                : { backgroundColor: "#fef9c3", color: "#854d0e" }
            }
          >
            {selected === q.answer
              ? "🎉 That's right! Amazing!"
              : `💡 The answer is: ${q.answer}`}
          </div>
          <button
            onClick={handleNext}
            className="w-full py-4 rounded-3xl font-black text-white shadow-lg hover:opacity-90 transition-all text-lg"
            style={{ backgroundColor: colorHex }}
          >
            {current + 1 >= questions.length ? "See My Results! 🏆" : "Next →"}
          </button>
        </div>
      )}
    </main>
  );
}
