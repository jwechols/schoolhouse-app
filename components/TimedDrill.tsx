"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  ALL_QUESTIONS,
  getQuestionsByTopic,
  sampleQuestions,
  type SingaporeQuestion,
  type TopicKey,
} from "@/lib/singapore-math";
import ShowWork from "@/components/ShowWork";

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface QuestionResult {
  question: SingaporeQuestion;
  chosen_index: number | null; // null = timed out
  correct: boolean;
  time_taken: number; // seconds
}

export interface DrillResults {
  topic: string;
  question_count: number;
  correct: number;
  total: number;
  avg_time: number;
  fastest_time: number;
  slowest_time: number;
  results: QuestionResult[];
  completed_at: string;
}

interface TimedDrillProps {
  topic: TopicKey | "all";
  difficulty?: 1 | 2 | 3;
  questionCount?: number;
  timeLimitSeconds?: number | null; // overall limit; null = per-question
  perQuestionSeconds?: number;
  testMode?: boolean;
  onComplete: (results: DrillResults) => void;
  onBack?: () => void;
}

const NAVY = "#1b3a6b";
const GOLD = "#f5c518";

// ─── localStorage helpers ──────────────────────────────────────────────────────

function saveDrillHistory(results: DrillResults) {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem("truma-drill-history");
    const history: DrillResults[] = raw ? (JSON.parse(raw) as DrillResults[]) : [];
    history.unshift(results);
    localStorage.setItem("truma-drill-history", JSON.stringify(history.slice(0, 50)));

    // Update topic mastery
    const masteryRaw = localStorage.getItem("truma-topic-mastery");
    const mastery: Record<string, { sessions: number; avg_score: number; avg_time: number }> =
      masteryRaw ? JSON.parse(masteryRaw) : {};
    const key = results.topic;
    const prev = mastery[key] ?? { sessions: 0, avg_score: 0, avg_time: 0 };
    const score = results.total > 0 ? Math.round((results.correct / results.total) * 100) : 0;
    mastery[key] = {
      sessions: prev.sessions + 1,
      avg_score: Math.round((prev.avg_score * prev.sessions + score) / (prev.sessions + 1)),
      avg_time: Math.round((prev.avg_time * prev.sessions + results.avg_time) / (prev.sessions + 1)),
    };
    localStorage.setItem("truma-topic-mastery", JSON.stringify(mastery));
  } catch {
    // ignore
  }
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function TimerBar({ seconds, maxSeconds }: { seconds: number; maxSeconds: number }) {
  const pct = maxSeconds > 0 ? Math.max(0, (seconds / maxSeconds) * 100) : 0;
  const color =
    pct > 60 ? "#22c55e" : pct > 30 ? "#eab308" : "#ef4444";
  return (
    <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-1000"
        style={{ width: `${pct}%`, backgroundColor: color }}
      />
    </div>
  );
}

function ChoiceButton({
  label,
  text,
  onClick,
  state,
  disabled,
}: {
  label: string;
  text: string;
  onClick: () => void;
  state: "default" | "correct" | "wrong" | "reveal";
  disabled: boolean;
}) {
  const bg =
    state === "correct"
      ? "#16a34a"
      : state === "wrong"
      ? "#dc2626"
      : state === "reveal"
      ? "#2563eb"
      : "rgba(255,255,255,0.10)";
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full rounded-2xl p-4 text-left flex items-start gap-3 transition-all duration-150 hover:scale-[1.02] active:scale-[0.98] disabled:cursor-default"
      style={{ backgroundColor: bg, border: "1px solid rgba(255,255,255,0.15)" }}
    >
      <span
        className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-black"
        style={{ backgroundColor: GOLD, color: NAVY }}
      >
        {label}
      </span>
      <span className="text-white text-sm font-medium leading-snug">{text}</span>
    </button>
  );
}

// ─── Results screen ────────────────────────────────────────────────────────────

