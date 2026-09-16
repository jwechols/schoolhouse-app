"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchReadingAssignments, submitReadingAssignment, type ReadingAssignment } from "@/lib/reading-assignments";
import PracticeTestRunner from "./PracticeTestRunner";

const META: Record<string, { name: string }> = {
  titus: { name: "Titus" }, mercy: { name: "Mercy" }, lois: { name: "Lois" }, truma: { name: "Truma" },
};

const METHOD_COPY: Record<string, { verb: string; emoji: string }> = {
  report: { verb: "Write or tell Mom a report about", emoji: "📝" },
  presentation: { verb: "Get ready to present", emoji: "🎤" },
  tell_mom: { verb: "Go tell Mom about", emoji: "💬" },
};

export default function ReadingAssignmentHub({ kidId }: { kidId: string }) {
  const router = useRouter();
  const m = META[kidId] ?? META.titus;
  const [items, setItems] = useState<ReadingAssignment[] | null>(null);
  const [quizItem, setQuizItem] = useState<ReadingAssignment | null>(null);
  const [submittingId, setSubmittingId] = useState<string | null>(null);

  function refresh() {
    fetchReadingAssignments({ kidId, active: true }).then((rows) =>
      setItems(rows.filter((r) => r.status !== "approved")),
    );
  }

  useEffect(refresh, [kidId]);

  if (quizItem) {
    return (
      <PracticeTestRunner
        kidId={kidId}
        test={{
          id: quizItem.id,
          kidId: quizItem.kidId,
          subject: "reading",
          title: quizItem.title,
          questions: quizItem.questions,
          dueDate: quizItem.dueDate,
          active: quizItem.active,
          createdAt: quizItem.createdAt,
          updatedAt: quizItem.updatedAt,
        }}
        onDone={() => { setQuizItem(null); refresh(); }}
      />
    );
  }

  async function markReady(a: ReadingAssignment) {
    setSubmittingId(a.id);
    const res = await submitReadingAssignment(a.id);
    setSubmittingId(null);
    if (res.ok) refresh();
  }

  const backHref = kidId === "truma" ? "/hub" : `/kids/${kidId}/hub`;

  return (
    <div style={{ minHeight: "100vh", background: "var(--surface-page)", color: "var(--text)" }}>
      <div style={{ maxWidth: 560, margin: "0 auto", padding: "24px 20px 48px" }}>
        <button onClick={() => router.push(backHref)} style={{ background: "none", border: "none", color: "var(--text-muted)", fontWeight: 600, cursor: "pointer", fontSize: 14, marginBottom: 18 }}>
          ← Back
        </button>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 30, fontWeight: 600, marginBottom: 4 }}>
          {m.name}&rsquo;s Reading
        </div>
        <p style={{ color: "var(--text-muted)", marginBottom: 24 }}>Books Mom assigned.</p>

        {items === null && <p style={{ color: "var(--text-muted)" }}>Loading&hellip;</p>}
        {items?.length === 0 && (
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r-xl)", padding: 20, textAlign: "center", color: "var(--text-muted)" }}>
            Nothing assigned right now. Check back soon!
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {items?.map((a) => {
            const waiting = a.status === "submitted";
            const copy = METHOD_COPY[a.method];
            return (
              <div key={a.id} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r-xl)", boxShadow: "var(--sh-sm)", padding: "16px 18px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 24, width: 44, height: 44, display: "grid", placeItems: "center", background: "var(--accent-tint)", border: "1px solid var(--accent-line)", borderRadius: "var(--r-md)", flexShrink: 0 }}>
                    {a.method === "quiz" ? "🧮" : copy?.emoji ?? "📖"}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 600 }}>{a.title}</div>
                    {a.author && <div style={{ fontSize: 13, color: "var(--text-muted)" }}>by {a.author}</div>}
                  </div>
                </div>

                {a.method === "quiz" && (
                  <button
                    onClick={() => setQuizItem(a)}
                    style={{ marginTop: 12, width: "100%", minHeight: 48, borderRadius: "var(--r-full)", background: "var(--accent)", color: "var(--accent-contrast)", border: "none", fontWeight: 600, cursor: "pointer" }}
                  >
                    Take the quiz
                  </button>
                )}

                {a.method !== "quiz" && !waiting && (
                  <>
                    <p style={{ marginTop: 10, fontSize: 14, color: "var(--text-muted)" }}>{copy?.verb} &ldquo;{a.title}&rdquo;, then tap below.</p>
                    <button
                      onClick={() => markReady(a)}
                      disabled={submittingId === a.id}
                      style={{ marginTop: 8, width: "100%", minHeight: 48, borderRadius: "var(--r-full)", background: "var(--accent)", color: "var(--accent-contrast)", border: "none", fontWeight: 600, cursor: "pointer", opacity: submittingId === a.id ? 0.6 : 1 }}
                    >
                      {submittingId === a.id ? "Telling Mom…" : "I'm ready, tell Mom!"}
                    </button>
                  </>
                )}

                {waiting && (
                  <p style={{ marginTop: 10, fontSize: 14, color: "var(--text-muted)", fontWeight: 600 }}>
                    ⏳ Waiting for Mom to check it off.
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
