"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  fetchWordLists,
  saveWordList,
  deleteWordList,
  type WordList,
  type WordEntry,
  type WordListType,
} from "@/lib/word-lists";

function fileToBase64(file: File): Promise<{ data: string; mediaType: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const comma = result.indexOf(",");
      resolve({ data: result.slice(comma + 1), mediaType: file.type || "image/jpeg" });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

const KIDS: { id: string; name: string; emoji: string; color: string }[] = [
  { id: "titus", name: "Titus", emoji: "\ud83c\udfa3", color: "#2563eb" },
  { id: "mercy", name: "Mercy", emoji: "\ud83c\udf38", color: "#D4508A" },
  { id: "lois", name: "Lois", emoji: "\ud83d\udc51", color: "#C026D3" },
  { id: "truma", name: "Truma", emoji: "\ud83c\udf3b", color: "#0BABB9" },
];

const TYPES: { id: WordListType; label: string; emoji: string }[] = [
  { id: "vocab", label: "Words", emoji: "\ud83d\udcd6" },
  { id: "spelling", label: "Spelling", emoji: "\ud83d\udd24" },
  { id: "memory", label: "Memory", emoji: "\ud83c\udccf" },
];

interface Draft {
  id?: string;
  title: string;
  dueDate: string;
  words: WordEntry[];
}

function blankDraft(): Draft {
  return { title: "", dueDate: "", words: [{ word: "" }] };
}
function draftFromList(l: WordList): Draft {
  return { id: l.id, title: l.title, dueDate: l.dueDate ?? "", words: l.words.length ? l.words : [{ word: "" }] };
}

export default function WordListEditor() {
  const [kid, setKid] = useState("titus");
  const [type, setType] = useState<WordListType>("vocab");
  const [lists, setLists] = useState<WordList[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Draft | null>(null);
  const [bulkInput, setBulkInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");
  const [extracting, setExtracting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const kidMeta = KIDS.find((k) => k.id === kid)!;
  const lois = kid === "lois";

  async function reload() {
    setLoading(true);
    setLists(await fetchWordLists({ kidId: kid }));
    setLoading(false);
  }

  useEffect(() => {
    reload();
    if (kid === "lois") setType("memory");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kid]);

  const visible = useMemo(() => lists.filter((l) => l.type === type), [lists, type]);
  function flash(msg: string) { setToast(msg); setTimeout(() => setToast(""), 2500); }
  function openNew() { setBulkInput(""); setEditing(blankDraft()); }
  function openEdit(l: WordList) { setBulkInput(""); setEditing(draftFromList(l)); }

  function applyBulk() {
    if (!editing || !bulkInput.trim()) return;
    const lines = bulkInput.split("\n").map((l) => l.trim()).filter(Boolean);
    const parsed: WordEntry[] = lines.map((line) => {
      const idx = line.indexOf(":");
      if (type === "vocab" && idx > -1) return { word: line.slice(0, idx).trim(), definition: line.slice(idx + 1).trim() };
      return { word: line };
    });
    const existing = editing.words.filter((w) => w.word.trim());
    setEditing({ ...editing, words: [...existing, ...parsed] });
    setBulkInput("");
    flash(`Added ${parsed.length}.`);
  }

  async function handlePhoto(file: File) {
    if (!editing) return;
    setExtracting(true);
    try {
      const { data, mediaType } = await fileToBase64(file);
      const res = await fetch("/api/word-lists/extract", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ image: data, mediaType, type }),
      });
      const json = await res.json();
      if (!res.ok) { flash(json.error || "Couldn't read that photo."); return; }
      const parsed: WordEntry[] = (json.words ?? []).map((w: WordEntry) => ({ word: w.word, definition: w.definition, example: w.example }));
      const existing = editing.words.filter((w) => w.word.trim());
      setEditing({ ...editing, words: [...existing, ...parsed] });
      flash(`Read ${parsed.length} from the photo. Check them over.`);
    } catch {
      flash("Couldn't read that photo.");
    } finally {
      setExtracting(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function save() {
    if (!editing) return;
    const words = editing.words.filter((w) => w.word.trim());
    if (!editing.title.trim() || words.length === 0) {
      flash(type === "memory" ? "Give it a title and at least one line." : "Give it a title and at least one word.");
      return;
    }
    setSaving(true);
    const res = await saveWordList({ id: editing.id, kidId: kid, type, title: editing.title.trim(), words, dueDate: editing.dueDate || null, active: true });
    setSaving(false);
    if (!res.ok) { flash(res.error || "Could not save."); return; }
    flash("Saved. It's on their screen now.");
    setEditing(null);
    reload();
  }

  async function toggleActive(l: WordList) {
    const res = await saveWordList({ id: l.id, kidId: l.kidId, type: l.type, title: l.title, words: l.words, dueDate: l.dueDate, active: !l.active });
    if (res.ok) reload();
  }

  async function remove(id: string) {
    const res = await deleteWordList(id);
    if (res.ok) { flash("Deleted."); setEditing(null); reload(); }
    else flash(res.error || "Could not delete.");
  }

  const itemNoun = type === "memory" ? "line" : "word";

  return (
    <main className="min-h-screen px-4 py-6" style={{ background: "#f5f0e6", color: "#171411" }}>
      <div className="mx-auto w-full max-w-2xl">
        <a href="/parent" className="text-sm" style={{ color: "#6b7280" }}>← Parent desk</a>
        <h1 className="mt-1 text-3xl font-black" style={{ fontFamily: "Georgia, serif" }}>This week</h1>
        <p className="mt-1 text-sm" style={{ color: "#5c5b4a" }}>
          {lois ? "Pick a letter, a short rhyme, or a verse. Hand Lois the iPad. She taps Listen." : "Photo the list from school or paste it. It shows up on their iPad right away."}
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {KIDS.map((k) => (
            <button key={k.id} onClick={() => setKid(k.id)} className="rounded-full px-4 py-2 text-sm font-bold active:scale-95 transition-transform"
              style={{ background: kid === k.id ? k.color : "#fff", color: kid === k.id ? "#fff" : "#171411", border: `2px solid ${k.color}` }}>
              {k.emoji} {k.name}
            </button>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {TYPES.map((t) => (
            <button key={t.id} onClick={() => setType(t.id)} className="rounded-full px-4 py-1.5 text-sm font-bold active:scale-95 transition-transform"
              style={{ background: type === t.id ? "#171411" : "#fff", color: type === t.id ? "#fff" : "#171411", border: "2px solid #e5decf" }}>
              {t.emoji} {t.label}
            </button>
          ))}
        </div>
        {loading && <p className="mt-6 text-sm text-gray-500">Loading…</p>}
        <div className="mt-6 space-y-3">
          {visible.map((l) => (
            <button key={l.id} onClick={() => openEdit(l)} className="w-full rounded-2xl p-4 text-left active:scale-[0.99] transition-transform"
              style={{ background: "#fff", border: `2px solid ${l.active ? kidMeta.color : "#e5decf"}`, opacity: l.active ? 1 : 0.6 }}>
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold" style={{ color: "#171411" }}>{l.title}</span>
                <span className="text-xs font-bold uppercase tracking-wide" style={{ color: l.active ? kidMeta.color : "#9ca3af" }}>{l.active ? "On their iPad" : "Paused"}</span>
              </div>
              <p className="mt-1 text-xs" style={{ color: "#5c5b4a" }}>{l.words.length} {itemNoun}{l.words.length === 1 ? "" : "s"}{l.dueDate ? ` · due ${l.dueDate}` : ""}</p>
            </button>
          ))}
          {!loading && visible.length === 0 && (
            <p className="text-sm" style={{ color: "#5c5b4a" }}>
              {type === "memory" ? `No memory pieces for ${kidMeta.name} yet. A poem, a verse, or one catechism answer is enough.` : `No ${type === "spelling" ? "spelling" : "word"} lists for ${kidMeta.name} yet.`}
            </p>
          )}
        </div>
        <button onClick={openNew} className="mt-4 w-full rounded-full px-4 py-3 text-sm font-black active:scale-95 transition-transform" style={{ background: kidMeta.color, color: "#fff" }}>
          + New {TYPES.find((t) => t.id === type)?.label.toLowerCase()} for {kidMeta.name}
        </button>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" style={{ background: "rgba(0,0,0,0.4)" }} onClick={() => setEditing(null)}>
          <div className="w-full sm:max-w-2xl max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl p-5" style={{ background: "#fff" }} onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black" style={{ fontFamily: "Georgia, serif" }}>{editing.id ? "Edit" : "New"} {TYPES.find((t) => t.id === type)?.label.toLowerCase()}</h2>
              <button onClick={() => setEditing(null)} className="text-2xl leading-none" style={{ color: "#9ca3af" }}>×</button>
            </div>
            <label className="mt-3 block">
              <span className="text-xs font-bold" style={{ color: "#5c5b4a" }}>Title</span>
              <input className="tf-input" placeholder={type === "memory" ? "e.g. The Swing, or Psalm 23" : type === "vocab" ? "e.g. Unit 3 Vocabulary" : "e.g. Week of spelling"} value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
            </label>
            <label className="mt-3 block">
              <span className="text-xs font-bold" style={{ color: "#5c5b4a" }}>Due date (optional)</span>
              <input type="date" className="tf-input" value={editing.dueDate} onChange={(e) => setEditing({ ...editing, dueDate: e.target.value })} />
            </label>
            <div className="mt-4 rounded-2xl p-3" style={{ background: "#faf7f0", border: "1px solid #ece5d6" }}>
              <p className="text-xs font-bold" style={{ color: "#5c5b4a" }}>{type === "memory" ? "Paste the poem or verse, one line per line" : type === "vocab" ? "Paste words, one per line — word: definition works too" : "Paste words, one per line"}</p>
              <textarea className="tf-input" rows={4} value={bulkInput} onChange={(e) => setBulkInput(e.target.value)} placeholder={type === "memory" ? "How do you like to go up in a swing,\nUp in the air so blue?" : type === "vocab" ? "photosynthesis: how plants turn light into food" : "necessary\nseparate\ndefinitely"} />
              <button onClick={applyBulk} disabled={!bulkInput.trim()} className="mt-2 rounded-full px-3 py-1.5 text-xs font-bold disabled:opacity-50" style={{ background: kidMeta.color, color: "#fff" }}>Add to list</button>
            </div>
            <div className="mt-3 rounded-2xl p-3" style={{ background: "#faf7f0", border: "1px solid #ece5d6" }}>
              <p className="text-xs font-bold" style={{ color: "#5c5b4a" }}>Or take a photo of the real page</p>
              <p className="text-xs" style={{ color: "#9ca3af" }}>I'll read it. Check it over before saving.</p>
              <input ref={fileInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => { const file = e.target.files?.[0]; if (file) handlePhoto(file); }} />
              <button onClick={() => fileInputRef.current?.click()} disabled={extracting} className="mt-2 rounded-full px-3 py-1.5 text-xs font-bold disabled:opacity-50" style={{ background: "#fff", color: kidMeta.color, border: `2px solid ${kidMeta.color}` }}>{extracting ? "Reading the photo…" : "Upload a photo"}</button>
            </div>
            <div className="mt-4">
              <p className="text-sm font-bold">{type === "memory" ? "Lines" : "Words"} ({editing.words.filter((w) => w.word.trim()).length})</p>
              {editing.words.map((w, i) => (
                <div key={i} className="mt-2 rounded-xl p-3" style={{ background: "#faf7f0", border: "1px solid #ece5d6" }}>
                  <div className="flex items-center gap-2">
                    <input className="tf-input" style={{ marginTop: 0 }} placeholder={type === "memory" ? `Line ${i + 1}` : "Word"} value={w.word} onChange={(e) => { const words = [...editing.words]; words[i] = { ...words[i], word: e.target.value }; setEditing({ ...editing, words }); }} />
                    <button onClick={() => { const words = editing.words.filter((_, idx) => idx !== i); setEditing({ ...editing, words: words.length ? words : [{ word: "" }] }); }} className="flex-shrink-0 text-lg" style={{ color: "#9ca3af" }} aria-label="Remove">×</button>
                  </div>
                  {type === "vocab" && (
                    <>
                      <input className="tf-input" placeholder="Definition" value={w.definition ?? ""} onChange={(e) => { const words = [...editing.words]; words[i] = { ...words[i], definition: e.target.value }; setEditing({ ...editing, words }); }} />
                      <input className="tf-input" placeholder="Example sentence (optional)" value={w.example ?? ""} onChange={(e) => { const words = [...editing.words]; words[i] = { ...words[i], example: e.target.value }; setEditing({ ...editing, words }); }} />
                    </>
                  )}
                </div>
              ))}
              <button onClick={() => setEditing({ ...editing, words: [...editing.words, { word: "" }] })} className="mt-2 rounded-full px-3 py-1.5 text-sm font-bold" style={{ background: "#fff", color: kidMeta.color, border: `2px dashed ${kidMeta.color}` }}>+ Add a {itemNoun}</button>
            </div>
            <div className="mt-5 flex items-center gap-3">
              <button onClick={save} disabled={saving} className="flex-1 rounded-full px-5 py-3 text-sm font-black disabled:opacity-50" style={{ background: kidMeta.color, color: "#fff" }}>{saving ? "Saving…" : "Save — it's on their iPad"}</button>
              {editing.id && (<button onClick={() => remove(editing.id!)} className="rounded-full px-4 py-3 text-sm font-bold" style={{ background: "#f3f4f6", color: "#991b1b" }}>Delete</button>)}
            </div>
            {editing.id && (
              <button onClick={() => { const l = lists.find((x) => x.id === editing.id); if (l) toggleActive(l); setEditing(null); }} className="mt-2 w-full rounded-full px-4 py-2 text-xs font-bold" style={{ background: "#f3f4f6", color: "#5c5b4a" }}>
                {lists.find((x) => x.id === editing.id)?.active ? "Pause (hide from kid)" : "Resume (show to kid)"}
              </button>
            )}
          </div>
          <style>{`.tf-input { width: 100%; margin-top: 8px; border: 1.5px solid #e5decf; border-radius: 12px; padding: 10px 12px; font-size: 15px; color: #171411; background: #faf7f0; outline: none; } .tf-input:focus { border-color: ${kidMeta.color}; background: #fff; }`}</style>
        </div>
      )}
      {toast && (<div className="fixed bottom-5 left-1/2 -translate-x-1/2 rounded-full px-5 py-2.5 text-sm font-bold shadow-lg" style={{ background: "#171411", color: "#fff" }}>{toast}</div>)}
    </main>
  );
}
