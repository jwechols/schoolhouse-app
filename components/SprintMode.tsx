"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  loadStats,
  saveStats,
  updateStreak,
  recordSubjectPlayed,
  checkAchievements,
  postSession,
  generateDrillQuestion,
  bumpDailySession,
  todayISO,
  ACHIEVEMENTS,
  type DrillQuestion,
  type UnlockedAchievement,
} from "@/lib/data";

const SPRINT_TOTAL = 40;
const SPRINT_SECONDS = 180;

type Screen = "idle" | "playing" | "done";

function starsEarned(pct: number) {
  if (pct >= 90) return 4;
  if (pct >= 80) return 3;
  if (pct >= 60) return 2;
  return 1;
}

function buildQuestions(): DrillQuestion[] {
  return Array.from({ length: SPRINT_TOTAL }, () => generateDrillQuestion("mix"));
}

export default function SprintMode() {
  const [screen, setScreen] = useState<Screen>("idle");
  const [questions, setQuestions] = useState<DrillQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [inputVal, setInputVal] = useState("");
  const [flash, setFlash] = useState<"correct" | "wrong" | null>(null);
  const [timeLeft, setTimeLeft] = useState(SPRINT_SECONDS);
  const [newlyUnlocked, setNewlyUnlocked] = useState<UnlockedAchievement[]>([]);

  const correctRef = useRef(0);
  const currentIdxRef = useRef(0);
  const timeLeftRef = useRef(SPRINT_SECONDS);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [finalCorrect, setFinalCorrect] = useState(0);
  const [finalTimeLeft, setFinalTimeLeft] = useState(0);
  const [bestScore, setBestScore] = useState(0);

  useEffect(() => {
    const s = loadStats();
    setBestScore(s.sprintHighScore ?? 0);
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
  }, []);

  const finishSprint = useCallback((correct: number, timeRemaining: number) => {
    stopTimer();
    setFinalCorrect(correct);
    setFinalTimeLeft(timeRemaining);

    const pct = Math.round((correct / SPRINT_TOTAL) * 100);
    const stars = starsEarned(pct);
    const xpEarned = correct * 8;

    let s = loadStats();
    s = updateStreak(s);
    s = recordSubjectPlayed(s, "sprint");
    s = recordSubjectPlayed(s, "math");
    s.xp += xpEarned;
    s.stars += stars;
    if ((s.topicBest["sprint"] ?? 0) < pct) s.topicBest["sprint"] = pct;
    if ((s.topicBest["math"] ?? 0) < pct) s.topicBest["math"] = pct;
    if (correct > (s.sprintHighScore ?? 0)) s.sprintHighScore = correct;

    const newly = checkAchievements(s);
    s.achievementsUnlocked = [...s.achievementsUnlocked, ...newly];
    saveStats(s);
    setNewlyUnlocked(newly);
    bumpDailySession();

    postSession({
      session_date: todayISO(),
      subject: "math",
      mode: "sprint",
      score: correct,
      total: SPRINT_TOTAL,
      xp_earned: xpEarned,
      stars_earned: stars,
      topics_covered: ["sprint"],
    });

    setScreen("done");
  }, [stopTimer]);

  useEffect(() => {
    if (screen !== "playing") return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        const next = t - 1;
        timeLeftRef.current = next;
        if (next <= 0) {
          finishSprint(correctRef.current, 0);
          return 0;
        }
        return next;
      });
    }, 1000);
    return stopTimer;
  }, [screen, finishSprint, stopTimer]);

  useEffect(() => {
    if (screen === "playing") inputRef.current?.focus();
  }, [currentIdx, screen]);

  function startSprint() {
    const qs = buildQuestions();
    setQuestions(qs);
    setCurrentIdx(0);
    currentIdxRef.current = 0;
    correctRef.current = 0;
    timeLeftRef.current = SPRINT_SECONDS;
    setInputVal("");
    setTimeLeft(SPRINT_SECONDS);
    setFlash(null);
    setNewlyUnlocked([]);
    setScreen("playing");
  }

  function advance() {
    const next = currentIdxRef.current + 1;
    currentIdxRef.current = next;
    setInputVal("");
    if (next >= SPRINT_TOTAL) {
      finishSprint(correctRef.current, timeLeftRef.current);
    } else {
      setCurrentIdx(next);
    }
  }

  function handleSubmit() {
    const q = questions[currentIdxRef.current];
    if (!q || flash !== null) return;
    const val = parseInt(inputVal.trim(), 10);
    if (isNaN(val)) return;

    if (val === q.answer) {
      correctRef.current += 1;
      setFlash("correct");
      setTimeout(() => { setFlash(null); advance(); }, 250);
    } else {
      setFlash("wrong");
      setTimeout(() => { setFlash(null); advance(); }, 700);
    }
  }

  function handleKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") handleSubmit();
  }

  // ── IDLE ─────────────────────────────────────────────────────────────────────
  if (screen === "idle") {
    return (
      <div className="min-h-screen bg-parchment text-navy px-4 py-8 max-w-md mx-auto">
        <Link href="/hub" className="text-sm text-stone hover:text-navy mb-6 block">
          ← Back to Hub
        </Link>
        <h1 className="text-3xl font-bold text-navy mb-2" style={{ fontFamily: "Georgia, serif" }}>
          Math Sprint
        </h1>
        <p className="text-stone text-sm mb-6">
          40 questions · 3 minutes · Type your answers!
        </p>
        <div className="bg-bone rounded-sm p-5 mb-6 space-y-2">
          <p className="text-sm font-semibold text-navy">How it works:</p>
          <p className="text-sm text-stone">• Type the answer and press <strong>Enter</strong> to advance</p>
          <p className="text-sm text-stone">• Correct answers advance instantly</p>
          <p className="text-sm text-stone">• Wrong answers pause briefly, then move on</p>
          <p className="text-sm text-stone">• Mixed +, −, ×, ÷ operations</p>
          <p className="text-sm text-navy font-semibold mt-3">8 XP per correct answer, up to 320 XP!</p>
        </div>
        {bestScore > 0 && (
          <div className="bg-bone rounded-sm p-3 mb-4 text-center">
            <p className="text-xs text-stone">Personal Best</p>
            <p className="text-2xl font-bold text-gold">{bestScore} / 40</p>
            <p className="text-xs text-stone">{Math.round((bestScore / 40) * 100)}% correct</p>
          </div>
        )}
        <button
          onClick={startSprint}
          className="w-full bg-navy text-white font-bold py-3 rounded-sm hover:bg-navy-dark transition-colors text-lg"
        >
          Start Sprint →
        </button>
      </div>
    );
  }

  // ── PLAYING ──────────────────────────────────────────────────────────────────
  if (screen === "playing") {
    const q = questions[currentIdx];
    const timerPct = (timeLeft / SPRINT_SECONDS) * 100;
    const timerLow = timeLeft <= 30;
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    const timeStr = `${mins}:${secs.toString().padStart(2, "0")}`;
    const progressPct = Math.round((currentIdx / SPRINT_TOTAL) * 100);

    return (
      <div className="min-h-screen bg-parchment text-navy flex flex-col max-w-md mx-auto px-4 py-4">
        {/* Timer bar */}
        <div className="h-2 bg-bone rounded-full overflow-hidden mb-2">
          <div
            className={`h-full rounded-full transition-all duration-1000 ${timerLow ? "bg-red-500" : "bg-navy"}`}
            style={{ width: `${timerPct}%` }}
          />
        </div>
        {/* Question progress bar */}
        <div className="h-1 bg-bone rounded-full overflow-hidden mb-4">
          <div
            className="h-full rounded-full bg-teal transition-all duration-200"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="bg-bone rounded-sm px-3 py-2 text-center">
            <span className="text-xs text-stone block">Q</span>
            <span className="text-lg font-bold text-navy">{currentIdx + 1}/{SPRINT_TOTAL}</span>
          </div>
          <div className={`bg-bone rounded-sm px-3 py-2 text-center ${timerLow ? "border border-red-400" : ""}`}>
            <span className="text-xs text-stone block">Time</span>
            <span className={`text-xl font-bold ${timerLow ? "text-red-500" : "text-navy"}`}>{timeStr}</span>
          </div>
          <div className="bg-bone rounded-sm px-3 py-2 text-center">
            <span className="text-xs text-stone block">Correct</span>
            <span className="text-lg font-bold text-teal">{correctRef.current}</span>
          </div>
        </div>

        {/* Question */}
        <div className="flex-1 flex flex-col items-center justify-center gap-8">
          <div
            className={`w-full rounded-sm px-6 py-6 text-center transition-colors ${
              flash === "correct" ? "bg-teal/20" : flash === "wrong" ? "bg-red-100" : "bg-bone"
            }`}
          >
            <p
              className="text-5xl font-bold text-navy select-none"
              style={{ fontFamily: "Georgia, serif" }}
            >
              {q?.display} = ?
            </p>
          </div>

          <div className="w-full">
            <input
              ref={inputRef}
              type="number"
              inputMode="numeric"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={handleKey}
              placeholder="?"
              className={`w-full text-4xl font-bold text-center py-4 rounded-sm border-2 outline-none transition-colors ${
                flash === "correct"
                  ? "border-teal bg-teal/10 text-teal"
                  : flash === "wrong"
                  ? "border-red-400 bg-red-50 text-red-600"
                  : "border-navy/30 bg-white focus:border-navy"
              }`}
            />
            <button
              onClick={handleSubmit}
              className="w-full mt-3 bg-navy text-white font-bold py-3 rounded-sm hover:bg-navy-dark transition-colors"
            >
              Submit ↵
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── DONE ─────────────────────────────────────────────────────────────────────
  const pct = Math.round((finalCorrect / SPRINT_TOTAL) * 100);
  const stars = starsEarned(pct);
  const xpEarned = finalCorrect * 8;

  return (
    <div className="min-h-screen bg-parchment text-navy px-4 py-8 max-w-md mx-auto">
      <h1 className="text-3xl font-bold text-navy mb-1" style={{ fontFamily: "Georgia, serif" }}>
        Sprint Complete!
      </h1>
      <p className="text-stone text-sm mb-6">
        {finalTimeLeft > 0
          ? `Finished with ${Math.floor(finalTimeLeft / 60)}:${(finalTimeLeft % 60).toString().padStart(2, "00")} to spare!`
          : "Time's up, great effort!"}
      </p>

      <div className="bg-bone rounded-sm p-5 mb-4">
        <div className="flex justify-between mb-3">
          <span className="text-stone text-sm">Correct</span>
          <span className="font-bold text-navy">{finalCorrect} / {SPRINT_TOTAL}</span>
        </div>
        <div className="flex justify-between mb-3">
          <span className="text-stone text-sm">Score</span>
          <span className="font-bold text-navy">{pct}%</span>
        </div>
        <div className="flex justify-between mb-3">
          <span className="text-stone text-sm">Stars earned</span>
          <span className="text-gold font-bold">{"★".repeat(stars)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-stone text-sm">XP earned</span>
          <span className="font-bold text-teal">+{xpEarned} XP</span>
        </div>
      </div>

      {newlyUnlocked.length > 0 && (
        <div className="bg-bone rounded-sm p-4 mb-4">
          <p className="font-bold text-navy mb-2">Achievements unlocked!</p>
          {newlyUnlocked.map((a) => {
            const def = ACHIEVEMENTS.find((d) => d.id === a.id);
            return (
              <p key={a.id} className="text-sm text-teal">
                ★ {def ? def.label : a.id.replace(/_/g, " ")}
              </p>
            );
          })}
        </div>
      )}

      <div className="flex gap-3 mt-4">
        <button
          onClick={startSprint}
          className="flex-1 bg-navy text-white font-bold py-3 rounded-sm hover:bg-navy-dark transition-colors"
        >
          Sprint Again
        </button>
        <Link
          href="/hub"
          className="flex-1 text-center bg-bone text-navy font-bold py-3 rounded-sm border border-navy hover:bg-navy hover:text-white transition-colors"
        >
          Back to Hub
        </Link>
      </div>
    </div>
  );
}
