"use client";

import { useCallback, useRef } from "react";

// ── useSTT ────────────────────────────────────────────────────────────────────
// Records the kid via MediaRecorder, watches the mic level to auto-stop when they
// go quiet, then sends the clip to /api/stt (OpenAI Whisper) and hands back the
// transcript. Works in Safari and inside the installed iPad PWA, where the old
// SpeechRecognition API silently failed.
//
// Usage:
//   const stt = useSTT();
//   stt.start({ onFinal: t => ..., onEmpty: () => ..., onError: () => ... });
//   stt.stop();   // manual stop (button), transcribes what was captured
//   stt.abort();  // discard (navigation / mute), no transcription

export interface STTHandlers {
  onStart?: () => void;              // recording actually began
  onFinal: (text: string) => void;   // transcript with real content
  onEmpty?: () => void;              // recorded but silence / nothing heard
  onError?: () => void;             // mic blocked, unsupported, or STT failed
}

// How long the kid can be silent (after having spoken) before we auto-stop.
// Kept short enough that turns end promptly (less felt latency) but long enough that a
// young child pausing mid-thought isn't clipped. Tune per real-world feedback.
const TRAILING_SILENCE_MS = 1000;
// If the kid never says anything, give up after this long.
const NO_SPEECH_MS = 6000;
// Absolute cap on a single turn.
const MAX_TURN_MS = 15000;
// RMS threshold above which we count the frame as speech.
const SPEECH_LEVEL = 0.02;

export function useSTT() {
  const recRef      = useRef<MediaRecorder | null>(null);
  const streamRef   = useRef<MediaStream | null>(null);
  const chunksRef   = useRef<Blob[]>([]);
  const ctxRef      = useRef<AudioContext | null>(null);
  const rafRef      = useRef<number | null>(null);
  const maxTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handlersRef = useRef<STTHandlers | null>(null);
  const heardRef    = useRef(false);
  const abortedRef  = useRef(false);

  const teardown = useCallback(() => {
    if (rafRef.current != null) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
    if (maxTimerRef.current != null) { clearTimeout(maxTimerRef.current); maxTimerRef.current = null; }
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
    ctxRef.current?.close().catch(() => {});
    ctxRef.current = null;
  }, []);

  const stop = useCallback(() => {
    try {
      if (recRef.current && recRef.current.state !== "inactive") recRef.current.stop();
    } catch { /* already stopped */ }
  }, []);

  const abort = useCallback(() => {
    abortedRef.current = true;
    stop();
    teardown();
  }, [stop, teardown]);

  const start = useCallback(async (handlers: STTHandlers) => {
    handlersRef.current = handlers;
    abortedRef.current = false;
    heardRef.current = false;
    chunksRef.current = [];

    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia ||
        typeof MediaRecorder === "undefined") {
      handlers.onError?.();
      return;
    }

    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      handlers.onError?.();
      return;
    }
    streamRef.current = stream;

    // Pick a container the browser can actually produce (Safari => mp4, Chrome => webm).
    let mimeType = "";
    for (const m of ["audio/webm", "audio/mp4", "audio/mpeg"]) {
      if (MediaRecorder.isTypeSupported?.(m)) { mimeType = m; break; }
    }
    let rec: MediaRecorder;
    try {
      rec = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
    } catch {
      teardown();
      handlers.onError?.();
      return;
    }
    recRef.current = rec;

    rec.ondataavailable = e => { if (e.data && e.data.size > 0) chunksRef.current.push(e.data); };

    rec.onstop = async () => {
      teardown();
      if (abortedRef.current) return;

      const type = rec.mimeType || mimeType || "audio/webm";
      const blob = new Blob(chunksRef.current, { type });
      // Transcribe on real audio regardless of the level meter. The analyser's
      // AudioContext can stay suspended on iOS, leaving heardRef false even when
      // the child spoke, so we must NOT gate transcription on it. Let Whisper
      // decide: it returns empty text for true silence, which routes to onEmpty.
      if (blob.size < 2000) { handlersRef.current?.onEmpty?.(); return; }

      const ext = type.includes("mp4") ? "mp4"
                : type.includes("mpeg") ? "mp3"
                : type.includes("ogg") ? "ogg"
                : "webm";
      try {
        const fd = new FormData();
        fd.append("audio", blob, `speech.${ext}`);
        const res = await fetch("/api/stt", { method: "POST", body: fd });
        if (!res.ok) { handlersRef.current?.onError?.(); return; }
        const { text } = await res.json();
        const clean = (text || "").trim();
        if (clean) handlersRef.current?.onFinal(clean);
        else handlersRef.current?.onEmpty?.();
      } catch {
        handlersRef.current?.onError?.();
      }
    };

    // Level meter → auto-stop on trailing silence or if nothing is ever said.
    try {
      const AC = (window as any).AudioContext || (window as any).webkitAudioContext;
      const ctx: AudioContext = new AC();
      ctxRef.current = ctx;
      ctx.resume().catch(() => {});
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 512;
      source.connect(analyser);
      const buf = new Uint8Array(analyser.frequencyBinCount);
      const startedAt = performance.now();
      let lastLoud = startedAt;

      const tick = () => {
        analyser.getByteTimeDomainData(buf);
        let sum = 0;
        for (let i = 0; i < buf.length; i++) { const v = (buf[i] - 128) / 128; sum += v * v; }
        const rms = Math.sqrt(sum / buf.length);
        const now = performance.now();
        if (rms > SPEECH_LEVEL) { lastLoud = now; heardRef.current = true; }

        if (heardRef.current) {
          if (now - lastLoud > TRAILING_SILENCE_MS) { stop(); return; }
        } else if (now - startedAt > NO_SPEECH_MS) {
          stop(); return;
        }
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    } catch {
      // If the analyser can't be built, we still record; the max-turn timer stops us.
    }

    try {
      rec.start();
    } catch {
      teardown();
      handlers.onError?.();
      return;
    }
    maxTimerRef.current = setTimeout(stop, MAX_TURN_MS);
    handlers.onStart?.();
  }, [stop, teardown]);

  return { start, stop, abort };
}
