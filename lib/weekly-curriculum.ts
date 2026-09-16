// ── Weekly Curriculum System ──────────────────────────────────────────────────
// Source of truth for the week's Bible content across all kids.
// Default = Truth & Grace Memory Book Vol 1, Question 17 (Tom Ascol / Founders).
// Parent can override from the Teacher Dashboard, stored in localStorage.
//
// NOTE: Briana should verify the exact T&G Vol 1 Q17 text from your physical
//       copy and update it via the Teacher Dashboard if it differs from below.

export interface WeeklyCatechism {
  number: number;
  question: string;
  answer: string;
  reference: string;       // Scripture reference for the answer
  source: string;          // e.g. "Truth & Grace Vol 1, Q17"
}

export interface WeeklyVerse {
  text: string;
  reference: string;
  theme: string;           // short label e.g. "God's Care", "Salvation"
}

export interface WeeklyHymn {
  title: string;
  verse: string;           // just the first (or best) verse
  chorus?: string;
  author: string;
  year?: string;
  doctrine?: string;       // e.g. "Providence", "Grace"
}

export interface WeeklyCharacter {
  trait: string;           // e.g. "Humility"
  definition: string;      // adult definition
  kidFriendly: string;     // age 5-8 friendly
  toddlerFriendly: string; // age 3 friendly
  verse: string;
  reference: string;
}

export interface WeeklyCurriculum {
  weekLabel: string;       // e.g. "Week of May 26"
  catechism: WeeklyCatechism;
  verse: WeeklyVerse;
  hymn: WeeklyHymn;
  character: WeeklyCharacter;
}

// ── Default weekly content (T&G Vol 1, Q17) ──────────────────────────────────
// Catechism: "A Catechism for Boys and Girls" (Erroll Hulse / 1689 Confession)
// Used in Truth & Grace Memory Book Vol. 1 by Tom Ascol (Founders Press).
// Full catechism data lives in lib/catechism-boys-girls.ts (145 questions).
//
// Q17: "Of what were our first parents made?"
//       "God created Adam's body from earth and formed Eve from Adam's body."
//       Genesis 2:7, 22
//
// ⚠️  Briana: verify exact wording from your physical T&G Vol 1 book and
//     update via the Teacher Dashboard if it differs.

const DEFAULT_WEEKLY: WeeklyCurriculum = {
  weekLabel: "Week of June 8",

  catechism: {
    number: 17,
    question: "Of what were our first parents made?",
    answer: "God created Adam's body from earth and formed Eve from Adam's body.",
    reference: "Genesis 2:7, 22",
    source: "A Catechism for Boys and Girls (T&G Vol. 1), Q17",
  },

  verse: {
    text:
      "Then the Lord God formed the man of dust from the ground and breathed into his nostrils the breath of life, and the man became a living creature.",
    reference: "Genesis 2:7",
    theme: "Creation of Man",
  },

  hymn: {
    title: "Come, Thou Fount of Every Blessing",
    verse:
      "Come, thou fount of every blessing,\n" +
      "tune my heart to sing thy grace;\n" +
      "streams of mercy, never ceasing,\n" +
      "call for songs of loudest praise.",
    chorus:
      "Praise the mount! I'm fixed upon it,\n" +
      "mount of God's unchanging love.",
    author: "Robert Robinson",
    year: "1758",
    doctrine: "Grace / Sovereignty",
  },

  character: {
    trait: "Humility",
    definition:
      "Seeing yourself rightly before God, knowing He is great and we need His grace.",
    kidFriendly:
      "Humility means knowing God is the biggest and we need His help. It means not thinking we are better than others.",
    toddlerFriendly:
      "God is so big and so good. We love Him and say thank you!",
    verse: "God opposes the proud but gives grace to the humble.",
    reference: "James 4:6",
  },
};

// ── Accessor / mutator ────────────────────────────────────────────────────────
const STORAGE_KEY = "elc-weekly-curriculum";

export function getWeeklyCurriculum(): WeeklyCurriculum {
  if (typeof window === "undefined") return DEFAULT_WEEKLY;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_WEEKLY;
    const parsed = JSON.parse(raw) as Partial<WeeklyCurriculum>;
    // Deep-merge so partial overrides from parent dashboard work
    return {
      weekLabel: parsed.weekLabel ?? DEFAULT_WEEKLY.weekLabel,
      catechism: { ...DEFAULT_WEEKLY.catechism, ...(parsed.catechism ?? {}) },
      verse:     { ...DEFAULT_WEEKLY.verse,     ...(parsed.verse     ?? {}) },
      hymn:      { ...DEFAULT_WEEKLY.hymn,      ...(parsed.hymn      ?? {}) },
      character: { ...DEFAULT_WEEKLY.character, ...(parsed.character ?? {}) },
    };
  } catch {
    return DEFAULT_WEEKLY;
  }
}

export function saveWeeklyCurriculum(data: Partial<WeeklyCurriculum>): void {
  if (typeof window === "undefined") return;
  const current = getWeeklyCurriculum();
  const merged = {
    ...current,
    ...data,
    catechism: { ...current.catechism, ...(data.catechism ?? {}) },
    verse:     { ...current.verse,     ...(data.verse     ?? {}) },
    hymn:      { ...current.hymn,      ...(data.hymn      ?? {}) },
    character: { ...current.character, ...(data.character ?? {}) },
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
}

// ── Progress tracking ─────────────────────────────────────────────────────────
export interface BibleProgress {
  catechismMemorized: boolean;   // kid marked catechism as known
  verseMemorized: boolean;
  hymnLearned: boolean;
  lastPracticed: string | null;  // ISO date string
}

const BIBLE_PROGRESS_KEY = (kidId: string) => `elc-bible-progress-${kidId}`;

export function getBibleProgress(kidId: string): BibleProgress {
  if (typeof window === "undefined") {
    return { catechismMemorized: false, verseMemorized: false, hymnLearned: false, lastPracticed: null };
  }
  try {
    const raw = localStorage.getItem(BIBLE_PROGRESS_KEY(kidId));
    if (!raw) return { catechismMemorized: false, verseMemorized: false, hymnLearned: false, lastPracticed: null };
    return JSON.parse(raw) as BibleProgress;
  } catch {
    return { catechismMemorized: false, verseMemorized: false, hymnLearned: false, lastPracticed: null };
  }
}

export function updateBibleProgress(
  kidId: string,
  update: Partial<BibleProgress>
): void {
  if (typeof window === "undefined") return;
  const current = getBibleProgress(kidId);
  localStorage.setItem(
    BIBLE_PROGRESS_KEY(kidId),
    JSON.stringify({ ...current, ...update, lastPracticed: new Date().toISOString() })
  );
}
