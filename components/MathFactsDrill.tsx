"use client";

import { useState, useEffect, useRef, useCallback } from "react";

// ─── Types ──────────────────────────────────────────────────────────────────

export type DrillMode = "multiply" | "divide" | "add" | "subtract" | "mixed" | "lightning";

export interface FactsResults {
  mode: DrillMode;
  correct: number;
  total: number;
  timeSeconds: number;
  factsPerMinute?: number;
  slowFacts: string[];
  date: string;
}

interface MathFactsDrillProps {
  kidId?: string;
  colorHex?: string;
  level?: "standard" | "advanced";
  onComplete?: (results: FactsResults) => void;
  onBack?: () => void;
}

interface Question {
  problem: string;
  answer: number;
}

interface QuestionRecord {
  problem: string;
  answer: number;
  correct: boolean;
  timeTaken: number; // seconds
}

// ─── Constants ───────────────────────────────────────────────────────────────

const NAVY = "#1b3a6b";
const GOLD = "#f5c518";
const STANDARD_COUNT = 20;
const LIGHTNING_SECONDS = 60;
const PER_Q_SECONDS = 20;
const SLOW_THRESHOLD = 10; // seconds
const WRONG_SHOW_SECONDS = 1500; // ms
const LIGHTNING_WRONG_SHOW = 800; // ms

// ─── Question generators ─────────────────────────────────────────────────────

function weightedFactor(): number {
  // 6, 7, 8, 9 appear ~2x more often
  const pool = [1, 2, 3, 4, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 11, 12];
  return pool[Math.floor(Math.random() * pool.length)];
}

function generateMultiplication(): Question {
  const a = weightedFactor();
  const b = weightedFactor();
  return { problem: `${a} × ${b}`, answer: a * b };
}

function generateDivision(): Question {
  const a = weightedFactor();
  const b = weightedFactor();
  return { problem: `${a * b} ÷ ${b}`, answer: a };
}

function generateAddition(level: "standard" | "advanced" = "standard"): Question {
  const max = level === "advanced" ? 100 : 50;
  const a = Math.floor(Math.random() * max) + 1;
  const b = Math.floor(Math.random() * max) + 1;
  return { problem: `${a} + ${b}`, answer: a + b };
}

function generateSubtraction(level: "standard" | "advanced" = "standard"): Question {
  const max = level === "advanced" ? 100 : 50;
  const a = Math.floor(Math.random() * max) + 5;
  const b = Math.floor(Math.random() * (a - 1)) + 1;
  return { problem: `${a} - ${b}`, answer: a - b };
}

function generateForMode(mode: DrillMode, level: "standard" | "advanced" = "standard"): Question {
  if (mode === "multiply") return generateMultiplication();
  if (mode === "divide") return generateDivision();
  if (mode === "add") return generateAddition(level);
  if (mode === "subtract") return generateSubtraction(level);
  // mixed or lightning: all four operations equally weighted
  const r = Math.random();
  if (r < 0.25) return generateMultiplication();
  if (r < 0.50) return generateDivision();
  if (r < 0.75) return generateAddition(level);
  return generateSubtraction(level);
}

function buildPool(mode: DrillMode, count: number, level: "standard" | "advanced" = "standard"): Question[] {
  const qs: Question[] = [];
  for (let i = 0; i < count; i++) {
    qs.push(generateForMode(mode, level));
  }
  return qs;
}

// ─── localStorage helpers ────────────────────────────────────────────────────

const HISTORY_KEY = "truma-mathfacts-history";
const BEST_KEY = "truma-mathfacts-best";

interface BestRecord {
  standard: number; // best score out of 20
  lightning: number; // best facts/min
}

function loadHistory(): FactsResults[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? (JSON.parse(raw) as FactsResults[]) : [];
  } catch {
    return [];
  }
}

function saveHistory(result: FactsResults) {
  if (typeof window === "undefined") return;
  try {
    const history = loadHistory();
    history.unshift(result);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 50)));
  } catch {
    /* ignore */
  }
}

