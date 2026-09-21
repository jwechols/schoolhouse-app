// Word lists: one source for phone and iPad.
// Cloud first. If the table is empty or save is blocked, use this device.

export type WordListType = "vocab" | "spelling" | "memory" | "facts";

export interface WordEntry {
  word: string;
  definition?: string;
  example?: string;
}

export interface WordList {
  id: string;
  kidId: string;
  type: WordListType;
  title: string;
  words: WordEntry[];
  dueDate?: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
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

const LS_KEY = "schoolhouse-word-lists-v1";

function nowIso() {
  return new Date().toISOString();
}

function normalizeType(raw: string | undefined): WordListType {
  if (raw === "spelling") return "spelling";
  if (raw === "memory") return "memory";
  if (raw === "facts" || raw === "quiz") return "facts";
  return "vocab";
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function rowToWordList(r: any): WordList {
  return {
    id: r.id,
    kidId: r.kid_id,
    type: normalizeType(r.type),
    title: r.title,
    words: Array.isArray(r.words) ? r.words : [],
    dueDate: r.due_date ?? null,
    active: !!r.active,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

function readLocal(): WordList[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? (JSON.parse(raw) as WordList[]) : [];
  } catch {
    return [];
  }
}

function writeLocal(lists: WordList[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(LS_KEY, JSON.stringify(lists));
}

function starterLists(): WordList[] {
  const createdAt = nowIso();
  return [
    {
      id: "starter-titus-words",
      kidId: "titus",
      type: "vocab",
      title: "Tonight's words",
      active: true,
      dueDate: null,
      createdAt,
      updatedAt: createdAt,
      words: [
        { word: "capital", definition: "the city where a state's government meets" },
        { word: "border", definition: "the line where one place ends and another begins" },
        { word: "region", definition: "a part of a land that shares weather or ground" },
        { word: "gulf", definition: "a large arm of the ocean that cuts into the land" },
        { word: "prairie", definition: "wide, flat grassland" },
      ],
    },
    {
      id: "starter-titus-spell",
      kidId: "titus",
      type: "spelling",
      title: "Tonight's spelling",
      active: true,
      dueDate: null,
      createdAt,
      updatedAt: createdAt,
      words: [{ word: "because" }, { word: "friend" }, { word: "their" }, { word: "people" }, { word: "enough" }],
    },
    {
      id: "starter-mercy-words",
      kidId: "mercy",
      type: "vocab",
      title: "Tonight's words",
      active: true,
      dueDate: null,
      createdAt,
      updatedAt: createdAt,
      words: [
        { word: "gentle", definition: "kind and careful with people and things" },
        { word: "brave", definition: "doing the right thing even when you feel small" },
        { word: "honest", definition: "telling the truth" },
        { word: "patient", definition: "waiting without getting angry" },
      ],
    },
    {
      id: "starter-mercy-spell",
      kidId: "mercy",
      type: "spelling",
      title: "Tonight's spelling",
      active: true,
      dueDate: null,
      createdAt,
      updatedAt: createdAt,
      words: [{ word: "because" }, { word: "friend" }, { word: "would" }, { word: "could" }],
    },
    {
      id: "starter-lois-listen",
      kidId: "lois",
      type: "memory",
      title: "Jesus loves me",
      active: true,
      dueDate: null,
      createdAt,
      updatedAt: createdAt,
      words: [
        { word: "Jesus loves me, this I know" },
        { word: "for the Bible tells me so." },
        { word: "Little ones to Him belong" },
        { word: "they are weak, but He is strong." },
      ],
    },
    {
      id: "starter-truma-memory",
      kidId: "truma",
      type: "memory",
      title: "Psalm 23:1",
      active: true,
      dueDate: null,
      createdAt,
      updatedAt: createdAt,
      words: [{ word: "The Lord is my shepherd; I shall not want." }],
    },
  ];
}

function mergeLists(remote: WordList[], local: WordList[]): WordList[] {
  const map = new Map<string, WordList>();
  for (const l of local) map.set(l.id, l);
  for (const l of remote) map.set(l.id, l);
  return Array.from(map.values()).sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
}

function filterLists(lists: WordList[], opts: { kidId?: string; active?: boolean }) {
  return lists.filter((l) => {
    if (opts.kidId && l.kidId !== opts.kidId) return false;
    if (opts.active !== undefined && l.active !== opts.active) return false;
    return true;
  });
}

export async function fetchWordLists(opts: { kidId?: string; active?: boolean } = {}): Promise<WordList[]> {
  let remote: WordList[] = [];
  try {
    const params = new URLSearchParams();
    if (opts.kidId) params.set("kidId", opts.kidId);
    if (opts.active !== undefined) params.set("active", String(opts.active));
    const res = await fetch(`/api/word-lists?${params.toString()}`);
    if (res.ok) {
      const json = await res.json();
      remote = (json.lists ?? []) as WordList[];
    }
  } catch {
    remote = [];
  }
  const local = readLocal();
  const merged = mergeLists(remote, local);
  if (merged.length > 0) return filterLists(merged, opts);
  return filterLists(starterLists(), opts);
}

export async function saveWordList(draft: WordListDraft): Promise<{ ok: boolean; error?: string; list?: WordList }> {
  try {
    const res = await fetch("/api/word-lists", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(draft),
    });
    const json = await res.json().catch(() => ({}));
    if (res.ok && json.list) {
      const saved = json.list as WordList;
      const next = mergeLists([saved], readLocal().filter((l) => l.id !== saved.id));
      writeLocal(next);
      return { ok: true, list: saved };
    }
  } catch {
    /* fall through to this device */
  }

  const stamp = nowIso();
  const list: WordList = {
    id: draft.id && !draft.id.startsWith("starter-") ? draft.id : `local-${Date.now().toString(36)}`,
    kidId: draft.kidId,
    type: draft.type,
    title: draft.title,
    words: draft.words,
    dueDate: draft.dueDate ?? null,
    active: draft.active ?? true,
    createdAt: stamp,
    updatedAt: stamp,
  };
  const others = readLocal().filter((l) => l.id !== list.id);
  writeLocal([list, ...others]);
  return { ok: true, list };
}

export async function deleteWordList(id: string): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch(`/api/word-lists?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    if (res.ok) {
      writeLocal(readLocal().filter((l) => l.id !== id));
      return { ok: true };
    }
  } catch {
    /* local delete still works */
  }
  writeLocal(readLocal().filter((l) => l.id !== id));
  return { ok: true };
}

export function typeLabel(t: WordListType): string {
  if (t === "spelling") return "Spelling";
  if (t === "memory") return "Memory";
  if (t === "facts") return "Quiz";
  return "Words";
}

export function typeEmoji(t: WordListType): string {
  if (t === "spelling") return "\ud83d\udd24";
  if (t === "memory") return "\ud83c\udccf";
  if (t === "facts") return "?";
  return "\ud83d\udcd6";
}

export function itemNoun(t: WordListType, n = 2): string {
  if (t === "memory") return n === 1 ? "line" : "lines";
  if (t === "facts") return n === 1 ? "question" : "questions";
  return n === 1 ? "word" : "words";
}
