import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: "OPENAI_API_KEY not configured" }, { status: 500 });
  }

  // Default is "nova" so a caller that forgets a voice still lands on a voice that
  // has a VOICE_INSTRUCTIONS entry. The old "sage" default had none, so any such
  // caller got an untuned voice with no delivery style. All three real callers
  // (FloatingTutor, Scout, useTTS) pass a voice explicitly, so this is a guardrail.
  const { text, voice = "nova", instructions } = await req.json();
  if (!text?.trim()) {
    return NextResponse.json({ error: "No text provided" }, { status: 400 });
  }

  const speech = (body: object) =>
    fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

  const input = text.slice(0, 4096);

  // gpt-4o-mini-tts is the only OpenAI speech model that honors `instructions`, 
  // that's what lets each tutor actually sound like their character (see
  // lib/tts.ts VOICE_INSTRUCTIONS) instead of a flat narrator. This was
  // previously downgraded to tts-1-hd over a ~10s latency concern (2026-07).
  // If that recurs, revert to `model: "tts-1-hd"` and drop `instructions`
  // (classic models don't accept it), see git history for the old code.
  const res = await speech({
    model: "gpt-4o-mini-tts",
    input,
    voice,
    instructions: instructions || undefined,
    response_format: "mp3",
  });

  if (!res.ok) {
    const err = await res.text();
    return NextResponse.json({ error: err }, { status: res.status });
  }

  const audio = await res.arrayBuffer();
  return new NextResponse(audio, {
    headers: {
      "Content-Type": "audio/mpeg",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
