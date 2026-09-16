"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import type { KidProfile } from "@/lib/kids";
import { getRandomQuestions, type Question } from "@/lib/family-questions";
import { recordGameResult } from "@/lib/family-data";

interface Props {
  profile: KidProfile;
  gameId: string;
}

const QUESTIONS_PER_ROUND = 10;

type Phase = "playing" | "feedback" | "done";

export default function LearnGame({ profile, gameId }: Props) {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [phase, setPhase] = useState<Phase>("playing");
  const [selected, setSelected] = useState<string | null>(null);
  // Scripture reading gate, Next button locked until verse has been shown
  const [nextReady, setNextReady] = useState(false);
  const [scriptureProgress, setScriptureProgress] = useState(0);
  // Anti-cheat reading gate, choices locked until kid has had time to read the question
  const [readingReady, setReadingReady] = useState(false);
  const [readProgress, setReadProgress] = useState(0);
  const nextTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const readTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const readProgressRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [history, setHistory] = useState<Array<{prompt: string, kidAnswer: string, correctAnswer: string, wasCorrect: boolean}>>([]);
  const [showReview, setShowReview] = useState(false);
  const [sessionMins, setSessionMins] = useState(0);
  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    setQuestions(getRandomQuestions(profile.id, gameId, QUESTIONS_PER_ROUND));
    return () => {
      if (nextTimerRef.current) clearTimeout(nextTimerRef.current);
      if (progressTimerRef.current) clearTimeout(progressTimerRef.current);
      if (readTimerRef.current) clearTimeout(readTimerRef.current);
      if (readProgressRef.current) clearTimeout(readProgressRef.current);
    };
  }, [profile.id, gameId]);

  // Reset reading gate every time the question changes
  useEffect(() => {
    if (phase !== "playing") return;
    setReadingReady(false);
    setReadProgress(0);
    // tiny delay so CSS transition starts from 0
    readProgressRef.current = setTimeout(() => setReadProgress(100), 50);
    readTimerRef.current = setTimeout(() => setReadingReady(true), readDelay);
    return () => {
      if (readTimerRef.current) clearTimeout(readTimerRef.current);
      if (readProgressRef.current) clearTimeout(readProgressRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, phase === "playing"]);

  const game = profile.games.find((g) => g.id === gameId);
  const isXLarge = profile.uiSize === "xlarge";
  const isLarge = profile.uiSize === "large" || isXLarge;
  // Reading delay: longer for older kids who have harder questions
  const readDelay = isXLarge ? 1200 : isLarge ? 1500 : 2000;

  function handleAnswer(choice: string) {
    if (phase !== "playing") return;
    const isCorrect = choice === questions[current].answer;
    if (isCorrect) setCorrect((c) => c + 1);
    setHistory((h) => [...h, {
      prompt: questions[current].prompt,
      kidAnswer: choice,
      correctAnswer: questions[current].answer,
      wasCorrect: isCorrect,
    }]);
    setSelected(choice);
    setPhase("feedback");
    // Gate Next button, if there's a scripture, hold for 1.5s so the verse registers
    const hasScripture = !!questions[current].scripture;
    if (hasScripture) {
      setNextReady(false);
      setScriptureProgress(0);
      progressTimerRef.current = setTimeout(() => setScriptureProgress(100), 60);
      nextTimerRef.current = setTimeout(() => setNextReady(true), 1500);
    } else {
      setNextReady(true);
    }
  }

  function handleNext() {
    setNextReady(false);
    setScriptureProgress(0);
    if (current + 1 >= questions.length) {
      recordGameResult(profile.id, gameId, correct, questions.length);
      // Games no longer mint coins. Coins come only from lessons (tiered by
      // length) via the Homeward ledger. We still track minutes for the
      // parent review so Mom can see how long the round took.
      const mins = Math.max(1, Math.round((Date.now() - startTimeRef.current) / 60000));
      setSessionMins(mins);
      setPhase("done");
    } else {
      setCurrent((c) => c + 1);
      setSelected(null);
      setPhase("playing");
    }
  }

  function restart() {
    setQuestions(getRandomQuestions(profile.id, gameId, QUESTIONS_PER_ROUND));
    setCurrent(0);
    setCorrect(0);
    setSelected(null);
    setNextReady(false);
    setScriptureProgress(0);
    setHistory([]);
    setShowReview(false);
    setSessionMins(0);
    startTimeRef.current = Date.now();
    setPhase("playing");
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400 text-xl">Loading…</p>
      </div>
    );
  }

  if (phase === "done") {
    const pct = Math.round((correct / questions.length) * 100);
    return (
      <main
        className="min-h-screen flex flex-col items-center justify-center px-4 py-12"
        style={{ background: `linear-gradient(160deg, ${profile.colorHex}22 0%, #fff 100%)` }}
      >
        <div className={isXLarge ? "text-9xl mb-5" : "text-8xl mb-4"}>
          {pct >= 80 ? "🏆" : pct >= 60 ? "⭐" : "💪"}
        </div>
        <h1 className={`font-black text-gray-800 mb-2 ${isXLarge ? "text-5xl" : isLarge ? "text-4xl" : "text-3xl"}`}>
          {pct >= 80 ? "Amazing!" : pct >= 60 ? "Great Job!" : "Keep Going!"}
        </h1>
        <p className={`text-gray-500 mb-2 ${isXLarge ? "text-3xl" : isLarge ? "text-2xl" : "text-xl"}`}>
          {correct} / {questions.length} correct
        </p>
        <p
          className={`font-black mb-4 ${isXLarge ? "text-5xl" : isLarge ? "text-4xl" : "text-3xl"}`}
          style={{ color: profile.colorHex }}
        >
          {pct}%
        </p>
        <div className="mb-8" />
        <div className="flex gap-4 flex-wrap justify-center">
          <button
            onClick={restart}
            className="px-8 py-4 rounded-3xl font-black text-white shadow-lg hover:opacity-90 transition-all"
            style={{ backgroundColor: profile.colorHex, fontSize: isLarge ? "1.25rem" : "1rem" }}
          >
            Play Again! 🎉
          </button>
          <button
            onClick={() => router.push(`/kids/${profile.id}/hub`)}
            className="px-8 py-4 rounded-3xl font-black text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all"
            style={{ fontSize: isLarge ? "1.25rem" : "1rem" }}
          >
            Hub 🏠
          </button>
        </div>

        {/* Parent review, Briana can see exactly what the kid answered */}
        <div className="mt-8 w-full max-w-md">
          <button
            onClick={() => setShowReview((v) => !v)}
            className="w-full py-3 px-6 rounded-2xl font-bold text-gray-400 bg-gray-50 hover:bg-gray-100 transition-all text-sm border border-gray-200"
          >
            {showReview ? "Hide answers" : "📋 Show Mom the answers"}
          </button>
          {showReview && (
            <div className="mt-3 rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                <p className="font-black text-gray-700 text-sm mb-1">
                  Parent Review, {profile.name}&apos;s answers
                </p>
                <p className="text-xs text-gray-400 mb-2">
                  {correct}/{questions.length} correct · {pct}% · {sessionMins} min · {new Date().toLocaleDateString()}
                </p>
              </div>
              <div className="divide-y divide-gray-100">
                {history.map((h, i) => (
                  <div key={i} className={`px-4 py-3 ${h.wasCorrect ? "bg-green-50" : "bg-red-50"}`}>
                    <p className="text-xs text-gray-400 mb-1 font-medium">Q{i + 1}</p>
                    <p className="text-sm font-medium text-gray-800 mb-2 leading-snug">{h.prompt}</p>
                    <div className="flex items-start gap-2">
                      <span className="text-base leading-none mt-0.5">{h.wasCorrect ? "✅" : "❌"}</span>
                      <div>
                        <p className="text-sm font-bold" style={{ color: h.wasCorrect ? "#16a34a" : "#dc2626" }}>
                          {profile.name} said: {h.kidAnswer}
                        </p>
                        {!h.wasCorrect && (
                          <p className="text-xs text-gray-500 mt-0.5">Correct answer: {h.correctAnswer}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    );
  }

  const q = questions[current];

  return (
    <main
      className="min-h-screen px-4 py-6 max-w-lg md:max-w-2xl mx-auto flex flex-col"
      style={{ background: `linear-gradient(160deg, ${profile.colorHex}10 0%, #fff 100%)` }}
    >
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => router.push(`/kids/${profile.id}/hub`)}
          className="text-gray-400 hover:text-gray-600 text-sm font-medium"
        >
          ← Back
        </button>
        <span className="text-sm font-bold text-gray-500">
          {game?.emoji} {game?.label}
        </span>
        <span className="text-sm font-bold text-gray-500">
          {current + 1}/{questions.length}
        </span>
      </div>

      <div className="bg-gray-100 rounded-full h-3 mb-6 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${(current / questions.length) * 100}%`, backgroundColor: profile.colorHex }}
        />
      </div>

      <div className="text-right mb-3">
        <span
          className="text-sm font-bold px-3 py-1 rounded-full"
          style={{ backgroundColor: profile.colorHex + "22", color: profile.colorHex }}
        >
          ✅ {correct} correct
        </span>
      </div>

      <div
        className="bg-white rounded-3xl shadow-md p-6 mb-6 text-center font-bold text-gray-800 leading-snug"
        style={{ fontSize: isXLarge ? "1.75rem" : isLarge ? "1.4rem" : "1.2rem" }}
      >
        {q.prompt}
      </div>

      {/* Reading gate progress bar, fills before choices unlock */}
      {phase === "playing" && !readingReady && (
        <div className="mb-3">
          <div
            className="text-center text-xs font-bold mb-1"
            style={{ color: profile.colorHex, opacity: 0.7 }}
          >
            Read the question… 📖
          </div>
          <div className="bg-gray-100 rounded-full h-2 overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{
                width: `${readProgress}%`,
                backgroundColor: profile.colorHex,
                transition: `width ${readDelay - 100}ms linear`,
              }}
            />
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {q.choices.map((choice) => {
          const locked = phase === "playing" && !readingReady;
          let style: React.CSSProperties = locked
            ? { border: "2px solid #e5e7eb", backgroundColor: "#f9fafb", color: "#d1d5db" }
            : { border: "2px solid #e5e7eb", backgroundColor: "#ffffff", color: "#1f2937" };
          if (phase === "feedback") {
            if (choice === q.answer) {
              style = { border: "2px solid #16a34a", backgroundColor: "#dcfce7", color: "#15803d" };
            } else if (choice === selected) {
              style = { border: "2px solid #dc2626", backgroundColor: "#fee2e2", color: "#dc2626" };
            } else {
              style = { border: "2px solid #e5e7eb", backgroundColor: "#f9fafb", color: "#9ca3af" };
            }
          }
          return (
            <button
              key={choice}
              onClick={() => handleAnswer(choice)}
              disabled={phase === "feedback" || locked}
              className="rounded-2xl font-bold shadow-sm transition-all duration-150 text-left px-5"
              style={{
                ...style,
                padding: isXLarge ? "1.5rem" : isLarge ? "1.25rem" : "1rem 1.25rem",
                fontSize: isXLarge ? "1.4rem" : isLarge ? "1.2rem" : "1rem",
                cursor: (phase === "feedback" || locked) ? "default" : "pointer",
                opacity: locked ? 0.5 : 1,
              }}
            >
              {phase === "feedback" && choice === q.answer && "✅ "}
              {phase === "feedback" && choice === selected && choice !== q.answer && "❌ "}
              {choice}
            </button>
          );
        })}
      </div>

      {phase === "feedback" && (
        <div className="mt-5">
          {q.explanation && (
            <div
              className="bg-blue-50 text-blue-700 rounded-2xl p-4 mb-4 text-center"
              style={{ fontSize: isLarge ? "1rem" : "0.875rem" }}
            >
              💡 {q.explanation}
            </div>
          )}
          {q.scripture && (
            <div
              className="rounded-2xl p-4 mb-4 text-center"
              style={{
                background: "#FFFBEB",
                border: "1.5px solid #F59E0B",
                fontSize: isXLarge ? "0.95rem" : isLarge ? "0.875rem" : "0.8rem",
              }}
            >
              <span style={{ fontSize: isLarge ? "1.1rem" : "1rem" }}>📖</span>{" "}
              <em style={{ color: "#92400E" }}>{q.scripture}</em>
              {/* Progress bar, fills while verse is meant to be read */}
              <div style={{ marginTop: 10, height: 3, background: "#FEF3C740", borderRadius: 999 }}>
                <div
                  style={{
                    height: "100%",
                    background: "#F59E0B",
                    borderRadius: 999,
                    width: `${scriptureProgress}%`,
                    transition: nextReady ? "none" : "width 1.4s linear",
                  }}
                />
              </div>
            </div>
          )}
          {nextReady ? (
            <button
              onClick={handleNext}
              className="w-full py-4 rounded-3xl font-black text-white shadow-lg hover:opacity-90 transition-all"
              style={{ backgroundColor: profile.colorHex, fontSize: isLarge ? "1.25rem" : "1rem" }}
            >
              {current + 1 >= questions.length ? "See Results! 🏆" : "Next →"}
            </button>
          ) : (
            /* Placeholder keeps layout stable while timer runs */
            <div
              className="w-full py-4 rounded-3xl text-center font-black"
              style={{
                background: "#f3f4f6",
                color: "#d1d5db",
                fontSize: isLarge ? "1.25rem" : "1rem",
                cursor: "default",
              }}
            >
              📖 reading…
            </div>
          )}
        </div>
      )}
    </main>
  );
}
