import { nowCTWeekday } from "./now-ct";

/**
 * Truma, Titus, and Mercy attend outside school part-time; Lois is home every
 * day. On a kid's own outside-school day, Schoolhouse doesn't hand them a new
 * lesson — see AtSchoolToday.tsx / LessonRouter.tsx.
 *
 * Days are JS Date#getDay() convention: Sun=0, Mon=1, Tue=2, Wed=3, Thu=4,
 * Fri=5, Sat=6. Always resolved against the real America/Chicago wall clock
 * (nowCTWeekday), never local machine time or UTC.
 */
const OUTSIDE_SCHOOL_DAYS: Record<string, number[]> = {
  // Titus: Brookside Academy, Monday through Thursday, all day.
  titus: [1, 2, 3, 4],
  // Mercy: Midland Classical Academy, Tuesday and Thursday all day, plus
  // Friday morning. Schoolhouse has no morning/afternoon lesson granularity
  // today, so Friday is treated as a full outside-school day for simplicity.
  mercy: [2, 4, 5],
  // Truma: Midland Classical Academy, Tuesday and Thursday, all day.
  truma: [2, 4],
  // Lois is home every day; no outside-school days at all.
  lois: [],
};

/** True when `kidId` is at their outside school right now (Central time).
 *  Kids with no schedule entry (or an unrecognized id) are always home. */
export function isOutsideSchoolToday(kidId: string, weekday: number = nowCTWeekday()): boolean {
  return (OUTSIDE_SCHOOL_DAYS[kidId] ?? []).includes(weekday);
}
