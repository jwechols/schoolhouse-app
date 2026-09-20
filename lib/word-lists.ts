// ── Word lists: Briana's vocab, spelling, and memory ────────────────
// Lightweight content she assigns per kid, separate from the curriculum spine.
// Stored in Supabase `word_lists`. Kids fetch without the parent PIN; writes
// go through /api/word-lists and require the PIN.

export type WordListType = "vocab" | "spelling" | "memory";

export interface WordEntry {
  word: string;
  /** Vocab definition, or unused for spelling/memory. */
  definition?: string;
  /** Vocab example sentence. For memory, unused (each entry is a line). */
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
  const rawType = r.type === "memory" ? "memory" : r.type === "spelling" ? "spelling" : "vocab";
  return {
    id: r.id,
    kidId: r.kid_id,
    type: rawType,
    title: r.title,
    words: Array.isArray(r.words) ? r.words : [],
    dueDate: r.due_date ?? null,
    active: !!r.active,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

export interface WordListDraft {
  id?: string;
  kidId: string;
  type: WordListType;
  title: string;
  words: WordEntry[];
  dueDate?: string | null;
  active?: boolean;
}

export async function fetchWordLists(opts: { kidId?: string; active?: boolean } = {}): Promise<WordList[]> {
  const params = new URLSearchParams();
  if (opts.kidId) params.set("kidId", opts.kidId);
  if (opts.active !== undefined) params.set("active", String(opts.active));
  const res = await fetch(`/api/word-lists?${params.toString()}`);
  if (!res.ok) return [];
  const json = await res.json();
  return (json.lists ?? []) as WordList[];
}

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

export function typeLabel(t: WordListType): string {
  if (t === "spelling") return "Spelling";
  if (t === "memory") return "Memory";
  return "Words";
}

export function typeEmoji(t: WordListType): string {
  if (t === "spelling") return "🔤";
  if (t === "memory") return "🃏";
  return "📖";
}
