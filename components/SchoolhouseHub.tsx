"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { coursesForKid } from "@/lib/curriculum-spine";
import { courseProgress } from "@/lib/curriculum-spine/progress";
import { subjectAccuracy, MASTERY_PCT } from "@/lib/curriculum-spine/results";
import type { Course } from "@/lib/curriculum-spine/types";
import { fetchWordLists } from "@/lib/word-lists";
import { fetchPracticeTests } from "@/lib/practice-tests";
import { fetchReadingAssignments } from "@/lib/reading-assignments";
import { isOutsideSchoolToday } from "@/lib/outside-school";
import FloatingTutor from "./FloatingTutor";

// One uniform hub for all four kids. Themed per child via .theme-<kid> (accent
// re-resolves from the design tokens) and driven entirely by the curriculum
// spine, so Titus, Mercy, Lois, and Truma get the SAME layout, differing only by
// accent + content. Rebuilt from the Schoolhouse Design System components
// (tutor medallion, subject cards, primary button).
const META: Record<string, { name: string; grade: string; tutor: string; tutorEmoji: string; school: string }> = {
  titus: { name: "Titus", grade: "3rd Grade",   tutor: "Buck",            tutorEmoji: "🎣", school: "Brookside Academy" },
  mercy: { name: "Mercy", grade: "Kindergarten", tutor: "Princess Rose",  tutorEmoji: "🌹", school: "Midland Classical Academy" },
  lois:  { name: "Lois",  grade: "Pre-K",         tutor: "Princess Crystal", tutorEmoji: "❄️", school: "Home" },
  truma: { name: "Truma", grade: "6th Grade",    tutor: "Lydia",          tutorEmoji: "🪻", school: "Midland Classical Academy" },
};

interface Row {
  subject: string; label: string; emoji: string;
  currentId: string | null; done: number; total: number; mastery: number; graded: number;
}

