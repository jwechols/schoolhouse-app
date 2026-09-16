import { todayCT } from "./now-ct";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface Question {
  id: string;
  topic: string;
  question: string;
  choices: string[];
  answer: string;
  solution: string;
}

export interface AchievementDef {
  id: string;
  label: string;
  description: string;
}

export interface UnlockedAchievement {
  id: string;
  unlockedAt: string; // ISO timestamp
}

export interface TrumaStats {
  xp: number;
  stars: number;
  streak: number;
  lastPlayed: string;
  topicBest: Record<string, number>;
  sessionCounts: Record<string, number>;
  achievementsUnlocked: UnlockedAchievement[];
  drillHighScore: number;
  sprintHighScore: number;
  comboHighScore: number;
  tutorSessions: number;
  todaySessions: { date: string; subjects: string[] };
}

export const DEFAULT_STATS: TrumaStats = {
  xp: 0,
  stars: 0,
  streak: 0,
  lastPlayed: "",
  topicBest: {},
  sessionCounts: {},
  achievementsUnlocked: [],
  drillHighScore: 0,
  sprintHighScore: 0,
  comboHighScore: 0,
  tutorSessions: 0,
  todaySessions: { date: "", subjects: [] },
};

// ── LocalStorage helpers ──────────────────────────────────────────────────────

export function loadStats(): TrumaStats {
  try {
    const raw = localStorage.getItem("ta-stats");
    if (!raw) return { ...DEFAULT_STATS };
    const parsed = JSON.parse(raw);
    // Migrate old string[] achievements to UnlockedAchievement[]
    if (Array.isArray(parsed.achievementsUnlocked) && typeof parsed.achievementsUnlocked[0] === "string") {
      parsed.achievementsUnlocked = parsed.achievementsUnlocked.map((id: string) => ({
        id,
        unlockedAt: new Date().toISOString(),
      }));
    }
    return { ...DEFAULT_STATS, ...parsed };
  } catch {
    return { ...DEFAULT_STATS };
  }
}

export function saveStats(stats: TrumaStats): void {
  localStorage.setItem("ta-stats", JSON.stringify(stats));
}

export function todayISO(): string {
  return todayCT();
}

export function updateStreak(stats: TrumaStats): TrumaStats {
  const today = todayISO();
  if (stats.lastPlayed === today) return stats;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yISO = yesterday.toISOString().slice(0, 10);
  const newStreak = stats.lastPlayed === yISO ? stats.streak + 1 : 1;

  const todaySubjects =
    stats.todaySessions.date === today ? stats.todaySessions.subjects : [];

  return {
    ...stats,
    streak: newStreak,
    lastPlayed: today,
    todaySessions: { date: today, subjects: todaySubjects },
  };
}

export function recordSubjectPlayed(stats: TrumaStats, subject: string): TrumaStats {
  const today = todayISO();
  const existing =
    stats.todaySessions.date === today ? stats.todaySessions.subjects : [];
  if (existing.includes(subject)) return stats;
  return {
    ...stats,
    todaySessions: { date: today, subjects: [...existing, subject] },
    sessionCounts: {
      ...stats.sessionCounts,
      [subject]: (stats.sessionCounts[subject] ?? 0) + 1,
    },
  };
}

// ── Level system ──────────────────────────────────────────────────────────────

const XP_THRESHOLDS = [0, 100, 250, 450, 700, 1000, 1400, 1850, 2400, 3000];
const LEVEL_TITLES = [
  "Apprentice Scholar",
  "Junior Scholar",
  "Diligent Student",
  "Classical Learner",
  "Knowledge Seeker",
  "Faithful Thinker",
  "Wisdom Seeker",
  "Crowned Scholar",
  "Knight of Learning",
  "Trivium Master",
];

