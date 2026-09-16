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
  shuffle,
  bumpDailySession,
  todayISO,
  ACHIEVEMENTS,
  type UnlockedAchievement,
} from "@/lib/data";
import {
  FRACTION_QUESTIONS,
  WORD_PROBLEMS,
  SUBJECT_QUESTIONS,
} from "@/lib/questions";
import type { Question } from "@/lib/data";

const BOSS_QUESTIONS = 10;
const BOSS_SECONDS = 120;
const BOSS_HP_MAX = 100;
const HP_DAMAGE = 10;   // per correct
const HP_HEAL = 5;      // per wrong

interface BossConfig {
  name: string;
  title: string;
  emoji: string;
  color: string;
  taunt: string;
}

const BOSS_CONFIGS: Record<string, BossConfig> = {
  math:    { name: "The Number Dragon",  title: "Math",       emoji: "🐉", color: "text-red-600",    taunt: "Your arithmetic ends HERE, young scholar!" },
  grammar: { name: "The Grammar Golem",  title: "Grammar",    emoji: "🗿", color: "text-blue-600",   taunt: "Can you parse my sentences before it's too late?" },
  vocab:   { name: "The Word Witch",     title: "Vocabulary", emoji: "🧙", color: "text-purple-600", taunt: "Let's see if you know your roots, little scholar!" },
  history: { name: "The Time Tyrant",    title: "History",    emoji: "👑", color: "text-amber-600",  taunt: "History repeats itself, and so does defeat!" },
  science: { name: "The Lab Monster",    title: "Science",    emoji: "🧪", color: "text-green-600",  taunt: "Science will be your undoing... or your salvation!" },
};

function getBossQuestions(subject: string): Question[] {
  if (subject === "math") {
    const fracs = shuffle([...FRACTION_QUESTIONS]).slice(0, 5);
    const words = shuffle([...WORD_PROBLEMS]).slice(0, 5);
    return shuffle([...fracs, ...words]);
  }
  const pool = SUBJECT_QUESTIONS[subject] ?? [];
  return shuffle(pool).slice(0, BOSS_QUESTIONS);
}

type Screen = "idle" | "playing" | "victory" | "defeat";

function starsEarned(pct: number) {
  if (pct >= 90) return 4;
  if (pct >= 80) return 3;
  if (pct >= 60) return 2;
  return 1;
}

function getTimeBonus(timeRemaining: number): number {
  if (timeRemaining > 90) return 50;
  if (timeRemaining > 60) return 25;
  return 0;
}

interface Props { subject: string }

