export interface TypingPassage {
  id: string;
  category: "verse" | "catechism" | "quote" | "history";
  source: string;
  text: string;
  wordCount: number;
}

export const TYPING_PASSAGES: TypingPassage[] = [
  // ── Bible verses ────────────────────────────────────────────────────────────
  {
    id: "ps19_1",
    category: "verse",
    source: "Psalm 19:1",
    text: "The heavens declare the glory of God; the skies proclaim the work of his hands.",
    wordCount: 14,
  },
  {
    id: "ps147_4",
    category: "verse",
    source: "Psalm 147:4",
    text: "He counts the stars and calls them each by name.",
    wordCount: 9,
  },
  {
    id: "prov1_7",
    category: "verse",
    source: "Proverbs 1:7",
    text: "The fear of the LORD is the beginning of wisdom; fools despise wisdom and instruction.",
    wordCount: 15,
  },
  {
    id: "prov22_6",
    category: "verse",
    source: "Proverbs 22:6",
    text: "Train up a child in the way he should go; even when he is old he will not depart from it.",
    wordCount: 18,
  },
  {
    id: "john1_1",
    category: "verse",
    source: "John 1:1",
    text: "In the beginning was the Word, and the Word was with God, and the Word was God.",
    wordCount: 16,
  },
  {
    id: "2tim3_16",
    category: "verse",
    source: "2 Timothy 3:16",
    text: "All Scripture is breathed out by God and profitable for teaching, for reproof, for correction, and for training in righteousness.",
    wordCount: 21,
  },
  {
    id: "rom8_28",
    category: "verse",
    source: "Romans 8:28",
    text: "And we know that for those who love God all things work together for good, for those who are called according to his purpose.",
    wordCount: 24,
  },
  {
    id: "ps23_1",
    category: "verse",
    source: "Psalm 23:1–3",
    text: "The LORD is my shepherd; I shall not want. He makes me lie down in green pastures. He leads me beside still waters.",
    wordCount: 23,
  },
  {
    id: "josh1_9",
    category: "verse",
    source: "Joshua 1:9",
    text: "Be strong and courageous. Do not be frightened, and do not be dismayed, for the LORD your God is with you wherever you go.",
    wordCount: 24,
  },
  // ── Catechism ───────────────────────────────────────────────────────────────
  {
    id: "wsc_q1",
    category: "catechism",
    source: "Westminster Shorter Catechism Q1",
    text: "What is the chief end of man? Man's chief end is to glorify God, and to enjoy him forever.",
    wordCount: 18,
  },
  {
    id: "wsc_q4",
    category: "catechism",
    source: "Westminster Shorter Catechism Q4",
    text: "What is God? God is a Spirit, infinite, eternal, and unchangeable, in his being, wisdom, power, holiness, justice, goodness, and truth.",
    wordCount: 23,
  },
  {
    id: "wsc_q14",
    category: "catechism",
    source: "Westminster Shorter Catechism Q14",
    text: "What is sin? Sin is any want of conformity unto, or transgression of, the law of God.",
    wordCount: 17,
  },
  {
    id: "wsc_q21",
    category: "catechism",
    source: "Westminster Shorter Catechism Q21",
    text: "Who is the Redeemer of God's elect? The only Redeemer of God's elect is the Lord Jesus Christ, who, being the eternal Son of God, became man.",
    wordCount: 28,
  },
  // ── Classical quotes ────────────────────────────────────────────────────────
  {
    id: "augustine",
    category: "quote",
    source: "Augustine of Hippo",
    text: "Our heart is restless until it finds its rest in Thee.",
    wordCount: 11,
  },
  {
    id: "luther_here",
    category: "quote",
    source: "Martin Luther, Diet of Worms",
    text: "Here I stand. I can do no other. God help me.",
    wordCount: 11,
  },
  {
    id: "chesterton",
    category: "quote",
    source: "G.K. Chesterton",
    text: "The Christian ideal has not been tried and found wanting. It has been found difficult and left untried.",
    wordCount: 18,
  },
  // ── History ─────────────────────────────────────────────────────────────────
  {
    id: "lincoln_gov",
    category: "history",
    source: "Abraham Lincoln, Gettysburg Address",
    text: "government of the people, by the people, for the people, shall not perish from the earth.",
    wordCount: 16,
  },
  {
    id: "declaration",
    category: "history",
    source: "Declaration of Independence, 1776",
    text: "We hold these truths to be self-evident, that all men are created equal, that they are endowed by their Creator with certain unalienable Rights.",
    wordCount: 26,
  },
  {
    id: "winthrop",
    category: "history",
    source: "John Winthrop, A Model of Christian Charity",
    text: "We shall be as a city upon a hill. The eyes of all people are upon us.",
    wordCount: 18,
  },
];
