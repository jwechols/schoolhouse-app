// The one parent gate. Every parent page, parent API and middleware.ts use it,
// instead of the ~12 copies that used to live inline.
//
// Rule: the ta-parent cookie (set by POST /api/auth after the parent PIN) must
// equal PARENT_PIN. PARENT_AUTH_ENFORCE="0" turns the gate off (current prod);
// any other value, or unset, enforces it. It fails closed: if PARENT_PIN is
// unset, nobody passes (the PIN sign-in can't succeed then either, so this
// locks out no one who could sign in before).
//
// parentPinOk and pinEquals have no imports (Web Crypto is global in edge and
// Node) so middleware, the Node /api/auth route and plain-node tests share them.
// isParent() reads the request cookies on the server.

export const PARENT_COOKIE = "ta-parent";

/**
 * Constant-time PIN compare. SHA-256 both strings (fixed 32-byte digests, so
 * length never short-circuits), then XOR every byte with no early return.
 * Fails closed: an unset or empty expected PIN never matches.
 */
export async function pinEquals(
  given: string | undefined,
  expected: string | undefined,
): Promise<boolean> {
  const enc = new TextEncoder();
  const ok = typeof given === "string"; // JSON can send a number; never coerce
  const [a, b] = await Promise.all([
    crypto.subtle.digest("SHA-256", enc.encode(ok ? given : "")),
    crypto.subtle.digest("SHA-256", enc.encode(expected ?? "")),
  ]);
  const x = new Uint8Array(a);
  const y = new Uint8Array(b);
  let diff = 0;
  for (let i = 0; i < 32; i++) diff |= x[i] ^ y[i];
  return diff === 0 && ok && !!expected;
}

export async function parentPinOk(
  pin: string | undefined,
  env: Record<string, string | undefined>,
): Promise<boolean> {
  if (env.PARENT_AUTH_ENFORCE === "0") return true;
  return pinEquals(pin, env.PARENT_PIN);
}

/** Server components and route handlers: is this request a signed-in parent? */
export async function isParent(): Promise<boolean> {
  const { cookies } = await import("next/headers");
  const c = await cookies();
  return parentPinOk(c.get(PARENT_COOKIE)?.value, process.env);
}
