/**
 * reset.ts, wipe all ELC progress data from localStorage.
 *
 * Called when a parent wants a completely fresh start for all kids.
 * Covers every key written by the app, XP, levels, coins, catechism mastery,
 * adaptive data, AI covered-topics, typing history, Bible stars, assessments,
 * duties, Truma's test/drill history, and the ScamWelcome "seen" flag (so the
 * family gets to enjoy the joke again on next visit).
 *
 * Does NOT clear browser settings, service-worker cache, or cookie storage.
 */

const KID_IDS = ["titus", "mercy", "lois", "truma"];

// Prefixes / exact keys that belong to this app
const EXACT_KEYS: string[] = [
  // Truma-specific
  "ta-stats",
  "ta-daily",
  "truma-drill-history",
  "truma-topic-mastery",   // ← catechism items marked "memorized"
  "truma-test-history",
  "truma-typing-history",
  "truma-mathfacts-history",
  "truma-mathfacts-best",
  "truma-tutor-sessions",
  // Titus-specific
  "titus-typing-history",
  "titus-mathfacts-history",
  "titus-sound-pref",
  "titus-reduced-motion",
  // Mercy-specific
  "mercy-typing-level",
  // Lois-specific
  "lois-bible-stars",
  // Global
  "elc-weekly-curriculum",
  "elc-official-notice-v2", // ScamWelcome seen flag, reset so the joke fires again
];

// Per-kid key patterns
const KID_KEY_TEMPLATES = [
  (id: string) => `elc-progress-${id}`,
  (id: string) => `fa-stats-${id}`,
  (id: string) => `elc-rewards-${id}`,
  (id: string) => `elc-coupons-${id}`,
  (id: string) => `elc-adaptive-${id}`,
  (id: string) => `elc-bible-progress-${id}`,
  (id: string) => `assessment-${id}`,
];

/** Prefixes, any key starting with these is cleared */
const PREFIX_PATTERNS = [
  "elc_covered_",       // AI question covered-topics: elc_covered_{kid}_{subject}
  "elc-duties-",        // daily duties: elc-duties-{kid}-{date}
  "elc-last-",          // last-played tracking: elc-last-{kid}-{game}
  "truma-subject-",     // Truma subject progress: truma-subject-{id}
];

/**
 * Wipe all ELC progress data from localStorage.
 * @returns the number of keys removed
 */
export function resetAllProgress(): number {
  if (typeof window === "undefined") return 0;

  const toRemove: string[] = [];

  // Exact keys
  for (const key of EXACT_KEYS) {
    toRemove.push(key);
  }

  // Per-kid exact keys
  for (const id of KID_IDS) {
    for (const tpl of KID_KEY_TEMPLATES) {
      toRemove.push(tpl(id));
    }
  }

  // Prefix-matched keys, scan all localStorage keys
  const allKeys: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k) allKeys.push(k);
  }
  for (const k of allKeys) {
    if (PREFIX_PATTERNS.some((p) => k.startsWith(p))) {
      toRemove.push(k);
    }
  }

  // Deduplicate and remove
  const unique = [...new Set(toRemove)];
  let removed = 0;
  for (const key of unique) {
    if (localStorage.getItem(key) !== null) {
      localStorage.removeItem(key);
      removed++;
    }
  }

  return removed;
}
