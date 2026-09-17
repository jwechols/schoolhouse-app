"use client";

import { useMemo, useState } from "react";
import { resetAllProgress } from "@/lib/reset";
import TodayBoard from "./TodayBoard";

function todayLabel(): string {
  return new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
}

interface Props {
  onClose: () => void;
}

export default function FamilyLaunchMode({ onClose }: Props) {
  const dateLabel = useMemo(() => todayLabel(), []);
  const [confirmReset, setConfirmReset] = useState(false);
  const [resetDone, setResetDone] = useState(false);

  function handleReset() {
    resetAllProgress();
    setResetDone(true);
    setConfirmReset(false);
    setTimeout(() => setResetDone(false), 3000);
  }

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
              fontFamily: "var(--font-scripture, Georgia)",
              fontWeight: 600,
              fontSize: "clamp(1.25rem, 4vw, 1.7rem)",
              color: "#3D352A",
              margin: 0,
              lineHeight: 1.1,
            }}
          >
            Today
          </h1>
          <p
            style={{
              fontFamily: "system-ui, -apple-system, sans-serif",
              fontSize: 13,
              color: "#6B6258",
              margin: "2px 0 0",
            }}
          >
            {dateLabel} · one tap each
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

      <div style={{ padding: "20px 16px 40px", maxWidth: 720, margin: "0 auto" }}>
        <TodayBoard />
      </div>

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
              ⚠️ Clear ALL kids&apos; progress, coins, and catechism data?
            </span>
            <span style={{ fontSize: 12, color: "#7a5800" }}>This can&apos;t be undone.</span>
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
