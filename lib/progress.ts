// ── Universal Progress System ──────────────────────────────────────────────────
// localStorage key: elc-progress-[kidId]

export interface KidProgress {
  xp: number;
  level: number;
  streak: number;
  lastPracticed: string; // ISO date YYYY-MM-DD
  completedSubjects: Record<string, number>; // subjectId → session count
  badges: string[];
  totalSessions: number;
}

export interface BadgeDef {
  id: string;
  name: string;
  emoji: string;
  desc: string;
  check: (p: KidProgress) => boolean;
}

// Level thresholds (XP needed to reach that level)
const LEVEL_XP = [0, 100, 300, 600, 1000] as const;

export function getLevel(xp: number): number {
  let lvl = 1;
  for (let i = 1; i < LEVEL_XP.length; i++) {
    if (xp >= LEVEL_XP[i]) lvl = i + 1;
    else break;
  }
  return lvl;
}

export function getLevelLabel(level: number): string {
  const LABELS: Record<number, string> = {
    1: "Beginner",
    2: "Explorer",
    3: "Scholar",
    4: "Champion",
    5: "Legend",
  };
  return LABELS[level] ?? "Legend";
}

export function getLevelXP(level: number): { current: number; next: number } {
  const idx = Math.min(level - 1, LEVEL_XP.length - 1);
  const current = LEVEL_XP[idx] ?? 0;
  const next = level < LEVEL_XP.length ? (LEVEL_XP[level] ?? current) : current;
  return { current, next };
}

function storageKey(kidId: string) {
  return `elc-progress-${kidId}`;
}

function makeDefault(kidId: string): KidProgress {
  return {
    xp: 0,
    level: 1,
    streak: 0,
    lastPracticed: "",
    completedSubjects: {},
    badges: [],
    totalSessions: 0,
  };
}

export function getProgress(kidId: string): KidProgress {
  if (typeof window === "undefined") return makeDefault(kidId);
  try {
    const raw = localStorage.getItem(storageKey(kidId));
    if (!raw) return makeDefault(kidId);
    const parsed = JSON.parse(raw) as Partial<KidProgress>;
    return { ...makeDefault(kidId), ...parsed };
  } catch {
    return makeDefault(kidId);
  }
}

function saveProgress(kidId: string, p: KidProgress): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(storageKey(kidId), JSON.stringify(p));
}

export function addXP(kidId: string, amount: number): KidProgress {
  const p = getProgress(kidId);
  const newXP = p.xp + amount;
  const newLevel = getLevel(newXP);
  const updated: KidProgress = { ...p, xp: newXP, level: newLevel };
  saveProgress(kidId, updated);
  return updated;
}

export function recordSession(kidId: string, subject: string): KidProgress {
  const p = getProgress(kidId);
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

  const newStreak =
    p.lastPracticed === today
      ? p.streak
      : p.lastPracticed === yesterday
      ? p.streak + 1
      : 1;

  const prevSessions = p.completedSubjects[subject] ?? 0;
  const updated: KidProgress = {
    ...p,
    streak: newStreak,
    lastPracticed: today,
    totalSessions: p.totalSessions + 1,
    completedSubjects: {
      ...p.completedSubjects,
      [subject]: prevSessions + 1,
    },
  };
  saveProgress(kidId, updated);
  return updated;
}

// ── Badges ─────────────────────────────────────────────────────────────────────

