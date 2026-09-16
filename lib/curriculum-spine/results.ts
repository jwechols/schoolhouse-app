"use client";

// Per-lesson results so Briana can see HOW each child did (not just that they
// clicked through). Stored in localStorage, keyed by kid+subject, latest attempt
// per lesson.

export interface LessonResult {
  lessonId: string;
  date: string;    // ISO date the lesson was finished
  correct: number; // questions answered correctly
  total: number;   // graded questions answered
  pct: number;     // 0–100
  seconds: number; // time spent on the lesson
}

// Classical-school mastery threshold: at/above 80% = mastered; below 80% = not
// yet mastered (failing), the lesson must be reviewed and re-attempted before
// Mom signs off. This is the Echols family standard, not a generic pass line.
export const PASS_PCT = 80;
export const MASTERY_PCT = PASS_PCT; // canonical name going forward

const key = (kidId: string, subject: string) => `spine-results-${kidId}-${subject}`;

export function getResults(kidId: string, subject: string): Record<string, LessonResult> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(key(kidId, subject)) ?? "{}") as Record<string, LessonResult>;
  } catch {
    return {};
  }
}

export function saveResult(kidId: string, subject: string, r: LessonResult): void {
  if (typeof window === "undefined") return;
  const all = getResults(kidId, subject);
  all[r.lessonId] = r;
  try {
    localStorage.setItem(key(kidId, subject), JSON.stringify(all));
  } catch {
    /* storage full / disabled, non-fatal */
  }
}

/** Average score across all lessons the kid has results for in this subject. */
export function subjectAccuracy(kidId: string, subject: string): { avgPct: number; graded: number } {
  const all = Object.values(getResults(kidId, subject));
  const scored = all.filter((r) => r.total > 0);
  if (scored.length === 0) return { avgPct: 0, graded: 0 };
  const avg = Math.round(scored.reduce((s, r) => s + r.pct, 0) / scored.length);
  return { avgPct: avg, graded: scored.length };
}
