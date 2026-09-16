// ── Curriculum Spine ──────────────────────────────────────────────────────────
// The structured scope & sequence that makes Schoolhouse a real homeschool
// curriculum (used supplementally for the Echols kids). Each kid+subject is a
// Course: an ordered set of Units, each an ordered set of Lessons. The AI tutor
// teaches the CURRENT lesson's objective (so lessons follow the sequence instead
// of being random), and the parent "Plan" view reads this spine to show Briana
// exactly where each kid is and what comes next.
//
// Grounded in the MCA / Memoria Press classical-Christian model, see
// docs/mca-curriculum-research.md. Grammar stage = memory work + facts.

/** One authored mastery-quiz question. Kept simple and multiple-choice so it
 *  can be scored deterministically (no AI grading) and reviewed by Mom. */
export interface QuizQuestion {
  /** The question shown to the child. */
  prompt: string;
  /** Answer options. */
  choices: string[];
  /** Index into `choices` of the correct answer. */
  correctIndex: number;
  /** Shown after the child answers, to teach into the mistake or confirm. */
  explanation?: string;
}

export interface SpineLesson {
  /** Stable id, e.g. "titus-math-u2-l3". Used for progress tracking. */
  id: string;
  /** Kid-facing title, e.g. "Multiplying by 3s". */
  title: string;
  /** What the child should learn, this DRIVES the AI tutor for this lesson. */
  objective: string;
  /** 2–5 sentences of real teaching content: how to explain it, the key idea,
   *  a worked example. This is what makes it substantive, not rinky-dink. */
  teach: string;
  /** Memory work to lock in this lesson (catechism Q, verse, math fact chant,
   *  Latin vocab, timeline fact, poem line). Grammar stage lives here. */
  memoryWork?: string;
  /** A worked example shown on the readout so the child SEES the idea done,
   *  not just hears about it. Newlines render as separate steps. */
  workedExample?: string;
  /** Authored mastery-quiz questions. When present, the lesson runs as a real
   *  taught lesson (readout → quiz → 80% mastery → Mom sign-off) instead of the
   *  AI-improvised conductor. Absent → falls back to the AI tutor. */
  quiz?: QuizQuestion[];
  /** Authored interactive teaching script (teach → try → respond). When present,
   *  TaughtLesson plays these beats instead of auto-deriving beats from `teach`/
   *  `workedExample`/`memoryWork`, so the lesson actively teaches rather than
   *  narrating. The `quiz` still runs afterward as the graded mastery check.
   *  Absent → falls back to the paced sentence-by-sentence readout. */
  interactive?: LessonBeat[];
  /** Optional seed to steer generated practice for this lesson. */
  practiceFocus?: string;
  /** Coin tier this lesson pays in Homeward when completed: quick=4 ($1),
   *  standard=12 ($3), deep=20 ($5). Authored lessons carry their own tier by
   *  size; omit to default to "standard". AI-conductor lessons take the tier the
   *  child picks in the length menu instead. */
  tier?: "quick" | "standard" | "deep";
}

/** ── Interactive lesson beats ─────────────────────────────────────────────────
 *  An authored, LLM-free teaching script that makes a lesson actually TEACH
 *  (teach → try → respond) instead of reading a wall of text aloud. When a
 *  SpineLesson carries an `interactive` array, TaughtLesson runs these beats in
 *  order; the child taps through teaching beats and answers "your turn" checks
 *  with immediate authored encouragement. No AI is needed for the core rhythm,
 *  so it is instant and free. The graded mastery `quiz` still runs afterward.
 *
 *  Every beat's spoken line (`say`, plus `onRight`/`onWrong` for `try` beats) is
 *  pre-baked to a static audio file by scripts/prebake-audio.mjs, so playback is
 *  instant with no OpenAI round-trip. useTTS falls back to live synthesis for any
 *  line that has not been baked yet. Keep spoken lines stable once baked. */
export type LessonBeat =
  | {
      /** Tutor teaches one idea. */
      kind: "teach";
      /** Shown on screen (may include a couple of short lines). */
      text: string;
      /** Spoken aloud. Defaults to `text` when omitted. Author the tutor's warm
       *  voice here (e.g. Lydia greeting Truma on the first beat). */
      say?: string;
      /** Optional big picture for this beat (emoji or short picto string). Shown
       *  large, and extra-large for the littles who cannot read yet. */
      visual?: string;
    }
  | {
      /** A worked-example step the child SEES done. */
      kind: "example";
      text: string;
      say?: string;
      /** Optional big picture shown with the example. */
      visual?: string;
    }
  | {
      /** Memory work to lock in. */
      kind: "memory";
      text: string;
      say?: string;
      /** Optional big picture shown with the memory beat. */
      visual?: string;
    }
  | {
      /** "Your turn", a low-stakes, tap-to-answer check right after teaching an
       *  idea. Scored deterministically; feedback is authored, not AI. */
      kind: "try";
      /** The question shown to the child. */
      prompt: string;
      /** Spoken aloud when the check appears. Defaults to `prompt`. */
      say?: string;
      /** Tap options. */
      choices: string[];
      /** Index of the correct choice. */
      correctIndex: number;
      /** Warm confirmation shown + spoken on a correct tap. */
      onRight: string;
      /** Gentle re-teach shown + spoken on a wrong tap (child can try again). */
      onWrong: string;
      /** Optional short visual scaffold shown with the check (e.g. a factor-pair
       *  ladder). Newlines render as separate lines. */
      visual?: string;
    };

/** One placement probe. Listed in curriculum order (easiest first). Answering it
 *  correctly demonstrates the child has mastery THROUGH `throughLessonId`, so the
 *  placement assessment can start them at the right spot instead of lesson one. */
export interface PlacementProbe {
  prompt: string;
  choices: string[];
  correctIndex: number;
  throughLessonId: string;
}

export interface SpineUnit {
  id: string;
  /** e.g. "Unit 2: Multiplication Facts". */
  title: string;
  /** One-line summary of the unit for the parent plan. */
  summary: string;
  lessons: SpineLesson[];
}

export interface Course {
  kidId: string;        // "titus" | "mercy" | "lois" | "truma"
  subject: string;      // matches lib/kids.ts subject ids (e.g. "math", "phonics")
  subjectLabel: string; // display, e.g. "Math"
  emoji: string;
  gradeLabel: string;   // e.g. "3rd Grade"
  /** Trivium stage this course is pitched at. */
  stage: "grammar" | "logic" | "rhetoric";
  /** What this course covers over the year, shown atop the parent plan. */
  overview: string;
  units: SpineUnit[];
  /** Optional placement probes (curriculum order) so a child can be met where
   *  they are: the assessment marks everything through their level complete and
   *  starts them at the next lesson. */
  placement?: PlacementProbe[];
}

/** Total lesson count across a course (helper for the plan view). */
export function courseLessonCount(c: Course): number {
  return c.units.reduce((n, u) => n + u.lessons.length, 0);
}

/** Flatten a course to an ordered lesson list (the "sequence"). */
export function courseSequence(c: Course): SpineLesson[] {
  return c.units.flatMap((u) => u.lessons);
}
