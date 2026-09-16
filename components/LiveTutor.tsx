"use client";

import { useEffect } from "react";
import { useRealtimeTutor } from "@/lib/realtime";

interface Props {
  kidId: string;
  tutorName: string;
  tutorEmoji: string;
  color: string;
  colorDark: string;
  soft: string;
  onClose: () => void;
}

// Full-screen live-voice overlay: streaming speech-to-speech with the tutor via
// OpenAI Realtime. The kid just talks; the tutor answers with almost no gap.
export default function LiveTutor({ kidId, tutorName, tutorEmoji, color, colorDark, soft, onClose }: Props) {
  const { status, errorMsg, start, stop } = useRealtimeTutor();

  // Always tear the mic/connection down when the overlay closes or unmounts.
  useEffect(() => () => { stop(); }, [stop]);

  const live = status === "live";
  const connecting = status === "connecting";

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "var(--bg)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: 24, gap: 26 }}>

      <button onClick={() => { stop(); onClose(); }} aria-label="Close"
        style={{ position: "absolute", top: 16, right: 20, background: "none", border: "none",
          fontSize: 28, lineHeight: 1, color: "var(--muted)", cursor: "pointer" }}>×</button>

      {/* Tutor avatar (ringed when live) */}
      <div style={{ width: 148, height: 148, borderRadius: "50%", background: soft,
        display: "grid", placeItems: "center", fontSize: 74,
        boxShadow: live ? `0 0 0 8px ${color}26, 0 0 0 18px ${color}12`
                        : `0 6px 22px ${color}22`,
        transition: "box-shadow .25s ease" }}>
        {tutorEmoji}
      </div>

      <div style={{ textAlign: "center" }}>
        <div style={{ fontFamily: "var(--font-scripture)", fontWeight: 600, fontSize: 28, color: colorDark }}>
          {tutorName}
        </div>
        <div style={{ fontFamily: "var(--font-body)", fontSize: 16, color: "var(--muted)", marginTop: 6, minHeight: 22 }}>
          {live ? "Listening… just talk!"
            : connecting ? "Connecting…"
            : status === "error" ? ""
            : `Tap to talk with ${tutorName}`}
        </div>
      </div>

      {status === "error" ? (
        <div style={{ textAlign: "center", maxWidth: 340 }}>
          <div style={{ fontFamily: "var(--font-body)", fontSize: 15, color: "var(--terracotta)", marginBottom: 16, lineHeight: 1.5 }}>
            {errorMsg || "Voice couldn't start."}
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
            <button onPointerDown={() => start(kidId)}
              style={{ border: "none", borderRadius: 14, padding: "13px 22px", cursor: "pointer",
                background: color, color: "#fff", fontFamily: "var(--font-body)", fontWeight: 700, fontSize: 15 }}>
              Try again
            </button>
            <button onClick={onClose}
              style={{ border: "1px solid var(--border)", borderRadius: 14, padding: "13px 22px", cursor: "pointer",
                background: "#fff", color: "var(--muted)", fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 15 }}>
              Go back
            </button>
          </div>
        </div>
      ) : (
        <button
          onPointerDown={() => { if (live || connecting) stop(); else start(kidId); }}
          style={{ border: "none", borderRadius: 99, cursor: "pointer",
            width: 220, height: 64, display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
            background: live ? "#ef4444" : color, color: "#fff",
            fontFamily: "var(--font-body)", fontWeight: 700, fontSize: 18,
            boxShadow: `0 6px 20px ${(live ? "#ef4444" : color)}44` }}>
          {live ? "⏹ Stop" : connecting ? "Connecting…" : "🎙️ Start talking"}
        </button>
      )}

      <p style={{ fontFamily: "var(--font-body)", fontSize: 12.5, color: "var(--muted)",
        maxWidth: 320, textAlign: "center", lineHeight: 1.5 }}>
        Talk out loud and {tutorName} answers right back. Uses the microphone, so it works best in Safari.
      </p>
    </div>
  );
}
