import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

export async function POST(req: NextRequest) {
  // Require parent PIN
  const cookieStore = await cookies();
  const parentPin = cookieStore.get("ta-parent")?.value;
  if (process.env.PARENT_AUTH_ENFORCE !== "0" && parentPin !== process.env.PARENT_PIN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { sessions } = await req.json();
  if (!Array.isArray(sessions)) {
    return NextResponse.json({ error: "sessions required" }, { status: 400 });
  }

  const subjectCounts: Record<string, number> = {};
  const subjectScores: Record<string, number[]> = {};
  let totalXP = 0;

  for (const s of sessions) {
    subjectCounts[s.subject] = (subjectCounts[s.subject] ?? 0) + 1;
    if (!subjectScores[s.subject]) subjectScores[s.subject] = [];
    if (s.total > 0) subjectScores[s.subject].push(Math.round((s.score / s.total) * 100));
    totalXP += s.xp_earned ?? 0;
  }

  const subjectSummary = Object.entries(subjectCounts)
    .map(([subj, count]) => {
      const scores = subjectScores[subj] ?? [];
      const avg = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
      return `${subj}: ${count} session(s), average accuracy ${avg}%`;
    })
    .join("\n");

  const prompt = `You are writing a warm, encouraging parent report for Truma's parents. Truma is an 11-year-old girl, heading to 6th grade at Midland Classical Academy in Midland, Texas.

Here is Truma's recent learning activity data:

Total sessions: ${sessions.length}
Total XP earned: ${totalXP}
Date range: ${sessions.length > 0 ? sessions[sessions.length - 1].session_date : "N/A"} to ${sessions.length > 0 ? sessions[0].session_date : "N/A"}

Subject breakdown:
${subjectSummary}

Write a 3-4 paragraph parent progress report that:
1. Opens with a warm, specific summary of what Truma has been working on
2. Highlights her strongest subjects based on accuracy and session count
3. Identifies subjects or areas where more practice would help (gently and constructively)
4. Closes with a faith-grounded encouragement, brief, natural, not preachy (one sentence referencing diligence as a gift from God or similar)

Write in plain prose (no bullet points, no headers). Keep it warm, specific, and around 200-250 words. Address the report to "John-Mark" at the start.`;

  const response = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 800,
    stream: true,
    messages: [{ role: "user", content: prompt }],
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of response) {
          if (
            chunk.type === "content_block_delta" &&
            chunk.delta.type === "text_delta"
          ) {
            controller.enqueue(encoder.encode(chunk.delta.text));
          }
        }
      } finally {
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
    },
  });
}
