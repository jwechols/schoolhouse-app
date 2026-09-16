"use client";

import { useState, useEffect, useCallback } from "react";
import { samplePracticeTest, TOPICS, type SingaporeQuestion, type TopicKey } from "@/lib/singapore-math";

// ─── Types ─────────────────────────────────────────────────────────────────────

interface TestAnswer {
  question: SingaporeQuestion;
  chosen_index: number | null;
  correct: boolean;
  time_taken: number;
  flagged: boolean;
}

interface TestResults {
  score: number;
  total: number;
  by_topic: Record<string, { correct: number; total: number }>;
  avg_time: number;
  slow_questions: number[]; // indices of questions that took > 60s
  completed_at: string;
  answers: TestAnswer[];
}

const NAVY = "#1b3a6b";
const GOLD = "#f5c518";
const TEST_MINUTES = 45;
const TEST_QUESTIONS = 30;

// ─── localStorage ──────────────────────────────────────────────────────────────

function saveTestHistory(results: TestResults) {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem("truma-test-history");
    const history: TestResults[] = raw ? (JSON.parse(raw) as TestResults[]) : [];
    history.unshift(results);
    localStorage.setItem("truma-test-history", JSON.stringify(history.slice(0, 20)));
  } catch {
    // ignore
  }
}

// ─── Results screen ────────────────────────────────────────────────────────────

