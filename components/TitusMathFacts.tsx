"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getTitusSettings } from "@/lib/titus-settings";

// ─── Types ────────────────────────────────────────────────────────────────────

type Op = "add" | "subtract" | "multiply" | "divide";

interface Question {
  problem: string;
  answer: number;
  op: Op;
}

interface AnswerRecord {
  problem: string;
  answer: number;
  userAnswer: number | null;
  correct: boolean;
  timeTaken: number; // seconds
}

interface SessionHistory {
  date: string;
  score: number;
  total: number;
  fastestSecs: number;
  slowestSecs: number;
}

interface TitusMathFactsProps {
  onBack?: () => void;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const TITUS_BLUE = "#2563eb";
const QUESTIONS_PER_SET = 5;
const PER_Q_SECONDS = 15;
const HISTORY_KEY = "titus-mathfacts-history";

// ─── Question generators ──────────────────────────────────────────────────────

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateAdd(): Question {
  const a = randInt(1, 20);
  const b = randInt(1, 20);
  return { problem: `${a} + ${b}`, answer: a + b, op: "add" };
}

function generateSubtract(): Question {
  const a = randInt(5, 20);
  const b = randInt(1, a);
  return { problem: `${a} − ${b}`, answer: a - b, op: "subtract" };
}

function generateMultiply(): Question {
  const a = randInt(2, 9);
  const b = randInt(2, 9);
  return { problem: `${a} × ${b}`, answer: a * b, op: "multiply" };
}

function generateDivide(): Question {
  const a = randInt(2, 9);
  const b = randInt(2, 9);
  return { problem: `${a * b} ÷ ${b}`, answer: a, op: "divide" };
}

function generateQuestion(): Question {
  const r = Math.random();
  if (r < 0.25) return generateAdd();
  if (r < 0.50) return generateSubtract();
  if (r < 0.75) return generateMultiply();
  return generateDivide();
}

function buildSet(): Question[] {
  return Array.from({ length: QUESTIONS_PER_SET }, generateQuestion);
}

// ─── Web Audio helpers ────────────────────────────────────────────────────────

function playTone(
  ctx: AudioContext,
  freq: number,
  type: OscillatorType,
  duration: number,
  gain = 0.25
) {
  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();
  osc.connect(gainNode);
  gainNode.connect(ctx.destination);
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime);
  gainNode.gain.setValueAtTime(gain, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + duration);
}

function playCorrectSound(ctx: AudioContext) {
  playTone(ctx, 880, "sine", 0.12);
  setTimeout(() => playTone(ctx, 1100, "sine", 0.18), 100);
}

function playWrongSound(ctx: AudioContext) {
  playTone(ctx, 220, "sawtooth", 0.20, 0.15);
}

// ─── localStorage helpers ─────────────────────────────────────────────────────

function loadHistory(): SessionHistory[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? (JSON.parse(raw) as SessionHistory[]) : [];
  } catch {
    return [];
  }
}

function saveHistory(session: SessionHistory) {
  if (typeof window === "undefined") return;
  try {
    const history = loadHistory();
    history.unshift(session);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 50)));
  } catch {
    /* ignore */
  }
}

// ─── Timer bar ────────────────────────────────────────────────────────────────

function TimerBar({ elapsed, total }: { elapsed: number; total: number }) {
  const pct = Math.max(0, Math.min(100, ((total - elapsed) / total) * 100));
  const color = pct > 60 ? "#22c55e" : pct > 25 ? "#eab308" : "#ef4444";
  return (
    <div className="w-full rounded-full h-3 overflow-hidden mb-4" style={{ backgroundColor: "rgba(255,255,255,0.12)" }}>
      <div
        className="h-full rounded-full transition-all duration-300"
        style={{ width: `${pct}%`, backgroundColor: color }}
      />
    </div>
  );
}

// ─── Preview screen ───────────────────────────────────────────────────────────

