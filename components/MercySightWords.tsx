"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { burstConfetti } from "@/lib/confetti";
import { addXP, recordSession, checkBadges } from "@/lib/progress";
import { playCorrect, playWrong } from "@/lib/sounds";
import { recordGameResult } from "@/lib/family-data";

const COLOR = "#ec4899"; // Mercy pink

// 30-word sight word pool (Dolch pre-primer + primer)
const SIGHT_WORD_POOL = [
  "the", "and", "a", "to", "said", "in", "is", "it",
  "of", "you", "he", "was", "that", "she", "on", "they",
  "but", "at", "with", "all", "there", "out", "be", "have",
  "am", "do", "did", "not", "big", "go", "can", "see",
];

function pickWords(seed: string): string[] {
  // Deterministic shuffle from today's date so the same 10 words appear all day
  const today = new Date().toISOString().slice(0, 10);
  const combined = seed + today;
  let h = 0;
  for (let i = 0; i < combined.length; i++) {
    h = (Math.imul(31, h) + combined.charCodeAt(i)) | 0;
  }
  const pool = [...SIGHT_WORD_POOL];
  for (let i = pool.length - 1; i > 0; i--) {
    h = (h * 1664525 + 1013904223) & 0x7fffffff;
    const j = h % (i + 1);
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, 10);
}

function makeChoices(word: string, allWords: string[]): string[] {
  const distractors = allWords.filter((w) => w !== word);
  const shuffled = [...distractors].sort(() => Math.random() - 0.5).slice(0, 2);
  const choices = [word, ...shuffled].sort(() => Math.random() - 0.5);
  return choices;
}

interface Round {
  word: string;
  choices: string[];
}

export default function MercySightWords() {
  const router = useRouter();
  const [rounds] = useState<Round[]>(() => {
    const words = pickWords("mercy-sightwords");
    return words.map((w) => ({ word: w, choices: makeChoices(w, words) }));
  });
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [phase, setPhase] = useState<"playing" | "correct" | "wrong" | "done">("playing");
  const [wrongChoice, setWrongChoice] = useState<string | null>(null);
  const [wiggle, setWiggle] = useState<string | null>(null);
  const [celebration, setCelebration] = useState("");

  function handleAnswer(choice: string, e: React.MouseEvent<HTMLButtonElement>) {
    if (phase !== "playing") return;
    const r = rounds[current];
    if (choice === r.word) {
      setScore((s) => s + 1);
      setPhase("correct");
      setCelebration(`You read "${r.word}"! 📚`);
      playCorrect();
      burstConfetti(e.clientX, e.clientY, COLOR);
    } else {
      playWrong();
      setWrongChoice(choice);
      setWiggle(choice);
      setPhase("wrong");
      setTimeout(() => {
        setWiggle(null);
        setPhase("playing");
        setWrongChoice(null);
      }, 900);
    }
  }

  const handleNext = useCallback(() => {
    if (current + 1 >= rounds.length) {
      addXP("mercy", score * 10);
      recordSession("mercy", "sightwords");
      checkBadges("mercy");
      recordGameResult("mercy", "sightwords", score, rounds.length);
      setPhase("done");
    } else {
      setCurrent((c) => c + 1);
      setPhase("playing");
      setWrongChoice(null);
      setCelebration("");
    }
  }, [current, rounds.length, score]);

  useEffect(() => {
    if (phase === "correct") {
      const t = setTimeout(handleNext, 1100);
      return () => clearTimeout(t);
    }
  }, [phase, handleNext]);

  // ── DONE ───────────────────────────────────────────────────────────────────
  if (phase === "done") {
    return (
      <main
        className="min-h-screen flex flex-col items-center justify-center px-4 text-center"
        style={{ background: "linear-gradient(160deg, #fce7f3 0%, #fff 60%)" }}
      >
        <div className="text-[9rem] mb-4 animate-bounce">📚</div>
        <div className="text-6xl mb-3">🎉🌸🎉</div>
        <p className="text-4xl font-black text-pink-500 mb-2">
          {score} / {rounds.length}
        </p>
        <p className="text-xl text-gray-500 mb-8">
          {score >= 8 ? "Amazing reading! 🌟" : score >= 5 ? "Great job! 🌸" : "Keep practicing! 💪"}
        </p>
        <div className="flex flex-col gap-4 w-full max-w-xs">
          <button
            onClick={() => { window.location.reload(); }}
            className="py-6 rounded-3xl font-black text-white text-2xl shadow-xl"
            style={{ backgroundColor: COLOR }}
          >
            Play Again! 📚
          </button>
          <button
            onClick={() => router.push("/kids/mercy/hub")}
            className="py-5 rounded-3xl font-black text-gray-600 bg-white text-xl shadow-md"
          >
            Hub 🏠
          </button>
        </div>
      </main>
    );
  }

  // ── GAME ───────────────────────────────────────────────────────────────────
  const r = rounds[current];

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-between px-4 py-6"
      style={{ background: "linear-gradient(160deg, #fce7f3 0%, #fff9fb 100%)" }}
    >
      {/* Progress dots */}
      <div className="flex gap-2 mt-2">
        {rounds.map((_, i) => (
          <div
            key={i}
            className="rounded-full transition-all duration-300"
            style={{
              width: i === current ? 20 : 10,
              height: 10,
              backgroundColor: i < current ? COLOR : i === current ? COLOR : "#e5e7eb",
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center w-full">
        {/* Big word display */}
        <div
          className="font-black text-center mb-4 select-none tracking-wide"
          style={{ fontSize: "5rem", color: COLOR, textShadow: "2px 2px 0 rgba(0,0,0,0.08)" }}
        >
          {r.word}
        </div>

        <p className="text-2xl text-gray-500 font-bold mb-8">Tap this word! 👆</p>

        {/* Celebration flash */}
        {phase === "correct" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
            <div className="text-[7rem] animate-bounce">⭐</div>
            <div className="text-2xl font-black text-pink-500 mt-2">{celebration}</div>
          </div>
        )}

        {/* Choices */}
        <div className="flex flex-col gap-4 w-full max-w-xs">
          {r.choices.map((choice) => {
            const isCorrect = phase === "correct" && choice === r.word;
            const isWrong = choice === wrongChoice;

            return (
              <button
                key={choice}
                onClick={(e) => handleAnswer(choice, e)}
                disabled={phase === "correct"}
                className="rounded-3xl py-5 shadow-lg flex items-center justify-center transition-all duration-150 active:scale-95"
                style={{
                  backgroundColor: isCorrect ? "#dcfce7" : isWrong ? "#fee2e2" : "#ffffff",
                  border: isCorrect
                    ? "4px solid #16a34a"
                    : isWrong
                    ? "4px solid #dc2626"
                    : `3px solid ${COLOR}30`,
                  animation: wiggle === choice ? "wiggle 0.5s ease-in-out" : undefined,
                  transform: isCorrect ? "scale(1.05)" : undefined,
                }}
              >
                <span
                  className="font-black select-none tracking-wide"
                  style={{ fontSize: "2.5rem", color: isCorrect ? "#15803d" : isWrong ? "#dc2626" : "#374151" }}
                >
                  {choice}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <button
        onClick={() => router.push("/kids/mercy/hub")}
        className="mt-4 text-gray-400 text-lg"
      >
        🏠 Hub
      </button>

      <style>{`
        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg); }
          20% { transform: rotate(-8deg) scale(1.05); }
          40% { transform: rotate(8deg) scale(1.05); }
          60% { transform: rotate(-6deg); }
          80% { transform: rotate(6deg); }
        }
      `}</style>
    </main>
  );
}
