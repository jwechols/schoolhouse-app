"use client";

import { useEffect, useRef, useState } from "react";
import WeeklyBibleCard from "@/components/WeeklyBibleCard";
import { getWeeklyCurriculum } from "@/lib/weekly-curriculum";
import type { WeeklyCurriculum } from "@/lib/weekly-curriculum";
import { useTTS } from "@/lib/tts";

const COLOR = "#C026D3";
const ACCENT = "#F472B6";
const BG = "linear-gradient(160deg, #fdf0ff 0%, #f5d6ff 50%, #fff0ff 100%)";

// Simple word → emoji for verse boxes
const WORD_COLORS = [
  "#ff6eb4",
  "#a855f7",
  "#3b82f6",
  "#22c55e",
  "#f59e0b",
  "#ef4444",
  "#06b6d4",
  "#d946ef",
];

// Key words to show from the verse (toddler-simplified)
const TODDLER_VERSE_WORDS = ["Jesus", "loves", "me!", "Romans", "5:19", "🤍"];

const STAR_COUNT = 5;

export default function LoisBible() {
  const { speak } = useTTS("shimmer");
  const audioCtxRef = useRef<any>(null);
  const [curriculum, setCurriculum] = useState<WeeklyCurriculum | null>(null);
  const [stars, setStars] = useState<boolean[]>(new Array(STAR_COUNT).fill(false));

  useEffect(() => {
    if (typeof window === "undefined") return;

    const c = getWeeklyCurriculum();
    setCurriculum(c);

    // Load stars from localStorage
    try {
      const raw = localStorage.getItem("lois-bible-stars");
      if (raw) {
        const parsed = JSON.parse(raw) as boolean[];
        if (Array.isArray(parsed) && parsed.length === STAR_COUNT) {
          setStars(parsed);
        }
      }
    } catch {
      /* ignore */
    }

    // Auto-speak greeting
    setTimeout(() => {
      speak("God loves you so much, Lois!");
    }, 600);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function speakWord(word: string) {
    speak(word);
  }

  function playDing() {
    if (typeof window === "undefined") return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (
          (window as any).AudioContext || (window as any).webkitAudioContext
        )();
      }
      const ctx = audioCtxRef.current as AudioContext;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.4, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.5);
    } catch {
      /* ignore */
    }
  }

  function tapStar(i: number) {
    const next = [...stars];
    next[i] = !next[i];
    setStars(next);
    if (next[i]) {
      playDing();
      speak("Yay! A shiny star! 🌟");
    }
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("lois-bible-stars", JSON.stringify(next));
      }
    } catch {
      /* ignore */
    }
  }

  if (!curriculum) return null;

  const bigBtn: React.CSSProperties = {
    minHeight: 84,
    borderRadius: 22,
    fontSize: 20,
    fontWeight: 900,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    border: "none",
    padding: "0 24px",
    boxShadow: "0 3px 12px rgba(192,38,211,0.18)",
    width: "100%",
    marginTop: 12,
  };

  const sectionCard: React.CSSProperties = {
    background: "#ffffff",
    borderRadius: 26,
    padding: "22px 18px",
    marginBottom: 18,
    boxShadow: "0 3px 16px rgba(192,38,211,0.12)",
    border: `2px solid ${COLOR}22`,
  };

  const sectionTitle: React.CSSProperties = {
    fontSize: 22,
    fontWeight: 900,
    color: COLOR,
    marginBottom: 14,
    display: "flex",
    alignItems: "center",
    gap: 8,
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: BG,
        padding: "0 0 80px 0",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: `linear-gradient(135deg, ${COLOR}, #a21caf)`,
          padding: "24px 16px 20px",
          marginBottom: 18,
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 60, marginBottom: 8 }}>👑</div>
        <h1 style={{ fontSize: 34, fontWeight: 900, color: "#fff", margin: 0 }}>
          God Loves Lois!
        </h1>
        <p style={{ fontSize: 16, color: "rgba(255,255,255,0.85)", marginTop: 4 }}>
          ❄️ Princess Crystal is here with you! ❄️
        </p>
        <button
          onClick={() => speak("God loves you so much, Lois!")}
          style={{
            ...bigBtn,
            background: "rgba(255,255,255,0.22)",
            color: "#fff",
            maxWidth: 280,
            margin: "14px auto 0",
          }}
        >
          🔊 Say it again!
        </button>
      </div>

      <div style={{ maxWidth: 520, margin: "0 auto", padding: "0 14px" }}>
        {/* Weekly Card (xlarge, auto-speaks, shows only big truth + verse) */}
        <WeeklyBibleCard
          kidId="lois"
          color={COLOR}
          accentColor={ACCENT}
          uiSize="xlarge"
        />

        {/* ── Today's Big Truth ── */}
        <div style={sectionCard}>
          <div style={sectionTitle}>✨ Today&apos;s Big Truth</div>
          <div style={{ fontSize: 72, textAlign: "center", marginBottom: 12 }}>🌟</div>
          <p
            style={{
              fontSize: 32,
              fontWeight: 900,
              color: "#7c3aed",
              textAlign: "center",
              lineHeight: 1.35,
              marginBottom: 16,
            }}
          >
            {curriculum.character.toddlerFriendly}
          </p>
          <button
            onClick={() => speak(curriculum.character.toddlerFriendly)}
            style={{
              ...bigBtn,
              background: `linear-gradient(135deg, ${COLOR}, ${ACCENT})`,
              color: "#fff",
            }}
          >
            Hear it again! 🔊
          </button>
        </div>

        {/* ── Verse For Me ── */}
        <div style={sectionCard}>
          <div style={sectionTitle}>📖 Verse For Me!</div>
          <p
            style={{
              fontSize: 18,
              fontWeight: 800,
              color: "#888",
              marginBottom: 14,
              textAlign: "center",
            }}
          >
            Tap each box to hear the word! ❄️
          </p>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
              justifyContent: "center",
              marginBottom: 16,
            }}
          >
            {TODDLER_VERSE_WORDS.map((word, i) => (
              <button
                key={i}
                onClick={() => speakWord(word)}
                style={{
                  background: WORD_COLORS[i % WORD_COLORS.length],
                  color: "#fff",
                  border: "none",
                  borderRadius: 16,
                  padding: "16px 18px",
                  fontSize: 22,
                  fontWeight: 900,
                  cursor: "pointer",
                  minHeight: 64,
                  minWidth: 64,
                  boxShadow: "0 3px 10px rgba(0,0,0,0.15)",
                  transition: "transform 0.1s",
                  userSelect: "none",
                }}
                onTouchStart={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform = "scale(0.93)";
                }}
                onTouchEnd={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
                }}
              >
                {word}
              </button>
            ))}
          </div>

          <button
            onClick={() => speak("Jesus loves me! Romans 5 19")}
            style={{
              ...bigBtn,
              background: `linear-gradient(135deg, #7c3aed, #a855f7)`,
              color: "#fff",
            }}
          >
            🔊 Tell me again!
          </button>
        </div>

        {/* ── My Catechism ── */}
        <div style={sectionCard}>
          <div style={sectionTitle}>🙌 My Catechism</div>
          <p
            style={{
              fontSize: 18,
              fontWeight: 800,
              color: "#888",
              marginBottom: 10,
              textAlign: "center",
            }}
          >
            The answer is:
          </p>
          <p
            style={{
              fontSize: 28,
              fontWeight: 900,
              textAlign: "center",
              lineHeight: 1.4,
              marginBottom: 16,
              background: `linear-gradient(135deg, ${COLOR}, ${ACCENT}, #f59e0b, #22c55e)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {curriculum.catechism.answer}
          </p>
          <button
            onClick={() => speak(curriculum.catechism.answer)}
            style={{
              ...bigBtn,
              background: `linear-gradient(135deg, ${COLOR}, #a21caf)`,
              color: "#fff",
            }}
          >
            🔊 Hear it!
          </button>
        </div>

        {/* ── My Hymn ── */}
        <div style={sectionCard}>
          <div style={sectionTitle}>🎵 My Hymn</div>
          <p
            style={{
              fontSize: 26,
              fontWeight: 900,
              color: "#7c3aed",
              textAlign: "center",
              marginBottom: 8,
            }}
          >
            {curriculum.hymn.title}
          </p>
          <div style={{ fontSize: 56, textAlign: "center", marginBottom: 10 }}>🎵</div>
          <p
            style={{
              fontSize: 22,
              fontStyle: "italic",
              color: "#444",
              textAlign: "center",
              lineHeight: 1.5,
              marginBottom: 16,
            }}
          >
            {curriculum.hymn.verse.split("\n")[0]}
          </p>
          <button
            onClick={() => speak(curriculum.hymn.title + ". " + curriculum.hymn.verse.split("\n")[0])}
            style={{
              ...bigBtn,
              background: `linear-gradient(135deg, #f59e0b, #ef4444)`,
              color: "#fff",
            }}
          >
            Sing to me! 🎵
          </button>
        </div>

        {/* ── Star Chart ── */}
        <div style={sectionCard}>
          <div style={sectionTitle}>⭐ My Star Chart</div>
          <p
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: "#888",
              marginBottom: 16,
              textAlign: "center",
            }}
          >
            Tap a star to make it shine! ✨
          </p>

          <div
            style={{
              display: "flex",
              gap: 12,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            {stars.map((lit, i) => (
              <button
                key={i}
                onClick={() => tapStar(i)}
                style={{
                  background: lit
                    ? "linear-gradient(135deg, #f59e0b, #fbbf24)"
                    : "#e5e7eb",
                  border: lit ? "2px solid #f59e0b" : "2px solid #d1d5db",
                  borderRadius: 18,
                  width: 80,
                  height: 80,
                  fontSize: 42,
                  cursor: "pointer",
                  boxShadow: lit
                    ? "0 0 18px rgba(245,158,11,0.5), 0 2px 10px rgba(0,0,0,0.1)"
                    : "0 2px 6px rgba(0,0,0,0.08)",
                  transition: "all 0.2s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {lit ? "⭐" : "☆"}
              </button>
            ))}
          </div>

          {stars.every(Boolean) && (
            <div
              style={{
                marginTop: 16,
                background: "linear-gradient(135deg, #fef3c7, #fde68a)",
                border: "2px solid #f59e0b",
                borderRadius: 16,
                padding: "14px",
                textAlign: "center",
              }}
            >
              <p style={{ fontSize: 22, fontWeight: 900, color: "#92400e" }}>
                ⭐⭐⭐⭐⭐ Amazing, Lois! All stars! ⭐⭐⭐⭐⭐
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── Story Time button ──────────────────────────────────────────── */}
      <div
        style={{
          margin: "24px 0 8px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <a
          href="https://wng.org/podcasts/the-world-and-everything-in-it"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 12,
            background: "linear-gradient(135deg, #C026D3, #a21caf)",
            color: "#fff",
            borderRadius: 20,
            padding: "20px 32px",
            fontSize: "clamp(1.2rem, 4vw, 1.6rem)",
            fontWeight: 900,
            textDecoration: "none",
            boxShadow: "0 6px 24px rgba(192,38,211,0.35)",
            border: "2px solid #e879f9",
          }}
        >
          <span style={{ fontSize: "1.4em" }}>🎵</span>
          Story Time!
          <span style={{ fontSize: "1.4em" }}>🎵</span>
        </a>
      </div>
    </div>
  );
}
