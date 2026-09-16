"use client";

import React, { useEffect, useCallback } from "react";
import { useTTS } from "@/lib/tts";
import { useRouter } from "next/navigation";

const COLORS = [
  "#ef4444", "#f97316", "#eab308", "#22c55e",
  "#14b8a6", "#3b82f6", "#8b5cf6", "#ec4899",
  "#f43f5e", "#06b6d4", "#84cc16", "#a855f7",
];

const MAX_LETTERS = 8;

interface FallingLetter {
  id: number;
  char: string;
  color: string;
  x: number; // percent
  size: number; // rem
  opacity: number;
}

let nextId = 1;

function randomColor(): string {
  return COLORS[Math.floor(Math.random() * COLORS.length)];
}

export default function LoisTyping() {
  const router = useRouter();
  const [letters, setLetters] = React.useState<FallingLetter[]>([]);
  const [bgFlash, setBgFlash] = React.useState<string | null>(null);
  const { speak: ttsSpeak, unlockAudio } = useTTS("shimmer");

  const speak = useCallback((char: string) => {
    ttsSpeak(char.toUpperCase());
  }, [ttsSpeak]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Only letters and digits produce visible characters for Lois
      if (e.key.length !== 1) return;
      const char = e.key.toUpperCase();

      unlockAudio();
      speak(char);

      const flash = randomColor();
      setBgFlash(flash);
      setTimeout(() => setBgFlash(null), 350);

      setLetters((prev) => {
        const trimmed = prev.length >= MAX_LETTERS ? prev.slice(1) : prev;
        const newLetter: FallingLetter = {
          id: nextId++,
          char,
          color: randomColor(),
          x: 10 + Math.random() * 80,
          size: 5 + Math.random() * 4, // 5–9 rem
          opacity: 1,
        };
        return [...trimmed, newLetter];
      });
    },
    [speak]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div
      className="relative w-full min-h-screen overflow-hidden flex items-center justify-center select-none"
      style={{
        backgroundColor: bgFlash ?? "#1a1a2e",
        transition: bgFlash ? "background-color 0s" : "background-color 0.4s ease",
      }}
    >
      {/* Home button, top-left, always visible */}
      <button
        onClick={() => router.push("/kids/lois/hub")}
        style={{
          position: "absolute", top: 16, left: 16, zIndex: 10,
          background: "rgba(255,255,255,0.15)", border: "2px solid rgba(255,255,255,0.3)",
          borderRadius: 16, padding: "10px 18px",
          color: "white", fontSize: 18, fontWeight: 900, cursor: "pointer",
          backdropFilter: "blur(4px)",
        }}
        aria-label="Go back to hub"
      >
        🏠
      </button>

      {/* Subtle prompt when empty */}
      {letters.length === 0 && (
        <p className="text-white/30 text-2xl font-bold pointer-events-none select-none">
          Press any key!
        </p>
      )}

      {/* Falling letters */}
      {letters.map((l) => (
        <span
          key={l.id}
          className="absolute font-black pointer-events-none select-none letter-fall"
          style={{
            left: `${l.x}%`,
            top: 0,
            fontSize: `${l.size}rem`,
            color: l.color,
            textShadow: `0 0 20px ${l.color}88`,
            lineHeight: 1,
            // animation is defined in global CSS below via className
            animation: "letterFall 6s ease-in forwards",
          }}
        >
          {l.char}
        </span>
      ))}

      {/* Inject keyframe once */}
      <style>{`
        @keyframes letterFall {
          0%   { transform: translateY(-10px) scale(1.4); opacity: 1; }
          60%  { opacity: 1; }
          100% { transform: translateY(95vh) scale(0.8); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
