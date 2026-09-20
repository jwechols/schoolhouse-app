"use client";

import { useEffect, useMemo, useState } from "react";
import {
  TEXAS_DECKS,
  TEXAS_OUTLINE,
  TEXAS_PLACES,
  choicesFor,
  type MapPlace,
  type TexasDeck,
} from "@/lib/maps/texas";

const DECK_BTN: { id: TexasDeck; label: string }[] = [
  { id: "mix", label: "Mix" },
  { id: "cities", label: "Cities" },
  { id: "regions", label: "Regions" },
  { id: "neighbors", label: "Borders" },
];

function hear(text: string) {
  if (typeof window === "undefined" || !text) return;
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.95;
    window.speechSynthesis.speak(u);
  } catch {
    /* no voice on this device */
  }
}

interface Props {
  kidId: string;
  onDone: () => void;
}

export default function MapQuiz({ onDone }: Props) {
  const [deck, setDeck] = useState<TexasDeck>("cities");
  const [queue, setQueue] = useState<MapPlace[]>([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [wrong, setWrong] = useState(false);
  const [done, setDone] = useState(false);

  function deal(nextDeck: TexasDeck) {
    const items = TEXAS_DECKS[nextDeck].slice().sort(() => Math.random() - 0.5).slice(0, 8);
    setDeck(nextDeck);
    setQueue(items);
    setIndex(0);
    setScore(0);
    setPicked(null);
    setWrong(false);
    setDone(false);
  }

  useEffect(() => { deal("cities"); }, []);

  const current = queue[index];
  const options = useMemo(() => (current ? choicesFor(current, TEXAS_DECKS[deck]) : []), [current, deck]);

  function grade(idOrName: string) {
    if (!current || picked) return;
    const ok = idOrName === current.id || idOrName === current.name;
    setPicked(idOrName);
    setWrong(!ok);
    if (ok) setScore((s) => s + 1);
  }

  function next() {
    if (index + 1 >= queue.length) {
      setDone(true);
      return;
    }
    setIndex((i) => i + 1);
    setPicked(null);
    setWrong(false);
  }

  const visible = TEXAS_PLACES.filter((p) => {
    if (deck === "cities") return p.kind === "city";
    if (deck === "regions") return p.kind === "city" || p.kind === "region";
    if (deck === "neighbors") return p.kind !== "region";
    return true;
  });

  return (
    <div style={{ minHeight: "100vh", background: "#f4efe4", color: "#171411", padding: "20px 16px 40px" }}>
      <div style={{ maxWidth: 560, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <button onClick={onDone} style={{ background: "none", border: "none", color: "#5c5b4a", fontWeight: 600, cursor: "pointer" }}>← Back</button>
          <span style={{ fontSize: 13, color: "#5c5b4a" }}>{done ? "Done" : `${index + 1} / ${queue.length || 8}`}</span>
        </div>
        <h1 style={{ fontFamily: "Georgia, serif", fontSize: 30, fontWeight: 600, margin: "0 0 4px" }}>Texas</h1>
        <p style={{ margin: "0 0 12px", color: "#5c5b4a", fontSize: 15 }}>Tap the place. No waiting on a voice.</p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
          {DECK_BTN.map((d) => (
            <button key={d.id} onClick={() => deal(d.id)} style={{
              borderRadius: 999, padding: "7px 14px", fontSize: 14, fontWeight: 700, cursor: "pointer",
              border: "1px solid #d9d1c3", background: deck === d.id ? "#171411" : "#fff", color: deck === d.id ? "#fff" : "#171411",
            }}>{d.label}</button>
          ))}
        </div>

        {done ? (
          <div style={{ background: "#fff", border: "1px solid #e5decf", borderRadius: 20, padding: 24, textAlign: "center" }}>
            <div style={{ fontFamily: "Georgia, serif", fontSize: 36, fontWeight: 600 }}>{score} / {queue.length}</div>
            <button onClick={() => deal(deck)} style={{ marginTop: 16, minHeight: 52, width: "100%", borderRadius: 999, border: "none", background: "#1d4f3a", color: "#fff", fontWeight: 700, cursor: "pointer" }}>Again</button>
          </div>
        ) : current ? (
          <>
            <div style={{ background: "#fff", border: "1px solid #e5decf", borderRadius: 18, padding: "14px 16px", marginBottom: 12, display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#1d4f3a" }}>Find it</div>
                <div style={{ fontFamily: "Georgia, serif", fontSize: 22, fontWeight: 600 }}>{current.prompt.replace("Tap ", "")}</div>
              </div>
              <button onClick={() => hear(current.prompt)} style={{ border: "1px solid #d9d1c3", background: "#fff", borderRadius: 999, padding: "8px 12px", fontWeight: 700, cursor: "pointer" }}>Hear</button>
            </div>

            <svg viewBox="0 0 240 220" style={{ width: "100%", height: "auto", background: "#dceadf", borderRadius: 20, border: "1px solid #c3d2bf" }}>
              <path d={TEXAS_OUTLINE} fill="#b7d0a8" stroke="#2c4a2c" strokeWidth="2.4" />
              {visible.map((p) => {
                const active = current.id === p.id;
                const show = p.kind === "city" || picked || active;
                return (
                  <g key={p.id} onClick={() => grade(p.id)} style={{ cursor: "pointer" }}>
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r={active ? 10 : p.kind === "city" ? 6.5 : 8}
                      fill={picked && p.id === current.id ? "#1d4f3a" : active ? "#c45c26" : p.kind === "city" ? "#1d3b6e" : "#6a8f5a"}
                      stroke="#fff"
                      strokeWidth="1.4"
                    />
                    {show && (
                      <text x={p.x} y={p.y + 16} textAnchor="middle" fontSize="9" fontWeight={p.id === "midland" || p.id === "austin" ? 700 : 600} fill="#173018">
                        {p.name}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 12 }}>
              {options.map((name) => (
                <button key={name} onClick={() => grade(name)} disabled={!!picked} style={{
                  minHeight: 48, borderRadius: 14, border: "1px solid #e5decf", fontWeight: 700, cursor: "pointer",
                  background: picked === name ? (name === current.name ? "#d8f0d4" : "#f8d4d4") : "#fff",
                }}>{name}</button>
              ))}
            </div>

            {picked && (
              <div style={{ marginTop: 12, padding: 14, borderRadius: 16, background: wrong ? "#fdecec" : "#e9f6e6" }}>
                <div style={{ fontWeight: 800 }}>{wrong ? `It was ${current.name}` : "Got it"}</div>
                <div style={{ fontSize: 14, color: "#5c5b4a", marginTop: 4 }}>{current.hint}</div>
                <button onClick={next} style={{ marginTop: 10, minHeight: 48, width: "100%", borderRadius: 999, border: "none", background: "#1d4f3a", color: "#fff", fontWeight: 700, cursor: "pointer" }}>Next</button>
              </div>
            )}
          </>
        ) : null}
      </div>
    </div>
  );
}
