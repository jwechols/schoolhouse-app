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

const TTS_CACHE_NAME = "schoolhouse-tts-v2";
const memCache = new Map<string, ArrayBuffer>();
const inflight = new Map<string, Promise<ArrayBuffer | null>>();

async function cacheGet(key: string): Promise<ArrayBuffer | null> {
  const hit = memCache.get(key);
  if (hit) return hit;
  if (typeof caches === "undefined") return null;
  try {
    const cache = await caches.open(TTS_CACHE_NAME);
    const res = await cache.match(`/tts-cache/${key}`);
    if (!res) return null;
    const ab = await res.arrayBuffer();
    memCache.set(key, ab);
    return ab;
  } catch {
    return null;
  }
}

async function cachePut(key: string, ab: ArrayBuffer): Promise<void> {
  memCache.set(key, ab);
  if (typeof caches === "undefined") return;
  try {
    const cache = await caches.open(TTS_CACHE_NAME);
    await cache.put(
      `/tts-cache/${key}`,
      new Response(ab, { headers: { "Content-Type": "audio/mpeg" } }),
    );
  } catch {
    /* private mode / quota — memory cache still works */
  }
}

async function fetchLive(voice: string, text: string): Promise<ArrayBuffer | null> {
  const spoken = spokenForm(text);
  const res = await fetch("/api/tts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: spoken, voice, instructions: VOICE_INSTRUCTIONS[voice] }),
  });
  return res.ok ? res.arrayBuffer() : null;
}

/** Resolve audio for a (voice, line): memory → Cache API → baked file → live TTS. */
async function resolveAudio(voice: string, text: string): Promise<ArrayBuffer | null> {
  const key = audioKey(voice, text);
  const cached = await cacheGet(key);
  if (cached) return cached;

  const existing = inflight.get(key);
  if (existing) return existing;

  const work = (async () => {
    const manifest = bakedManifest ?? (await loadBakedManifest());
    if (manifest.has(key)) {
      try {
        const r = await fetch(`/lesson-audio/${key}.mp3`);
        if (r.ok) {
          const ab = await r.arrayBuffer();
          await cachePut(key, ab);
          return ab;
        }
      } catch {
        /* fall through to live */
      }
    }
    const live = await fetchLive(voice, text);
    if (live) await cachePut(key, live);
    return live;
  })();

  inflight.set(key, work);
  try {
    return await work;
  } finally {
    inflight.delete(key);
  }
}

/** Fire-and-forget: bake the next line into cache while the current one plays. */
export function prefetchTTS(voice: string, text: string): void {
  if (!text?.trim()) return;
  void resolveAudio(voice, text);
}

/** Wake the Netlify TTS function + load the baked-audio manifest on first tap. */
export function warmTTS(): void {
  void loadBakedManifest();
  if (typeof fetch === "undefined") return;
  void fetch("/api/tts", { method: "GET", cache: "no-store" }).catch(() => {});
}

// Break text into chunks so the FIRST chunk (one sentence) can synthesize and
// start playing fast, while the rest is fetched in parallel. Short lines
// (catechism, buttons) stay one piece so the cache hits next time.
function chunkText(text: string): string[] {
  if (text.length <= 180) return [text];
  const sentences = (text.match(/[^.!?]+[.!?]+|\S[^.!?]*$/g) ?? [text])
    .map((s) => s.trim())
    .filter(Boolean);
  if (sentences.length <= 1) return sentences.length ? sentences : [text];
  const chunks = [sentences[0]];
  for (let i = 1; i < sentences.length; i += 2) {
    chunks.push(sentences.slice(i, i + 2).join(" "));
  }
  return chunks;
}

// App-wide single-voice gate. Any new speak() claims the gate: it stops
// whatever else is talking and bumps a global turn counter.
let globalAudioTurn = 0;
let stopActiveAudio: (() => void) | null = null;

