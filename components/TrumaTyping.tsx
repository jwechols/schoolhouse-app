"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { TYPING_PASSAGES, type TypingPassage } from "@/lib/typing-content";

const TRUMA_NAVY = "#1b3a6b";
const TRUMA_GOLD = "#c48a1a";
const WPM_GOAL = 40;

// ── History helpers ───────────────────────────────────────────────────────────
interface TypingHistoryEntry {
  date: string;
  wpm: number;
  accuracy: number;
  passageId: string;
}

function loadHistory(): TypingHistoryEntry[] {
  try {
    const raw = localStorage.getItem("truma-typing-history");
    return raw ? (JSON.parse(raw) as TypingHistoryEntry[]) : [];
  } catch {
    return [];
  }
}

function saveHistory(entry: TypingHistoryEntry) {
  try {
    const history = loadHistory();
    history.push(entry);
    localStorage.setItem("truma-typing-history", JSON.stringify(history.slice(-100)));
  } catch {
    // ignore
  }
}

function getPersonalBest(): number {
  const history = loadHistory();
  return history.reduce((best, h) => Math.max(best, h.wpm), 0);
}

// ── Pick passages ─────────────────────────────────────────────────────────────
function pickPassages(count: number): TypingPassage[] {
  const shuffled = [...TYPING_PASSAGES].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// ── Category badge colors ─────────────────────────────────────────────────────
const CATEGORY_COLORS: Record<string, string> = {
  verse:     "#16a34a",
  catechism: "#7c3aed",
  quote:     "#0369a1",
  history:   "#b45309",
};

// ── Mode selection ─────────────────────────────────────────────────────────────
type Mode = "select" | "practice" | "challenge";
type Phase = "typing" | "complete";

// ── Main component ─────────────────────────────────────────────────────────────
export default function TrumaTyping() {
  const [mode, setMode] = useState<Mode>("select");
  const [passages, setPassages] = useState<TypingPassage[]>([]);
  const [passageIndex, setPassageIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("typing");

  // Typing state
  const [typed, setTyped] = useState("");
  const [errors, setErrors] = useState(0); // cumulative wrong presses
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const startTimeRef = useRef<number>(0);
  const wpmTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [personalBest, setPersonalBest] = useState(0);
  const [isNewPB, setIsNewPB] = useState(false);
  const [challengeScores, setChallengeScores] = useState<Array<{ wpm: number; accuracy: number }>>([]);

  // Challenge mode: how many done
  const [challengeDone, setChallengeDone] = useState(0);

  useEffect(() => {
    setPersonalBest(getPersonalBest());
  }, []);

  // ── WPM live update ──────────────────────────────────────────────────────
  useEffect(() => {
    if (phase === "typing" && mode !== "select") {
      wpmTimerRef.current = setInterval(() => {
        const elapsed = (Date.now() - startTimeRef.current) / 1000 / 60;
        const wordsTyped = typed.split(" ").length;
        if (elapsed > 0) setWpm(Math.round(wordsTyped / elapsed));
      }, 5000);
    }
    return () => {
      if (wpmTimerRef.current) clearInterval(wpmTimerRef.current);
    };
  }, [phase, mode, typed]);

  // ── Start a session ──────────────────────────────────────────────────────
  function startPractice() {
    const p = pickPassages(1);
    setPassages(p);
    setPassageIndex(0);
    setTyped("");
    setErrors(0);
    setWpm(0);
    setAccuracy(100);
    setPhase("typing");
    setMode("practice");
    startTimeRef.current = Date.now();
  }

  function startChallenge() {
    const p = pickPassages(3);
    setPassages(p);
    setPassageIndex(0);
    setTyped("");
    setErrors(0);
    setWpm(0);
    setAccuracy(100);
    setPhase("typing");
    setMode("challenge");
    setChallengeScores([]);
    setChallengeDone(0);
    startTimeRef.current = Date.now();
  }

  // ── Keydown handler ───────────────────────────────────────────────────────
  const currentPassage = passages[passageIndex];

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (phase !== "typing" || !currentPassage) return;

      const text = currentPassage.text;
      const pos = typed.length;

      if (pos >= text.length) return;

      // Accept printable keys + backspace
      if (e.key === "Backspace") {
        if (typed.length > 0) setTyped((t) => t.slice(0, -1));
        return;
      }
      if (e.key.length !== 1) return;

      const expected = text[pos];
      const ch = e.key;

      const newTyped = typed + ch;
      setTyped(newTyped);

      if (ch !== expected) {
        setErrors((err) => err + 1);
      }

      // WPM live (character-level)
      const elapsed = (Date.now() - startTimeRef.current) / 1000 / 60;
      const wordCount = newTyped.trim().split(/\s+/).length;
      if (elapsed > 0) setWpm(Math.round(wordCount / elapsed));

      // Accuracy
      const totalPressed = newTyped.length;
      const acc = totalPressed > 0
        ? Math.round(((totalPressed - errors - (ch !== expected ? 1 : 0)) / totalPressed) * 100)
        : 100;
      setAccuracy(Math.max(0, acc));

      // Passage complete
      if (newTyped.length >= text.length) {
        const elapsed2 = (Date.now() - startTimeRef.current) / 1000 / 60;
        const finalWpm = elapsed2 > 0 ? Math.round(currentPassage.wordCount / elapsed2) : 0;
        const finalAcc = Math.max(
          0,
          Math.round(((text.length - errors - (ch !== expected ? 1 : 0)) / text.length) * 100)
        );
        setWpm(finalWpm);
        setAccuracy(finalAcc);

        const entry: TypingHistoryEntry = {
          date: new Date().toISOString().slice(0, 10),
          wpm: finalWpm,
          accuracy: finalAcc,
          passageId: currentPassage.id,
        };
        saveHistory(entry);

        const pb = getPersonalBest();
        if (finalWpm > pb) {
          setIsNewPB(true);
          setPersonalBest(finalWpm);
        } else {
          setIsNewPB(false);
        }

        if (mode === "challenge") {
          const newScores = [...challengeScores, { wpm: finalWpm, accuracy: finalAcc }];
          setChallengeScores(newScores);
          const nextIndex = passageIndex + 1;
          if (nextIndex < passages.length) {
            setChallengeDone(nextIndex);
            setPassageIndex(nextIndex);
            setTyped("");
            setErrors(0);
            startTimeRef.current = Date.now();
            // stay in typing phase
          } else {
            setChallengeDone(passages.length);
            setPhase("complete");
          }
        } else {
          setPhase("complete");
        }
      }
    },
    [phase, currentPassage, typed, errors, mode, challengeScores, passageIndex, passages]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // ── Mode selection screen ─────────────────────────────────────────────────
  if (mode === "select") {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center px-4 gap-6"
        style={{ background: `linear-gradient(160deg, ${TRUMA_NAVY} 0%, #0a1a38 100%)` }}
      >
        <div className="text-5xl">⌨️</div>
        <h1 className="text-white font-black text-3xl text-center">Typing Practice</h1>
        <p className="text-blue-300 text-center text-sm max-w-xs">
          Type Bible verses, catechism, and great quotes. Learning as you type.
        </p>
        <div
          className="w-full max-w-xs rounded-2xl px-6 py-3 text-center"
          style={{ backgroundColor: "rgba(255,255,255,0.07)" }}
        >
          <span className="text-blue-300 text-sm">WPM Goal: </span>
          <span className="text-white font-black">{WPM_GOAL} WPM</span>
          {personalBest > 0 && (
            <>
              <span className="text-blue-400 text-xs mx-2">·</span>
              <span className="text-blue-300 text-xs">Personal best: </span>
              <span style={{ color: TRUMA_GOLD }} className="font-black text-sm">{personalBest}</span>
            </>
          )}
        </div>

        <div className="flex flex-col gap-3 w-full max-w-xs">
          <button
            onClick={startPractice}
            className="w-full py-4 rounded-2xl font-black text-white text-lg shadow-xl hover:scale-105 active:scale-95 transition-all"
            style={{ backgroundColor: TRUMA_NAVY, border: `2px solid ${TRUMA_GOLD}` }}
          >
            📖 Practice Mode
          </button>
          <p className="text-blue-400 text-xs text-center -mt-2">One passage · no pressure · retry anytime</p>

          <button
            onClick={startChallenge}
            className="w-full py-4 rounded-2xl font-black text-white text-lg shadow-xl hover:scale-105 active:scale-95 transition-all"
            style={{ backgroundColor: "#7c3aed" }}
          >
            ⚡ Challenge Mode
          </button>
          <p className="text-blue-400 text-xs text-center -mt-2">3 passages back-to-back · scored</p>
        </div>
      </div>
    );
  }

  // ── Complete screen ───────────────────────────────────────────────────────
  if (phase === "complete") {
    const avgWpm =
      mode === "challenge" && challengeScores.length > 0
        ? Math.round(challengeScores.reduce((s, x) => s + x.wpm, 0) / challengeScores.length)
        : wpm;
    const avgAcc =
      mode === "challenge" && challengeScores.length > 0
        ? Math.round(challengeScores.reduce((s, x) => s + x.accuracy, 0) / challengeScores.length)
        : accuracy;

    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center px-4 gap-6"
        style={{ background: `linear-gradient(160deg, ${TRUMA_NAVY} 0%, #0a1a38 100%)` }}
      >
        <div className="text-5xl">{isNewPB ? "🏆" : "✅"}</div>
        <h1 className="text-white font-black text-3xl text-center">
          {isNewPB ? "Personal Best!" : "Session Complete!"}
        </h1>

        <div
          className="w-full max-w-xs rounded-2xl p-6 grid grid-cols-2 gap-4 shadow-2xl"
          style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
        >
          <div className="text-center">
            <div className="font-black text-4xl" style={{ color: TRUMA_GOLD }}>{avgWpm}</div>
            <div className="text-blue-300 text-sm">WPM</div>
          </div>
          <div className="text-center">
            <div className="font-black text-4xl text-white">{avgAcc}%</div>
            <div className="text-blue-300 text-sm">Accuracy</div>
          </div>
          {mode === "challenge" && (
            <div className="col-span-2 text-center">
              <div className="font-black text-xl text-white">{challengeScores.length} passages</div>
              <div className="text-blue-300 text-xs">Challenge complete</div>
            </div>
          )}
        </div>

        {isNewPB && (
          <div
            className="w-full max-w-xs rounded-2xl px-6 py-3 text-center"
            style={{ backgroundColor: `${TRUMA_GOLD}22`, border: `1px solid ${TRUMA_GOLD}` }}
          >
            <p className="font-black" style={{ color: TRUMA_GOLD }}>
              New personal best: {personalBest} WPM 🎉
            </p>
          </div>
        )}

        <div className="flex gap-3 w-full max-w-xs">
          <button
            onClick={() => { setMode("select"); setPhase("typing"); }}
            className="flex-1 py-3 rounded-2xl font-black text-white text-base shadow-lg hover:scale-105 active:scale-95 transition-all"
            style={{ backgroundColor: TRUMA_NAVY, border: `2px solid ${TRUMA_GOLD}` }}
          >
            ← Back
          </button>
          <button
            onClick={mode === "challenge" ? startChallenge : startPractice}
            className="flex-1 py-3 rounded-2xl font-black text-white text-base shadow-lg hover:scale-105 active:scale-95 transition-all"
            style={{ backgroundColor: "#7c3aed" }}
          >
            Again →
          </button>
        </div>
      </div>
    );
  }

  // ── Typing screen ─────────────────────────────────────────────────────────
  if (!currentPassage) return null;

  const text = currentPassage.text;
  const catColor = CATEGORY_COLORS[currentPassage.category] ?? "#60a5fa";

  return (
    <div
      className="min-h-screen flex flex-col px-4 pt-6 pb-10"
      style={{ background: `linear-gradient(160deg, ${TRUMA_NAVY} 0%, #0a1a38 100%)` }}
    >
      {/* Header row */}
      <div className="flex justify-between items-center mb-4 max-w-lg md:max-w-2xl mx-auto w-full">
        <button
          onClick={() => setMode("select")}
          className="text-blue-400 text-sm font-bold hover:text-white transition-colors"
        >
          ← Back
        </button>
        <div className="flex gap-4">
          <span className="text-blue-200 text-sm">
            WPM: <span className="font-black text-white">{wpm}</span>
          </span>
          <span className="text-blue-200 text-sm">
            Accuracy: <span className="font-black text-white">{accuracy}%</span>
          </span>
        </div>
        {mode === "challenge" && (
          <span className="text-purple-300 text-xs font-bold">
            {passageIndex + 1}/3
          </span>
        )}
      </div>

      {/* WPM goal reminder */}
      <div className="max-w-lg md:max-w-2xl mx-auto w-full mb-3">
        <div
          className="inline-block rounded-xl px-3 py-1 text-xs font-bold"
          style={{ backgroundColor: `${catColor}22`, color: catColor, border: `1px solid ${catColor}44` }}
        >
          {currentPassage.category.toUpperCase()}
        </div>
        <span className="text-blue-400 text-xs ml-3">Goal: {WPM_GOAL} WPM</span>
      </div>

      {/* Source attribution */}
      <div className="max-w-lg md:max-w-2xl mx-auto w-full mb-4">
        <p className="text-blue-300 font-bold text-sm italic">, {currentPassage.source}</p>
      </div>

      {/* Passage display */}
      <div
        className="max-w-lg md:max-w-2xl mx-auto w-full rounded-2xl p-6 shadow-2xl mb-4 leading-relaxed"
        style={{ backgroundColor: "rgba(255,255,255,0.06)", fontSize: "1.2rem", lineHeight: 1.8 }}
      >
        {text.split("").map((ch, i) => {
          let color: string;
          let bg: string | undefined;

          if (i < typed.length) {
            const wasCorrect = typed[i] === ch;
            color = wasCorrect ? "#4ade80" : "#f87171";
            bg = wasCorrect ? undefined : "rgba(248,113,113,0.15)";
          } else if (i === typed.length) {
            color = "#ffffff";
            bg = "rgba(255,255,255,0.2)";
          } else {
            color = "rgba(255,255,255,0.45)";
          }

          return (
            <span
              key={i}
              style={{
                color,
                backgroundColor: bg,
                borderBottom: i === typed.length ? "2px solid #fff" : undefined,
              }}
            >
              {ch}
            </span>
          );
        })}
      </div>

      {/* Progress bar */}
      <div className="max-w-lg md:max-w-2xl mx-auto w-full">
        <div className="bg-blue-950 rounded-full h-2 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-100"
            style={{
              width: `${Math.round((typed.length / text.length) * 100)}%`,
              backgroundColor: TRUMA_GOLD,
            }}
          />
        </div>
        <p className="text-blue-400 text-xs text-right mt-1">
          {typed.length} / {text.length} characters
        </p>
      </div>
    </div>
  );
}
