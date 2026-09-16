"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import WeeklyBibleCard from "@/components/WeeklyBibleCard";
import { getWeeklyCurriculum } from "@/lib/weekly-curriculum";
import type { WeeklyCurriculum } from "@/lib/weekly-curriculum";
import { getCatechismRange } from "@/lib/catechism-boys-girls";
import type { CatechismQuestion } from "@/lib/catechism-boys-girls";
import { useTTS } from "@/lib/tts";

const COLOR = "#D4508A";
const ACCENT = "#C4A020";
const BG = "linear-gradient(160deg, #fff2f8 0%, #fddaed 55%, #fff2f8 100%)";

// Emoji substitutions for verse words (case-insensitive lookup via normalize below)
const WORD_EMOJIS: Record<string, string> = {
  God: "✨",
  sin: "😞",
  sinners: "😞",
  Jesus: "✝️",
  righteous: "🌟",
  obedience: "🙏",
  disobedience: "😔",
  man: "👤",
  many: "👨‍👩‍👧‍👦",
  made: "🌱",
};

// Scenario for character trait
const SCENARIOS: { prompt: string; choices: [string, string]; correct: 0 | 1 }[] = [
  {
    prompt: "Two girls want to be line leader. Which girl is being humble?",
    choices: [
      "🌸 Lily lets her friend go first and smiles",
      "😤 Rosa pushes to the front and says 'Me first!'",
    ],
    correct: 0,
  },
  {
    prompt: "Mercy finishes her work first. Which is the humble thing to do?",
    choices: [
      "🌸 Quietly help a friend who is still working",
      "😤 Tell everyone she finished first",
    ],
    correct: 0,
  },
];

