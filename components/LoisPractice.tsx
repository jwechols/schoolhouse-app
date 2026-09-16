"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { burstConfetti } from "@/lib/confetti";
import { addXP, recordSession, checkBadges } from "@/lib/progress";
import { playCorrect, playWrong } from "@/lib/sounds";

// ── Game data ─────────────────────────────────────────────────────────────────

interface EmojiQuestion {
  prompt: string;   // "Find the 🐱"
  target: string;   // the correct emoji / letter / number
  choices: string[];
  kind: "emoji" | "abc" | "numbers" | "colors";
}

// Emoji matching game
const EMOJI_ROUNDS: EmojiQuestion[] = [
  { kind: "emoji", prompt: "Find the 🐱", target: "🐱", choices: ["🐱", "🐶", "🦊", "🐰"] },
  { kind: "emoji", prompt: "Find the 🐘", target: "🐘", choices: ["🦁", "🐘", "🐸", "🦋"] },
  { kind: "emoji", prompt: "Find the 🍎", target: "🍎", choices: ["🍊", "🍋", "🍎", "🍇"] },
  { kind: "emoji", prompt: "Find the ⭐", target: "⭐", choices: ["🌙", "☀️", "⭐", "❤️"] },
  { kind: "emoji", prompt: "Find the 🚂", target: "🚂", choices: ["🚗", "✈️", "🚲", "🚂"] },
  { kind: "emoji", prompt: "Find the 🦋", target: "🦋", choices: ["🐝", "🦋", "🐞", "🐛"] },
  { kind: "emoji", prompt: "Find the 🌸", target: "🌸", choices: ["🌻", "🌹", "🌸", "🌺"] },
  { kind: "emoji", prompt: "Find the 🐸", target: "🐸", choices: ["🐸", "🐊", "🦎", "🐢"] },
];

// ABC game, tap the right letter
const ABC_ROUNDS: EmojiQuestion[] = [
  { kind: "abc", prompt: "Tap the letter  A", target: "A", choices: ["B", "A", "C", "D"] },
  { kind: "abc", prompt: "Tap the letter  B", target: "B", choices: ["D", "C", "B", "A"] },
  { kind: "abc", prompt: "Tap the letter  C", target: "C", choices: ["C", "G", "O", "Q"] },
  { kind: "abc", prompt: "Tap the letter  D", target: "D", choices: ["B", "P", "D", "R"] },
  { kind: "abc", prompt: "Tap the letter  E", target: "E", choices: ["F", "E", "B", "L"] },
  { kind: "abc", prompt: "Tap the letter  S", target: "S", choices: ["Z", "S", "N", "M"] },
  { kind: "abc", prompt: "Tap the letter  T", target: "T", choices: ["T", "L", "I", "J"] },
  { kind: "abc", prompt: "Tap the letter  O", target: "O", choices: ["Q", "C", "G", "O"] },
];

// Numbers game, show that many emoji, tap the numeral
const NUMBER_ROUNDS: EmojiQuestion[] = [
  { kind: "numbers", prompt: "⭐", target: "1", choices: ["1", "2", "3", "4"] },
  { kind: "numbers", prompt: "⭐⭐", target: "2", choices: ["3", "2", "1", "4"] },
  { kind: "numbers", prompt: "🐶🐶🐶", target: "3", choices: ["2", "4", "3", "5"] },
  { kind: "numbers", prompt: "🍎🍎🍎🍎", target: "4", choices: ["3", "4", "5", "2"] },
  { kind: "numbers", prompt: "🌟🌟🌟🌟🌟", target: "5", choices: ["4", "5", "3", "6"] },
  { kind: "numbers", prompt: "🐱", target: "1", choices: ["2", "1", "3", "4"] },
  { kind: "numbers", prompt: "🦋🦋", target: "2", choices: ["1", "3", "2", "4"] },
  { kind: "numbers", prompt: "🍊🍊🍊🍊", target: "4", choices: ["5", "3", "4", "2"] },
];