function TestResultsScreen({
  results,
  onRetry,
  onBack,
}: {
  results: TestResults;
  onRetry: () => void;
  onBack?: () => void;
}) {
  const scorePct = Math.round((results.score / results.total) * 100);
  const readiness = (() => {
    if (scorePct >= 85) return { label: "Very Likely to Pass", color: "#22c55e", emoji: "🏆" };
    if (scorePct >= 70) return { label: "On Track", color: "#eab308", emoji: "📈" };
    if (scorePct >= 55) return { label: "Needs More Work", color: "#f97316", emoji: "📚" };
    return { label: "Focus Required", color: "#ef4444", emoji: "🚨" };
  })();

  const topicKeys = Object.keys(TOPICS) as TopicKey[];

  return (
    <div
      className="min-h-screen px-4 py-6 max-w-lg md:max-w-2xl mx-auto"
      style={{ background: "linear-gradient(160deg, #1b3a6b 0%, #0f2547 100%)" }}
    >
      {/* Score hero */}
      <div className="text-center mb-6">
        <div className="text-5xl mb-2">{readiness.emoji}</div>
        <h2 className="text-white font-black text-4xl">{scorePct}%</h2>
        <p className="text-blue-200 text-sm mt-1">
          {results.score} / {results.total} correct
        </p>
        <div
          className="inline-block mt-3 px-4 py-2 rounded-full font-black text-sm"
          style={{ backgroundColor: readiness.color + "25", color: readiness.color }}
        >
          MCA Readiness: {readiness.label}
        </div>
      </div>

      {/* Time stat */}
      <div
        className="rounded-2xl p-4 mb-5 flex justify-around text-center"
        style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
      >
        <div>
          <div className="text-white font-black text-xl">{results.avg_time}s</div>
          <div className="text-blue-300 text-xs">Avg / question</div>
        </div>
        <div>
          <div style={{ color: "#ef4444" }} className="font-black text-xl">
            {results.slow_questions.length}
          </div>
          <div className="text-blue-300 text-xs">Slow questions (&gt;60s)</div>
        </div>
      </div>

      {/* Topic heatmap */}
      <h3 className="text-blue-200 font-bold text-xs uppercase tracking-wider mb-3">
        Score by Topic
      </h3>
      <div className="flex flex-col gap-2 mb-5">
        {topicKeys.map((tk) => {
          const data = results.by_topic[tk] ?? { correct: 0, total: 0 };
          const pct = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;
          const bg = pct >= 80 ? "#16a34a" : pct >= 55 ? "#eab308" : "#dc2626";
          return (
            <div key={tk} className="flex items-center gap-3">
              <span className="text-white text-xs w-32 shrink-0">{TOPICS[tk].name}</span>
              <div className="flex-1 bg-white/10 rounded-full h-3 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${pct}%`, backgroundColor: bg }}
                />
              </div>
              <span className="text-white text-xs w-12 text-right font-bold">
                {data.correct}/{data.total}
              </span>
            </div>
          );
        })}
      </div>

      {/* Full answer key */}
      <h3 className="text-blue-200 font-bold text-xs uppercase tracking-wider mb-3">
        Answer Key
      </h3>
      <div className="flex flex-col gap-2 mb-6">
        {results.answers.map((a, i) => (
          <div
            key={i}
            className="rounded-xl p-3"
            style={{
              backgroundColor: a.correct ? "rgba(22,163,74,0.12)" : "rgba(220,38,38,0.12)",
            }}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm">{a.correct ? "✓" : "✗"}</span>
              <span className="text-blue-300 text-xs">Q{i + 1}</span>
              <span className="text-blue-400 text-xs">{a.question.subtopic}</span>
              <span className="text-blue-400 text-xs ml-auto">{a.time_taken}s</span>
            </div>
            <p className="text-white text-xs leading-snug line-clamp-2">{a.question.text}</p>
            {!a.correct && (
              <div className="mt-2">
                <p className="text-green-400 text-xs font-bold">
                  Correct: {a.question.choices[a.question.correct_index]}
                </p>
                <div className="mt-1">
                  {a.question.solution_steps.slice(0, 3).map((step, si) => (
                    <p key={si} className="text-blue-300 text-xs">
                      {si + 1}. {step}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <button
          onClick={onRetry}
          className="flex-1 py-4 rounded-2xl font-black text-navy text-base shadow-lg"
          style={{ backgroundColor: GOLD }}
        >
          Retake Test
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

interface PracticeTestProps {
  onBack?: () => void;
}

export default function PracticeTest({ onBack }: PracticeTestProps) {
  const [phase, setPhase] = useState<"intro" | "test" | "review" | "results">("intro");
  const [questions, setQuestions] = useState<SingaporeQuestion[]>([]);
  const [answers, setAnswers] = useState<TestAnswer[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TEST_MINUTES * 60);
  const [questionStartTimes, setQuestionStartTimes] = useState<number[]>([]);
  const [testResults, setTestResults] = useState<TestResults | null>(null);
  const [retryKey, setRetryKey] = useState(0);

  function initTest() {
    const qs = samplePracticeTest(TEST_QUESTIONS);
    setQuestions(qs);
    const blank: TestAnswer[] = qs.map((q) => ({
      question: q,
      chosen_index: null,
      correct: false,
      time_taken: 0,
      flagged: false,
    }));
    setAnswers(blank);
    setCurrentIndex(0);
    setTimeLeft(TEST_MINUTES * 60);
    setQuestionStartTimes(new Array(qs.length).fill(Date.now()));
    setTestResults(null);
    setPhase("test");
  }

  // Countdown
  useEffect(() => {
    if (phase !== "test") return;
    if (timeLeft <= 0) {
      finishTest(answers);
      return;
    }
    const id = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(id);
  });

  const finishTest = useCallback(
    (finalAnswers: TestAnswer[]) => {
      const by_topic: Record<string, { correct: number; total: number }> = {};
      let totalTime = 0;
      const slowQs: number[] = [];

      finalAnswers.forEach((a, i) => {
        const tk = a.question.topic;
        if (!by_topic[tk]) by_topic[tk] = { correct: 0, total: 0 };
        by_topic[tk].total++;
        if (a.correct) by_topic[tk].correct++;
        totalTime += a.time_taken;
        if (a.time_taken > 60) slowQs.push(i);
      });

      const results: TestResults = {
        score: finalAnswers.filter((a) => a.correct).length,
        total: finalAnswers.length,
        by_topic,
        avg_time: finalAnswers.length > 0 ? Math.round(totalTime / finalAnswers.length) : 0,
        slow_questions: slowQs,
        completed_at: new Date().toISOString(),
        answers: finalAnswers,
      };
      saveTestHistory(results);
      // Games/tests no longer mint coins. Coins are earned only through
      // lessons (tiered by length) and tracked in the Homeward ledger.
      setTestResults(results);
      setPhase("results");
    },
    []
  );

  function handleAnswer(chosenIndex: number) {
    const now = Date.now();
    const startTime = questionStartTimes[currentIndex] ?? now;
    const timeTaken = Math.round((now - startTime) / 1000);
    const q = questions[currentIndex];

    const updated = [...answers];
    updated[currentIndex] = {
      ...updated[currentIndex],
      chosen_index: chosenIndex,
      correct: chosenIndex === q.correct_index,
      time_taken: timeTaken,
    };
    setAnswers(updated);

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((i) => i + 1);
      const newTimes = [...questionStartTimes];
      newTimes[currentIndex + 1] = Date.now();
      setQuestionStartTimes(newTimes);
    } else {
      finishTest(updated);
    }
  }

  function toggleFlag() {
    const updated = [...answers];
    updated[currentIndex] = {
      ...updated[currentIndex],
      flagged: !updated[currentIndex].flagged,
    };
    setAnswers(updated);
  }

  function goToQuestion(idx: number) {
    setCurrentIndex(idx);
    const newTimes = [...questionStartTimes];
    if (!newTimes[idx]) newTimes[idx] = Date.now();
    setQuestionStartTimes(newTimes);
  }

  if (phase === "results" && testResults) {
    return (
      <TestResultsScreen
        results={testResults}
        onRetry={() => {
          setRetryKey((k) => k + 1);
          initTest();
        }}
        onBack={onBack}
      />
    );
  }

  if (phase === "intro") {
    return (
      <div
        className="min-h-screen px-4 py-10 max-w-lg md:max-w-2xl mx-auto flex flex-col items-center justify-center"
        style={{ background: "linear-gradient(160deg, #1b3a6b 0%, #0f2547 100%)" }}
      >
        <div className="text-6xl mb-4">📝</div>
        <h1 className="text-white font-black text-3xl text-center mb-3">MCA Practice Test</h1>
        <p className="text-blue-200 text-center text-sm mb-6 leading-relaxed max-w-sm">
          This is a full simulation of the MCA placement test. You will have{" "}
          <span className="font-black text-white">45 minutes</span> to answer{" "}
          <span className="font-black text-white">30 questions</span> across all Singapore Math
          topics. No hints. No help. Just like the real thing.
        </p>

        <div
          className="w-full rounded-2xl p-4 mb-6"
          style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
        >
          <p className="text-blue-200 text-sm font-bold mb-2">Test Conditions:</p>
          <ul className="text-blue-300 text-sm space-y-1">
            <li>• 30 questions · 45 minute total timer</li>
            <li>• No hints or answer reveals during the test</li>
            <li>• You can flag questions to review later</li>
            <li>• Full solutions shown after you submit</li>
          </ul>
        </div>

        <button
          onClick={initTest}
          className="w-full py-5 rounded-2xl font-black text-navy text-xl shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
          style={{ backgroundColor: GOLD }}
        >
          Start Test
        </button>

        {onBack && (
          <button
            onClick={onBack}
            className="mt-4 text-blue-400 text-sm hover:text-blue-200 transition-colors"
          >
            ← Back
          </button>
        )}
      </div>
    );
  }

  if (phase === "review") {
    const flagged = answers.filter((a) => a.flagged);
    return (
      <div
        className="min-h-screen px-4 py-6 max-w-lg md:max-w-2xl mx-auto"
        style={{ background: "linear-gradient(160deg, #1b3a6b 0%, #0f2547 100%)" }}
      >
        <h2 className="text-white font-black text-2xl mb-4">Review Flagged Questions</h2>
        {flagged.length === 0 ? (
          <p className="text-blue-200 text-sm mb-6">No flagged questions.</p>
        ) : (
          <div className="flex flex-col gap-3 mb-6">
            {answers.map((a, i) =>
              a.flagged ? (
                <button
                  key={i}
                  onClick={() => {
                    goToQuestion(i);
                    setPhase("test");
                  }}
                  className="text-left rounded-xl p-3"
                  style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
                >
                  <p className="text-yellow-300 text-xs font-bold mb-1">Q{i + 1}, flagged</p>
                  <p className="text-white text-sm line-clamp-2">{a.question.text}</p>
                </button>
              ) : null
            )}
          </div>
        )}
        <button
          onClick={() => finishTest(answers)}
          className="w-full py-4 rounded-2xl font-black text-navy text-lg shadow-lg"
          style={{ backgroundColor: GOLD }}
        >
          Submit Test
        </button>
        <button
          onClick={() => setPhase("test")}
          className="w-full mt-3 py-3 rounded-2xl text-blue-300 text-sm font-bold"
          style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
        >
          Back to Test
        </button>
      </div>
    );
  }

  // Test phase
  const currentQ = questions[currentIndex];
  if (!currentQ) return null;

  const minutes = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const timeWarning = timeLeft < 300;
  const currentAnswer = answers[currentIndex];
  const choiceLabels = ["A", "B", "C", "D"];
  const answeredCount = answers.filter((a) => a.chosen_index !== null).length;

  return (
    <div
      className="min-h-screen px-4 py-4 max-w-lg md:max-w-2xl mx-auto"
      style={{ background: "linear-gradient(160deg, #1b3a6b 0%, #0f2547 100%)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-white font-black text-sm">
            Q {currentIndex + 1} / {questions.length}
          </p>
          <p className="text-blue-300 text-xs">
            {answeredCount} answered · {answers.filter((a) => a.flagged).length} flagged
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div
            className="px-4 py-2 rounded-xl font-black text-base"
            style={{
              backgroundColor: timeWarning ? "#dc2626" : "rgba(255,255,255,0.12)",
              color: "white",
            }}
          >
            {minutes}:{String(secs).padStart(2, "0")}
          </div>
        </div>
      </div>

      {/* Progress dots */}
      <div className="flex flex-wrap gap-1 mb-4">
        {answers.map((a, i) => (
          <button
            key={i}
            onClick={() => goToQuestion(i)}
            className="w-6 h-6 rounded-full text-xs font-bold transition-all hover:scale-110"
            style={{
              backgroundColor:
                i === currentIndex
                  ? GOLD
                  : a.flagged
                  ? "#f97316"
                  : a.chosen_index !== null
                  ? "#16a34a"
                  : "rgba(255,255,255,0.15)",
              color: i === currentIndex ? NAVY : "white",
            }}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* Question */}
      <div
        className="rounded-2xl p-5 mb-4"
        style={{ backgroundColor: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}
      >
        <div className="flex items-center gap-2 mb-2">
          <span className="text-blue-400 text-xs">{currentQ.subtopic}</span>
        </div>
        <p className="text-white font-medium text-base leading-relaxed">{currentQ.text}</p>
      </div>

      {/* Choices */}
      <div className="flex flex-col gap-3 mb-4">
        {currentQ.choices.map((choice, idx) => {
          const isSelected = currentAnswer.chosen_index === idx;
          return (
            <button
              key={idx}
              onClick={() => handleAnswer(idx)}
              className="w-full rounded-2xl p-4 text-left flex items-start gap-3 transition-all hover:scale-[1.01] active:scale-[0.99]"
              style={{
                backgroundColor: isSelected ? "#1d4ed8" : "rgba(255,255,255,0.08)",
                border: isSelected
                  ? "2px solid #3b82f6"
                  : "1px solid rgba(255,255,255,0.15)",
              }}
            >
              <span
                className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-black"
                style={{ backgroundColor: isSelected ? "#3b82f6" : GOLD, color: NAVY }}
              >
                {choiceLabels[idx]}
              </span>
              <span className="text-white text-sm font-medium leading-snug">{choice}</span>
            </button>
          );
        })}
      </div>

      {/* Flag + nav */}
      <div className="flex gap-3">
        <button
          onClick={toggleFlag}
          className="py-3 px-4 rounded-xl text-sm font-bold transition-all"
          style={{
            backgroundColor: currentAnswer.flagged ? "#f97316" : "rgba(255,255,255,0.08)",
            color: currentAnswer.flagged ? "white" : "#93c5fd",
          }}
        >
          {currentAnswer.flagged ? "🚩 Flagged" : "Flag"}
        </button>

        {currentIndex > 0 && (
          <button
            onClick={() => goToQuestion(currentIndex - 1)}
            className="py-3 px-4 rounded-xl text-blue-300 text-sm font-bold"
            style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
          >
            ← Prev
          </button>
        )}

        {currentIndex < questions.length - 1 ? (
          <button
            onClick={() => goToQuestion(currentIndex + 1)}
            className="flex-1 py-3 rounded-xl font-bold text-sm text-white"
            style={{ backgroundColor: "rgba(255,255,255,0.10)" }}
          >
            Next →
          </button>
        ) : (
          <button
            onClick={() => setPhase("review")}
            className="flex-1 py-3 rounded-xl font-black text-navy text-sm shadow-lg"
            style={{ backgroundColor: GOLD }}
          >
            Review & Submit
          </button>
        )}
      </div>
    </div>
  );
}
