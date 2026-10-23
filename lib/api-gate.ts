// api-gate.ts: cheap gate for the server proxies that forward to Homeward with
// the shared secret (/api/homeward-gig mints coins, /api/homeward-today
// records lesson status). Critic B3, 2026-10-23.
//
// 1. Same-origin: Origin (or Referer when Origin is absent) must be this app:
//    schoolhouse.echols.family, learning.echols.family, echols-academy.netlify.app
//    or one of its deploy URLs (<id>--echols-academy.netlify.app), plus the
//    runtime URL/DEPLOY_URL/DEPLOY_PRIME_URL when Netlify provides them.
//    Browsers always send Origin on a POST fetch (same-origin included), so
//    the in-app callers pass. This stops other sites from driving the relay
//    through a visitor's browser. It is NOT authentication: a script can forge
//    headers, which is what the rate limit is for.
// 2. Rate limit: fixed window per bucket + client IP + kid, held in memory.
//    Per function instance (resets on cold start), which is enough to stop a
//    loop hammering one kid without adding a store.

import { NextRequest, NextResponse } from "next/server";

const SITE = "echols-academy";
const HOSTS = new Set(["schoolhouse.echols.family", "learning.echols.family", `${SITE}.netlify.app`]);
const DEPLOY_HOST = new RegExp(`^[a-z0-9-]+--${SITE}\\.netlify\\.app$`);

function hostOf(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    return new URL(url).host.toLowerCase();
  } catch {
    return null;
  }
}

function envHosts(): string[] {
  return [process.env.URL, process.env.DEPLOY_URL, process.env.DEPLOY_PRIME_URL]
    .map((u) => hostOf(u))
    .filter((h): h is string => !!h);
}

export function allowedHost(host: string | null): boolean {
  if (!host) return false;
  if (HOSTS.has(host) || DEPLOY_HOST.test(host) || envHosts().includes(host)) return true;
  if (process.env.NODE_ENV !== "production" && /^(localhost|127\.0\.0\.1)(:\d+)?$/.test(host)) return true;
  return false;
}

export function sameOrigin(req: NextRequest): boolean {
  const origin = req.headers.get("origin");
  if (origin && origin !== "null") return allowedHost(hostOf(origin));
  return allowedHost(hostOf(req.headers.get("referer")));
}

function clientIp(req: NextRequest): string {
  return (
    req.headers.get("x-nf-client-connection-ip") ||
    (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() ||
    "unknown"
  );
}

type Hit = { start: number; n: number };
const hits = new Map<string, Hit>();

/** True when this bucket/ip/kid is still under `max` calls per `windowMs`. */
export function underLimit(key: string, max: number, windowMs: number, now = Date.now()): boolean {
  if (hits.size > 5000) {
    for (const [k, h] of hits) if (now - h.start > windowMs) hits.delete(k);
  }
  const h = hits.get(key);
  if (!h || now - h.start > windowMs) {
    hits.set(key, { start: now, n: 1 });
    return true;
  }
  h.n += 1;
  return h.n <= max;
}

/** null = allowed; otherwise the 403/429 response to return. */
export function gateProxy(
  req: NextRequest,
  bucket: string,
  kid: string,
  max: number,
  windowMs = 10 * 60 * 1000,
): NextResponse | null {
  if (!sameOrigin(req)) {
    return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
  }
  if (!underLimit(`${bucket}|${clientIp(req)}|${kid || "-"}`, max, windowMs)) {
    return NextResponse.json({ ok: false, error: "slow down" }, { status: 429 });
  }
  return null;
}

/** Test hook. */
export function _resetGateForTests(): void {
  hits.clear();
}
