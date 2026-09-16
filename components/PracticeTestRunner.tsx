"use client";

import { useEffect, useState } from "react";
import { reportLessonToHomeward, TIER_META, type LessonTier } from "@/lib/homeward";
import { MASTERY_PCT } from "@/lib/curriculum-spine/results";
import type { PracticeTest } from "@/lib/practice-tests";

// ── Practice test runner ──────────────────────────────────────────────────────
// Sequential multiple-choice, self-paced, no timer. 80% mastery gate credits
// Homeward, tier auto-scaled by question count (more questions = more effort).

function tierForQuestionCount(n: number): LessonTier {
  if (n <= 5) return "quick";
  if (n <= 15) return "standard";
  return "deep";
}

interface Props {
  kidId: string;
  test: PracticeTest;
  onDone: () => void;
}

export default function PracticeTestRunner({ kidId, test, onDone }: Props) {
  const [index, setIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [chosen, setChosen] = useState<number | null>(null);
  const [phase, setPhase] = useState<"prompt" | "answered" | "results">("prompt");
  const [reported, setReported] = useState(false);

  const current = test.questions[index];
  const isLast = index === test.questions.length - 1;

  useEffect(() => {
    setChosen(null);
    setPhase("prompt");
  }, [index]);

  function answer(i: number) {
    if (phase === "answered") return;
    setChosen(i);
    setPhase("answered");
    if (i === current.correctIndex) setCorrectCount((c) => c + 1);
  }

  function next() {
    if (isLast) setPhase("results");
    else setIndex((i) => i + 1);
  }

  const pct = test.questions.length ? Math.round((correctCount / test.questions.length) * 100) : 0;
  const mastered = pct >= MASTERY_PCT;
  const tier = tierForQuestionCount(test.questions.length);

  useEffect(() => {
    if (phase !== "results" || reported) return;
    setReported(true);
    if (mastered) {
      reportLessonToHomeward({
        kid: kidId,
        subject: test.subject,
        lessonId: test.id,
        minutesEarned: TIER_META[tier].minutes,
        lessonTitle: test.title,
        tier,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  if (!current) return null;

  if (phase === "results") {
    return (
      <div style={{ minHeight: "100vh", background: "var(--surface-page)", color: "var(--text)", display: "grid", placeItems: "center", padding: 24 }}>
        <div style={{ maxWidth: 420, width: "100%", textAlign: "center" }}>
          <div style={{ fontSize: 48 }}>{mastered ? "🎉" : "📚"}</div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 30, fontWeight: 600, marginTop: 8 }}>
            {correctCount} / {test.questions.length}
          </div>
          <p style={{ color: "var(--text-muted)", marginTop: 4 }}>{pct}% on {test.title}</p>
          {mastered ? (
            <p style={{ marginTop: 12, color: "var(--success-ink)", fontWeight: 600 }}>
              Nice work! That earned a {TIER_META[tier].label.toLowerCase()} credit in Homeward.
            </p>
          ) : (
            <p style={{ marginTop: 12, color: "var(--text-muted)" }}>
              Needs {MASTERY_PCT}% to earn credit. Try it again?
            </p>
          )}
          <div style={{ display: "flex", gap: 12, marginTop: 24, justifyContent: "center" }}>
            {!mastered && (
              <button
                onClick={() => { setIndex(0); setCorrectCount(0); setReported(false); setPhase("prompt"); }}
                style={{ minHeight: 52, padding: "0 24px", borderRadius: "var(--r-full)", background: "var(--accent)", color: "var(--accent-contrast)", border: "none", fontWeight: 600, cursor: "pointer" }}
              >
                Try again
              </button>
            )}
            <button
              onClick={onDone}
              style={{ minHeight: 52, padding: "0 24px", borderRadius: "var(--r-full)", background: "var(--surface)", color: "var(--text)", border: "1px solid var(--border)", fontWeight: 600, cursor: "pointer" }}
            >
              Done
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--surface-page)", color: "var(--text)", padding: "24px 20px" }}>
      <div style={{ maxWidth: 480, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <button onClick={onDone} style={{ background: "none", border: "none", color: "var(--text-muted)", fontWeight: 600, cursor: "pointer" }}>
            ← Exit
          </button>
          <span style={{ fontSize: 13, color: "var(--text-muted)" }}>
            {index + 1} / {test.questions.length}
          </span>
        </div>

        <div style={{ height: 8, background: "color-mix(in srgb, var(--accent) 18%, var(--surface))", borderRadius: "var(--r-full)", overflow: "hidden", marginBottom: 24 }}>
          <div style={{ height: "100%", width: `${(index / test.questions.length) * 100}%`, background: "var(--accent)", transition: "width .4s ease" }} />
        </div>

        <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 18, textAlign: "center" }}>{current.prompt}</div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {current.choices.map((c, i) => {
            const isCorrect = i === current.correctIndex;
            const isChosen = i === chosen;
            let border = "var(--border)";
            let bg = "var(--surface)";
            if (phase === "answered") {
              if (isCorrect) { border = "var(--success)"; bg = "color-mix(in srgb, var(--success) 12%, var(--surface))"; }
              else if (isChosen) { border = "var(--danger)"; bg = "color-mix(in srgb, var(--danger) 12%, var(--surface))"; }
            }
            return (
              <button
                key={i}
                onClick={() => answer(i)}
                disabled={phase === "answered"}
                style={{ textAlign: "left", padding: "14px 16px", borderRadius: "var(--r-lg)", border: `2px solid ${border}`, background: bg, color: "var(--text)", cursor: "pointer", fontSize: 15 }}
              >
                {c}
              </button>
            );
          })}
        </div>

        {phase === "answered" && current.explanation && (
          <p style={{ marginTop: 14, fontSize: 14, color: "var(--text-muted)" }}>{current.explanation}</p>
        )}
        {phase === "answered" && (
          <button
            onClick={next}
            style={{ marginTop: 18, width: "100%", minHeight: 56, borderRadius: "var(--r-full)", background: "var(--accent)", color: "var(--accent-contrast)", border: "none", fontWeight: 600, fontSize: 17, cursor: "pointer" }}
          >
            {isLast ? "See results" : "Next"}
          </button>
        )}
      </div>
    </div>
  );
}