function loadBest(): BestRecord {
  if (typeof window === "undefined") return { standard: 0, lightning: 0 };
  try {
    const raw = localStorage.getItem(BEST_KEY);
    return raw ? (JSON.parse(raw) as BestRecord) : { standard: 0, lightning: 0 };
  } catch {
    return { standard: 0, lightning: 0 };
  }
}

function updateBest(result: FactsResults): BestRecord {
  if (typeof window === "undefined") return { standard: 0, lightning: 0 };
  const best = loadBest();
  if (result.mode === "lightning") {
    const fpm = result.factsPerMinute ?? 0;
    if (fpm > best.lightning) best.lightning = fpm;
  } else {
    if (result.correct > best.standard) best.standard = result.correct;
  }
  try {
    localStorage.setItem(BEST_KEY, JSON.stringify(best));
  } catch {
    /* ignore */
  }
  return best;
}

// ─── Mode selection screen ────────────────────────────────────────────────────

const MODE_OPTIONS: Array<{
  mode: DrillMode;
  label: string;
  emoji: string;
  desc: string;
  color: string;
}> = [
  {
    mode: "multiply",
    label: "✖ Multiply",
    emoji: "×",
    desc: "Facts 1–12 · 20 questions",
    color: "#2563eb",
  },
  {
    mode: "divide",
    label: "÷ Divide",
    emoji: "÷",
    desc: "Reverse facts · 20 questions",
    color: "#7c3aed",
  },
  {
    mode: "add",
    label: "+ Add",
    emoji: "+",
    desc: "Addition facts · 20 questions",
    color: "#0891b2",
  },
  {
    mode: "subtract",
    label: "− Subtract",
    emoji: "−",
    desc: "Subtraction facts · 20 questions",
    color: "#0f766e",
  },
  {
    mode: "mixed",
    label: "⚡ Mixed",
    emoji: "±",
    desc: "All four ops · 20 questions",
    color: "#0d9488",
  },
  {
    mode: "lightning",
    label: "⚡⚡ Lightning",
    emoji: "⚡",
    desc: "60 seconds · go as fast as possible",
    color: "#dc2626",
  },
];

