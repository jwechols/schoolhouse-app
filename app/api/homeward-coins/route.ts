// Proxy for Homeward's kid-coins read-back. Keeps HOMEWARD_WEBHOOK_SECRET
// server-side; the client fetches /api/homeward-coins?kid=<id> and never sees it.
// Homeward is the single family coin ledger; Schoolhouse only displays it.

import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic"; // always live, never cached

const HOMEWARD_BASE =
  "https://homeward.echols.family/.netlify/functions/family-economy";

export async function GET(req: NextRequest) {
  const secret = process.env.HOMEWARD_WEBHOOK_SECRET;
  if (!secret) {
    // Not configured → tell the client to fall back gracefully.
    return NextResponse.json({ ok: false, configured: false });
  }

  const kid = req.nextUrl.searchParams.get("kid") ?? "";
  const url = new URL(HOMEWARD_BASE);
  url.searchParams.set("action", "kid-coins");
  url.searchParams.set("secret", secret);
  if (kid) url.searchParams.set("kid", kid);

  try {
    const res = await fetch(url.toString(), {
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.ok ? 200 : res.status });
  } catch (err) {
    console.error("[homeward-coins] fetch failed:", err);
    return NextResponse.json({ ok: false, error: "fetch failed" }, { status: 502 });
  }
}
