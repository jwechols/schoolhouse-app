// Tiny per-IP fixed-window limiter, kept in function memory. It's best-effort
// (each warm Netlify function instance counts on its own), which is enough to
// stop a script from stuffing junk rows while a kid finishing drills never
// gets near it. No imports, so plain-node tests can use it.

type Bucket = { start: number; count: number };
const buckets = new Map<string, Bucket>();

export function rateLimitOk(
  key: string,
  limit: number,
  windowMs: number,
  now: number = Date.now(),
): boolean {
  const b = buckets.get(key);
  if (!b || now - b.start >= windowMs) {
    if (buckets.size > 5000) buckets.clear(); // keep memory bounded
    buckets.set(key, { start: now, count: 1 });
    return true;
  }
  b.count += 1;
  return b.count <= limit;
}

/** Best client IP on Netlify (x-nf-client-connection-ip), else first XFF hop. */
export function clientIp(headers: Headers): string {
  return (
    headers.get("x-nf-client-connection-ip") ||
    (headers.get("x-forwarded-for") ?? "").split(",")[0].trim() ||
    "unknown"
  );
}