function PreviewScreen({ onStart, onBack }: { onStart: () => void; onBack?: () => void }) {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
      style={{ background: "linear-gradient(160deg, #1e3a8a 0%, #1e40af 50%, #1d4ed8 100%)" }}
    >
      {onBack && (
        <button
          onClick={onBack}
          className="absolute top-6 left-4 text-blue-300 text-sm font-bold hover:text-white transition-colors"
        >
          ← Back
        </button>
      )}
      <div className="text-6xl mb-4">🎣</div>
      <h1 className="text-white font-black text-3xl mb-2">Math Facts!</h1>
      <p className="text-blue-200 text-lg mb-2 font-bold">Today: {QUESTIONS_PER_SET} quick math facts.</p>
      <p className="text-blue-300 text-base mb-8">You have {PER_Q_SECONDS} seconds per question.<br />Buck believes in you! 🎣</p>
      <button
        onClick={onStart}
        className="px-10 py-5 rounded-3xl font-black text-white text-2xl shadow-2xl transition-all hover:scale-105 active:scale-95"
        style={{ backgroundColor: TITUS_BLUE, boxShadow: "0 8px 32px rgba(37,99,235,0.5)" }}
      >
        Ready? Go! 🚀
      </button>
    </div>
  );
}

// ─── Session summary screen ───────────────────────────────────────────────────

