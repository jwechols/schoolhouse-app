import type { Course } from "./types";
import { mergeCourse } from "./override-cache";
// Titus (3rd grade)
import { TITUS_MATH } from "./titus-math";
import { TITUS_GRAMMAR } from "./titus-grammar";
import { TITUS_LITERATURE } from "./titus-literature";
import { TITUS_BIBLE } from "./titus-bible";
import { TITUS_SCIENCE } from "./titus-science";
import { TITUS_HISTORY } from "./titus-history";
import { TITUS_LOGIC } from "./titus-logic";
import { TITUS_MONEY } from "./titus-money";
import { TITUS_HOME } from "./titus-home";
import { TITUS_GUNSAFETY } from "./titus-gunsafety";
import { TITUS_FISHING } from "./titus-fishing";
import { TITUS_ENGINEERING } from "./titus-engineering";
import { TITUS_DOGTRAINING } from "./titus-dogtraining";
// Mercy (Kindergarten)
import { MERCY_PHONICS } from "./mercy-phonics";
import { MERCY_COUNTING } from "./mercy-counting";
import { MERCY_BIBLE } from "./mercy-bible";
import { MERCY_SCIENCE } from "./mercy-science";
import { MERCY_HISTORY } from "./mercy-history";
import { MERCY_MONEY } from "./mercy-money";
import { MERCY_HOME } from "./mercy-home";
import { MERCY_GUNSAFETY } from "./mercy-gunsafety";
// Lois (Pre-K)
import { LOIS_ABC } from "./lois-abc";
import { LOIS_NUMBERS } from "./lois-numbers";
import { LOIS_BIBLE } from "./lois-bible";
import { LOIS_LOGIC } from "./lois-logic";
import { LOIS_MONEY } from "./lois-money";
import { LOIS_HOME } from "./lois-home";
import { LOIS_GUNSAFETY } from "./lois-gunsafety";
// Truma (6th grade)
import { TRUMA_PREALGEBRA } from "./truma-prealgebra";
import { TRUMA_WRITING } from "./truma-writing";
import { TRUMA_LITERATURE } from "./truma-literature";
import { TRUMA_HISTORY } from "./truma-history";
import { TRUMA_SCIENCE } from "./truma-science";
import { TRUMA_MONEY } from "./truma-money";
import { TRUMA_HOME } from "./truma-home";
import { TRUMA_GUNSAFETY } from "./truma-gunsafety";

// Every authored course registers here. One file per kid+subject.
export const COURSES: Course[] = [
  TITUS_MATH, TITUS_GRAMMAR, TITUS_LITERATURE, TITUS_BIBLE, TITUS_SCIENCE, TITUS_HISTORY, TITUS_LOGIC, TITUS_MONEY, TITUS_HOME, TITUS_GUNSAFETY, TITUS_FISHING, TITUS_ENGINEERING, TITUS_DOGTRAINING,
  MERCY_PHONICS, MERCY_COUNTING, MERCY_BIBLE, MERCY_SCIENCE, MERCY_HISTORY, MERCY_MONEY, MERCY_HOME, MERCY_GUNSAFETY,
  LOIS_ABC, LOIS_NUMBERS, LOIS_BIBLE, LOIS_LOGIC, LOIS_MONEY, LOIS_HOME, LOIS_GUNSAFETY,
  TRUMA_PREALGEBRA, TRUMA_WRITING, TRUMA_LITERATURE, TRUMA_HISTORY, TRUMA_SCIENCE, TRUMA_MONEY, TRUMA_HOME, TRUMA_GUNSAFETY,
];

// ── Raw (code-only) accessors ────────────────────────────────────────────────
// The editor needs the untouched code lessons so Briana can see the original
// alongside her changes. Kid-facing code should use the merged accessors below.
export function coursesForKidRaw(kidId: string): Course[] {
  return COURSES.filter((c) => c.kidId === kidId);
}

export function getCourseRaw(kidId: string, subject: string): Course | undefined {
  return COURSES.find((c) => c.kidId === kidId && c.subject === subject);
}

// ── Merged accessors (what the kids see) ─────────────────────────────────────
// Briana's overrides from the cache are layered on top. When no overrides exist
// (or the cache is empty), these return the code courses unchanged.
export function coursesForKid(kidId: string): Course[] {
  return coursesForKidRaw(kidId).map(mergeCourse);
}

export function getCourse(kidId: string, subject: string): Course | undefined {
  const c = getCourseRaw(kidId, subject);
  return c ? mergeCourse(c) : undefined;
}

export * from "./types";
export * from "./override-cache";
