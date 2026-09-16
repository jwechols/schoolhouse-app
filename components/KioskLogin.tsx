"use client";

import { useState } from "react";

interface KioskKid {
  id: string;
  name: string;
  emoji: string;
  color: string;
}

interface Props {
  kids: KioskKid[];
}

/**
 * KioskLogin, kid picker + numeric PIN pad for the shared money kiosk.
 * Each kid taps their face, enters their own PIN, and unlocks only their own
 * money screen. On success the page reloads and the server renders their MoneyView.
 * Per-kid PINs come from env vars ({KID}_PIN) checked in /api/auth.
 */
export default function KioskLogin({ kids }: Props) {
  const [selected, setSelected] = useState<KioskKid | null>(null);
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(finalPin: string) {
    if (!selected || finalPin.length < 3 || busy) return;
    setBusy(true);
    setError("");
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode: "kid", kidId: selected.id, pin: finalPin }),
    });
    if (res.ok) {
      window.location.reload();
    } else {
      setError("That PIN didn't match. Try again.");
      setPin("");
      setBusy(false);
    }
  }

  function press(d: string) {
    if (busy) return;
    const next = (pin + d).slice(0, 6);
    setPin(next);
  }

  // ── Kid picker ────────────────────────────────────────────────────────────
  if (!selected) {
    return (
      <main className="min-h-screen bg-parchment flex flex-col items-center justify-center px-6">
        <h1 className="text-3xl font-black text-navy mb-2">Who's this? 💰</h1>
        <p className="text-stone text-sm mb-8">Tap your name to see your money.</p>
        <div className="grid grid-cols-2 gap-4 w-full max-w-md">
          {kids.map((k) => (
            <button
              key={k.id}
              onClick={() => { setSelected(k); setPin(""); setError(""); }}
              className="rounded-3xl py-8 flex flex-col items-center gap-2 shadow-md active:scale-95 transition-transform"
              style={{ background: "#fff", border: `3px solid ${k.color}55` }}
            >
              <span className="text-5xl">{k.emoji}</span>
              <span className="font-black text-xl" style={{ color: k.color }}>{k.name}</span>
            </button>
          ))}
        </div>
      </main>
    );
  }

  // ── PIN pad ───────────────────────────────────────────────────────────────
  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ background: `linear-gradient(160deg, ${selected.color}18 0%, #fff 60%)` }}
    >
      <button onClick={() => { setSelected(null); setPin(""); setError(""); }} className="text-stone text-sm mb-6 underline">
        ← not me
      </button>
      <span className="text-5xl mb-2">{selected.emoji}</span>
      <h1 className="text-2xl font-black mb-1" style={{ color: selected.color }}>Hi, {selected.name}!</h1>
      <p className="text-stone text-sm mb-5">Enter your PIN.</p>

      {/* PIN dots */}
      <div className="flex gap-3 mb-6 h-6">
        {Array.from({ length: Math.max(4, pin.length) }).map((_, i) => (
          <span
            key={i}
            className="w-4 h-4 rounded-full"
            style={{ background: i < pin.length ? selected.color : `${selected.color}33` }}
          />
        ))}
      </div>

      {error && <p className="text-sm text-red-600 mb-3">{error}</p>}

      <div className="grid grid-cols-3 gap-3 w-full max-w-xs">
        {["1","2","3","4","5","6","7","8","9"].map((d) => (
          <button
            key={d}
            onClick={() => press(d)}
            className="rounded-2xl py-5 text-2xl font-black bg-white shadow-sm active:scale-90 transition-transform"
            style={{ color: selected.color, border: `2px solid ${selected.color}22` }}
          >
            {d}
          </button>
        ))}
        <button
          onClick={() => setPin("")}
          className="rounded-2xl py-5 text-lg font-bold bg-bone text-stone active:scale-90 transition-transform"
        >
          Clear
        </button>
        <button
          onClick={() => press("0")}
          className="rounded-2xl py-5 text-2xl font-black bg-white shadow-sm active:scale-90 transition-transform"
          style={{ color: selected.color, border: `2px solid ${selected.color}22` }}
        >
          0
        </button>
        <button
          onClick={() => submit(pin)}
          disabled={pin.length < 3 || busy}
          className="rounded-2xl py-5 text-lg font-black text-white shadow-sm active:scale-90 transition-transform disabled:opacity-40"
          style={{ background: selected.color }}
        >
          {busy ? "…" : "Go →"}
        </button>
      </div>
    </main>
  );
}
