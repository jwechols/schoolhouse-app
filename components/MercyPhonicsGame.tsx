"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { burstConfetti } from "@/lib/confetti";
import { recordGameResult } from "@/lib/family-data";
import { addXP, recordSession, checkBadges } from "@/lib/progress";
import { playCorrect, playWrong } from "@/lib/sounds";

const COLOR = "#ec4899"; // Mercy pink

// Letter → emoji choices (one starts with the letter, three don't)
// Format: [correct, wrong1, wrong2, wrong3]
const PHONICS_DATA: Array<{
  letter: string;
  sound: string; // e.g. "/b/"
  correct: string; // emoji that starts with letter
  correctWord: string; // word for celebration text
  wrongs: string[]; // 3 wrong emojis
}> = [
  { letter: "B", sound: "/b/", correct: "🐝", correctWord: "Bee", wrongs: ["🐱", "🐘", "🌸"] },
  { letter: "C", sound: "/k/", correct: "🐱", correctWord: "Cat", wrongs: ["🐶", "🌟", "🍎"] },
  { letter: "D", sound: "/d/", correct: "🐶", correctWord: "Dog", wrongs: ["🌸", "🍊", "🐸"] },
  { letter: "F", sound: "/f/", correct: "🐸", correctWord: "Frog", wrongs: ["🐱", "🌺", "⭐"] },
  { letter: "H", sound: "/h/", correct: "🏠", correctWord: "House", wrongs: ["🐶", "🎈", "🦋"] },
  { letter: "L", sound: "/l/", correct: "🦁", correctWord: "Lion", wrongs: ["🐝", "🍎", "🌙"] },
  { letter: "M", sound: "/m/", correct: "🌙", correctWord: "Moon", wrongs: ["🐸", "🍊", "🐱"] },
  { letter: "S", sound: "/s/", correct: "⭐", correctWord: "Star", wrongs: ["🐝", "🏠", "🐸"] },
  { letter: "T", sound: "/t/", correct: "🌮", correctWord: "Taco", wrongs: ["🌸", "🦁", "🐶"] },
  { letter: "R", sound: "/r/", correct: "🌈", correctWord: "Rainbow", wrongs: ["🐱", "🌙", "🍎"] },
  { letter: "P", sound: "/p/", correct: "🍕", correctWord: "Pizza", wrongs: ["🐝", "🌺", "🐸"] },
  { letter: "A", sound: "/a/", correct: "🍎", correctWord: "Apple", wrongs: ["🌸", "🐶", "⭐"] },
];

const TOTAL_QUESTIONS = 8;

function buildRound(data: typeof PHONICS_DATA[0]) {
  const choices = [data.correct, ...data.wrongs].sort(() => Math.random() - 0.5);
  return { ...data, choices };
}

type Phase = "playing" | "correct" | "wrong" | "done";

