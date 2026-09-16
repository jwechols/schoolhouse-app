import { NextRequest, NextResponse } from "next/server";

// Sends a Telegram message when a kid raises a hand for help. Separate,
// dedicated family bot (NOT Field Office's TFE bot, kept apart on purpose).
// TELEGRAM_CHAT_IDS is comma-separated so it can reach Briana, JM, or both
// with no code change, just env config. No-ops quietly if not configured yet.

export async function POST(req: NextRequest) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatIds = (process.env.TELEGRAM_CHAT_IDS ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  if (!token || chatIds.length === 0) {
    return NextResponse.json({ ok: true, sent: false, reason: "not configured" });
  }

  const { kidName, activity } = (await req.json()) as { kidName?: string; activity?: string };
  if (!kidName) {
    return NextResponse.json({ error: "kidName required" }, { status: 400 });
  }

  const text = `🙋 ${kidName} needs help!${activity ? `\n${activity}` : ""}`;

  try {
    const results = await Promise.all(
      chatIds.map((chat_id) =>
        fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chat_id, text }),
        }),
      ),
    );
    const allOk = results.every((r) => r.ok);
    return NextResponse.json({ ok: true, sent: allOk });
  } catch (err) {
    console.error("[notify-help] send failed:", err);
    return NextResponse.json({ ok: false, sent: false }, { status: 502 });
  }
}
