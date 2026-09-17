import { NextRequest, NextResponse } from "next/server";

// KEEP IN SYNC with lib/tts.ts VOICE_INSTRUCTIONS. Looked up by voice so GET
// URLs stay short and the Netlify CDN can cache identical (voice, text) pairs.
const VOICES = new Set(["ash", "coral", "shimmer", "nova"]);
const INSTRUCTIONS: Record<string, string> = {
  ash: "Warm, friendly older outdoorsman, like a favorite hunting-and-fishing uncle. Easygoing, upbeat, a little playful and folksy to keep an 8-year-old boy engaged. Encouraging, never rushed or stern.",
  coral: "Gentle, joyful kindergarten teacher who loves flowers. Warm and bright with a light sing-song lilt. Slow and clear for a 5-year-old, full of delight and encouragement.",
  shimmer: "The softest, gentlest voice for a 3-year-old. Very slow, very simple, very tender. Calm and reassuring, almost like a lullaby. Short and sweet.",
  nova: "Warm, intelligent woman mentor. Calm, thoughtful, and encouraging. Speak to a bright 11-year-old as a capable young scholar, never talk down to her. Unhurried and clear, with a gentle smile in the voice. Pronounce the name 'Truma' as 'TROO-mah' (rhymes with Puma), never 'Truh-ma'.",
};

const AUDIO_HEADERS = {
  "Content-Type": "audio/mpeg",
  "Cache-Control": "public, max-age=31536000, s-maxage=31536000, immutable",
  "Netlify-CDN-Cache-Control": "public, durable, max-age=31536000, immutable",
  "CDN-Cache-Control": "public, max-age=31536000, immutable",
};

async function synthesize(text: string, voiceRaw: string) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: "OPENAI_API_KEY not configured" }, { status: 500 });
  }

  const voice = VOICES.has(voiceRaw) ? voiceRaw : "nova";
  const input = text.slice(0, 4096);

  // gpt-4o-mini-tts is the only OpenAI speech model that honors `instructions`,
  // that's what lets each tutor actually sound like their character. Do not
  // downgrade to tts-1 to chase latency — GET + CDN cache + progressive
  // HTMLAudio play is the speed path (see lib/tts.ts).
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
      instructions: INSTRUCTIONS[voice],
      response_format: "mp3",
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    return NextResponse.json({ error: err }, { status: res.status });
  }

  // Pipe the body through so HTMLAudio can start as the first frames arrive.
  return new NextResponse(res.body, { headers: AUDIO_HEADERS });
}

/** GET /api/tts — warmup (no params). GET /api/tts?v=ash&t=Who+made+you — playable, CDN-cached. */
export async function GET(req: NextRequest) {
  const text = req.nextUrl.searchParams.get("t") ?? req.nextUrl.searchParams.get("text") ?? "";
  const voice = req.nextUrl.searchParams.get("v") ?? req.nextUrl.searchParams.get("voice") ?? "nova";
  if (!text.trim()) {
    return new NextResponse(null, { status: 204, headers: { "Cache-Control": "no-store" } });
  }
  return synthesize(text, voice);
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const text = typeof body?.text === "string" ? body.text : "";
  const voice = typeof body?.voice === "string" ? body.voice : "nova";
  if (!text.trim()) {
    return NextResponse.json({ error: "No text provided" }, { status: 400 });
  }
  // Ignore client `instructions` so GET and POST of the same line sound identical
  // and share the CDN cache key (voice + text only).
  return synthesize(text, voice);
}
