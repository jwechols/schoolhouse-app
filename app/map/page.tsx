"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { loadStats, type TrumaStats } from "@/lib/data";

interface Region {
  key: string;
  name: string;
  subtitle: string;
  emoji: string;
  color: string;
  border: string;
  href: string;
  bossKey: string;
  scoreKeys: string[];
}

const REGIONS: Region[] = [
  {
    key: "history",
    name: "Ancient Egypt",
    subtitle: "History",
    emoji: "🏺",
    color: "bg-amber-50",
    border: "border-amber-400",
    href: "/practice/history",
    bossKey: "history",
    scoreKeys: ["history"],
  },
  {
    key: "grammar",
    name: "Classical Athens",
    subtitle: "Grammar",
    emoji: "🏛",
    color: "bg-blue-50",
    border: "border-blue-400",
    href: "/practice/grammar",
    bossKey: "grammar",
    scoreKeys: ["grammar"],
  },
  {
    key: "vocab",
    name: "Library of Alexandria",
    subtitle: "Vocabulary",
    emoji: "📜",
    color: "bg-purple-50",
    border: "border-purple-400",
    href: "/practice/vocab",
    bossKey: "vocab",
    scoreKeys: ["vocab"],
  },
  {
    key: "math",
    name: "The Roman Empire",
    subtitle: "Math",
    emoji: "⚔️",
    color: "bg-red-50",
    border: "border-red-400",
    href: "/drills",
    bossKey: "math",
    scoreKeys: ["math", "fractions", "words", "sprint"],
  },
  {
    key: "science",
    name: "The Amazon",
    subtitle: "Science",
    emoji: "🌿",
    color: "bg-green-50",
    border: "border-green-400",
    href: "/practice/science",
    bossKey: "science",
    scoreKeys: ["science"],
  },
];

function getBestScore(stats: TrumaStats, keys: string[]): number {
  return Math.max(0, ...keys.map((k) => stats.topicBest[k] ?? 0));
}

function getStatus(best: number, hasSession: boolean) {
  if (!hasSession) return "locked";
  if (best >= 80) return "mastered";
  if (best >= 60) return "exploring";
  return "unlocked";
}

const STATUS_LABEL: Record<string, string> = {
  locked: "Not explored",
  unlocked: "Exploring",
  exploring: "Advancing",
  mastered: "Mastered",
};

export default function AdventureMap() {
  const [stats, setStats] = useState<TrumaStats | null>(null);

  useEffect(() => {
    setStats(loadStats());
  }, []);

  if (!stats) {
    return (
      <div className="min-h-screen bg-parchment flex items-center justify-center">
        <p className="text-stone">Loading map…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-parchment text-navy px-4 py-8 max-w-2xl mx-auto">
      <Link href="/hub" className="text-sm text-stone hover:text-navy mb-6 block">
        ← Back to Hub
      </Link>
      <h1 className="text-3xl font-bold text-navy mb-2" style={{ fontFamily: "Georgia, serif" }}>
        Adventure Map
      </h1>
      <p className="text-stone text-sm mb-8">
        Explore every region, reach 60% to unlock Boss Battles!
      </p>

      <div className="space-y-4">
        {REGIONS.map((region) => {
          const best = getBestScore(stats, region.scoreKeys);
          const hasSession = region.scoreKeys.some(
            (k) => (stats.sessionCounts[k] ?? 0) > 0
          );
          const status = getStatus(best, hasSession);
          const bossUnlocked = best >= 60;

          return (
            <div
              key={region.key}
              className={`rounded-sm border-2 p-4 ${region.color} ${region.border}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{region.emoji}</span>
                  <div>
                    <h2 className="text-lg font-bold text-navy leading-tight" style={{ fontFamily: "Georgia, serif" }}>
                      {region.name}
                    </h2>
                    <p className="text-xs text-stone">{region.subtitle}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                    status === "mastered"
                      ? "bg-teal text-white"
                      : status === "exploring" || status === "unlocked"
                      ? "bg-navy text-white"
                      : "bg-stone/20 text-stone"
                  }`}>
                    {STATUS_LABEL[status]}
                  </span>
                  {hasSession && (
                    <p className="text-xs text-stone mt-1">Best: {best}%</p>
                  )}
                </div>
              </div>

              {/* Progress bar */}
              <div className="mb-3">
                <div className="h-2 bg-white/60 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      status === "mastered" ? "bg-teal" : "bg-navy"
                    }`}
                    style={{ width: `${best}%` }}
                  />
                </div>
                {hasSession && (
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-stone/70">Progress</span>
                    <span className="text-xs font-semibold text-navy">{best}%</span>
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex gap-2">
                <Link
                  href={region.href}
                  className={`flex-1 text-center text-white text-sm font-semibold py-2 rounded-sm transition-colors ${
                    status === "mastered"
                      ? "bg-teal hover:opacity-90"
                      : status === "exploring" || status === "unlocked"
                      ? "bg-navy hover:bg-navy-dark"
                      : "bg-stone/50 cursor-not-allowed"
                  }`}
                >
                  Practice →
                </Link>
                {bossUnlocked ? (
                  <Link
                    href={`/boss/${region.bossKey}`}
                    className="flex-1 text-center bg-gold text-white text-sm font-semibold py-2 rounded-sm hover:bg-gold-light hover:text-navy transition-colors"
                  >
                    ⚔ Boss Battle <span className="ml-1 inline-block w-2 h-2 bg-white rounded-full animate-pulse" />
                  </Link>
                ) : (
                  <div className="flex-1 text-center bg-stone/20 text-stone text-sm font-semibold py-2 rounded-sm cursor-not-allowed">
                    🔒 Boss (need 60%)
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 bg-bone rounded-sm p-4 text-sm text-stone text-center">
        <p className="font-semibold text-navy mb-1">Legend</p>
        <p>Practice to raise your score · 60% unlocks Boss Battle · 80% = Mastered</p>
      </div>
    </div>
  );
}
