"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { KIDS, KIDS_ORDER, TRUMA_EARTHY, TRUMA_THEME, type KidId } from "@/lib/kids";
import FamilyLaunchMode from "./FamilyLaunchMode";
import SchoolhouseLogo from "./SchoolhouseLogo";

// ── Home uses the design system's shared/parent accent (ink-blue) ─────────────
const GREEN = "var(--accent)";
const GREEN_DARK = "var(--accent-strong)";

// ── Verse of the day (rotates daily) ────────────────────────────────────────
const VERSES = [
  { ref: "Psalm 119:105",    text: "Your word is a lamp to my feet and a light to my path." },
  { ref: "Proverbs 22:6",    text: "Train up a child in the way he should go; even when he is old he will not depart from it." },
  { ref: "Proverbs 1:7",     text: "The fear of the Lord is the beginning of knowledge." },
  { ref: "Colossians 3:23",  text: "Whatever you do, work heartily, as for the Lord and not for men." },
];
function todaysVerse() {
  const day = Math.floor(Date.now() / 86_400_000);
  return VERSES[day % VERSES.length];
}

// ── Progress helpers ─────────────────────────────────────────────────────────
function getKidProg(kidId: string) {
  if (typeof window === "undefined") return { level: 1, xp: 0, xpMax: 200, streak: 0 };
  try {
    const raw = localStorage.getItem(`elc-progress-${kidId}`);
    const p = raw ? JSON.parse(raw) : {};
    return { level: p.level ?? 1, xp: p.xp ?? 0, xpMax: p.xpMax ?? 200, streak: p.streak ?? 0 };
  } catch { return { level: 1, xp: 0, xpMax: 200, streak: 0 }; }
}

// ── Schoolhouse logo mark (replaces the old circle-S monogram) ────────────────
function Crest({ size = 66 }: { size?: number }) {
  return <SchoolhouseLogo size={size} />;
}

