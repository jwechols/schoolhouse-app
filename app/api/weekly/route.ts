import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { CATECHISM } from "@/lib/catechism-boys-girls";

// ── Weekly curriculum auto-refresh ────────────────────────────────────────────
// Composes the week's Faith Path content from three sources:
//   1. The Homeward church pipeline (Sunday bulletin scan → verse, ref, hymn)
//   2. Catechism progression, one question per week through all 145 of
//      A Catechism for Boys and Girls, anchored to Q17 = week of 2026-06-08
//   3. A once-a-week Claude call that fills hymn lyrics, verse theme, and a
//      character trait grounded in the sermon passage
// Result is cached in Netlify Blobs per week, first visitor each week pays
// the compose cost, everyone else gets the cache.

const BULLETIN_URL = "https://homeward.echols.family/.netlify/functions/bulletin";
const ANCHOR_MONDAY_UTC = Date.UTC(2026, 5, 8); // Monday June 8 2026
const ANCHOR_Q = 17;                            // that week's catechism question
const TOTAL_Q = 145;

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

function currentWeek() {
  const now = new Date();
  const day = now.getUTCDay(); // 0=Sun
  const diffToMonday = (day + 6) % 7;
  const monday = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - diffToMonday));
  const weeksSince = Math.max(0, Math.round((monday.getTime() - ANCHOR_MONDAY_UTC) / (7 * 86400000)));
  const key = monday.toISOString().slice(0, 10);
  const label = `Week of ${monday.toLocaleDateString("en-US", { month: "long", day: "numeric", timeZone: "UTC" })}`;
  return { key, weeksSince, label };
}

async function blobStore() {
  const { getStore } = await import("@netlify/blobs");
  return getStore("schoolhouse-weekly");
}

async function readCache(key: string): Promise<Record<string, unknown> | null> {
  try {
    const s = await blobStore();
    return (await s.get(key, { type: "json" })) as Record<string, unknown> | null;
  } catch { return null; } // blobs unavailable (local dev), compute fresh
}

async function writeCache(key: string, val: unknown): Promise<void> {
  try {
    const s = await blobStore();
    await s.setJSON(key, val);
  } catch { /* cache is best-effort */ }
}

interface BulletinData {
  connected?: boolean;
  sermon_title?: string;
  sermon_passage?: string;
  verse?: string;
  ref?: string;
  hymn?: string;
  hymn_author?: string;
  updatedAt?: string;
}

async function fetchBulletin(): Promise<BulletinData | null> {
  try {
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), 6000);
    const res = await fetch(BULLETIN_URL, { signal: controller.signal });
    clearTimeout(t);
    if (!res.ok) return null;
    const data = (await res.json()) as BulletinData;
    return data?.connected ? data : null;
  } catch { return null; }
}

interface ComposedFields {
  verseTheme?: string;
  hymn?: { title?: string; verse?: string; chorus?: string; author?: string; year?: string; doctrine?: string };
  character?: { trait?: string; definition?: string; kidFriendly?: string; toddlerFriendly?: string; verse?: string; reference?: string };
}

