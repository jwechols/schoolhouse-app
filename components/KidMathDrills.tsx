"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import type { KidProfile } from "@/lib/kids";
import { recordGameResult } from "@/lib/family-data";

interface Props {
  profile: KidProfile;
}

interface Problem {
  a: number;
  b: number;
  answer: number;
}

function newProblem(): Problem {
  const a = Math.floor(Math.random() * 4) + 2;
  const b = Math.floor(Math.random() * 9) + 1;
  return { a, b, answer: a * b };
}

const DRILL_SECONDS = 60;

export default function KidMathDrills({ profile }: Props) {
  const router = useRouter();
  const [phase, setPhase] = useState<"ready" | "playing" | "done">("ready");
  const [problem, setProblem] = useState<Problem>(newProblem);
  const [input, setInput] = useState("");
  const [timeLeft, setTimeLeft] = useState(DRILL_SECONDS);
  const [displayCorrect, setDisplayCorrect] = useState(0);
  const [flash, setFlash] = useState<"correct" | "wrong" | null>(null);
  const [summary, setSummary] = useState({ correct: 0, attempted: 0 });
  const inputRef = useRef<HTMLInputElement>(null);
  const correctRef = useRef(0);
  const attemptedRef = useRef(0);

  useEffect(() => {
    if (phase !== "playing") return;
    correctRef.current = 0;
    attemptedRef.current = 0;
    setDisplayCorrect(0);
    setTimeLeft(DRILL_SECONDS);

    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timer);
          recordGameResult(
            profile.id,
            "math",
            correctRef.current,
            Math.max(attemptedRef.current, 1)
          );
          setSummary({ correct: correctRef.current, attempted: attemptedRef.current });
          setPhase("done");
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [phase, profile.id]);

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value.replace(/\D/g, "");
    setInput(val);
    if (val && parseInt(val, 10) === problem.answer) {
      correctRef.current += 1;
      attemptedRef.current += 1;
      setDisplayCorrect(correctRef.current);
      setFlash("correct");
      setProblem(newProblem());
      setInput("");
      setTimeout(() => setFlash(null), 350);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && input) {
      if (parseInt(input, 10) !== problem.answer) {
        attemptedRef.current += 1;
        setFlash("wrong");
        setInput("");
        setTimeout(() => setFlash(null), 350);
      }
    }
  }

  function startGame() {
    setProblem(newProblem());
    setInput("");
    setFlash(null);
    setPhase("playing");
    setTimeout(() => inputRef.current?.focus(), 100);
  }

  if (phase === "ready") {
    return (
      <main
        className="min-h-screen flex flex-col items-center justify-center px-4"
        style={{ background: `linear-gradient(160deg, ${profile.colorHex}22 0%, #fff 100%)` }}
      >
        <div className="text-8xl mb-4">✖️</div>
        <h1 className="text-4xl font-black text-gray-800 mb-2">Math Drills</h1>
        <p className="text-gray-500 text-lg mb-1">Times tables 2–5</p>
        <p className="text-gray-400 mb-8">60 seconds, how many can you get?</p>
        <button
          onClick={startGame}
          className="px-12 py-5 rounded-3xl font-black text-white text-2xl shadow-xl hover:opacity-90 transition-all"
          style={{ backgroundColor: profile.colorHex }}
        >
          Start! 🚀
        </button>
        <button
          onClick={() => router.push(`/kids/${profile.id}/hub`)}
          className="mt-5 text-sm text-gray-400 underline hover:text-gray-600"
        >
          Back to Hub
        </button>
      </main>
    );
  }

  if (phase === "done") {
    const accuracy = summary.attempted > 0 ? Math.round((summary.correct / summary.attempted) * 100) : 0;
    return (
      <main
        className="min-h-screen flex flex-col items-center justify-center px-4"
        style={{ background: `linear-gradient(160deg, ${profile.colorHex}22 0%, #fff 100%)` }}
      >
        <div className="text-8xl mb-4">
          {summary.correct >= 20 ? "🏆" : summary.correct >= 10 ? "⭐" : "💪"}
        </div>
        <h1 className="text-4xl font-black text-gray-800 mb-4">Time&apos;s Up!</h1>
        <p className="text-7xl font-black mb-2" style={{ color: profile.colorHex }}>{summary.correct}</p>
        <p className="text-gray-400 mb-1">correct answers in 60 seconds</p>
        <p className="text-gray-500 mb-8">{summary.attempted} attempted &bull; {accuracy}% accuracy</p>
        <div className="flex gap-4 flex-wrap justify-center">
          <button
            onClick={startGame}
            className="px-8 py-4 rounded-3xl font-black text-white text-lg shadow-lg hover:opacity-90 transition-all"
            style={{ backgroundColor: profile.colorHex }}
          >
            Play Again 🎉
          </button>
          <button
            onClick={() => router.push(`/kids/${profile.id}/hub`)}
            className="px-8 py-4 rounded-3xl font-black text-gray-600 bg-gray-100 hover:bg-gray-200 text-lg transition-all"
          >
            Hub 🏠
          </button>
        </div>
      </main>
    );
  }

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-4 transition-colors duration-200"
      style={{
        background:
          flash === "correct" ? "#dcfce7" :
          flash === "wrong" ? "#fee2e2" :
          `linear-gradient(160deg, ${profile.colorHex}10 0%, #fff 100%)`,
      }}
    >
      <div className="flex gap-12 mb-10">
        <div className="text-center">
          <div className={`text-5xl font-black ${timeLeft <= 10 ? "text-red-500" : "text-gray-700"}`}>
            {timeLeft}
          </div>
          <div className="text-xs text-gray-400 mt-1">seconds</div>
        </div>
        <div className="text-center">
          <div className="text-5xl font-black" style={{ color: profile.colorHex }}>{displayCorrect}</div>
          <div className="text-xs text-gray-400 mt-1">correct</div>
        </div>
      </div>

      <div className="text-7xl font-black text-gray-800 mb-10 tracking-tight">
        {problem.a} &times; {problem.b} = ?
      </div>

      <input
        ref={inputRef}
        type="number"
        value={input}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        placeholder="?"
        inputMode="numeric"
        autoComplete="off"
        className="text-5xl font-black text-center w-44 h-24 border-4 rounded-3xl focus:outline-none transition-colors"
        style={{
          borderColor:
            flash === "correct" ? "#16a34a" :
            flash === "wrong" ? "#dc2626" :
            profile.colorHex,
        }}
      />
      <p className="text-sm text-gray-400 mt-5">Type the answer, auto-checks! Press Enter for wrong guesses.</p>

      <button
        onClick={() => router.push(`/kids/${profile.id}/hub`)}
        className="mt-8 text-sm text-gray-400 underline hover:text-gray-600"
      >
        Quit
      </button>
    </main>
  );
}
