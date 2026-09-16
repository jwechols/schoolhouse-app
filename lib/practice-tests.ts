// ── Practice tests: Briana's assembled quizzes (math and everything else) ────
// Same pattern as word-lists: a standalone content type Briana sets and
// assigns per kid, read publicly for the kid runner, written through the
// parent-PIN gate. Questions reuse the same shape lessons already use
// (QuizQuestion), so the same authoring mental model applies.

export interface PracticeQuestion {
  prompt: string;
  choices: string[];
  correctIndex: number;
  explanation?: string;
}

export interface PracticeTest {
  id: string;
  kidId: string;
  subject: string;
  title: string;
  questions: PracticeQuestion[];
  dueDate?: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function rowToPracticeTest(r: any): PracticeTest {
  return {
    id: r.id,
    kidId: r.kid_id,
    subject: r.subject,
    title: r.title,
    questions: Array.isArray(r.questions) ? r.questions : [],
    dueDate: r.due_date ?? null,
    active: !!r.active,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

export interface PracticeTestDraft {
  id?: string;
  kidId: string;
  subject: string;
  title: string;
  questions: PracticeQuestion[];
  dueDate?: string | null;
  active?: boolean;
}

export async function fetchPracticeTests(opts: { kidId?: string; active?: boolean } = {}): Promise<PracticeTest[]> {
  const params = new URLSearchParams();
  if (opts.kidId) params.set("kidId", opts.kidId);
  if (opts.active !== undefined) params.set("active", String(opts.active));
  const res = await fetch(`/api/practice-tests?${params.toString()}`);
  if (!res.ok) return [];
  const json = await res.json();
  return (json.tests ?? []) as PracticeTest[];
}

export async function savePracticeTest(draft: PracticeTestDraft): Promise<{ ok: boolean; error?: string; test?: PracticeTest }> {
  const res = await fetch("/api/practice-tests", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(draft),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) return { ok: false, error: json.error || "Could not save." };
  return { ok: true, test: json.test };
}

export async function deletePracticeTest(id: string): Promise<{ ok: boolean; error?: string }> {
  const res = await fetch(`/api/practice-tests?id=${encodeURIComponent(id)}`, { method: "DELETE" });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) return { ok: false, error: json.error || "Could not delete." };
  return { ok: true };
}
