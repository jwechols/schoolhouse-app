"use client";

import { useEffect, useMemo, useState } from "react";
import { OPENAI_VOICE, unlockTTS, useTTS } from "@/lib/tts";
import {
  TEXAS_DECKS,
  TEXAS_OUTLINE,
  TEXAS_PLACES,
  TEXAS_VIEWBOX,
  choicesFor,
  type MapPlace,
  type TexasDeck,
} from "@/lib/maps/texas";

const DECK_BTN: { id: TexasDeck; label: string }[] = [
  { id: "cities", label: "Cities" },
  { id: "regions", label: "Regions" },
  { id: "neighbors", label: "Borders" },
  { id: "mix", label: "Mix" },
];

export default function MapQuiz({ kidId, onDone }: { kidId: string; onDone: () => void }) {
  const voice = OPENAI_VOICE[kidId] ?? "ash";
  const { speak } = useTTS(voice);
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
    if (index + 1 >= queue.length) { setDone(true); return; }
    setIndex((i) => i + 1);
    setPicked(null);
    setWrong(false);
  }

  const visible = TEXAS_PLACES.filter((p) => {
    if (deck === "cities") return p.kind === "city";
    if (deck === "regions") return p.kind === "city" || p.kind === "region";
    if (deck === "neighbors") return true;
    return true;
  });

  return (
    <div style={{ minHeight: "100vh", background: "#eef3ea", color: "#171411", padding: "16px 12px 40px" }}>
      <div style={{ maxWidth: 640, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <button onClick={onDone} style={{ background: "none", border: "none", fontWeight: 700, cursor: "pointer" }}>← Back</button>
          <span style={{ fontSize: 13, color: "#5c5b4a" }}>{done ? "Done" : `${index + 1} / ${queue.length || 8}`}</span>
        </div>
        <h1 style={{ fontFamily: "Georgia, serif", fontSize: 32, margin: "8px 0 4px" }}>Texas</h1>
        <p style={{ margin: "0 0 12px", color: "#5c5b4a" }}>Real state shape. Tap a city or a name.</p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
          {DECK_BTN.map((d) => (
            <button key={d.id} onClick={() => deal(d.id)} style={{
              borderRadius: 999, padding: "7px 14px", fontWeight: 700, cursor: "pointer",
              border: "1px solid #c3d2bf", background: deck === d.id ? "#1d3b2a" : "#fff", color: deck === d.id ? "#fff" : "#171411",
            }}>{d.label}</button>
          ))}
        </div>

        {done ? (
          <div style={{ background: "#fff", borderRadius: 20, padding: 24, textAlign: "center" }}>
            <div style={{ fontFamily: "Georgia, serif", fontSize: 36 }}>{score} / {queue.length}</div>
            <button onClick={() => deal(deck)} style={{ marginTop: 16, minHeight: 52, width: "100%", borderRadius: 999, border: "none", background: "#1d3b2a", color: "#fff", fontWeight: 700 }}>Again</button>
          </div>
        ) : current ? (
          <>
            <div style={{ background: "#fff", borderRadius: 16, padding: "12px 14px", marginBottom: 10, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: ".08em", textTransform: "uppercase", color: "#1d3b2a" }}>Find</div>
                <div style={{ fontFamily: "Georgia, serif", fontSize: 24, fontWeight: 600 }}>{current.name}</div>
              </div>
              <button onClick={() => { unlockTTS(); speak(current.prompt); }} style={{ border: "1px solid #c3d2bf", background: "#fff", borderRadius: 999, padding: "8px 14px", fontWeight: 800, cursor: "pointer" }}>Hear</button>
            </div>

            <svg viewBox={TEXAS_VIEWBOX} style={{ width: "100%", height: "auto", background: "#d7e4d0", borderRadius: 18 }}>
              <rect width="800" height="720" fill="#d7e4d0" />
              <text x="548" y="42" textAnchor="middle" fontSize="18" fill="#6b7280">Oklahoma</text>
              <text x="40" y="165" fontSize="16" fill="#6b7280">N.M.</text>
              <text x="778" y="372" textAnchor="end" fontSize="16" fill="#6b7280">La.</text>
              <text x="400" y="705" textAnchor="middle" fontSize="16" fill="#6b7280">Mexico</text>
              <text x="730" y="650" textAnchor="middle" fontSize="16" fill="#3b6d8f">Gulf</text>
              <path d={TEXAS_OUTLINE} fill="#8fb57a" stroke="#2c4a2c" strokeWidth="4" />
              {visible.map((p) => {
                const hit = current.id === p.id;
                const showName = p.kind === "city";
                return (
                  <g key={p.id} onClick={() => grade(p.id)} style={{ cursor: "pointer" }}>
                    <circle cx={p.x} cy={p.y} r={hit ? 14 : p.kind === "city" ? 9 : 11} fill={picked && p.id === current.id ? "#1d3b2a" : hit ? "#c45c26" : p.kind === "city" ? "#1d3b6e" : "transparent"} stroke={p.kind === "city" ? "#fff" : "transparent"} strokeWidth="2" />
                    {showName && (
                      <text x={p.x} y={p.y + 24} textAnchor="middle" fontSize="16" fontWeight={p.id === "midland" || p.id === "austin" ? 800 : 650} fill="#173018">{p.name}</text>
                    )}
                  </g>
                );
              })}
            </svg>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 12 }}>
              {options.map((name) => (
                <button key={name} onClick={() => grade(name)} disabled={!!picked} style={{
                  minHeight: 48, borderRadius: 14, border: "1px solid #d7e0d0", fontWeight: 700,
                  background: picked === name ? (name === current.name ? "#d8f0d4" : "#f8d4d4") : "#fff",
                }}>{name}</button>
              ))}
            </div>

            {picked && (
              <div style={{ marginTop: 12, padding: 14, borderRadius: 16, background: wrong ? "#fdecec" : "#e9f6e6" }}>
                <div style={{ fontWeight: 800 }}>{wrong ? `It was ${current.name}` : "Got it"}</div>
                <div style={{ fontSize: 14, color: "#5c5b4a", marginTop: 4 }}>{current.hint}</div>
                <button onClick={next} style={{ marginTop: 10, minHeight: 48, width: "100%", borderRadius: 999, border: "none", background: "#1d3b2a", color: "#fff", fontWeight: 700 }}>Next</button>
              </div>
            )}
          </>
        ) : null}
      </div>
    </div>
  );
}