export function getLevel(xp: number) {
  let level = 0;
  for (let i = XP_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= XP_THRESHOLDS[i]) { level = i; break; }
  }
  return {
    level: level + 1,
    title: LEVEL_TITLES[level],
    currentXP: XP_THRESHOLDS[level],
    nextXP: XP_THRESHOLDS[level + 1] ?? XP_THRESHOLDS[XP_THRESHOLDS.length - 1],
  };
}

// ── Verses ────────────────────────────────────────────────────────────────────

export const VERSES = [
  { text: "For I know the plans I have for you, plans to give you hope and a future.", ref: "Jeremiah 29:11" },
  { text: "Whatever you do, work at it with all your heart, as working for the Lord.", ref: "Colossians 3:23" },
  { text: "Trust in the Lord with all your heart and lean not on your own understanding.", ref: "Proverbs 3:5" },
  { text: "Do your best to present yourself as one approved, a worker who does not need to be ashamed.", ref: "2 Timothy 2:15" },
  { text: "Be strong and courageous. Do not be afraid, for the Lord your God is with you.", ref: "Joshua 1:9" },
  { text: "The Lord gives wisdom; from his mouth come knowledge and understanding.", ref: "Proverbs 2:6" },
];

export const todayVerse = () => VERSES[new Date().getDay()];

// ── Achievements ──────────────────────────────────────────────────────────────

export const ACHIEVEMENTS: AchievementDef[] = [
  { id: "first_session",   label: "First Step",          description: "Complete your first round" },
  { id: "streak_3",        label: "Three-Day Streak",    description: "Play 3 days in a row" },
  { id: "streak_7",        label: "Week Warrior",        description: "Play 7 days in a row" },
  { id: "streak_14",       label: "Fortnight Scholar",   description: "Play 14 days in a row" },
  { id: "xp_100",          label: "Century",             description: "Earn 100 XP total" },
  { id: "xp_500",          label: "Five Hundred",        description: "Earn 500 XP total" },
  { id: "xp_1000",         label: "Thousand Club",       description: "Earn 1,000 XP total" },
  { id: "perfect_round",   label: "Perfect Round",       description: "Score 100% on any round" },
  { id: "three_perfects",  label: "Triple Crown",        description: "Score 100% in three different subjects" },
  { id: "all_subjects",    label: "Renaissance Scholar", description: "Play every subject at least once" },
  { id: "math_master",     label: "Math Master",         description: "Score 80%+ on both fractions and word problems" },
  { id: "drill_10",        label: "Speed Demon",         description: "Get 10+ correct in one 60-second drill" },
  { id: "drill_20",        label: "Lightning Fingers",   description: "Get 20+ correct in one 60-second drill" },
  { id: "grammar_best",    label: "Grammar Guardian",    description: "Score 80%+ in Grammar" },
  { id: "vocab_best",      label: "Word Roots",          description: "Score 80%+ in Vocabulary" },
  { id: "history_best",    label: "Ancient Explorer",    description: "Score 80%+ in History" },
  { id: "science_best",    label: "Science Star",        description: "Score 80%+ in Science" },
  { id: "tutor_chat",      label: "Ask Away",            description: "Start a conversation with your Tutor" },
  { id: "sessions_10",     label: "Committed",           description: "Complete 10 rounds across any subjects" },
  { id: "sessions_25",     label: "Dedicated Scholar",   description: "Complete 25 rounds across any subjects" },
  { id: "sprint_complete", label: "Sprinter",            description: "Complete your first Math Sprint" },
  { id: "sprint_30",       label: "Sprint Star",         description: "Get 30 or more correct in a Sprint" },
  { id: "sprint_perfect",  label: "Perfect Sprint",      description: "Get all 40 correct in a Math Sprint" },
  { id: "combo_master",    label: "Combo Master",        description: "Reach a 6× combo in Math Drills" },
  { id: "boss_first_win",  label: "Boss Slayer",         description: "Defeat any Boss in a Boss Battle" },
];

