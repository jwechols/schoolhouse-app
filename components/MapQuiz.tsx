"use client";

import { useEffect, useMemo, useState } from "react";
import { OPENAI_VOICE, unlockTTS, useTTS } from "@/lib/tts";
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

interface Props {
  kidId: string;
  onDone: () => void;
}

export default function MapQuiz({ kidId, onDone }: Props) {
  const voice = OPENAI_VOICE[kidId] ?? "ash";
  const { speak } = useTTS(voice);
  const [deck, setDeck] = useState<TexasDeck>("mix");
  const [queue, setQueue] = useState<MapPlace[]>([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [mode, setMode] = useState<"tap" | "name">("tap");
  const [picked, setPicked] = useState<string | null>(null);
  const [wrong, setWrong] = useState(false);
  const [done, setDone] = useState(false);

  function deal(nextDeck: TexasDeck) {
    const items = TEXAS_DECKS[nextDeck].slice().sort(() => Math.random() - 0.5).slice(0, 10);
    setDeck(nextDeck);
    setQueue(items);
    setIndex(0);
    setScore(0);
    setPicked(null);
    setWrong(false);
    setDone(false);
    setMode("tap");
  }

  useEffect(() => {
    deal("mix");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const current = queue[index];
  const options = useMemo(() => (current ? choicesFor(current, TEXAS_DECKS[deck]) : []), [current, deck]);

  useEffect(() => {
    if (!current || done) return;
    unlockTTS();
    speak(mode === "tap" ? current.prompt : "What place is glowing?");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current?.id, mode, done]);

  function grade(idOrName: string) {
    if (!current || picked) return;
    const ok = idOrName === current.id || idOrName === current.name;
    setPicked(idOrName);
    setWrong(!ok);
    if (ok) setScore((s) => s + 1);
    speak(ok ? `Yes. ${current.name}.` : `${current.name}. ${current.hint}`);
  }

  function next() {
    if (index + 1 >= queue.length) {
      setDone(true);
      speak(`You got ${score} of ${queue.length}.`);
      return;
    }
    setIndex((i) => i + 1);
    setPicked(null);
    setWrong(false);
    setMode(index % 2 === 0 ? "name" : "tap");
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--surface-page, #f5f0e6)", color: "var(--text, #171411)", padding: "20px 16px 40px" }}>
      <div style={{ maxWidth: 520, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <button onClick={onDone} style={{ background: "none", border: "none", color: "var(--text-muted, #5c5b4a)", fontWeight: 600, cursor: "pointer" }}>← Back</button>
          <span style={{ fontSize: 13, color: "var(--text-muted, #5c5b4a)" }}>{done ? "Done" : `${index + 1} / ${queue.length || 10}`}</span>
        </div>
        <div style={{ fontFamily: "Georgia, var(--font-display), serif", fontSize: 28, fontWeight: 600, marginBottom: 6 }}>Texas map</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
          {DECK_BTN.map((d) => (
            <button key={d.id} onClick={() => deal(d.id)} style={{
              borderRadius: 999, padding: "6px 12px", fontSize: 13, fontWeight: 700, cursor: "pointer",
              border: "1px solid #d9d1c3", background: deck === d.id ? "#171411" : "#fff", color: deck === d.id ? "#fff" : "#171411",
            }}>{d.label}</button>
          ))}
        </div>

        {done ? (
          <div style={{ background: "#fff", border: "1px solid #e5decf", borderRadius: 20, padding: 24, textAlign: "center" }}>
            <div style={{ fontFamily: "Georgia, serif", fontSize: 32, fontWeight: 600 }}>{score} / {queue.length}</div>
            <p style={{ color: "#5c5b4a" }}>Same map tomorrow if you want another pass.</p>
            <button onClick={() => deal(deck)} style={{ minHeight: 52, width: "100%", borderRadius: 999, border: "none", background: "#2563eb", color: "#fff", fontWeight: 700, cursor: "pointer" }}>Again</button>
          </div>
        ) : current ? (
          <>
            <div style={{ background: "#fff", border: "1px solid #e5decf", borderRadius: 20, padding: "14px 16px", marginBottom: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#2563eb" }}>
                {mode === "tap" ? "Tap the map" : "Name the place"}
              </div>
              <div style={{ fontFamily: "Georgia, serif", fontSize: 22, fontWeight: 600, marginTop: 4 }}>
                {mode === "tap" ? current.prompt : "What place is glowing?"}
              </div>
            </div>

            <svg viewBox="0 0 240 220" style={{ width: "100%", height: "auto", background: "#e8f1ea", borderRadius: 20, border: "1px solid #d7e0d4", touchAction: "manipulation" }}>
              <path d={TEXAS_OUTLINE} fill="#cfe3c4" stroke="#3f5d38" strokeWidth="2" />
              {TEXAS_PLACES.filter((p) => p.kind === "neighbor" || p.kind === "water" || p.kind === "river").map((p) => (
                <g key={p.id} onClick={() => mode === "tap" && grade(p.id)} style={{ cursor: "pointer" }}>
                  <circle cx={p.x} cy={p.y} r={mode === "name" && current.id === p.id ? 11 : 8} fill={fillFor(p, current, picked, mode)} stroke="#173018" strokeWidth="1.2" />
                  <text x={p.x} y={p.y - 12} textAnchor="middle" fontSize="7" fill="#314232">{shortLabel(p.name)}</text>
                </g>
              ))}
              {TEXAS_PLACES.filter((p) => p.kind === "city" || p.kind === "region").map((p) => (
                <g key={p.id} onClick={() => mode === "tap" && grade(p.id)} style={{ cursor: "pointer" }}>
                  <circle cx={p.x} cy={p.y} r={hitRadius(p, current, mode)} fill={fillFor(p, current, picked, mode)} stroke="#173018" strokeWidth="1.3" />
                  {(p.kind === "city" || (mode === "name" && current.id === p.id) || picked) && (
                    <text x={p.x} y={p.y + 14} textAnchor="middle" fontSize="7.5" fontWeight={p.id === "austin" || p.id === "midland" ? 700 : 500} fill="#173018">{p.name}</text>
                  )}
                </g>
              ))}
            </svg>

            {mode === "name" && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 8, marginTop: 12 }}>
                {options.map((name) => (
                  <button key={name} onClick={() => grade(name)} disabled={!!picked} style={{
                    minHeight: 48, borderRadius: 14, border: "1px solid #e5decf", fontWeight: 700, cursor: "pointer",
                    background: picked === name ? (name === current.name ? "#d8f0d4" : "#f8d4d4") : "#fff", color: "#171411",
                  }}>{name}</button>
                ))}
              </div>
            )}

            {picked && (
              <div style={{ marginTop: 12, padding: 14, borderRadius: 16, background: wrong ? "#fdecec" : "#e9f6e6" }}>
                <div style={{ fontWeight: 700 }}>{wrong ? current.name : "Got it."}</div>
                <div style={{ fontSize: 14, color: "#5c5b4a", marginTop: 4 }}>{current.hint}</div>
                <button onClick={next} style={{ marginTop: 10, minHeight: 48, width: "100%", borderRadius: 999, border: "none", background: "#2563eb", color: "#fff", fontWeight: 700, cursor: "pointer" }}>Next</button>
              </div>
            )}
          </>
        ) : null}
      </div>
    </div>
  );
}

function hitRadius(place: MapPlace, current: MapPlace, mode: "tap" | "name") {
  if (mode === "name" && current.id === place.id) return 12;
  return place.kind === "region" ? 11 : 8;
}

function fillFor(place: MapPlace, current: MapPlace, picked: string | null, mode: "tap" | "name") {
  if (mode === "name" && current.id === place.id) return "#f2c14e";
  if (picked && place.id === current.id) return "#3f8f3a";
  if (place.kind === "water" || place.kind === "river") return "#7eb0d4";
  if (place.kind === "neighbor") return "#d9c7a6";
  if (place.kind === "region") return "#b7d39a";
  return "#2b4c7e";
}

function shortLabel(name: string) {
  if (name === "Gulf of Mexico") return "Gulf";
  if (name === "New Mexico") return "N.M.";
  return name;
}
