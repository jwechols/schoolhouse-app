"use client";

// homeward-today.ts: tell Homeward what today's Schoolhouse lesson is and when
// the kid finishes it (option A, JM 2026-10-23). Homeward shows it on the
// Hearth kid cards, the kids' phone Next card and the /jm Schoolhouse card.
//
// kidToday() stays the ONE source of truth for "today's lesson". It depends on
// this device's spine progress (localStorage) and Briana's course overrides,
// so Homeward does not try to recompute it; we report the result.
//
// Routes through /api/homeward-today (server proxy) so the shared secret never
// reaches the browser. Fire-and-forget: every failure is silent and never
// blocks a lesson. Separate from lib/homeward.ts, which carries the $2 Work
// payout (academy-gig) and is left untouched.

import { getCourse } from "@/lib/curriculum-spine";
import { kidToday, type NextLesson } from "@/lib/today-plan";
import { todayCT } from "@/lib/now-ct";

export interface TodayLesson {
  subject: string;
  subjectLabel: string | null;
  id: string;
  title: string;
  emoji: string | null;
}

type Kind = "plan" | "done";

function post(body: { kid: string; kind: Kind; atSchool?: boolean; lesson: TodayLesson | null }): void {
  try {
    void fetch("/api/homeward-today", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      keepalive: true,
    }).catch(() => {});
  } catch {
    /* never fatal */
  }
}

function fromNext(l: NextLesson | null): TodayLesson | null {
  if (!l) return null;
  return { subject: l.subject, subjectLabel: l.subjectLabel ?? null, id: l.id, title: l.title, emoji: l.emoji ?? null };
}

/** Report kidToday() for one kid. Sent at most once per kid per day per answer
 *  (deduped in localStorage), so opening the hub ten times costs one call. */
export function reportPlanToHomeward(kidId: string): void {
  if (typeof window === "undefined") return;
  try {
    const t = kidToday(kidId);
    const lesson = fromNext(t.lesson);
    const sig = `${todayCT()}|${t.atSchool ? "school" : lesson ? lesson.id : "none"}`;
    const key = `hw-today-plan-${kidId}`;
    if (localStorage.getItem(key) === sig) return;
    post({ kid: kidId, kind: "plan", atSchool: t.atSchool, lesson });
    localStorage.setItem(key, sig);
  } catch {
    /* storage disabled, etc: never fatal */
  }
}

/** Report the spine lesson the kid just completed (call right after
 *  markLessonComplete). Homeward keeps the first one of the day. */
export function reportLessonDoneToHomeward(
  kidId: string,
  subject: string,
  lesson: { id: string; title: string },
): void {
  if (typeof window === "undefined") return;
  try {
    const course = getCourse(kidId, subject);
    post({
      kid: kidId,
      kind: "done",
      lesson: {
        subject,
        subjectLabel: course?.subjectLabel ?? null,
        id: lesson.id,
        title: lesson.title,
        emoji: course?.emoji ?? null,
      },
    });
  } catch {
    /* never fatal */
  }
}
