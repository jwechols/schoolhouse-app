"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TRUMA_THEME } from "@/lib/kids";
import {
  DOCTRINES_OF_GRACE,
  MEMORY_PASSAGES,
  REFORMED_FIGURES,
  REFORMED_HYMNS,
  REFORMED_WOMEN,
} from "@/lib/reformed-content";
import {
  CATECHISM,
  CATECHISM_PARTS,
  getCatechismPart,
} from "@/lib/catechism-boys-girls";
import WeeklyBibleCard from "@/components/WeeklyBibleCard";
import { useTTS } from "@/lib/tts";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function SectionTitle({
  children,
  subtitle,
  italic,
}: {
  children: React.ReactNode;
  subtitle?: string;
  italic?: boolean;
}) {
  const T = TRUMA_THEME;
  return (
    <div className="mb-5">
      <h2
        className="text-2xl font-black mb-1"
        style={{
          color: italic ? T.primary : T.textGold,
          fontStyle: italic ? "italic" : "normal",
        }}
      >
        {children}
      </h2>
      <div
        style={{
          width: 48,
          height: 3,
          borderRadius: 2,
          background: `linear-gradient(90deg, ${T.gold}, ${T.goldLight})`,
          marginBottom: subtitle ? 8 : 0,
        }}
      />
      {subtitle && (
        <p className="text-sm mt-2" style={{ color: T.textMuted }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

// ─── Memorize Modal ───────────────────────────────────────────────────────────

interface MemorizeModalProps {
  passage: (typeof MEMORY_PASSAGES)[number];
  onClose: () => void;
  memorized: boolean;
  onToggle: () => void;
}

function MemorizeModal({ passage, onClose, memorized, onToggle }: MemorizeModalProps) {
  const T = TRUMA_THEME;
  const { speak, stopAudio } = useTTS("fable");
  const [speaking, setSpeaking] = useState(false);

  function handleSpeak() {
    setSpeaking(true);
    speak(`${passage.reference}. ${passage.text}`).then(() => setSpeaking(false)).catch(() => setSpeaking(false));
  }

  function stopSpeaking() {
    stopAudio();
    setSpeaking(false);
  }

  useEffect(() => {
    return () => {
      stopAudio();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="w-full max-w-lg rounded-3xl p-6 shadow-2xl"
        style={{
          background: "linear-gradient(160deg, #2E1525 0%, #1C0B16 100%)",
          border: `1px solid ${T.border}`,
          maxHeight: "85vh",
          overflowY: "auto",
        }}
      >
        {/* header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="text-2xl mb-1">{passage.emoji}</div>
            <h3 className="font-black text-xl" style={{ color: T.text }}>
              {passage.title}
            </h3>
            <p className="text-sm font-bold" style={{ color: T.textGold }}>
              {passage.reference}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-2xl leading-none"
            style={{ color: T.textMuted }}
          >
            ×
          </button>
        </div>

        {/* text */}
        <blockquote
          className="text-base leading-relaxed italic mb-6 p-4 rounded-2xl"
          style={{
            color: T.text,
            background: T.bgCard,
            borderLeft: `3px solid ${T.gold}`,
          }}
        >
          &ldquo;{passage.text}&rdquo;
        </blockquote>

        {/* actions */}
        <div className="flex gap-3">
          <button
            onClick={speaking ? stopSpeaking : handleSpeak}
            className="flex-1 py-3 rounded-2xl font-bold text-sm transition-all active:scale-95"
            style={{
              background: speaking ? `rgba(58,174,188,0.2)` : `rgba(58,174,188,0.12)`,
              border: `1px solid ${T.teal}50`,
              color: T.teal,
            }}
          >
            {speaking ? "⏹ Stop" : "🔊 Read Aloud"}
          </button>
          <button
            onClick={onToggle}
            className="flex-1 py-3 rounded-2xl font-black text-sm transition-all active:scale-95"
            style={{
              background: memorized ? `rgba(212,160,32,0.25)` : `rgba(155,74,114,0.25)`,
              border: `1px solid ${memorized ? T.gold : T.primary}50`,
              color: memorized ? T.gold : T.text,
            }}
          >
            {memorized ? "✓ Memorized!" : "I've Got It! ✓"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function TrumaBibleHub() {
  const router = useRouter();
  const T = TRUMA_THEME;

  // ── Doctrines accordion
  const [openDoctrine, setOpenDoctrine] = useState<string | null>(null);

  // ── Scripture memory
  const [memorized, setMemorized] = useState<Record<string, boolean>>({});
  const [activePassage, setActivePassage] = useState<(typeof MEMORY_PASSAGES)[number] | null>(null);

  // ── Catechism (full 145-Q "Boys & Girls" catechism, filterable by part)
  const [catPart, setCatPart] = useState<string>("all");
  const [catIndex, setCatIndex] = useState(0);
  const [catFlipped, setCatFlipped] = useState(false);
  const [catKnown, setCatKnown] = useState<Record<string, boolean>>({});

  // ── Women accordion
  const [expandedWoman, setExpandedWoman] = useState<string | null>(null);

  const { speak: speakHymnTTS, stopAudio: stopHymnAudio } = useTTS("fable");
  const [speakingHymn, setSpeakingHymn] = useState<string | null>(null);

  // ── Load persisted data
  useEffect(() => {
    try {
      const saved: Record<string, boolean> = {};
      MEMORY_PASSAGES.forEach((p) => {
        const val = localStorage.getItem(`truma-memorized-${p.id}`);
        if (val === "true") saved[p.id] = true;
      });
      setMemorized(saved);
    } catch {
      /* ignore */
    }

    try {
      const raw = localStorage.getItem("truma-catechism-known");
      if (raw) setCatKnown(JSON.parse(raw) as Record<string, boolean>);
    } catch {
      /* ignore */
    }
  }, []);

  function toggleMemorized(id: string) {
    const next = { ...memorized, [id]: !memorized[id] };
    setMemorized(next);
    try {
      localStorage.setItem(`truma-memorized-${id}`, String(next[id]));
    } catch {
      /* ignore */
    }
  }

  function markCatKnown(key: string, known: boolean) {
    const next = { ...catKnown, [key]: known };
    setCatKnown(next);
    try {
      localStorage.setItem("truma-catechism-known", JSON.stringify(next));
    } catch {
      /* ignore */
    }
    // advance card
    setCatIndex((i) => Math.min(i + 1, catList.length - 1));
    setCatFlipped(false);
  }

  const catList = catPart === "all" ? CATECHISM : getCatechismPart(catPart);
  const catKnownCount = catList.filter((q) => catKnown[`q-${q.number}`]).length;
  const catCurrent = catList[catIndex];

  function speakHymn(verse: string, hymnTitle: string) {
    if (speakingHymn === hymnTitle) {
      stopHymnAudio();
      setSpeakingHymn(null);
      return;
    }
    setSpeakingHymn(hymnTitle);
    speakHymnTTS(verse).then(() => setSpeakingHymn(null)).catch(() => setSpeakingHymn(null));
  }

  return (
    <main
      className="min-h-screen px-4 py-6 max-w-lg md:max-w-2xl mx-auto"
      style={{ background: T.bg }}
    >
      {/* ── HEADER ─────────────────────────────────────────────────────── */}
      <div className="mb-8">
        <button
          onClick={() => router.push("/hub")}
          className="text-sm font-bold mb-4 flex items-center gap-1 transition-opacity hover:opacity-80"
          style={{ color: T.textMuted }}
        >
          ← Back to Hub
        </button>
        <h1 className="text-4xl font-black leading-tight mb-1" style={{ color: T.textGold }}>
          📖 Bible &amp; Theology
        </h1>
        <p className="text-base" style={{ color: T.textMuted }}>
          Reformed Baptist · Rooted in the Word
        </p>
        <div
          style={{
            width: 80,
            height: 3,
            borderRadius: 2,
            marginTop: 12,
            background: `linear-gradient(90deg, ${T.gold}, ${T.goldLight})`,
          }}
        />
      </div>

      {/* ── Weekly Bible Card ────────────────────────────────────────── */}
      <WeeklyBibleCard kidId="truma" color="#9B4A72" accentColor="#D4A020" />

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 1, DOCTRINES OF GRACE
      ═══════════════════════════════════════════════════════════════ */}
      <section className="mb-10">
        <SectionTitle subtitle="What we believe about how God saves his people">
          The Doctrines of Grace
        </SectionTitle>

        <div className="grid grid-cols-2 gap-3">
          {DOCTRINES_OF_GRACE.map((doc) => {
            const open = openDoctrine === doc.letter;
            return (
              <button
                key={doc.letter}
                onClick={() => setOpenDoctrine(open ? null : doc.letter)}
                className={`rounded-2xl p-4 text-left transition-all duration-200 shadow-md${open ? " col-span-2" : ""}`}
                style={{
                  background: T.bgCard,
                  border: `1px solid ${T.border}`,
                  borderLeft: `4px solid ${doc.color}`,
                }}
              >
                <div className="flex items-start gap-3">
                  <span
                    className="font-black text-5xl leading-none flex-shrink-0"
                    style={{ color: T.gold, opacity: 0.9 }}
                  >
                    {doc.letter}
                  </span>
                  <div className="flex-1">
                    <p className="font-black text-sm leading-tight" style={{ color: T.text }}>
                      {doc.name}
                    </p>
                    <p className="text-xs mt-0.5 leading-tight" style={{ color: T.textMuted }}>
                      {doc.subtitle}
                    </p>
                    {!open && (
                      <p
                        className="text-xs mt-1.5 font-semibold"
                        style={{ color: T.textGold, opacity: 0.7 }}
                      >
                        Tap to learn →
                      </p>
                    )}
                  </div>
                </div>

                {open && (
                  <div className="mt-4 space-y-3">
                    <p className="text-sm leading-relaxed" style={{ color: T.text }}>
                      {doc.summary}
                    </p>
                    <blockquote
                      className="text-sm italic leading-relaxed p-3 rounded-xl"
                      style={{
                        color: T.textGold,
                        background: "rgba(212,160,32,0.08)",
                        borderLeft: `2px solid ${T.gold}`,
                      }}
                    >
                      {doc.scripture}
                    </blockquote>
                    <p className="text-sm leading-relaxed" style={{ color: T.textMuted }}>
                      {doc.explanation}
                    </p>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 2, SCRIPTURE MEMORY
      ═══════════════════════════════════════════════════════════════ */}
      <section className="mb-10">
        <SectionTitle subtitle="Hide these in your heart, they'll be there when you need them">
          Scripture to Hide in Your Heart
        </SectionTitle>

        <div className="flex flex-col gap-3">
          {MEMORY_PASSAGES.map((p) => {
            const done = memorized[p.id] ?? false;
            return (
              <div
                key={p.id}
                className="rounded-2xl p-4 flex gap-3 items-start shadow-md"
                style={{
                  background: T.bgCard,
                  border: `1px solid ${done ? T.gold + "50" : T.border}`,
                }}
              >
                <span className="text-2xl flex-shrink-0 mt-0.5">{p.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <span className="font-black text-sm" style={{ color: T.text }}>
                      {p.title}
                    </span>
                    {done && (
                      <span
                        className="text-xs font-black px-1.5 py-0.5 rounded-full"
                        style={{ background: T.gold + "25", color: T.gold }}
                      >
                        ✓
                      </span>
                    )}
                  </div>
                  <div className="text-xs font-bold mb-1" style={{ color: T.textGold }}>
                    {p.reference}
                  </div>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-semibold"
                    style={{
                      background: T.primary + "30",
                      color: T.primary,
                      border: `1px solid ${T.primary}40`,
                    }}
                  >
                    {p.theme}
                  </span>
                  <p
                    className="text-xs mt-2 leading-relaxed"
                    style={{
                      color: T.textMuted,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    &ldquo;{p.text}&rdquo;
                  </p>
                </div>
                <button
                  onClick={() => setActivePassage(p)}
                  className="flex-shrink-0 px-3 py-2 rounded-xl font-black text-xs transition-all active:scale-95"
                  style={{
                    background: T.primary + "30",
                    color: T.text,
                    border: `1px solid ${T.primary}40`,
                  }}
                >
                  Memorize
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 3, CATECHISM DRILL
      ═══════════════════════════════════════════════════════════════ */}
      <section className="mb-10">
        <SectionTitle subtitle="Question and answer, the ancient way of learning theology">
          Catechism
        </SectionTitle>

        {/* Part filter */}
        <div
          className="flex flex-wrap gap-2 mb-5"
        >
          {(["all", ...CATECHISM_PARTS] as const).map((part) => (
            <button
              key={part}
              onClick={() => {
                setCatPart(part);
                setCatIndex(0);
                setCatFlipped(false);
              }}
              className="py-1.5 px-3 rounded-xl font-bold text-xs transition-all"
              style={{
                background: catPart === part ? T.primary : "rgba(255,255,255,0.06)",
                border: `1px solid ${catPart === part ? T.primary : T.border}`,
                color: catPart === part ? "#fff" : T.textMuted,
              }}
            >
              {part === "all" ? "All 145" : part}
            </button>
          ))}
        </div>

        {/* Progress bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1.5" style={{ color: T.textMuted }}>
            <span>
              {catKnownCount} / {catList.length} known
            </span>
            <span style={{ color: T.textGold }}>
              {Math.round((catKnownCount / catList.length) * 100)}%
            </span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${(catKnownCount / catList.length) * 100}%`,
                background: `linear-gradient(90deg, ${T.gold}, ${T.goldLight})`,
              }}
            />
          </div>
        </div>

        {/* Flashcard */}
        {catCurrent && (
          <div>
            <div
              onClick={() => setCatFlipped(!catFlipped)}
              className="rounded-3xl p-6 mb-4 cursor-pointer flex flex-col justify-between shadow-xl transition-all duration-200 active:scale-95"
              style={{
                minHeight: 160,
                background: catFlipped
                  ? `linear-gradient(135deg, ${T.primary}20, ${T.primary}10)`
                  : T.bgCard,
                border: `1px solid ${catFlipped ? T.primary + "60" : T.border}`,
              }}
            >
              <div
                className="text-xs font-bold uppercase tracking-wider mb-3"
                style={{ color: T.textMuted }}
              >
                {catFlipped
                  ? "Answer"
                  : `Q${catCurrent.number} of ${catList.length > 0 ? catList[catList.length - 1].number : "?"} · Tap to flip`}
              </div>
              <p
                className="text-base font-semibold leading-relaxed"
                style={{ color: catFlipped ? T.text : T.textGold }}
              >
                {catFlipped ? catCurrent.answer : catCurrent.question}
              </p>
              {catFlipped && catCurrent.reference && (
                <p className="text-xs mt-3 italic" style={{ color: T.textMuted }}>
                  {catCurrent.reference}
                </p>
              )}
              {!catFlipped && (
                <div className="flex justify-end mt-3">
                  <span style={{ color: T.primary, opacity: 0.6, fontSize: "1.5rem" }}>↻</span>
                </div>
              )}
            </div>

            {catFlipped && (
              <div className="flex gap-3">
                <button
                  onClick={() => markCatKnown(`q-${catCurrent.number}`, false)}
                  className="flex-1 py-3 rounded-2xl font-bold text-sm transition-all active:scale-95"
                  style={{
                    background: "rgba(239,68,68,0.15)",
                    border: "1px solid rgba(239,68,68,0.3)",
                    color: "#fca5a5",
                  }}
                >
                  Need more practice
                </button>
                <button
                  onClick={() => markCatKnown(`q-${catCurrent.number}`, true)}
                  className="flex-1 py-3 rounded-2xl font-black text-sm transition-all active:scale-95"
                  style={{
                    background: `rgba(212,160,32,0.2)`,
                    border: `1px solid ${T.gold}40`,
                    color: T.gold,
                  }}
                >
                  Got it ✓
                </button>
              </div>
            )}
          </div>
        )}
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 4, FAITHFUL WOMEN
      ═══════════════════════════════════════════════════════════════ */}
      <section className="mb-10">
        <SectionTitle
          subtitle="These women walked faithfully before you, learn from them"
          italic
        >
          Women Who Walked Before You
        </SectionTitle>

        <div className="flex flex-col gap-3">
          {REFORMED_WOMEN.map((w) => {
            const open = expandedWoman === w.name;
            return (
              <button
                key={w.name}
                onClick={() => setExpandedWoman(open ? null : w.name)}
                className="rounded-2xl p-4 text-left transition-all shadow-md"
                style={{
                  background: T.bgCard,
                  border: `1px solid ${T.border}`,
                }}
              >
                <div className="flex items-start gap-3">
                  <span className="text-3xl flex-shrink-0">{w.emoji}</span>
                  <div className="flex-1">
                    <p className="font-black text-base" style={{ color: T.text }}>
                      {w.name}
                    </p>
                    <p className="text-xs font-bold" style={{ color: T.textGold }}>
                      {w.years}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: T.textMuted }}>
                      {w.role}
                    </p>
                  </div>
                  <span
                    style={{
                      color: T.textMuted,
                      fontSize: "1.2rem",
                      display: "inline-block",
                      transform: open ? "rotate(180deg)" : "none",
                      transition: "transform 0.2s",
                    }}
                  >
                    ▾
                  </span>
                </div>

                {open && (
                  <div className="mt-4 space-y-3">
                    <p className="text-sm leading-relaxed" style={{ color: T.text }}>
                      {w.story}
                    </p>
                    <blockquote
                      className="text-sm italic p-3 rounded-xl leading-relaxed"
                      style={{
                        color: T.textGold,
                        background: "rgba(212,160,32,0.08)",
                        borderLeft: `2px solid ${T.gold}`,
                      }}
                    >
                      &ldquo;{w.quote}&rdquo;
                    </blockquote>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 5, REFORMERS
      ═══════════════════════════════════════════════════════════════ */}
      <section className="mb-10">
        <SectionTitle subtitle="The giants on whose shoulders we stand">
          Meet the Reformers
        </SectionTitle>

        <div className="flex flex-col gap-2">
          {REFORMED_FIGURES.map((fig) => (
            <div
              key={fig.name}
              className="rounded-2xl px-4 py-3 flex items-center gap-3 shadow-sm"
              style={{
                background: T.bgCard,
                border: `1px solid ${T.border}`,
              }}
            >
              <span className="text-3xl flex-shrink-0">{fig.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="font-black text-sm" style={{ color: T.text }}>
                    {fig.name}
                  </span>
                  <span className="text-xs" style={{ color: T.textMuted }}>
                    {fig.years}
                  </span>
                </div>
                <p className="text-xs font-bold mb-0.5" style={{ color: T.textGold }}>
                  {fig.title}
                </p>
                <p className="text-xs leading-tight" style={{ color: T.textMuted }}>
                  {fig.why}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 6, HYMN CORNER
      ═══════════════════════════════════════════════════════════════ */}
      <section className="mb-10">
        <SectionTitle subtitle="These songs have carried God's people for centuries">
          🎵 Hymns Worth Knowing
        </SectionTitle>

        <div className="flex flex-col gap-3">
          {REFORMED_HYMNS.map((h) => {
            const singing = speakingHymn === h.title;
            return (
              <div
                key={h.title}
                className="rounded-2xl p-4 shadow-md"
                style={{
                  background: T.bgCard,
                  border: `1px solid ${T.border}`,
                }}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-start gap-2">
                    <span className="text-2xl flex-shrink-0">{h.emoji}</span>
                    <div>
                      <p className="font-black text-sm leading-tight" style={{ color: T.text }}>
                        {h.title}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: T.textMuted }}>
                        {h.author} · {h.year}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => speakHymn(h.verse, h.title)}
                    className="flex-shrink-0 px-3 py-1.5 rounded-xl font-bold text-xs transition-all active:scale-95"
                    style={{
                      background: singing ? `${T.teal}25` : `${T.teal}15`,
                      border: `1px solid ${T.teal}40`,
                      color: T.teal,
                    }}
                  >
                    {singing ? "⏹" : "🔊"}
                  </button>
                </div>

                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded-full inline-block mb-2"
                  style={{
                    background: T.primary + "25",
                    color: T.primary,
                    border: `1px solid ${T.primary}35`,
                  }}
                >
                  {h.doctrine}
                </span>

                <blockquote
                  className="text-sm italic leading-relaxed mt-1"
                  style={{ color: T.textMuted }}
                >
                  &ldquo;{h.verse}&rdquo;
                </blockquote>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Recommended Listening ────────────────────────────────────────── */}
      <section className="mb-8">
        <SectionTitle subtitle="Podcasts worth your time">
          📻 Recommended Listening
        </SectionTitle>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Podcast 1 */}
          <div
            style={{
              background: "#fff",
              border: `1.5px solid ${TRUMA_THEME.roseLight}`,
              borderLeft: `4px solid ${TRUMA_THEME.rose}`,
              borderRadius: 14,
              padding: "16px 18px",
              display: "flex",
              alignItems: "flex-start",
              gap: 14,
            }}
          >
            <span style={{ fontSize: 36, lineHeight: 1 }}>🌍</span>
            <div style={{ flex: 1 }}>
              <p style={{ margin: "0 0 2px", fontWeight: 900, fontSize: 15, color: TRUMA_THEME.primary }}>
                The World and Everything in It
              </p>
              <p style={{ margin: "0 0 8px", fontSize: 12, color: TRUMA_THEME.textMuted }}>
                WORLD News Group, Daily Christian news from a Reformed worldview
              </p>
              <a
                href="https://wng.org/podcasts/the-world-and-everything-in-it"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-block",
                  background: `linear-gradient(135deg, ${TRUMA_THEME.rose}, #a83060)`,
                  color: "#fff",
                  borderRadius: 999,
                  padding: "6px 16px",
                  fontSize: 12,
                  fontWeight: 800,
                  textDecoration: "none",
                }}
              >
                Listen →
              </a>
            </div>
          </div>
          {/* Podcast 2 */}
          <div
            style={{
              background: "#fff",
              border: `1.5px solid ${TRUMA_THEME.primaryLight}`,
              borderLeft: `4px solid ${TRUMA_THEME.primary}`,
              borderRadius: 14,
              padding: "16px 18px",
              display: "flex",
              alignItems: "flex-start",
              gap: 14,
            }}
          >
            <span style={{ fontSize: 36, lineHeight: 1 }}>📖</span>
            <div style={{ flex: 1 }}>
              <p style={{ margin: "0 0 2px", fontWeight: 900, fontSize: 15, color: TRUMA_THEME.primary }}>
                Renewing Your Mind
              </p>
              <p style={{ margin: "0 0 8px", fontSize: 12, color: TRUMA_THEME.textMuted }}>
                R.C. Sproul / Ligonier Ministries, Deep Reformed theology, beautifully taught
              </p>
              <a
                href="https://renewingyourmind.org"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-block",
                  background: `linear-gradient(135deg, ${TRUMA_THEME.primary}, ${TRUMA_THEME.primaryDark})`,
                  color: "#fff",
                  borderRadius: 999,
                  padding: "6px 16px",
                  fontSize: 12,
                  fontWeight: 800,
                  textDecoration: "none",
                }}
              >
                Listen →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <p
        className="text-center text-xs italic pb-6 leading-relaxed"
        style={{ color: T.text, opacity: 0.3 }}
      >
        &ldquo;Strength and dignity are her clothing, and she laughs at the time to come.&rdquo;
        <br />, Proverbs 31:25
      </p>

      {/* ── Memorize Modal ───────────────────────────────────────────────── */}
      {activePassage && (
        <MemorizeModal
          passage={activePassage}
          memorized={memorized[activePassage.id] ?? false}
          onToggle={() => toggleMemorized(activePassage.id)}
          onClose={() => setActivePassage(null)}
        />
      )}
    </main>
  );
}