export default function SchoolhouseHub({ kidId }: { kidId: string }) {
  const router = useRouter();
  const m = META[kidId] ?? META.titus;
  const outsideSchoolToday = isOutsideSchoolToday(kidId);
  const [rows, setRows] = useState<Row[] | null>(null);
  const [today, setToday] = useState<{ subject: string; id: string; title: string } | null>(null);
  const [wordListCount, setWordListCount] = useState(0);
  const [testCount, setTestCount] = useState(0);
  const [readingCount, setReadingCount] = useState(0);

  useEffect(() => {
    fetchWordLists({ kidId, active: true }).then((lists) => setWordListCount(lists.length));
    fetchPracticeTests({ kidId, active: true }).then((tests) => setTestCount(tests.length));
    fetchReadingAssignments({ kidId, active: true }).then((rows) => setReadingCount(rows.filter((r) => r.status !== "approved").length));
  }, [kidId]);

  useEffect(() => {
    const rs: Row[] = coursesForKid(kidId).map((c: Course) => {
      const p = courseProgress(c);
      const acc = subjectAccuracy(kidId, c.subject);
      return {
        subject: c.subject, label: c.subjectLabel, emoji: c.emoji,
        currentId: p.current ? p.current.id : null, done: p.done, total: p.total,
        mastery: acc.graded > 0 ? acc.avgPct : 0, graded: acc.graded,
      };
    });
    setRows(rs);
    const courses = coursesForKid(kidId);
    for (const c of courses) {
      const p = courseProgress(c);
      if (p.current) { setToday({ subject: c.subject, id: p.current.id, title: `${c.subjectLabel}: ${p.current.title}` }); break; }
    }
  }, [kidId]);

  const lessonBase = kidId === "truma" ? "/kids/truma/lesson" : `/kids/${kidId}/lesson`;
  const placeBase = kidId === "truma" ? "/kids/truma/placement" : `/kids/${kidId}/placement`;
  const moneyHref = kidId === "truma" ? "/kids/truma/money" : `/kids/${kidId}/money`;
  const go = (subject: string, lessonId?: string | null) =>
    router.push(`${lessonBase}?subject=${subject}${lessonId ? `&lessonId=${lessonId}` : ""}`);

  const eyebrow: React.CSSProperties = { fontSize: 11, fontWeight: 600, letterSpacing: "0.10em", textTransform: "uppercase", color: "var(--text-muted)" };

  return (
    <div className={`theme-${kidId}`} style={{ minHeight: "100vh", background: "var(--surface-page)", color: "var(--text)", fontFamily: "var(--font-ui)" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px 20px 48px" }}>
        <button onClick={() => router.push("/")} style={{ background: "none", border: "none", color: "var(--text-muted)", fontWeight: 600, cursor: "pointer", fontSize: 14, marginBottom: 18 }}>
          ← Home
        </button>

        {/* Header: tutor medallion + greeting */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 26 }}>
          <div style={{ position: "relative", width: 64, height: 64, flexShrink: 0 }}>
            <div style={{ width: "100%", height: "100%", borderRadius: "var(--r-full)", background: "var(--accent)", color: "var(--accent-contrast)", display: "grid", placeItems: "center", fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 30, boxShadow: "var(--sh-md)" }}>
              {m.tutor[0]}
            </div>
            <div style={{ position: "absolute", right: -4, bottom: -4, width: 28, height: 28, borderRadius: "var(--r-full)", background: "var(--surface)", border: "1px solid var(--border)", display: "grid", placeItems: "center", fontSize: 15, boxShadow: "var(--sh-sm)" }}>
              {m.tutorEmoji}
            </div>
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={eyebrow}>Echols Academy</div>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 32, lineHeight: 1.05, color: "var(--text)" }}>Hello, {m.name}</div>
            <div style={{ fontSize: 14, color: "var(--text-muted)" }}>{m.grade} · with {m.tutor}</div>
          </div>
        </div>

        {/* Today's lesson, or an outside-school note in its place */}
        {outsideSchoolToday ? (
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderTop: "4px solid var(--accent)", borderRadius: "var(--r-xl)", boxShadow: "var(--sh-md)", padding: 22, marginBottom: 28 }}>
            <div style={{ ...eyebrow, color: "var(--accent-ink)", marginBottom: 8 }}>Today</div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 600, lineHeight: 1.12, marginBottom: 6 }}>{m.name} is at {m.school} today</div>
            <div style={{ fontSize: 14, color: "var(--text-muted)" }}>No new lesson today, just school. Everything picks back up on the next home day.</div>
          </div>
        ) : today && (
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderTop: "4px solid var(--accent)", borderRadius: "var(--r-xl)", boxShadow: "var(--sh-md)", padding: 22, marginBottom: 28 }}>
            <div style={{ ...eyebrow, color: "var(--accent-ink)", marginBottom: 8 }}>Today&apos;s lesson</div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 600, lineHeight: 1.12, marginBottom: 18 }}>{today.title}</div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
              <button onClick={() => go(today.subject, today.id)} style={{ minHeight: 56, padding: "0 26px", fontSize: 18, fontWeight: 600, borderRadius: "var(--r-full)", background: "var(--accent)", color: "var(--accent-contrast)", border: "none", cursor: "pointer", boxShadow: "0 2px 0 var(--accent-strong), 0 4px 10px rgba(23,32,58,.14)" }}>
                Start lesson →
              </button>
              <button onClick={() => router.push(`${placeBase}?subject=${today.subject}`)} style={{ minHeight: 56, padding: "0 18px", fontSize: 15, fontWeight: 600, borderRadius: "var(--r-full)", background: "transparent", color: "var(--accent-ink)", border: "none", cursor: "pointer" }}>
                Where do I start?
              </button>
            </div>
          </div>
        )}

        {/* Stewardship: coins, giving, saving, goals — the family economy,
            backed by the Homeward coin ledger (single source of truth). */}
        <button
          onClick={() => router.push(moneyHref)}
          style={{ width: "100%", display: "flex", alignItems: "center", gap: 14, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r-xl)", boxShadow: "var(--sh-sm)", padding: "16px 18px", marginBottom: 28, cursor: "pointer", textAlign: "left" }}
        >
          <span style={{ fontSize: 24, width: 44, height: 44, display: "grid", placeItems: "center", background: "var(--accent-tint)", border: "1px solid var(--accent-line)", borderRadius: "var(--r-md)", flexShrink: 0 }}>🪙</span>
          <span style={{ flex: 1, minWidth: 0 }}>
            <span style={{ display: "block", fontFamily: "var(--font-display)", fontSize: 19, fontWeight: 600, color: "var(--text)" }}>My Stewardship</span>
            <span style={{ display: "block", fontSize: 13, color: "var(--text-muted)" }}>Coins, giving, saving &amp; your goals</span>
          </span>
          <span style={{ fontSize: 20, color: "var(--accent-ink)", flexShrink: 0 }}>→</span>
        </button>

        {/* This week's words: vocab/spelling drills Mom assigned */}
        {wordListCount > 0 && (
          <button
            onClick={() => router.push(kidId === "truma" ? "/kids/truma/words" : `/kids/${kidId}/words`)}
            style={{ width: "100%", display: "flex", alignItems: "center", gap: 14, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r-xl)", boxShadow: "var(--sh-sm)", padding: "16px 18px", marginBottom: 28, cursor: "pointer", textAlign: "left" }}
          >
            <span style={{ fontSize: 24, width: 44, height: 44, display: "grid", placeItems: "center", background: "var(--accent-tint)", border: "1px solid var(--accent-line)", borderRadius: "var(--r-md)", flexShrink: 0 }}>📖</span>
            <span style={{ flex: 1, minWidth: 0 }}>
              <span style={{ display: "block", fontFamily: "var(--font-display)", fontSize: 19, fontWeight: 600, color: "var(--text)" }}>This Week&apos;s Words</span>
              <span style={{ display: "block", fontSize: 13, color: "var(--text-muted)" }}>{wordListCount} list{wordListCount === 1 ? "" : "s"} from Mom</span>
            </span>
            <span style={{ fontSize: 20, color: "var(--accent-ink)", flexShrink: 0 }}>→</span>
          </button>
        )}

        {/* Practice tests Mom assigned */}
        {testCount > 0 && (
          <button
            onClick={() => router.push(kidId === "truma" ? "/kids/truma/tests" : `/kids/${kidId}/tests`)}
            style={{ width: "100%", display: "flex", alignItems: "center", gap: 14, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r-xl)", boxShadow: "var(--sh-sm)", padding: "16px 18px", marginBottom: 28, cursor: "pointer", textAlign: "left" }}
          >
            <span style={{ fontSize: 24, width: 44, height: 44, display: "grid", placeItems: "center", background: "var(--accent-tint)", border: "1px solid var(--accent-line)", borderRadius: "var(--r-md)", flexShrink: 0 }}>🧮</span>
            <span style={{ flex: 1, minWidth: 0 }}>
              <span style={{ display: "block", fontFamily: "var(--font-display)", fontSize: 19, fontWeight: 600, color: "var(--text)" }}>Practice Tests</span>
              <span style={{ display: "block", fontSize: 13, color: "var(--text-muted)" }}>{testCount} test{testCount === 1 ? "" : "s"} from Mom</span>
            </span>
            <span style={{ fontSize: 20, color: "var(--accent-ink)", flexShrink: 0 }}>→</span>
          </button>
        )}

        {/* Reading Mom assigned */}
        {readingCount > 0 && (
          <button
            onClick={() => router.push(kidId === "truma" ? "/kids/truma/reading" : `/kids/${kidId}/reading`)}
            style={{ width: "100%", display: "flex", alignItems: "center", gap: 14, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r-xl)", boxShadow: "var(--sh-sm)", padding: "16px 18px", marginBottom: 28, cursor: "pointer", textAlign: "left" }}
          >
            <span style={{ fontSize: 24, width: 44, height: 44, display: "grid", placeItems: "center", background: "var(--accent-tint)", border: "1px solid var(--accent-line)", borderRadius: "var(--r-md)", flexShrink: 0 }}>📚</span>
            <span style={{ flex: 1, minWidth: 0 }}>
              <span style={{ display: "block", fontFamily: "var(--font-display)", fontSize: 19, fontWeight: 600, color: "var(--text)" }}>Reading</span>
              <span style={{ display: "block", fontSize: 13, color: "var(--text-muted)" }}>{readingCount} book{readingCount === 1 ? "" : "s"} from Mom</span>
            </span>
            <span style={{ fontSize: 20, color: "var(--accent-ink)", flexShrink: 0 }}>→</span>
          </button>
        )}

        {/* Subjects */}
        <div style={{ ...eyebrow, marginBottom: 12 }}>Subjects</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 14 }}>
          {(rows ?? []).map((r) => {
            const mastered = r.graded > 0 && r.mastery >= MASTERY_PCT;
            const pct = r.total ? Math.round((r.done / r.total) * 100) : 0;
            return (
              <button key={r.subject} onClick={() => go(r.subject)}
                style={{ textAlign: "left", background: "var(--accent-tint)", border: "1px solid var(--accent-line)", borderRadius: "var(--r-xl)", boxShadow: "var(--sh-sm)", padding: 18, cursor: "pointer", display: "flex", flexDirection: "column", gap: 10, minHeight: 156 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 24, width: 44, height: 44, display: "grid", placeItems: "center", background: "var(--surface)", border: "1px solid var(--accent-line)", borderRadius: "var(--r-md)" }}>{r.emoji}</span>
                  {mastered && (
                    <span style={{ fontSize: 12, fontWeight: 600, color: "var(--success-ink)", background: "color-mix(in srgb, var(--success) 16%, var(--surface))", padding: "3px 9px", borderRadius: "var(--r-full)" }}>✓ {r.mastery}%</span>
                  )}
                </div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 21, fontWeight: 600, color: "var(--text)" }}>{r.label}</div>
                <div style={{ marginTop: "auto" }}>
                  <div style={{ height: 8, background: "color-mix(in srgb, var(--accent) 18%, var(--surface))", borderRadius: "var(--r-full)", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: "var(--accent)", borderRadius: "var(--r-full)", transition: "width .6s ease" }} />
                  </div>
                  <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 8 }}>{r.done} of {r.total} lessons</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <FloatingTutor kidId={kidId} />
    </div>
  );
}
