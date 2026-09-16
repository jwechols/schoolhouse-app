"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

// ─── Types ────────────────────────────────────────────────────────────────────

type Op = "add" | "subtract";

interface Question {
  a: number;
  b: number;
  op: Op;
  answer: number;
}

interface SessionHistory {
  date: string;
  score: number;
  total: number;
}

interface MercyMathFactsProps {
  onBack?: () => void;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const MERCY_ROSE = "#D4508A";
const QUESTIONS_PER_SET = 5;
const INTERNAL_LIMIT_MS = 30_000; // 30 s internal, no visible countdown for 5yo
const HISTORY_KEY = "mercy-mathfacts-history";
const CHOICE_COUNT = 4;

const CORRECT_PHRASES = [
  "Yes! 🌹",
  "Beautiful! 🌸",
  "You got it! ✨",
  "So smart! 💕",
];

const WRONG_PHRASES = [
  "Try again! 🌹",
  "You can do it! 🌸",
  "Almost! Try again! 💕",
];

// ─── Question generator ───────────────────────────────────────────────────────

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateQuestion(): Question {
  const op: Op = Math.random() < 0.5 ? "add" : "subtract";
  if (op === "add") {
    const a = randInt(0, 9);
    const b = randInt(0, 10 - a); // sum ≤ 10
    return { a, b, op, answer: a + b };
  } else {
    const a = randInt(1, 10);
    const b = randInt(0, a); // difference ≥ 0
    return { a, b, op, answer: a - b };
  }
}

function buildChoices(correct: number): number[] {
  const choices = new Set<number>([correct]);
  while (choices.size < CHOICE_COUNT) {
    const offset = randInt(-3, 3);
    const candidate = correct + offset;
    if (candidate >= 0 && candidate !== correct) {
      choices.add(candidate);
    }
  }
  // Shuffle
  const arr = Array.from(choices);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function buildSet(): Question[] {
  return Array.from({ length: QUESTIONS_PER_SET }, generateQuestion);
}

// ─── Princess Rose phrase helpers ────────────────────────────────────────────

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ─── localStorage helpers ─────────────────────────────────────────────────────

function saveHistory(session: SessionHistory) {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    const history: SessionHistory[] = raw ? (JSON.parse(raw) as SessionHistory[]) : [];
    history.unshift(session);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 50)));
  } catch {
    /* ignore */
  }
}

// ─── Confetti burst (CSS keyframes, no deps) ─────────────────────────────────

const CONFETTI_COLORS = ["#D4508A", "#f472b6", "#fbbf24", "#34d399", "#60a5fa", "#a78bfa"];

function ConfettiBurst() {
  const pieces = Array.from({ length: 18 }, (_, i) => i);
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <style>{`
        @keyframes confetti-fall {
          0%   { transform: translateY(-20px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }
        .confetti-piece {
          position: absolute;
          width: 10px;
          height: 10px;
          border-radius: 2px;
          animation: confetti-fall 1.4s ease-in forwards;
        }
      `}</style>
      {pieces.map((i) => (
        <div
          key={i}
          className="confetti-piece"
          style={{
            left: `${randInt(5, 95)}%`,
            top: `${randInt(-5, 20)}%`,
            backgroundColor: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
            animationDelay: `${(i * 0.06).toFixed(2)}s`,
            animationDuration: `${(1.2 + Math.random() * 0.6).toFixed(2)}s`,
          }}
        />
      ))}
    </div>
  );
}

// ─── Celebration screen ───────────────────────────────────────────────────────

