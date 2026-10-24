// node scripts/test-session-auth.mjs: the shared parent gate, its use
// everywhere, and the POST /api/session junk-row limit.
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { parentPinOk, pinEquals, PARENT_COOKIE } from "../lib/parent-auth.ts";
import { rateLimitOk, clientIp } from "../lib/rate-limit.ts";

const root = new URL("..", import.meta.url).pathname;
const read = (p) => readFileSync(join(root, p), "utf8");

// 1) The rule.
const env = { PARENT_PIN: "1234" };
assert.equal(PARENT_COOKIE, "ta-parent");
assert.equal(await parentPinOk(undefined, env), false, "no cookie -> denied");
assert.equal(await parentPinOk("", env), false, "empty cookie -> denied");
assert.equal(await parentPinOk("9999", env), false, "wrong PIN -> denied");
assert.equal(await parentPinOk("1234", env), true, "parent PIN -> allowed");
assert.equal(await parentPinOk("1234", { ...env, PARENT_AUTH_ENFORCE: "1" }), true, "enforce=1 + PIN -> allowed");
assert.equal(await parentPinOk(undefined, { ...env, PARENT_AUTH_ENFORCE: "1" }), false, "enforce=1, no cookie -> denied");
assert.equal(await parentPinOk(undefined, {}), false, "PARENT_PIN unset -> denied (fail closed)");
assert.equal(await parentPinOk(undefined, { PARENT_AUTH_ENFORCE: "0" }), true, "enforce=0 -> open (prod today, unchanged)");
assert.equal(await parentPinOk(undefined, { PARENT_AUTH_ENFORCE: "0", PARENT_PIN: "1234" }), true, "enforce=0 -> open even with PIN set");

// 1b) Constant-time compare: no === on the PIN, digests XOR'd with no early return.
assert.equal(await pinEquals("1234", "1234"), true, "same PIN -> equal");
assert.equal(await pinEquals("1235", "1234"), false, "different PIN -> not equal");
assert.equal(await pinEquals("12345", "1234"), false, "longer PIN -> not equal");
assert.equal(await pinEquals("", ""), false, "empty expected -> fail closed");
assert.equal(await pinEquals(undefined, undefined), false, "unset expected -> fail closed");
assert.equal(await pinEquals("", undefined), false, "empty vs unset -> fail closed");
assert.equal(await pinEquals(1234, "1234"), false, "non-string PIN (JSON number) -> not equal");
const pa = read("lib/parent-auth.ts");
assert.ok(/crypto\.subtle\.digest\("SHA-256"/.test(pa) && /diff \|= x\[i\] \^ y\[i\]/.test(pa), "pinEquals hashes then XORs");
assert.ok(!/pin === env\.PARENT_PIN/.test(pa), "parentPinOk has no === PIN compare");
const authSrc = read("app/api/auth/route.ts");
assert.ok(/pinEquals\(pin, process\.env\.PARENT_PIN\)/.test(authSrc) && !/pin === process\.env\.PARENT_PIN/.test(authSrc), "/api/auth parent compare is constant-time");
assert.ok(/await parentPinOk\(/.test(read("middleware.ts")), "middleware awaits the async gate");

// 2) No inline copies left: every parent check goes through lib/parent-auth.
function walk(dir, out = []) {
  for (const f of readdirSync(join(root, dir))) {
    const p = join(dir, f);
    if (statSync(join(root, p)).isDirectory()) walk(p, out);
    else if (/\.tsx?$/.test(f)) out.push(p);
  }
  return out;
}
const files = [...walk("app"), ...walk("components"), "middleware.ts"];
for (const f of files) {
  const src = read(f);
  assert.ok(!/PARENT_AUTH_ENFORCE/.test(src), `${f}: inline PARENT_AUTH_ENFORCE check`);
  assert.ok(!/["']ta-parent["']/.test(src), `${f}: inline ta-parent cookie read`);
  assert.ok(!/process\.env\.PARENT_PIN/.test(src) || f === "app/api/auth/route.ts", `${f}: inline PARENT_PIN compare`);
}
const gated = [
  "middleware.ts",
  "app/parent/page.tsx", "app/parent/words/page.tsx", "app/parent/reading/page.tsx",
  "app/parent/curriculum/page.tsx", "app/parent/practice-tests/page.tsx",
  "app/api/session/route.ts", "app/api/report/route.ts", "app/api/draft-lesson/route.ts",
  "app/api/word-lists/route.ts", "app/api/word-lists/extract/route.ts",
  "app/api/reading-assignments/route.ts", "app/api/curriculum-overrides/route.ts",
  "app/api/practice-tests/route.ts",
];
for (const f of gated) assert.ok(/from "@\/lib\/parent-auth"/.test(read(f)), `${f}: uses lib/parent-auth`);
const mw = read("middleware.ts");
assert.ok(/pathname\.startsWith\("\/parent"\) \|\| pathname\.startsWith\("\/teacher"\)/.test(mw), "middleware gates /parent and /teacher");
assert.ok(/pathname\.startsWith\("\/api\/auth"\)/.test(mw) && /pathname === "\/"/.test(mw), "PIN sign-in (/ and /api/auth) stays reachable");
assert.ok(/pathname\.startsWith\("\/kids\/"\)\) \{\s*return NextResponse\.next\(\)/.test(mw), "kid routes stay open");

// 3) GET /api/session gates before reading; POST is rate-limited, not signed-in.
const src = read("app/api/session/route.ts");
const get = src.slice(src.indexOf("export async function GET"));
const post = src.slice(src.indexOf("export async function POST"), src.indexOf("export async function GET"));
assert.ok(get.indexOf("isParent()") !== -1 && get.indexOf("isParent()") < get.indexOf("supabaseAdmin"), "GET gates before reading");
assert.ok(/status: 401/.test(get), "GET returns 401");
assert.ok(!/isParent|status: 401/.test(post), "POST needs no sign-in (kid logging)");
assert.ok(post.indexOf("rateLimitOk") !== -1 && post.indexOf("rateLimitOk") < post.indexOf("supabaseAdmin"), "POST limited before insert");
assert.ok(/status: 429/.test(post), "POST over limit -> 429");

// 4) The limiter.
const t0 = 1_000_000;
for (let i = 0; i < 60; i++) assert.equal(rateLimitOk("ip-a", 60, 600_000, t0 + i), true, `row ${i + 1} ok`);
assert.equal(rateLimitOk("ip-a", 60, 600_000, t0 + 61), false, "61st in window -> blocked");
assert.equal(rateLimitOk("ip-b", 60, 600_000, t0 + 62), true, "other IP unaffected");
assert.equal(rateLimitOk("ip-a", 60, 600_000, t0 + 600_000), true, "new window -> ok again");
assert.equal(clientIp(new Headers({ "x-nf-client-connection-ip": "1.2.3.4", "x-forwarded-for": "9.9.9.9" })), "1.2.3.4");
assert.equal(clientIp(new Headers({ "x-forwarded-for": "5.6.7.8, 10.0.0.1" })), "5.6.7.8");
assert.equal(clientIp(new Headers()), "unknown");

// 5) /progress says "Parents only" on 401 instead of the empty state.
const pv = read("components/ProgressView.tsx");
assert.ok(/status === 401/.test(pv) && /Parents only/.test(pv), "/progress shows Parents only on 401");

console.log("session-auth: all checks passed");