// Colors game, show color word IN that color, tap the matching swatch
const COLOR_ROUNDS: EmojiQuestion[] = [
  {
    kind: "colors",
    prompt: "RED",
    target: "#ef4444",
    choices: ["#ef4444", "#3b82f6", "#22c55e", "#eab308"],
  },
  {
    kind: "colors",
    prompt: "BLUE",
    target: "#3b82f6",
    choices: ["#ef4444", "#3b82f6", "#22c55e", "#a855f7"],
  },
  {
    kind: "colors",
    prompt: "GREEN",
    target: "#22c55e",
    choices: ["#eab308", "#22c55e", "#ef4444", "#3b82f6"],
  },
  {
    kind: "colors",
    prompt: "YELLOW",
    target: "#eab308",
    choices: ["#3b82f6", "#ef4444", "#eab308", "#22c55e"],
  },
  {
    kind: "colors",
    prompt: "PURPLE",
    target: "#a855f7",
    choices: ["#a855f7", "#ef4444", "#22c55e", "#3b82f6"],
  },
  {
    kind: "colors",
    prompt: "ORANGE",
    target: "#f97316",
    choices: ["#ef4444", "#f97316", "#eab308", "#22c55e"],
  },
  {
    kind: "colors",
    prompt: "PINK",
    target: "#ec4899",
    choices: ["#a855f7", "#ec4899", "#ef4444", "#3b82f6"],
  },
  {
    kind: "colors",
    prompt: "RED",
    target: "#ef4444",
    choices: ["#22c55e", "#3b82f6", "#ef4444", "#a855f7"],
  },
];


type GameMode = "menu" | "emoji" | "abc" | "numbers" | "colors";

const GAME_CATALOG = [
  { id: "emoji" as GameMode, emoji: "🐱", label: "Find It!", bg: "#fde68a" },
  { id: "abc" as GameMode, emoji: "🔤", label: "ABC's", bg: "#bbf7d0" },
  { id: "numbers" as GameMode, emoji: "🔢", label: "Numbers", bg: "#bfdbfe" },
  { id: "colors" as GameMode, emoji: "🎨", label: "Colors", bg: "#f5d0fe" },
];

// ── Component ─────────────────────────────────────────────────────────────────

