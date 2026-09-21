"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { KIDS, TRUMA_EARTHY, TRUMA_THEME } from "@/lib/kids";
import { familyToday, type KidToday } from "@/lib/today-plan";
import { unlockTTS } from "@/lib/tts";

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
        minHeight: 48,
        padding: "0 14px",
        borderRadius: 14,
        border: fill ? "none" : `1.5px solid ${color}33`,
        background: fill ? bg : "#fff",
        color: fill ? "#fff" : color,
        fontFamily: "var(--font-ui, system-ui)",
        fontWeight: 700,
        fontSize: 14,
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flex: fill ? "1 1 140px" : "0 0 auto",
      }}
    >
      {children}
    </button>
  );
}

function wordsHref(kidId: string) {
  return kidId === "truma" ? "/kids/truma/words" : `/kids/${kidId}/words`;
}
function faithHref(kidId: string) {
  return kidId === "truma" ? "/kids/truma/catechism" : `/kids/${kidId}/catechism`;
}

function KidRow({ row }: { row: KidToday }) {
  const router = useRouter();
  const m = META[row.kidId] ?? META.titus;
  const go = (href: string) => {
    unlockTTS();
    router.push(href);
  };

  const primaryLabel = row.kidId === "lois"
    ? "Play"
    : row.atSchool
      ? "Practice words"
      : row.lesson
        ? row.lesson.title
        : "Open hub";
  const primaryHref = row.kidId === "lois"
    ? "/kids/lois/play/abc"
    : row.atSchool
      ? wordsHref(row.kidId)
      : row.lessonUrl || row.hubUrl;

  return (
    <div style={{
      background: "#fff",
      border: `1px solid ${m.color}28`,
      borderRadius: 16,
      padding: "14px 16px 16px",
      display: "flex",
      flexDirection: "column",
      gap: 12,
      boxShadow: `0 2px 10px ${m.color}14`,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 28, lineHeight: 1 }}>{m.emoji}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: "var(--font-scripture, Georgia)", fontWeight: 600, fontSize: 22, color: m.colorDark, lineHeight: 1.1 }}>
            {m.name}
          </div>
          <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}>
            {row.kidId === "lois"
              ? "Letters, count, listen"
              : row.atSchool
                ? "School day \u00b7 practice after"
                : row.lesson
                  ? `Next: ${row.lesson.subjectLabel}`
                  : "Words and catechism"}
          </div>
        </div>
        <button
          onClick={() => go(row.hubUrl)}
          style={{ background: "none", border: "none", color: m.colorDark, fontWeight: 700, fontSize: 14, cursor: "pointer", padding: "6px 8px" }}
        >
          Hub
        </button>
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {primaryHref && pill(m.color, m.colorDark, primaryLabel, () => go(primaryHref), true)}
        {row.kidId === "lois" ? (
          pill("#fff", m.colorDark, "Listen", () => go(wordsHref("lois")), false)
        ) : (
          <>
            {pill("#fff", m.colorDark, "Words", () => go(wordsHref(row.kidId)), false)}
            {pill("#fff", m.colorDark, "Catechism", () => go(faithHref(row.kidId)), false)}
          </>
        )}
      </div>
    </div>
  );
}

export default function TodayBoard({ compact = false }: { compact?: boolean }) {
  const [rows, setRows] = useState<KidToday[] | null>(null);
  useEffect(() => {
    setRows(familyToday());
    unlockTTS();
  }, []);
  if (!rows) return <div style={{ minHeight: 120 }} />;
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: compact ? "1fr" : "repeat(auto-fit, minmax(260px, 1fr))",
      gap: 12,
    }}>
      {rows.map((r) => <KidRow key={r.kidId} row={r} />)}
    </div>
  );
}
