"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  loadStats,
  saveStats,
  updateStreak,
  recordSubjectPlayed,
  getLevel,
  checkAchievements,
  postSession,
  generateDrillQuestion,
  bumpDailySession,
  todayISO,
  ACHIEVEMENTS,
  type DrillOp,
  type DrillQuestion,
  type UnlockedAchievement,
} from "@/lib/data";

const OPS: { key: DrillOp; label: string }[] = [
  { key: "add", label: "＋ Add" },
  { key: "sub", label: "− Sub" },
  { key: "mul", label: "× Mul" },
  { key: "div", label: "÷ Div" },
  { key: "mix", label: "★ Mix" },
];

const DRILL_SECONDS = 60;

type Screen = "idle" | "playing" | "done";

function starsEarned(accuracy: number) {
  if (accuracy >= 90) return 4;
  if (accuracy >= 80) return 3;
  if (accuracy >= 60) return 2;
  return 1;
}

export default function DrillGame() {
  const [screen, setScreen] = useState<Screen>("idle");
  const [op, setOp] = useState<DrillOp>("mix");
  const [question, setQuestion] = useState<DrillQuestion>(() =>
    generateDrillQuestion("mix")
  );
  const [selected, setSelected] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(DRILL_SECONDS);
  const [newlyUnlocked, setNewlyUnlocked] = useState<UnlockedAchievement[]>([]);
  const [leveledUp, setLeveledUp] = useState(false);

  // Refs to avoid stale closures inside timer callback
  const correctRef = useRef(0);
  const totalRef = useRef(0);
  const opRef = useRef<DrillOp>("mix");
  const comboRef = useRef(0);
  const maxComboRef = useRef(0);
  const xpEarnedRef = useRef(0);

  const [combo, setCombo] = useState(0);

  // Done-screen results read from refs after game ends
  const [finalCorrect, setFinalCorrect] = useState(0);
  const [finalTotal, setFinalTotal] = useState(0);
  const [finalStars, setFinalStars] = useState(0);
  const [finalXP, setFinalXP] = useState(0);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const advanceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const finishGame = useCallback(() => {
    stopTimer();
    if (advanceRef.current) clearTimeout(advanceRef.current);

    const correct = correctRef.current;
    const total = totalRef.current;
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
    const stars = starsEarned(accuracy);
    const xpEarned = xpEarnedRef.current;

    setFinalCorrect(correct);
    setFinalTotal(total);
    setFinalStars(stars);
    setFinalXP(xpEarned);

    let s = loadStats();
    const prevLevel = getLevel(s.xp).level;
    s = updateStreak(s);
    s = recordSubjectPlayed(s, "math");
    s.xp += xpEarned;
    s.stars += stars;
    const opKey = opRef.current === "mix" ? "math" : opRef.current;
    if ((s.topicBest[opKey] ?? 0) < accuracy) s.topicBest[opKey] = accuracy;
    if (total > s.drillHighScore) s.drillHighScore = total;
    if (maxComboRef.current > (s.comboHighScore ?? 0)) s.comboHighScore = maxComboRef.current;
    if ((s.topicBest["math"] ?? 0) < accuracy) s.topicBest["math"] = accuracy;

    const newLevel = getLevel(s.xp).level;
    if (newLevel > prevLevel) setLeveledUp(true);

    const newly = checkAchievements(s);
    s.achievementsUnlocked = [...s.achievementsUnlocked, ...newly];
    saveStats(s);
    setNewlyUnlocked(newly);
    bumpDailySession();

    postSession({
      session_date: todayISO(),
      subject: "math",
      mode: "drill",
      score: correct,
      total,
      xp_earned: xpEarned,
      stars_earned: stars,
      topics_covered: [opRef.current],
    });

    setScreen("done");
  }, [stopTimer]);

  // Start timer when screen becomes "playing"
  useEffect(() => {
    if (screen !== "playing") return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          finishGame();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return stopTimer;
  }, [screen, finishGame, stopTimer]);

  function startGame() {
    correctRef.current = 0;
    totalRef.current = 0;
    comboRef.current = 0;
    maxComboRef.current = 0;
    xpEarnedRef.current = 0;
    opRef.current = op;
    setSelected(null);
    setCombo(0);
    setTimeLeft(DRILL_SECONDS);
    setQuestion(generateDrillQuestion(op));
    setLeveledUp(false);
    setNewlyUnlocked([]);
    setScreen("playing");
  }

  function handleChoice(choice: number) {
    if (selected !== null) return;
    setSelected(choice);
    totalRef.current += 1;

    if (choice === question.answer) {
      correctRef.current += 1;
      comboRef.current += 1;
      if (comboRef.current > maxComboRef.current) maxComboRef.current = comboRef.current;
      const multiplier = comboRef.current >= 6 ? 3 : comboRef.current >= 3 ? 2 : 1;
      xpEarnedRef.current += 5 * multiplier;
    } else {
      comboRef.current = 0;
    }
    setCombo(comboRef.current);

    advanceRef.current = setTimeout(() => {
      setSelected(null);
      setQuestion(generateDrillQuestion(opRef.current));
    }, 600);
  }

  function playAgain() {
    setScreen("idle");
  }

  // ── IDLE ─────────────────────────────────────────────────────────────────────
  if (screen === "idle") {
    return (
      <div className="min-h-screen bg-parchment text-navy px-4 py-8 max-w-md mx-auto">
        <Link href="/hub" className="text-sm text-stone hover:text-navy mb-6 block">
          ← Back to Hub
        </Link>
        <h1
          className="text-3xl font-bold text-navy mb-2"
          style={{ fontFamily: "Georgia, serif" }}
        >
          Math Drills
        </h1>
        <p className="text-stone text-sm mb-6">
          Answer as many problems as you can in 60 seconds!
        </p>

        <div className="mb-6">
          <p className="text-sm font-semibold text-navy mb-3">Choose an operation:</p>
          <div className="flex flex-wrap gap-2">
            {OPS.map((o) => (
              <button
                key={o.key}
                onClick={() => setOp(o.key)}
                className={`px-4 py-2 rounded-sm text-sm font-semibold border transition-colors ${
                  op === o.key
                    ? "bg-navy text-white border-navy"
                    : "bg-bone text-navy border-bone hover:border-navy"
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-bone rounded-sm p-3 mb-4 text-xs text-stone">
          <span className="font-semibold text-navy">Tip:</span> Answer 3 in a row for 2× XP, 6 in a row for 3× XP! 🔥
        </div>

        <button
          onClick={startGame}
          className="w-full bg-navy text-white font-bold py-3 rounded-sm hover:bg-navy-dark transition-colors text-lg"
        >
          Start →
        </button>
      </div>
    );
  }

  // ── PLAYING ──────────────────────────────────────────────────────────────────
  if (screen === "playing") {
    const timerPct = (timeLeft / DRILL_SECONDS) * 100;
    const timerLow = timeLeft <= 10;

    return (
      <div className="min-h-screen bg-parchment text-navy flex flex-col max-w-md mx-auto px-4 py-4">
        {/* Timer bar */}
        <div className="h-2 bg-bone rounded-full overflow-hidden mb-4">
          <div
            className={`h-full rounded-full transition-all duration-1000 ${
              timerLow ? "bg-red-500" : "bg-navy"
            }`}
            style={{ width: `${timerPct}%` }}
          />
        </div>

        {/* Score / combo / time header */}
        <div className="flex justify-between items-center mb-8">
          <div className="bg-bone rounded-sm px-4 py-2">
            <span className="text-xs text-stone block">Score</span>
            <span className="text-xl font-bold text-navy">
              {correctRef.current} / {totalRef.current}
            </span>
          </div>
          {combo >= 3 && (
            <div className={`rounded-sm px-3 py-2 text-center ${combo >= 6 ? "bg-gold text-white" : "bg-teal text-white"}`}>
              <span className="text-xs block opacity-80">Combo</span>
              <span className="text-lg font-bold">
                {combo >= 6 ? "3×" : "2×"} 🔥
              </span>
            </div>
          )}
          <div
            className={`bg-bone rounded-sm px-4 py-2 text-right ${
              timerLow ? "border border-red-400" : ""
            }`}
          >
            <span className="text-xs text-stone block">Time</span>
            <span
              className={`text-xl font-bold ${
                timerLow ? "text-red-500" : "text-navy"
              }`}
            >
              {timeLeft}s
            </span>
          </div>
        </div>

        {/* Question */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <p
            className="text-6xl font-bold text-navy mb-12 text-center select-none"
            style={{ fontFamily: "Georgia, serif" }}
          >
            {question.display}
          </p>

          {/* 2×2 choice grid */}
          <div className="grid grid-cols-2 gap-3 w-full">
            {question.choices.map((c) => {
              let cls =
                "py-5 text-2xl font-bold rounded-sm border-2 border-transparent transition-colors ";
              if (selected === null) {
                cls += "bg-bone text-navy hover:border-navy cursor-pointer";
              } else if (c === question.answer) {
                cls += "bg-teal text-white border-teal";
              } else if (c === selected && c !== question.answer) {
                cls += "bg-red-100 text-red-700 border-red-300";
              } else {
                cls += "bg-bone text-stone opacity-60";
              }
              return (
                <button
                  key={c}
                  onClick={() => handleChoice(c)}
                  disabled={selected !== null}
                  className={cls}
                >
                  {c}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ── DONE ─────────────────────────────────────────────────────────────────────
  const accuracy =
    finalTotal > 0 ? Math.round((finalCorrect / finalTotal) * 100) : 0;

  return (
    <div className="min-h-screen bg-parchment text-navy px-4 py-8 max-w-md mx-auto">
      <h1
        className="text-3xl font-bold text-navy mb-1"
        style={{ fontFamily: "Georgia, serif" }}
      >
        Time&apos;s Up!
      </h1>
      <p className="text-stone text-sm mb-6">Here&apos;s how you did:</p>

      <div className="bg-bone rounded-sm p-5 mb-4">
        <div className="flex justify-between mb-3">
          <span className="text-stone text-sm">Correct</span>
          <span className="font-bold text-navy">
            {finalCorrect} / {finalTotal}
          </span>
        </div>
        <div className="flex justify-between mb-3">
          <span className="text-stone text-sm">Accuracy</span>
          <span className="font-bold text-navy">{accuracy}%</span>
        </div>
        <div className="flex justify-between mb-3">
          <span className="text-stone text-sm">Stars earned</span>
          <span className="text-gold font-bold">{"★".repeat(finalStars)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-stone text-sm">XP earned</span>
          <span className="font-bold text-teal">+{finalXP} XP {finalXP > finalCorrect * 5 ? "⚡" : ""}</span>
        </div>
      </div>

      {leveledUp && (
        <div className="bg-gold text-white rounded-sm p-3 mb-4 text-center font-bold">
          Level Up! Keep going!
        </div>
      )}

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

      {finalXP > finalCorrect * 5 && (
        <div className="bg-teal/10 border border-teal rounded-sm p-2 text-center text-xs text-teal font-semibold mb-3">
          Combo bonus earned! 🔥
        </div>
      )}

      <div className="flex gap-3 mt-4">
        <button
          onClick={playAgain}
          className="flex-1 bg-navy text-white font-bold py-3 rounded-sm hover:bg-navy-dark transition-colors"
        >
          Play Again
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