async function composeWithClaude(
  bulletin: BulletinData | null,
  catechism: { question: string; answer: string },
): Promise<ComposedFields | null> {
  if (!process.env.ANTHROPIC_API_KEY) return null;
  try {
    const msg = await client.messages.create({
      model: "claude-sonnet-5",
      // Sonnet 5 emits a thinking block first; budget must cover thinking + JSON
      max_tokens: 4000,
      system:
        "You compose weekly discipleship content for a confessional Reformed Baptist family (1689 London Baptist Confession). " +
        "Respond with ONLY a JSON object, no prose, matching exactly: " +
        `{"verseTheme": string (2-4 word label for the memory verse), ` +
        `"hymn": {"title": string, "verse": string (the REAL public-domain first stanza, lines separated by \\n, if you are not confident of the exact wording, return an empty string for verse), "chorus": string or omit, "author": string, "year": string or omit, "doctrine": string (1-3 word doctrinal theme)}, ` +
        `"character": {"trait": string (one-word character trait drawn from the sermon passage), "definition": string (adult), "kidFriendly": string (age 5-8), "toddlerFriendly": string (age 3, one short joyful sentence), "verse": string (a short real Scripture quote supporting the trait), "reference": string}}. ` +
        "Never invent hymn lyrics or Scripture wording. Doctrine must be consistent with the 1689 confession.",
      messages: [{
        role: "user",
        content:
          `This week at Colonial Bible Church:\n` +
          `Sermon: ${bulletin?.sermon_title ?? "(unknown)"}, ${bulletin?.sermon_passage ?? "(unknown)"}\n` +
          `Memory verse (${bulletin?.ref ?? "?"}): ${bulletin?.verse ?? "(none)"}\n` +
          `Hymn: ${bulletin?.hymn ?? "(none)"}${bulletin?.hymn_author ? ` by ${bulletin.hymn_author}` : ""}\n` +
          `This week's catechism: ${catechism.question}, ${catechism.answer}\n\n` +
          `Compose the JSON.`,
      }],
    });
    // Sonnet 5 may emit a thinking block before the text block, find the text
    const textBlock = msg.content.find((b) => b.type === "text");
    const text = textBlock && textBlock.type === "text" ? textBlock.text : "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;
    return JSON.parse(jsonMatch[0]) as ComposedFields;
  } catch { return null; }
}

export async function GET(req: NextRequest) {
  const { key, weeksSince, label } = currentWeek();
  const force = req.nextUrl.searchParams.get("force") === "1";

  if (!force) {
    const cached = await readCache(`weekly-${key}`);
    if (cached) return NextResponse.json(cached);
  }

  // 1. Catechism progression, one question per week, wraps after Q145
  const qNumber = ((ANCHOR_Q - 1 + weeksSince) % TOTAL_Q) + 1;
  const q = CATECHISM.find((c) => c.number === qNumber) ?? CATECHISM[0];

  // 2. Church pipeline
  const bulletin = await fetchBulletin();

  // 3. Claude fills the rest (best-effort, deterministic fields never depend on it)
  const composed = await composeWithClaude(bulletin, q);

  const curriculum = {
    weekLabel: label,
    catechism: {
      number: q.number,
      question: q.question,
      answer: q.answer,
      reference: q.reference ?? "",
      source: `A Catechism for Boys and Girls (T&G Vol. 1), Q${q.number}`,
    },
    verse: bulletin?.verse
      ? { text: bulletin.verse, reference: bulletin.ref ?? "", theme: composed?.verseTheme ?? "This Week at Church" }
      : { text: q.answer, reference: q.reference ?? "", theme: "Catechism Truth" },
    hymn: {
      title: bulletin?.hymn || composed?.hymn?.title || "Come, Thou Fount of Every Blessing",
      verse: composed?.hymn?.verse || "Ask Mom or Dad to sing this week's hymn with you!",
      ...(composed?.hymn?.chorus ? { chorus: composed.hymn.chorus } : {}),
      author: composed?.hymn?.author || bulletin?.hymn_author || "",
      ...(composed?.hymn?.year ? { year: composed.hymn.year } : {}),
      ...(composed?.hymn?.doctrine ? { doctrine: composed.hymn.doctrine } : {}),
    },
    character: {
      trait: composed?.character?.trait ?? "Faithfulness",
      definition: composed?.character?.definition ?? "Keeping your word and trusting God to keep His.",
      kidFriendly: composed?.character?.kidFriendly ?? "Being faithful means doing what you said you would do, because God always does.",
      toddlerFriendly: composed?.character?.toddlerFriendly ?? "God always keeps His promises!",
      verse: composed?.character?.verse ?? "Great is your faithfulness.",
      reference: composed?.character?.reference ?? "Lamentations 3:23",
    },
    _meta: {
      weekKey: key,
      source: bulletin ? "church-bulletin" : "catechism-only",
      composed: !!composed,
      bulletinUpdatedAt: bulletin?.updatedAt ?? null,
      composedAt: new Date().toISOString(),
    },
  };

  // Only cache complete weeks, a failed Claude compose should retry on the
  // next request, not freeze fallback content in place for seven days.
  if (composed) await writeCache(`weekly-${key}`, curriculum);
  return NextResponse.json(curriculum);
}
