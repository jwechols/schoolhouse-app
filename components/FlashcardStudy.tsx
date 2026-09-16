"use client";

import { useEffect, useState } from "react";
import { OPENAI_VOICE, useTTS } from "@/lib/tts";
import type { WordList } from "@/lib/word-lists";

// ── Flashcards ────────────────────────────────────────────────────────────────
// Self-paced study, not graded. Tap to flip, arrows to move through the deck.
// No Homeward credit — same as any other ungraded practice mode in this app.

interface Props {
  kidId: string;
  list: WordList;
  onDone: () => void;
}

export default function FlashcardStudy({ kidId, list, onDone }: Props) {
  const voice = OPENAI_VOICE[kidId] ?? "nova";
  const { speak } = useTTS(voice);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const card = list.words[index];

  useEffect(() => {
    setFlipped(false);
  }, [index]);

  function go(delta: number) {
    setIndex((i) => Math.max(0, Math.min(list.words.length - 1, i + delta)));
  }

  if (!card) return null;

  return (
    <div style={{ minHeight: "100vh", background: "var(--surface-page)", color: "var(--text)", padding: "24px 20px" }}>
      <div style={{ maxWidth: 480, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <button onClick={onDone} style={{ background: "none", border: "none", color: "var(--text-muted)", fontWeight: 600, cursor: "pointer" }}>
            ← Exit
          </button>
          <span style={{ fontSize: 13, color: "var(--text-muted)" }}>
            {index + 1} / {list.words.length}
          </span>
        </div>

        <button
          onClick={() => setFlipped((f) => !f)}
          style={{
            width: "100%", minHeight: 260, borderRadius: "var(--r-xl)", border: "1px solid var(--border)",
            background: "var(--surface)", boxShadow: "var(--sh-md)", cursor: "pointer",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            padding: 28, textAlign: "center", gap: 14,
          }}
        >
          {!flipped ? (
            <>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 38, fontWeight: 600 }}>{card.word}</div>
              <div style={{ fontSize: 13, color: "var(--text-muted)" }}>Tap to flip</div>
            </>
          ) : (
            <>
              <div style={{ fontSize: 18, fontWeight: 600, color: "var(--text)" }}>{card.definition || "(no definition)"}</div>
              {card.example && (
                <div style={{ fontSize: 14, color: "var(--text-muted)", fontStyle: "italic" }}>&ldquo;{card.example}&rdquo;</div>
              )}
              <div style={{ fontSize: 13, color: "var(--text-muted)" }}>Tap to flip back</div>
            </>
          )}
        </button>

        <div style={{ display: "flex", justifyContent: "center", marginTop: 14 }}>
          <button
            onClick={(e) => { e.stopPropagation(); speak(card.word); }}
            style={{ fontSize: 24, background: "none", border: "none", cursor: "pointer" }}
            aria-label="Hear the word"
          >
            🔊
          </button>
        </div>

        <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
          <button
            onClick={() => go(-1)}
            disabled={index === 0}
            style={{ flex: 1, minHeight: 52, borderRadius: "var(--r-full)", background: "var(--surface)", color: "var(--text)", border: "1px solid var(--border)", fontWeight: 600, cursor: "pointer", opacity: index === 0 ? 0.5 : 1 }}
          >
            ← Prev
          </button>
          <button
            onClick={() => (index === list.words.length - 1 ? onDone() : go(1))}
            style={{ flex: 1, minHeight: 52, borderRadius: "var(--r-full)", background: "var(--accent)", color: "var(--accent-contrast)", border: "none", fontWeight: 600, cursor: "pointer" }}
          >
            {index === list.words.length - 1 ? "Done" : "Next →"}
          </button>
        </div>
      </div>
    </div>
  );
}