export default function LoisPractice() {
  const router = useRouter();
  const [mode, setMode] = useState<GameMode>("menu");
  const [questions, setQuestions] = useState<EmojiQuestion[]>([]);
  const [current, setCurrent] = useState(0);
  const [phase, setPhase] = useState<"playing" | "correct" | "wrong" | "done">("playing");
  const [wrongChoice, setWrongChoice] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [wiggle, setWiggle] = useState<string | null>(null);

  function startGame(g: GameMode) {
    const pool =
      g === "emoji" ? EMOJI_ROUNDS :
      g === "abc" ? ABC_ROUNDS :
      g === "numbers" ? NUMBER_ROUNDS :
      COLOR_ROUNDS;
    // Shuffle
    const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, 8);
    setQuestions(shuffled);
    setCurrent(0);
    setScore(0);
    setPhase("playing");
    setWrongChoice(null);
    setMode(g);
  }

  function handleAnswer(choice: string, e: React.MouseEvent<HTMLButtonElement>) {
    if (phase !== "playing") return;
    const q = questions[current];
    if (choice === q.target) {
      setScore((s) => s + 1);
      setPhase("correct");
      playCorrect();
      burstConfetti(e.clientX, e.clientY, "#f59e0b");
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
    if (current + 1 >= questions.length) {
      addXP("lois", score * 10);
      recordSession("lois", mode as string);
      checkBadges("lois");
      setPhase("done");
    } else {
      setCurrent((c) => c + 1);
      setPhase("playing");
      setWrongChoice(null);
    }
  }, [current, questions.length]);

  useEffect(() => {
    if (phase === "correct") {
      const t = setTimeout(handleNext, 1000);
      return () => clearTimeout(t);
    }
  }, [phase, handleNext]);

  // ── MENU ────────────────────────────────────────────────────────────────────
  if (mode === "menu") {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-4 py-8"
        style={{ background: "linear-gradient(160deg, #fef9c3 0%, #fce7f3 50%, #dbeafe 100%)" }}
      >
        <div className="text-8xl mb-4">❄️</div>
        <h1 className="text-5xl font-black text-center mb-2" style={{ color: "#f59e0b", fontFamily: "Georgia, serif" }}>
          Lois!
        </h1>
        <p className="text-2xl text-center text-gray-500 mb-8">Pick a game! 🎉</p>

        <div className="grid grid-cols-2 gap-5 w-full max-w-sm mb-8">
          {GAME_CATALOG.map((g) => (
            <button
              key={g.id}
              onClick={() => startGame(g.id)}
              className="rounded-3xl p-6 text-center shadow-lg active:scale-95 transition-all duration-150 hover:scale-105"
              style={{ backgroundColor: g.bg }}
            >
              <div className="text-7xl mb-2">{g.emoji}</div>
              <div className="text-xl font-black text-gray-700">{g.label}</div>
            </button>
          ))}
        </div>

        <button
          onClick={() => router.push("/kids/lois/hub")}
          className="text-gray-400 text-lg underline"
        >
          ← Back
        </button>
      </main>
    );
  }

  // ── DONE SCREEN ─────────────────────────────────────────────────────────────
  if (phase === "done") {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-4 text-center"
        style={{ background: "linear-gradient(160deg, #fef9c3 0%, #fce7f3 50%, #dbeafe 100%)" }}
      >
        <div className="text-[10rem] mb-4 animate-bounce">🌟</div>
        <div className="text-8xl mb-3">🎉🎊🎉</div>
        <p className="text-4xl font-black text-amber-500 mb-8">
          {score} / {questions.length}
        </p>
        <div className="flex flex-col gap-4 w-full max-w-xs">
          <button
            onClick={() => startGame(mode)}
            className="py-6 rounded-3xl font-black text-white text-2xl shadow-xl"
            style={{ backgroundColor: "#f59e0b" }}
          >
            Play Again! 🎮
          </button>
          <button
            onClick={() => setMode("menu")}
            className="py-5 rounded-3xl font-black text-gray-600 bg-white text-xl shadow-md"
          >
            Games 🏠
          </button>
        </div>
      </main>
    );
  }

  // ── GAME SCREEN ─────────────────────────────────────────────────────────────
  const q = questions[current];

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-between px-4 py-6"
      style={{ background: "linear-gradient(160deg, #fef9c3 0%, #fce7f3 100%)" }}
    >
      {/* Progress dots */}
      <div className="flex gap-2 mb-2">
        {questions.map((_, i) => (
          <div
            key={i}
            className="rounded-full transition-all duration-300"
            style={{
              width: i === current ? 20 : 10,
              height: 10,
              backgroundColor: i < current ? "#f59e0b" : i === current ? "#f59e0b" : "#e5e7eb",
            }}
          />
        ))}
      </div>

      {/* Prompt */}
      <div className="flex-1 flex flex-col items-center justify-center w-full">
        {q.kind === "colors" ? (
          // Color prompt: big word in that color
          <div
            className="text-8xl font-black tracking-wider mb-8 select-none"
            style={{ color: q.target, textShadow: "2px 2px 0 rgba(0,0,0,0.15)" }}
          >
            {q.prompt}
          </div>
        ) : q.kind === "numbers" ? (
          // Numbers: show the emoji count + instruction
          <div className="flex flex-col items-center gap-4 mb-8">
            <div className="text-7xl select-none leading-loose">{q.prompt}</div>
            <div className="text-3xl font-black text-gray-500">How many? 👆</div>
          </div>
        ) : q.kind === "abc" ? (
          // ABC: prompt text
          <div className="text-5xl font-black text-center text-indigo-600 mb-8 select-none">
            {q.prompt}
          </div>
        ) : (
          // Emoji find
          <div className="text-5xl font-black text-center text-gray-700 mb-8 select-none">
            {q.prompt}
          </div>
        )}

        {/* Correct flash */}
        {phase === "correct" && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            <div className="text-[8rem] animate-bounce">⭐</div>
          </div>
        )}

        {/* Choices */}
        <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
          {q.choices.map((choice) => {
            const isCorrect = phase === "correct" && choice === q.target;
            const isWrong = choice === wrongChoice;

            if (q.kind === "colors") {
              return (
                <button
                  key={choice}
                  onClick={(e) => handleAnswer(choice, e)}
                  disabled={phase === "correct"}
                  className="rounded-3xl shadow-lg active:scale-95 transition-all duration-150"
                  style={{
                    backgroundColor: choice,
                    height: 100,
                    border: isCorrect ? "6px solid #15803d" : isWrong ? "6px solid #dc2626" : "4px solid transparent",
                    animation: wiggle === choice ? "wiggle 0.5s ease-in-out" : undefined,
                    transform: isCorrect ? "scale(1.1)" : undefined,
                  }}
                >
                  {isCorrect && <span className="text-white text-4xl">✓</span>}
                </button>
              );
            }

            // ABC: big capital letters
            const isABC = q.kind === "abc";
            return (
              <button
                key={choice}
                onClick={(e) => handleAnswer(choice, e)}
                disabled={phase === "correct"}
                className="rounded-3xl p-4 shadow-lg flex items-center justify-center transition-all duration-150 active:scale-95"
                style={{
                  backgroundColor: isCorrect ? "#dcfce7" : isWrong ? "#fee2e2" : "#ffffff",
                  border: isCorrect ? "4px solid #16a34a" : isWrong ? "4px solid #dc2626" : "3px solid #e5e7eb",
                  animation: wiggle === choice ? "wiggle 0.5s ease-in-out" : undefined,
                  height: isABC ? 110 : 100,
                  transform: isCorrect ? "scale(1.05)" : undefined,
                }}
              >
                <span
                  className="font-black select-none"
                  style={{ fontSize: isABC ? "3.5rem" : "4rem" }}
                >
                  {choice}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <button
        onClick={() => setMode("menu")}
        className="mt-4 text-gray-400 text-lg"
      >
        🏠 Menu
      </button>

      {/* Wiggle animation */}
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
