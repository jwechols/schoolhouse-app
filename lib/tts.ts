"use client";

import { useRef, useCallback, useState, useEffect } from "react";

// Per-kid tutor voices (OpenAI gpt-4o-mini-tts model). Each kid has a UNIQUE
// voice so we can key the style instructions below by voice.
export const OPENAI_VOICE: Record<string, string> = {
  titus: "ash",     // Buck, warm, folksy outdoorsman
  mercy: "coral",   // Princess Rose, bright, gentle
  lois:  "shimmer", // Princess Crystal, softest, for a 3-year-old
  truma: "nova",    // Lydia, warm, mature woman mentor (female)
};

// Voice delivery style, steered per tutor (gpt-4o-mini-tts `instructions`).
export const VOICE_INSTRUCTIONS: Record<string, string> = {
  ash: "Warm, friendly older outdoorsman, like a favorite hunting-and-fishing uncle. Easygoing, upbeat, a little playful and folksy to keep an 8-year-old boy engaged. Encouraging, never rushed or stern.",
  coral: "Gentle, joyful kindergarten teacher who loves flowers. Warm and bright with a light sing-song lilt. Slow and clear for a 5-year-old, full of delight and encouragement.",
  shimmer: "The softest, gentlest voice for a 3-year-old. Very slow, very simple, very tender. Calm and reassuring, almost like a lullaby. Short and sweet.",
  nova: "Warm, intelligent woman mentor. Calm, thoughtful, and encouraging. Speak to a bright 11-year-old as a capable young scholar, never talk down to her. Unhurried and clear, with a gentle smile in the voice. Pronounce the name 'Truma' as 'TROO-mah' (rhymes with Puma), never 'Truh-ma'.",
};

// ── Pre-baked audio ───────────────────────────────────────────────────────────
// Authored lesson lines are synthesized ONCE to static files at
// public/lesson-audio/<key>.mp3 by scripts/prebake-audio.mjs. When a line has a
// baked file, useTTS plays it instantly with zero OpenAI round-trip and zero
// cost. Anything not baked (a child's own question, an un-baked lesson) falls
// back to live synthesis. KEEP `spokenForm` + `audioKey` byte-for-byte in sync
// with scripts/prebake-audio.mjs, or baked files will never be found.

/** Spoken-only phonetic fix: "Truma" reads as "Trooma" (never shown on screen). */
export function spokenForm(t: string): string {
  return t.replace(/Truma/g, "Trooma").replace(/truma/g, "trooma");
}