export default function BossGame({ subject }: Props) {
  const boss = BOSS_CONFIGS[subject] ?? BOSS_CONFIGS.math;
  const [screen, setScreen] = useState<Screen>("idle");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [bossHp, setBossHp] = useState(BOSS_HP_MAX);
  const [timeLeft, setTimeLeft] = useState(BOSS_SECONDS);
  const [newlyUnlocked, setNewlyUnlocked] = useState<UnlockedAchievement[]>([]);
  const [shake, setShake] = useState(false);

  const correctRef = useRef(0);
  const bossHpRef = useRef(BOSS_HP_MAX);
  const timeLeftRef = useRef(BOSS_SECONDS);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const advanceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [finalCorrect, setFinalCorrect] = useState(0);
  const [finalHp, setFinalHp] = useState(BOSS_HP_MAX);
  const [finalTimeBonus, setFinalTimeBonus] = useState(0);

  const stopTimer = useCallback(() => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
  }, []);

  const finishBoss = useCallback((correct: number, hp: number, timeRemaining?: number) => {
    stopTimer();
    if (advanceRef.current) clearTimeout(advanceRef.current);
    setFinalCorrect(correct);
    setFinalHp(hp);

    const pct = Math.round((correct / BOSS_QUESTIONS) * 100);
    const victory = hp <= 0;
    const stars = victory ? starsEarned(pct) : 1;
    const timeBonus = victory ? getTimeBonus(timeRemaining ?? 0) : 0;
    const xpEarned = victory ? correct * 15 + 50 + timeBonus : correct * 10;
    setFinalTimeBonus(timeBonus);

    let s = loadStats();
    s = updateStreak(s);
    s = recordSubjectPlayed(s, `boss_${subject}`);
    s = recordSubjectPlayed(s, subject);
    s.xp += xpEarned;
    s.stars += stars;
    if ((s.topicBest[subject] ?? 0) < pct) s.topicBest[subject] = pct;

    const newly = checkAchievements(s);
    s.achievementsUnlocked = [...s.achievementsUnlocked, ...newly];
    saveStats(s);
    setNewlyUnlocked(newly);
    bumpDailySession();

    postSession({
      session_date: todayISO(),
      subject,
      mode: "boss",
      score: correct,
      total: BOSS_QUESTIONS,
      xp_earned: xpEarned,
      stars_earned: stars,
      topics_covered: [`boss_${subject}`],
    });

    setScreen(victory ? "victory" : "defeat");
  }, [stopTimer, subject]);

  useEffect(() => {
    if (screen !== "playing") return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        const next = t - 1;
        timeLeftRef.current = next;
        if (next <= 0) {
          finishBoss(correctRef.current, bossHpRef.current, 0);
          return 0;
        }
        return next;
      });
    }, 1000);
    return stopTimer;
  }, [screen, finishBoss, stopTimer]);

  function startBoss() {
    const qs = getBossQuestions(subject);
    setQuestions(qs);
    setCurrentIdx(0);
    correctRef.current = 0;
    bossHpRef.current = BOSS_HP_MAX;
    timeLeftRef.current = BOSS_SECONDS;
    setBossHp(BOSS_HP_MAX);
    setSelected(null);
    setTimeLeft(BOSS_SECONDS);
    setNewlyUnlocked([]);
    setFinalTimeBonus(0);
    setScreen("playing");
  }

  function handleChoice(choice: string) {
    if (selected !== null) return;
    setSelected(choice);
    const q = questions[currentIdx];
    const isCorrect = choice === q.answer;

    if (isCorrect) {
      correctRef.current += 1;
      bossHpRef.current = Math.max(0, bossHpRef.current - HP_DAMAGE);
      setBossHp(bossHpRef.current);
    } else {
      bossHpRef.current = Math.min(BOSS_HP_MAX, bossHpRef.current + HP_HEAL);
      setBossHp(bossHpRef.current);
      setShake(true);
      setTimeout(() => setShake(false), 600);
    }

    if (bossHpRef.current <= 0) {
      setTimeout(() => finishBoss(correctRef.current, 0, timeLeftRef.current), 700);
      return;
    }

    advanceRef.current = setTimeout(() => {
      const next = currentIdx + 1;
      if (next >= BOSS_QUESTIONS) {
        finishBoss(correctRef.current, bossHpRef.current, timeLeftRef.current);
      } else {
        setCurrentIdx(next);
        setSelected(null);
      }
    }, 700);
  }

  // ── IDLE ─────────────────────────────────────────────────────────────────────
  if (screen === "idle") {
    return (
      <div className="min-h-screen bg-parchment text-navy px-4 py-8 max-w-md mx-auto">
        <Link href="/map" className="text-sm text-stone hover:text-navy mb-6 block">
          ← Adventure Map
        </Link>
        <div className="text-center mb-8">
          <span className="text-6xl block mb-3">{boss.emoji}</span>
          <h1 className="text-3xl font-bold text-navy mb-1" style={{ fontFamily: "Georgia, serif" }}>
            {boss.name}
          </h1>
          <p className="text-stone text-sm">{boss.title} Boss Battle</p>
          <p className="text-stone text-sm italic mt-2">&ldquo;{boss.taunt}&rdquo;</p>
        </div>

        <div className="bg-bone rounded-sm p-5 mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-stone">Boss HP</span>
            <span className="text-sm font-bold text-navy">{BOSS_HP_MAX}</span>
          </div>
          <div className="h-4 bg-white rounded-full overflow-hidden">
            <div className="h-full bg-red-500 rounded-full w-full" />
          </div>
        </div>

        <div className="bg-bone rounded-sm p-5 mb-6 space-y-1">
          <p className="text-sm font-semibold text-navy mb-2">Battle Rules:</p>
          <p className="text-sm text-stone">• 10 questions · 2-minute timer</p>
          <p className="text-sm text-stone">• Correct → Boss loses 10 HP</p>
          <p className="text-sm text-stone">• Wrong → Boss heals 5 HP</p>
          <p className="text-sm text-stone">• Drain all HP to win!</p>
          <p className="text-sm text-navy font-semibold mt-2">Victory reward: +15 XP/correct + 50 bonus XP!</p>
          <p className="text-sm text-teal font-semibold">Finish fast for up to +50 Speed Bonus XP!</p>
        </div>

        <button
          onClick={startBoss}
          className="w-full bg-red-600 text-white font-bold py-3 rounded-sm hover:bg-red-700 transition-colors text-lg"
        >
          Begin Battle ⚔
        </button>
      </div>
    );
  }

  // ── PLAYING ──────────────────────────────────────────────────────────────────
  if (screen === "playing") {
    const q = questions[currentIdx];
    const timerLow = timeLeft <= 20;
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    const hpPct = Math.max(0, (bossHp / BOSS_HP_MAX) * 100);
    const hpColor = bossHp <= 30 ? "bg-green-500" : bossHp <= 60 ? "bg-amber-500" : "bg-red-500";

    return (
      <div className="min-h-screen bg-parchment text-navy flex flex-col max-w-md mx-auto px-4 py-4">
        {/* Boss section */}
        <div className={`text-center mb-4 transition-all duration-150 ${shake ? "-translate-x-2 scale-110" : "translate-x-0 scale-100"}`}>
          <span className="text-4xl">{boss.emoji}</span>
          <p className={`text-sm font-bold mt-1 ${boss.color}`}>{boss.name}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs text-stone">HP</span>
            <div className="flex-1 h-3 bg-bone rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${hpColor}`}
                style={{ width: `${hpPct}%` }}
              />
            </div>
            <span className="text-xs font-bold text-navy w-8 text-right">{bossHp}</span>
          </div>
        </div>

        {/* Timer / progress */}
        <div className="flex justify-between items-center mb-4">
          <span className={`text-sm font-bold ${timerLow ? "text-red-500" : "text-navy"}`}>
            {mins}:{secs.toString().padStart(2, "0")}
          </span>
          <span className="text-xs text-stone">
            Q {currentIdx + 1} / {BOSS_QUESTIONS}
          </span>
          <span className="text-sm font-bold text-teal">
            ✓ {correctRef.current}
          </span>
        </div>

        {/* Question */}
        <div className="bg-bone rounded-sm p-4 mb-4">
          <p className="text-xs text-stone mb-1">{q?.topic}</p>
          <p className="text-base font-semibold text-navy leading-snug">{q?.question}</p>
        </div>

        {/* Choices */}
        <div className="grid grid-cols-1 gap-2">
          {q?.choices.map((c) => {
            let cls = "w-full text-left px-4 py-3 rounded-sm border-2 text-sm font-semibold transition-colors ";
            if (selected === null) {
              cls += "bg-bone text-navy border-transparent hover:border-navy cursor-pointer";
            } else if (c === q.answer) {
              cls += "bg-teal text-white border-teal";
            } else if (c === selected && c !== q.answer) {
              cls += "bg-red-100 text-red-700 border-red-300";
            } else {
              cls += "bg-bone text-stone opacity-50 border-transparent";
            }
            return (
              <button key={c} onClick={() => handleChoice(c)} disabled={selected !== null} className={cls}>
                {c}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // ── VICTORY / DEFEAT ─────────────────────────────────────────────────────────
  const victory = screen === "victory";
  const baseXp = victory ? finalCorrect * 15 + 50 : finalCorrect * 10;
  const xpEarned = victory ? baseXp + finalTimeBonus : baseXp;
  const pct = Math.round((finalCorrect / BOSS_QUESTIONS) * 100);

  return (
    <div className="min-h-screen bg-parchment text-navy px-4 py-8 max-w-md mx-auto">
      <div className="text-center mb-6">
        <span className="text-5xl block mb-2">{victory ? "🏆" : boss.emoji}</span>
        <h1 className="text-3xl font-bold mb-1" style={{ fontFamily: "Georgia, serif" }}>
          {victory ? "Victory!" : "Defeated…"}
        </h1>
        <p className="text-stone text-sm">
          {victory
            ? `You defeated ${boss.name}!`
            : `${boss.name} survived with ${finalHp} HP, try again!`}
        </p>
      </div>

      <div className="bg-bone rounded-sm p-5 mb-4">
        <div className="flex justify-between mb-3">
          <span className="text-stone text-sm">Correct</span>
          <span className="font-bold text-navy">{finalCorrect} / {BOSS_QUESTIONS}</span>
        </div>
        <div className="flex justify-between mb-3">
          <span className="text-stone text-sm">Score</span>
          <span className="font-bold text-navy">{pct}%</span>
        </div>
        <div className="flex justify-between mb-3">
          <span className="text-stone text-sm">Boss HP remaining</span>
          <span className={`font-bold ${victory ? "text-teal" : "text-red-500"}`}>
            {victory ? "0 (Defeated!)" : finalHp}
          </span>
        </div>
        <div className="flex justify-between mb-3">
          <span className="text-stone text-sm">XP earned</span>
          <span className="font-bold text-teal">+{xpEarned} XP</span>
        </div>
        {victory && finalTimeBonus > 0 && (
          <div className="flex justify-between">
            <span className="text-stone text-sm">Speed bonus</span>
            <span className="font-bold text-gold">+{finalTimeBonus} XP ⚡</span>
          </div>
        )}
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
          onClick={startBoss}
          className="flex-1 bg-red-600 text-white font-bold py-3 rounded-sm hover:bg-red-700 transition-colors"
        >
          {victory ? "Challenge Again" : "Try Again ⚔"}
        </button>
        <Link
          href="/map"
          className="flex-1 text-center bg-bone text-navy font-bold py-3 rounded-sm border border-navy hover:bg-navy hover:text-white transition-colors"
        >
          Adventure Map
        </Link>
      </div>
    </div>
  );
}
