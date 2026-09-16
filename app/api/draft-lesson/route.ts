import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getCourseRaw } from "@/lib/curriculum-spine";
import { TUTOR_VOICE } from "@/lib/tutor-personas";
import { FAMILY_CONVICTIONS, REFORMED_DISCIPLESHIP } from "@/lib/tutor-guardrails";

// Drafts one lesson from Briana's plain-English (or dictated) description so she
// can point at what she is actually teaching from the kids' real schoolbooks
// instead of filling in a form. Parent-PIN gated. Output is a structured lesson
// she reviews and saves; nothing is stored here.

export const runtime = "nodejs";

async function isParent(): Promise<boolean> {
  const c = await cookies();
  const pin = c.get("ta-parent")?.value;
  return process.env.PARENT_AUTH_ENFORCE === "0" || (!!process.env.PARENT_PIN && pin === process.env.PARENT_PIN);
}

// Forces the model to return a lesson in the SpineLesson shape.
const SAVE_LESSON_TOOL: Anthropic.Tool = {
  name: "save_lesson",
  description: "Return the drafted lesson in the required structure.",
  input_schema: {
    type: "object",
    properties: {
      title: { type: "string", description: "Short kid-facing title" },
      objective: { type: "string", description: "One line: what the child should learn" },
      teach: { type: "string", description: "2-5 sentences of real teaching in the tutor's voice" },
      workedExample: { type: "string", description: "The idea shown done, step by step. Newlines separate steps. Optional." },
      memoryWork: { type: "string", description: "A verse, fact chant, or catechism line to lock it in. Optional." },
      quiz: {
        type: "array",
        description: "4-6 multiple-choice mastery questions",
        items: {
          type: "object",
          properties: {
            prompt: { type: "string" },
            choices: { type: "array", items: { type: "string" }, description: "2-4 answer options" },
            correctIndex: { type: "integer", description: "Index of the correct choice" },
            explanation: { type: "string", description: "Shown after answering. Optional." },
          },
          required: ["prompt", "choices", "correctIndex"],
        },
      },
    },
    required: ["title", "objective", "teach", "quiz"],
  },
};

export async function POST(req: NextRequest) {
  if (!(await isParent())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "ANTHROPIC_API_KEY not configured" }, { status: 503 });
  }

  const { kidId, subject, prompt } = (await req.json()) as {
    kidId?: string;
    subject?: string;
    prompt?: string;
  };
  if (!kidId || !subject || !prompt?.trim()) {
    return NextResponse.json({ error: "kidId, subject and prompt are required" }, { status: 400 });
  }

  const course = getCourseRaw(kidId, subject);
  const voice = TUTOR_VOICE[kidId] ?? "a warm, classical-Christian tutor";
  const gradeLabel = course?.gradeLabel ?? "";
  const subjectLabel = course?.subjectLabel ?? subject;

  const system = `You are drafting ONE homeschool lesson for the Echols family's app, in the voice of this tutor:
${voice}

Grade: ${gradeLabel}. Subject: ${subjectLabel}.

${FAMILY_CONVICTIONS}

${REFORMED_DISCIPLESHIP}

The parent (Mom) will tell you, in plain words, what she is teaching this week from the child's real schoolbook. Draft a lesson that MATCHES what she describes, pitched exactly at this child's grade and voiced as this tutor.

Rules:
- Actually TEACH the idea in the "teach" text (2-5 sentences), do not just describe it.
- Keep it at the child's level. For Pre-K/Kindergarten keep it tiny and concrete.
- Write 4-6 multiple-choice quiz questions that check real understanding, each with a clearly correct answer.
- Keep any theology 1689-sound; never water it down and never offer the Arminian alternative.
- No em dashes. Return only via the save_lesson tool.`;

  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const msg = await client.messages.create({
      model: "claude-sonnet-5",
      max_tokens: 2000,
      system,
      tools: [SAVE_LESSON_TOOL],
      tool_choice: { type: "tool", name: "save_lesson" },
      messages: [{ role: "user", content: `Here is what I am teaching: ${prompt.trim()}` }],
    });
    const block = msg.content.find((b) => b.type === "tool_use");
    if (!block || block.type !== "tool_use") {
      return NextResponse.json({ error: "Could not draft a lesson. Try rephrasing." }, { status: 502 });
    }
    return NextResponse.json({ lesson: block.input });
  } catch (e) {
    const message = e instanceof Error ? e.message : "draft failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
