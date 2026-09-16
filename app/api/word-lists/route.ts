import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabase, supabaseAdmin } from "@/lib/supabase";
import { rowToWordList, type WordListDraft } from "@/lib/word-lists";

// Briana's word lists (vocab & spelling drills). GET is public (anon SELECT
// policy) so kid drill screens can fetch without the parent PIN. Writes
// require the same ta-parent PIN cookie as /api/curriculum-overrides.

async function isParent(): Promise<boolean> {
  const c = await cookies();
  const pin = c.get("ta-parent")?.value;
  return process.env.PARENT_AUTH_ENFORCE === "0" || (!!process.env.PARENT_PIN && pin === process.env.PARENT_PIN);
}

function draftToRow(d: WordListDraft) {
  return {
    kid_id: d.kidId,
    type: d.type,
    title: d.title,
    words: d.words,
    due_date: d.dueDate ?? null,
    active: d.active ?? true,
    updated_at: new Date().toISOString(),
  };
}

export async function GET(req: NextRequest) {
  const client = supabase ?? supabaseAdmin;
  if (!client) return NextResponse.json({ lists: [] });

  const kidId = req.nextUrl.searchParams.get("kidId");
  const activeParam = req.nextUrl.searchParams.get("active");

  let query = client.from("word_lists").select("*").order("created_at", { ascending: false });
  if (kidId) query = query.eq("kid_id", kidId);
  if (activeParam !== null) query = query.eq("active", activeParam === "true");

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return NextResponse.json({ lists: (data as any[]).map(rowToWordList) });
}

export async function POST(req: NextRequest) {
  if (!(await isParent())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: "Saving is not configured yet. The Supabase service role key is missing." },
      { status: 503 },
    );
  }
  const body = (await req.json()) as WordListDraft;
  if (!body?.kidId || !body?.type || !body?.title?.trim() || !body?.words?.length) {
    return NextResponse.json({ error: "kidId, type, title, and at least one word are required" }, { status: 400 });
  }

  const row = draftToRow(body);
  const query = body.id
    ? supabaseAdmin.from("word_lists").update(row).eq("id", body.id).select().single()
    : supabaseAdmin.from("word_lists").insert(row).select().single();

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, list: rowToWordList(data) });
}

export async function DELETE(req: NextRequest) {
  if (!(await isParent())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: "Saving is not configured yet. The Supabase service role key is missing." },
      { status: 503 },
    );
  }
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const { error } = await supabaseAdmin.from("word_lists").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
