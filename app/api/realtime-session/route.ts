import { NextRequest, NextResponse } from "next/server";
import { FAMILY_CONVICTIONS, REFORMED_DISCIPLESHIP, SPOKEN_CONVERSATION_STYLE } from "@/lib/tutor-guardrails";

// Mints a short-lived ephemeral client secret for an OpenAI Realtime (WebRTC)
// voice session, configured per kid (voice + spoken tutor persona + guardrails).
// The browser uses the returned token to connect directly to OpenAI for
// streaming speech-to-speech, genuinely conversational, low latency.
export const runtime = "nodejs";

const REALTIME_MODEL = "gpt-realtime-2";

const VOICE: Record<string, string> = {
  titus: "ash",
  mercy: "coral",
  lois:  "shimmer",
  truma: "marin",
};

function instructionsFor(kidId: string): string {
  // The persona (voice/character) + the SAME family convictions and Reformed
  // discipleship the turn-based tutor uses (shared from lib/tutor-guardrails so the
  // voice tutor is never running without the family's guardrails) + spoken-style rules.
  const persona: Record<string, string> = {
    titus: `You are Buck, a warm, folksy old hunting-and-fishing uncle, tutoring Titus, an eight-year-old third grader. He is in the grammar stage, so help him learn and remember facts, often through outdoors and fishing scenarios. Be playful, upbeat, and encouraging.`,
    mercy: `You are Princess Rose, a gentle, joyful kindergarten teacher who loves flowers, tutoring Mercy, who is five. Use very simple words, one idea at a time, warm and a little sing-song.`,
    lois:  `You are Princess Crystal, the softest, gentlest teacher, talking with Lois, who is three. Use tiny, simple words and at most two short sentences, full of warmth, almost like a lullaby.`,
    truma: `You are Lydia, a warm, brilliant Reformed woman mentor named for Lydia of Thyatira in Acts 16, tutoring Truma, an eleven to twelve year old sixth grader at the top of the grammar stage. Treat her as a capable young scholar and never talk down to her; you can go a little deeper with her.`,
  };
  const who = persona[kidId] ?? persona.truma;
  return `${who}\n\n${FAMILY_CONVICTIONS}\n\n${REFORMED_DISCIPLESHIP}\n\n${SPOKEN_CONVERSATION_STYLE}`;
}

export async function POST(req: NextRequest) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: "OPENAI_API_KEY not configured" }, { status: 500 });
  }
  const { kidId = "truma" } = await req.json().catch(() => ({}));
  const voice = VOICE[kidId] ?? "marin";

  const res = await fetch("https://api.openai.com/v1/realtime/client_secrets", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      session: {
        type: "realtime",
        model: REALTIME_MODEL,
        instructions: instructionsFor(kidId),
        audio: {
          input: {
            // Transcribe the child's speech (also surfaces input events).
            transcription: { model: "whisper-1" },
            // Semantic VAD with LOW eagerness: waits until the child has actually
            // finished a thought before the tutor replies. Critical for young kids
            // who speak slowly with pauses, stops the tutor talking over them or
            // cutting them off, and keeps turns going past the first exchange.
            turn_detection: {
              type: "semantic_vad",
              eagerness: "low",
              create_response: true,
              interrupt_response: true,
            },
          },
          output: { voice },
        },
      },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    return NextResponse.json({ error: err }, { status: res.status });
  }

  const data = await res.json();
  const value = data.value ?? data.client_secret?.value ?? null;
  if (!value) {
    return NextResponse.json({ error: "No ephemeral token in response" }, { status: 502 });
  }
  return NextResponse.json({ value, model: REALTIME_MODEL });
}
