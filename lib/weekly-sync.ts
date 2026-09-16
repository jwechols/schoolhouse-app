"use client";

import { getWeeklyCurriculum, saveWeeklyCurriculum, type WeeklyCurriculum } from "@/lib/weekly-curriculum";

// Pulls the auto-composed week from /api/weekly (church bulletin + catechism
// progression) and merges it into the localStorage copy every component reads.
// Throttled: checks at most once per hour per device, the server side is
// blob-cached per week, so even the miss is cheap.

const SYNC_STAMP_KEY = "elc-weekly-synced-at";
const SYNC_TTL_MS = 60 * 60 * 1000;

export async function syncWeeklyCurriculum(force = false): Promise<WeeklyCurriculum | null> {
  if (typeof window === "undefined") return null;
  try {
    const last = Number(localStorage.getItem(SYNC_STAMP_KEY) ?? 0);
    if (!force && Date.now() - last < SYNC_TTL_MS) return null;

    const res = await fetch("/api/weekly");
    if (!res.ok) return null;
    const data = (await res.json()) as Partial<WeeklyCurriculum> & { _meta?: { composed?: boolean } };
    if (!data?.catechism?.question || !data?.verse?.text) return null;
    // Server marks fully-composed weeks; don't overwrite good content with a
    // fallback payload, and don't stamp the throttle so we retry soon.
    if (!data._meta?.composed) return null;

    saveWeeklyCurriculum(data);
    localStorage.setItem(SYNC_STAMP_KEY, String(Date.now()));
    return getWeeklyCurriculum();
  } catch {
    return null; // offline or API down, the localStorage copy keeps working
  }
}
