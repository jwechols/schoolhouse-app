import type { Course, SpineLesson } from "./types";

// The single "ready" gate for kid-facing lessons (JM 2026-10-23: hide outlines and
// half-built content until it is built out). A lesson is ready only when it has
// teaching text, an authored interactive teaching script, and a mastery quiz, the
// same "complete" bar scripts/authoring-status.mjs reports. Nothing is deleted:
// filling a lesson in (in code or via Briana's overrides) un-hides it automatically.
export function isLessonReady(l: SpineLesson | null | undefined): boolean {
  if (!l) return false;
  const teach = typeof l.teach === "string" && l.teach.trim().length > 0;
  const interactive = Array.isArray(l.interactive) && l.interactive.length > 0;
  const quiz = Array.isArray(l.quiz) && l.quiz.length > 0;
  return teach && interactive && quiz;
}

/** Course with only ready lessons; units with none dropped; null when nothing is ready. */
export function readyCourse(c: Course | null | undefined): Course | null {
  if (!c) return null;
  const units = c.units
    .map((u) => ({ ...u, lessons: u.lessons.filter(isLessonReady) }))
    .filter((u) => u.lessons.length > 0);
  if (units.length === 0) return null;
  const ids = new Set(units.flatMap((u) => u.lessons.map((l) => l.id)));
  const placement = c.placement?.filter((p) => ids.has(p.throughLessonId));
  return { ...c, units, placement: placement && placement.length ? placement : undefined };
}
