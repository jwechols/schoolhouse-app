// Proxy endpoint, keeps HOMEWARD_WEBHOOK_SECRET server-side.
// Academy frontend POSTs here; this function forwards to Homeward with the secret.

import { NextRequest, NextResponse } from "next/server";

const HOMEWARD_URL =
  "https://homeward.echols.family/.netlify/functions/family-economy";

export async function POST(req: NextRequest) {
  const secret = process.env.HOMEWARD_WEBHOOK_SECRET;
  if (!secret) {
    // Not configured, return ok so the client never errors out
    return NextResponse.json({ ok: true, credited: false, reason: "not configured" });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { kid, subject, lessonId, minutesEarned, lessonTitle, tier } = body;
  if (!kid || !lessonId || typeof minutesEarned !== "number") {
    return NextResponse.json({ error: "kid, lessonId, and minutesEarned required" }, { status: 400 });
  }

  try {
    const res = await fetch(HOMEWARD_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "academy-gig",
        secret,
        kid,
        subject,
        lessonId,
        minutesEarned,
        lessonTitle,
        tier,
      }),
    });

    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.ok ? 200 : res.status });
  } catch (err) {
    console.error("[homeward-gig] forward error:", err);
    return NextResponse.json({ ok: false, error: "forward failed" }, { status: 502 });
  }
}