export function useTTS(voice = "nova") {
  const audioUnlocked = useRef(false);
  const audiosRef = useRef<HTMLAudioElement[]>([]);
  const reqIdRef = useRef(0);
  const [speaking, setSpeaking] = useState(false);
  const [paused, setPaused] = useState(false);

  const unlockAudio = useCallback(() => {
    if (typeof window === "undefined") return;
    audioUnlocked.current = true;
    // iOS: resume a silent AudioContext inside the user gesture so later HTMLAudio plays.
    try {
      const AC = (window as unknown as { AudioContext?: typeof AudioContext; webkitAudioContext?: typeof AudioContext }).AudioContext
        || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (AC) {
        const ctx = new AC();
        void ctx.resume();
        const buf = ctx.createBuffer(1, 1, 22050);
        const src = ctx.createBufferSource();
        src.buffer = buf;
        src.connect(ctx.destination);
        src.start(0);
      }
    } catch {
      /* ignore */
    }
    warmTTS();
  }, []);

  const stopAll = () => {
    audiosRef.current.forEach((a) => {
      try { a.onended = null; a.onerror = null; a.pause(); a.removeAttribute("src"); a.load(); } catch { /* already stopped */ }
    });
    audiosRef.current = [];
  };

  const playBuffer = (ab: ArrayBuffer, live: () => boolean): Promise<void> => {
    return new Promise((resolve) => {
      if (!live()) { resolve(); return; }
      const url = URL.createObjectURL(new Blob([ab], { type: "audio/mpeg" }));
      const audio = new Audio();
      audio.preload = "auto";
      audio.src = url;
      audiosRef.current.push(audio);
      const done = () => {
        URL.revokeObjectURL(url);
        audiosRef.current = audiosRef.current.filter((el) => el !== audio);
        resolve();
      };
      audio.onended = done;
      audio.onerror = done;
      audio.play().catch(done);
    });
  };

  const speak = useCallback(async (text: string, onEnd?: () => void) => {
    if (typeof window === "undefined" || !text.trim()) return;
    const myId = ++reqIdRef.current;
    stopAll();
    if (stopActiveAudio && stopActiveAudio !== stopAll) { try { stopActiveAudio(); } catch { /* noop */ } }
    stopActiveAudio = stopAll;
    const turn = ++globalAudioTurn;
    const live = () => myId === reqIdRef.current && turn === globalAudioTurn;
    setPaused(false);

    const finish = () => {
      if (live()) { setSpeaking(false); setPaused(false); onEnd?.(); }
    };

    try {
      void loadBakedManifest();
      const chunks = chunkText(text);
      // Kick every chunk immediately so #2 is in cache before #1 finishes.
      const pending = chunks.map((c) => resolveAudio(voice, c));
      setSpeaking(true);

      for (let i = 0; i < pending.length; i++) {
        let buf: ArrayBuffer | null = null;
        try { buf = await pending[i]; } catch { buf = null; }
        if (!live()) return;
        if (!buf) continue;
        await playBuffer(buf, live);
        if (!live()) return;
      }
      finish();
    } catch {
      finish();
    }
  }, [voice]);

  const prefetch = useCallback((text: string) => {
    prefetchTTS(voice, text);
  }, [voice]);

  const stopAudio = useCallback(() => {
    stopAll();
    globalAudioTurn++;
    if (stopActiveAudio === stopAll) stopActiveAudio = null;
    setSpeaking(false);
    setPaused(false);
  }, []);

  const pauseAudio = useCallback(() => {
    audiosRef.current.forEach((a) => { try { a.pause(); } catch { /* */ } });
    setPaused(true);
  }, []);
  const resumeAudio = useCallback(() => {
    audiosRef.current.forEach((a) => { try { void a.play(); } catch { /* */ } });
    setPaused(false);
  }, []);

  useEffect(() => () => {
    stopAll();
    globalAudioTurn++;
    if (stopActiveAudio === stopAll) stopActiveAudio = null;
  }, []);

  return { speak, prefetch, unlockAudio, stopAudio, pauseAudio, resumeAudio, speaking, paused };
}
