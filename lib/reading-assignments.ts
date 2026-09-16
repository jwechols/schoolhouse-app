// ── Reading assignments: books Briana assigns as "mind work" ─────────────────
// Four check-in methods: report / presentation / quiz (all self-serve for kids
// who read) and tell_mom (for the littles, an honor check-in). Quiz reuses the
// exact PracticeQuestion shape so it can be handed straight to
// PracticeTestRunner. The other three methods have no way to be auto-verified,
// so the kid marks "ready" and it waits in an approval queue for Briana, same
// idea as the existing lesson sign-off queue.

import type { PracticeQuestion } from "./practice-tests";

export type ReadingMethod = "report" | "presentation" | "quiz" | "tell_mom";
export type ReadingStatus = "assigned" | "submitted" | "approved";

export interface ReadingAssignment {
  id: string;
  kidId: string;
  title: string;
  author?: string | null;
  method: ReadingMethod;
  questions: PracticeQuestion[]; // quiz only
  dueDate?: string | null;
  status: ReadingStatus;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function rowToReadingAssignment(r: any): ReadingAssignment {
  return {
    id: r.id,
    kidId: r.kid_id,
    title: r.title,
    author: r.author ?? null,
    method: r.method,
    questions: Array.isArray(r.questions) ? r.questions : [],
    dueDate: r.due_date ?? null,
    status: r.status,
    active: !!r.active,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

export interface ReadingAssignmentDraft {
  id?: string;
  kidId: string;
  title: string;
  author?: string | null;
  method: ReadingMethod;
  questions?: PracticeQuestion[];
  dueDate?: string | null;
  active?: boolean;
}

export async function fetchReadingAssignments(opts: { kidId?: string; active?: boolean; status?: ReadingStatus } = {}): Promise<ReadingAssignment[]> {
  const params = new URLSearchParams();
  if (opts.kidId) params.set("kidId", opts.kidId);
  if (opts.active !== undefined) params.set("active", String(opts.active));
  if (opts.status) params.set("status", opts.status);
  const res = await fetch(`/api/reading-assignments?${params.toString()}`);
  if (!res.ok) return [];
  const json = await res.json();
  return (json.assignments ?? []) as ReadingAssignment[];
}

/** Briana's save (create/edit/approve). PIN-gated server-side. */
export async function saveReadingAssignment(draft: ReadingAssignmentDraft & { status?: ReadingStatus }): Promise<{ ok: boolean; error?: string; assignment?: ReadingAssignment }> {
  const res = await fetch("/api/reading-assignments", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(draft),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) return { ok: false, error: json.error || "Could not save." };
  return { ok: true, assignment: json.assignment };
}

export async function deleteReadingAssignment(id: string): Promise<{ ok: boolean; error?: string }> {
  const res = await fetch(`/api/reading-assignments?id=${encodeURIComponent(id)}`, { method: "DELETE" });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) return { ok: false, error: json.error || "Could not delete." };
  return { ok: true };
}

/** The kid's ONLY write: mark a report/presentation/tell_mom assignment ready
 *  for Mom. No PIN, but this endpoint can only flip assigned -> submitted. */
export async function submitReadingAssignment(id: string): Promise<{ ok: boolean; error?: string }> {
  const res = await fetch("/api/reading-assignments/submit", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ id }),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) return { ok: false, error: json.error || "Could not submit." };
  return { ok: true };
}
