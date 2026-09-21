"use client";

import { useEffect, useRef, useState } from "react";
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
      resolve({ data: result.slice(result.indexOf(",") + 1), mediaType: file.type || "image/jpeg" });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

const KIDS = [
  { id: "titus", name: "Titus", color: "#2563eb" },
  { id: "mercy", name: "Mercy", color: "#D4508A" },
  { id: "lois", name: "Lois", color: "#C026D3" },
  { id: "truma", name: "Truma", color: "#0BABB9" },
];

const KINDS: { id: WordListType; label: string; hint: string }[] = [
  { id: "vocab", label: "Words", hint: "vocab list" },
  { id: "spelling", label: "Spelling", hint: "spelling list" },
  { id: "memory", label: "Memory", hint: "poem or verse" },
  { id: "facts", label: "Study guide", hint: "science, history, map, anything to quiz" },
];

export default function WordListEditor() {
  const [kid, setKid] = useState("titus");
  const [type, setType] = useState<WordListType>("vocab");
  const [lists, setLists] = useState<WordList[]>([]);
  const [title, setTitle] = useState("");
  const [words, setWords] = useState<WordEntry[]>([]);
  const [extracting, setExtracting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");
  const cameraRef = useRef<HTMLInputElement>(null);
  const rollRef = useRef<HTMLInputElement>(null);
  const kidMeta = KIDS.find((k) => k.id === kid)!;

  async function reload() {
    setLists(await fetchWordLists({ kidId: kid }));
  }
  useEffect(() => {
    reload();
    if (kid === "lois") setType("memory");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kid]);

  function flash(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 2800);
  }

  async function readPhoto(file: File) {
    setExtracting(true);
    try {
      const { data, mediaType } = await fileToBase64(file);
      const res = await fetch("/api/word-lists/extract", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ image: data, mediaType, type }),
      });
      const json = await res.json();
      if (!res.ok) {
        flash(json.error || "Could not read that photo. Try again closer.");
        return;
      }
      const parsed: WordEntry[] = (json.words ?? []).map((w: WordEntry) => ({
        word: w.word,
        definition: w.definition,
        example: w.example,
      }));
      setWords(parsed);
      setTitle(json.title || title || `${kidMeta.name} ${KINDS.find((k) => k.id === type)?.label}`);
      flash(`Got ${parsed.length}. Check, then save.`);
    } catch {
      flash("Could not read that photo.");
    } finally {
      setExtracting(false);
      if (cameraRef.current) cameraRef.current.value = "";
      if (rollRef.current) rollRef.current.value = "";
    }
  }

  async function save() {
    const clean = words.filter((w) => w.word.trim());
    if (!title.trim() || clean.length === 0) {
      flash("Need a title and at least one line.");
      return;
    }
    setSaving(true);
    const res = await saveWordList({
      kidId: kid,
      type,
      title: title.trim(),
      words: clean,
      active: true,
    });
    setSaving(false);
    if (!res.ok) {
      flash(res.error || "Could not save.");
      return;
    }
    flash(`Saved for ${kidMeta.name}. It's on their screen.`);
    setWords([]);
    setTitle("");
    reload();
  }

  return (
    <main style={{ minHeight: "100vh", background: "var(--surface-page)", color: "var(--text)", padding: "20px 16px 48px" }}>
      <div style={{ maxWidth: 440, margin: "0 auto" }}>
        <a href="/parent" style={{ color: "var(--text-muted)", fontSize: 14, fontWeight: 600, textDecoration: "none" }}>Parent desk</a>
        <h1 style={{ fontFamily: "Georgia, serif", fontSize: 32, fontWeight: 700, margin: "6px 0 6px" }}>Send them work</h1>
        <p style={{ color: "var(--text-muted)", fontSize: 15, margin: "0 0 20px" }}>
          Photo the page from school. I read it. They study it on the phone or iPad.
        </p>

        <p style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>Who</p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
          {KIDS.map((k) => (
            <button key={k.id} onClick={() => setKid(k.id)} style={{ minHeight: 48, padding: "0 16px", borderRadius: 999, border: `2px solid ${k.color}`, background: kid === k.id ? k.color : "#fff", color: kid === k.id ? "#fff" : "var(--text)", fontWeight: 700, cursor: "pointer" }}>
              {k.name}
            </button>
          ))}
        </div>

        <p style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>What is the page</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 18 }}>
          {KINDS.map((k) => (
            <button key={k.id} onClick={() => setType(k.id)} style={{ minHeight: 64, padding: "10px 12px", borderRadius: 16, border: type === k.id ? "2px solid var(--ink)" : "1px solid var(--border)", background: type === k.id ? "#fff" : "var(--surface)", textAlign: "left", cursor: "pointer" }}>
              <div style={{ fontWeight: 800 }}>{k.label}</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{k.hint}</div>
            </button>
          ))}
        </div>

        <input ref={cameraRef} type="file" accept="image/*" capture="environment" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) readPhoto(f); }} />
        <input ref={rollRef} type="file" accept="image/*" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) readPhoto(f); }} />

        <button onClick={() => cameraRef.current?.click()} disabled={extracting} style={{ width: "100%", minHeight: 64, borderRadius: 18, border: "none", background: kidMeta.color, color: "#fff", fontWeight: 800, fontSize: 18, cursor: "pointer", marginBottom: 10 }}>
          {extracting ? "Reading the page…" : "Take a photo"}
        </button>
        <button onClick={() => rollRef.current?.click()} disabled={extracting} style={{ width: "100%", minHeight: 52, borderRadius: 18, border: "1.5px solid var(--border)", background: "#fff", color: "var(--text)", fontWeight: 700, fontSize: 16, cursor: "pointer" }}>
          Choose from camera roll
        </button>

        {words.length > 0 && (
          <div style={{ marginTop: 22, background: "#fff", border: "1px solid var(--border)", borderRadius: 18, padding: 16 }}>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" style={{ width: "100%", fontSize: 18, fontWeight: 700, border: "none", borderBottom: "1px solid var(--border)", padding: "8px 0", marginBottom: 12, outline: "none", background: "transparent", color: "var(--text)" }} />
            {words.map((w, i) => (
              <div key={i} style={{ padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
                <input value={w.word} onChange={(e) => { const next = [...words]; next[i] = { ...next[i], word: e.target.value }; setWords(next); }} style={{ width: "100%", border: "none", fontWeight: 700, fontSize: 16, outline: "none", background: "transparent" }} />
                {(type === "vocab" || type === "facts") && (
                  <input value={w.definition ?? ""} onChange={(e) => { const next = [...words]; next[i] = { ...next[i], definition: e.target.value }; setWords(next); }} placeholder={type === "facts" ? "Answer" : "Definition"} style={{ width: "100%", border: "none", fontSize: 14, color: "var(--text-muted)", outline: "none", background: "transparent", marginTop: 4 }} />
                )}
              </div>
            ))}
            <button onClick={save} disabled={saving} style={{ width: "100%", minHeight: 56, marginTop: 16, borderRadius: 999, border: "none", background: kidMeta.color, color: "#fff", fontWeight: 800, fontSize: 16, cursor: "pointer" }}>
              {saving ? "Saving…" : `Save for ${kidMeta.name}`}
            </button>
          </div>
        )}

        <div style={{ marginTop: 28 }}>
          <p style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>Already on their screen</p>
          {lists.filter((l) => l.active).map((l) => (
            <div key={l.id} style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 14, padding: "12px 14px", marginBottom: 8, display: "flex", justifyContent: "space-between", gap: 10 }}>
              <div>
                <div style={{ fontWeight: 700 }}>{l.title}</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{l.type === "facts" ? "Study guide" : l.type} · {l.words.length}</div>
              </div>
              <button onClick={async () => { await deleteWordList(l.id); reload(); }} style={{ background: "none", border: "none", color: "var(--text-muted)", fontWeight: 700, cursor: "pointer" }}>Remove</button>
            </div>
          ))}
        </div>
      </div>
      {toast && (
        <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", background: "#171411", color: "#fff", borderRadius: 999, padding: "12px 18px", fontWeight: 700, fontSize: 14 }}>{toast}</div>
      )}
    </main>
  );
}
