import { NextRequest, NextResponse } from "next/server";

/** Wake the Netlify function on first tap so the real speak() isn't a cold start. */
export async function GET() {
  return new NextResponse(null, { status: 204, headers: { "Cache-Control": "no-store" } });
}

export async function POST(req: NextRequest) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: "OPENAI_API_KEY not configured" }, { status: 500 });
  }

  // Default is "nova" so a caller that forgets a voice still lands on a voice that
  // has a VOICE_INSTRUCTIONS entry. All real callers pass a voice explicitly.
  const { text, voice = "nova", instructions } = await req.json();
  if (!text?.trim()) {
    return NextResponse.json({ error: "No text provided" }, { status: 400 });
  }

  const input = text.slice(0, 4096);

  // gpt-4o-mini-tts is the only OpenAI speech model that honors `instructions`,
  // that's what lets each tutor actually sound like their character. Do not
  // downgrade to tts-1 to chase latency — client cache + first-sentence chunking
  // is the speed path (see lib/tts.ts).
  const res = await fetch("https://api.openai.com/v1/audio/speech", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini-tts",
      input,
      voice,
      instructions: instructions || undefined,
      response_format: "mp3",
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    return NextResponse.json({ error: err }, { status: res.status });
  }

  // Pipe the body through instead of buffering a second copy on the function.
  return new NextResponse(res.body, {
    headers: {
      "Content-Type": "audio/mpeg",
      "Cache-Control": "public, max-age=86400, immutable",
    },
  });
}
