"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchWordLists, type WordList } from "@/lib/word-lists";
import WordDrill from "./WordDrill";
import FlashcardStudy from "./FlashcardStudy";

const META: Record<string, { name: string; color: string }> = {
  titus: { name: "Titus", color: "#2563eb" },
  mercy: { name: "Mercy", color: "#D4508A" },
  lois: { name: "Lois", color: "#C026D3" },
  truma: { name: "Truma", color: "#0BABB9" },
};

export default function WordDrillHub({ kidId }: { kidId: string }) {
  const router = useRouter();
  const m = META[kidId] ?? META.titus;
  const [lists, setLists] = useState<WordList[] | null>(null);
  const [picking, setPicking] = useState<WordList | null>(null); // vocab list awaiting quiz/flashcards choice
  const [active, setActive] = useState<WordList | null>(null);
  const [studying, setStudying] = useState<WordList | null>(null);

  useEffect(() => {
    fetchWordLists({ kidId, active: true }).then(setLists);
  }, [kidId]);

  function open(l: WordList) {
    if (l.type === "vocab") setPicking(l);
    else setActive(l);
  }

  const refresh = () => fetchWordLists({ kidId, active: true }).then(setLists);

  if (active) {
    return <WordDrill kidId={kidId} list={active} onDone={() => { setActive(null); refresh(); }} />;
  }
  if (studying) {
    return <FlashcardStudy kidId={kidId} list={studying} onDone={() => setStudying(null)} />;
  }

  const backHref = kidId === "truma" ? "/hub" : `/kids/${kidId}/hub`;

  return (
    <div style={{ minHeight: "100vh", background: "var(--surface-page)", color: "var(--text)" }}>
      <div style={{ maxWidth: 560, margin: "0 auto", padding: "24px 20px 48px" }}>
        <button onClick={() => router.push(backHref)} style={{ background: "none", border: "none", color: "var(--text-muted)", fontWeight: 600, cursor: "pointer", fontSize: 14, marginBottom: 18 }}>
          ← Back
        </button>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 30, fontWeight: 600, marginBottom: 4 }}>
          {m.name}&rsquo;s Drills
        </div>
        <p style={{ color: "var(--text-muted)", marginBottom: 24 }}>Vocab and spelling words Mom assigned.</p>

        {lists === null && <p style={{ color: "var(--text-muted)" }}>Loading&hellip;</p>}
        {lists?.length === 0 && (
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r-xl)", padding: 20, textAlign: "center", color: "var(--text-muted)" }}>
            Nothing assigned right now. Check back soon!
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {lists?.map((l) => (
            <button
              key={l.id}
              onClick={() => open(l)}
              style={{
                textAlign: "left", display: "flex", alignItems: "center", gap: 14,
                background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r-xl)",
                boxShadow: "var(--sh-sm)", padding: "16px 18px", cursor: "pointer",
              }}
            >
              <span style={{ fontSize: 24, width: 44, height: 44, display: "grid", placeItems: "center", background: "var(--accent-tint)", border: "1px solid var(--accent-line)", borderRadius: "var(--r-md)", flexShrink: 0 }}>
                {l.type === "vocab" ? "📖" : "🔤"}
              </span>
              <span style={{ flex: 1, minWidth: 0 }}>
                <span style={{ display: "block", fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 600 }}>{l.title}</span>
                <span style={{ display: "block", fontSize: 13, color: "var(--text-muted)" }}>
                  {l.words.length} word{l.words.length === 1 ? "" : "s"}{l.dueDate ? ` · due ${l.dueDate}` : ""}
                </span>
              </span>
              <span style={{ fontSize: 20, color: "var(--accent-ink)", flexShrink: 0 }}>→</span>
            </button>
          ))}
        </div>
      </div>

      {picking && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.4)" }}
          onClick={() => setPicking(null)}
        >
          <div
            style={{ background: "var(--surface)", borderRadius: "var(--r-xl)", padding: 24, maxWidth: 360, width: "90%", textAlign: "center" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 600, marginBottom: 4 }}>{picking.title}</div>
            <p style={{ color: "var(--text-muted)", fontSize: 14, marginBottom: 18 }}>How do you want to study?</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <button
                onClick={() => { setActive(picking); setPicking(null); }}
                style={{ minHeight: 56, borderRadius: "var(--r-full)", background: "var(--accent)", color: "var(--accent-contrast)", border: "none", fontWeight: 600, fontSize: 16, cursor: "pointer" }}
              >
                🎯 Quiz me (earns credit)
              </button>
              <button
                onClick={() => { setStudying(picking); setPicking(null); }}
                style={{ minHeight: 56, borderRadius: "var(--r-full)", background: "var(--surface)", color: "var(--text)", border: "1px solid var(--border)", fontWeight: 600, fontSize: 16, cursor: "pointer" }}
              >
                🃏 Flashcards (just practice)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
