import { todayCT } from "./now-ct";

export interface KidStats {
  kidId: string;
  stars: number;
  xp: number;
  streak: number;
  lastPlayDate: string;
  gamesPlayed: number;
  correctTotal: number;
  totalAnswered: number;
  gameScores: Record<string, { best: number; played: number }>;
}

function makeDefault(kidId: string): KidStats {
  return {
    kidId,
    stars: 0,
    xp: 0,
    streak: 0,
    lastPlayDate: "",
    gamesPlayed: 0,
    correctTotal: 0,
    totalAnswered: 0,
    gameScores: {},
  };
}

function storageKey(kidId: string) {
  return `fa-stats-${kidId}`;
}

export function loadStats(kidId: string): KidStats {
  if (typeof window === "undefined") return makeDefault(kidId);
  try {
    const raw = localStorage.getItem(storageKey(kidId));
    if (!raw) return makeDefault(kidId);
    return { ...makeDefault(kidId), ...JSON.parse(raw) };
  } catch {
    return makeDefault(kidId);
  }
}

export function saveStats(kidId: string, stats: KidStats): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(storageKey(kidId), JSON.stringify(stats));
}

export function recordGameResult(
  kidId: string,
  gameId: string,
  correct: number,
  total: number
): KidStats {
  const stats = loadStats(kidId);
  const xpGained = correct * 10;
  const starsGained = total > 0 && correct / total >= 0.8 ? 1 : 0;

  const today = todayCT();
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  const newStreak =
    stats.lastPlayDate === today
      ? stats.streak
      : stats.lastPlayDate === yesterday
      ? stats.streak + 1
      : 1;

  const prev = stats.gameScores[gameId] ?? { best: 0, played: 0 };
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0;

  const updated: KidStats = {
    ...stats,
    xp: stats.xp + xpGained,
    stars: stats.stars + starsGained,
    streak: newStreak,
    lastPlayDate: today,
    gamesPlayed: stats.gamesPlayed + 1,
    correctTotal: stats.correctTotal + correct,
    totalAnswered: stats.totalAnswered + total,
    gameScores: {
      ...stats.gameScores,
      [gameId]: { best: Math.max(prev.best, pct), played: prev.played + 1 },
    },
  };

  saveStats(kidId, updated);

  // Write last-played key so KidHub can detect completed games for mission tracking
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(
        `elc-last-${kidId}-${gameId}`,
        JSON.stringify({ lastDate: today, pct })
      );
    } catch {
      // ignore quota errors
    }
  }

  return updated;
}
