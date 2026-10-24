// homeward.ts, fire-and-forget gig credit to Homeward family economy.
// Routes through /api/homeward-gig (server-side proxy) so the shared secret
// never reaches the browser bundle. Silently no-ops on any error.

/** Lesson length tier → coins in Homeward: quick=4 ($1), standard=12 ($3), deep=20 ($5). */
export type LessonTier = "quick" | "standard" | "deep";

/** Per-tier metadata, single source of truth for the length menu + coin celebrations.
 *  Coins mirror Homeward's ACADEMY_TIER_CENTS (100/300/500 at 4 coins/$). */
export const TIER_META: Record<LessonTier, { coins: number; minutes: number; label: string; emoji: string }> = {
  quick:    { coins: 4,  minutes: 15, label: "Quick",    emoji: "⚡" },
  standard: { coins: 12, minutes: 30, label: "Standard", emoji: "📗" },
  deep:     { coins: 20, minutes: 60, label: "Deep",     emoji: "📚" },
};

/** Map a session length (minutes) to its coin tier. Used when a tier isn't passed explicitly. */
export function tierForDuration(minutes: number): LessonTier {
  if (minutes <= 18) return "quick";
  if (minutes <= 38) return "standard";
  return "deep";
}

export interface LessonReport {
  kid: string;
  subject: string;
  lessonId: string;
  minutesEarned: number;
  lessonTitle?: string;
  /** Coin tier for the length the kid chose. Homeward defaults to "standard" if absent. */
  tier?: LessonTier;
}

export interface CreditResult { credited: boolean; reason?: string; /** Dollars credited (Homeward coins / 4; $2 fallback). */ dollars?: number | null }

/** JM's set Schoolhouse pay per lesson, used when Homeward doesn't return an amount. */
export const DEFAULT_LESSON_DOLLARS = 2;

/** "+$2 earned!" style money label. */
export function formatDollars(d: number | null | undefined): string {
  const v = typeof d === "number" && d > 0 ? d : DEFAULT_LESSON_DOLLARS;
  return "$" + (Number.isInteger(v) ? String(v) : v.toFixed(2));
}

/** True when Homeward refused credit because the kid hit the daily lesson cap
 *  (Homeward #427 reason: "daily lesson cap reached"). Tolerant match. */
export function isDailyCap(r: CreditResult | null | undefined): boolean {
  return !!r && r.credited !== true && /cap/i.test(String(r.reason ?? ""));
}

/** Returns Homeward's verdict, or null on network error / non-ok. Never throws. */
export async function reportLessonToHomeward(report: LessonReport): Promise<CreditResult | null> {
  try {
    const res = await fetch("/api/homeward-gig", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(report),
    });
    if (!res.ok) {
      console.warn("[homeward] gig proxy returned", res.status);
      return null;
    }
    const data = (await res.json().catch(() => null)) as { credited?: unknown; reason?: unknown; coins?: unknown } | null;
    if (!data || typeof data !== "object") return null;
    return {
      credited: data.credited === true,
      reason: typeof data.reason === "string" ? data.reason : undefined,
      // Homeward answers coins at 4 coins per dollar; show kids dollars.
      dollars: data.credited !== true ? null : typeof data.coins === "number" && data.coins > 0 ? data.coins / 4 : DEFAULT_LESSON_DOLLARS,
    };
  } catch (err) {
    // Network failure is never fatal, lesson still shows as complete
    console.warn("[homeward] gig proxy failed:", err);
    return null;
  }
}

// Format a subject key into a human-readable lesson title.
// e.g. "singapore-math" → "Singapore Math"
export function subjectToTitle(subject: string): string {
  return subject
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

// Build a stable daily lessonId: kid + subject + date.
// Homeward deduplicates on this, one credit per subject per kid per day.
export function dailyLessonId(kid: string, subject: string): string {
  const today = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  const dateKey = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;
  return `${kid}-${subject}-${dateKey}`;
}
