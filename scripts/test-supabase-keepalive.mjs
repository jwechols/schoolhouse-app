// node scripts/test-supabase-keepalive.mjs: checks the keep-alive request shape.
import assert from "node:assert/strict";
import { keepaliveRequest, config } from "../netlify/functions/supabase-keepalive.mjs";

const env = { NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co/", NEXT_PUBLIC_SUPABASE_ANON_KEY: "anon" };
const r = keepaliveRequest(env);
assert.equal(r.url, "https://example.supabase.co/rest/v1/truma_sessions?select=id&limit=1");
assert.equal(r.headers.apikey, "anon");
assert.ok(/limit=1/.test(r.url), "one row only");
assert.deepEqual(keepaliveRequest({ ...env, SUPABASE_KEEPALIVE_OFF: "1" }), { skip: "off" });
assert.deepEqual(keepaliveRequest({}), { skip: "not-configured" });
assert.ok(!("SUPABASE_SERVICE_ROLE_KEY" in r.headers));
assert.equal(config.schedule, "0 14 * * *");
console.log("supabase-keepalive: all checks passed");
