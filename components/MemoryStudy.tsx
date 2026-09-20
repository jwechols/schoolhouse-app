"use client";

import { useEffect, useState } from "react";
import { OPENAI_VOICE, useTTS } from "@/lib/tts";
import type { WordList } from "@/lib/word-lists";

interface Props {
  kidId: string;
  list: WordList;
  onDone: () => void;
}

export default function MemoryStudy({ kidId, list, onDone }: Props) {
  const voice = OPENAI_VOICE[kidId] ?? "nova";
  const { speak } = useTTS(voice);
  const lines = list.words.map((w) => w.word.trim()).filter(Boolean);
  const [index, setIndex] = useState(0);
  const [showAll, setShowAll] = useState(false);
  const big = kidId === "lois" || kidId === "mercy";

  const line = lines[index] ?? "";

  useEffect(() => {
    if (line) speak(line);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  if (lines.length === 0) return null;

  const last = index === lines.length - 1;

  return (
    <div style={{ minHeight: "100vh", background: "var(--surface-page)", color: "var(--text)", padding: "24px 20px" }}>
      <div style={{ maxWidth: 560, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <button onClick={onDone} style={{ background: "none", border: "none", color: "var(--text-muted)", fontWeight: 600, cursor: "pointer" }}>
            ← Done
          </button>
          <span style={{ fontSize: 13, color: "var(--text-muted)" }}>
            {index + 1} / {lines.length}
          </span>
        </div>

        <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 6 }}>
          Memory
        </div>
        <div style={{ fontFamily: "var(--font-display)", fontSize: big ? 28 : 24, fontWeight: 600, marginBottom: 18 }}>
          {list.title}
        </div>

        <button
          onClick={() => speak(showAll ? lines.join(" ") : line)}
          style={{
            width: "100%",
            minHeight: big ? 280 : 220,
            borderRadius: "var(--r-xl)",
            border: "1px solid var(--border)",
            background: "var(--surface)",
            boxShadow: "var(--sh-md)",
            cursor: "pointer",
            padding: 28,
            textAlign: "center",
          }}
        >
          {showAll ? (
            <div style={{ fontFamily: "var(--font-display)", fontSize: big ? 26 : 22, lineHeight: 1.45, whiteSpace: "pre-wrap" }}>
              {lines.join("\n")}
            </div>
          ) : (
            <div style={{ fontFamily: "var(--font-display)", fontSize: big ? 36 : 30, fontWeight: 600, lineHeight: 1.3 }}>
              {line}
            </div>
          )}
          <div style={{ marginTop: 16, fontSize: 14, color: "var(--text-muted)" }}>Tap to hear it again</div>
        </button>

        <div style={{ display: "flex", gap: 12, marginTop: 18 }}>
          <button
            onClick={() => { setShowAll(false); setIndex((i) => Math.max(0, i - 1)); }}
            disabled={index === 0 || showAll}
            style={{ flex: 1, minHeight: 56, borderRadius: "var(--r-full)", background: "var(--surface)", color: "var(--text)", border: "1px solid var(--border)", fontWeight: 600, cursor: "pointer", opacity: index === 0 || showAll ? 0.45 : 1 }}
          >
            ← Back
          </button>
          <button
            onClick={() => {
              if (last || showAll) onDone();
              else setIndex((i) => i + 1);
            }}
            style={{ flex: 2, minHeight: 56, borderRadius: "var(--r-full)", background: "var(--accent)", color: "var(--accent-contrast)", border: "none", fontWeight: 600, fontSize: 17, cursor: "pointer" }}
          >
            {last || showAll ? "All done" : "Next line →"}
          </button>
        </div>

        {lines.length > 1 && (
          <button
            onClick={() => {
              setShowAll((s) => {
                const next = !s;
                if (next) speak(lines.join(" "));
                return next;
              });
            }}
            style={{ marginTop: 12, width: "100%", minHeight: 48, borderRadius: "var(--r-full)", background: "transparent", color: "var(--accent-ink)", border: "1px solid var(--border)", fontWeight: 600, cursor: "pointer" }}
          >
            {showAll ? "Show one line at a time" : "Show the whole thing"}
          </button>
        )}
      </div>
    </div>
  );
}