function CelebrationScreen({ onMore, onBack }: { onMore: () => void; onBack?: () => void }) {
  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center px-6 text-center overflow-hidden"
      style={{ background: "linear-gradient(160deg, #fdf2f8 0%, #fce7f3 50%, #fbcfe8 100%)" }}
    >
      <ConfettiBurst />
      <div className="relative z-10 flex flex-col items-center">
        <div className="text-7xl mb-4">🌸</div>
        <h1 className="font-black text-5xl mb-3" style={{ color: MERCY_ROSE }}>
          5 Stars!
        </h1>
        <div className="text-4xl mb-4">🌟🌟🌟🌟🌟</div>
        <p className="font-black text-2xl mb-2" style={{ color: MERCY_ROSE }}>
          for Mercy!
        </p>
        <p className="text-pink-600 text-lg font-bold mb-10">Princess Rose says: Amazing! 🌹</p>
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <button
            onClick={onMore}
            className="w-full py-5 rounded-3xl font-black text-white text-xl shadow-xl transition-all hover:scale-105 active:scale-95"
            style={{ backgroundColor: MERCY_ROSE }}
          >
            Play again! 🌸
          </button>
          {onBack && (
            <button
              onClick={onBack}
              className="w-full py-3 rounded-2xl font-bold text-pink-500 hover:text-pink-700 transition-colors text-sm"
              style={{ backgroundColor: "rgba(212,80,138,0.08)" }}
            >
              ← Back
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Single question screen ───────────────────────────────────────────────────

type AnswerState = "idle" | "correct" | "wrong";

function QuestionCard({
  question,
  qNum,
  total,
  onAnswer,
}: {
  question: Question;
  qNum: number;
  total: number;
  onAnswer: (correct: boolean) => void;
}) {
  const [choices] = useState<number[]>(() => buildChoices(question.answer));
  const [answerState, setAnswerState] = useState<AnswerState>("idle");
  const [tutorMsg, setTutorMsg] = useState<string | null>(null);
  const [wrongChoices, setWrongChoices] = useState<Set<number>>(new Set());
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Internal 30 s limit, no visible countdown
  const internalTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    internalTimerRef.current = setTimeout(() => {
      if (answerState === "idle") {
        // Time's up silently, mark wrong, show answer, move on
        setTutorMsg(randomFrom(WRONG_PHRASES));
        setAnswerState("wrong");
        setTimeout(() => onAnswer(false), 1800);
      }
    }, INTERNAL_LIMIT_MS);
    return () => {
      if (internalTimerRef.current) clearTimeout(internalTimerRef.current);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function handleChoice(choice: number) {
    if (answerState !== "idle" && !wrongChoices.has(-1)) return; // locked after correct
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    if (choice === question.answer) {
      if (internalTimerRef.current) clearTimeout(internalTimerRef.current);
      setTutorMsg(randomFrom(CORRECT_PHRASES));
      setAnswerState("correct");
      timeoutRef.current = setTimeout(() => onAnswer(true), 1200);
    } else {
      // Wrong: mark this choice, keep idle so they can try again
      setWrongChoices((prev) => { const next = new Set(Array.from(prev)); next.add(choice); return next; });
      setTutorMsg(randomFrom(WRONG_PHRASES));
    }
  }

  const symbol = question.op === "add" ? "+" : "−";

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-start px-4 pt-8 pb-6"
      style={{ background: "linear-gradient(160deg, #fdf2f8 0%, #fce7f3 50%, #fbcfe8 100%)" }}
    >
      {/* Progress dots */}
      <div className="flex gap-2 mb-8">
        {Array.from({ length: total }, (_, i) => (
          <div
            key={i}
            className="w-3 h-3 rounded-full transition-all duration-300"
            style={{
              backgroundColor: i < qNum - 1 ? MERCY_ROSE : i === qNum - 1 ? "#f9a8d4" : "#fce7f3",
              border: i === qNum - 1 ? `2px solid ${MERCY_ROSE}` : "none",
            }}
          />
        ))}
      </div>

      {/* Problem */}
      <div
        className="rounded-3xl px-10 py-8 mb-6 flex items-center gap-4 shadow-xl"
        style={{ backgroundColor: "white", border: `3px solid ${MERCY_ROSE}30` }}
      >
        <span className="font-black select-none" style={{ fontSize: "4.5rem", color: "#1e293b" }}>
          {question.a}
        </span>
        <span className="font-black select-none" style={{ fontSize: "4rem", color: MERCY_ROSE }}>
          {symbol}
        </span>
        <span className="font-black select-none" style={{ fontSize: "4.5rem", color: "#1e293b" }}>
          {question.b}
        </span>
        <span className="font-black select-none" style={{ fontSize: "3.5rem", color: "#94a3b8" }}>
          =
        </span>
        <span className="font-black select-none" style={{ fontSize: "4.5rem", color: "#cbd5e1" }}>
          ?
        </span>
      </div>

      {/* Princess Rose message */}
      <div className="h-10 mb-4 flex items-center justify-center">
        {tutorMsg && (
          <p className="font-black text-xl" style={{ color: MERCY_ROSE }}>
            Princess Rose says: {tutorMsg}
          </p>
        )}
      </div>

      {/* Choices */}
      <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
        {choices.map((choice) => {
          const isWrong = wrongChoices.has(choice);
          const isCorrectAnswer = choice === question.answer;
          const isSelected = answerState === "correct" && isCorrectAnswer;

          return (
            <button
              key={choice}
              onClick={() => !isWrong && answerState !== "correct" && handleChoice(choice)}
              disabled={isWrong || answerState === "correct"}
              className="rounded-3xl font-black transition-all duration-150 shadow-lg"
              style={{
                fontSize: "3rem",
                paddingTop: "1rem",
                paddingBottom: "1rem",
                backgroundColor: isSelected
                  ? "#86efac"
                  : isWrong
                  ? "#fce7f3"
                  : "white",
                border: isSelected
                  ? "3px solid #22c55e"
                  : isWrong
                  ? `3px solid #fce7f3`
                  : `3px solid ${MERCY_ROSE}30`,
                color: isWrong ? "#e9d5ff" : "#1e293b",
                transform: isSelected ? "scale(1.06)" : isWrong ? "scale(0.95)" : "scale(1)",
                opacity: isWrong ? 0.4 : 1,
              }}
            >
              {choice}
            </button>
          );
        })}
      </div>

      {/* Correct flash */}
      {answerState === "correct" && (
        <div className="mt-6 text-5xl animate-bounce">🌟</div>
      )}
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

type Phase = "playing" | "celebration";

export default function MercyMathFacts({ onBack }: MercyMathFactsProps) {
  const router = useRouter();
  // Fall back to hub if no onBack provided (e.g. loaded from play route without prop)
  const goBack = onBack ?? (() => router.push("/kids/mercy/hub"));
  const [phase, setPhase] = useState<Phase>("playing");
  const [questions, setQuestions] = useState<Question[]>(() => buildSet());
  const [qIdx, setQIdx] = useState(0);
  const [score, setScore] = useState(0);

  function handleAnswer(correct: boolean) {
    const nextScore = score + (correct ? 1 : 0);
    const nextIdx = qIdx + 1;

    if (nextIdx >= QUESTIONS_PER_SET) {
      // Session done, save history then celebrate
      saveHistory({
        date: new Date().toISOString(),
        score: nextScore,
        total: QUESTIONS_PER_SET,
      });
      setScore(nextScore);
      setPhase("celebration");
    } else {
      setScore(nextScore);
      setQIdx(nextIdx);
    }
  }

  function startNew() {
    setQuestions(buildSet());
    setQIdx(0);
    setScore(0);
    setPhase("playing");
  }

  if (phase === "celebration") {
    return <CelebrationScreen onMore={startNew} onBack={goBack} />;
  }

  return (
    <QuestionCard
      key={qIdx}
      question={questions[qIdx]}
      qNum={qIdx + 1}
      total={QUESTIONS_PER_SET}
      onAnswer={handleAnswer}
    />
  );
}