function SummaryScreen({
  records,
  onMore,
  onBack,
}: {
  records: AnswerRecord[];
  onMore: () => void;
  onBack?: () => void;
}) {
  const score = records.filter((r) => r.correct).length;
  const total = records.length;
  const pct = Math.round((score / total) * 100);
  const great = pct > 80;
  const times = records.map((r) => r.timeTaken).filter((t) => t > 0);
  const fastest = times.length > 0 ? Math.min(...times) : 0;
  const slowest = times.length > 0 ? Math.max(...times) : 0;

  useEffect(() => {
    saveHistory({
      date: new Date().toISOString(),
      score,
      total,
      fastestSecs: fastest,
      slowestSecs: slowest,
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
      style={{ background: "linear-gradient(160deg, #1e3a8a 0%, #1e40af 50%, #1d4ed8 100%)" }}
    >
      <div className="text-6xl mb-4">{great ? "🏆" : "💪"}</div>
      <div className="text-white font-black text-5xl mb-1">{score}/{total}</div>
      <div className="font-black text-2xl mb-4" style={{ color: pct >= 80 ? "#86efac" : "#fcd34d" }}>
        {pct}%
      </div>
      <p className="text-blue-100 text-lg font-bold mb-6">
        Buck says: {great ? "Great work! 🎣" : "Keep practicing! 🎣"}
      </p>

      <div className="rounded-2xl p-4 mb-6 w-full max-w-xs" style={{ backgroundColor: "rgba(255,255,255,0.10)" }}>
        <div className="grid grid-cols-2 gap-3 text-center">
          <div>
            <p className="text-white font-black text-xl">{fastest}s</p>
            <p className="text-blue-300 text-xs">Fastest</p>
          </div>
          <div>
            <p className="text-white font-black text-xl">{slowest}s</p>
            <p className="text-blue-300 text-xs">Slowest</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 w-full max-w-xs">
        <button
          onClick={onMore}
          className="w-full py-4 rounded-2xl font-black text-white text-lg transition-all hover:opacity-90 active:scale-95"
          style={{ backgroundColor: TITUS_BLUE }}
        >
          Do 5 more? 🎣
        </button>
        {onBack && (
          <button
            onClick={onBack}
            className="w-full py-3 rounded-2xl font-bold text-blue-300 hover:text-white transition-colors text-sm"
            style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
          >
            ← Back
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Drill screen ─────────────────────────────────────────────────────────────

type FeedbackState = "idle" | "correct" | "wrong";

function DrillScreen({
  questions,
  onComplete,
  onBack,
}: {
  questions: Question[];
  onComplete: (records: AnswerRecord[]) => void;
  onBack: () => void;
}) {
  const [qIdx, setQIdx] = useState(0);
  const [inputVal, setInputVal] = useState("");
  const [feedback, setFeedback] = useState<FeedbackState>("idle");
  const [showAnswer, setShowAnswer] = useState<number | null>(null);
  const [records, setRecords] = useState<AnswerRecord[]>([]);
  const [qElapsed, setQElapsed] = useState(0);
  const [streak, setStreak] = useState(0);
  const [burstEmojis, setBurstEmojis] = useState<{id: number, emoji: string, x: number, y: number}[]>([]);

  function triggerBurst(emojis: string[]) {
    const newBursts = emojis.map((emoji, i) => ({
      id: Date.now() + i,
      emoji,
      x: 20 + Math.random() * 60,
      y: 20 + Math.random() * 40,
    }));
    setBurstEmojis(prev => [...prev, ...newBursts]);
    setTimeout(() => setBurstEmojis(prev => prev.filter(b => !newBursts.find(n => n.id === b.id))), 1500);
  }

  const qStartRef = useRef<number>(Date.now());
  const qTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const transitioning = useRef(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const currentQ = questions[qIdx];

  // Get settings once on mount
  const [soundEnabled, setSoundEnabled] = useState(false);
  useEffect(() => {
    const settings = getTitusSettings();
    setSoundEnabled(settings.soundEnabled);
  }, []);

  function getAudioCtx(): AudioContext | null {
    if (!soundEnabled) return null;
    if (!audioCtxRef.current) {
      try {
        audioCtxRef.current = new AudioContext();
      } catch {
        return null;
      }
    }
    return audioCtxRef.current;
  }

  function stopQTimer() {
    if (qTimerRef.current) {
      clearInterval(qTimerRef.current);
      qTimerRef.current = null;
    }
  }

  // Per-question timer
  useEffect(() => {
    if (feedback !== "idle") return;
    qTimerRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - qStartRef.current) / 1000);
      setQElapsed(elapsed);
      if (elapsed >= PER_Q_SECONDS) {
        handleTimeout();
      }
    }, 300);
    return () => stopQTimer();
  }); // intentionally re-runs to pick up currentQ changes

  function handleTimeout() {
    if (transitioning.current) return;
    transitioning.current = true;
    stopQTimer();
    const elapsed = Math.floor((Date.now() - qStartRef.current) / 1000);
    const rec: AnswerRecord = {
      problem: currentQ.problem,
      answer: currentQ.answer,
      userAnswer: null,
      correct: false,
      timeTaken: elapsed,
    };
    const ctx = getAudioCtx();
    if (ctx) playWrongSound(ctx);
    setFeedback("wrong");
    setShowAnswer(currentQ.answer);
    const updated = [...records, rec];
    setRecords(updated);
    setTimeout(() => advance(qIdx + 1, updated), 2000);
  }

  const advance = useCallback(
    (nextIdx: number, currentRecords: AnswerRecord[]) => {
      if (nextIdx >= questions.length) {
        stopQTimer();
        onComplete(currentRecords);
        return;
      }
      setQIdx(nextIdx);
      setInputVal("");
      setFeedback("idle");
      setShowAnswer(null);
      setQElapsed(0);
      qStartRef.current = Date.now();
      transitioning.current = false;
      setTimeout(() => inputRef.current?.focus(), 50);
    },
    [questions.length, onComplete]
  );

  function submitAnswer() {
    if (transitioning.current || feedback !== "idle") return;
    const parsed = parseInt(inputVal.trim(), 10);
    if (isNaN(parsed)) return;

    transitioning.current = true;
    stopQTimer();
    const elapsed = Math.max(1, Math.floor((Date.now() - qStartRef.current) / 1000));
    const isCorrect = parsed === currentQ.answer;
    const rec: AnswerRecord = {
      problem: currentQ.problem,
      answer: currentQ.answer,
      userAnswer: parsed,
      correct: isCorrect,
      timeTaken: elapsed,
    };
    const updated = [...records, rec];
    setRecords(updated);

    const ctx = getAudioCtx();
    if (isCorrect) {
      if (ctx) playCorrectSound(ctx);
      setFeedback("correct");
      setInputVal("");
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak >= 5) {
        triggerBurst(["🏆","⭐","⭐","⭐","🎣","🎉","🔥"]);
      } else {
        triggerBurst(["⚡","🔥","💥","🎣","⭐"]);
      }
      setTimeout(() => advance(qIdx + 1, updated), 600);
    } else {
      if (ctx) playWrongSound(ctx);
      setFeedback("wrong");
      setShowAnswer(currentQ.answer);
      setStreak(0);
      setTimeout(() => advance(qIdx + 1, updated), 2000);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      submitAnswer();
    }
  }

  // Autofocus on mount
  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 50);
  }, []);

  if (!currentQ) return null;

  return (
    <div
      className="min-h-screen flex flex-col px-4 py-6 max-w-lg md:max-w-2xl mx-auto"
      style={{ background: "linear-gradient(160deg, #1e3a8a 0%, #1e40af 50%, #1d4ed8 100%)" }}
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
          🎣 Math Facts
        </p>
        <span className="text-white font-black text-sm">
          {qIdx + 1} / {QUESTIONS_PER_SET}
        </span>
      </div>

      {/* Timer bar */}
      <TimerBar elapsed={qElapsed} total={PER_Q_SECONDS} />

      {/* Timer label */}
      <div className="flex justify-end mb-2">
        <span
          className="text-xs font-bold"
          style={{ color: qElapsed >= PER_Q_SECONDS - 5 ? "#ef4444" : "#93c5fd" }}
        >
          {Math.max(0, PER_Q_SECONDS - qElapsed)}s left
        </span>
      </div>

      {/* Question card */}
      <div
        className="flex-1 flex flex-col items-center justify-center rounded-3xl py-12 px-6 mb-6 transition-all duration-200"
        style={{
          backgroundColor:
            feedback === "correct"
              ? "rgba(34,197,94,0.18)"
              : feedback === "wrong"
              ? "rgba(239,68,68,0.18)"
              : "rgba(255,255,255,0.08)",
          border:
            feedback === "correct"
              ? "2px solid #22c55e"
              : feedback === "wrong"
              ? "2px solid #ef4444"
              : "1px solid rgba(255,255,255,0.12)",
        }}
      >
        <p
          className="font-black text-white text-center leading-none mb-8 select-none"
          style={{ fontSize: "clamp(3rem, 14vw, 5.5rem)" }}
        >
          {currentQ.problem} = ?
        </p>

        {feedback === "idle" && (
          <input
            ref={inputRef}
            type="number"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="?"
            className="w-36 text-center rounded-2xl font-black text-3xl py-4 text-white border-2 focus:outline-none placeholder-white/30 transition-all"
            style={{
              backgroundColor: "rgba(255,255,255,0.10)",
              borderColor: "rgba(255,255,255,0.25)",
              caretColor: "#60a5fa",
            }}
            inputMode="numeric"
            pattern="[0-9]*"
            autoComplete="off"
          />
        )}

        {feedback === "correct" && (
          <p className="text-6xl animate-bounce">✅</p>
        )}

        {feedback === "wrong" && showAnswer !== null && (
          <div className="flex flex-col items-center gap-2">
            <p className="text-5xl">❌</p>
            <div
              className="mt-2 px-6 py-3 rounded-2xl font-black text-white text-2xl"
              style={{ backgroundColor: "rgba(239,68,68,0.30)" }}
            >
              Answer: <span style={{ color: "#fbbf24" }}>{showAnswer}</span>
            </div>
          </div>
        )}
      </div>

      {/* Submit button */}
      {feedback === "idle" && (
        <button
          onClick={submitAnswer}
          disabled={inputVal.trim() === ""}
          className="w-full py-4 rounded-2xl font-black text-white text-xl transition-all hover:opacity-90 active:scale-[0.97] disabled:opacity-30 btn-bouncy"
          style={{ backgroundColor: TITUS_BLUE }}
        >
          ✓ Check
        </button>
      )}

      {/* Emoji burst layer */}
      <div style={{position:"fixed",top:0,left:0,width:"100%",height:"100%",pointerEvents:"none",zIndex:9999}}>
        {burstEmojis.map(b => (
          <div key={b.id} style={{
            position:"absolute",
            left:`${b.x}%`,
            top:`${b.y}%`,
            fontSize:"2rem",
            animation:"floatUp 1.5s ease forwards",
            userSelect:"none",
          }}>{b.emoji}</div>
        ))}
      </div>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

type Phase = "preview" | "drill" | "summary";

export default function TitusMathFacts({ onBack }: TitusMathFactsProps) {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("preview");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [sessionRecords, setSessionRecords] = useState<AnswerRecord[]>([]);

  // Fall back to hub if no onBack provided (e.g. loaded from play route without prop)
  const goBack = onBack ?? (() => router.push("/kids/titus/hub"));

  function startSet() {
    setQuestions(buildSet());
    setSessionRecords([]);
    setPhase("drill");
  }

  function handleComplete(records: AnswerRecord[]) {
    setSessionRecords(records);
    setPhase("summary");
  }

  if (phase === "preview") {
    return <PreviewScreen onStart={startSet} onBack={goBack} />;
  }

  if (phase === "drill") {
    return (
      <DrillScreen
        questions={questions}
        onComplete={handleComplete}
        onBack={() => setPhase("preview")}
      />
    );
  }

  if (phase === "summary") {
    return (
      <SummaryScreen
        records={sessionRecords}
        onMore={startSet}
        onBack={goBack}
      />
    );
  }

  return null;
}
