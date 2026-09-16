"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { getTitusSettings } from "@/lib/titus-settings";

const TITUS_BLUE = "#2563eb";
const SESSION_SIZE = 5;

// ── Word bank ─────────────────────────────────────────────────────────────────
type Difficulty = "easy" | "medium" | "hard";

const WORD_BANK: Record<Difficulty, string[]> = {
  easy:   ["cat", "dog", "sit", "the", "and", "God", "man", "can", "run", "big"],
  medium: ["math", "lion", "king", "pray", "read", "book", "star", "land", "fish", "corn"],
  hard:   ["brave", "fight", "grace", "earth", "seven", "eight", "three", "bible", "truth", "cross"],
};

function pickWords(size: number): string[] {
  // weighted: 50% easy, 35% medium, 15% hard
  const result: string[] = [];
  const seen = new Set<string>();
  const weights: Array<[Difficulty, number]> = [["easy", 0.5], ["medium", 0.35], ["hard", 0.15]];

  while (result.length < size) {
    const r = Math.random();
    let tier: Difficulty = "easy";
    if (r > 0.85) tier = "hard";
    else if (r > 0.5) tier = "medium";
    const pool = WORD_BANK[tier];
    const word = pool[Math.floor(Math.random() * pool.length)];
    if (!seen.has(word)) {
      seen.add(word);
      result.push(word);
    }
  }
  return result;
}

// ── Visual keyboard ───────────────────────────────────────────────────────────
const ROWS = [
  ["Q","W","E","R","T","Y","U","I","O","P"],
  ["A","S","D","F","G","H","J","K","L"],
  ["Z","X","C","V","B","N","M"],
  [" "],
];

