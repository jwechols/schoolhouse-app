import "server-only";
import { supabase, supabaseAdmin } from "@/lib/supabase";
import type { LessonOverride } from "@/lib/curriculum-spine/override-cache";

// Server-side read of Briana's overrides from Supabase. Called in the root
// layout so the merge cache is seeded before any kid component renders. Reads
// prefer the service role (bypasses RLS) but fall back to the anon key, which
// the read policy allows. When no Supabase env is configured (e.g. local dev),
// this returns [] and the app runs on the code lessons alone.

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

export async function fetchOverrides(): Promise<LessonOverride[]> {
  const client = supabaseAdmin ?? supabase;
  if (!client) return [];
  try {
    const { data, error } = await client
      .from("curriculum_overrides")
      .select("*");
    if (error || !data) return [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (data as any[]).map(rowToOverride);
  } catch {
    return [];
  }
}
