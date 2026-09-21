"use client";

import { useEffect, useState } from "react";
import {
  getWeeklyCurriculum,
  getBibleProgress,
  updateBibleProgress,
} from "@/lib/weekly-curriculum";
import type { WeeklyCurriculum, BibleProgress } from "@/lib/weekly-curriculum";
import { useTTS, OPENAI_VOICE } from "@/lib/tts";

interface WeeklyBibleCardProps {
  kidId: string;
  color: string;
  accentColor: string;
  uiSize?: "normal" | "large" | "xlarge";
}

export default function WeeklyBibleCard({
  kidId,
  color,
  accentColor,
  uiSize = "normal",
}: WeeklyBibleCardProps) {
  const [curriculum, setCurriculum] = useState<WeeklyCurriculum | null>(null);
  const [progress, setProgress] = useState<BibleProgress>({
    catechismMemorized: false,
    verseMemorized: false,
    hymnLearned: false,
    lastPracticed: null,
  });
  const { speak } = useTTS(OPENAI_VOICE[kidId] ?? "nova");

  useEffect(() => {
    setCurriculum(getWeeklyCurriculum());
    setProgress(getBibleProgress(kidId));
  }, [kidId]);

  useEffect(() => {
    if (uiSize === "xlarge" && curriculum) {
      const text = `${curriculum.character.toddlerFriendly} ${curriculum.verse.text}`;
      setTimeout(() => speak(text), 800);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [curriculum, uiSize]);

  function markCatechism() {
    updateBibleProgress(kidId, { catechismMemorized: true });
    setProgress((p) => ({ ...p, catechismMemorized: true }));
  }
  function markVerse() {
    updateBibleProgress(kidId, { verseMemorized: true });
    setProgress((p) => ({ ...p, verseMemorized: true }));
  }
  function markHymn() {
    updateBibleProgress(kidId, { hymnLearned: true });
    setProgress((p) => ({ ...p, hymnLearned: true }));
  }

  if (!curriculum) return null;

  const isXL = uiSize === "xlarge";
  const isLarge = uiSize === "large" || uiSize === "xlarge";

  const cardStyle: React.CSSProperties = {
    background: "#fffdf9",
    borderRadius: 20,
    padding: isLarge ? "20px 18px" : "16px 14px",
    marginBottom: 12,
    boxShadow: "0 2px 10px rgba(0,0,0,0.07)",
    border: `1.5px solid ${color}25`,
  };

  const sectionHeaderStyle: React.CSSProperties = {
    fontSize: isLarge ? 18 : 15,
    fontWeight: 900,
    color: color,
    marginBottom: 6,
    display: "flex",
    alignItems: "center",
    gap: 6,
  };

  const bodyTextStyle: React.CSSProperties = {
    fontSize: isLarge ? 17 : 14,
    color: "var(--text)",
    lineHeight: 1.55,
  };

  const bigBodyTextStyle: React.CSSProperties = {
    fontSize: isXL ? 28 : isLarge ? 20 : 15,
    color: "var(--text)",
    lineHeight: 1.5,
    fontWeight: 700,
  };

  const memBtn = (done: boolean, onMark: () => void) =>
    done ? (
      <span style={{ display: "inline-block", background: "#22c55e", color: "#fff", borderRadius: 999, fontSize: 13, fontWeight: 900, padding: "4px 12px", marginTop: 8 }}>
        Got it!
      </span>
    ) : (
      <button onClick={onMark} style={{ display: "inline-block", background: `${color}18`, color: color, border: `1.5px solid ${color}40`, borderRadius: 999, fontSize: 13, fontWeight: 800, padding: "5px 14px", marginTop: 8, cursor: "pointer" }}>
        I memorized it
      </button>
    );

  const speakBtn = (text: string) => (
    <button onClick={() => speak(text)} style={{ background: `${accentColor}15`, border: `1px solid ${accentColor}40`, borderRadius: 999, fontSize: 13, padding: "4px 10px", cursor: "pointer", color: accentColor, fontWeight: 700, marginLeft: 6 }} title="Read aloud">
      Hear
    </button>
  );

  return (
    <div style={{ background: "#fff8f2", borderRadius: 24, padding: isLarge ? "20px 16px" : "16px 14px", marginBottom: 20, boxShadow: "0 3px 14px rgba(0,0,0,0.09)", border: `2px solid ${color}30` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        <span style={{ background: `linear-gradient(135deg, ${color}, ${accentColor})`, color: "#fff", borderRadius: 12, padding: "4px 12px", fontWeight: 900, fontSize: isLarge ? 15 : 13 }}>
          {curriculum.weekLabel}
        </span>
      </div>

      {isXL ? (
        <>
          <div style={cardStyle}>
            <div style={sectionHeaderStyle}>This week's big truth {speakBtn(curriculum.character.toddlerFriendly)}</div>
            <p style={bigBodyTextStyle}>{curriculum.character.toddlerFriendly}</p>
          </div>
          <div style={cardStyle}>
            <div style={sectionHeaderStyle}>Bible verse {speakBtn(curriculum.verse.text + ". " + curriculum.verse.reference)}</div>
            <p style={bigBodyTextStyle}>{curriculum.verse.text}</p>
            <p style={{ fontSize: 16, color: color, fontWeight: 800, marginTop: 6 }}>{curriculum.verse.reference}</p>
            {memBtn(progress.verseMemorized, markVerse)}
          </div>
        </>
      ) : (
        <>
          <div style={cardStyle}>
            <div style={sectionHeaderStyle}>Catechism {speakBtn(`Question: ${curriculum.catechism.question} Answer: ${curriculum.catechism.answer}`)}</div>
            <p style={{ ...bodyTextStyle, fontWeight: 700, marginBottom: 4 }}>Q{curriculum.catechism.number}: {curriculum.catechism.question}</p>
            <p style={bodyTextStyle}>{curriculum.catechism.answer}</p>
            <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>{curriculum.catechism.reference} · {curriculum.catechism.source}</p>
            {memBtn(progress.catechismMemorized, markCatechism)}
          </div>
          <div style={cardStyle}>
            <div style={sectionHeaderStyle}>Memory verse {speakBtn(curriculum.verse.text + ". " + curriculum.verse.reference)}</div>
            <p style={isLarge ? bigBodyTextStyle : bodyTextStyle}>{curriculum.verse.text}</p>
            <p style={{ fontSize: 13, color: color, fontWeight: 800, marginTop: 6 }}>{curriculum.verse.reference}</p>
            {memBtn(progress.verseMemorized, markVerse)}
          </div>
          <div style={cardStyle}>
            <div style={sectionHeaderStyle}>Hymn {speakBtn(curriculum.hymn.verse)}</div>
            <p style={{ ...bodyTextStyle, fontWeight: 800, marginBottom: 4 }}>{curriculum.hymn.title}</p>
            <p style={{ ...bodyTextStyle, fontStyle: "italic", whiteSpace: "pre-line" }}>{curriculum.hymn.verse}</p>
            <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>{curriculum.hymn.author}{curriculum.hymn.year ? ` · ${curriculum.hymn.year}` : ""}</p>
            {memBtn(progress.hymnLearned, markHymn)}
          </div>
          <div style={cardStyle}>
            <div style={sectionHeaderStyle}>Character {speakBtn(curriculum.character.kidFriendly)}</div>
            <p style={{ fontSize: isLarge ? 22 : 16, fontWeight: 900, color: accentColor, marginBottom: 6 }}>{curriculum.character.trait}</p>
            <p style={isLarge ? bigBodyTextStyle : bodyTextStyle}>{curriculum.character.kidFriendly}</p>
            <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4, fontStyle: "italic" }}>{curriculum.character.verse}, {curriculum.character.reference}</p>
          </div>
        </>
      )}
    </div>
  );
}
