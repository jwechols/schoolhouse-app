import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export const runtime = "nodejs";

async function isParent(): Promise<boolean> {
  const c = await cookies();
  const pin = c.get("ta-parent")?.value;
  return process.env.PARENT_AUTH_ENFORCE === "0" || (!!process.env.PARENT_PIN && pin === process.env.PARENT_PIN);
}

type ExtractType = "vocab" | "spelling" | "memory" | "facts";

function saveWordsTool(type: ExtractType): Anthropic.Tool {
  const wordDesc =
    type === "memory"
      ? "One line of the poem or verse."
      : type === "facts"
        ? "The question, as the child should hear it. Example: Capital of Texas"
        : "The word.";
  return {
    name: "save_words",
    description:
      type === "memory"
        ? "Return the poem, verse, or memory piece as ordered lines."
        : type === "facts"
          ? "Return every quiz item as a question and its answer."
          : "Return every word found in the photo, in reading order.",
    input_schema: {
      type: "object",
      properties: {
        title: { type: "string", description: "Optional title printed on the page." },
        words: {
          type: "array",
          items: {
            type: "object",
            properties: {
              word: { type: "string", description: wordDesc },
              definition:
                type === "vocab"
                  ? { type: "string", description: "Required. A short, kid-level definition." }
                  : type === "facts"
                    ? { type: "string", description: "Required. The answer. Short." }
                    : { type: "string", description: "Omit." },
              example: { type: "string", description: "Vocab only, optional." },
            },
            required: type === "vocab" || type === "facts" ? ["word", "definition"] : ["word"],
          },
        },
      },
      required: ["words"],
    },
  };
}

const MEDIA_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"] as const;
type MediaType = (typeof MEDIA_TYPES)[number];

export async function POST(req: NextRequest) {
  if (!(await isParent())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "ANTHROPIC_API_KEY not configured" }, { status: 503 });
  }

  const { image, mediaType, type } = (await req.json()) as {
    image?: string;
    mediaType?: string;
    type?: ExtractType;
  };
  if (!image || !mediaType || !type) {
    return NextResponse.json({ error: "image, mediaType, and type are required" }, { status: 400 });
  }
  if (!MEDIA_TYPES.includes(mediaType as MediaType)) {
    return NextResponse.json({ error: "Unsupported image type" }, { status: 400 });
  }

  const instructions =
    type === "vocab"
      ? "This is a vocabulary list or worksheet. Every single word MUST get a definition field. If the photo already shows a definition, use it. If it doesn't, YOU write a short kid-level definition. Add a brief example sentence when you can."
      : type === "memory"
        ? "This is a poem, verse, catechism answer, or nursery rhyme. Extract the title if printed, then each line in order as its own word field. Keep the wording. Do not paraphrase. Skip page numbers and decorations."
        : type === "facts"
          ? "This is homework to quiz: a map worksheet, geography facts, history dates, science terms, or labeled diagram. Turn each item into a short question (word) and the answer (definition). Examples: word='Capital of Texas', definition='Austin'; word='The river that forms Texas's southern border', definition='Rio Grande'. If the page is a map with labeled places, make a question for each label. Skip decorations and instructions."
          : "This is a spelling list. Extract just the words, in order. Ignore instructions, headers, or unrelated text.";

  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const msg = await client.messages.create({
      model: "claude-sonnet-5",
      max_tokens: 2000,
      system: `You read a photo of a homeschool page for a parent and extract it cleanly. ${instructions} No em dashes. Return only via the save_words tool.`,
      tools: [saveWordsTool(type)],
      tool_choice: { type: "tool", name: "save_words" },
      messages: [
        {
          role: "user",
          content: [
            { type: "image", source: { type: "base64", media_type: mediaType as MediaType, data: image } },
            { type: "text", text: "Extract the content from this photo." },
          ],
        },
      ],
    });
    const block = msg.content.find((b) => b.type === "tool_use");
    if (!block || block.type !== "tool_use") {
      return NextResponse.json({ error: "Could not read that photo. Try a clearer shot." }, { status: 502 });
    }
    const input = block.input as { words?: unknown[]; title?: string };
    const words = input?.words ?? [];
    if (!Array.isArray(words) || words.length === 0) {
      return NextResponse.json({ error: "Nothing found in that photo." }, { status: 422 });
    }
    return NextResponse.json({ words, title: input.title ?? null });
  } catch (e) {
    const message = e instanceof Error ? e.message : "extraction failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