export function checkAchievements(stats: TrumaStats): UnlockedAchievement[] {
  const alreadyUnlocked = new Set(stats.achievementsUnlocked.map((a) => a.id));
  const newly: UnlockedAchievement[] = [];
  const now = new Date().toISOString();

  const totalSessions = Object.values(stats.sessionCounts).reduce((a, b) => a + b, 0);
  const perfectSubjects = Object.values(stats.topicBest).filter((v) => v === 100).length;
  const subjectKeys = ["math", "fractions", "words", "grammar", "vocab", "history", "science", "bible"];

  const checks: Record<string, boolean> = {
    first_session:   totalSessions >= 1,
    streak_3:        stats.streak >= 3,
    streak_7:        stats.streak >= 7,
    streak_14:       stats.streak >= 14,
    xp_100:          stats.xp >= 100,
    xp_500:          stats.xp >= 500,
    xp_1000:         stats.xp >= 1000,
    perfect_round:   perfectSubjects >= 1,
    three_perfects:  perfectSubjects >= 3,
    all_subjects:    subjectKeys.every((k) => (stats.sessionCounts[k] ?? 0) >= 1),
    math_master:     (stats.topicBest["fractions"] ?? 0) >= 80 && (stats.topicBest["words"] ?? 0) >= 80,
    drill_10:        stats.drillHighScore >= 10,
    drill_20:        stats.drillHighScore >= 20,
    grammar_best:    (stats.topicBest["grammar"] ?? 0) >= 80,
    vocab_best:      (stats.topicBest["vocab"] ?? 0) >= 80,
    history_best:    (stats.topicBest["history"] ?? 0) >= 80,
    science_best:    (stats.topicBest["science"] ?? 0) >= 80,
    tutor_chat:      stats.tutorSessions >= 1,
    sessions_10:     totalSessions >= 10,
    sessions_25:     totalSessions >= 25,
    sprint_complete: (stats.sessionCounts["sprint"] ?? 0) >= 1 || stats.todaySessions.subjects.includes("sprint"),
    sprint_30:       stats.sprintHighScore >= 30,
    sprint_perfect:  stats.sprintHighScore >= 40,
    combo_master:    (stats.comboHighScore ?? 0) >= 6,
    boss_first_win:  Object.keys(stats.sessionCounts).some((k) => k.startsWith("boss_")),
  };

  for (const [id, met] of Object.entries(checks)) {
    if (met && !alreadyUnlocked.has(id)) {
      newly.push({ id, unlockedAt: now });
    }
  }

  return newly;
}

// ── Drill helpers ─────────────────────────────────────────────────────────────

export type DrillOp = "add" | "sub" | "mul" | "div" | "mix";

export interface DrillQuestion {
  display: string;
  answer: number;
  choices: number[];
}

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffleArr<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function drillChoices(answer: number, spread: number): number[] {
  const wrongs = new Set<number>();
  while (wrongs.size < 3) {
    const w = answer + rand(-spread, spread);
    if (w !== answer && w > 0) wrongs.add(w);
  }
  return shuffleArr([answer, ...Array.from(wrongs)]);
}

export function generateDrillQuestion(op: DrillOp): DrillQuestion {
  const eff: Exclude<DrillOp, "mix"> =
    op === "mix" ? (["add", "sub", "mul", "div"] as const)[rand(0, 3)] : op;
  switch (eff) {
    case "add": { const a = rand(12, 99), b = rand(12, 99); return { display: `${a} + ${b}`, answer: a + b, choices: drillChoices(a + b, 15) }; }
    case "sub": { const a = rand(25, 99), b = rand(10, a - 5); return { display: `${a} − ${b}`, answer: a - b, choices: drillChoices(a - b, 12) }; }
    case "mul": { const a = rand(2, 12), b = rand(2, 12); return { display: `${a} × ${b}`, answer: a * b, choices: drillChoices(a * b, 20) }; }
    case "div": { const b = rand(2, 12), a = b * rand(2, 12); return { display: `${a} ÷ ${b}`, answer: a / b, choices: drillChoices(a / b, 8) }; }
  }
}

