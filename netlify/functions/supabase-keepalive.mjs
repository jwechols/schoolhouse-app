// supabase-keepalive.mjs: daily tiny read so the free-tier Supabase project
// never sits idle long enough to auto-pause (Supabase pauses free projects
// after 7 days with no activity; it paused on 2026-10-22).
//
// One GET, limit=1, one column, on truma_sessions (defined in schema.sql). With
// the anon key RLS returns zero rows, but Postgres still runs the query, which
// is what counts as activity.
// Uses the public anon key (least privilege), never the service role. Read-only:
// it never writes. Logs the HTTP status only, never the URL or key.
//
// Kill switch: set SUPABASE_KEEPALIVE_OFF=1 in Netlify env to skip.
// Schedule: every day at 14:00 UTC (9 AM CT in CDT, 8 AM CT in CST).

export function keepaliveRequest(env) {
  if (env.SUPABASE_KEEPALIVE_OFF === "1") return { skip: "off" };
  const url = (env.NEXT_PUBLIC_SUPABASE_URL || "").trim().replace(/\/+$/, "");
  const key = (env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "").trim();
  if (!url || !key) return { skip: "not-configured" };
  return {
    url: url + "/rest/v1/truma_sessions?select=id&limit=1",
    headers: { apikey: key, Authorization: "Bearer " + key },
  };
}

export default async () => {
  const req = keepaliveRequest(process.env);
  if (req.skip) {
    console.log("[supabase-keepalive] skipped:", req.skip);
    return new Response(JSON.stringify({ ok: true, skipped: req.skip }), { status: 200 });
  }
  try {
    const res = await fetch(req.url, { method: "GET", headers: req.headers, signal: AbortSignal.timeout(15000) });
    await res.arrayBuffer().catch(() => null);
    console.log("[supabase-keepalive] status", res.status);
    return new Response(JSON.stringify({ ok: res.ok, status: res.status }), { status: 200 });
  } catch (e) {
    console.log("[supabase-keepalive] failed:", (e && e.name) || "error");
    return new Response(JSON.stringify({ ok: false, error: (e && e.name) || "error" }), { status: 200 });
  }
};

export const config = { schedule: "0 14 * * *" };
