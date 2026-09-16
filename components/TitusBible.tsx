"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import WeeklyBibleCard from "@/components/WeeklyBibleCard";
import { getWeeklyCurriculum } from "@/lib/weekly-curriculum";
import type { WeeklyCurriculum } from "@/lib/weekly-curriculum";
import { getCatechismRange } from "@/lib/catechism-boys-girls";
import type { CatechismQuestion } from "@/lib/catechism-boys-girls";
import { useTTS } from "@/lib/tts";

const COLOR = "#2563eb";
const ACCENT = "#4E9A28";
const BG = "linear-gradient(180deg, #e8f4ff 0%, #d6eaff 55%, #e8f4ff 100%)";

// Outdoor facts tied to doctrines/hymn themes
const OUTDOOR_FACTS = [
  "🎣 Just like a wise fisherman knows every bend in the river, God knows every part of His creation, and this hymn praises His amazing grace!",
  "🦌 A buck knows exactly when to move through the woods, God designed every creature with purpose, and shows His strength through all He made!",
  "🏕️ A hunter stays steady through cold nights and long trails, just like God's grace carries us through everything life brings!",
];

// Character trait scenarios
const SCENARIOS: { prompt: string; choices: [string, string]; correct: 0 | 1 }[] = [
  {
    prompt: "Your friend gets a bigger slice of cake. What does a humble person do?",
    choices: ["Say 'That's not fair! I want more!'", "Say 'That's okay, God gives me what I need!'"],
    correct: 1,
  },
  {
    prompt: "You get a really hard math problem right. What does a humble person say?",
    choices: ["'I'm the smartest in the class!'", "'Thank you God for helping me think!'"],
    correct: 1,
  },
  {
    prompt: "Your little sister wants to play your game. What does a humble person do?",
    choices: ["Let her play and help her learn", "Say 'No, you're too little!'"],
    correct: 0,
  },
];

