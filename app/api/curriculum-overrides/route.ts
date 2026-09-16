import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabase, supabaseAdmin } from "@/lib/supabase";
import type { LessonOverride } from "@/lib/curriculum-spine/override-cache";

// Briana's lesson overrides. All methods require the parent PIN cookie (the same
// gate as the /parent dashboard). Reads use the anon/service client; writes
// require the service role (there is no anon write policy on the table).

async function isParent(): Promise<boolean> {
  const c = await cookies();
  const pin = c.get("ta-parent")?.value;
  return process.env.PARENT_AUTH_ENFORCE === "0" || (!!process.env.PARENT_PIN && pin === process.env.PARENT_PIN);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToOverride(r: any): LessonOverride {
  return {
    lessonId: r.lesson_id,
    kidId: r.kid_id,
    subject: r.subject,
    unitId: r.unit_id ?? null,
    isCustom: !!r.is_custom,
    status: r.status ?? null,
    note: r.note ?? null,
    patch: r.patch ?? null,
    fullLesson: r.full_lesson ?? null,
    sortOrder: r.sort_order ?? null,
  };
}

function overrideToRow(o: LessonOverride) {
  return {
    lesson_id: o.lessonId,
    kid_id: o.kidId,
    subject: o.subject,
    unit_id: o.unitId ?? null,
    is_custom: !!o.isCustom,
    status: o.status ?? null,
    note: o.note ?? null,
    patch: o.patch ?? null,
    full_lesson: o.fullLesson ?? null,
    sort_order: o.sortOrder ?? null,
    updated_by: "briana",
    updated_at: new Date().toISOString(),
  };
}

export async function GET() {
  if (!(await isParent())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const client = supabaseAdmin ?? supabase;
  if (!client) return NextResponse.json({ overrides: [] });
  const { data, error } = await client.from("curriculum_overrides").select("*");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return NextResponse.json({ overrides: (data as any[]).map(rowToOverride) });
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
  const body = (await req.json()) as LessonOverride;
  if (!body?.lessonId || !body?.kidId || !body?.subject) {
    return NextResponse.json({ error: "lessonId, kidId and subject are required" }, { status: 400 });
  }
  const { error } = await supabaseAdmin
    .from("curriculum_overrides")
    .upsert(overrideToRow(body), { onConflict: "lesson_id" });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
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
  const lessonId = req.nextUrl.searchParams.get("lessonId");
  if (!lessonId) return NextResponse.json({ error: "lessonId required" }, { status: 400 });
  const { error } = await supabaseAdmin
    .from("curriculum_overrides")
    .delete()
    .eq("lesson_id", lessonId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
