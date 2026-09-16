export type KidId = "titus" | "mercy" | "lois";

export interface GameConfig {
  id: string;
  label: string;
  emoji: string;
  description: string;
}

export interface KidProfile {
  id: KidId;
  name: string;
  age: number;
  grade: string;
  school: string;
  emoji: string;
  colorHex: string;
  uiSize: "normal" | "large" | "xlarge";
  maxChoices: 3 | 4;
  games: GameConfig[];
  subjects: string[];       // subjects that have lesson/curriculum content
  tutorEnabled: boolean;    // whether AI tutor chat is available
  // ── Per-kid visual theme ──────────────────────────────────────────────────
  bgGradient: string;       // CSS background for hub page
  accentColor: string;      // ELC brand accent that complements colorHex
  themeEmoji: string;       // decorative personality emoji
  tutorName: string;        // tutor character name
  tutorEmoji: string;       // tutor character emoji
  // ── TFE earthy palette (used by new landing / teacher station UI) ─────────
  color: string;            // earthy accent (e.g. #6B7A45)
  colorDark: string;        // darker shade for headings / hover
  soft: string;             // light tint for avatar wells & card backgrounds
}

export const KIDS: Record<KidId, KidProfile> = {
  titus: {
    id: "titus",
    name: "Titus",
    age: 8,
    grade: "3rd Grade",
    school: "Brookside Academy",
    emoji: "🎣",
    colorHex: "#2563eb",
    // ── Trailblazer's Sky, clean + high-contrast, ADHD-friendly ──────────
    bgGradient: "linear-gradient(180deg, #e8f4ff 0%, #d6eaff 55%, #e8f4ff 100%)",
    accentColor: "#4E9A28",
    themeEmoji: "🎣",
    tutorName: "Buck",
    tutorEmoji: "🦌",
    color: "#6B7A45",
    colorDark: "#545F36",
    soft: "#EEF0E2",
    uiSize: "normal",
    maxChoices: 4,
    subjects: ["math", "grammar", "science", "history", "bible", "theology", "literature", "logic", "worldview", "wilderness", "money", "home", "gunsafety", "fishing", "engineering", "dogtraining"],
    tutorEnabled: true,
    games: [
      { id: "math",        label: "Math",         emoji: "✖️",  description: "Times tables 2–5" },
      { id: "mathfacts",     label: "Math Facts",     emoji: "⚡",  description: "×÷+− speed drills" },
      { id: "wordproblems", label: "Word Problems", emoji: "🎣",  description: "Hunting & fishing math stories" },
      { id: "grammar",     label: "Grammar",      emoji: "📝",  description: "Parts of speech & more" },
      { id: "science",     label: "Science",      emoji: "🔬",  description: "Life cycles & food chains" },
      { id: "history",     label: "History",      emoji: "🏛️",  description: "American history" },
      { id: "theology",    label: "Theology",     emoji: "🕊️",  description: "Catechism for Boys & Girls" },
      { id: "literature",  label: "Literature",   emoji: "📜",  description: "Aesop's Fables & Greek myths" },
      { id: "bible",       label: "Bible",        emoji: "✝️",  description: "Parables & key stories" },
      { id: "logic",       label: "Logic",        emoji: "🧠",  description: "Syllogisms, fallacies & right thinking" },
      { id: "worldview",   label: "Worldview",    emoji: "🌍",  description: "No neutrality, every idea has a king" },
      { id: "handwriting", label: "Handwriting",  emoji: "✏️",  description: "Words & sentences" },
      { id: "typing",      label: "Typing",       emoji: "⌨️",  description: "Home row words, build speed" },
    ],
  },

  mercy: {
    id: "mercy",
    name: "Mercy",
    age: 5,
    grade: "Kindergarten",
    school: "Midland Classical Academy",
    emoji: "🌸",
    // ── Mercy copies Truma's rose-gold aesthetic, brighter + younger ────────
    colorHex: "#D4508A",
    bgGradient: "linear-gradient(160deg, #fff2f8 0%, #fddaed 55%, #fff2f8 100%)",
    accentColor: "#C4A020",       // gold, matching Truma's sister energy
    themeEmoji: "🌸",
    tutorName: "Princess Rose",
    tutorEmoji: "🌹",
    color: "#A86A78",
    colorDark: "#844F5C",
    soft: "#F6EBEE",
    uiSize: "large",
    maxChoices: 3,
    subjects: ["counting", "phonics", "bible", "theology", "literature", "science", "history", "logic", "worldview", "money", "home", "gunsafety"],
    tutorEnabled: true,
    games: [
      { id: "counting",    label: "Counting",         emoji: "🔢", description: "Count to 20" },
      { id: "mathfacts",   label: "Adding & Taking",  emoji: "➕", description: "Add & subtract to 20" },
      { id: "phonics",     label: "Phonics",          emoji: "🔤", description: "Letters & sounds" },
      { id: "sightwords",  label: "Reading",          emoji: "📚", description: "Sight words, read & match" },
      { id: "shapes",      label: "Shapes & Colors",  emoji: "🔵", description: "Shapes and colors" },
      { id: "addition",    label: "Adding",           emoji: "✨", description: "Add to 10" },
      { id: "theology",    label: "Theology",         emoji: "🕊️", description: "Catechism for Boys & Girls" },
      { id: "literature",  label: "Literature",       emoji: "📜", description: "Aesop's Fables & stories" },
      { id: "science",     label: "Science",          emoji: "🌿", description: "The world God made" },
      { id: "history",     label: "History",          emoji: "🏛️", description: "Long ago, pyramids & castles" },
      { id: "bible",       label: "Bible",            emoji: "📖", description: "God's love and Jesus" },
      { id: "logic",       label: "Logic",            emoji: "🧩", description: "Patterns, sorting & because-why" },
      { id: "worldview",   label: "Worldview",        emoji: "🌱", description: "God's big story, creation to new creation" },
      { id: "handwriting", label: "Handwriting",      emoji: "✏️", description: "Letters & words" },
      { id: "typing",      label: "Typing",           emoji: "⌨️", description: "Find the letter on the keyboard" },
    ],
  },

  lois: {
    id: "lois",
    name: "Lois",
    age: 3,
    grade: "Pre-K",
    school: "Home",
    emoji: "👑",
    // ── Princess Palace, ultra girly, fuchsia + lavender + sparkle ─────────
    colorHex: "#C026D3",          // vivid fuchsia/violet, maximum princess
    bgGradient: "linear-gradient(160deg, #fdf0ff 0%, #f5d6ff 50%, #fff0ff 100%)",
    accentColor: "#F472B6",       // hot pink accent
    themeEmoji: "👑",
    tutorName: "Princess Crystal",
    tutorEmoji: "❄️",
    color: "#8A6A92",
    colorDark: "#6A5070",
    soft: "#F0EAF2",
    uiSize: "xlarge",
    maxChoices: 3,
    subjects: ["abc", "numbers", "colors", "shapes", "bible", "theology", "literature", "logic", "worldview", "money", "home", "gunsafety"],
    tutorEnabled: true,
    games: [
      { id: "abc",         label: "ABC's",       emoji: "🔤", description: "Letters A–Z" },
      { id: "numbers",     label: "Numbers",     emoji: "🔢", description: "Count 1–5" },
      { id: "colors",      label: "Colors",      emoji: "🎨", description: "Red, blue, yellow…" },
      { id: "shapes",      label: "Shapes",      emoji: "⭐", description: "Circle, square…" },
      { id: "theology",    label: "Theology",    emoji: "🕊️", description: "God made me!" },
      { id: "literature",  label: "Literature",  emoji: "📜", description: "Fun animal stories" },
      { id: "bible",       label: "Bible",       emoji: "📖", description: "God loves me!" },
      { id: "logic",       label: "Thinking",    emoji: "🐾", description: "What goes together? What comes next?" },
      { id: "worldview",   label: "God's World", emoji: "✨", description: "Everything belongs to God!" },
      { id: "handwriting", label: "Handwriting", emoji: "✏️", description: "Capital letters A-Z" },
      { id: "typing",      label: "Typing",      emoji: "⌨️", description: "Press keys and watch letters fall!" },
    ],
  },
};

