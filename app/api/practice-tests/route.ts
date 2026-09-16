import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabase, supabaseAdmin } from "@/lib/supabase";
import { rowToPracticeTest, type PracticeTestDraft } from "@/lib/practice-tests";

// Briana's practice tests. GET is public (anon SELECT policy) so kid runners
// can fetch without the parent PIN. Writes require the same ta-parent PIN
// cookie as /api/word-lists and /api/curriculum-overrides.

async function isParent(): Promise<boolean> {
  const c = await cookies();
  const pin = c.get("ta-parent")?.value;
  return process.env.PARENT_AUTH_ENFORCE === "0" || (!!process.env.PARENT_PIN && pin === process.env.PARENT_PIN);
}

function draftToRow(d: PracticeTestDraft) {
  return {
    kid_id: d.kidId,
    subject: d.subject,
    title: d.title,
    questions: d.questions,
    due_date: d.dueDate ?? null,
    active: d.active ?? true,
    updated_at: new Date().toISOString(),
  };
}

export async function GET(req: NextRequest) {
  const client = supabase ?? supabaseAdmin;
  if (!client) return NextResponse.json({ tests: [] });

  const kidId = req.nextUrl.searchParams.get("kidId");
  const activeParam = req.nextUrl.searchParams.get("active");

  let query = client.from("practice_tests").select("*").order("created_at", { ascending: false });
  if (kidId) query = query.eq("kid_id", kidId);
  if (activeParam !== null) query = query.eq("active", activeParam === "true");

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return NextResponse.json({ tests: (data as any[]).map(rowToPracticeTest) });
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
  const body = (await req.json()) as PracticeTestDraft;
  if (!body?.kidId || !body?.subject || !body?.title?.trim() || !body?.questions?.length) {
    return NextResponse.json({ error: "kidId, subject, title, and at least one question are required" }, { status: 400 });
  }

  const row = draftToRow(body);
  const query = body.id
    ? supabaseAdmin.from("practice_tests").update(row).eq("id", body.id).select().single()
    : supabaseAdmin.from("practice_tests").insert(row).select().single();

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, test: rowToPracticeTest(data) });
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
  const { error } = await supabaseAdmin.from("practice_tests").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
