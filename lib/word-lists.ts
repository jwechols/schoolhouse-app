// ── Word lists: Briana's vocab & spelling drills ─────────────────────────────
// A lightweight, standalone content type Briana sets and assigns per kid,
// separate from the curriculum spine. Stored in Supabase `word_lists`, read
// publicly (anon SELECT) so kid drill screens can fetch without the parent
// PIN; writes go through /api/word-lists and require the PIN, same gate as
// curriculum overrides.

export type WordListType = "vocab" | "spelling";

export interface WordEntry {
  word: string;
  /** Vocab only. */
  definition?: string;
  /** Vocab only, optional. */
  example?: string;
}

export interface WordList {
  id: string;
  kidId: string;
  type: WordListType;
  title: string;
  words: WordEntry[];
  dueDate?: string | null; // YYYY-MM-DD
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function rowToWordList(r: any): WordList {
  return {
    id: r.id,
    kidId: r.kid_id,
    type: r.type,
    title: r.title,
    words: Array.isArray(r.words) ? r.words : [],
    dueDate: r.due_date ?? null,
    active: !!r.active,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

export interface WordListDraft {
  id?: string; // present when editing an existing list
  kidId: string;
  type: WordListType;
  title: string;
  words: WordEntry[];
  dueDate?: string | null;
  active?: boolean;
}

/** Fetch a kid's lists (kid drill screens use this, no PIN needed). */
export async function fetchWordLists(opts: { kidId?: string; active?: boolean } = {}): Promise<WordList[]> {
  const params = new URLSearchParams();
  if (opts.kidId) params.set("kidId", opts.kidId);
  if (opts.active !== undefined) params.set("active", String(opts.active));
  const res = await fetch(`/api/word-lists?${params.toString()}`);
  if (!res.ok) return [];
  const json = await res.json();
  return (json.lists ?? []) as WordList[];
}

/** Briana's save (create or update). PIN-gated server-side. */
export async function saveWordList(draft: WordListDraft): Promise<{ ok: boolean; error?: string; list?: WordList }> {
  const res = await fetch("/api/word-lists", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(draft),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) return { ok: false, error: json.error || "Could not save." };
  return { ok: true, list: json.list };
}

export async function deleteWordList(id: string): Promise<{ ok: boolean; error?: string }> {
  const res = await fetch(`/api/word-lists?id=${encodeURIComponent(id)}`, { method: "DELETE" });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) return { ok: false, error: json.error || "Could not delete." };
  return { ok: true };
}