export const KIDS_ORDER: KidId[] = ["titus", "mercy", "lois"];

// ── Truma earthy theme fields (matches KidProfile color/colorDark/soft pattern) ─
export const TRUMA_EARTHY = {
  color:     "#3F6E72",
  colorDark: "#2F565A",
  soft:      "#E8EEEE",
  bg:        "linear-gradient(160deg, #fbf8ef 0%, #e8eeee 55%, #fbf8ef 100%)",
  avatar:    "🌷",
  tutorName: "Lydia",
  tutorEmoji:"🪻",
  level: 12, xp: 740, xpMax: 1000, streak: 9,
  grade: "6th Grade",
};

// ── Truma's theme, teal-forward, rose accent, mixed & stylish ───────────────
// She's a teal girl. Rose is present but not dominant. Think ocean + bloom.
export const TRUMA_THEME = {
  primary:      "#0BABB9",   // teal, her main color
  primaryDark:  "#088490",   // deeper teal for hover
  primaryLight: "#E4F8FA",   // soft teal tint for backgrounds/cards
  gold:         "#C8820E",   // warm honey gold
  goldLight:    "#F0A830",   // bright amber
  // page bg shifts from teal-white to blush-white, her mixed palette feel
  bg:           "linear-gradient(160deg, #edfcfd 0%, #fef2f7 40%, #eafbfc 75%, #fdf5f9 100%)",
  bgCard:       "#FFFFFF",
  bgCardHover:  "#f0fbfc",
  border:       "rgba(11,171,185,0.2)",
  borderSoft:   "rgba(11,171,185,0.1)",
  text:         "#0B2830",   // deep teal-ink, readable on white
  textMuted:    "rgba(11,40,48,0.5)",
  textGold:     "#965A00",
  teal:         "#0BABB9",   // teal = primary
  rose:         "#C94878",   // rose accent, stylish pop, not the star
  roseLight:    "#FCE8F0",   // soft blush wash for cards
};

// ── All learner IDs (Truma included) ────────────────────────────────────────
export const ALL_LEARNER_IDS = ["truma", "titus", "mercy", "lois"] as const;

// Name/emoji lookup for all learners (for ParentDashboard, TeacherStation)
export const ALL_LEARNER_NAMES: Record<string, { name: string; emoji: string }> = {
  truma: { name: "Truma", emoji: "🌷" },
  titus: { name: "Titus", emoji: "🎣" },
  mercy: { name: "Mercy", emoji: "🌹" },
  lois:  { name: "Lois",  emoji: "👑" },
};
