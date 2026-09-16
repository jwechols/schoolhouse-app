import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabase, supabaseAdmin } from "@/lib/supabase";
import { rowToReadingAssignment, type ReadingAssignmentDraft, type ReadingStatus } from "@/lib/reading-assignments";

// Briana's reading assignments. GET is public (anon SELECT policy) so kid
// screens can fetch without the parent PIN. Writes here (create, edit,
// approve, pause/resume, delete) require the ta-parent PIN cookie, same as
// word-lists and practice-tests. The kid's one write (submit) is a SEPARATE,
// narrower route: /api/reading-assignments/submit.

async function isParent(): Promise<boolean> {
  const c = await cookies();
  const pin = c.get("ta-parent")?.value;
  return process.env.PARENT_AUTH_ENFORCE === "0" || (!!process.env.PARENT_PIN && pin === process.env.PARENT_PIN);
}

function draftToRow(d: ReadingAssignmentDraft & { status?: ReadingStatus }) {
  return {
    kid_id: d.kidId,
    title: d.title,
    author: d.author ?? null,
    method: d.method,
    questions: d.questions ?? [],
    due_date: d.dueDate ?? null,
    active: d.active ?? true,
    ...(d.status ? { status: d.status } : {}),
    updated_at: new Date().toISOString(),
  };
}

export async function GET(req: NextRequest) {
  const client = supabase ?? supabaseAdmin;
  if (!client) return NextResponse.json({ assignments: [] });

  const kidId = req.nextUrl.searchParams.get("kidId");
  const activeParam = req.nextUrl.searchParams.get("active");
  const status = req.nextUrl.searchParams.get("status");

  let query = client.from("reading_assignments").select("*").order("created_at", { ascending: false });
  if (kidId) query = query.eq("kid_id", kidId);
  if (activeParam !== null) query = query.eq("active", activeParam === "true");
  if (status) query = query.eq("status", status);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return NextResponse.json({ assignments: (data as any[]).map(rowToReadingAssignment) });
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
  const body = (await req.json()) as ReadingAssignmentDraft & { status?: ReadingStatus };
  if (!body?.kidId || !body?.title?.trim() || !body?.method) {
    return NextResponse.json({ error: "kidId, title, and method are required" }, { status: 400 });
  }
  if (body.method === "quiz" && !body.questions?.length) {
    return NextResponse.json({ error: "A quiz needs at least one question" }, { status: 400 });
  }

  const row = draftToRow(body);
  const query = body.id
    ? supabaseAdmin.from("reading_assignments").update(row).eq("id", body.id).select().single()
    : supabaseAdmin.from("reading_assignments").insert(row).select().single();

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, assignment: rowToReadingAssignment(data) });
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
  const { error } = await supabaseAdmin.from("reading_assignments").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