export default function TitusBible() {
  const router = useRouter();
  const { speak, stopAudio } = useTTS("onyx");
  const [curriculum, setCurriculum] = useState<WeeklyCurriculum | null>(null);

  // Flip card state (weekly question)
  const [cardFlipped, setCardFlipped] = useState(false);
  const [flipCount, setFlipCount] = useState(0);
  const [flipResult, setFlipResult] = useState<"got-it" | "missed" | null>(null);

  // Practice drill, 5 random Q&A from Titus's range Q1-67
  const [drillCards, setDrillCards] = useState<CatechismQuestion[]>([]);
  const [drillIndex, setDrillIndex] = useState(0);
  const [drillFlipped, setDrillFlipped] = useState(false);
  const [drillKnown, setDrillKnown] = useState<Record<number, boolean>>({});

  // Verse explorer: word-by-word reveal
  const [revealedWords, setRevealedWords] = useState<boolean[]>([]);

  // Hymn
  const [hymnSinging, setHymnSinging] = useState(false);

  // Character scenarios
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [scenarioResult, setScenarioResult] = useState<boolean | null>(null);
  const [scenarioCelebrated, setScenarioCelebrated] = useState(false);

  useEffect(() => {
    const c = getWeeklyCurriculum();
    setCurriculum(c);
    setRevealedWords(new Array(c.verse.text.split(" ").length).fill(false));

    // Pick 5 random questions from Titus's range Q1-67
    const pool = getCatechismRange(1, 67);
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    setDrillCards(shuffled.slice(0, 5));
  }, []);

  function handleFlip() {
    setCardFlipped((f) => !f);
    if (!cardFlipped) setFlipCount((n) => n + 1);
  }

  function handleFlipResult(result: "got-it" | "missed") {
    setFlipResult(result);
    setCardFlipped(false);
    speak(
      result === "got-it"
        ? "Great job, Titus! Buck is proud of you! 🎣"
        : "That's okay, Buck will help you try again!"
    );
  }

  function revealWord(i: number) {
    setRevealedWords((prev) => {
      const next = [...prev];
      next[i] = true;
      return next;
    });
  }

  function revealAll() {
    if (!curriculum) return;
    setRevealedWords(new Array(curriculum.verse.text.split(" ").length).fill(true));
  }

  function singHymn() {
    if (!curriculum) return;
    if (hymnSinging) {
      stopAudio();
      setHymnSinging(false);
      return;
    }
    setHymnSinging(true);
    speak(curriculum.hymn.verse).then(() => setHymnSinging(false)).catch(() => setHymnSinging(false));
  }

  function handleScenarioChoice(index: 0 | 1) {
    const scenario = SCENARIOS[scenarioIndex];
    const correct = index === scenario.correct;
    setScenarioResult(correct);
    if (correct) {
      setScenarioCelebrated(true);
      speak("Yes! That's what a humble explorer does! Buck says HOO-RAH! 🎣");
    } else {
      speak("Hmm, try thinking about what God would want. You've got this!");
    }
  }

  function nextScenario() {
    setScenarioIndex((i) => (i + 1) % SCENARIOS.length);
    setScenarioResult(null);
    setScenarioCelebrated(false);
  }

  if (!curriculum) return null;

  const verseWords = curriculum.verse.text.split(" ");
  const allRevealed = revealedWords.every(Boolean);
  const scenario = SCENARIOS[scenarioIndex];

  const cardStyle: React.CSSProperties = {
    background: "#ffffff",
    borderRadius: 20,
    padding: "18px 16px",
    marginBottom: 16,
    boxShadow: "0 2px 12px rgba(37,99,235,0.08)",
    border: `1.5px solid ${COLOR}20`,
  };

  const sectionTitle: React.CSSProperties = {
    fontSize: 18,
    fontWeight: 900,
    color: COLOR,
    marginBottom: 10,
    display: "flex",
    alignItems: "center",
    gap: 6,
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
          background: `linear-gradient(135deg, ${COLOR}, #1d4ed8)`,
          padding: "20px 16px 18px",
          marginBottom: 16,
        }}
      >
        <button
          onClick={() => router.push("/kids/titus/hub")}
          style={{
            background: "rgba(255,255,255,0.2)",
            border: "none",
            color: "#fff",
            borderRadius: 999,
            padding: "5px 12px",
            fontSize: 13,
            fontWeight: 700,
            cursor: "pointer",
            marginBottom: 10,
          }}
        >
          ← Back
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 40 }}>🎣</span>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 900, color: "#fff", margin: 0 }}>
              Bible Quest
            </h1>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.8)", margin: 0 }}>
              Explorer Edition · Reformed Baptist
            </p>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 520, margin: "0 auto", padding: "0 14px" }}>
        {/* Weekly Card */}
        <WeeklyBibleCard
          kidId="titus"
          color={COLOR}
          accentColor={ACCENT}
          uiSize="normal"
        />

        {/* ── Catechism Flip Card ── */}
        <div style={cardStyle}>
          <div style={sectionTitle}>🙋 Catechism Challenge</div>
          <p style={{ fontSize: 13, color: "#666", marginBottom: 12 }}>
            Flips: {flipCount} {flipCount > 0 && "🎣"}
          </p>

          {/* Flip card */}
          <div
            onClick={handleFlip}
            style={{
              background: cardFlipped
                ? `linear-gradient(135deg, ${COLOR}15, ${COLOR}08)`
                : "#f0f7ff",
              border: `2px solid ${cardFlipped ? COLOR : COLOR + "40"}`,
              borderRadius: 16,
              padding: "20px 16px",
              minHeight: 120,
              cursor: "pointer",
              marginBottom: 12,
              transition: "all 0.2s",
            }}
          >
            <p
              style={{
                fontSize: 11,
                fontWeight: 800,
                color: "#999",
                textTransform: "uppercase",
                letterSpacing: 1,
                marginBottom: 8,
              }}
            >
              {cardFlipped ? "Answer, did you get it?" : `Q${curriculum.catechism.number} · Tap to flip 🎣`}
            </p>
            <p style={{ fontSize: 16, fontWeight: 700, color: "#222", lineHeight: 1.5 }}>
              {cardFlipped
                ? curriculum.catechism.answer
                : curriculum.catechism.question}
            </p>
            {cardFlipped && (
              <p style={{ fontSize: 12, color: "#888", marginTop: 6, fontStyle: "italic" }}>
                {curriculum.catechism.reference}
              </p>
            )}
          </div>

          {cardFlipped && !flipResult && (
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => handleFlipResult("missed")}
                style={{
                  flex: 1,
                  padding: "12px",
                  borderRadius: 12,
                  border: "1.5px solid #fca5a5",
                  background: "rgba(239,68,68,0.08)",
                  color: "#dc2626",
                  fontWeight: 800,
                  fontSize: 14,
                  cursor: "pointer",
                }}
              >
                Need more practice 🔄
              </button>
              <button
                onClick={() => handleFlipResult("got-it")}
                style={{
                  flex: 1,
                  padding: "12px",
                  borderRadius: 12,
                  border: `1.5px solid ${ACCENT}60`,
                  background: `rgba(78,154,40,0.12)`,
                  color: ACCENT,
                  fontWeight: 900,
                  fontSize: 14,
                  cursor: "pointer",
                }}
              >
                Got it! ✓ 🎣
              </button>
            </div>
          )}

          {flipResult === "got-it" && (
            <div
              style={{
                background: `rgba(78,154,40,0.12)`,
                border: `1.5px solid ${ACCENT}40`,
                borderRadius: 12,
                padding: "12px 14px",
                textAlign: "center",
              }}
            >
              <p style={{ fontWeight: 900, color: ACCENT, fontSize: 16 }}>
                🎣 Buck cheers for you!
              </p>
              <button
                onClick={() => { setFlipResult(null); setCardFlipped(false); }}
                style={{
                  marginTop: 8,
                  background: COLOR,
                  color: "#fff",
                  border: "none",
                  borderRadius: 999,
                  padding: "6px 16px",
                  fontWeight: 800,
                  cursor: "pointer",
                  fontSize: 13,
                }}
              >
                Try again
              </button>
            </div>
          )}

          {flipResult === "missed" && (
            <div
              style={{
                background: "rgba(239,68,68,0.06)",
                border: "1.5px solid #fca5a540",
                borderRadius: 12,
                padding: "12px 14px",
                textAlign: "center",
              }}
            >
              <p style={{ fontWeight: 700, color: "#666", fontSize: 14 }}>
                Keep practicing! Buck believes in you! 🎣
              </p>
              <button
                onClick={() => { setFlipResult(null); setCardFlipped(false); }}
                style={{
                  marginTop: 8,
                  background: COLOR,
                  color: "#fff",
                  border: "none",
                  borderRadius: 999,
                  padding: "6px 16px",
                  fontWeight: 800,
                  cursor: "pointer",
                  fontSize: 13,
                }}
              >
                Try again
              </button>
            </div>
          )}
        </div>

        {/* ── Catechism Practice Drill (Q1–67 random 5) ── */}
        {drillCards.length > 0 && (() => {
          const dc = drillCards[drillIndex];
          const drillKnownCount = Object.values(drillKnown).filter(Boolean).length;
          return (
            <div style={cardStyle}>
              <div style={sectionTitle}>📚 Catechism Practice</div>
              <p style={{ fontSize: 12, color: "#888", marginBottom: 10 }}>
                Q1–67 · {drillKnownCount}/{drillCards.length} mastered 🎣
              </p>

              {/* Progress dots */}
              <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
                {drillCards.map((q, i) => (
                  <div
                    key={q.number}
                    style={{
                      width: 10, height: 10, borderRadius: "50%",
                      background: drillKnown[q.number]
                        ? ACCENT
                        : i === drillIndex
                        ? COLOR
                        : "#e5e7eb",
                      border: i === drillIndex ? `2px solid ${COLOR}` : "none",
                      transition: "background 0.2s",
                    }}
                  />
                ))}
              </div>

              {/* Flip card */}
              <div
                onClick={() => setDrillFlipped((f) => !f)}
                style={{
                  background: drillFlipped ? `${COLOR}12` : "#f0f7ff",
                  border: `2px solid ${drillFlipped ? COLOR : COLOR + "40"}`,
                  borderRadius: 16,
                  padding: "18px 16px",
                  minHeight: 110,
                  cursor: "pointer",
                  marginBottom: 12,
                  transition: "all 0.2s",
                }}
              >
                <p style={{ fontSize: 11, fontWeight: 800, color: "#999", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>
                  {drillFlipped ? "Answer" : `Q${dc.number} · Tap to flip 🎣`}
                </p>
                <p style={{ fontSize: 15, fontWeight: 700, color: "#222", lineHeight: 1.5 }}>
                  {drillFlipped ? dc.answer : dc.question}
                </p>
                {drillFlipped && dc.reference && (
                  <p style={{ fontSize: 12, color: "#888", marginTop: 6, fontStyle: "italic" }}>{dc.reference}</p>
                )}
              </div>

              {drillFlipped && (
                <div style={{ display: "flex", gap: 10 }}>
                  <button
                    onClick={() => {
                      setDrillKnown((prev) => ({ ...prev, [dc.number]: false }));
                      setDrillIndex((i) => Math.min(i + 1, drillCards.length - 1));
                      setDrillFlipped(false);
                    }}
                    style={{
                      flex: 1, padding: "11px", borderRadius: 12,
                      border: "1.5px solid #fca5a5",
                      background: "rgba(239,68,68,0.08)",
                      color: "#dc2626", fontWeight: 800, fontSize: 13, cursor: "pointer",
                    }}
                  >
                    Need practice 🔄
                  </button>
                  <button
                    onClick={() => {
                      setDrillKnown((prev) => ({ ...prev, [dc.number]: true }));
                      setDrillIndex((i) => Math.min(i + 1, drillCards.length - 1));
                      setDrillFlipped(false);
                      speak("Got it! Buck cheers! 🎣");
                    }}
                    style={{
                      flex: 1, padding: "11px", borderRadius: 12,
                      border: `1.5px solid ${ACCENT}60`,
                      background: `rgba(78,154,40,0.12)`,
                      color: ACCENT, fontWeight: 900, fontSize: 13, cursor: "pointer",
                    }}
                  >
                    Got it! ✓ 🎣
                  </button>
                </div>
              )}

              {drillIndex === drillCards.length - 1 && Object.keys(drillKnown).length === drillCards.length && (
                <button
                  onClick={() => {
                    const pool = getCatechismRange(1, 67);
                    const shuffled = [...pool].sort(() => Math.random() - 0.5);
                    setDrillCards(shuffled.slice(0, 5));
                    setDrillIndex(0);
                    setDrillFlipped(false);
                    setDrillKnown({});
                  }}
                  style={{
                    marginTop: 10, width: "100%",
                    background: COLOR, color: "#fff", border: "none",
                    borderRadius: 999, padding: "10px 20px",
                    fontWeight: 900, cursor: "pointer", fontSize: 14,
                  }}
                >
                  New round! 🎣
                </button>
              )}
            </div>
          );
        })()}

        {/* ── Verse Explorer ── */}
        <div style={cardStyle}>
          <div style={sectionTitle}>🗺️ Verse Explorer</div>
          <p style={{ fontSize: 13, color: "#666", marginBottom: 12 }}>
            Tap each word to reveal, build the verse piece by piece!
          </p>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 6,
              marginBottom: 14,
            }}
          >
            {verseWords.map((word, i) => (
              <button
                key={i}
                onClick={() => revealWord(i)}
                style={{
                  background: revealedWords[i] ? `${COLOR}18` : "#e5e7eb",
                  color: revealedWords[i] ? "#1e3a8a" : "transparent",
                  border: `1.5px solid ${revealedWords[i] ? COLOR + "50" : "#d1d5db"}`,
                  borderRadius: 8,
                  padding: "6px 10px",
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: "pointer",
                  minWidth: 36,
                  transition: "all 0.15s",
                  userSelect: "none",
                }}
              >
                {revealedWords[i] ? word : "···"}
              </button>
            ))}
          </div>

          <p style={{ fontSize: 13, color: COLOR, fontWeight: 800, marginBottom: 10 }}>
           , {curriculum.verse.reference}
          </p>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button
              onClick={revealAll}
              style={{
                background: "#f0f7ff",
                border: `1.5px solid ${COLOR}40`,
                borderRadius: 999,
                padding: "7px 14px",
                fontSize: 13,
                fontWeight: 800,
                color: COLOR,
                cursor: "pointer",
              }}
            >
              Reveal All
            </button>
            <button
              onClick={() => speak(curriculum.verse.text + ". " + curriculum.verse.reference)}
              style={{
                background: `${ACCENT}15`,
                border: `1.5px solid ${ACCENT}40`,
                borderRadius: 999,
                padding: "7px 14px",
                fontSize: 13,
                fontWeight: 800,
                color: ACCENT,
                cursor: "pointer",
              }}
            >
              🔊 Buck reads it
            </button>
            <button
              onClick={() => setRevealedWords(new Array(verseWords.length).fill(false))}
              style={{
                background: "#f5f5f5",
                border: "1.5px solid #e5e7eb",
                borderRadius: 999,
                padding: "7px 14px",
                fontSize: 13,
                fontWeight: 700,
                color: "#666",
                cursor: "pointer",
              }}
            >
              Reset
            </button>
          </div>

          {allRevealed && (
            <div
              style={{
                marginTop: 12,
                background: `${ACCENT}12`,
                border: `1.5px solid ${ACCENT}40`,
                borderRadius: 12,
                padding: "10px 14px",
                textAlign: "center",
              }}
            >
              <p style={{ fontWeight: 900, color: ACCENT, fontSize: 15 }}>
                🎣 Explorer Titus conquered the verse! HOO-RAH!
              </p>
            </div>
          )}
        </div>

        {/* ── Hymn Corner ── */}
        <div style={cardStyle}>
          <div style={sectionTitle}>🎵 Hymn Corner</div>
          <p style={{ fontSize: 18, fontWeight: 900, color: "#222", marginBottom: 4 }}>
            {curriculum.hymn.title}
          </p>
          <p style={{ fontSize: 12, color: "#888", marginBottom: 12 }}>
            {curriculum.hymn.author}
            {curriculum.hymn.year ? ` · ${curriculum.hymn.year}` : ""}
            {curriculum.hymn.doctrine ? ` · ${curriculum.hymn.doctrine}` : ""}
          </p>
          <p
            style={{
              fontSize: 15,
              lineHeight: 1.7,
              color: "#444",
              fontStyle: "italic",
              whiteSpace: "pre-line",
              background: "#f8f8f8",
              borderRadius: 12,
              padding: "12px 14px",
              marginBottom: 14,
            }}
          >
            &ldquo;{curriculum.hymn.verse}&rdquo;
          </p>

          <button
            onClick={singHymn}
            style={{
              background: hymnSinging ? `${COLOR}20` : `${COLOR}12`,
              border: `1.5px solid ${COLOR}40`,
              borderRadius: 999,
              padding: "8px 18px",
              fontSize: 14,
              fontWeight: 800,
              color: COLOR,
              cursor: "pointer",
              marginBottom: 14,
            }}
          >
            {hymnSinging ? "⏹ Stop" : "🎵 Sing along with Buck"}
          </button>

          <div
            style={{
              background: "#fffbeb",
              border: "1.5px solid #fbbf2440",
              borderRadius: 12,
              padding: "10px 14px",
            }}
          >
            <p style={{ fontSize: 13, fontWeight: 800, color: "#92400e", marginBottom: 4 }}>
              🎣 Outdoor Doctrine Fact:
            </p>
            <p style={{ fontSize: 13, color: "#78350f", lineHeight: 1.5 }}>
              {OUTDOOR_FACTS[0]}
            </p>
          </div>
        </div>

        {/* ── Character Adventure ── */}
        <div style={cardStyle}>
          <div style={sectionTitle}>⚔️ Character Adventure</div>
          <div
            style={{
              background: `${COLOR}10`,
              borderRadius: 14,
              padding: "12px 14px",
              marginBottom: 14,
            }}
          >
            <p style={{ fontSize: 13, fontWeight: 800, color: "#666", marginBottom: 4 }}>
              🎣 Buck says:
            </p>
            <p style={{ fontSize: 18, fontWeight: 900, color: COLOR, marginBottom: 4 }}>
              {curriculum.character.trait}
            </p>
            <p style={{ fontSize: 14, color: "#444", lineHeight: 1.5 }}>
              {curriculum.character.kidFriendly}
            </p>
          </div>

          <p style={{ fontSize: 14, fontWeight: 800, color: "#333", marginBottom: 10 }}>
            Quest {scenarioIndex + 1}/3: What would a{" "}
            {curriculum.character.trait.toLowerCase()} explorer do?
          </p>

          <div
            style={{
              background: "#f8faff",
              border: `1.5px solid ${COLOR}25`,
              borderRadius: 14,
              padding: "14px",
              marginBottom: 12,
            }}
          >
            <p style={{ fontSize: 15, fontWeight: 700, color: "#222", lineHeight: 1.5 }}>
              {scenario.prompt}
            </p>
          </div>

          {scenarioResult === null && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {scenario.choices.map((choice, i) => (
                <button
                  key={i}
                  onClick={() => handleScenarioChoice(i as 0 | 1)}
                  style={{
                    background: "#fff",
                    border: `1.5px solid ${COLOR}30`,
                    borderRadius: 12,
                    padding: "12px 14px",
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#333",
                    textAlign: "left",
                    cursor: "pointer",
                  }}
                >
                  {choice}
                </button>
              ))}
            </div>
          )}

          {scenarioResult !== null && (
            <div
              style={{
                background: scenarioResult ? `${ACCENT}12` : "rgba(239,68,68,0.06)",
                border: `1.5px solid ${scenarioResult ? ACCENT : "#fca5a5"}40`,
                borderRadius: 12,
                padding: "12px 14px",
                textAlign: "center",
              }}
            >
              <p
                style={{
                  fontWeight: 900,
                  fontSize: 16,
                  color: scenarioResult ? ACCENT : "#dc2626",
                }}
              >
                {scenarioResult
                  ? "🎣 Explorer Titus chose wisely! HOO-RAH!"
                  : "Hmm, think about what God would want! 🎣"}
              </p>
              <button
                onClick={nextScenario}
                style={{
                  marginTop: 10,
                  background: COLOR,
                  color: "#fff",
                  border: "none",
                  borderRadius: 999,
                  padding: "8px 20px",
                  fontWeight: 800,
                  cursor: "pointer",
                  fontSize: 13,
                }}
              >
                Next Quest 🗺️
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Explorer Radio ─────────────────────────────────────────────── */}
      <div
        style={{
          margin: "0 0 24px",
          background: "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)",
          border: "2px solid #93c5fd",
          borderRadius: 16,
          padding: "20px 22px",
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 28 }}>📻</span>
          <div>
            <p style={{ margin: 0, fontWeight: 900, fontSize: 17, color: COLOR }}>
              Explorer Radio
            </p>
            <p style={{ margin: 0, fontSize: 12, color: "#1e40af", opacity: 0.7 }}>
              Listen &amp; Learn
            </p>
          </div>
        </div>
        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            padding: "12px 14px",
            border: "1.5px solid #bfdbfe",
          }}
        >
          <p style={{ margin: "0 0 2px", fontWeight: 800, fontSize: 15, color: COLOR }}>
            🎙️ The World and Everything in It
          </p>
          <p style={{ margin: "0 0 10px", fontSize: 13, color: "#374151" }}>
            News from a Christian worldview, perfect for curious minds!
          </p>
          <a
            href="https://wng.org/podcasts/the-world-and-everything-in-it"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              background: `linear-gradient(135deg, ${COLOR}, #1d4ed8)`,
              color: "#fff",
              borderRadius: 999,
              padding: "8px 18px",
              fontSize: 13,
              fontWeight: 800,
              textDecoration: "none",
            }}
          >
            Listen Now →
          </a>
        </div>
      </div>

      {/* Floating Ask Rex button */}
      <button
        onClick={() => router.push("/kids/titus/hub")}
        style={{
          position: "fixed",
          bottom: 24,
          right: 20,
          background: `linear-gradient(135deg, ${COLOR}, #1d4ed8)`,
          color: "#fff",
          border: "none",
          borderRadius: 999,
          padding: "14px 20px",
          fontSize: 15,
          fontWeight: 900,
          cursor: "pointer",
          boxShadow: "0 4px 18px rgba(37,99,235,0.35)",
          display: "flex",
          alignItems: "center",
          gap: 8,
          zIndex: 50,
        }}
      >
        Ask Buck 🎣
      </button>
    </div>
  );
}