function ModeSelect({
  colorHex,
  personalBest,
  onSelect,
  onBack,
}: {
  colorHex: string;
  personalBest: BestRecord;
  onSelect: (mode: DrillMode) => void;
  onBack?: () => void;
}) {
  return (
    <div
      className="min-h-screen px-4 py-6 max-w-lg md:max-w-2xl mx-auto"
      style={{ background: "linear-gradient(160deg, #1b3a6b 0%, #0f2547 100%)" }}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-blue-200 text-xs font-bold uppercase tracking-wider">
            Math Facts
          </p>
          <h1 className="text-white font-black text-2xl">Speed Drills</h1>
        </div>
        {onBack && (
          <button
            onClick={onBack}
            className="text-blue-300 text-sm font-bold hover:text-white transition-colors"
          >
            ← Back
          </button>
        )}
      </div>

      {/* Personal best banner */}
      <div
        className="rounded-2xl p-4 mb-6 flex items-center gap-4"
        style={{ backgroundColor: "rgba(245,197,24,0.12)", border: `1px solid ${GOLD}60` }}
      >
        <span className="text-3xl">⚡</span>
        <div className="flex-1">
          <p className="text-yellow-300 font-black text-sm">Personal Bests</p>
          <p className="text-blue-200 text-xs mt-0.5">
            Best score: {personalBest.standard}/20 &nbsp;·&nbsp; Lightning: {personalBest.lightning} facts/min
          </p>
        </div>
        {personalBest.lightning > 0 && (
          <div
            className="px-3 py-1 rounded-xl font-black text-sm"
            style={{ backgroundColor: GOLD, color: NAVY }}
          >
            {personalBest.lightning}/min
          </div>
        )}
      </div>

      <p className="text-blue-200 text-sm mb-4 font-bold uppercase tracking-wider">
        Choose Your Drill
      </p>

      <div className="flex flex-col gap-3">
        {MODE_OPTIONS.map((opt) => (
          <button
            key={opt.mode}
            onClick={() => onSelect(opt.mode)}
            className="rounded-2xl p-5 flex items-center gap-4 text-left transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg"
            style={{ backgroundColor: opt.color + "30", border: `2px solid ${opt.color}60` }}
          >
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center font-black text-2xl flex-shrink-0"
              style={{ backgroundColor: opt.color }}
            >
              {opt.emoji}
            </div>
            <div className="flex-1">
              <p className="text-white font-black text-lg">{opt.label}</p>
              <p className="text-blue-200 text-sm">{opt.desc}</p>
            </div>
            <div className="text-white/60 text-xl">→</div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Timer bar ────────────────────────────────────────────────────────────────

function TimerBar({ elapsed, total }: { elapsed: number; total: number }) {
  const pct = Math.max(0, Math.min(100, ((total - elapsed) / total) * 100));
  const color = pct > 60 ? "#22c55e" : pct > 25 ? "#eab308" : "#ef4444";
  return (
    <div className="w-full bg-blue-950 rounded-full h-2 overflow-hidden mb-4">
      <div
        className="h-full rounded-full transition-all duration-300"
        style={{ width: `${pct}%`, backgroundColor: color }}
      />
    </div>
  );
}

// ─── Main drill screen ────────────────────────────────────────────────────────

type FeedbackState = "idle" | "correct" | "wrong";

function DrillScreen({
  mode,
  colorHex,
  level = "standard",
  onFinish,
  onBack,
}: {
  mode: DrillMode;
  colorHex: string;
  level?: "standard" | "advanced";
  onFinish: (records: QuestionRecord[], totalSecs: number, lightningCorrect?: number) => void;
  onBack: () => void;
}) {
  const isLightning = mode === "lightning";
  const [pool, setPool] = useState<Question[]>([]);
  const [poolIdx, setPoolIdx] = useState(0);
  const [currentQ, setCurrentQ] = useState<Question | null>(null);
  const [inputVal, setInputVal] = useState("");
  const [records, setRecords] = useState<QuestionRecord[]>([]);
  const [qIndex, setQIndex] = useState(0); // standard: current question #
  const [feedback, setFeedback] = useState<FeedbackState>("idle");
  const [showAnswer, setShowAnswer] = useState<number | null>(null);

  // Standard mode: per-question timer
  const [qElapsed, setQElapsed] = useState(0);
  const qTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const qStartRef = useRef<number>(Date.now());

  // Lightning mode: countdown
  const [lightningLeft, setLightningLeft] = useState(LIGHTNING_SECONDS);
  const lightningRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [lightningCorrect, setLightningCorrect] = useState(0);
  const [lightningTotal, setLightningTotal] = useState(0);

  // Overall timer
  const startTimeRef = useRef<number>(Date.now());

  // Input ref for autofocus
  const inputRef = useRef<HTMLInputElement>(null);

  // Transition lock, prevents double-advancing
  const transitioning = useRef(false);

  const totalQuestions = isLightning ? 9999 : STANDARD_COUNT;

  // Initialize pool
  useEffect(() => {
    const initialPool = buildPool(mode, isLightning ? 80 : STANDARD_COUNT, level);
    setPool(initialPool);
    setCurrentQ(initialPool[0]);
    setPoolIdx(0);
    startTimeRef.current = Date.now();
    qStartRef.current = Date.now();
    if (inputRef.current) inputRef.current.focus();
  }, [mode, isLightning, level]);

  // Per-question timer (standard only)
  useEffect(() => {
    if (isLightning) return;
    if (feedback !== "idle") return;
    qTimerRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - qStartRef.current) / 1000);
      setQElapsed(elapsed);
      if (elapsed >= PER_Q_SECONDS) {
        handleTimeout();
      }
    }, 300);
    return () => {
      if (qTimerRef.current) clearInterval(qTimerRef.current);
    };
  });

  // Lightning countdown
  useEffect(() => {
    if (!isLightning) return;
    lightningRef.current = setInterval(() => {
      setLightningLeft((prev) => {
        if (prev <= 1) {
          clearInterval(lightningRef.current!);
          finishLightning();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (lightningRef.current) clearInterval(lightningRef.current);
    };
    // We intentionally only run this once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function finishLightning() {
    if (lightningRef.current) clearInterval(lightningRef.current);
    const totalSecs = LIGHTNING_SECONDS - lightningLeft;
    // Use refs for latest counts since this runs in interval callback
    onFinish([], totalSecs, lightningCorrectRef.current);
  }

  // Keep a ref of lightning correct count for interval callback
  const lightningCorrectRef = useRef(0);
  useEffect(() => {
    lightningCorrectRef.current = lightningCorrect;
  }, [lightningCorrect]);

  const getNextQuestion = useCallback(
    (currentPoolIdx: number): { q: Question; newIdx: number } => {
      let nextIdx = currentPoolIdx + 1;
      if (nextIdx >= pool.length) {
        // Reshuffle
        const fresh = buildPool(mode, 80, level);
        setPool(fresh);
        nextIdx = 0;
        return { q: fresh[0], newIdx: 0 };
      }
      return { q: pool[nextIdx], newIdx: nextIdx };
    },
    [pool, mode, level]
  );

  function stopQTimer() {
    if (qTimerRef.current) {
      clearInterval(qTimerRef.current);
      qTimerRef.current = null;
    }
  }

  function handleTimeout() {
    if (transitioning.current) return;
    transitioning.current = true;
    stopQTimer();
    const elapsed = Math.floor((Date.now() - qStartRef.current) / 1000);
    const q = currentQ!;
    const rec: QuestionRecord = {
      problem: q.problem,
      answer: q.answer,
      correct: false,
      timeTaken: elapsed,
    };
    setFeedback("wrong");
    setShowAnswer(q.answer);
    setRecords((prev) => [...prev, rec]);
    setTimeout(() => {
      advanceQuestion(qIndex + 1, rec);
    }, WRONG_SHOW_SECONDS);
  }

  function advanceQuestion(nextIndex: number, _lastRec?: QuestionRecord) {
    const allRecords = _lastRec
      ? [...records, _lastRec]
      : records;

    if (!isLightning && nextIndex >= STANDARD_COUNT) {
      stopQTimer();
      const totalSecs = Math.floor((Date.now() - startTimeRef.current) / 1000);
      onFinish(allRecords, totalSecs);
      return;
    }
    const { q, newIdx } = getNextQuestion(poolIdx);
    setCurrentQ(q);
    setPoolIdx(newIdx);
    setQIndex(nextIndex);
    setInputVal("");
    setFeedback("idle");
    setShowAnswer(null);
    setQElapsed(0);
    qStartRef.current = Date.now();
    transitioning.current = false;
    setTimeout(() => inputRef.current?.focus(), 50);
  }

  function submitAnswer() {
    if (transitioning.current || feedback !== "idle" || !currentQ) return;
    const parsed = parseInt(inputVal.trim(), 10);
    if (isNaN(parsed)) return;

    transitioning.current = true;
    stopQTimer();
    const elapsed = Math.max(1, Math.floor((Date.now() - qStartRef.current) / 1000));
    const isCorrect = parsed === currentQ.answer;

    if (isLightning) {
      if (isCorrect) {
        setLightningCorrect((c) => c + 1);
        lightningCorrectRef.current += 1;
      }
      setLightningTotal((t) => t + 1);
      if (!isCorrect) {
        setFeedback("wrong");
        setShowAnswer(currentQ.answer);
        setTimeout(() => {
          const { q, newIdx } = getNextQuestion(poolIdx);
          setCurrentQ(q);
          setPoolIdx(newIdx);
          setInputVal("");
          setFeedback("idle");
          setShowAnswer(null);
          transitioning.current = false;
          setTimeout(() => inputRef.current?.focus(), 50);
        }, LIGHTNING_WRONG_SHOW);
      } else {
        setFeedback("correct");
        setInputVal("");
        setTimeout(() => {
          const { q, newIdx } = getNextQuestion(poolIdx);
          setCurrentQ(q);
          setPoolIdx(newIdx);
          setFeedback("idle");
          transitioning.current = false;
          setTimeout(() => inputRef.current?.focus(), 50);
        }, 120);
      }
      return;
    }

    // Standard mode
    const rec: QuestionRecord = {
      problem: currentQ.problem,
      answer: currentQ.answer,
      correct: isCorrect,
      timeTaken: elapsed,
    };
    setRecords((prev) => [...prev, rec]);

    if (isCorrect) {
      setFeedback("correct");
      setInputVal("");
      setTimeout(() => {
        advanceQuestion(qIndex + 1);
      }, 250);
    } else {
      setFeedback("wrong");
      setShowAnswer(currentQ.answer);
      setTimeout(() => {
        advanceQuestion(qIndex + 1, rec);
      }, WRONG_SHOW_SECONDS);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      submitAnswer();
    }
  }

  const bgFeedback =
    feedback === "correct"
      ? "rgba(34,197,94,0.15)"
      : feedback === "wrong"
      ? "rgba(239,68,68,0.15)"
      : "transparent";

  const lightningPct = (lightningLeft / LIGHTNING_SECONDS) * 100;
  const lightningColor =
    lightningLeft > 30 ? "#ef4444" : lightningLeft > 10 ? "#eab308" : "#ef4444";

  if (!currentQ) return null;

  return (
    <div
      className="min-h-screen px-4 py-6 max-w-lg md:max-w-2xl mx-auto flex flex-col"
      style={{
        background: "linear-gradient(160deg, #1b3a6b 0%, #0f2547 100%)",
        transition: "background-color 0.2s",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onBack}
          className="text-blue-300 text-sm font-bold hover:text-white transition-colors"
        >
          ← Back
        </button>
        <p className="text-blue-200 text-xs font-bold uppercase tracking-wider">
          {isLightning ? "⚡ Lightning Round" : MODE_OPTIONS.find((m) => m.mode === mode)?.label}
        </p>
        {!isLightning && (
          <span className="text-white font-black text-sm">
            {qIndex + 1} / {STANDARD_COUNT}
          </span>
        )}
        {isLightning && (
          <span className="text-white font-black text-sm">
            ✓ {lightningCorrect}
          </span>
        )}
      </div>

      {/* Lightning countdown clock */}
      {isLightning && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-blue-300 text-xs font-bold">Time left</span>
            <span className="font-black text-2xl" style={{ color: lightningColor }}>
              {lightningLeft}s
            </span>
          </div>
          <div className="w-full bg-blue-950 rounded-full h-3 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{ width: `${lightningPct}%`, backgroundColor: lightningColor }}
            />
          </div>
        </div>
      )}

      {/* Standard per-question timer bar */}
      {!isLightning && (
        <TimerBar elapsed={qElapsed} total={PER_Q_SECONDS} />
      )}

      {/* Question card */}
      <div
        className="flex-1 flex flex-col items-center justify-center rounded-3xl py-12 px-6 mb-6 transition-all duration-200"
        style={{
          backgroundColor: "rgba(255,255,255,0.07)",
          border: "1px solid rgba(255,255,255,0.10)",
          outline: feedback === "correct" ? "2px solid #22c55e" : feedback === "wrong" ? "2px solid #ef4444" : "none",
          background: feedback !== "idle"
            ? bgFeedback
            : "rgba(255,255,255,0.07)",
        }}
      >
        {/* Problem */}
        <p
          className="font-black text-white text-center leading-none mb-8 select-none"
          style={{ fontSize: "clamp(3rem, 12vw, 5rem)" }}
        >
          {currentQ.problem} = ___
        </p>

        {/* Answer input */}
        <input
          ref={inputRef}
          type="number"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={feedback !== "idle"}
          placeholder="?"
          className="w-36 text-center rounded-2xl font-black text-3xl py-4 bg-white/10 text-white border-2 border-white/20 focus:outline-none focus:border-yellow-400 placeholder-white/30 transition-all"
          style={{ caretColor: GOLD }}
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete="off"
        />

        {/* Wrong: show correct answer */}
        {feedback === "wrong" && showAnswer !== null && (
          <div className="mt-5 px-5 py-2 rounded-2xl font-black text-white text-xl"
            style={{ backgroundColor: "rgba(239,68,68,0.30)" }}>
            Answer: <span style={{ color: GOLD }}>{showAnswer}</span>
          </div>
        )}

        {/* Correct flash */}
        {feedback === "correct" && (
          <p className="mt-5 text-3xl animate-bounce">✅</p>
        )}
      </div>

      {/* Submit button */}
      <button
        onClick={submitAnswer}
        disabled={feedback !== "idle" || inputVal.trim() === ""}
        className="w-full py-4 rounded-2xl font-black text-navy text-xl transition-all hover:opacity-90 active:scale-[0.97] disabled:opacity-30"
        style={{ backgroundColor: GOLD }}
      >
        ✓ Check
      </button>
    </div>
  );
}

// ─── Results screen ───────────────────────────────────────────────────────────

function ResultsScreen({
  result,
  prevBest,
  onAgain,
  onBack,
}: {
  result: FactsResults;
  prevBest: BestRecord;
  onAgain: () => void;
  onBack: () => void;
}) {
  const isLightning = result.mode === "lightning";
  const pct = result.total > 0 ? Math.round((result.correct / result.total) * 100) : 0;
  const scoreColor = pct >= 80 ? "#22c55e" : pct >= 60 ? "#eab308" : "#ef4444";
  const newBest = loadBest();
  const isNewLightningBest = isLightning && (result.factsPerMinute ?? 0) >= newBest.lightning;
  const isNewStandardBest = !isLightning && result.correct >= newBest.standard;

  return (
    <div
      className="min-h-screen px-4 py-6 max-w-lg md:max-w-2xl mx-auto"
      style={{ background: "linear-gradient(160deg, #1b3a6b 0%, #0f2547 100%)" }}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-blue-200 text-xs font-bold uppercase tracking-wider">Results</p>
          <h1 className="text-white font-black text-2xl">
            {isLightning ? "⚡ Lightning!" : "📊 Math Facts"}
          </h1>
        </div>
        <button
          onClick={onBack}
          className="text-blue-300 text-sm font-bold hover:text-white transition-colors"
        >
          ← Back
        </button>
      </div>

      {/* New best banner */}
      {(isNewLightningBest || isNewStandardBest) && (
        <div
          className="rounded-2xl p-4 mb-5 flex items-center gap-3"
          style={{ backgroundColor: "rgba(245,197,24,0.20)", border: `2px solid ${GOLD}` }}
        >
          <span className="text-3xl">🏆</span>
          <div>
            <p className="text-yellow-300 font-black">Personal Best!</p>
            <p className="text-blue-200 text-sm">
              {isLightning
                ? `${result.factsPerMinute} facts/min, new record!`
                : `${result.correct}/20, new record!`}
            </p>
          </div>
        </div>
      )}

      {/* Score card */}
      <div
        className="rounded-2xl p-5 mb-5"
        style={{ backgroundColor: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.10)" }}
      >
        {isLightning ? (
          <>
            <p className="text-blue-200 text-sm font-bold mb-2">Lightning Round</p>
            <p className="text-white font-black" style={{ fontSize: "3rem" }}>
              {result.factsPerMinute ?? 0}
              <span className="text-blue-300 text-xl font-bold ml-2">facts/min</span>
            </p>
            <p className="text-blue-300 text-sm mt-1">
              {result.correct} correct in {LIGHTNING_SECONDS}s
            </p>
            <p className="text-blue-400 text-xs mt-1">
              Personal best: {prevBest.lightning} facts/min
            </p>
          </>
        ) : (
          <>
            <div className="flex items-end gap-3 mb-3">
              <p className="font-black text-white" style={{ fontSize: "3.5rem", lineHeight: 1 }}>
                {result.correct}
              </p>
              <p className="text-blue-300 font-bold text-2xl pb-2">/ {result.total}</p>
              <p
                className="font-black text-2xl pb-2 ml-auto"
                style={{ color: scoreColor }}
              >
                {pct}%
              </p>
            </div>
            <div className="w-full bg-blue-950 rounded-full h-2.5 mb-3 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${pct}%`, backgroundColor: scoreColor }}
              />
            </div>
            <div className="grid grid-cols-2 gap-3 text-center">
              <div
                className="rounded-xl p-3"
                style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
              >
                <p className="text-white font-black text-lg">
                  {result.timeSeconds}s
                </p>
                <p className="text-blue-300 text-xs">Total time</p>
              </div>
              <div
                className="rounded-xl p-3"
                style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
              >
                <p className="text-white font-black text-lg">
                  {result.total > 0
                    ? Math.round(result.timeSeconds / result.total)
                    : 0}s
                </p>
                <p className="text-blue-300 text-xs">Avg/fact</p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Slow facts */}
      {result.slowFacts.length > 0 && (
        <div
          className="rounded-2xl p-4 mb-5"
          style={{ backgroundColor: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.25)" }}
        >
          <p className="text-red-300 font-black text-sm mb-3">
            ⚠️ Facts to drill more ({result.slowFacts.length}):
          </p>
          <div className="flex flex-wrap gap-2">
            {result.slowFacts.map((f, i) => (
              <span
                key={i}
                className="px-3 py-1.5 rounded-xl font-black text-sm text-white"
                style={{ backgroundColor: "rgba(239,68,68,0.30)" }}
              >
                {f}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Previous best */}
      {!isLightning && (
        <p className="text-blue-300 text-xs text-center mb-6">
          Personal best: {prevBest.standard}/20
          {result.correct >= prevBest.standard && result.correct > 0 ? " ✓ new best!" : ""}
        </p>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={onAgain}
          className="flex-1 py-4 rounded-2xl font-black text-navy text-base transition-all hover:opacity-90 active:scale-[0.97]"
          style={{ backgroundColor: GOLD }}
        >
          Practice Again
        </button>
        <button
          onClick={onBack}
          className="py-4 px-5 rounded-2xl font-black text-sm text-blue-300 hover:text-white transition-colors"
          style={{ backgroundColor: "rgba(255,255,255,0.07)" }}
        >
          Back
        </button>
      </div>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

type Phase = "select" | "drill" | "results";

export default function MathFactsDrill({
  kidId = "truma",
  colorHex = NAVY,
  level = "standard",
  onComplete,
  onBack,
}: MathFactsDrillProps) {
  const [phase, setPhase] = useState<Phase>("select");
  const [selectedMode, setSelectedMode] = useState<DrillMode>("multiply");
  const [lastResult, setLastResult] = useState<FactsResults | null>(null);
  const [personalBest, setPersonalBest] = useState<BestRecord>({ standard: 0, lightning: 0 });

  useEffect(() => {
    setPersonalBest(loadBest());
  }, []);

  function handleModeSelect(mode: DrillMode) {
    setSelectedMode(mode);
    setPhase("drill");
  }

  function handleDrillFinish(
    records: QuestionRecord[],
    totalSecs: number,
    lightningCorrect?: number
  ) {
    const isLightning = selectedMode === "lightning";

    let result: FactsResults;

    if (isLightning) {
      const correct = lightningCorrect ?? 0;
      const fpm = Math.round((correct / LIGHTNING_SECONDS) * 60);
      result = {
        mode: selectedMode,
        correct,
        total: correct, // lightning total = correct (we track correct count)
        timeSeconds: LIGHTNING_SECONDS,
        factsPerMinute: fpm,
        slowFacts: [],
        date: new Date().toISOString(),
      };
    } else {
      const correctCount = records.filter((r) => r.correct).length;
      const slowFacts = records
        .filter((r) => !r.correct || r.timeTaken > SLOW_THRESHOLD)
        .map((r) => r.problem);
      // Deduplicate
      const uniqueSlow = slowFacts.filter((v, i, arr) => arr.indexOf(v) === i);
      result = {
        mode: selectedMode,
        correct: correctCount,
        total: records.length,
        timeSeconds: totalSecs,
        slowFacts: uniqueSlow,
        date: new Date().toISOString(),
      };
    }

    saveHistory(result);
    const newBest = updateBest(result);
    setPersonalBest(newBest);
    setLastResult(result);
    setPhase("results");
    onComplete?.(result);
  }

  if (phase === "select") {
    return (
      <ModeSelect
        colorHex={colorHex}
        personalBest={personalBest}
        onSelect={handleModeSelect}
        onBack={onBack}
      />
    );
  }

  if (phase === "drill") {
    return (
      <DrillScreen
        mode={selectedMode}
        colorHex={colorHex}
        level={level}
        onFinish={handleDrillFinish}
        onBack={() => setPhase("select")}
      />
    );
  }

  if (phase === "results" && lastResult) {
    return (
      <ResultsScreen
        result={lastResult}
        prevBest={personalBest}
        onAgain={() => setPhase("drill")}
        onBack={() => setPhase("select")}
      />
    );
  }

  return null;
}

// ─── Inline panel export (for TrumaTestPrep) ─────────────────────────────────

export function MathFactsPanel({
  colorHex = NAVY,
  onLaunch,
}: {
  colorHex?: string;
  onLaunch: (mode: DrillMode) => void;
}) {
  const [best, setBest] = useState<BestRecord>({ standard: 0, lightning: 0 });
  useEffect(() => {
    setBest(loadBest());
  }, []);

  const buttons: Array<{ mode: DrillMode; label: string; emoji: string }> = [
    { mode: "multiply", label: "✖ Multiply", emoji: "×" },
    { mode: "divide", label: "÷ Divide", emoji: "÷" },
    { mode: "add", label: "+ Add", emoji: "+" },
    { mode: "subtract", label: "− Subtract", emoji: "−" },
    { mode: "mixed", label: "⚡ Mixed", emoji: "±" },
    { mode: "lightning", label: "⚡⚡ Lightning", emoji: "⚡" },
  ];

  return (
    <div
      className="rounded-2xl p-4"
      style={{ backgroundColor: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
    >
      <div className="flex items-center justify-between mb-2">
        <p className="text-white font-black text-sm">⚡ Math Facts Speed Drills</p>
        {best.lightning > 0 && (
          <span className="text-xs font-bold px-2 py-0.5 rounded-full"
            style={{ backgroundColor: "rgba(245,197,24,0.20)", color: GOLD }}>
            {best.lightning} facts/min
          </span>
        )}
      </div>
      <div
        className="h-px mb-3"
        style={{ backgroundColor: "rgba(255,255,255,0.10)" }}
      />
      <div className="flex items-center justify-between text-xs text-blue-300 mb-3">
        <span>Personal best: {best.standard > 0 ? `${best.standard}/20` : ", "}</span>
        <span>Goal: 40/min ⚡</span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {buttons.map((b) => (
          <button
            key={b.mode}
            onClick={() => onLaunch(b.mode)}
            className="py-3 rounded-xl font-black text-sm transition-all hover:opacity-90 active:scale-95"
            style={{
              backgroundColor:
                b.mode === "lightning"
                  ? "rgba(220,38,38,0.30)"
                  : b.mode === "mixed"
                  ? "rgba(13,148,136,0.30)"
                  : "rgba(255,255,255,0.08)",
              color:
                b.mode === "lightning"
                  ? "#fca5a5"
                  : b.mode === "mixed"
                  ? "#5eead4"
                  : "white",
              border:
                b.mode === "lightning"
                  ? "1px solid rgba(220,38,38,0.40)"
                  : b.mode === "mixed"
                  ? "1px solid rgba(13,148,136,0.40)"
                  : "1px solid rgba(255,255,255,0.10)",
            }}
          >
            {b.label}
          </button>
        ))}
      </div>
    </div>
  );
}
