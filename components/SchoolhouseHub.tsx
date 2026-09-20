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
import { catechismHref } from "@/lib/today-plan";
import { unlockTTS } from "@/lib/tts";
import FloatingTutor from "./FloatingTutor";

const META: Record<string, { name: string; grade: string; tutor: string; tutorEmoji: string; school: string }> = {
  titus: { name: "Titus", grade: "3rd Grade", tutor: "Buck", tutorEmoji: "\ud83c\udfa3", school: "Brookside Academy" },
  mercy: { name: "Mercy", grade: "Kindergarten", tutor: "Princess Rose", tutorEmoji: "\ud83c\udf39", school: "Midland Classical Academy" },
  lois: { name: "Lois", grade: "Pre-K", tutor: "Princess Crystal", tutorEmoji: "\u2744\ufe0f", school: "Home" },
  truma: { name: "Truma", grade: "6th Grade", tutor: "Lydia", tutorEmoji: "\ud83c\udf3b", school: "Midland Classical Academy" },
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
  const [wordLists, setWordLists] = useState<{ total: number; memory: number }>({ total: 0, memory: 0 });
  const [testCount, setTestCount] = useState(0);
  const [readingCount, setReadingCount] = useState(0);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    unlockTTS();
    fetchWordLists({ kidId, active: true }).then((lists) => {
      setWordLists({ total: lists.length, memory: lists.filter((l) => l.type === "memory").length });
    });
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
  const wordsHref = kidId === "truma" ? "/kids/truma/words" : `/kids/${kidId}/words`;
  const catHref = catechismHref(kidId);
  const go = (href: string) => { unlockTTS(); router.push(href); };
  const goLesson = (subject: string, lessonId?: string | null) =>
    go(`${lessonBase}?subject=${subject}${lessonId ? `&lessonId=${lessonId}` : ""}`);

  const eyebrow: React.CSSProperties = { fontSize: 11, fontWeight: 600, letterSpacing: "0.10em", textTransform: "uppercase", color: "var(--text-muted)" };
  const stationBtn: React.CSSProperties = {
    width: "100%", display: "flex", alignItems: "center", gap: 14,
    background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r-xl)",
    boxShadow: "var(--sh-sm)", padding: "16px 18px", marginBottom: 16, cursor: "pointer", textAlign: "left",
  };

  const wordsCopy = wordLists.total
    ? wordLists.memory && wordLists.total === wordLists.memory
      ? `${wordLists.memory} memory piece${wordLists.memory === 1 ? "" : "s"} from Mom`
      : `${wordLists.total} list${wordLists.total === 1 ? "" : "s"} from Mom`
    : "Mom can put this week's words or a poem here";

  const wordsCard = (
    <button onClick={() => go(wordsHref)} style={stationBtn}>
      <span style={{ fontSize: 24, width: 44, height: 44, display: "grid", placeItems: "center", background: "var(--accent-tint)", border: "1px solid var(--accent-line)", borderRadius: "var(--r-md)", flexShrink: 0 }}>📖</span>
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{ display: "block", fontFamily: "var(--font-display)", fontSize: 19, fontWeight: 600, color: "var(--text)" }}>
          {kidId === "lois" ? "Listen" : "This week's words"}
        </span>
        <span style={{ display: "block", fontSize: 13, color: "var(--text-muted)" }}>{wordsCopy}</span>
      </span>
      <span style={{ fontSize: 20, color: "var(--accent-ink)", flexShrink: 0 }}>→</span>
    </button>
  );

  return (
    <div className={`theme-${kidId}`} style={{ minHeight: "100vh", background: "var(--surface-page)", color: "var(--text)", fontFamily: "var(--font-ui)" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px 20px 48px" }}>
        <button onClick={() => router.push("/")} style={{ background: "none", border: "none", color: "var(--text-muted)", fontWeight: 600, cursor: "pointer", fontSize: 14, marginBottom: 18 }}>← Home</button>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 26 }}>
          <div style={{ position: "relative", width: 64, height: 64, flexShrink: 0 }}>
            <div style={{ width: "100%", height: "100%", borderRadius: "var(--r-full)", background: "var(--accent)", color: "var(--accent-contrast)", display: "grid", placeItems: "center", fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 30, boxShadow: "var(--sh-md)" }}>{m.tutor[0]}</div>
            <div style={{ position: "absolute", right: -4, bottom: -4, width: 28, height: 28, borderRadius: "var(--r-full)", background: "var(--surface)", border: "1px solid var(--border)", display: "grid", placeItems: "center", fontSize: 15, boxShadow: "var(--sh-sm)" }}>{m.tutorEmoji}</div>
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={eyebrow}>Echols Academy</div>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 32, lineHeight: 1.05, color: "var(--text)" }}>Hello, {m.name}</div>
            <div style={{ fontSize: 14, color: "var(--text-muted)" }}>{m.grade} · with {m.tutor}</div>
          </div>
        </div>

        {kidId === "lois" ? (
          <>
            <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderTop: "4px solid var(--accent)", borderRadius: "var(--r-xl)", boxShadow: "var(--sh-md)", padding: 22, marginBottom: 20 }}>
              <div style={{ ...eyebrow, color: "var(--accent-ink)", marginBottom: 8 }}>Hand her this</div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 600, lineHeight: 1.12, marginBottom: 8 }}>Play with Princess Crystal</div>
              <p style={{ fontSize: 15, color: "var(--text-muted)", margin: "0 0 16px" }}>Big buttons. She taps. The iPad talks.</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <button onClick={() => go("/kids/lois/play/abc")} style={{ minHeight: 88, borderRadius: 18, border: "none", background: "var(--accent)", color: "var(--accent-contrast)", fontWeight: 700, fontSize: 18, cursor: "pointer" }}>🔤 Letters</button>
                <button onClick={() => go("/kids/lois/play/numbers")} style={{ minHeight: 88, borderRadius: 18, border: "none", background: "var(--accent)", color: "var(--accent-contrast)", fontWeight: 700, fontSize: 18, cursor: "pointer" }}>🔢 Count</button>
                <button onClick={() => go("/kids/lois/play/colors")} style={{ minHeight: 88, borderRadius: 18, border: "1px solid var(--border)", background: "var(--surface)", color: "var(--text)", fontWeight: 700, fontSize: 18, cursor: "pointer" }}>🎨 Colors</button>
                <button onClick={() => go(wordsHref)} style={{ minHeight: 88, borderRadius: 18, border: "1px solid var(--border)", background: "var(--surface)", color: "var(--text)", fontWeight: 700, fontSize: 18, cursor: "pointer" }}>🃏 Listen</button>
              </div>
            </div>
            {wordsCard}
            <button onClick={() => setShowMore((s) => !s)} style={{ ...stationBtn, marginBottom: 20 }}>
              <span style={{ flex: 1, fontFamily: "var(--font-display)", fontSize: 17, fontWeight: 600 }}>More lessons</span>
              <span style={{ color: "var(--text-muted)" }}>{showMore ? "Hide" : "Show"}</span>
            </button>
          </>
        ) : (
          <>
            {outsideSchoolToday ? (
              <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderTop: "4px solid var(--accent)", borderRadius: "var(--r-xl)", boxShadow: "var(--sh-md)", padding: 22, marginBottom: 20 }}>
                <div style={{ ...eyebrow, color: "var(--accent-ink)", marginBottom: 8 }}>Today</div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 600, lineHeight: 1.12, marginBottom: 6 }}>{m.name} is at {m.school} today</div>
                <div style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 16 }}>School work first. Words and catechism still fit after.</div>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <button onClick={() => go(wordsHref)} style={{ minHeight: 56, padding: "0 26px", fontSize: 18, fontWeight: 600, borderRadius: "var(--r-full)", background: "var(--accent)", color: "var(--accent-contrast)", border: "none", cursor: "pointer" }}>This week's words →</button>
                  <button onClick={() => go(catHref)} style={{ minHeight: 56, padding: "0 18px", fontSize: 15, fontWeight: 600, borderRadius: "var(--r-full)", background: "transparent", color: "var(--accent-ink)", border: "1px solid var(--border)", cursor: "pointer" }}>Catechism</button>
                </div>
              </div>
            ) : today && (
              <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderTop: "4px solid var(--accent)", borderRadius: "var(--r-xl)", boxShadow: "var(--sh-md)", padding: 22, marginBottom: 20 }}>
                <div style={{ ...eyebrow, color: "var(--accent-ink)", marginBottom: 8 }}>Today's lesson</div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 600, lineHeight: 1.12, marginBottom: 18 }}>{today.title}</div>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
                  <button onClick={() => goLesson(today.subject, today.id)} style={{ minHeight: 56, padding: "0 26px", fontSize: 18, fontWeight: 600, borderRadius: "var(--r-full)", background: "var(--accent)", color: "var(--accent-contrast)", border: "none", cursor: "pointer" }}>Start lesson →</button>
                  <button onClick={() => go(wordsHref)} style={{ minHeight: 56, padding: "0 18px", fontSize: 15, fontWeight: 600, borderRadius: "var(--r-full)", background: "transparent", color: "var(--accent-ink)", border: "1px solid var(--border)", cursor: "pointer" }}>Words</button>
                  <button onClick={() => go(`${placeBase}?subject=${today.subject}`)} style={{ minHeight: 56, padding: "0 18px", fontSize: 15, fontWeight: 600, borderRadius: "var(--r-full)", background: "transparent", color: "var(--accent-ink)", border: "none", cursor: "pointer" }}>Where do I start?</button>
                </div>
              </div>
            )}
            {wordsCard}
            <button onClick={() => go(catHref)} style={stationBtn}>
              <span style={{ fontSize: 24, width: 44, height: 44, display: "grid", placeItems: "center", background: "var(--accent-tint)", border: "1px solid var(--accent-line)", borderRadius: "var(--r-md)", flexShrink: 0 }}>🕊️</span>
              <span style={{ flex: 1, minWidth: 0 }}>
                <span style={{ display: "block", fontFamily: "var(--font-display)", fontSize: 19, fontWeight: 600, color: "var(--text)" }}>Catechism</span>
                <span style={{ display: "block", fontSize: 13, color: "var(--text-muted)" }}>Five questions. Truth & Grace Book 1.</span>
              </span>
              <span style={{ fontSize: 20, color: "var(--accent-ink)", flexShrink: 0 }}>→</span>
            </button>
          </>
        )}

        {testCount > 0 && (
          <button onClick={() => go(kidId === "truma" ? "/kids/truma/tests" : `/kids/${kidId}/tests`)} style={stationBtn}>
            <span style={{ fontSize: 24, width: 44, height: 44, display: "grid", placeItems: "center", background: "var(--accent-tint)", border: "1px solid var(--accent-line)", borderRadius: "var(--r-md)", flexShrink: 0 }}>🧮</span>
            <span style={{ flex: 1, minWidth: 0 }}>
              <span style={{ display: "block", fontFamily: "var(--font-display)", fontSize: 19, fontWeight: 600, color: "var(--text)" }}>Practice Tests</span>
              <span style={{ display: "block", fontSize: 13, color: "var(--text-muted)" }}>{testCount} from Mom</span>
            </span>
            <span style={{ fontSize: 20, color: "var(--accent-ink)", flexShrink: 0 }}>→</span>
          </button>
        )}

        {readingCount > 0 && (
          <button onClick={() => go(kidId === "truma" ? "/kids/truma/reading" : `/kids/${kidId}/reading`)} style={{ ...stationBtn, marginBottom: 28 }}>
            <span style={{ fontSize: 24, width: 44, height: 44, display: "grid", placeItems: "center", background: "var(--accent-tint)", border: "1px solid var(--accent-line)", borderRadius: "var(--r-md)", flexShrink: 0 }}>📚</span>
            <span style={{ flex: 1, minWidth: 0 }}>
              <span style={{ display: "block", fontFamily: "var(--font-display)", fontSize: 19, fontWeight: 600, color: "var(--text)" }}>Reading</span>
              <span style={{ display: "block", fontSize: 13, color: "var(--text-muted)" }}>{readingCount} book{readingCount === 1 ? "" : "s"} from Mom</span>
            </span>
            <span style={{ fontSize: 20, color: "var(--accent-ink)", flexShrink: 0 }}>→</span>
          </button>
        )}

        {(kidId !== "lois" || showMore) && (
          <>
            <div style={{ ...eyebrow, marginBottom: 12, marginTop: 8 }}>Subjects</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 14 }}>
              {(rows ?? []).map((r) => {
                const mastered = r.graded > 0 && r.mastery >= MASTERY_PCT;
                const pct = r.total ? Math.round((r.done / r.total) * 100) : 0;
                return (
                  <button key={r.subject} onClick={() => goLesson(r.subject)}
                    style={{ textAlign: "left", background: "var(--accent-tint)", border: "1px solid var(--accent-line)", borderRadius: "var(--r-xl)", boxShadow: "var(--sh-sm)", padding: 18, cursor: "pointer", display: "flex", flexDirection: "column", gap: 10, minHeight: 156 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 24, width: 44, height: 44, display: "grid", placeItems: "center", background: "var(--surface)", border: "1px solid var(--accent-line)", borderRadius: "var(--r-md)" }}>{r.emoji}</span>
                      {mastered && (<span style={{ fontSize: 12, fontWeight: 600, color: "var(--success-ink)", padding: "3px 9px", borderRadius: "var(--r-full)" }}>✓ {r.mastery}%</span>)}
                    </div>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: 21, fontWeight: 600, color: "var(--text)" }}>{r.label}</div>
                    <div style={{ marginTop: "auto" }}>
                      <div style={{ height: 8, background: "color-mix(in srgb, var(--accent) 18%, var(--surface))", borderRadius: "var(--r-full)", overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${pct}%`, background: "var(--accent)", borderRadius: "var(--r-full)" }} />
                      </div>
                      <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 8 }}>{r.done} of {r.total} lessons</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>
      <FloatingTutor kidId={kidId} />
    </div>
  );
}
