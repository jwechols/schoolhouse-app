import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase";

const SessionSchema = z.object({
  session_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  subject: z.string().min(1).max(50),
  mode: z.string().min(1).max(50),
  score: z.number().int().min(0),
  total: z.number().int().positive(),
  xp_earned: z.number().int().min(0),
  stars_earned: z.number().int().min(0),
  topics_covered: z.array(z.string()),
});

// POST, no auth needed (Truma writes her own sessions)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = SessionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid session data" }, { status: 400 });
    }
    if (!supabaseAdmin) {
      return NextResponse.json({ ok: true }); // Supabase not configured, no-op
    }
    const { error } = await supabaseAdmin.from("truma_sessions").insert(parsed.data);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Session save error:", err);
    return NextResponse.json({ error: "Failed to save session" }, { status: 500 });
  }
}

// GET, returns recent sessions (used by progress page and parent dashboard)
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const limit = Math.min(parseInt(url.searchParams.get("limit") ?? "50"), 200);

  if (!supabaseAdmin) {
    return NextResponse.json({ sessions: [] });
  }
  const { data, error } = await supabaseAdmin
    .from("truma_sessions")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    return NextResponse.json({ error: "Failed to fetch sessions" }, { status: 500 });
  }
  return NextResponse.json({ sessions: data ?? [] });
}
