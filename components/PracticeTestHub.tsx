"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchPracticeTests, type PracticeTest } from "@/lib/practice-tests";
import PracticeTestRunner from "./PracticeTestRunner";

const META: Record<string, { name: string }> = {
  titus: { name: "Titus" },
  mercy: { name: "Mercy" },
  lois: { name: "Lois" },
  truma: { name: "Truma" },
};

export default function PracticeTestHub({ kidId }: { kidId: string }) {
  const router = useRouter();
  const m = META[kidId] ?? META.titus;
  const [tests, setTests] = useState<PracticeTest[] | null>(null);
  const [active, setActive] = useState<PracticeTest | null>(null);

  useEffect(() => {
    fetchPracticeTests({ kidId, active: true }).then(setTests);
  }, [kidId]);

  if (active) {
    return (
      <PracticeTestRunner
        kidId={kidId}
        test={active}
        onDone={() => { setActive(null); fetchPracticeTests({ kidId, active: true }).then(setTests); }}
      />
    );
  }

  const backHref = kidId === "truma" ? "/hub" : `/kids/${kidId}/hub`;

  return (
    <div style={{ minHeight: "100vh", background: "var(--surface-page)", color: "var(--text)" }}>
      <div style={{ maxWidth: 560, margin: "0 auto", padding: "24px 20px 48px" }}>
        <button onClick={() => router.push(backHref)} style={{ background: "none", border: "none", color: "var(--text-muted)", fontWeight: 600, cursor: "pointer", fontSize: 14, marginBottom: 18 }}>
          ← Back
        </button>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 30, fontWeight: 600, marginBottom: 4 }}>
          {m.name}&rsquo;s Practice Tests
        </div>
        <p style={{ color: "var(--text-muted)", marginBottom: 24 }}>Tests Mom assigned.</p>

        {tests === null && <p style={{ color: "var(--text-muted)" }}>Loading&hellip;</p>}
        {tests?.length === 0 && (
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r-xl)", padding: 20, textAlign: "center", color: "var(--text-muted)" }}>
            Nothing assigned right now. Check back soon!
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {tests?.map((t) => (
            <button
              key={t.id}
              onClick={() => setActive(t)}
              style={{ textAlign: "left", display: "flex", alignItems: "center", gap: 14, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r-xl)", boxShadow: "var(--sh-sm)", padding: "16px 18px", cursor: "pointer" }}
            >
              <span style={{ fontSize: 24, width: 44, height: 44, display: "grid", placeItems: "center", background: "var(--accent-tint)", border: "1px solid var(--accent-line)", borderRadius: "var(--r-md)", flexShrink: 0 }}>🧮</span>
              <span style={{ flex: 1, minWidth: 0 }}>
                <span style={{ display: "block", fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 600 }}>{t.title}</span>
                <span style={{ display: "block", fontSize: 13, color: "var(--text-muted)" }}>
                  {t.questions.length} question{t.questions.length === 1 ? "" : "s"}{t.dueDate ? ` · due ${t.dueDate}` : ""}
                </span>
              </span>
              <span style={{ fontSize: 20, color: "var(--accent-ink)", flexShrink: 0 }}>→</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
