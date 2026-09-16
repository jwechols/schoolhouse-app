"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { coursesForKid } from "@/lib/curriculum-spine";
import { courseProgress, completedLessonIds } from "@/lib/curriculum-spine/progress";
import { getResults, subjectAccuracy, PASS_PCT } from "@/lib/curriculum-spine/results";
import { ALL_LEARNER_IDS, ALL_LEARNER_NAMES } from "@/lib/kids";

const GREEN = "#33574b";
const AMBER = "#A6442D";

// Parent-facing lesson plan: each kid's full scope & sequence, where they are,
// how they did (scores, so Mom knows they didn't just click through), and the
// ability to assign any lesson for practice. Built for Briana's daily use.
export default function PlanView() {
  const router = useRouter();
  const [kid, setKid] = useState<string>("titus");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [, setMounted] = useState(false);

  // Progress + scores live in localStorage, re-render once mounted so they're real.
  useEffect(() => { setMounted(true); }, []);

  const kids = ALL_LEARNER_IDS;
  const courses = coursesForKid(kid);

  function startLesson(subject: string, lessonId?: string) {
    const q = `?subject=${subject}${lessonId ? `&lessonId=${lessonId}` : ""}`;
    router.push(kid === "truma" ? `/kids/truma/lesson${q}` : `/kids/${kid}/lesson${q}`);
  }

  const eyebrow: React.CSSProperties = {
    fontFamily: "var(--font-body)", fontSize: 11.5, letterSpacing: "0.2em",
    textTransform: "uppercase", color: GREEN,
  };

  return (
    <main style={{ minHeight: "100vh", background: "var(--tfe-cream)", maxWidth: 900, margin: "0 auto",
      padding: "32px 20px 64px" }}>

      <div style={eyebrow}>For Mom</div>
      <h1 style={{ fontFamily: "var(--font-scripture)", fontWeight: 600, fontSize: "clamp(2rem,4vw,2.6rem)",
        color: "var(--ink)", margin: "4px 0 4px" }}>Lesson Plan</h1>
      <p style={{ fontFamily: "var(--font-body)", fontSize: 14.5, color: "var(--muted)", margin: "0 0 20px" }}>
        Each child&rsquo;s full year, where they are now, how they scored, and what&rsquo;s next.
      </p>

      {/* Kid tabs */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
        {kids.map((k) => {
          const info = ALL_LEARNER_NAMES[k];
          const active = k === kid;
          return (
            <button key={k} onClick={() => { setKid(k); setExpanded(null); }}
              style={{ display: "inline-flex", alignItems: "center", gap: 7, cursor: "pointer",
                border: `1px solid ${active ? GREEN : "var(--border)"}`, borderRadius: 99,
                padding: "8px 16px", background: active ? GREEN : "#fff",
                color: active ? "#fff" : "var(--ink-2)", fontFamily: "var(--font-body)",
                fontWeight: 600, fontSize: 14 }}>
              <span>{info?.emoji}</span> {info?.name}
            </button>
          );
        })}
      </div>

      {courses.length === 0 ? (
        <p style={{ fontFamily: "var(--font-body)", color: "var(--muted)", fontSize: 15 }}>
          Courses for {ALL_LEARNER_NAMES[kid]?.name} are being added.
        </p>
      ) : (
        <>
          {/* Up next, the daily driver */}
          <div style={{ background: "#fff", border: `1px solid ${GREEN}33`, borderRadius: 14,
            padding: "18px 20px", marginBottom: 24 }}>
            <div style={{ ...eyebrow, marginBottom: 12 }}>Up next today</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {courses.map((c) => {
                const p = courseProgress(c);
                return (
                  <div key={c.subject} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ fontSize: 20, width: 26, textAlign: "center" }}>{c.emoji}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 14, color: "var(--ink)" }}>
                        {c.subjectLabel}
                      </div>
                      <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--muted)" }}>
                        {p.current ? p.current.title : "Course complete 🎉"}
                      </div>
                    </div>
                    <button onClick={() => startLesson(c.subject, p.current?.id)}
                      style={{ flexShrink: 0, border: "none", borderRadius: 10, cursor: "pointer",
                        background: GREEN, color: "#fff", padding: "9px 16px",
                        fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 13 }}>
                      Start →
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Full scope & sequence per course */}
          <div style={{ ...eyebrow, marginBottom: 6 }}>The whole year</div>
          <p style={{ fontFamily: "var(--font-body)", fontSize: 12.5, color: "var(--muted)", margin: "0 0 12px" }}>
            Tap any lesson to have them practice it. A green ✓ with a score means they did well; an amber ⚠ means a low score worth a redo.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {courses.map((c) => {
              const p = courseProgress(c);
              const open = expanded === c.subject;
              const done = completedLessonIds(c.kidId, c.subject);
              const results = getResults(c.kidId, c.subject);
              const acc = subjectAccuracy(c.kidId, c.subject);
              return (
                <div key={c.subject} style={{ background: "#fff", border: "1px solid var(--border)",
                  borderRadius: 14, overflow: "hidden" }}>
                  <button onClick={() => setExpanded(open ? null : c.subject)}
                    style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, cursor: "pointer",
                      border: "none", background: "transparent", padding: "16px 18px", textAlign: "left" }}>
                    <span style={{ fontSize: 24 }}>{c.emoji}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: "var(--font-scripture)", fontWeight: 600, fontSize: 18, color: "var(--ink)" }}>
                        {c.subjectLabel}
                      </div>
                      <div style={{ fontFamily: "var(--font-body)", fontSize: 12.5, color: "var(--muted)", marginTop: 1 }}>
                        {p.done} of {p.total} lessons · {c.units.length} units
                        {acc.graded > 0 ? ` · avg ${acc.avgPct}% correct` : ""}
                      </div>
                      <div style={{ height: 5, borderRadius: 99, background: "rgba(23,20,17,0.06)", marginTop: 8, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${p.pct}%`, background: GREEN, borderRadius: 99 }} />
                      </div>
                    </div>
                    <span style={{ fontSize: 18, color: "var(--muted)" }}>{open ? "▾" : "▸"}</span>
                  </button>

                  {open && (
                    <div style={{ padding: "0 18px 16px 18px" }}>
                      <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--ink-2)",
                        lineHeight: 1.55, margin: "0 0 14px", paddingLeft: 36 }}>{c.overview}</p>
                      {c.units.map((u) => (
                        <div key={u.id} style={{ marginBottom: 14, paddingLeft: 36 }}>
                          <div style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: 13.5,
                            color: c.kidId === "truma" ? "#0B2830" : "var(--ink)" }}>{u.title}</div>
                          <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--muted)", marginBottom: 6 }}>{u.summary}</div>
                          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                            {u.lessons.map((l) => {
                              const isDone = done.has(l.id);
                              const r = results[l.id];
                              return (
                                <button key={l.id} onClick={() => startLesson(c.subject, l.id)}
                                  style={{ display: "flex", alignItems: "center", gap: 8, width: "100%",
                                    textAlign: "left", background: "transparent", border: "none", cursor: "pointer",
                                    padding: "4px 0", fontFamily: "var(--font-body)", fontSize: 13,
                                    color: isDone ? "var(--muted)" : "var(--ink-2)" }}
                                  title="Tap to practice this lesson">
                                  <span style={{ color: isDone ? GREEN : "var(--ink-4)", flexShrink: 0 }}>{isDone ? "✓" : "○"}</span>
                                  <span style={{ flex: 1, minWidth: 0, textDecoration: isDone ? "line-through" : "none" }}>{l.title}</span>
                                  {r && r.total > 0 && (
                                    <span style={{ flexShrink: 0, fontSize: 11.5, fontWeight: 700,
                                      color: r.pct >= PASS_PCT ? GREEN : AMBER,
                                      background: r.pct >= PASS_PCT ? `${GREEN}14` : `${AMBER}14`,
                                      padding: "1px 8px", borderRadius: 99 }}>
                                      {r.pct >= PASS_PCT ? "" : "⚠ "}{r.correct}/{r.total} · {r.pct}%
                                    </span>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      <div style={{ marginTop: 32 }}>
        <button onClick={() => router.push("/")}
          style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-body)",
            fontSize: 13, color: "var(--muted)", textDecoration: "underline" }}>
          ← Back to Schoolhouse
        </button>
      </div>
    </main>
  );
}
