import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase";
import { isParent } from "@/lib/parent-auth";
import { clientIp, rateLimitOk } from "@/lib/rate-limit";

// Kid devices post one row per finished drill/game. A whole household shares
// one IP, so the cap is generous; a junk-row script hits it fast.
const POST_LIMIT = 60;
const POST_WINDOW_MS = 10 * 60 * 1000;

const SessionSchema = z.object({
  session_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  subject: z.string().min(1).max(50),
  mode: z.string().min(1).max(50),
  score: z.number().int().min(0),
  total: z.number().int().positive(),
  xp_earned: z.number().int().min(0),
  stars_earned: z.number().int().min(0),
  topics_covered: z.array(z.string().max(100)).max(50),
});

// POST, no sign-in needed (kids' devices log their own sessions fire-and-forget
// from lib/data.ts postSession, and kid routes don't require a kid PIN, so a
// cookie gate would silently drop real rows). Insert-only, schema-validated,
// returns no rows, and rate-limited per IP against junk rows.
export async function POST(req: NextRequest) {
  if (!rateLimitOk(`session:${clientIp(req.headers)}`, POST_LIMIT, POST_WINDOW_MS)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }
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

// GET, returns recent sessions. Parent-only: same ta-parent PIN cookie gate as
// /parent and the other protected API routes. Without it, 401 and no rows.
// (The /parent dashboard reads sessions server-side, not through this route.)
export async function GET(req: NextRequest) {
  if (!(await isParent())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
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
