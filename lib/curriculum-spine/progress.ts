"use client";

import type { Course, SpineLesson } from "./types";
import { courseSequence } from "./types";

// localStorage-backed progress through the curriculum spine: which lessons each
// kid has completed per subject, and therefore where they are in the sequence.

const key = (kidId: string, subject: string) => `spine-progress-${kidId}-${subject}`;

export function completedLessonIds(kidId: string, subject: string): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    return new Set(JSON.parse(localStorage.getItem(key(kidId, subject)) ?? "[]") as string[]);
  } catch {
    return new Set();
  }
}

export function markLessonComplete(kidId: string, subject: string, lessonId: string): void {
  if (typeof window === "undefined") return;
  const done = completedLessonIds(kidId, subject);
  done.add(lessonId);
  try {
    localStorage.setItem(key(kidId, subject), JSON.stringify([...done]));
  } catch {
    /* storage full / disabled, non-fatal */
  }
}

export interface CourseProgress {
  done: number;
  total: number;
  pct: number;
  /** First not-yet-completed lesson in sequence, what to do next. */
  current: SpineLesson | null;
}

export function courseProgress(course: Course): CourseProgress {
  const seq = courseSequence(course);
  const done = completedLessonIds(course.kidId, course.subject);
  const doneCount = seq.filter((l) => done.has(l.id)).length;
  const current = seq.find((l) => !done.has(l.id)) ?? null;
  return {
    done: doneCount,
    total: seq.length,
    pct: seq.length ? Math.round((doneCount / seq.length) * 100) : 0,
    current,
  };
}
