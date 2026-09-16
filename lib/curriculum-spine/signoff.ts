"use client";

// Completed-lesson sign-off queue. When a child MASTERS a lesson (scores at or
// above the classical 80% threshold), a completion record is queued here so Mom
// can review it and sign off. Lessons below 80% are NOT queued, they must be
// reviewed and re-attempted first. localStorage for now (single device); this is
// the seam where we'd move to Supabase so Mom can sign off from her own phone.

import { MASTERY_PCT } from "./results";

export interface Signoff {
  kidId: string;
  subject: string;
  lessonId: string;
  lessonTitle: string;
  date: string; // ISO date the lesson was completed
  pct: number; // score on the mastery quiz
  correct: number;
  total: number;
  mastered: boolean; // pct >= MASTERY_PCT (always true once queued)
  signedOff: boolean;
  signedBy?: string;
  signedDate?: string;
}

const KEY = "spine-signoffs";
const recId = (x: { kidId: string; subject: string; lessonId: string; date: string }) =>
  `${x.kidId}|${x.subject}|${x.lessonId}|${x.date}`;

export function getSignoffs(): Signoff[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]") as Signoff[];
  } catch {
    return [];
  }
}

function save(all: Signoff[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEY, JSON.stringify(all));
  } catch {
    /* storage full / disabled, non-fatal */
  }
}

/** Queue a mastered lesson for Mom's review. No-op below the mastery threshold. */
export function queueSignoff(s: Omit<Signoff, "mastered" | "signedOff">): void {
  if (s.pct < MASTERY_PCT) return; // below 80% is not eligible for sign-off
  const all = getSignoffs();
  const rec: Signoff = { ...s, mastered: true, signedOff: false };
  const idx = all.findIndex((x) => recId(x) === recId(rec));
  if (idx >= 0) {
    // Preserve an existing sign-off if Mom already approved this exact record.
    all[idx] = { ...rec, signedOff: all[idx].signedOff, signedBy: all[idx].signedBy, signedDate: all[idx].signedDate };
  } else {
    all.unshift(rec);
  }
  save(all);
}

export function pendingSignoffs(): Signoff[] {
  return getSignoffs().filter((s) => !s.signedOff);
}

export function signOff(kidId: string, subject: string, lessonId: string, date: string, by: string): void {
  const all = getSignoffs();
  const rec = all.find(
    (s) => s.kidId === kidId && s.subject === subject && s.lessonId === lessonId && s.date === date,
  );
  if (rec) {
    rec.signedOff = true;
    rec.signedBy = by;
    rec.signedDate = new Date().toISOString().slice(0, 10);
    save(all);
  }
}
