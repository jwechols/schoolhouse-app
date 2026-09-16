// ── Adaptive Learning, Truma (and future: all kids) ─────────────────────────
// Quietly tracks right/wrong answers per topic. Surfaces struggling areas
// as gentle growth opportunities, never "weak", always "almost there".
//
// Storage key: `elc-adaptive-{kidId}` → AdaptiveMastery object in localStorage.

export interface TopicRecord {
  correct: number;
  total: number;
  lastSeen: string;       // ISO date string
  recentStreak: number;   // consecutive correct answers (confidence signal)
}

export interface AdaptiveMastery {
  [topic: string]: TopicRecord;
}

// ── Read / Write ──────────────────────────────────────────────────────────────

const KEY = (kidId: string) => `elc-adaptive-${kidId}`;

export function loadMastery(kidId: string): AdaptiveMastery {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(KEY(kidId));
    return raw ? (JSON.parse(raw) as AdaptiveMastery) : {};
  } catch {
    return {};
  }
}

export function recordAnswer(kidId: string, topic: string, correct: boolean): void {
  if (typeof window === "undefined") return;
  const mastery = loadMastery(kidId);
  const prev = mastery[topic] ?? { correct: 0, total: 0, lastSeen: "", recentStreak: 0 };
  mastery[topic] = {
    correct: prev.correct + (correct ? 1 : 0),
    total: prev.total + 1,
    lastSeen: new Date().toISOString().slice(0, 10),
    recentStreak: correct ? prev.recentStreak + 1 : 0,
  };
  localStorage.setItem(KEY(kidId), JSON.stringify(mastery));
}

// ── Analysis helpers ──────────────────────────────────────────────────────────

export function getMasteryPct(record: TopicRecord): number {
  if (record.total === 0) return 0;
  return Math.round((record.correct / record.total) * 100);
}

export interface GrowthArea {
  topic: string;
  pct: number;
  total: number;
  recentStreak: number;
  encouragement: string;
  nudge: string;         // gentle action label, e.g. "Try 5 problems →"
}

// Topics Truma should see in her adaptive dashboard
const TOPIC_LABELS: Record<string, string> = {
  prealgebra_equations:   "Equations",
  prealgebra_ratios:      "Ratios & Proportions",
  prealgebra_fractions:   "Fractions",
  prealgebra_integers:    "Integers",
  grammar_clauses:        "Clauses & Phrases",
  grammar_punctuation:    "Punctuation",
  writing_thesis:         "Thesis Statements",
  writing_evidence:       "Using Evidence",
  science_cells:          "Cell Biology",
  science_ecosystems:     "Ecosystems",
  history_ancient:        "Ancient Civilizations",
  history_medieval:       "Medieval World",
  bible_catechism:        "Catechism",
  bible_scripture:        "Scripture Memory",
};

export function getTopicLabel(topic: string): string {
  return TOPIC_LABELS[topic] ?? topic.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

// Encouraging phrases based on mastery %
function buildEncouragement(pct: number, recentStreak: number): string {
  if (recentStreak >= 3) return "You're on a roll! 🔥";
  if (pct >= 80) return "You've really got this! ⭐";
  if (pct >= 60) return "Getting stronger every day 💪";
  if (pct >= 40) return "You're making progress! ✨";
  if (pct >= 20) return "This is where champions are made 🌸";
  return "Every expert started here, let's go! 🚀";
}

function buildNudge(pct: number): string {
  if (pct >= 70) return "Keep it sharp →";
  if (pct >= 40) return "Practice 5 problems →";
  return "Let's try together →";
}

/**
 * Returns up to `count` topics to gently focus on.
 * Prioritises: low mastery + recently seen (so she's already exposed) +
 * not already streaking (she doesn't need the ones she's already nailing).
 */
export function getGrowthAreas(kidId: string, count = 2): GrowthArea[] {
  const mastery = loadMastery(kidId);

  return Object.entries(mastery)
    .filter(([, r]) => r.total >= 3)          // only topics she's actually tried
    .map(([topic, r]) => ({
      topic,
      pct: getMasteryPct(r),
      total: r.total,
      recentStreak: r.recentStreak,
      encouragement: buildEncouragement(getMasteryPct(r), r.recentStreak),
      nudge: buildNudge(getMasteryPct(r)),
    }))
    .filter((a) => a.recentStreak < 5)        // skip topics she's already crushing
    .sort((a, b) => a.pct - b.pct)            // lowest mastery first
    .slice(0, count);
}

/**
 * Returns topics she's recently improved on, for celebration.
 */
export interface WinArea {
  topic: string;
  pct: number;
  recentStreak: number;
}

export function getRecentWins(kidId: string, count = 2): WinArea[] {
  const mastery = loadMastery(kidId);
  return Object.entries(mastery)
    .filter(([, r]) => r.recentStreak >= 3 && r.total >= 5)
    .map(([topic, r]) => ({ topic, pct: getMasteryPct(r), recentStreak: r.recentStreak }))
    .sort((a, b) => b.recentStreak - a.recentStreak)
    .slice(0, count);
}
