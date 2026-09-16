/**
 * Netlify serverless function, forwards events to Home Assistant.
 *
 * Keeps the HA webhook URL server-side (never exposed to the client).
 * Fails gracefully when HA_WEBHOOK_BASE_URL is not configured, the
 * app still works, it just doesn't talk to HA yet.
 *
 * Event types:
 *   coins_earned  , kid completed a round, coins added
 *   screentime_request, kid tapped "Start Screen Time"
 *   duties_complete, kid marked all duties done
 *   payout        , parent marked coins as paid out
 */

import { NextRequest, NextResponse } from "next/server";

const HA_BASE = process.env.HA_WEBHOOK_BASE_URL; // e.g. https://xxx.ui.nabu.casa

// Webhook IDs configured in HA automations.yaml
const WEBHOOK_IDS: Record<string, string> = {
  coins_earned:        "elc_coins_earned",
  screentime_request:  "elc_screentime_request",
  duties_complete:     "elc_duties_complete",
  payout:              "elc_payout",
};

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body?.event) {
    return NextResponse.json({ error: "Missing event" }, { status: 400 });
  }

  const webhookId = WEBHOOK_IDS[body.event];
  if (!webhookId) {
    return NextResponse.json({ error: "Unknown event" }, { status: 400 });
  }

  // If HA isn't configured yet, acknowledge but don't fail
  if (!HA_BASE) {
    console.log("[ha-event] HA_WEBHOOK_BASE_URL not set, event logged only:", body);
    return NextResponse.json({ ok: true, ha: false, reason: "HA not configured" });
  }

  try {
    const haUrl = `${HA_BASE}/api/webhook/${webhookId}`;
    const haRes = await fetch(haUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(5000),
    });

    if (!haRes.ok) {
      console.error("[ha-event] HA responded", haRes.status);
      return NextResponse.json({ ok: false, ha: false, status: haRes.status }, { status: 502 });
    }

    return NextResponse.json({ ok: true, ha: true });
  } catch (err) {
    console.error("[ha-event] Failed to reach HA:", err);
    // Don't surface HA errors to the client, app still works
    return NextResponse.json({ ok: true, ha: false, reason: "HA unreachable" });
  }
}
