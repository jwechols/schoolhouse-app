import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { scryptSync, randomBytes, timingSafeEqual } from "crypto";
import { supabaseAdmin } from "@/lib/supabase";

// ── Passcode hashing (salted scrypt) ─────────────────────────────────────────
function hashPasscode(code: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(code, salt, 32).toString("hex");
  return `${salt}:${hash}`;
}
function verifyPasscode(code: string, stored: string): boolean {
  const [salt, hash] = (stored ?? "").split(":");
  if (!salt || !hash) return false;
  const test = scryptSync(code, salt, 32);
  const orig = Buffer.from(hash, "hex");
  return orig.length === test.length && timingSafeEqual(orig, test);
}

// ── Schemas ──────────────────────────────────────────────────────────────────
const person = z.enum(["jm", "briana"]);
const passcode = z.string().regex(/^\d{4,8}$/);

const PayloadSchema = z.object({
  submittedAt: z.string(),
  topics: z.array(z.object({
    topic: z.string().min(1).max(200),
    why: z.string().max(1000),
    level: z.enum(["new", "some", "solid"]),
    depth: z.enum(["overview", "working", "deep"]),
  })).min(1).max(20),
  timePerSitting: z.enum(["10", "20", "30"]),
  formats: z.array(z.enum(["read", "interactive", "listen"])),
  resources: z.string().max(2000),
  notes: z.string().max(2000),
});

const Body = z.discriminatedUnion("action", [
  z.object({ action: z.literal("status") }),
  z.object({ action: z.literal("unlock"), person, passcode: passcode.optional() }),
  z.object({ action: z.literal("save"), person, passcode, payload: PayloadSchema }),
]);

export async function POST(req: NextRequest) {
  let parsed;
  try {
    parsed = Body.safeParse(await req.json());
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const body = parsed.data;

  if (!supabaseAdmin) {
    // DB not configured — report it so the client can show an honest message
    // instead of pretending answers were saved privately.
    return NextResponse.json({ configured: false }, { status: 200 });
  }

  try {
    // ── status: which people have a survey (no content, no hashes) ──────────
    if (body.action === "status") {
      const { data, error } = await supabaseAdmin
        .from("grownup_surveys")
        .select("person");
      if (error) throw error;
      const set = new Set((data ?? []).map((r: { person: string }) => r.person));
      return NextResponse.json({
        configured: true,
        jm: { exists: set.has("jm") },
        briana: { exists: set.has("briana") },
      });
    }

    // ── unlock: existence check (no passcode) or reveal payload (with) ──────
    if (body.action === "unlock") {
      const { data, error } = await supabaseAdmin
        .from("grownup_surveys")
        .select("passcode_hash, payload")
        .eq("person", body.person)
        .maybeSingle();
      if (error) throw error;

      if (!data) return NextResponse.json({ configured: true, exists: false });
      if (!body.passcode) return NextResponse.json({ configured: true, exists: true });

      if (verifyPasscode(body.passcode, data.passcode_hash)) {
        return NextResponse.json({ configured: true, exists: true, ok: true, payload: data.payload });
      }
      return NextResponse.json({ configured: true, exists: true, ok: false }, { status: 401 });
    }

    // ── save: create (sets passcode) or update (verifies passcode) ──────────
    if (body.action === "save") {
      const { data: existing, error: selErr } = await supabaseAdmin
        .from("grownup_surveys")
        .select("passcode_hash")
        .eq("person", body.person)
        .maybeSingle();
      if (selErr) throw selErr;

      if (!existing) {
        const { error } = await supabaseAdmin.from("grownup_surveys").insert({
          person: body.person,
          passcode_hash: hashPasscode(body.passcode),
          payload: body.payload,
        });
        if (error) throw error;
        return NextResponse.json({ configured: true, ok: true, created: true });
      }

      if (!verifyPasscode(body.passcode, existing.passcode_hash)) {
        return NextResponse.json({ configured: true, ok: false }, { status: 403 });
      }
      const { error } = await supabaseAdmin
        .from("grownup_surveys")
        .update({ payload: body.payload, updated_at: new Date().toISOString() })
        .eq("person", body.person);
      if (error) throw error;
      return NextResponse.json({ configured: true, ok: true });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (err) {
    console.error("Grownup survey error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
