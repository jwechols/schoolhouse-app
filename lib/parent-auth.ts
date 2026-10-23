// The one parent gate. Every parent page, parent API and middleware.ts use it,
// instead of the ~12 copies that used to live inline.
//
// Rule: the ta-parent cookie (set by POST /api/auth after the parent PIN) must
// equal PARENT_PIN. PARENT_AUTH_ENFORCE="0" turns the gate off (current prod);
// any other value, or unset, enforces it. It fails closed: if PARENT_PIN is
// unset, nobody passes (the PIN sign-in can't succeed then either, so this
// locks out no one who could sign in before).
//
// parentPinOk has no imports so middleware (edge) and plain-node tests can use
// it. isParent() reads the request cookies on the server.

export const PARENT_COOKIE = "ta-parent";

export function parentPinOk(
  pin: string | undefined,
  env: Record<string, string | undefined>,
): boolean {
  if (env.PARENT_AUTH_ENFORCE === "0") return true;
  return !!env.PARENT_PIN && pin === env.PARENT_PIN;
}

/** Server components and route handlers: is this request a signed-in parent? */
export async function isParent(): Promise<boolean> {
  const { cookies } = await import("next/headers");
  const c = await cookies();
  return parentPinOk(c.get(PARENT_COOKIE)?.value, process.env);
}
