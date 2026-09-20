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

const WORD_EMOJIS: Record<string, string> = {
  God: "\u2728",
  sin: "\ud83d\ude1e",
  sinners: "\ud83d\ude1e",
  Jesus: "\u271d\ufe0f",
  righteous: "\ud83c\udf1f",
  obedience: "\ud83d\ude4f",
  disobedience: "\ud83d\ude14",
  man: "\ud83d\udc64",
  many: "\ud83d\udc68\u200d\ud83d\udc69\u200d\ud83d\udc67\u200d\ud83d\udc66",
  made: "\ud83c\udf31",
};

const SCENARIOS: { prompt: string; choices: [string, string]; correct: 0 | 1 }[] = [
  {
    prompt: "Two girls want to be line leader. Which girl is being humble?",
    choices: [
      "\ud83c\udf38 Lily lets her friend go first and smiles",
      "\ud83d\ude24 Rosa pushes to the front and says 'Me first!'",
    ],
    correct: 0,
  },
  {
    prompt: "Mercy finishes her work first. Which is the humble thing to do?",
    choices: [
      "\ud83c\udf38 Quietly help a friend who is still working",
      "\ud83d\ude24 Tell everyone she finished first",
    ],
    correct: 0,
  },
];

export default function MercyBible() {
  const router = useRouter();
  const { speak, stopAudio } = useTTS("nova");
  const [curriculum, setCurriculum] = useState<WeeklyCurriculum | null>(null);
  const [catSinging, setCatSinging] = useState(false);
  const [nearbyCards, setNearbyCards] = useState<CatechismQuestion[]>([]);
  const [nearbyFlipped, setNearbyFlipped] = useState<Record<number, boolean>>({});
  const [revealedWords, setRevealedWords] = useState<boolean[]>([]);
  const [celebrated, setCelebrated] = useState(false);
  const [revealedLines, setRevealedLines] = useState<boolean[]>([]);
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [scenarioResult, setScenarioResult] = useState<boolean | null>(null);

  useEffect(() => {
    const c = getWeeklyCurriculum();
    setCurriculum(c);
    setRevealedWords(new Array(c.verse.text.split(" ").length).fill(false));
    const lines = c.hymn.verse.split("\n").filter(Boolean);
    setRevealedLines(new Array(lines.length).fill(false));
    const pool = getCatechismRange(1, 33);
    const weeklyNum = c.catechism.number;
    const sorted = [...pool].sort(
      (a, b) => Math.abs(a.number - weeklyNum) - Math.abs(b.number - weeklyNum)
    );
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
    speak(text);
    window.setTimeout(() => setCatSinging(false), Math.min(20000, 4000 + text.length * 60));
  }

  function revealWord(i: number) {
    setRevealedWords((prev) => {
      const next = [...prev];
      next[i] = true;
      if (next.every(Boolean)) {
        setCelebrated(true);
        speak("You revealed the whole verse! You're amazing, Mercy!");
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
    speak(correct
      ? "Beautiful, Mercy! Princess Rose loves how kind you are!"
      : "Hmm, let's think about that one again, sweetheart!");
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
    <div style={{ minHeight: "100vh", background: BG, padding: "0 0 80px 0" }}>
      <div style={{ background: `linear-gradient(135deg, ${COLOR}, #b03070)`, padding: "20px 16px 18px", marginBottom: 16 }}>
        <button onClick={() => router.push("/kids/mercy/hub")} style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "#fff", borderRadius: 999, padding: "5px 12px", fontSize: 13, fontWeight: 700, cursor: "pointer", marginBottom: 10 }}>
          \u2190 Back
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 40 }}>\ud83c\udf38</span>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 900, color: "#fff", margin: 0 }}>Bible Garden</h1>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.85)", margin: 0 }}>With Princess Rose \ud83c\udf39</p>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 520, margin: "0 auto", padding: "0 14px" }}>
        <WeeklyBibleCard kidId="mercy" color={COLOR} accentColor={ACCENT} uiSize="large" />
        <div style={cardStyle}>
          <div style={sectionTitle}>\ud83c\udfb6 Catechism Song</div>
          <button onClick={singCatechism} style={{ background: catSinging ? `${COLOR}22` : `${COLOR}12`, border: `1.5px solid ${COLOR}40`, borderRadius: 999, padding: "9px 20px", fontSize: 14, fontWeight: 800, color: COLOR, cursor: "pointer" }}>
            {catSinging ? "Stop" : "Hear Princess Rose sing it"}
          </button>
        </div>
      </div>
    </div>
  );
}