export { shuffleArr as shuffle };

// ── Daily Quests ──────────────────────────────────────────────────────────────

export interface DailyProgress {
  date: string;
  sessionsToday: number;
  bonusClaimed: boolean;
}

export interface DailyQuestDef {
  id: string;
  label: string;
  description: string;
  xpReward: number;
  check: (stats: TrumaStats, daily: DailyProgress) => boolean;
}

const QUEST_POOL: DailyQuestDef[] = [
  {
    id: "rounds_3", label: "Daily Grind", description: "Complete 3 rounds today", xpReward: 30,
    check: (_s, d) => d.sessionsToday >= 3,
  },
  {
    id: "sprint_run", label: "Sprinter", description: "Complete a Math Sprint", xpReward: 35,
    check: (s) => s.todaySessions.subjects.includes("sprint"),
  },
  {
    id: "study_math", label: "Math Focus", description: "Do any math activity", xpReward: 20,
    check: (s) => ["math", "fractions", "words", "sprint"].some((k) => s.todaySessions.subjects.includes(k)),
  },
  {
    id: "study_grammar", label: "Grammar", description: "Practice Grammar today", xpReward: 20,
    check: (s) => s.todaySessions.subjects.includes("grammar"),
  },
  {
    id: "study_vocab", label: "Vocabulary", description: "Practice Vocabulary today", xpReward: 20,
    check: (s) => s.todaySessions.subjects.includes("vocab"),
  },
  {
    id: "study_history", label: "History", description: "Practice History today", xpReward: 20,
    check: (s) => s.todaySessions.subjects.includes("history"),
  },
  {
    id: "study_science", label: "Science", description: "Practice Science today", xpReward: 20,
    check: (s) => s.todaySessions.subjects.includes("science"),
  },
  {
    id: "study_bible", label: "Word of God", description: "Practice Bible today", xpReward: 25,
    check: (s) => s.todaySessions.subjects.includes("bible"),
  },
  {
    id: "boss_attempt", label: "Face a Boss", description: "Challenge any Boss Battle", xpReward: 40,
    check: (s) => s.todaySessions.subjects.some((k) => k.startsWith("boss_")),
  },
];

export function getDailyQuests(date: string): DailyQuestDef[] {
  const seed = date.replace(/-/g, "").split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const rotatables = QUEST_POOL.filter((q) => q.id !== "rounds_3");
  const i1 = seed % rotatables.length;
  const i2 = (seed * 3 + 7) % rotatables.length;
  const q2 = rotatables[i1];
  const q3 = rotatables[i2 === i1 ? (i2 + 1) % rotatables.length : i2];
  return [QUEST_POOL[0], q2, q3];
}

const DAILY_KEY = "ta-daily";

export function loadDailyProgress(): DailyProgress {
  try {
    const raw = localStorage.getItem(DAILY_KEY);
    if (!raw) return { date: todayISO(), sessionsToday: 0, bonusClaimed: false };
    const p = JSON.parse(raw) as DailyProgress;
    if (p.date !== todayISO()) return { date: todayISO(), sessionsToday: 0, bonusClaimed: false };
    return p;
  } catch {
    return { date: todayISO(), sessionsToday: 0, bonusClaimed: false };
  }
}

export function saveDailyProgress(p: DailyProgress): void {
  localStorage.setItem(DAILY_KEY, JSON.stringify(p));
}

export function bumpDailySession(): void {
  const p = loadDailyProgress();
  p.sessionsToday += 1;
  saveDailyProgress(p);
}

// ── Session POST helper ───────────────────────────────────────────────────────

export interface SessionPayload {
  session_date: string;
  subject: string;
  mode: string;
  score: number;
  total: number;
  xp_earned: number;
  stars_earned: number;
  topics_covered: string[];
}

export function postSession(payload: SessionPayload): void {
  fetch("/api/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).catch(() => {}); // fire-and-forget
}
