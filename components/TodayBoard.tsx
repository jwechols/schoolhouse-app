"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { KIDS, TRUMA_EARTHY, TRUMA_THEME } from "@/lib/kids";
import { familyToday, type KidToday } from "@/lib/today-plan";
import { warmTTS } from "@/lib/tts";

const META: Record<string, { name: string; emoji: string; color: string; colorDark: string }> = {
  truma: { name: "Truma", emoji: TRUMA_EARTHY.avatar, color: TRUMA_THEME.primary, colorDark: TRUMA_THEME.primaryDark },
  titus: { name: KIDS.titus.name, emoji: KIDS.titus.emoji, color: KIDS.titus.colorHex, colorDark: KIDS.titus.colorDark },
  mercy: { name: KIDS.mercy.name, emoji: KIDS.mercy.emoji, color: KIDS.mercy.colorHex, colorDark: KIDS.mercy.colorDark },
  lois:  { name: KIDS.lois.name,  emoji: KIDS.lois.emoji,  color: KIDS.lois.colorHex,  colorDark: KIDS.lois.colorDark },
};

function pill(bg: string, color: string, children: React.ReactNode, onClick: () => void, fill = false) {
  return (
    <button
      onClick={onClick}
      className="btn-bouncy"
      style={{
        minHeight: 52,
        padding: "0 16px",
        borderRadius: 14,
        border: fill ? "none" : `1.5px solid ${color}33`,
        background: fill ? bg : "#fff",
        color: fill ? "#fff" : color,
        fontFamily: "var(--font-ui, system-ui)",
        fontWeight: 700,
        fontSize: 15,
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        flex: fill ? 1 : undefined,
        justifyContent: "center",
      }}
    >
      {children}
    </button>
  );
}

function KidRow({ row }: { row: KidToday }) {
  const router = useRouter();
  const m = META[row.kidId] ?? META.titus;
  const go = (href: string) => {
    warmTTS();
    router.push(href);
  };

  return (
    <div
      style={{
        background: "#fff",
        border: `1px solid ${m.color}28`,
        borderRadius: 16,
        padding: "14px 16px 16px",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        boxShadow: `0 2px 10px ${m.color}14`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 28, lineHeight: 1 }}>{m.emoji}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: "var(--font-scripture, Georgia)", fontWeight: 600, fontSize: 22, color: m.color, lineHeight: 1.1 }}>
            {m.name}
          </div>
          <div style={{ fontSize: 13, color: "var(--muted, #6B6258)", marginTop: 2 }}>
            {row.atSchool
              ? `At ${row.schoolName} today`
              : row.lesson
                ? `${row.lesson.emoji} ${row.lesson.subjectLabel}: ${row.lesson.title}`
                : "All caught up"}
          </div>
        </div>
        <button
          onClick={() => go(row.hubUrl)}
          style={{ background: "none", border: "none", color: m.color, fontWeight: 700, fontSize: 13, cursor: "pointer", padding: "6px 8px" }}
        >
          Hub →
        </button>
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {row.atSchool ? (
          pill(m.color, m.colorDark, "Catechism · 5 questions", () => go(row.catechismUrl), true)
        ) : (
          <>
            {row.lessonUrl && pill(m.color, m.color, "Start lesson →", () => go(row.lessonUrl!), true)}
            {pill("#fff", m.colorDark, "Catechism", () => go(row.catechismUrl), false)}
          </>
        )}
      </div>
    </div>
  );
}

/** Four kids, one tap each. This is Briana's home screen. */
export default function TodayBoard({ compact = false }: { compact?: boolean }) {
  const [rows, setRows] = useState<KidToday[] | null>(null);

  useEffect(() => {
    setRows(familyToday());
    warmTTS();
  }, []);

  if (!rows) {
    return <div style={{ minHeight: 120 }} />;
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: compact ? "1fr" : "repeat(auto-fit, minmax(260px, 1fr))",
        gap: 12,
      }}
    >
      {rows.map((r) => <KidRow key={r.kidId} row={r} />)}
    </div>
  );
}
