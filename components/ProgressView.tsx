"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  loadStats,
  getLevel,
  ACHIEVEMENTS,
  DEFAULT_STATS,
  type TrumaStats,
} from "@/lib/data";
import type { TrumaSession } from "@/lib/supabase";

const SUBJECT_LABELS: Record<string, string> = {
  fractions: "Fractions",
  words: "Word Problems",
  grammar: "Grammar",
  vocab: "Vocabulary",
  history: "History",
  science: "Science",
};

const SUBJECT_KEYS = ["fractions", "words", "grammar", "vocab", "history", "science"];

export default function ProgressView() {
  const [stats, setStats] = useState<TrumaStats>(DEFAULT_STATS);
  const [sessions, setSessions] = useState<TrumaSession[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(true);

  useEffect(() => {
    setStats(loadStats());
  }, []);

  useEffect(() => {
    fetch("/api/session?limit=10")
      .then((r) => r.json())
      .then((data) => {
        if (data.sessions) setSessions(data.sessions);
      })
      .catch(() => {})
      .finally(() => setSessionsLoading(false));
  }, []);

  const { level, title, currentXP, nextXP } = getLevel(stats.xp);
  const xpInLevel = stats.xp - currentXP;
  const xpNeeded = nextXP - currentXP;
  const xpPct = xpNeeded > 0 ? Math.min(100, Math.round((xpInLevel / xpNeeded) * 100)) : 100;

  const totalSessions = Object.values(stats.sessionCounts).reduce((a, b) => a + b, 0);

  const unlockedIds = new Set(stats.achievementsUnlocked.map((a) => a.id));

  return (
    <div className="min-h-screen bg-parchment text-navy px-4 py-8 max-w-2xl mx-auto">
      {/* Header */}
      <Link href="/hub" className="text-sm text-stone hover:text-navy mb-4 block">
        ← Back to Hub
      </Link>
      <h1
        className="text-3xl font-bold text-navy mb-6"
        style={{ fontFamily: "Georgia, serif" }}
      >
        My Progress
      </h1>

      {/* Level card */}
      <div className="bg-bone rounded-sm p-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs text-stone uppercase tracking-wide mb-0.5">Current Level</p>
            <p
              className="text-2xl font-bold text-navy"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Level {level}, {title}
            </p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-gold">{stats.xp}</p>
            <p className="text-xs text-stone">total XP</p>
          </div>
        </div>
        <div className="h-3 bg-parchment rounded-full overflow-hidden mb-1">
          <div
            className="h-full bg-navy rounded-full transition-all duration-500"
            style={{ width: `${xpPct}%` }}
          />
        </div>
        <p className="text-xs text-stone">
          {xpInLevel} XP, {xpPct}% to next level (need {xpNeeded - xpInLevel} more)
        </p>
      </div>

      {/* Stats summary */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-bone rounded-sm p-4 text-center">
          <p className="text-2xl font-bold text-gold">★ {stats.stars}</p>
          <p className="text-xs text-stone mt-1">Stars</p>
        </div>
        <div className="bg-bone rounded-sm p-4 text-center">
          <p className="text-2xl font-bold text-navy">⚡ {stats.streak}</p>
          <p className="text-xs text-stone mt-1">Day Streak</p>
        </div>
        <div className="bg-bone rounded-sm p-4 text-center">
          <p className="text-2xl font-bold text-navy">{totalSessions}</p>
          <p className="text-xs text-stone mt-1">Sessions</p>
        </div>
      </div>

      {/* Subject Mastery */}
      <div className="mb-6">
        <h2
          className="text-xl font-bold text-navy mb-4"
          style={{ fontFamily: "Georgia, serif" }}
        >
          Subject Mastery
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {SUBJECT_KEYS.map((key) => {
            const best = stats.topicBest[key] ?? 0;
            const label = SUBJECT_LABELS[key] ?? key;
            return (
              <div key={key} className="bg-bone rounded-sm p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold text-navy">{label}</span>
                  {best > 0 ? (
                    <span className="text-sm font-bold text-teal">{best}%</span>
                  ) : (
                    <span className="text-xs text-stone">Not started</span>
                  )}
                </div>
                <div className="h-2 bg-parchment rounded-full overflow-hidden">
                  <div
                    className="h-full bg-teal rounded-full transition-all duration-500"
                    style={{ width: `${best}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Achievements */}
      <div className="mb-6">
        <h2
          className="text-xl font-bold text-navy mb-2"
          style={{ fontFamily: "Georgia, serif" }}
        >
          Achievements
        </h2>
        <p className="text-stone text-sm mb-4">
          <span className="text-gold font-bold">{unlockedIds.size}</span>
          <span> / {ACHIEVEMENTS.length} unlocked</span>
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {ACHIEVEMENTS.map((a) => {
            const unlocked = unlockedIds.has(a.id);
            return (
              <div
                key={a.id}
                className={`bg-bone rounded-sm p-4 border transition-colors ${
                  unlocked
                    ? "border-gold"
                    : "border-transparent opacity-40"
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p
                    className={`text-sm font-bold ${
                      unlocked ? "text-gold" : "text-stone"
                    }`}
                  >
                    {unlocked ? "✓" : "🔒"} {a.label}
                  </p>
                </div>
                <p
                  className={`text-xs leading-snug ${
                    unlocked ? "text-navy" : "text-stone"
                  }`}
                >
                  {a.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Sessions */}
      <div className="mb-6">
        <h2
          className="text-xl font-bold text-navy mb-4"
          style={{ fontFamily: "Georgia, serif" }}
        >
          Recent Sessions
        </h2>
        {sessionsLoading ? (
          <p className="text-stone text-sm">Loading…</p>
        ) : sessions.length === 0 ? (
          <div className="bg-bone rounded-sm p-4 text-center">
            <p className="text-stone text-sm">No sessions recorded yet. Start practicing!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {sessions.map((s) => {
              const accuracy =
                s.total > 0 ? Math.round((s.score / s.total) * 100) : 0;
              return (
                <div
                  key={s.id}
                  className="bg-bone rounded-sm p-4 flex items-center justify-between gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <span className="text-sm font-semibold text-navy capitalize">
                        {s.subject}
                      </span>
                      <span className="text-xs text-stone bg-parchment px-2 py-0.5 rounded-full capitalize">
                        {s.mode}
                      </span>
                    </div>
                    <p className="text-xs text-stone">
                      {s.session_date}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-navy">
                      {s.score}/{s.total}
                      <span className="text-stone font-normal ml-1">({accuracy}%)</span>
                    </p>
                    <p className="text-xs text-teal font-semibold">+{s.xp_earned} XP</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