// ── Progress bar ──────────────────────────────────────────────────────────────
function Bar({ value, color, height = 5 }: { value: number; color: string; height?: number }) {
  return (
    <div style={{ height, borderRadius: 99, background: "rgba(23,20,17,0.06)", overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${Math.round(Math.min(value, 1) * 100)}%`, borderRadius: 99,
        background: color, transition: "width .6s ease" }} />
    </div>
  );
}

// ── KidPickCard (Academy: white card, color accent rail, serif name) ──────────
interface KidPickCardProps {
  kidId: string;
  name: string;
  grade: string;
  avatar: string;
  tutor: string;
  color: string;
  onClick: () => void;
}
function KidPickCard({ kidId, name, grade, avatar, tutor, color, onClick }: KidPickCardProps) {
  const [hov, setHov] = useState(false);
  const [prog, setProg] = useState({ level: 1, xp: 0, xpMax: 200, streak: 0 });

  useEffect(() => { setProg(getKidProg(kidId)); }, [kidId]);

  return (
    <button
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      onClick={onClick}
      style={{ position: "relative", overflow: "hidden", textAlign: "left", cursor: "pointer",
        borderRadius: 12, padding: "15px 16px 15px 20px", display: "flex", alignItems: "center", gap: 14,
        background: "#ffffff",
        border: `1px solid ${hov ? color + "80" : "var(--border)"}`,
        boxShadow: hov ? `0 8px 22px ${color}22` : "0 1px 2px rgba(23,20,17,0.05)",
        transform: hov ? "translateY(-2px)" : "translateY(0)",
        transition: "all .18s ease" }}>
      {/* color accent rail */}
      <span aria-hidden style={{ position: "absolute", left: 0, top: 14, bottom: 14, width: 3,
        borderRadius: "0 3px 3px 0", background: color }} />
      {/* streak badge */}
      {prog.streak >= 3 && (
        <span style={{ position: "absolute", top: 10, right: 12, fontFamily: "var(--font-body)",
          fontWeight: 600, fontSize: 11, color: "var(--terracotta)" }}>
          {prog.streak} day streak
        </span>
      )}
      {/* Avatar tile */}
      <div style={{ width: 54, height: 54, borderRadius: 12, flexShrink: 0, display: "grid",
        placeItems: "center", fontSize: 30, background: color + "14" }}>
        {avatar}
      </div>
      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: "var(--font-scripture)", fontWeight: 600, fontSize: 21,
          color: color, lineHeight: 1.15 }}>{name}</div>
        <div style={{ fontFamily: "var(--font-body)", fontSize: 10.5, letterSpacing: "0.09em",
          textTransform: "uppercase", color: "var(--ink-3)", marginTop: 2 }}>{grade}</div>
        <div style={{ fontFamily: "var(--font-body)", fontSize: 12.5, color: "var(--muted)", marginTop: 3 }}>
          with {tutor}</div>
        <div style={{ marginTop: 9 }}>
          <Bar value={prog.xp / prog.xpMax} color={color} height={5} />
        </div>
      </div>
      {/* arrow */}
      <span aria-hidden style={{ fontFamily: "var(--font-body)", fontSize: 20, color,
        opacity: hov ? 1 : 0.3, transform: hov ? "translateX(0)" : "translateX(-4px)",
        transition: "all .18s ease" }}>→</span>
    </button>
  );
}

// ── Main landing ─────────────────────────────────────────────────────────────
export default function FamilyLanding() {
  const router = useRouter();
  const [showPin, setShowPin] = useState(false);
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showLaunch, setShowLaunch] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const verse = todaysVerse();

  useEffect(() => {
    if (showPin) setTimeout(() => inputRef.current?.focus(), 50);
  }, [showPin]);

  function pick(who: KidId | "truma") {
    if (who === "truma") { router.push("/hub"); return; }
    router.push(`/kids/${who}/hub`);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!pin.trim()) return;
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode: "parent", pin: pin.trim() }),
    });
    if (res.ok) {
      router.push("/teacher");
    } else {
      setError("Wrong PIN, try again!");
      setPin("");
      setLoading(false);
      inputRef.current?.focus();
    }
  }

  // Build the 4-kid array for the grid: Truma first, then KIDS_ORDER
  const allKids = [
    {
      kidId: "truma",
      name: "Truma",
      grade: TRUMA_EARTHY.grade,
      avatar: TRUMA_EARTHY.avatar,
      tutor: TRUMA_EARTHY.tutorName,
      color: TRUMA_THEME.primary,
      onClick: () => pick("truma"),
    },
    ...KIDS_ORDER.map((id) => {
      const k = KIDS[id];
      return {
        kidId: id,
        name: k.name,
        grade: k.grade,
        avatar: k.emoji,
        tutor: k.tutorName,
        color: k.colorHex,
        onClick: () => pick(id),
      };
    }),
  ];

  const eyebrow: React.CSSProperties = {
    fontFamily: "var(--font-body)", fontSize: 11.5, letterSpacing: "0.2em",
    textTransform: "uppercase", color: GREEN,
  };

  return (
    <>
      <main style={{ minHeight: "100vh", display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
        background: "var(--tfe-cream)" }}>

        {/* ── Left: crest, wordmark, verse ─────────────────────────── */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center",
          justifyContent: "center", padding: "44px 44px", gap: 36,
          borderRight: "1px solid var(--border)" }}>

          {/* Wordmark */}
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <Crest size={70} />
            <div>
              <div style={eyebrow}>Echols Academy</div>
              <div style={{ fontFamily: "var(--font-scripture)", fontWeight: 600,
                fontSize: "clamp(2.4rem, 5vw, 3.1rem)", color: "var(--ink)", lineHeight: 1,
                marginTop: 4 }}>
                Schoolhouse
              </div>
            </div>
          </div>

          {/* Verse of the day */}
          <div style={{ maxWidth: 460, width: "100%", textAlign: "center",
            borderTop: "1px solid var(--border)", paddingTop: 26 }}>
            <div style={{ ...eyebrow, color: "var(--ink-3)", marginBottom: 14 }}>Verse of the day</div>
            <div style={{ fontFamily: "var(--font-scripture)", fontSize: 25, fontWeight: 500,
              color: "var(--ink-2)", lineHeight: 1.5 }}>
              &ldquo;{verse.text}&rdquo;
            </div>
            <div style={{ fontFamily: "var(--font-body)", fontSize: 12.5, letterSpacing: "0.1em",
              textTransform: "uppercase", color: GREEN, marginTop: 16 }}>
              {verse.ref}
            </div>
          </div>
        </div>

        {/* ── Right: who's learning today ──────────────────────────── */}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center",
          padding: "44px 48px", gap: 22 }}>
          <div>
            <div style={eyebrow}>Welcome</div>
            <h1 style={{ fontFamily: "var(--font-scripture)", fontWeight: 600,
              fontSize: "clamp(2rem, 4vw, 2.5rem)", color: "var(--ink)", margin: "6px 0 0",
              lineHeight: 1.05 }}>
              Who&rsquo;s learning today?
            </h1>
            <p style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "var(--muted)",
              marginTop: 8, marginBottom: 0 }}>
              Tap your name to open your hub.
            </p>
          </div>

          {/* Kid grid: 2 columns when there's room, 1 column on a narrow phone
              so the name/grade/tutor text never gets cramped or clipped. */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14 }}>
            {allKids.map(k => <KidPickCard key={k.kidId} {...k} />)}
          </div>

          {/* Mom & Dad — grown-ups' learning */}
          <button onClick={() => router.push("/grownups")}
            style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer",
              border: "1px solid var(--border)", background: "#ffffff",
              borderRadius: 12, padding: "12px 16px", width: "100%",
              boxShadow: "0 1px 2px rgba(23,20,17,0.05)" }}>
            <span aria-hidden style={{ fontSize: 22 }}>📖</span>
            <div style={{ flex: 1, textAlign: "left" }}>
              <div style={{ fontFamily: "var(--font-scripture)", fontWeight: 600, fontSize: 17,
                color: "var(--ink)" }}>Mom &amp; Dad</div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 12.5, color: "var(--muted)" }}>
                Learn what you choose
              </div>
            </div>
            <span aria-hidden style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 18,
              color: GREEN }}>→</span>
          </button>

          {/* Footer row: parent station + today's plan */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
            gap: 12, flexWrap: "wrap" }}>
            {!showPin ? (
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button onClick={() => setShowPin(true)}
                  style={{ display: "inline-flex", alignItems: "center", gap: 9, cursor: "pointer",
                    border: "1px solid var(--border)", background: "#ffffff",
                    borderRadius: 10, padding: "11px 16px", fontFamily: "var(--font-body)",
                    fontWeight: 500, fontSize: 13.5, color: "var(--ink-2)" }}>
                  <span aria-hidden>🔑</span> Parent &amp; Homeroom
                </button>
                <button onClick={() => router.push("/plan")}
                  style={{ display: "inline-flex", alignItems: "center", gap: 9, cursor: "pointer",
                    border: "1px solid var(--border)", background: "#ffffff",
                    borderRadius: 10, padding: "11px 16px", fontFamily: "var(--font-body)",
                    fontWeight: 500, fontSize: 13.5, color: "var(--ink-2)" }}>
                  <span aria-hidden>📚</span> Lesson Plan
                </button>
              </div>
            ) : <span />}

            <button
              onClick={() => setShowLaunch(true)}
              style={{ display: "inline-flex", alignItems: "center", gap: 9, cursor: "pointer",
                border: "none", background: GREEN, borderRadius: 10, padding: "12px 20px",
                fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 14, color: "#fff",
                minHeight: 46 }}
              onMouseEnter={e => (e.currentTarget.style.background = GREEN_DARK)}
              onMouseLeave={e => (e.currentTarget.style.background = GREEN)}>
              <span aria-hidden>📋</span> Today&rsquo;s Plan
            </button>
          </div>

          {/* Parent PIN panel */}
          {showPin && (
            <div style={{ background: "#ffffff", borderRadius: 14, padding: "20px 24px",
              border: "1px solid var(--border)" }}>
              <div style={{ ...eyebrow, marginBottom: 14 }}>Parent PIN</div>
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <input
                  ref={inputRef}
                  type="password"
                  value={pin}
                  onChange={e => setPin(e.target.value)}
                  placeholder="Enter PIN…"
                  autoComplete="off"
                  style={{ border: "1px solid var(--border)", borderRadius: 10, padding: "14px 18px",
                    fontSize: 22, textAlign: "center", letterSpacing: "0.3em", fontFamily: "var(--font-body)",
                    color: "var(--ink)", outline: "none", background: "var(--sunken)" }}
                />
                {error && (
                  <p style={{ color: "var(--terracotta)", textAlign: "center", fontSize: 13,
                    fontWeight: 600, margin: 0 }}>{error}</p>
                )}
                <div style={{ display: "flex", gap: 8 }}>
                  <button type="button" onClick={() => { setShowPin(false); setPin(""); setError(""); }}
                    style={{ flex: 1, padding: "12px", borderRadius: 10, border: "1px solid var(--border)",
                      background: "var(--sunken)", fontFamily: "var(--font-body)", fontWeight: 500,
                      fontSize: 14, color: "var(--muted)", cursor: "pointer" }}>
                    Cancel
                  </button>
                  <button type="submit" disabled={!pin.trim() || loading}
                    style={{ flex: 2, padding: "12px", borderRadius: 10, border: "none",
                      background: GREEN, fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 14,
                      color: "#fff", cursor: "pointer", opacity: (!pin.trim() || loading) ? 0.4 : 1 }}>
                    {loading ? "Checking…" : "Open Station →"}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </main>

      {/* Launch mode overlay */}
      {showLaunch && <FamilyLaunchMode onClose={() => setShowLaunch(false)} />}
    </>
  );
}
