import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// The kid's ONLY write on reading assignments: mark "I'm ready to tell Mom
// about it." Deliberately NOT parent-PIN gated (kids use this themselves),
// but deliberately narrow: it can only flip one specific row from
// assigned -> submitted, nothing else about the row is ever touched, and it
// refuses if the row isn't in the assigned state (so it can't be replayed to
// undo an approval or resubmit).

export async function POST(req: NextRequest) {
  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: "Not configured yet. The Supabase service role key is missing." },
      { status: 503 },
    );
  }
  const { id } = (await req.json()) as { id?: string };
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const { data, error } = await supabaseAdmin
    .from("reading_assignments")
    .update({ status: "submitted", updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("status", "assigned")
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: "Already submitted or not found." }, { status: 409 });
  return NextResponse.json({ ok: true });
}
