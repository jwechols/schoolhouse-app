// Proxy: Schoolhouse client -> Homeward schoolhouse-today (today's lesson + done).
// Keeps HOMEWARD_WEBHOOK_SECRET server-side (same shared secret the existing
// /api/homeward-gig $2 payout proxy uses; Homeward reads it as
// ACADEMY_WEBHOOK_SECRET). Never errors the client: kids' lessons must not
// depend on Homeward being up.

import { NextRequest, NextResponse } from "next/server";

const HOMEWARD_URL = "https://homeward.echols.family/.netlify/functions/schoolhouse-today";
const KIDS = new Set(["truma", "titus", "mercy", "lois"]);

function str(v: unknown, max: number): string | null {
  return typeof v === "string" && v.trim() ? v.trim().slice(0, max) : null;
}

export async function POST(req: NextRequest) {
  const secret = process.env.HOMEWARD_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ ok: true, sent: false, reason: "not configured" });

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const kid = typeof body.kid === "string" ? body.kid.toLowerCase() : "";
  const kind = body.kind === "plan" || body.kind === "done" ? body.kind : null;
  if (!KIDS.has(kid) || !kind) {
    return NextResponse.json({ ok: false, error: "kid and kind (plan|done) required" }, { status: 400 });
  }

  const raw = body.lesson && typeof body.lesson === "object" ? (body.lesson as Record<string, unknown>) : null;
  const lesson = raw && str(raw.subject, 60) && str(raw.id, 120) && str(raw.title, 160)
    ? {
        subject: str(raw.subject, 60),
        subjectLabel: str(raw.subjectLabel, 60),
        id: str(raw.id, 120),
        title: str(raw.title, 160),
        emoji: str(raw.emoji, 16),
      }
    : null;
  if (kind === "done" && !lesson) {
    return NextResponse.json({ ok: false, error: "done needs a lesson" }, { status: 400 });
  }

  try {
    const res = await fetch(HOMEWARD_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${secret}` },
      body: JSON.stringify({
        kid,
        kind,
        atSchool: typeof body.atSchool === "boolean" ? body.atSchool : undefined,
        lesson,
      }),
    });
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.ok ? 200 : res.status });
  } catch (err) {
    console.error("[homeward-today] forward error:", err);
    return NextResponse.json({ ok: false, error: "forward failed" }, { status: 502 });
  }
}
