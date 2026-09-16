"use client";

import { useEffect, useState } from "react";
import {
  loadStats,
  saveStats,
  loadDailyProgress,
  saveDailyProgress,
  getDailyQuests,
  todayISO,
  type TrumaStats,
  type DailyProgress,
  type DailyQuestDef,
} from "@/lib/data";

const BONUS_XP = 50;

interface QuestWithStatus extends DailyQuestDef {
  done: boolean;
}

export default function DailyQuests() {
  const [quests, setQuests] = useState<QuestWithStatus[]>([]);
  const [daily, setDaily] = useState<DailyProgress | null>(null);
  const [allDone, setAllDone] = useState(false);
  const [bonusClaimed, setBonusClaimed] = useState(false);
  const [justClaimed, setJustClaimed] = useState(false);

  function refresh() {
    const stats: TrumaStats = loadStats();
    const d: DailyProgress = loadDailyProgress();
    const defs = getDailyQuests(todayISO());
    const withStatus = defs.map((def) => ({ ...def, done: def.check(stats, d) }));
    setQuests(withStatus);
    setDaily(d);
    setAllDone(withStatus.every((q) => q.done));
    setBonusClaimed(d.bonusClaimed);
  }

  useEffect(() => {
    refresh();
    // Refresh whenever the page regains focus (after playing a game)
    window.addEventListener("focus", refresh);
    return () => window.removeEventListener("focus", refresh);
  }, []);

  function claimBonus() {
    if (!daily || bonusClaimed || !allDone) return;
    const updated = { ...daily, bonusClaimed: true };
    saveDailyProgress(updated);

    const stats = loadStats();
    stats.xp += BONUS_XP;
    saveStats(stats);

    setBonusClaimed(true);
    setJustClaimed(true);
    setTimeout(() => setJustClaimed(false), 3000);
  }

  if (quests.length === 0) return null;

  const completedCount = quests.filter((q) => q.done).length;

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-bold text-navy" style={{ fontFamily: "Georgia, serif" }}>
          Daily Quests
        </h2>
        <span className="text-xs text-stone bg-bone px-2 py-1 rounded-full">
          {completedCount} / {quests.length} done
        </span>
      </div>

      <div className="space-y-2 mb-3">
        {quests.map((q) => (
          <div
            key={q.id}
            className={`bg-bone rounded-sm p-3 flex items-center justify-between border transition-colors ${
              q.done ? "border-teal" : "border-transparent"
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <span
                className={`text-lg flex-shrink-0 ${q.done ? "text-teal" : "text-stone opacity-40"}`}
              >
                {q.done ? "✓" : "○"}
              </span>
              <div className="min-w-0">
                <p className={`text-sm font-semibold leading-tight ${q.done ? "text-teal" : "text-navy"}`}>
                  {q.label}
                </p>
                <p className="text-xs text-stone leading-tight truncate">{q.description}</p>
              </div>
            </div>
            <span className="text-xs font-bold text-gold flex-shrink-0 ml-2">
              +{q.xpReward} XP
            </span>
          </div>
        ))}
      </div>

      {allDone && !bonusClaimed && (
        <button
          onClick={claimBonus}
          className="w-full bg-gold text-white font-bold py-2.5 rounded-sm hover:bg-gold-light hover:text-navy transition-colors text-sm"
        >
          ★ Claim Bonus Reward, +{BONUS_XP} XP!
        </button>
      )}

      {justClaimed && (
        <div className="bg-gold/20 border border-gold rounded-sm p-2 text-center text-sm font-bold text-navy">
          +{BONUS_XP} XP claimed! Great work today!
        </div>
      )}

      {allDone && bonusClaimed && !justClaimed && (
        <div className="bg-teal/10 border border-teal rounded-sm p-2 text-center text-xs text-teal font-semibold">
          All quests complete! Come back tomorrow for new quests.
        </div>
      )}
    </div>
  );
}