export const BADGES: Record<string, BadgeDef> = {
  first_lesson: {
    id: "first_lesson",
    name: "First Steps",
    emoji: "🌱",
    desc: "Complete your first session",
    check: (p) => p.totalSessions >= 1,
  },
  streak_3: {
    id: "streak_3",
    name: "3-Day Streak",
    emoji: "🔥",
    desc: "Practice 3 days in a row",
    check: (p) => p.streak >= 3,
  },
  streak_7: {
    id: "streak_7",
    name: "Week Warrior",
    emoji: "⚡",
    desc: "Practice 7 days in a row",
    check: (p) => p.streak >= 7,
  },
  streak_14: {
    id: "streak_14",
    name: "Fortnight Fire",
    emoji: "💥",
    desc: "Practice 14 days in a row",
    check: (p) => p.streak >= 14,
  },
  math_master: {
    id: "math_master",
    name: "Math Master",
    emoji: "🔢",
    desc: "5 math sessions completed",
    check: (p) =>
      ((p.completedSubjects["math"] ?? 0) +
        (p.completedSubjects["prealgebra"] ?? 0) +
        (p.completedSubjects["counting"] ?? 0) +
        (p.completedSubjects["addition"] ?? 0)) >= 5,
  },
  bible_scholar: {
    id: "bible_scholar",
    name: "Bible Scholar",
    emoji: "✝️",
    desc: "5 Bible sessions completed",
    check: (p) => (p.completedSubjects["bible"] ?? 0) >= 5,
  },
  explorer: {
    id: "explorer",
    name: "Explorer",
    emoji: "🗺️",
    desc: "Try 3 different subjects",
    check: (p) => Object.keys(p.completedSubjects).length >= 3,
  },
  level_2: {
    id: "level_2",
    name: "Level 2",
    emoji: "⭐",
    desc: "Reach Level 2 (100 XP)",
    check: (p) => p.level >= 2,
  },
  level_3: {
    id: "level_3",
    name: "Level 3",
    emoji: "🌟",
    desc: "Reach Level 3 (300 XP)",
    check: (p) => p.level >= 3,
  },
  level_4: {
    id: "level_4",
    name: "Level 4",
    emoji: "🏆",
    desc: "Reach Level 4 (600 XP)",
    check: (p) => p.level >= 4,
  },
  level_5: {
    id: "level_5",
    name: "Legend",
    emoji: "👑",
    desc: "Reach Level 5 (1000 XP)",
    check: (p) => p.level >= 5,
  },
  sessions_5: {
    id: "sessions_5",
    name: "Regular",
    emoji: "📅",
    desc: "Complete 5 sessions total",
    check: (p) => p.totalSessions >= 5,
  },
  sessions_10: {
    id: "sessions_10",
    name: "Dedicated",
    emoji: "🎯",
    desc: "Complete 10 sessions total",
    check: (p) => p.totalSessions >= 10,
  },
  sessions_25: {
    id: "sessions_25",
    name: "All-Star",
    emoji: "🌠",
    desc: "Complete 25 sessions total",
    check: (p) => p.totalSessions >= 25,
  },
  science_fan: {
    id: "science_fan",
    name: "Science Fan",
    emoji: "🔬",
    desc: "3 science sessions completed",
    check: (p) => (p.completedSubjects["science"] ?? 0) >= 3,
  },
  history_buff: {
    id: "history_buff",
    name: "History Buff",
    emoji: "🏛️",
    desc: "3 history sessions completed",
    check: (p) => (p.completedSubjects["history"] ?? 0) >= 3,
  },
  reading_star: {
    id: "reading_star",
    name: "Reading Star",
    emoji: "📚",
    desc: "5 reading/phonics sessions",
    check: (p) =>
      ((p.completedSubjects["phonics"] ?? 0) +
        (p.completedSubjects["sightwords"] ?? 0)) >= 5,
  },
};

export const ALL_BADGE_IDS = Object.keys(BADGES);

export function checkBadges(kidId: string): string[] {
  const p = getProgress(kidId);
  const newlyEarned: string[] = [];
  for (const badge of Object.values(BADGES)) {
    if (!p.badges.includes(badge.id) && badge.check(p)) {
      newlyEarned.push(badge.id);
    }
  }
  if (newlyEarned.length > 0) {
    const updated: KidProgress = {
      ...p,
      badges: [...p.badges, ...newlyEarned],
    };
    saveProgress(kidId, updated);
  }
  return newlyEarned;
}
