"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { OPENAI_VOICE, useTTS } from "@/lib/tts";
import { reportLessonToHomeward, TIER_META } from "@/lib/homeward";
import { MASTERY_PCT } from "@/lib/curriculum-spine/results";
import type { WordList } from "@/lib/word-lists";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface Props {
  kidId: string;
  list: WordList;
  onDone: () => void;
}

export default function WordDrill({ kidId, list, onDone }: Props) {
  const voice = OPENAI_VOICE[kidId] ?? "nova";
  const { speak } = useTTS(voice);
  const [index, setIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [phase, setPhase] = useState<"prompt" | "answered" | "results">("prompt");
  const [chosen, setChosen] = useState<string | null>(null);
  const [typed, setTyped] = useState("");
  const [reported, setReported] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const current = list.words[index];
  const isLast = index === list.words.length - 1;

  const choices = useMemo(() => {
    if (list.type !== "vocab" || !current) return [];
    const others = list.words.filter((w) => w !== current && w.definition?.trim());
    const distractors = shuffle(others).slice(0, 3).map((w) => w.definition as string);
    return shuffle([current.definition ?? "", ...distractors]);
  }, [current, list]);

  useEffect(() => {
    if (!current) return;
    setPhase("prompt");
    setChosen(null);
    setTyped("");
    if (list.type === "spelling") setTimeout(() => inputRef.current?.focus(), 200);
  }, [index, current, list.type]);

  function next() {
    if (isLast) setPhase("results");
    else setIndex((i) => i + 1);
  }

  function answerVocab(choice: string) {
    if (phase === "answered") return;
    setChosen(choice);
    setPhase("answered");
    if (choice === current.definition) setCorrectCount((c) => c + 1);
  }

  function submitSpelling() {
    if (phase === "answered") return;
    const right = typed.trim().toLowerCase() === current.word.trim().toLowerCase();
    setPhase("answered");
    if (right) setCorrectCount((c) => c + 1);
  }

  const pct = list.words.length ? Math.round((correctCount / list.words.length) * 100) : 0;
  const mastered = pct >= MASTERY_PCT;

  useEffect(() => {
    if (phase !== "results" || reported) return;
    setReported(true);
    if (mastered) {
      reportLessonToHomeward({
        kid: kidId,
        subject: list.type,
        lessonId: list.id,
        minutesEarned: TIER_META.quick.minutes,
        lessonTitle: list.title,
        tier: "quick",
      });
    }
  }, [phase, reported, mastered, kidId, list.id, list.type, list.title]);

  if (!current) return null;

  if (phase === "results") {
    return (
      <div style={{ minHeight: "100vh", background: "var(--surface-page)", color: "var(--text)", display: "grid", placeItems: "center", padding: 24 }}>
        <div style={{ maxWidth: 420, width: "100%", textAlign: "center" }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 30, fontWeight: 600 }}>{correctCount} / {list.words.length}</div>
          <p style={{ color: "var(--text-muted)", marginTop: 4 }}>{pct}% on {list.title}</p>
          {mastered ? (
            <p style={{ marginTop: 12, color: "var(--success-ink)", fontWeight: 600 }}>Nice work. That earned a quick credit in Homeward.</p>
          ) : (
            <p style={{ marginTop: 12, color: "var(--text-muted)" }}>Needs {MASTERY_PCT}% to earn credit. Try it again?</p>
          )}
          <div style={{ display: "flex", gap: 12, marginTop: 24, justifyContent: "center" }}>
            {!mastered && (
              <button onClick={() => { setIndex(0); setCorrectCount(0); setReported(false); setPhase("prompt"); }} style={{ minHeight: 52, padding: "0 24px", borderRadius: "var(--r-full)", background: "var(--accent)", color: "var(--accent-contrast)", border: "none", fontWeight: 600, cursor: "pointer" }}>Try again</button>
            )}
            <button onClick={onDone} style={{ minHeight: 52, padding: "0 24px", borderRadius: "var(--r-full)", background: "var(--surface)", color: "var(--text)", border: "1px solid var(--border)", fontWeight: 600, cursor: "pointer" }}>Done</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--surface-page)", color: "var(--text)", padding: "24px 20px" }}>
      <div style={{ maxWidth: 480, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <button onClick={onDone} style={{ background: "none", border: "none", color: "var(--text-muted)", fontWeight: 600, cursor: "pointer" }}>Exit</button>
          <span style={{ fontSize: 13, color: "var(--text-muted)" }}>{index + 1} / {list.words.length}</span>
        </div>
        <div style={{ height: 8, background: "color-mix(in srgb, var(--accent) 18%, var(--surface))", borderRadius: "var(--r-full)", overflow: "hidden", marginBottom: 24 }}>
          <div style={{ height: "100%", width: `${(index / list.words.length) * 100}%`, background: "var(--accent)" }} />
        </div>

        {list.type === "spelling" ? (
          <>
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <button onClick={() => speak(current.word)} style={{ minHeight: 56, padding: "0 22px", borderRadius: 999, border: "none", background: "var(--accent)", color: "#fff", fontWeight: 700, fontSize: 16, cursor: "pointer" }}>Hear the word</button>
              <p style={{ color: "var(--text-muted)", fontSize: 14, marginTop: 10 }}>Tap hear, then type it.</p>
            </div>
            <input ref={inputRef} value={typed} onChange={(e) => setTyped(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submitSpelling()} disabled={phase === "answered"} placeholder="Type what you hear" autoCapitalize="off" autoCorrect="off" spellCheck={false} style={{ width: "100%", fontSize: 22, textAlign: "center", padding: "16px 18px", borderRadius: "var(--r-lg)", border: `2px solid ${phase === "answered" ? (typed.trim().toLowerCase() === current.word.toLowerCase() ? "var(--success)" : "var(--danger)") : "var(--border)"}`, background: "var(--surface)", color: "var(--text)", outline: "none" }} />
            {phase === "answered" && typed.trim().toLowerCase() !== current.word.toLowerCase() && (
              <p style={{ marginTop: 10, textAlign: "center", color: "var(--danger-ink)", fontWeight: 600 }}>Correct spelling: {current.word}</p>
            )}
            <button onClick={phase === "answered" ? next : submitSpelling} disabled={phase === "prompt" && !typed.trim()} style={{ marginTop: 20, width: "100%", minHeight: 56, borderRadius: "var(--r-full)", background: "var(--accent)", color: "var(--accent-contrast)", border: "none", fontWeight: 600, fontSize: 17, cursor: "pointer", opacity: phase === "prompt" && !typed.trim() ? 0.5 : 1 }}>
              {phase === "answered" ? (isLast ? "See results" : "Next") : "Check"}
            </button>
          </>
        ) : (
          <>
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 34, fontWeight: 600 }}>{current.word}</div>
              <button onClick={() => speak(current.word)} style={{ marginTop: 10, minHeight: 44, padding: "0 16px", borderRadius: 999, border: "1px solid var(--border)", background: "var(--surface)", color: "var(--text)", fontWeight: 700, cursor: "pointer" }}>Hear</button>
              <p style={{ color: "var(--text-muted)", fontSize: 14, marginTop: 8 }}>Which is the definition?</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {choices.map((c, i) => {
                const isCorrect = c === current.definition;
                const isChosen = c === chosen;
                let border = "var(--border)";
                let bg = "var(--surface)";
                if (phase === "answered") {
                  if (isCorrect) { border = "var(--success)"; bg = "color-mix(in srgb, var(--success) 12%, var(--surface))"; }
                  else if (isChosen) { border = "var(--danger)"; bg = "color-mix(in srgb, var(--danger) 12%, var(--surface))"; }
                }
                return (
                  <button key={i} onClick={() => answerVocab(c)} disabled={phase === "answered"} style={{ textAlign: "left", minHeight: 52, padding: "14px 16px", borderRadius: "var(--r-lg)", border: `2px solid ${border}`, background: bg, color: "var(--text)", cursor: "pointer", fontSize: 15 }}>{c}</button>
                );
              })}
            </div>
            {phase === "answered" && current.example && (
              <p style={{ marginTop: 14, fontSize: 14, color: "var(--text-muted)", fontStyle: "italic" }}>{current.example}</p>
            )}
            {phase === "answered" && (
              <button onClick={next} style={{ marginTop: 18, width: "100%", minHeight: 56, borderRadius: "var(--r-full)", background: "var(--accent)", color: "var(--accent-contrast)", border: "none", fontWeight: 600, fontSize: 17, cursor: "pointer" }}>
                {isLast ? "See results" : "Next"}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