/** Stable filename key for a (voice, line) pair. FNV-1a hash + length. */
export function audioKey(voice: string, text: string): string {
  const s = spokenForm(text);
  let h = 0x811c9dc5;
  const keyed = voice + "|" + s;
  for (let i = 0; i < keyed.length; i++) {
    h ^= keyed.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return `${voice}-${(h >>> 0).toString(16).padStart(8, "0")}-${s.length}`;
}

// Manifest of baked keys, fetched once per page load.
let bakedManifest: Set<string> | null = null;
let manifestPromise: Promise<Set<string>> | null = null;
function loadBakedManifest(): Promise<Set<string>> {
  if (bakedManifest) return Promise.resolve(bakedManifest);
  if (!manifestPromise) {
    manifestPromise = fetch("/lesson-audio/manifest.json")
      .then((r) => (r.ok ? r.json() : []))
      .then((arr: string[]) => (bakedManifest = new Set(Array.isArray(arr) ? arr : [])))
      .catch(() => (bakedManifest = new Set<string>()));
  }
  return manifestPromise;
}

// Break text into chunks so the FIRST chunk (one sentence) can synthesize and
// start playing fast, while the rest is fetched in parallel. This is what kills
// the long pause before the tutor starts talking.
function chunkText(text: string): string[] {
  const sentences = (text.match(/[^.!?]+[.!?]+|\S[^.!?]*$/g) ?? [text])
    .map((s) => s.trim())
    .filter(Boolean);
  if (sentences.length <= 1) return sentences.length ? sentences : [text];
  const chunks = [sentences[0]];             // first sentence alone → fast start
  for (let i = 1; i < sentences.length; i += 2) {
    chunks.push(sentences.slice(i, i + 2).join(" ")); // rest in pairs
  }
  return chunks;
}

// App-wide single-voice gate. Every useTTS instance has its OWN AudioContext, so
// without a shared gate two instances (or stale playback after a fast tap) each
// keep playing and you hear voices over each other. Any new speak() claims the
// gate: it stops whatever else is talking and bumps a global turn counter, so any
// in-flight (awaiting) playback that lost the gate aborts instead of starting.
let globalAudioTurn = 0;
let stopActiveAudio: (() => void) | null = null;

export function useTTS(voice = "nova") {
  const audioCtxRef   = useRef<AudioContext | null>(null);
  const audioUnlocked = useRef(false);
  const sourcesRef    = useRef<AudioBufferSourceNode[]>([]);
  // HTMLAudio fallback elements (used when there is no AudioContext, e.g. before
  // unlock or on the pre-baked no-ctx path). Tracked so stopAll can silence them
  // too, otherwise a `new Audio()` kept playing after Next / navigate / close.
  const audiosRef     = useRef<HTMLAudioElement[]>([]);
  const reqIdRef      = useRef(0);
  // Exposed so UIs can show a pause/resume control while the tutor is talking.
  const [speaking, setSpeaking] = useState(false);
  const [paused, setPaused] = useState(false);

  const unlockAudio = useCallback(() => {
    if (audioUnlocked.current || typeof window === "undefined") return;
    const AC = (window as any).AudioContext || (window as any).webkitAudioContext; // eslint-disable-line @typescript-eslint/no-explicit-any
    if (!AC) return;
    const ctx = new AC() as AudioContext;
    audioCtxRef.current = ctx;
    ctx.resume().then(() => { audioUnlocked.current = true; });
  }, []);

  const stopAll = () => {
    sourcesRef.current.forEach((s) => { try { s.onended = null; s.stop(); } catch { /* already stopped */ } });
    sourcesRef.current = [];
    audiosRef.current.forEach((a) => { try { a.onended = null; a.pause(); a.currentTime = 0; a.src = ""; } catch { /* already stopped */ } });
    audiosRef.current = [];
  };

  const speak = useCallback(async (text: string, onEnd?: () => void) => {
    if (typeof window === "undefined" || !text.trim()) return;
    const myId = ++reqIdRef.current; // supersede any earlier speak() on THIS instance
    stopAll();
    // Claim the app-wide voice: silence any OTHER instance still talking, register
    // ours, and take a global turn number. `live()` is true only while this call
    // still owns both its instance and the global gate.
    if (stopActiveAudio && stopActiveAudio !== stopAll) { try { stopActiveAudio(); } catch { /* noop */ } }
    stopActiveAudio = stopAll;
    const turn = ++globalAudioTurn;
    const live = () => myId === reqIdRef.current && turn === globalAudioTurn;
    setPaused(false);
    const ctx = audioCtxRef.current;

    const fetchAudio = async (t: string): Promise<ArrayBuffer | null> => {
      // Spoken-only phonetic fix: "Truma" is pronounced "Trooma". This affects the
      // audio the voice engine reads, never any text shown on screen (she is always
      // spelled "Truma" everywhere visible).
      const spoken = t.replace(/Truma/g, "Trooma").replace(/truma/g, "trooma");
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: spoken, voice, instructions: VOICE_INSTRUCTIONS[voice] }),
      });
      return res.ok ? res.arrayBuffer() : null;
    };

    try {
      // ── Pre-baked fast path: play the static file if this line was baked ────
      const key = audioKey(voice, text);
      const manifest = await loadBakedManifest();
      if (!live()) return;
      if (manifest.has(key)) {
        const ab = await fetch(`/lesson-audio/${key}.mp3`)
          .then((r) => (r.ok ? r.arrayBuffer() : null))
          .catch(() => null);
        if (!live()) return;
        if (ab) {
          if (ctx) {
            if (ctx.state === "suspended") ctx.resume();
            const buf = await ctx.decodeAudioData(ab);
            if (!live()) return;
            const src = ctx.createBufferSource();
            src.buffer = buf;
            src.connect(ctx.destination);
            setSpeaking(true);
            src.start();
            sourcesRef.current.push(src);
            src.onended = () => {
              sourcesRef.current = sourcesRef.current.filter((s) => s !== src);
              if (live()) { setSpeaking(false); setPaused(false); onEnd?.(); }
            };
            return;
          }
          const url = URL.createObjectURL(new Blob([ab], { type: "audio/mpeg" }));
          const audio = new Audio(url);
          audiosRef.current.push(audio);
          audio.onended = () => { URL.revokeObjectURL(url); audiosRef.current = audiosRef.current.filter((a) => a !== audio); if (live()) { setSpeaking(false); onEnd?.(); } };
          setSpeaking(true);
          audio.play().catch(() => { setSpeaking(false); onEnd?.(); });
          return;
        }
        // Baked file missing/failed → fall through to live synthesis below.
      }

      // Fallback (no AudioContext yet): one request, HTMLAudio.
      if (!ctx) {
        const ab = await fetchAudio(text);
        if (!live()) return;
        if (!ab) { onEnd?.(); return; }
        const url = URL.createObjectURL(new Blob([ab], { type: "audio/mpeg" }));
        const audio = new Audio(url);
        audiosRef.current.push(audio);
        audio.onended = () => { URL.revokeObjectURL(url); audiosRef.current = audiosRef.current.filter((a) => a !== audio); if (live()) setSpeaking(false); };
        setSpeaking(true);
        audio.play().catch(() => { setSpeaking(false); onEnd?.(); });
        return;
      }

      if (ctx.state === "suspended") ctx.resume();
      const chunks = chunkText(text);
      const lastIdx = chunks.length - 1;
      setSpeaking(true);

      // Kick off ALL syntheses at once; play them in order as they decode.
      const decoding = chunks.map(async (c) => {
        const ab = await fetchAudio(c);
        return ab ? ctx.decodeAudioData(ab) : null;
      });

      let cursor = 0; // next scheduled start time (ctx clock)
      for (let i = 0; i < decoding.length; i++) {
        let buf: AudioBuffer | null = null;
        try { buf = await decoding[i]; } catch { buf = null; }
        if (!live()) return; // superseded mid-flight
        if (!buf) continue;
        const src = ctx.createBufferSource();
        src.buffer = buf;
        src.connect(ctx.destination);
        const startAt = Math.max(cursor, ctx.currentTime);
        src.start(startAt);
        cursor = startAt + buf.duration;
        sourcesRef.current.push(src);
        const isLast = i === lastIdx;
        src.onended = () => {
          sourcesRef.current = sourcesRef.current.filter((s) => s !== src);
          if (isLast && live()) { setSpeaking(false); setPaused(false); onEnd?.(); }
        };
      }
    } catch {
      if (live()) { setSpeaking(false); onEnd?.(); }
    }
  }, [voice]);

  const stopAudio = useCallback(() => {
    stopAll();
    // Release the app-wide gate and bump the turn so any in-flight speak() aborts.
    globalAudioTurn++;
    if (stopActiveAudio === stopAll) stopActiveAudio = null;
    setSpeaking(false);
    setPaused(false);
  }, []);

  // Pause/resume the tutor mid-sentence (suspends this hook's AudioContext).
  const pauseAudio = useCallback(() => {
    const ctx = audioCtxRef.current;
    if (ctx && ctx.state === "running") { ctx.suspend(); setPaused(true); }
  }, []);
  const resumeAudio = useCallback(() => {
    const ctx = audioCtxRef.current;
    if (ctx && ctx.state === "suspended") { ctx.resume(); setPaused(false); }
  }, []);

  // When the component using this hook unmounts (leaving the lesson, navigating
  // away, or closing the tutor), stop any audio immediately so the tutor never
  // keeps talking after its UI is gone. Bump the global turn so any in-flight
  // speak() aborts, and release the app-wide voice gate.
  useEffect(() => () => {
    stopAll();
    globalAudioTurn++;
    if (stopActiveAudio === stopAll) stopActiveAudio = null;
  }, []);

  return { speak, unlockAudio, stopAudio, pauseAudio, resumeAudio, speaking, paused };
}
