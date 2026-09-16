import { NextRequest, NextResponse } from "next/server";

// Speech-to-text. Mirrors /api/tts but the other direction: the browser records
// the kid with MediaRecorder and POSTs the audio here, we hand it to OpenAI
// Whisper and return the transcript. This exists because Safari (and especially
// an installed PWA on the iPad) does not reliably support the browser's
// SpeechRecognition API, which is what voice input used to depend on.
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: "OPENAI_API_KEY not configured" }, { status: 500 });
  }

  let file: Blob | null = null;
  try {
    const form = await req.formData();
    const f = form.get("audio");
    if (f instanceof Blob) file = f;
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }
  if (!file || file.size === 0) {
    return NextResponse.json({ error: "No audio provided" }, { status: 400 });
  }

  const name = (file as File).name || "speech.webm";

  const upstream = new FormData();
  upstream.append("file", file, name);
  upstream.append("model", "whisper-1");
  upstream.append("language", "en");
  upstream.append("response_format", "json");

  const res = await fetch("https://api.openai.com/v1/audio/transcriptions", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
    body: upstream,
  });

  if (!res.ok) {
    const err = await res.text();
    return NextResponse.json({ error: err }, { status: res.status });
  }

  const data = await res.json();
  return NextResponse.json({ text: (data.text ?? "").trim() });
}
