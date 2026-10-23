// node scripts/test-session-auth.mjs: checks the parent gate used by GET /api/session.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { parentPinOk, PARENT_COOKIE } from "../lib/parent-auth.ts";

const env = { PARENT_PIN: "1234" };
assert.equal(PARENT_COOKIE, "ta-parent");
assert.equal(parentPinOk(undefined, env), false, "no cookie -> denied");
assert.equal(parentPinOk("", env), false, "empty cookie -> denied");
assert.equal(parentPinOk("9999", env), false, "wrong PIN -> denied");
assert.equal(parentPinOk("1234", env), true, "parent PIN -> allowed");
assert.equal(parentPinOk(undefined, {}), false, "PARENT_PIN unset -> denied (fail closed)");
assert.equal(parentPinOk(undefined, { PARENT_AUTH_ENFORCE: "0" }), true, "enforce off -> open, matches other routes");

// The route must check auth before it touches Supabase, and POST must stay open.
const src = readFileSync(new URL("../app/api/session/route.ts", import.meta.url), "utf8");
const get = src.slice(src.indexOf("export async function GET"));
const post = src.slice(src.indexOf("export async function POST"), src.indexOf("export async function GET"));
assert.ok(get.indexOf("parentPinOk") !== -1 && get.indexOf("parentPinOk") < get.indexOf("supabaseAdmin"), "GET gates before reading");
assert.ok(/status: 401/.test(get), "GET returns 401");
assert.ok(!/parentPinOk|status: 401/.test(post), "POST stays open for kid logging");
console.log("session-auth: all checks passed");
