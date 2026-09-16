/**
 * Money split, give / save / spend allocation with mandatory minimums.
 *
 * Stewardship first (JM, 2026-07-10): the Old Testament tithe is not binding law on the
 * new-covenant believer, but our family sets a floor of generosity and thrift:
 *   - GIVE  >= 10%  (to Colonial Bible Church)
 *   - SAVE  >= 20%  (to Greenlight savings, settled at the weekly payday)
 *   - SPEND <= 70%  (the remainder; the ONLY portion usable for TV time / on-demand)
 *
 * A kid may voluntarily choose to give MORE and/or save MORE (which lowers spend), but
 * never less than the floors, and never more spend than the max. The split is applied at
 * the coin level when coins are earned, so a child cannot spend the whole week on TV
 * without first giving and saving. "Honor the Lord with your wealth and with the
 * firstfruits of all your produce" (Proverbs 3:9).
 *
 * This module is pure allocation + per-kid config. It does not itself move money; the
 * weekly payday (not live until payday goes online) settles Save/Give into Greenlight.
 */

export const GIVE_DESTINATION = "Colonial Bible Church";
export const SAVE_DESTINATION = "Greenlight savings";

export const MIN_GIVE_PCT = 10;
export const MIN_SAVE_PCT = 20;
export const MAX_SPEND_PCT = 100 - MIN_GIVE_PCT - MIN_SAVE_PCT; // 70

export interface SplitConfig {
  /** Percent of each earning that goes to giving. Floor MIN_GIVE_PCT. */
  givePct: number;
  /** Percent of each earning that goes to saving. Floor MIN_SAVE_PCT. */
  savePct: number;
}

/** The family default: the minimums (maximum spend allowed). */
export const DEFAULT_SPLIT: SplitConfig = {
  givePct: MIN_GIVE_PCT,
  savePct: MIN_SAVE_PCT,
};

/** Short stewardship note per category, for UI copy. */
export const SPLIT_COPY = {
  give: `Give first, to ${GIVE_DESTINATION}. "Honor the Lord with the firstfruits" (Proverbs 3:9).`,
  save: `Save for later, the wise store up (Proverbs 21:20).`,
  spend: `Spend wisely, TV time and on-demand, with gratitude.`,
} as const;

function splitKey(kidId: string) {
  return `elc-money-split-${kidId}`;
}

/**
 * Clamp a proposed config to the family rules: give and save may only go UP from the
 * floors, and together may not exceed 100 (spend may not go negative). Spend can never
 * rise above MAX_SPEND_PCT because the floors are fixed minimums.
 */
export function clampSplit(cfg: SplitConfig): SplitConfig {
  let givePct = Math.max(MIN_GIVE_PCT, Math.round(cfg.givePct));
  let savePct = Math.max(MIN_SAVE_PCT, Math.round(cfg.savePct));
  // Never let give+save exceed 100 (that would make spend negative).
  if (givePct + savePct > 100) {
    // Preserve the larger voluntary intent proportionally; simplest: cap save.
    savePct = Math.max(MIN_SAVE_PCT, 100 - givePct);
    if (givePct + savePct > 100) givePct = 100 - savePct;
  }
  return { givePct, savePct };
}

export function spendPct(cfg: SplitConfig): number {
  return 100 - cfg.givePct - cfg.savePct;
}

/** Read a kid's chosen split (their voluntary give/save more), clamped to the floors. */
export function getSplit(kidId: string): SplitConfig {
  if (typeof window === "undefined") return DEFAULT_SPLIT;
  try {
    const raw = localStorage.getItem(splitKey(kidId));
    if (!raw) return DEFAULT_SPLIT;
    return clampSplit(JSON.parse(raw));
  } catch {
    return DEFAULT_SPLIT;
  }
}

/** Persist a kid's voluntary split. Always clamped so the floors cannot be undercut. */
export function setSplit(kidId: string, cfg: SplitConfig): SplitConfig {
  const clamped = clampSplit(cfg);
  if (typeof window !== "undefined") {
    localStorage.setItem(splitKey(kidId), JSON.stringify(clamped));
  }
  return clamped;
}

export interface Allocation {
  give: number;
  save: number;
  spend: number;
}

/**
 * Split a whole-coin earning into give / save / spend, honoring the config. Give and save
 * are rounded to whole coins and spend takes the remainder, so the three always sum back
 * to the original amount and the giving/saving floors are met.
 */
export function allocate(coins: number, cfg: SplitConfig = DEFAULT_SPLIT): Allocation {
  const safe = Math.max(0, Math.floor(coins));
  const give = Math.round((safe * cfg.givePct) / 100);
  const save = Math.round((safe * cfg.savePct) / 100);
  const spend = Math.max(0, safe - give - save);
  return { give, save, spend };
}