export default function MercyPhonicsGame() {
  const router = useRouter();
  const [rounds] = useState(() => {
    const shuffled = [...PHONICS_DATA].sort(() => Math.random() - 0.5).slice(0, TOTAL_QUESTIONS);
    return shuffled.map(buildRound);
  });
  const [current, setCurrent] = useState(0);
  const [phase, setPhase] = useState<Phase>("playing");
  const [score, setScore] = useState(0);
  const [wrongChoice, setWrongChoice] = useState<string | null>(null);
  const [wiggle, setWiggle] = useState<string | null>(null);
  const [celebText, setCelebText] = useState("");

  const q = rounds[current];

  const handleNext = useCallback(() => {
    if (current + 1 >= rounds.length) {
      recordGameResult("mercy", "phonics", score, rounds.length);
      addXP("mercy", score * 10);
      recordSession("mercy", "phonics");
      checkBadges("mercy");
      setPhase("done");
    } else {
      setCurrent((c) => c + 1);
      setPhase("playing");
      setWrongChoice(null);
      setCelebText("");
    }
  }, [current, rounds.length, score]);

  useEffect(() => {
    if (phase === "correct") {
      const t = setTimeout(handleNext, 1800);
      return () => clearTimeout(t);
    }
  }, [phase, handleNext]);

  function handleAnswer(choice: string, e: React.MouseEvent<HTMLButtonElement>) {
    if (phase !== "playing") return;

    if (choice === q.correct) {
      setScore((s) => s + 1);
      setCelebText(`Yes! ${q.correctWord} starts with ${q.letter}! 🎉`);
      setPhase("correct");
      playCorrect();
      burstConfetti(e.clientX, e.clientY, COLOR);
    } else {
      setWrongChoice(choice);
      setWiggle(choice);
      setPhase("wrong");
      playWrong();
      setTimeout(() => {
        setWiggle(null);
        setPhase("playing");
        setWrongChoice(null);
      }, 900);
    }
  }

  // ── DONE SCREEN ─────────────────────────────────────────────────────────────
  if (phase === "done") {
    const pct = Math.round((score / rounds.length) * 100);
    return (
      <main
        className="min-h-screen flex flex-col items-center justify-center px-4 text-center"
        style={{ background: "linear-gradient(160deg, #fce7f3 0%, #fdf2f8 50%, #fff 100%)" }}
      >
        <div className="text-[8rem] mb-2 animate-bounce">🌺</div>
        <h1
          className="text-5xl font-black mb-3"
          style={{ color: COLOR, fontFamily: "Georgia, serif" }}
        >
          {pct >= 80 ? "Amazing, Mercy!" : pct >= 60 ? "Great job!" : "Good try!"}
        </h1>
        <p className="text-4xl font-black text-gray-400 mb-2">
          {score} / {rounds.length}
        </p>
        <p className="text-5xl font-black mb-8" style={{ color: COLOR }}>
          {pct}%
        </p>

        {/* Flower decorations */}
        <div className="flex gap-3 text-4xl mb-6">
          {Array.from({ length: Math.min(score, 8) }).map((_, i) => (
            <span key={i}>⭐</span>
          ))}
        </div>

        <div className="flex flex-col gap-3 w-full max-w-xs">
          <button
            onClick={() => router.push("/kids/mercy/hub")}
            className="py-5 rounded-3xl font-black text-white text-2xl shadow-xl hover:opacity-90 transition-all"
            style={{ backgroundColor: COLOR }}
          >
            All Done! 🌸
          </button>
          <button
            onClick={() => window.location.reload()}
            className="py-4 rounded-3xl font-black text-gray-600 bg-white text-xl shadow-md"
          >
            Play Again! 🔄
          </button>
        </div>
      </main>
    );
  }

  // ── GAME SCREEN ─────────────────────────────────────────────────────────────
  return (
    <main
      className="min-h-screen flex flex-col px-4 py-6 max-w-lg md:max-w-2xl mx-auto"
      style={{ background: "linear-gradient(160deg, #fce7f3 0%, #ffffff 70%)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => router.push("/kids/mercy/hub")}
          className="text-gray-400 hover:text-gray-600 text-sm font-medium"
        >
          ← Hub
        </button>
        <span className="text-2xl">🌸 Phonics</span>
        <span className="text-sm font-bold text-gray-500">
          {current + 1}/{rounds.length}
        </span>
      </div>

      {/* Progress bar, flowers */}
      <div className="flex gap-1 mb-5">
        {rounds.map((_, i) => (
          <div
            key={i}
            className="flex-1 rounded-full h-3 transition-all duration-300"
            style={{ backgroundColor: i < current ? COLOR : i === current ? COLOR + "88" : "#fce7f3" }}
          />
        ))}
      </div>

      {/* Letter */}
      <div className="flex flex-col items-center mb-6">
        <div
          className="rounded-3xl flex items-center justify-center shadow-xl mb-4"
          style={{
            backgroundColor: COLOR + "18",
            border: `4px solid ${COLOR}`,
            width: 140,
            height: 140,
          }}
        >
          <span
            className="font-black select-none"
            style={{ fontSize: "6rem", color: COLOR, lineHeight: 1 }}
          >
            {q.letter}
          </span>
        </div>
        <p className="text-2xl font-bold text-gray-500">
          Which one starts with <span style={{ color: COLOR }} className="font-black">{q.letter}</span>?
        </p>
        <p className="text-lg text-gray-400">It sounds like {q.sound} 🔊</p>
      </div>

      {/* Celebration banner */}
      {phase === "correct" && (
        <div
          className="rounded-3xl p-4 mb-4 text-center font-black text-2xl animate-bounce"
          style={{ backgroundColor: COLOR + "22", color: COLOR }}
        >
          {celebText}
        </div>
      )}

      {/* Choices, big 2×2 grid of emoji */}
      <div className="grid grid-cols-2 gap-4">
        {q.choices.map((choice) => {
          const isCorrect = phase === "correct" && choice === q.correct;
          const isWrong = choice === wrongChoice;

          return (
            <button
              key={choice}
              onClick={(e) => handleAnswer(choice, e)}
              disabled={phase === "correct"}
              className="rounded-3xl flex items-center justify-center shadow-lg transition-all duration-150 active:scale-95"
              style={{
                backgroundColor: isCorrect ? "#dcfce7" : isWrong ? "#fff0f3" : "#ffffff",
                border: isCorrect
                  ? "4px solid #16a34a"
                  : isWrong
                  ? `4px solid ${COLOR}88`
                  : `3px solid ${COLOR}33`,
                height: 110,
                animation: wiggle === choice ? "wiggle 0.5s ease-in-out" : undefined,
                transform: isCorrect ? "scale(1.05)" : undefined,
              }}
            >
              <span className="text-7xl select-none">{choice}</span>
            </button>
          );
        })}
      </div>

      <style>{`
        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg); }
          20% { transform: rotate(-8deg) scale(1.05); }
          40% { transform: rotate(8deg) scale(1.05); }
          60% { transform: rotate(-4deg); }
          80% { transform: rotate(4deg); }
        }
      `}</style>
    </main>
  );
}
