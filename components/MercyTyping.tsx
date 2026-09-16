"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";

const MERCY_PINK = "#ec4899";
const SESSION_LENGTH = 15;

// Level letter pools
const LEVEL_POOLS: Record<number, string[]> = {
  1: "ABCDEFGHIJKLM".split(""),
  2: "NOPQRSTUVWXYZ".split(""),
  3: "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""),
};

function getLevel(): number {
  if (typeof window === "undefined") return 1;
  return parseInt(localStorage.getItem("mercy-typing-level") ?? "1", 10) || 1;
}

function saveLevel(level: number) {
  if (typeof window !== "undefined") {
    localStorage.setItem("mercy-typing-level", String(level));
  }
}

function pickLetter(pool: string[], last: string | null): string {
  const filtered = pool.filter((l) => l !== last);
  return filtered[Math.floor(Math.random() * filtered.length)];
}

// ── Simple visual keyboard ────────────────────────────────────────────────────
const ROWS = [
  ["Q","W","E","R","T","Y","U","I","O","P"],
  ["A","S","D","F","G","H","J","K","L"],
  ["Z","X","C","V","B","N","M"],
];

function KeyboardDisplay({ target }: { target: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5 mt-6 select-none">
      {ROWS.map((row, ri) => (
        <div key={ri} className="flex gap-1.5">
          {row.map((k) => {
            const isTarget = k === target.toUpperCase();
            return (
              <div
                key={k}
                className="w-9 h-9 rounded-lg flex items-center justify-center font-black text-sm shadow-md transition-all duration-150"
                style={{
                  backgroundColor: isTarget ? MERCY_PINK : "rgba(255,255,255,0.12)",
                  color: isTarget ? "#fff" : "rgba(255,255,255,0.5)",
                  boxShadow: isTarget ? `0 0 12px ${MERCY_PINK}aa` : undefined,
                  transform: isTarget ? "scale(1.15)" : undefined,
                }}
              >
                {k}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

// ── Chime via Web Audio ───────────────────────────────────────────────────────
function playChime(freq = 880, duration = 0.18) {
  if (typeof window === "undefined") return;
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = freq;
    osc.type = "sine";
    gain.gain.setValueAtTime(0.4, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  } catch {
    // audio not available
  }
}

type Phase = "playing" | "celebration" | "done";

export default function MercyTyping() {
  const router = useRouter();
  const [level, setLevel] = useState(1);
  const [pool, setPool] = useState<string[]>([]);
  const [target, setTarget] = useState<string>("A");
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(false);
  const [phase, setPhase] = useState<Phase>("playing");
  const lastLetterRef = useRef<string | null>(null);

  useEffect(() => {
    const lv = Math.min(3, Math.max(1, getLevel()));
    setLevel(lv);
    const p = LEVEL_POOLS[lv] ?? LEVEL_POOLS[1];
    setPool(p);
    setTarget(pickLetter(p, null));
  }, []);

  const nextLetter = useCallback(
    (currentPool: string[], currentTarget: string) => {
      const next = pickLetter(currentPool, currentTarget);
      lastLetterRef.current = currentTarget;
      setTarget(next);
      setWrong(false);
    },
    []
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (phase !== "playing") return;
      if (e.key.length !== 1) return;
      const pressed = e.key.toUpperCase();
      if (pressed === target.toUpperCase()) {
        playChime(880);
        const newCorrect = correct + 1;
        setPhase("celebration");
        setTimeout(() => {
          if (newCorrect >= SESSION_LENGTH) {
            setCorrect(newCorrect);
            setPhase("done");
          } else {
            setCorrect(newCorrect);
            nextLetter(pool, target);
            setPhase("playing");
          }
        }, 700);
      } else {
        playChime(220, 0.25);
        setWrong(true);
        setTimeout(() => setWrong(false), 600);
      }
    },
    [phase, target, correct, pool, nextLetter]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  function handleLevelUp() {
    const next = Math.min(3, level + 1);
    saveLevel(next);
    setLevel(next);
    const p = LEVEL_POOLS[next] ?? LEVEL_POOLS[1];
    setPool(p);
    setCorrect(0);
    setTarget(pickLetter(p, null));
    setPhase("playing");
  }

  function handleReplay() {
    setCorrect(0);
    setTarget(pickLetter(pool, null));
    setPhase("playing");
    setWrong(false);
  }

  if (phase === "done") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4"
        style={{ background: "linear-gradient(160deg, #fce7f3 0%, #fbcfe8 100%)" }}>
        <div className="text-7xl animate-bounce">🌸</div>
        <h1 className="text-4xl font-black text-pink-700">Amazing, Mercy!</h1>
        <p className="text-pink-600 text-xl font-bold">You found all {SESSION_LENGTH} letters!</p>
        <div className="flex gap-4 flex-wrap justify-center">
          <button
            onClick={handleReplay}
            className="px-6 py-3 rounded-2xl font-black text-white text-lg shadow-lg"
            style={{ backgroundColor: MERCY_PINK }}
          >
            Play Again
          </button>
          {level < 3 && (
            <button
              onClick={handleLevelUp}
              className="px-6 py-3 rounded-2xl font-black text-white text-lg shadow-lg"
              style={{ backgroundColor: "#a855f7" }}
            >
              Next Level →
            </button>
          )}
          <button
            onClick={() => router.push("/kids/mercy/hub")}
            className="px-6 py-3 rounded-2xl font-bold text-pink-600 text-base hover:bg-pink-100 transition-colors"
            style={{ backgroundColor: "rgba(236,72,153,0.08)", border: "2px solid #f9a8d4" }}
          >
            ← Hub
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 pb-10 select-none"
      style={{ background: "linear-gradient(160deg, #fce7f3 0%, #fbcfe8 100%)" }}
    >
      {/* Header */}
      <div className="w-full max-w-sm flex justify-between items-center mb-6">
        <button
          onClick={() => router.push("/kids/mercy/hub")}
          className="text-pink-400 font-bold text-sm hover:text-pink-600 transition-colors"
        >
          ← Hub
        </button>
        <span className="text-pink-500 font-bold text-sm">Level {level} of 3</span>
        <span className="text-pink-600 font-black text-sm">
          {correct} / {SESSION_LENGTH} ✓
        </span>
      </div>

      {/* Progress dots */}
      <div className="flex gap-2 mb-8">
        {Array.from({ length: SESSION_LENGTH }).map((_, i) => (
          <div
            key={i}
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: i < correct ? MERCY_PINK : "rgba(236,72,153,0.2)" }}
          />
        ))}
      </div>

      {/* Big target letter */}
      <div
        className="rounded-3xl flex items-center justify-center shadow-2xl mb-4"
        style={{
          width: 180,
          height: 180,
          backgroundColor: phase === "celebration" ? "#bbf7d0" : "#fff",
          border: `6px solid ${MERCY_PINK}`,
          transition: "background-color 0.2s",
        }}
      >
        <span
          className="font-black select-none"
          style={{
            fontSize: "8rem",
            color: phase === "celebration" ? "#16a34a" : MERCY_PINK,
            lineHeight: 1,
          }}
        >
          {phase === "celebration" ? "✓" : target}
        </span>
      </div>

      {/* Prompt */}
      <p className="text-pink-700 font-black text-xl mb-2">
        {phase === "celebration" ? "Yes! Great job! 🌸" : `Find the letter ${target} on your keyboard!`}
      </p>

      {wrong && (
        <p className="text-orange-500 font-bold text-base mb-2">
          Oops! Try again, find the {target} key 🔍
        </p>
      )}

      <KeyboardDisplay target={target} />
    </div>
  );
}
