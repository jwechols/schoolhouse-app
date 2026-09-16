// ── Briana's lesson overrides (the merge layer) ──────────────────────────────
// The curriculum spine lives in code (one file per kid+subject). This layer lets
// Briana TUNE that content to the kids' real schoolbooks without a code deploy:
// she can edit any lesson, flag it (matches our book / skip / needs work), and
// author her own lessons. Her changes are stored in Supabase and merged on top
// of the code lessons here.
//
// This module is intentionally pure and client-safe (no Supabase import) so the
// existing kid components can keep calling getCourse()/courseSequence()
// synchronously. The overrides are fetched server-side in the root layout and
// seeded into this module cache by <CurriculumProvider> BEFORE the kid
// components render, so edits are live on first paint.

import type { Course, SpineLesson } from "./types";

export interface LessonOverride {
  /** Target lesson id for an edit, or a generated id for a custom lesson. */
  lessonId: string;
  kidId: string;
  subject: string;
  /** Which unit a custom lesson belongs to (defaults to the first unit). */
  unitId?: string | null;
  isCustom?: boolean;
  /** Briana's flag for this lesson. "skip" hides it from the kid's sequence. */
  status?: "matches" | "skip" | "needs_work" | null;
  /** Freeform note to JM (e.g. "our book does long division differently"). */
  note?: string | null;
  /** Partial SpineLesson fields Briana changed (existing lessons). */
  patch?: Partial<SpineLesson> | null;
  /** Entire SpineLesson (custom lessons Briana authored). */
  fullLesson?: SpineLesson | null;
  /** Ordering for custom lessons within their unit. */
  sortOrder?: number | null;
}

// Module-level cache, keyed by `${kidId}|${subject}`. Seeded once from the
// server; can be re-seeded on the client after a parent saves an edit.
let CACHE: Record<string, LessonOverride[]> = {};
let VERSION = 0;

const ck = (kidId: string, subject: string) => `${kidId}|${subject}`;

export function seedOverrideCache(rows: LessonOverride[] | null | undefined): void {
  const next: Record<string, LessonOverride[]> = {};
  for (const r of rows ?? []) {
    (next[ck(r.kidId, r.subject)] ??= []).push(r);
  }
  CACHE = next;
  VERSION++;
}

export function overrideCacheVersion(): number {
  return VERSION;
}

export function overridesFor(kidId: string, subject: string): LessonOverride[] {
  return CACHE[ck(kidId, subject)] ?? [];
}

/** Look up a single override by lesson id (used by the editor to prefill). */
export function overrideForLesson(
  kidId: string,
  subject: string,
  lessonId: string,
): LessonOverride | undefined {
  return overridesFor(kidId, subject).find((o) => o.lessonId === lessonId);
}

/**
 * Apply Briana's overrides to a code-defined course, producing the effective
 * course the kids actually see: edits patched in, "skip" lessons removed,
 * custom lessons inserted into their unit. Pure and synchronous.
 */
export function mergeCourse(course: Course): Course {
  const ov = overridesFor(course.kidId, course.subject);
  if (ov.length === 0) return course;

  const byId = new Map(ov.map((o) => [o.lessonId, o]));
  const firstUnitId = course.units[0]?.id;

  const units = course.units.map((u) => {
    // Patch or drop existing lessons.
    const kept: SpineLesson[] = [];
    for (const l of u.lessons) {
      const o = byId.get(l.id);
      if (o?.status === "skip") continue; // hidden from the kid
      kept.push(o?.patch ? { ...l, ...stripBlank(o.patch) } : l);
    }

    // Insert Briana's custom lessons that belong to this unit.
    const customs = ov
      .filter(
        (o) =>
          o.isCustom &&
          o.fullLesson &&
          (o.unitId ?? firstUnitId) === u.id &&
          o.status !== "skip",
      )
      .sort((a, b) => (a.sortOrder ?? Number.MAX_SAFE_INTEGER) - (b.sortOrder ?? Number.MAX_SAFE_INTEGER))
      .map((o) => o.fullLesson as SpineLesson);

    return { ...u, lessons: [...kept, ...customs] };
  });

  return { ...course, units };
}

// Only apply provided, non-empty fields so a patch never blanks out real
// content by accident.
function stripBlank<T extends object>(o: T): Partial<T> {
  const out: Partial<T> = {};
  for (const k in o) {
    const v = (o as Record<string, unknown>)[k];
    if (v === undefined || v === null) continue;
    if (typeof v === "string" && v.trim() === "") continue;
    if (Array.isArray(v) && v.length === 0) continue;
    (out as Record<string, unknown>)[k] = v;
  }
  return out;
}
