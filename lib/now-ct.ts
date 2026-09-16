// Central time, always, per the family's hard rule: every day-boundary check
// gates on the real America/Chicago wall clock, never a bare UTC Date. Using
// Intl with an explicit IANA zone (not a fixed UTC-6 offset) keeps this correct
// across daylight saving automatically.

const DAY_KEY_FORMATTER = new Intl.DateTimeFormat("en-CA", {
  timeZone: "America/Chicago",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

/** Today's date in Central time, as YYYY-MM-DD. Use this instead of
 *  `new Date().toISOString().slice(0, 10)`, which is UTC and rolls over
 *  a day early after 7pm Central. */
export function todayCT(): string {
  // en-CA locale formats as YYYY-MM-DD directly, no reassembly needed.
  return DAY_KEY_FORMATTER.format(new Date());
}

/** Full Central-time wall-clock parts for the current instant, when a caller
 *  needs more than just the day key (hour-of-day gating, etc). */
export function nowCTParts(): { year: number; month: number; day: number; hour: number; minute: number } {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value ?? 0);
  return { year: get("year"), month: get("month"), day: get("day"), hour: get("hour"), minute: get("minute") };
}

const WEEKDAY_FORMATTER = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/Chicago",
  weekday: "short",
});

const WEEKDAY_INDEX: Record<string, number> = {
  Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6,
};

/** Day of week in Central time, Sun=0 through Sat=6 (matches Date#getDay's
 *  convention, but computed from the real America/Chicago wall clock instead
 *  of the machine's local time or UTC). Use this for any "which day is it"
 *  schedule check, never `new Date().getDay()`. */
export function nowCTWeekday(): number {
  const short = WEEKDAY_FORMATTER.format(new Date());
  return WEEKDAY_INDEX[short] ?? new Date().getDay();
}