export default function MercyBible() {
  const router = useRouter();
  const { speak, stopAudio } = useTTS("nova");
  const [curriculum, setCurriculum] = useState<WeeklyCurriculum | null>(null);

  // Catechism song
  const [catSinging, setCatSinging] = useState(false);

  // Nearby catechism cards (Q1-33, 3 questions around weekly Q)
  const [nearbyCards, setNearbyCards] = useState<CatechismQuestion[]>([]);
  const [nearbyFlipped, setNearbyFlipped] = useState<Record<number, boolean>>({});

  // Verse garden: revealed words
  const [revealedWords, setRevealedWords] = useState<boolean[]>([]);
  const [celebrated, setCelebrated] = useState(false);

  // Hymn petals: revealed lines
  const [revealedLines, setRevealedLines] = useState<boolean[]>([]);

  // Character scenario
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [scenarioResult, setScenarioResult] = useState<boolean | null>(null);

  useEffect(() => {
    const c = getWeeklyCurriculum();
    setCurriculum(c);
    setRevealedWords(new Array(c.verse.text.split(" ").length).fill(false));
    const lines = c.hymn.verse.split("\n").filter(Boolean);
    setRevealedLines(new Array(lines.length).fill(false));

    // Show 3 questions near the weekly catechism number within Mercy's range Q1-33
    const pool = getCatechismRange(1, 33);
    const weeklyNum = c.catechism.number;
    const sorted = [...pool].sort(
      (a, b) => Math.abs(a.number - weeklyNum) - Math.abs(b.number - weeklyNum)
    );
    // Exclude the weekly question itself (already shown above), take next 3
    setNearbyCards(sorted.filter((q) => q.number !== weeklyNum).slice(0, 3));
  }, []);

  function singCatechism() {
    if (!curriculum) return;
    if (catSinging) {
      stopAudio();
      setCatSinging(false);
      return;
    }
    const text = `Question: ${curriculum.catechism.question} ... Answer: ${curriculum.catechism.answer}`;
    setCatSinging(true);
    speak(text).then(() => setCatSinging(false)).catch(() => setCatSinging(false));
  }

  function revealWord(i: number) {
    setRevealedWords((prev) => {
      const next = [...prev];
      next[i] = true;
      const allDone = next.every(Boolean);
      if (allDone) {
        setCelebrated(true);
        speak("You revealed the whole verse! You're amazing, Mercy! 🌸");
      }
      return next;
    });
  }

  function revealLine(i: number) {
    if (!curriculum) return;
    const line = curriculum.hymn.verse.split("\n").filter(Boolean)[i];
    setRevealedLines((prev) => {
      const next = [...prev];
      next[i] = true;
      return next;
    });
    speak(line);
  }

  function handleScenario(choice: 0 | 1) {
    const correct = choice === SCENARIOS[scenarioIndex].correct;
    setScenarioResult(correct);
    if (correct) {
      speak("Beautiful, Mercy! Princess Rose loves how kind you are! 🌹");
    } else {
      speak("Hmm, let's think about that one again, sweetheart!");
    }
  }

  function nextScenario() {
    setScenarioIndex((i) => (i + 1) % SCENARIOS.length);
    setScenarioResult(null);
  }

  if (!curriculum) return null;

  const verseWords = curriculum.verse.text.split(" ");
  const hymnLines = curriculum.hymn.verse.split("\n").filter(Boolean);

  const cardStyle: React.CSSProperties = {
    background: "#ffffff",
    borderRadius: 22,
    padding: "18px 16px",
    marginBottom: 16,
    boxShadow: "0 2px 12px rgba(212,80,138,0.10)",
    border: `1.5px solid ${COLOR}22`,
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
          background: `linear-gradient(135deg, ${COLOR}, #b03070)`,
          padding: "20px 16px 18px",
          marginBottom: 16,
        }}
      >
        <button
          onClick={() => router.push("/kids/mercy/hub")}
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
          <span style={{ fontSize: 40 }}>🌸</span>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 900, color: "#fff", margin: 0 }}>
              Bible Garden
            </h1>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.85)", margin: 0 }}>
              With Princess Rose 🌹
            </p>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 520, margin: "0 auto", padding: "0 14px" }}>
        {/* Weekly Card */}
        <WeeklyBibleCard
          kidId="mercy"
          color={COLOR}
          accentColor={ACCENT}
          uiSize="large"
        />

        {/* ── Catechism Song ── */}
        <div style={cardStyle}>
          <div style={sectionTitle}>🎶 Catechism Song</div>

          <div
            style={{
              background: `${COLOR}08`,
              borderRadius: 14,
              padding: "14px",
              marginBottom: 14,
            }}
          >
            <p
              style={{
                fontSize: 13,
                fontWeight: 800,
                color: COLOR,
                marginBottom: 6,
              }}
            >
              🌹 Princess Rose says: &ldquo;Can you say it with me?&rdquo;
            </p>
            <p
              style={{
                fontSize: 17,
                fontWeight: 900,
                color: "#222",
                marginBottom: 8,
                lineHeight: 1.45,
              }}
            >
              <span style={{ color: COLOR }}>Q:</span> {curriculum.catechism.question}
            </p>
            <p
              style={{
                fontSize: 17,
                fontWeight: 700,
                color: "#333",
                lineHeight: 1.45,
              }}
            >
              <span style={{ color: ACCENT }}>A:</span> {curriculum.catechism.answer}
            </p>
          </div>

          <button
            onClick={singCatechism}
            style={{
              background: catSinging ? `${COLOR}22` : `${COLOR}12`,
              border: `1.5px solid ${COLOR}40`,
              borderRadius: 999,
              padding: "9px 20px",
              fontSize: 14,
              fontWeight: 800,
              color: COLOR,
              cursor: "pointer",
            }}
          >
            {catSinging ? "⏹ Stop" : "🎵 Hear Princess Rose sing it"}
          </button>
        </div>

        {/* ── Nearby Catechism Cards ── */}
        {nearbyCards.length > 0 && (
          <div style={cardStyle}>
            <div style={sectionTitle}>🌷 More to Learn</div>
            <p style={{ fontSize: 13, color: "#888", marginBottom: 12 }}>
              Tap a card to flip and see the answer! 🌸
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {nearbyCards.map((q) => {
                const flipped = nearbyFlipped[q.number] ?? false;
                return (
                  <div
                    key={q.number}
                    onClick={() =>
                      setNearbyFlipped((prev) => ({ ...prev, [q.number]: !prev[q.number] }))
                    }
                    style={{
                      background: flipped
                        ? `linear-gradient(135deg, ${COLOR}15, ${COLOR}08)`
                        : "#fce7f3",
                      border: `1.5px solid ${flipped ? COLOR + "50" : "#f9a8d4"}`,
                      borderRadius: 14,
                      padding: "14px 16px",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                  >
                    <p style={{ fontSize: 11, fontWeight: 800, color: "#999", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>
                      {flipped ? "Answer 🌸" : `Q${q.number} · Tap to flip`}
                    </p>
                    <p style={{ fontSize: 15, fontWeight: 700, color: flipped ? "#831843" : "#444", lineHeight: 1.5 }}>
                      {flipped ? q.answer : q.question}
                    </p>
                    {flipped && q.reference && (
                      <p style={{ fontSize: 12, color: "#888", marginTop: 4, fontStyle: "italic" }}>{q.reference}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Memory Verse Garden ── */}
        <div style={cardStyle}>
          <div style={sectionTitle}>🌷 Memory Verse Garden</div>
          <p style={{ fontSize: 13, color: "#888", marginBottom: 12 }}>
            Tap each flower to reveal the word! 🌸
          </p>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 7,
              marginBottom: 14,
            }}
          >
            {verseWords.map((word, i) => {
              const emoji = WORD_EMOJIS[word.replace(/[^a-zA-Z]/g, "")] || null;
              const revealed = revealedWords[i];
              return (
                <button
                  key={i}
                  onClick={() => revealWord(i)}
                  style={{
                    background: revealed
                      ? `linear-gradient(135deg, ${COLOR}20, ${COLOR}10)`
                      : "#fce7f3",
                    border: `1.5px solid ${revealed ? COLOR + "50" : "#f9a8d4"}`,
                    borderRadius: 10,
                    padding: "7px 11px",
                    fontSize: revealed ? 14 : 18,
                    fontWeight: 800,
                    color: revealed ? "#831843" : "transparent",
                    cursor: "pointer",
                    minWidth: 36,
                    transition: "all 0.15s",
                    userSelect: "none",
                    position: "relative",
                  }}
                >
                  {revealed ? (
                    <>
                      {emoji && (
                        <span style={{ marginRight: 3, fontSize: 14 }}>{emoji}</span>
                      )}
                      {word}
                    </>
                  ) : (
                    "🌸"
                  )}
                </button>
              );
            })}
          </div>

          <p style={{ fontSize: 14, color: COLOR, fontWeight: 800 }}>
           , {curriculum.verse.reference}
          </p>

          {celebrated && (
            <div
              style={{
                marginTop: 12,
                background: `linear-gradient(135deg, ${COLOR}15, ${ACCENT}10)`,
                border: `1.5px solid ${COLOR}40`,
                borderRadius: 14,
                padding: "12px 14px",
                textAlign: "center",
              }}
            >
              <p style={{ fontWeight: 900, fontSize: 16, color: COLOR }}>
                🌸🌺🌸 You revealed the whole garden! Amazing, Mercy! 🌸🌺🌸
              </p>
            </div>
          )}

          {!celebrated && (
            <button
              onClick={() => speak(curriculum.verse.text)}
              style={{
                marginTop: 10,
                background: `${ACCENT}12`,
                border: `1.5px solid ${ACCENT}40`,
                borderRadius: 999,
                padding: "7px 16px",
                fontSize: 13,
                fontWeight: 800,
                color: ACCENT,
                cursor: "pointer",
              }}
            >
              🔊 Hear the verse
            </button>
          )}
        </div>

        {/* ── Hymn Petals ── */}
        <div style={cardStyle}>
          <div style={sectionTitle}>🌹 Hymn Petals</div>
          <p style={{ fontSize: 16, fontWeight: 900, color: "#333", marginBottom: 4 }}>
            {curriculum.hymn.title}
          </p>
          <p style={{ fontSize: 12, color: "#888", marginBottom: 14 }}>
            {curriculum.hymn.author} · Tap each petal to reveal a line 🌸
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {hymnLines.map((line, i) => (
              <button
                key={i}
                onClick={() => revealLine(i)}
                style={{
                  background: revealedLines[i]
                    ? `linear-gradient(135deg, ${COLOR}18, ${COLOR}08)`
                    : "#fce7f3",
                  border: `1.5px solid ${revealedLines[i] ? COLOR + "50" : "#f9a8d4"}`,
                  borderRadius: 14,
                  padding: "14px 16px",
                  fontSize: 15,
                  fontWeight: 700,
                  color: revealedLines[i] ? "#831843" : "#f472b6",
                  textAlign: "left",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <span style={{ fontSize: 20 }}>🌸</span>
                {revealedLines[i] ? (
                  <span style={{ fontStyle: "italic" }}>{line}</span>
                ) : (
                  <span style={{ opacity: 0.6 }}>Tap to reveal...</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* ── Being Good Like Jesus ── */}
        <div style={cardStyle}>
          <div style={sectionTitle}>💛 Being Good Like Jesus</div>

          <div
            style={{
              background: `${COLOR}10`,
              borderRadius: 14,
              padding: "14px",
              marginBottom: 14,
            }}
          >
            <p style={{ fontSize: 15, fontWeight: 700, color: "#333", lineHeight: 1.55 }}>
              <span style={{ color: COLOR, fontWeight: 900 }}>Mercy</span>, being{" "}
              <span style={{ color: ACCENT, fontWeight: 900 }}>
                {curriculum.character.trait.toLowerCase()}
              </span>{" "}
              means...
            </p>
            <p style={{ fontSize: 16, fontWeight: 700, color: "#444", marginTop: 6, lineHeight: 1.55 }}>
              {curriculum.character.kidFriendly}
            </p>
          </div>

          <p style={{ fontSize: 14, fontWeight: 800, color: "#555", marginBottom: 12 }}>
            Which girl is being {curriculum.character.trait.toLowerCase()}?
          </p>

          {scenarioResult === null && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {SCENARIOS[scenarioIndex].choices.map((choice, i) => (
                <button
                  key={i}
                  onClick={() => handleScenario(i as 0 | 1)}
                  style={{
                    background: "#fff",
                    border: `1.5px solid ${COLOR}30`,
                    borderRadius: 16,
                    padding: "14px 16px",
                    fontSize: 15,
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
                background: scenarioResult ? `${COLOR}10` : "rgba(239,68,68,0.06)",
                border: `1.5px solid ${scenarioResult ? COLOR : "#fca5a5"}40`,
                borderRadius: 14,
                padding: "14px",
                textAlign: "center",
              }}
            >
              <p
                style={{
                  fontWeight: 900,
                  fontSize: 16,
                  color: scenarioResult ? COLOR : "#dc2626",
                }}
              >
                {scenarioResult
                  ? "🌹 Yes! Princess Rose loves your kind heart!"
                  : "Let's think again together 🌸"}
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
                Next 🌹
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Story Time Radio ───────────────────────────────────────────── */}
      <div
        style={{
          margin: "0 0 24px",
          background: "linear-gradient(135deg, #fff0f7 0%, #ffe4f1 100%)",
          border: "2px solid #f9a8d4",
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
              Story Time 📻
            </p>
            <p style={{ margin: 0, fontSize: 12, color: "#9d174d", opacity: 0.75 }}>
              Listen to Christian stories!
            </p>
          </div>
        </div>
        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            padding: "12px 14px",
            border: "1.5px solid #f9a8d4",
          }}
        >
          <p style={{ margin: "0 0 2px", fontWeight: 800, fontSize: 15, color: COLOR }}>
            🎙️ The World and Everything in It
          </p>
          <p style={{ margin: "0 0 10px", fontSize: 13, color: "#374151" }}>
            A fun daily news show from a Christian heart, listen with Mom or Dad!
          </p>
          <a
            href="https://wng.org/podcasts/the-world-and-everything-in-it"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              background: `linear-gradient(135deg, ${COLOR}, #b03070)`,
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

      {/* Floating Ask Blossom button */}
      <button
        onClick={() => router.push("/kids/mercy/hub")}
        style={{
          position: "fixed",
          bottom: 24,
          right: 20,
          background: `linear-gradient(135deg, ${COLOR}, #b03070)`,
          color: "#fff",
          border: "none",
          borderRadius: 999,
          padding: "14px 20px",
          fontSize: 15,
          fontWeight: 900,
          cursor: "pointer",
          boxShadow: "0 4px 18px rgba(212,80,138,0.35)",
          display: "flex",
          alignItems: "center",
          gap: 8,
          zIndex: 50,
        }}
      >
        Ask Princess Rose 🌹
      </button>
    </div>
  );
}