function KeyboardDisplay({ target }: { target: string }) {
  const tgt = target === " " ? " " : target.toUpperCase();
  return (
    <div className="flex flex-col items-center gap-1.5 mt-4 select-none">
      {ROWS.map((row, ri) => (
        <div key={ri} className="flex gap-1.5">
          {row.map((k, ki) => {
            const isSpace = k === " ";
            const isTarget = isSpace ? tgt === " " : k === tgt;
            return (
              <div
                key={`${ri}-${ki}`}
                className="rounded-lg flex items-center justify-center font-black text-xs shadow transition-all duration-150"
                style={{
                  width: isSpace ? 160 : 32,
                  height: 32,
                  backgroundColor: isTarget ? TITUS_BLUE : "rgba(255,255,255,0.10)",
                  color: isTarget ? "#fff" : "rgba(255,255,255,0.45)",
                  boxShadow: isTarget ? `0 0 10px ${TITUS_BLUE}bb` : undefined,
                  transform: isTarget ? "scale(1.1)" : undefined,
                }}
              >
                {isSpace ? "SPACE" : k}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

// ── Audio helpers ─────────────────────────────────────────────────────────────
function playTone(freq: number, duration = 0.15, type: OscillatorType = "sine") {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = freq;
    osc.type = type;
    gain.gain.setValueAtTime(0.35, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch {
    // no audio context
  }
}

// ── Types ─────────────────────────────────────────────────────────────────────
interface TypingHistoryEntry {
  date: string;
  wpm: number;
  accuracy: number;
}

type Phase = "preview" | "typing" | "wordDone" | "sessionDone";

export default function TitusTyping() {
  const router = useRouter();
  const soundEnabled = getTitusSettings().soundEnabled;

  const [words] = useState<string[]>(() => pickWords(SESSION_SIZE));
  const [wordIndex, setWordIndex] = useState(0);
  const [typed, setTyped] = useState("");
  const [phase, setPhase] = useState<Phase>("preview");
  const [errors, setErrors] = useState(0);
  const [totalChars, setTotalChars] = useState(0);
  const startTimeRef = useRef<number>(0);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);

  const currentWord = words[wordIndex] ?? "";
  const targetChar = currentWord[typed.length] ?? "";

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (phase !== "typing") return;
      if (e.key === "Backspace") return; // no backspace, keep moving forward
      if (e.key.length !== 1 && e.key !== "Space") return;

      const ch = e.key === "Space" ? " " : e.key;
      const expected = currentWord[typed.length];

      if (ch === expected) {
        if (soundEnabled) playTone(660);
        const newTyped = typed + ch;
        setTyped(newTyped);
        setTotalChars((t) => t + 1);

        if (newTyped === currentWord) {
          // word complete
          if (soundEnabled) setTimeout(() => playTone(880), 100);
          setPhase("wordDone");
          const elapsed = (Date.now() - startTimeRef.current) / 1000 / 60;
          const wordsTyped = wordIndex + 1;
          const rawWpm = elapsed > 0 ? Math.round(wordsTyped / elapsed) : 0;
          const acc =
            totalChars + 1 > 0
              ? Math.round(((totalChars + 1) / (totalChars + 1 + errors)) * 100)
              : 100;
          setWpm(rawWpm);
          setAccuracy(acc);

          setTimeout(() => {
            const nextIndex = wordIndex + 1;
            if (nextIndex >= SESSION_SIZE) {
              // save history
              const entry: TypingHistoryEntry = {
                date: new Date().toISOString().slice(0, 10),
                wpm: rawWpm,
                accuracy: acc,
              };
              try {
                const raw = localStorage.getItem("titus-typing-history");
                const history: TypingHistoryEntry[] = raw ? JSON.parse(raw) : [];
                history.push(entry);
                localStorage.setItem("titus-typing-history", JSON.stringify(history.slice(-50)));
              } catch {
                // ignore
              }
              setPhase("sessionDone");
            } else {
              setWordIndex(nextIndex);
              setTyped("");
              setPhase("typing");
            }
          }, 500);
        }
      } else {
        if (soundEnabled) playTone(200, 0.2, "square");
        setErrors((err) => err + 1);
      }
    },
    [phase, currentWord, typed, wordIndex, errors, totalChars, soundEnabled]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  function startSession() {
    startTimeRef.current = Date.now();
    setPhase("typing");
  }

  function resetSession() {
    window.location.reload();
  }

  // ── Preview screen ────────────────────────────────────────────────────────
  if (phase === "preview") {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-6 px-4 relative"
        style={{ background: "linear-gradient(160deg, #1e3a8a 0%, #1e1b4b 100%)" }}
      >
        <button
          onClick={() => router.push("/kids/titus/hub")}
          className="absolute top-5 left-4 text-blue-300 text-sm font-bold hover:text-white transition-colors"
        >
          ← Hub
        </button>
        <div className="text-6xl">🎣</div>
        <h1 className="text-white font-black text-3xl text-center">Typing Practice</h1>
        <div
          className="rounded-2xl px-8 py-5 text-center shadow-xl"
          style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
        >
          <p className="text-blue-200 text-lg font-bold">Today: {SESSION_SIZE} words</p>
          <p className="text-blue-300 text-sm mt-1">Type each word as it appears. Ready?</p>
        </div>
        <button
          onClick={startSession}
          className="px-8 py-4 rounded-2xl font-black text-white text-xl shadow-lg hover:scale-105 active:scale-95 transition-all"
          style={{ backgroundColor: TITUS_BLUE }}
        >
          Ready! →
        </button>
      </div>
    );
  }

  // ── Session done ──────────────────────────────────────────────────────────
  if (phase === "sessionDone") {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-6 px-4"
        style={{ background: "linear-gradient(160deg, #1e3a8a 0%, #1e1b4b 100%)" }}
      >
        <div className="text-6xl animate-bounce">🎣</div>
        <h1 className="text-white font-black text-3xl">You did it!</h1>
        <p className="text-blue-200 text-lg">You typed {SESSION_SIZE} words! Nice work 🎣</p>
        <div
          className="rounded-2xl px-8 py-5 grid grid-cols-2 gap-6 shadow-xl"
          style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
        >
          <div className="text-center">
            <div className="text-4xl font-black text-white">{wpm}</div>
            <div className="text-blue-300 text-sm">WPM</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-black text-white">{accuracy}%</div>
            <div className="text-blue-300 text-sm">Accuracy</div>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={resetSession}
            className="px-8 py-4 rounded-2xl font-black text-white text-lg shadow-lg hover:scale-105 active:scale-95 transition-all"
            style={{ backgroundColor: TITUS_BLUE }}
          >
            Do 5 more? →
          </button>
          <button
            onClick={() => router.push("/kids/titus/hub")}
            className="px-6 py-4 rounded-2xl font-bold text-blue-300 text-base hover:text-white transition-colors"
            style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
          >
            ← Hub
          </button>
        </div>
      </div>
    );
  }

  // ── Typing screen ─────────────────────────────────────────────────────────
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 pb-10 select-none"
      style={{ background: "linear-gradient(160deg, #1e3a8a 0%, #1e1b4b 100%)" }}
    >
      {/* Progress */}
      <div className="w-full max-w-sm flex justify-between mb-6">
        <span className="text-blue-300 font-bold text-sm">
          Word {wordIndex + 1} of {SESSION_SIZE}
        </span>
      </div>
      <div className="flex gap-2 mb-8">
        {Array.from({ length: SESSION_SIZE }).map((_, i) => (
          <div
            key={i}
            className="w-3 h-3 rounded-full"
            style={{
              backgroundColor: i < wordIndex ? TITUS_BLUE : "rgba(37,99,235,0.25)",
            }}
          />
        ))}
      </div>

      {/* Word display */}
      <div
        className="rounded-3xl px-10 py-8 mb-6 shadow-2xl"
        style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
      >
        <div className="flex gap-1 justify-center">
          {currentWord.split("").map((ch, i) => {
            let color: string;
            if (i < typed.length) color = TITUS_BLUE;
            else if (i === typed.length) color = "#ffffff";
            else color = "rgba(255,255,255,0.3)";

            return (
              <span
                key={i}
                className="font-black"
                style={{
                  fontSize: "3.5rem",
                  color,
                  textDecoration: i === typed.length ? "underline" : "none",
                  textDecorationColor: TITUS_BLUE,
                }}
              >
                {ch}
              </span>
            );
          })}
        </div>
      </div>

      {phase === "wordDone" && (
        <p className="text-green-400 font-black text-xl mb-4 animate-pulse">✓ Nice!</p>
      )}

      <KeyboardDisplay target={targetChar} />
    </div>
  );
}
