// Pure form of the parent gate every protected route already uses: the
// ta-parent PIN cookie must equal PARENT_PIN, unless PARENT_AUTH_ENFORCE=0.
// Same rule as middleware.ts (/parent, /teacher), app/parent/page.tsx and the
// inline isParent() helpers in word-lists, practice-tests, reading-assignments
// and curriculum-overrides. No imports, so it can be tested with plain node.

export const PARENT_COOKIE = "ta-parent";

export function parentPinOk(
  pin: string | undefined,
  env: { PARENT_PIN?: string; PARENT_AUTH_ENFORCE?: string },
): boolean {
  if (env.PARENT_AUTH_ENFORCE === "0") return true;
  return !!env.PARENT_PIN && pin === env.PARENT_PIN;
}
