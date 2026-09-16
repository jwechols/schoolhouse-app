"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { KIDS, KIDS_ORDER, TRUMA_EARTHY, type KidId } from "@/lib/kids";
import { resetAllProgress } from "@/lib/reset";

// ── Date helpers ─────────────────────────────────────────────────────────────
function todayLabel(): string {
  const d = new Date();
  return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
}

// ── getDailyMissions, duplicated from KidHub to avoid coupling ───────────────
interface Mission {
  id: string;
  label: string;
  emoji: string;
  href: string;
}

interface GameConfig {
  id: string;
  label: string;
  emoji: string;
}

function hashCode(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function pickMissions(
  kidId: string,
  games: GameConfig[],
  subjects: string[],
  count: number
): Mission[] {
  const today = new Date().toISOString().slice(0, 10);
  const seed = hashCode(`${kidId}-${today}`);

  const pool: Mission[] = games.map((g) => ({
    id: g.id,
    label: g.label,
    emoji: g.emoji,
    href: subjects.includes(g.id)
      ? `/kids/${kidId}/learn/${g.id}`
      : `/kids/${kidId}/play/${g.id}`,
  }));

  const picked: Mission[] = [];
  const used = new Set<number>();
  let s = seed;
  while (picked.length < Math.min(count, pool.length)) {
    s = (s * 1664525 + 1013904223) & 0x7fffffff;
    const idx = s % pool.length;
    if (!used.has(idx)) {
      used.add(idx);
      picked.push(pool[idx]);
    }
  }
  return picked;
}

// ── Truma's missions, links straight to her hub ─────────────────────────────
// NOTE: Truma's hub is at /hub (app/hub/page.tsx → TrumaHub), NOT /kids/truma/hub
const TRUMA_MISSIONS: Mission[] = [
  { id: "prep",   label: "Test Prep",   emoji: "📋", href: "/kids/truma/prep" },
  { id: "bible",  label: "Bible",       emoji: "📖", href: "/kids/truma/bible" },
  { id: "hub",    label: "Open Hub",    emoji: "🌷", href: "/hub" },
];

// ── KidPanel ─────────────────────────────────────────────────────────────────
interface KidPanelProps {
  kidId: string;
  name: string;
  emoji: string;
  color: string;
  colorDark: string;
  soft: string;
  bgGradient: string;
  hubHref: string;
  missions: Mission[];
}

function KidPanel({
  kidId,
  name,
  emoji,
  color,
  colorDark,
  soft,
  bgGradient,
  hubHref,
  missions,
}: KidPanelProps) {
  return (
    <div
      style={{
        borderRadius: 20,
        padding: "18px 16px 16px",
        background: bgGradient,
        border: `2px solid ${color}30`,
        boxShadow: `0 4px 18px ${color}18`,
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      {/* Header row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 30, lineHeight: 1 }}>{emoji}</span>
          <span
            style={{
              fontFamily: "system-ui, -apple-system, sans-serif",
              fontWeight: 800,
              fontSize: 20,
              color: colorDark,
              letterSpacing: "0.01em",
            }}
          >
            {name}
          </span>
        </div>
        <Link
          href={hubHref}
          style={{
            fontFamily: "system-ui, -apple-system, sans-serif",
            fontSize: 13,
            fontWeight: 700,
            color,
            textDecoration: "none",
            padding: "4px 10px",
            borderRadius: 99,
            background: `${color}14`,
            whiteSpace: "nowrap",
            minHeight: 28,
            display: "inline-flex",
            alignItems: "center",
          }}
        >
          See all →
        </Link>
      </div>

      {/* Plan label */}
      <div
        style={{
          fontFamily: "system-ui, -apple-system, sans-serif",
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color,
          opacity: 0.75,
        }}
      >
        Today&rsquo;s plan
      </div>

      {/* Activity buttons */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {missions.map((m) => (
          <Link
            key={`${kidId}-${m.id}`}
            href={m.href}
            className="btn-bouncy"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              minHeight: 56,
              borderRadius: 14,
              padding: "0 16px",
              background: "#FFFFFF",
              border: `1.5px solid ${color}28`,
              boxShadow: `0 2px 8px ${color}12`,
              textDecoration: "none",
              cursor: "pointer",
            }}
          >
            <span style={{ fontSize: 22, lineHeight: 1, flexShrink: 0 }}>{m.emoji}</span>
            <span
              style={{
                fontFamily: "system-ui, -apple-system, sans-serif",
                fontWeight: 700,
                fontSize: 15,
                color: colorDark,
                flex: 1,
              }}
            >
              {m.label}
            </span>
            <span
              style={{
                fontSize: 14,
                color,
                opacity: 0.5,
                fontWeight: 700,
              }}
            >
              →
            </span>
          </Link>
        ))}
      </div>

      {/* Soft bottom tint strip */}
      <div
        style={{
          borderRadius: 10,
          background: soft,
          padding: "6px 10px",
          fontFamily: "system-ui, -apple-system, sans-serif",
          fontSize: 11,
          color: colorDark,
          opacity: 0.55,
          textAlign: "center",
        }}
      >
        Tap an activity to start
      </div>
    </div>
  );
}

// ── FamilyLaunchMode ─────────────────────────────────────────────────────────
interface Props {
  onClose: () => void;
}

export default function FamilyLaunchMode({ onClose }: Props) {
  const dateLabel = useMemo(() => todayLabel(), []);
  const [confirmReset, setConfirmReset] = useState(false);
  const [resetDone, setResetDone] = useState(false);

  function handleReset() {
    const count = resetAllProgress();
    setResetDone(true);
    setConfirmReset(false);
    // Brief confirmation, then dismiss
    setTimeout(() => setResetDone(false), 3000);
    console.log(`[ELC] Reset cleared ${count} localStorage keys`);
  }

  // Build panels, Truma first, then KIDS_ORDER
  const panels = useMemo(() => {
    const result: KidPanelProps[] = [];

    // Truma
    result.push({
      kidId: "truma",
      name: "Truma",
      emoji: TRUMA_EARTHY.avatar,
      color: TRUMA_EARTHY.color,
      colorDark: TRUMA_EARTHY.colorDark,
      soft: TRUMA_EARTHY.soft,
      bgGradient: TRUMA_EARTHY.bg,
      hubHref: "/hub",
      missions: TRUMA_MISSIONS,
    });

    // Titus, Mercy, Lois
    for (const id of KIDS_ORDER) {
      const k = KIDS[id as KidId];
      result.push({
        kidId: id,
        name: k.name,
        emoji: k.emoji,
        color: k.color,
        colorDark: k.colorDark,
        soft: k.soft,
        bgGradient: k.bgGradient,
        hubHref: `/kids/${id}/hub`,
        missions: pickMissions(id, k.games, k.subjects, 3),
      });
    }

    return result;
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        background: "#FBF3E4",
        overflowY: "auto",
        WebkitOverflowScrolling: "touch",
      }}
    >
      {/* Header */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          background: "rgba(251,243,228,0.92)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          borderBottom: "1px solid rgba(50,68,70,0.08)",
          padding: "14px 20px 12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: "system-ui, -apple-system, sans-serif",
              fontWeight: 800,
              fontSize: "clamp(1.25rem, 4vw, 1.7rem)",
              color: "#3D352A",
              margin: 0,
              lineHeight: 1.1,
            }}
          >
            Who&rsquo;s learning today?
          </h1>
          <p
            style={{
              fontFamily: "system-ui, -apple-system, sans-serif",
              fontSize: 13,
              color: "#6B6258",
              margin: "2px 0 0",
            }}
          >
            {dateLabel}
          </p>
        </div>
        <button
          onClick={onClose}
          className="btn-bouncy"
          aria-label="Close today's plan"
          style={{
            border: "1.5px solid rgba(50,68,70,0.14)",
            background: "#FFFFFF",
            borderRadius: 12,
            padding: "10px 16px",
            fontFamily: "system-ui, -apple-system, sans-serif",
            fontWeight: 700,
            fontSize: 14,
            color: "#3D352A",
            cursor: "pointer",
            minHeight: 44,
            minWidth: 44,
            display: "flex",
            alignItems: "center",
            gap: 6,
            boxShadow: "0 2px 8px rgba(50,68,70,0.07)",
          }}
        >
          ✕ Back
        </button>
      </div>

      {/* 2×2 grid of kid panels */}
      <div
        style={{
          padding: "20px 16px 40px",
          maxWidth: 900,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 16,
        }}
      >
        {panels.map((p) => (
          <KidPanel key={p.kidId} {...p} />
        ))}
      </div>

      {/* Reset progress, parent-only, tucked at the bottom */}
      <div style={{ textAlign: "center", paddingBottom: 8, paddingTop: 4 }}>
        {!confirmReset && !resetDone && (
          <button
            onPointerDown={() => setConfirmReset(true)}
            style={{
              background: "none",
              border: "none",
              fontSize: 12,
              color: "rgba(50,68,70,0.3)",
              cursor: "pointer",
              fontFamily: "system-ui, -apple-system, sans-serif",
              padding: "8px 16px",
              textDecoration: "underline",
              textDecorationStyle: "dotted",
            }}
          >
            Reset all progress
          </button>
        )}

        {confirmReset && (
          <div style={{
            display: "inline-flex", flexDirection: "column", alignItems: "center",
            gap: 8, padding: "16px 20px",
            background: "#fff3cd", border: "1.5px solid #e6b800", borderRadius: 12,
            fontFamily: "system-ui, -apple-system, sans-serif",
          }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: "#5a4000" }}>
              ⚠️ Clear ALL kids' progress, coins, and catechism data?
            </span>
            <span style={{ fontSize: 12, color: "#7a5800" }}>This can't be undone.</span>
            <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
              <button
                onPointerDown={handleReset}
                style={{
                  background: "#c0392b", color: "#fff", border: "none",
                  borderRadius: 8, padding: "10px 20px", fontSize: 14,
                  fontWeight: 700, cursor: "pointer", minHeight: 44,
                }}
              >
                Yes, reset everything
              </button>
              <button
                onPointerDown={() => setConfirmReset(false)}
                style={{
                  background: "#e9ecef", color: "#333", border: "none",
                  borderRadius: 8, padding: "10px 20px", fontSize: 14,
                  fontWeight: 600, cursor: "pointer", minHeight: 44,
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {resetDone && (
          <div style={{
            display: "inline-block", padding: "10px 20px",
            background: "#d4edda", border: "1.5px solid #28a745",
            borderRadius: 10, fontSize: 14, fontWeight: 600, color: "#155724",
            fontFamily: "system-ui, -apple-system, sans-serif",
          }}>
            ✅ All progress cleared, fresh start!
          </div>
        )}
      </div>

      {/* Footer */}
      <div
        style={{
          textAlign: "center",
          paddingBottom: 32,
          fontFamily: "system-ui, -apple-system, sans-serif",
          fontStyle: "italic",
          fontSize: 13,
          color: "rgba(50,68,70,0.38)",
        }}
      >
        &ldquo;Train up a child in the way he should go&rdquo; &mdash; Prov. 22:6
      </div>
    </div>
  );
}
