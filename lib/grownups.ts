// ── Grown-Ups learning hub ──────────────────────────────────────────────────
// John-Mark and Briana as self-directed adult learners. Separate from the KidId
// union on purpose — the kids' app machinery never needs to know about these.

export type GrownupId = "jm" | "briana";

export interface GrownupProfile {
  id: GrownupId;
  name: string;        // card label the kids see
  fullName: string;    // real name
  sub: string;         // small line under the name
  emoji: string;       // decorative only
  color: string;       // earthy accent
  colorDark: string;   // heading / hover
  soft: string;        // light tint for wells & cards
}

export const GROWNUPS: Record<GrownupId, GrownupProfile> = {
  jm: {
    id: "jm",
    name: "Dad",
    fullName: "John-Mark",
    sub: "Learning by choice",
    emoji: "📖",
    color: "#727E4E",     // olive
    colorDark: "#545F36",
    soft: "#EEF0E2",
  },
  briana: {
    id: "briana",
    name: "Mom",
    fullName: "Briana",
    sub: "Learning by choice",
    emoji: "🌿",
    color: "#8A5A72",     // warm plum-rose, grown-up
    colorDark: "#6E4459",
    soft: "#F1E9EE",
  },
};

export const GROWNUPS_ORDER: GrownupId[] = ["jm", "briana"];

// ── Survey option sets ───────────────────────────────────────────────────────
// Suggested categories — chips to spark ideas, not a fixed menu. Free text always wins.
export const TOPIC_IDEAS: string[] = [
  "Bible & Theology",
  "Church History",
  "A language",
  "History",
  "A practical skill",
  "Health & the body",
  "Money & finance",
  "Music & the arts",
  "Science & nature",
  "Business & ministry",
  "Homemaking",
  "Parenting",
  "Technology",
];

export const LEVELS = [
  { id: "new",   label: "New to it",        hint: "Start from the beginning" },
  { id: "some",  label: "Know a little",    hint: "Fill in the gaps" },
  { id: "solid", label: "Pretty solid",     hint: "Go past the basics" },
] as const;

export const DEPTHS = [
  { id: "overview", label: "Quick overview", hint: "The big picture" },
  { id: "working",  label: "Working knowledge", hint: "Enough to use it" },
  { id: "deep",     label: "Go deep",        hint: "Really master it" },
] as const;

export const TIMES = [
  { id: "10", label: "~10 min" },
  { id: "20", label: "~20 min" },
  { id: "30", label: "30+ min" },
] as const;

export const FORMATS = [
  { id: "read",        label: "Read it",          emoji: "📄" },
  { id: "interactive", label: "Interactive Q&A",  emoji: "✋" },
  { id: "listen",      label: "Listen (audio)",   emoji: "🎧" },
] as const;

export type LevelId  = (typeof LEVELS)[number]["id"];
export type DepthId  = (typeof DEPTHS)[number]["id"];
export type TimeId   = (typeof TIMES)[number]["id"];
export type FormatId = (typeof FORMATS)[number]["id"];

// ── Survey data shape ────────────────────────────────────────────────────────
export interface LearningWish {
  topic: string;
  why: string;
  level: LevelId;
  depth: DepthId;
}

export interface GrownupSurvey {
  person: GrownupId;
  submittedAt: string;         // ISO
  topics: LearningWish[];
  timePerSitting: TimeId;
  formats: FormatId[];
  resources: string;           // specific books / passages
  notes: string;               // anything else
}

// Answers live server-side only (private, passcode-gated). No localStorage —
// a shared family iPad means device storage is not private between spouses.

// The payload persisted per person (survey minus identity/passcode).
export type SurveyPayload = Omit<GrownupSurvey, "person">;
