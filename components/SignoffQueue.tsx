"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { KIDS, type KidId } from "@/lib/kids";
import { getSignoffs, signOff, type Signoff } from "@/lib/curriculum-spine/signoff";

const KID_META: Record<string, { name: string; emoji: string; color: string }> = {
  titus: { name: "Titus", emoji: "\ud83c\udfa3", color: "#2563eb" },
  mercy: { name: "Mercy", emoji: "\ud83c\udf38", color: "#D4508A" },
  lois: { name: "Lois", emoji: "\ud83d\udc51", color: "#C026D3" },
  truma: { name: "Truma", emoji: "\ud83c\udf3b", color: "#0BABB9" },
};

function meta(kidId: string) {
  const k = KIDS[kidId as KidId];
  return KID_META[kidId] ?? { name: k?.name ?? kidId, emoji: k?.emoji ?? "\ud83c\udf1f", color: k?.colorHex ?? "#2563eb" };
}

export default function SignoffQueue() {
  const router = useRouter();
  const [rows, setRows] = useState<Signoff[]>([]);
  const refresh = () => setRows(getSignoffs());
  useEffect(refresh, []);
  const pending = rows.filter((r) => !r.signedOff);
  const signed = rows.filter((r) => r.signedOff).slice(0, 8);
  function approve(r: Signoff) {
    signOff(r.kidId, r.subject, r.lessonId, r.date, "Mom");
    refresh();
  }
  return (
    <div style={{ minHeight: "100vh", background: "var(--surface-page)", padding: "24px 16px" }}>
      <div style={{ maxWidth: 620, margin: "0 auto" }}>
        <button onClick={() => router.push("/teacher")} style={{ background: "none", border: "none", color: "var(--text-muted)", fontWeight: 600, cursor: "pointer", marginBottom: 12 }}>
          Homeroom
        </button>
        <h1 style={{ fontFamily: "Georgia, serif", fontWeight: 800, fontSize: 30, color: "var(--text)", margin: "0 0 4px" }}>
          Lessons to sign off
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: 14, margin: "0 0 22px" }}>
          Each lesson here was mastered at 80% or better. Review it and sign off.
        </p>
        {pending.length === 0 ? (
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: 28, textAlign: "center", color: "var(--text-muted)" }}>
            Nothing waiting. Every mastered lesson is signed off.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {pending.map((r) => {
              const m = meta(r.kidId);
              return (
                <div key={`${r.kidId}-${r.lessonId}-${r.date}`} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: 16, display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ width: 46, height: 46, borderRadius: 12, flexShrink: 0, display: "grid", placeItems: "center", fontSize: 26, background: `${m.color}18` }}>{m.emoji}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 800, color: "var(--text)", fontSize: 16 }}>{r.lessonTitle}</div>
                    <div style={{ color: "var(--text-muted)", fontSize: 13 }}>
                      {m.name} - {r.subject} - {r.correct}/{r.total} correct
                      <span style={{ color: "var(--success-ink)", fontWeight: 700 }}> - {r.pct}% mastered</span>
                    </div>
                    <div style={{ color: "var(--text-faint)", fontSize: 12 }}>{r.date}</div>
                  </div>
                  <button onClick={() => approve(r)} style={{ flexShrink: 0, background: "var(--accent)", color: "#fff", border: "none", borderRadius: 10, padding: "12px 18px", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
                    Sign off
                  </button>
                </div>
              );
            })}
          </div>
        )}
        {signed.length > 0 && (
          <div style={{ marginTop: 28 }}>
            <div style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", marginBottom: 10 }}>Recently signed off</div>
            {signed.map((r) => {
              const m = meta(r.kidId);
              return (
                <div key={`s-${r.kidId}-${r.lessonId}-${r.date}`} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: "var(--text-muted)", padding: "6px 4px" }}>
                  <span>{m.emoji}</span>
                  <span style={{ flex: 1 }}>{m.name} - {r.lessonTitle} - {r.pct}%</span>
                  <span style={{ color: "var(--success-ink)", fontWeight: 700 }}>{r.signedBy}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