function DrillResultsScreen({
  results,
  onRetry,
  onBack,
}: {
  results: DrillResults;
  onRetry: () => void;
  onBack?: () => void;
}) {
  const score = results.total > 0 ? Math.round((results.correct / results.total) * 100) : 0;
  const slowTopics = results.results
    .filter((r) => !r.correct || r.time_taken > 45)
    .map((r) => r.question.subtopic);
  const weakSubtopics = Array.from(new Set(slowTopics)).slice(0, 3);

  const encouragement = (() => {
    if (score >= 90) return "Excellent work! You're well ahead of schedule for the MCA test.";
    if (score >= 75) return `Good progress! Watch your timing, aim for under 40s per question.`;
    if (score >= 55) return `Keep going, accuracy comes before speed. Review the wrong answers below.`;
    return `This topic needs more practice. Study the solutions carefully, then try again.`;
  })();

  return (
    <div
      className="min-h-screen px-4 py-6 max-w-lg md:max-w-2xl mx-auto"
      style={{ background: "linear-gradient(160deg, #1b3a6b 0%, #0f2547 100%)" }}
    >
      <div className="text-center mb-6">
        <div className="text-6xl mb-2">{score >= 80 ? "🎯" : score >= 60 ? "📈" : "📚"}</div>
        <h2 className="text-white font-black text-3xl">{score}%</h2>
        <p className="text-blue-200 text-sm mt-1">
          {results.correct} / {results.total} correct
        </p>
      </div>

      {/* Timing stats */}
      <div
        className="rounded-2xl p-4 mb-5 grid grid-cols-3 gap-3 text-center"
        style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
      >
        <div>
          <div className="text-white font-black text-lg">{results.avg_time}s</div>
          <div className="text-blue-300 text-xs">Avg / question</div>
        </div>
        <div>
          <div style={{ color: "#22c55e" }} className="font-black text-lg">
            {results.fastest_time}s
          </div>
          <div className="text-blue-300 text-xs">Fastest</div>
        </div>
        <div>
          <div style={{ color: "#ef4444" }} className="font-black text-lg">
            {results.slowest_time}s
          </div>
          <div className="text-blue-300 text-xs">Slowest</div>
        </div>
      </div>

      {/* Encouragement */}
      <div
        className="rounded-2xl p-4 mb-5"
        style={{ backgroundColor: "rgba(245,197,24,0.12)", border: `1px solid ${GOLD}40` }}
      >
        <p className="text-white text-sm leading-relaxed">{encouragement}</p>
        {weakSubtopics.length > 0 && (
          <p className="text-yellow-300 text-xs mt-2 font-bold">
            Weak areas: {weakSubtopics.join(", ")}
          </p>
        )}
      </div>

      {/* Per-question breakdown */}
      <h3 className="text-blue-200 font-bold text-sm uppercase tracking-wider mb-3">
        Question Breakdown
      </h3>
      <div className="flex flex-col gap-2 mb-6">
        {results.results.map((r, i) => (
          <div
            key={r.question.id}
            className="rounded-xl p-3 flex items-start gap-3"
            style={{
              backgroundColor: r.correct
                ? "rgba(22,163,74,0.15)"
                : "rgba(220,38,38,0.15)",
            }}
          >
            <span className="text-lg shrink-0">{r.correct ? "✓" : "✗"}</span>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs leading-snug line-clamp-2">
                Q{i + 1}: {r.question.text}
              </p>
              <p className="text-blue-300 text-xs mt-1">
                {r.time_taken}s · {r.question.subtopic}
              </p>
              {!r.correct && (
                <div
                  className="mt-2 rounded-lg p-2"
                  style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
                >
                  <p className="text-yellow-300 text-xs font-bold mb-1">Solution:</p>
                  {r.question.solution_steps.slice(0, 3).map((step, si) => (
                    <p key={si} className="text-blue-200 text-xs">
                      {si + 1}. {step}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <button
          onClick={onRetry}
          className="flex-1 py-4 rounded-2xl font-black text-navy text-base shadow-lg"
          style={{ backgroundColor: GOLD }}
        >
          Try Again
        </button>
        {onBack && (
          <button
            onClick={onBack}
            className="py-4 px-5 rounded-2xl font-bold text-blue-200 text-sm"
            style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
          >
            Back
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────

export default function TimedDrill({
  topic,
  difficulty,
  questionCount = 10,
  timeLimitSeconds = null,
  perQuestionSeconds = 60,
  testMode = false,
  onComplete,
  onBack,
}: TimedDrillProps) {
  const [questions, setQuestions] = useState<SingaporeQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(perQuestionSeconds);
  const [totalTimeLeft, setTotalTimeLeft] = useState(timeLimitSeconds ?? 0);
  const [questionResults, setQuestionResults] = useState<QuestionResult[]>([]);
  const [choiceState, setChoiceState] = useState<"selecting" | "revealed">("selecting");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [drillResults, setDrillResults] = useState<DrillResults | null>(null);
  const [key, setKey] = useState(0); // for re-mounting/retry
  const [showWorkOpen, setShowWorkOpen] = useState(false);

  // Build question bank
  useEffect(() => {
    let pool =
      topic === "all"
        ? ALL_QUESTIONS
        : getQuestionsByTopic(topic as TopicKey);
    if (difficulty) pool = pool.filter((q) => q.difficulty === difficulty);
    const sampled = sampleQuestions(topic, questionCount);
    setQuestions(sampled);
    setCurrentIndex(0);
    setQuestionResults([]);
    setChoiceState("selecting");
    setSelectedIndex(null);
    setTimeLeft(perQuestionSeconds);
    setTotalTimeLeft(timeLimitSeconds ?? 0);
    setDrillResults(null);
    setQuestionStartTime(Date.now());
  }, [topic, difficulty, questionCount, perQuestionSeconds, timeLimitSeconds, key]);

  const currentQuestion = questions[currentIndex];

  // Per-question countdown
  useEffect(() => {
    if (!currentQuestion || choiceState === "revealed" || drillResults) return;
    if (timeLimitSeconds !== null) return; // total timer mode, no per-question timer

    if (timeLeft <= 0) {
      handleAnswer(null);
      return;
    }
    const id = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(id);
  });

  // Total time countdown
  useEffect(() => {
    if (timeLimitSeconds === null || drillResults) return;
    if (totalTimeLeft <= 0) {
      // Time up, force finish
      finishDrill([...questionResults]);
      return;
    }
    const id = setTimeout(() => setTotalTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(id);
  });

  const finishDrill = useCallback(
    (results: QuestionResult[]) => {
      const correct = results.filter((r) => r.correct).length;
      const times = results.map((r) => r.time_taken);
      const avg =
        times.length > 0 ? Math.round(times.reduce((a, b) => a + b, 0) / times.length) : 0;
      const drillRes: DrillResults = {
        topic,
        question_count: results.length,
        correct,
        total: results.length,
        avg_time: avg,
        fastest_time: times.length > 0 ? Math.min(...times) : 0,
        slowest_time: times.length > 0 ? Math.max(...times) : 0,
        results,
        completed_at: new Date().toISOString(),
      };
      saveDrillHistory(drillRes);
      setDrillResults(drillRes);
      onComplete(drillRes);
    },
    [topic, onComplete]
  );

  function handleAnswer(chosenIndex: number | null) {
    if (!currentQuestion) return;
    const timeTaken = Math.round((Date.now() - questionStartTime) / 1000);
    const correct =
      chosenIndex !== null && chosenIndex === currentQuestion.correct_index;

    const result: QuestionResult = {
      question: currentQuestion,
      chosen_index: chosenIndex,
      correct,
      time_taken: timeTaken,
    };

    setSelectedIndex(chosenIndex);

    if (testMode) {
      // No feedback, advance immediately
      const newResults = [...questionResults, result];
      if (currentIndex + 1 >= questions.length) {
        finishDrill(newResults);
      } else {
        setQuestionResults(newResults);
        setCurrentIndex((i) => i + 1);
        setTimeLeft(perQuestionSeconds);
        setChoiceState("selecting");
        setSelectedIndex(null);
        setQuestionStartTime(Date.now());
      }
    } else {
      // Drill mode, show answer
      setChoiceState("revealed");
      const newResults = [...questionResults, result];
      setQuestionResults(newResults);

      if (currentIndex + 1 >= questions.length) {
        setTimeout(() => finishDrill(newResults), correct ? 1200 : 3000);
      } else {
        setTimeout(
          () => {
            setCurrentIndex((i) => i + 1);
            setTimeLeft(perQuestionSeconds);
            setChoiceState("selecting");
            setSelectedIndex(null);
            setQuestionStartTime(Date.now());
          },
          correct ? 1200 : 3000
        );
      }
    }
  }

  if (drillResults) {
    return (
      <DrillResultsScreen
        results={drillResults}
        onRetry={() => setKey((k) => k + 1)}
        onBack={onBack}
      />
    );
  }

  if (!currentQuestion) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "linear-gradient(160deg, #1b3a6b 0%, #0f2547 100%)" }}
      >
        <p className="text-white text-lg">Loading questions…</p>
      </div>
    );
  }

  const choiceLabels = ["A", "B", "C", "D"];

  function getChoiceState(idx: number): "default" | "correct" | "wrong" | "reveal" {
    if (choiceState === "selecting") return "default";
    if (idx === currentQuestion.correct_index) return "correct";
    if (idx === selectedIndex && idx !== currentQuestion.correct_index) return "wrong";
    return "default";
  }

  const totalMinutes = Math.floor(totalTimeLeft / 60);
  const totalSecs = totalTimeLeft % 60;

  return (
    <div
      className="min-h-screen px-4 py-6 max-w-lg md:max-w-2xl mx-auto"
      style={{ background: "linear-gradient(160deg, #1b3a6b 0%, #0f2547 100%)" }}
    >
      {/* Header row */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-blue-300 text-xs font-bold uppercase tracking-wider">
            {testMode ? "Test Mode" : "Drill Mode"} · {topic}
          </p>
          <p className="text-white font-black text-sm">
            Question {currentIndex + 1} of {questions.length}
          </p>
        </div>
        {timeLimitSeconds !== null ? (
          <div
            className="px-4 py-2 rounded-xl font-black text-sm"
            style={{
              backgroundColor: totalTimeLeft < 120 ? "#dc2626" : "rgba(255,255,255,0.12)",
              color: "white",
            }}
          >
            {totalMinutes}:{String(totalSecs).padStart(2, "0")}
          </div>
        ) : (
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center font-black text-lg"
            style={{
              backgroundColor:
                timeLeft > 30 ? "#16a34a30" : timeLeft > 10 ? "#eab30830" : "#dc262630",
              color: timeLeft > 30 ? "#22c55e" : timeLeft > 10 ? "#eab308" : "#ef4444",
              border: `2px solid ${timeLeft > 30 ? "#22c55e" : timeLeft > 10 ? "#eab308" : "#ef4444"}`,
            }}
          >
            {timeLeft}
          </div>
        )}
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="w-full bg-white/10 rounded-full h-1.5">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${((currentIndex + 1) / questions.length) * 100}%`,
              backgroundColor: GOLD,
            }}
          />
        </div>
      </div>

      {/* Per-question timer bar */}
      {timeLimitSeconds === null && (
        <div className="mb-5">
          <TimerBar seconds={timeLeft} maxSeconds={perQuestionSeconds} />
        </div>
      )}

      {/* Question */}
      <div
        className="rounded-2xl p-5 mb-5"
        style={{ backgroundColor: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}
      >
        <div className="flex items-start gap-2 mb-1">
          <span
            className="px-2 py-0.5 rounded-full text-xs font-bold shrink-0"
            style={{
              backgroundColor:
                currentQuestion.difficulty === 1
                  ? "#16a34a30"
                  : currentQuestion.difficulty === 2
                  ? "#eab30830"
                  : "#dc262630",
              color:
                currentQuestion.difficulty === 1
                  ? "#4ade80"
                  : currentQuestion.difficulty === 2
                  ? "#facc15"
                  : "#f87171",
            }}
          >
            {currentQuestion.difficulty === 1
              ? "Standard"
              : currentQuestion.difficulty === 2
              ? "Challenging"
              : "Hard"}
          </span>
          <span className="text-blue-300 text-xs">{currentQuestion.subtopic}</span>
        </div>
        <p className="text-white font-medium text-base leading-relaxed">
          {currentQuestion.text}
        </p>
      </div>

      {/* Choices */}
      <div className="flex flex-col gap-3 mb-5">
        {currentQuestion.choices.map((choice, idx) => (
          <ChoiceButton
            key={idx}
            label={choiceLabels[idx]}
            text={choice}
            onClick={() => choiceState === "selecting" && handleAnswer(idx)}
            state={getChoiceState(idx)}
            disabled={choiceState === "revealed"}
          />
        ))}
      </div>

      {/* Solution hint (drill mode, after wrong answer) */}
      {!testMode && choiceState === "revealed" && selectedIndex !== null && selectedIndex !== currentQuestion.correct_index && (
        <div
          className="rounded-2xl p-4 mb-4"
          style={{ backgroundColor: "rgba(245,197,24,0.12)", border: `1px solid ${GOLD}40` }}
        >
          <p className="text-yellow-300 font-black text-sm mb-2">Here's how to solve this:</p>
          {currentQuestion.solution_steps.map((step, i) => (
            <p key={i} className="text-blue-200 text-sm mb-1">
              {i + 1}. {step}
            </p>
          ))}
          {currentQuestion.bar_model_hint && (
            <div className="mt-2 pt-2 border-t border-white/10">
              <p className="text-blue-300 text-xs">
                <span className="font-bold">Bar model: </span>
                {currentQuestion.bar_model_hint}
              </p>
            </div>
          )}
          <button
            onClick={() => setShowWorkOpen(true)}
            className="mt-3 w-full py-2.5 rounded-xl font-black text-sm transition-all hover:opacity-90 active:scale-[0.98]"
            style={{ backgroundColor: GOLD, color: NAVY }}
          >
            Show Me How 📖
          </button>
        </div>
      )}

      {/* ShowWork modal */}
      {showWorkOpen && (
        <ShowWork
          problem={currentQuestion.text}
          steps={currentQuestion.solution_steps}
          answer={currentQuestion.choices[currentQuestion.correct_index]}
          colorHex={NAVY}
          onClose={() => setShowWorkOpen(false)}
        />
      )}

      {/* "Skip" for drill mode */}
      {!testMode && choiceState === "selecting" && (
        <button
          onClick={() => handleAnswer(null)}
          className="w-full py-2 text-blue-400 text-xs font-bold hover:text-blue-200 transition-colors"
        >
          Skip (mark wrong)
        </button>
      )}

      {onBack && (
        <button
          onClick={onBack}
          className="w-full mt-2 py-2 text-blue-400 text-xs hover:text-blue-200 transition-colors"
        >
          ← Back to Test Prep
        </button>
      )}
    </div>
  );
}
