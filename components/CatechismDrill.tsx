"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CATECHISM, KID_CATECHISM_RANGES, type CatechismQuestion } from "@/lib/catechism-boys-girls";
import type { KidProfile } from "@/lib/kids";
import { useTTS, OPENAI_VOICE } from "@/lib/tts";

// ── Mastery storage ───────────────────────────────────────────────────────────
interface QuestionRecord { mastered: boolean; attempts: number; lastSeen: string }
type MasteryMap = Record<string, QuestionRecord>;

function loadMastery(kidId: string): MasteryMap {
  try {
    const raw = localStorage.getItem(`catechism-mastery-${kidId}`);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}
function saveMastery(kidId: string, m: MasteryMap) {
  try { localStorage.setItem(`catechism-mastery-${kidId}`, JSON.stringify(m)); } catch { /* */ }
}
function addXp(kidId: string, amount: number) {
  try {
    const raw = localStorage.getItem(`elc-progress-${kidId}`);
    const p = raw ? JSON.parse(raw) : {};
    p.xp = (p.xp ?? 0) + amount;
    p.xpMax = p.xpMax ?? 200;
    if (p.xp >= p.xpMax) { p.level = (p.level ?? 1) + 1; p.xp = p.xp - p.xpMax; }
    localStorage.setItem(`elc-progress-${kidId}`, JSON.stringify(p));
  } catch { /* */ }
}

// ── Session builder ───────────────────────────────────────────────────────────
const SESSION_SIZE = 5;
function buildSession(kidId: string, mastery: MasteryMap): CatechismQuestion[] {
  const maxN = KID_CATECHISM_RANGES[kidId]?.to ?? 33;
  const pool = CATECHISM.filter(q => q.number <= maxN);
  const fresh = pool.filter(q => !mastery[q.number]?.mastered);
  const known = pool.filter(q => mastery[q.number]?.mastered);
  // Prioritize unmastered; fill remainder with review
  const pick = [...fresh.slice(0, SESSION_SIZE)];
  if (pick.length < SESSION_SIZE) {
    const review = known.sort(() => Math.random() - 0.5);
    pick.push(...review.slice(0, SESSION_SIZE - pick.length));
  }
  return pick.slice(0, SESSION_SIZE).sort(() => Math.random() - 0.5);
}

// ── Progress ring ─────────────────────────────────────────────────────────────
function Ring({ pct, color, size = 56 }: { pct: number; color: string; size?: number }) {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke="rgba(0,0,0,0.07)" strokeWidth={7} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={color} strokeWidth={7}
        strokeDasharray={circ}
        strokeDashoffset={circ * (1 - pct)}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: "stroke-dashoffset .5s var(--ease)" }} />
    </svg>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function CatechismDrill({ profile }: { profile: KidProfile }) {
  const router = useRouter();
  const { id: kidId, color, colorDark, soft, uiSize, name } = profile;
  const { speak } = useTTS(OPENAI_VOICE[kidId] ?? "nova");

  const [mastery, setMastery]       = useState<MasteryMap>({});
  const [session, setSession]       = useState<CatechismQuestion[]>([]);
  const [idx, setIdx]               = useState(0);
  const [phase, setPhase]           = useState<"q" | "a" | "done">("q");
  const [sessionGot, setSessionGot] = useState(0);
  const [revealed, setRevealed]     = useState(false);
  const [ready, setReady]           = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const m = loadMastery(kidId);
    setMastery(m);
    setSession(buildSession(kidId, m));
    setReady(true);
  }, [kidId]);

  const maxN    = KID_CATECHISM_RANGES[kidId]?.to ?? 33;
  const pool    = CATECHISM.filter(q => q.number <= maxN);
  const masteredCount = pool.filter(q => mastery[q.number]?.mastered).length;
  const pct = pool.length > 0 ? masteredCount / pool.length : 0;

  const current = session[idx];

  useEffect(() => {
    if (uiSize === "xlarge" && ready && current && phase === "q") {
      speak(current.question);
    }
  }, [idx, phase, ready, current, uiSize, speak]);

  function revealAnswer() {
    setRevealed(true);
    setPhase("a");
    if (uiSize === "xlarge" && current) {
      setTimeout(() => speak(current.answer), 300);
    }
  }

  function grade(gotIt: boolean) {
    if (!current) return;
    const now = new Date().toISOString();
    const updated: MasteryMap = {
      ...mastery,
      [current.number]: {
        mastered:  gotIt,
        attempts:  (mastery[current.number]?.attempts ?? 0) + 1,
        lastSeen:  now,
      },
    };
    setMastery(updated);
    saveMastery(kidId, updated);
    if (gotIt) {
      addXp(kidId, 5);
      setSessionGot(g => g + 1);
    }

    if (idx + 1 >= session.length) {
      setPhase("done");
    } else {
      setIdx(i => i + 1);
      setPhase("q");
      setRevealed(false);
    }
  }

  function startNew() {
    const m = loadMastery(kidId);
    setMastery(m);
    setSession(buildSession(kidId, m));
    setIdx(0);
    setPhase("q");
    setRevealed(false);
    setSessionGot(0);
  }

  // ── Font sizes per uiSize ────────────────────────────────────────────────
  const qSize  = uiSize === "xlarge" ? 34 : uiSize === "large" ? 26 : 22;
  const aSize  = uiSize === "xlarge" ? 30 : uiSize === "large" ? 24 : 20;
  const refSz  = uiSize === "xlarge" ? 14 : 13;

  if (!ready || session.length === 0) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center",
        justifyContent: "center", background: "var(--bg)" }}>
        <span style={{ fontFamily: "var(--font-body)", color: "var(--muted)", fontSize: 18 }}>
          Loading catechism…
        </span>
      </div>
    );
  }

  // ── Complete screen ──────────────────────────────────────────────────────
  if (phase === "done") {
    const allDone = masteredCount >= pool.length;
    return (
      <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex",
        flexDirection: "column", alignItems: "center", justifyContent: "center",
        padding: "40px 24px", gap: 28 }}>

        <div style={{ fontSize: 72 }}>
          {sessionGot === SESSION_SIZE ? "🎉" : sessionGot >= 3 ? "✨" : "📖"}
        </div>

        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: "var(--font-scripture)", fontStyle: "italic",
            fontSize: qSize, color: colorDark, lineHeight: 1.3 }}>
            {sessionGot === SESSION_SIZE
              ? "Perfect round!"
              : sessionGot >= 3
              ? "Good work, " + name + "!"
              : "Keep at it, " + name + "!"}
          </div>
          <div style={{ fontFamily: "var(--font-body)", fontSize: 16, color: "var(--muted)",
            marginTop: 8 }}>
            {sessionGot} of {SESSION_SIZE} remembered
          </div>
        </div>

        {/* Overall progress */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "20px 28px",
          background: soft, borderRadius: 20, border: `1px solid ${color}33` }}>
          <Ring pct={pct} color={color} size={64} />
          <div>
            <div style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: 18,
              color: colorDark }}>
              {masteredCount} / {pool.length} mastered
            </div>
            <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--muted)" }}>
              Truth &amp; Grace Book 1
            </div>
            {allDone && (
              <div style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: 13,
                color, marginTop: 4 }}>
                Book 1 complete!
              </div>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
          <button onClick={startNew} className="btn-bouncy"
            style={{ padding: "16px 28px", borderRadius: 16, border: "none",
              background: `linear-gradient(135deg,${color},${colorDark})`,
              fontFamily: "var(--font-body)", fontWeight: 700, fontSize: 17,
              color: "#fff", cursor: "pointer", boxShadow: `0 6px 20px ${color}44` }}>
            Another round
          </button>
          <button onClick={() => router.push(`/kids/${kidId}/hub`)} className="btn-bouncy"
            style={{ padding: "16px 28px", borderRadius: 16,
              border: `1.5px solid ${color}44`, background: "var(--bg)",
              fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 17,
              color: colorDark, cursor: "pointer" }}>
            Back to hub
          </button>
        </div>
      </div>
    );
  }

  // ── Drill screen ─────────────────────────────────────────────────────────
  const prevMastered = mastery[current.number]?.mastered;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex",
      flexDirection: "column", padding: "0 0 40px" }}>

      {/* ── Top bar ─────────────────────────────────────────────────────── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "16px 20px", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
        <button onClick={() => router.push(`/kids/${kidId}/hub`)}
          style={{ background: "none", border: "none", cursor: "pointer",
            fontFamily: "var(--font-body)", fontSize: 15, color: "var(--muted)",
            padding: "6px 10px", borderRadius: 10,
            display: "flex", alignItems: "center", gap: 6 }}>
          ← hub
        </button>

        {/* Progress pill */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {session.map((_, i) => (
            <div key={i} style={{
              width: i < idx ? 22 : i === idx ? 22 : 14,
              height: 8, borderRadius: 99,
              background: i < idx
                ? color
                : i === idx
                ? `linear-gradient(90deg,${color},${color}88)`
                : "rgba(0,0,0,0.08)",
              transition: "all .3s var(--ease)"
            }} />
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Ring pct={pct} color={color} size={36} />
          <span style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 13,
            color: colorDark }}>
            {masteredCount}/{pool.length}
          </span>
        </div>
      </div>

      {/* ── Question card ────────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", padding: "32px 24px", gap: 28, maxWidth: 700, margin: "0 auto",
        width: "100%" }}>

        {/* Eyebrow */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: 12,
            letterSpacing: "0.16em", textTransform: "uppercase", color }}>
            Truth &amp; Grace · Q{current.number}
          </span>
          {prevMastered && (
            <span style={{ fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 600,
              color, background: soft, padding: "2px 9px", borderRadius: 99,
              border: `1px solid ${color}44` }}>
              Review
            </span>
          )}
        </div>

        {/* Question */}
        <div style={{ textAlign: "center", maxWidth: 560 }}>
          {uiSize === "xlarge" && (
            <button onClick={() => speak(current.question)}
              style={{ background: "none", border: "none", cursor: "pointer",
                fontSize: 28, marginBottom: 8, display: "block", margin: "0 auto 8px" }}>
              🔊
            </button>
          )}
          <p style={{ fontFamily: "var(--font-scripture)", fontStyle: "italic",
            fontSize: qSize, color: "var(--ink)", lineHeight: 1.5, margin: 0,
            textAlign: "center" }}>
            &ldquo;{current.question}&rdquo;
          </p>
        </div>

        {/* Answer reveal */}
        {phase === "a" ? (
          <div style={{ width: "100%", maxWidth: 560, borderRadius: 20,
            background: soft, border: `1.5px solid ${color}33`,
            padding: "24px 28px",
            animation: "popIn .25s var(--ease)" }}>
            {uiSize === "xlarge" && (
              <button onClick={() => speak(current.answer)}
                style={{ background: "none", border: "none", cursor: "pointer",
                  fontSize: 24, display: "block", marginBottom: 8 }}>
                🔊
              </button>
            )}
            <p style={{ fontFamily: "var(--font-scripture)",
              fontSize: aSize, color: colorDark, lineHeight: 1.55, margin: "0 0 12px",
              textAlign: "center" }}>
              {current.answer}
            </p>
            <p style={{ fontFamily: "var(--font-body)", fontSize: refSz, color: "var(--muted)",
              margin: 0, textAlign: "center", lineHeight: 1.5 }}>
              {current.reference}
            </p>
          </div>
        ) : (
          <button onClick={revealAnswer} className="btn-bouncy"
            style={{ padding: uiSize === "xlarge" ? "22px 44px" : "18px 36px",
              borderRadius: 18, border: "none",
              background: `linear-gradient(135deg,${color},${colorDark})`,
              fontFamily: "var(--font-body)", fontWeight: 700,
              fontSize: uiSize === "xlarge" ? 22 : uiSize === "large" ? 19 : 17,
              color: "#fff", cursor: "pointer",
              boxShadow: `0 8px 24px ${color}44` }}>
            Show Answer
          </button>
        )}

        {/* Grade buttons */}
        {phase === "a" && (
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center",
            animation: "floatUp .3s var(--ease)" }}>
            <button onClick={() => grade(true)} className="btn-bouncy"
              style={{ padding: uiSize === "xlarge" ? "18px 32px" : "15px 26px",
                borderRadius: 16, border: "none",
                background: `linear-gradient(135deg,${color},${colorDark})`,
                fontFamily: "var(--font-body)", fontWeight: 700,
                fontSize: uiSize === "xlarge" ? 20 : 17,
                color: "#fff", cursor: "pointer",
                boxShadow: `0 6px 18px ${color}44`, minWidth: 160 }}>
              Got it ✓
            </button>
            <button onClick={() => grade(false)} className="btn-bouncy"
              style={{ padding: uiSize === "xlarge" ? "18px 32px" : "15px 26px",
                borderRadius: 16,
                border: `1.5px solid rgba(0,0,0,0.12)`,
                background: "var(--bg)",
                fontFamily: "var(--font-body)", fontWeight: 600,
                fontSize: uiSize === "xlarge" ? 20 : 17,
                color: "var(--muted)", cursor: "pointer", minWidth: 160 }}>
              Still learning…
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
