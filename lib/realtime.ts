"use client";

import { useCallback, useRef, useState } from "react";

// useRealtimeTutor, connects the browser to OpenAI Realtime over WebRTC for
// live, streaming, speech-to-speech tutoring (no record→transcribe→TTS lag).
// start(kidId) mints an ephemeral token from /api/realtime-session, opens the
// mic, and negotiates the peer connection; the tutor's audio streams straight
// into an <audio> element. Server VAD handles turn-taking, so the kid just talks.

export type RealtimeStatus = "idle" | "connecting" | "live" | "error";

export function useRealtimeTutor() {
  const [status, setStatus] = useState<RealtimeStatus>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const stop = useCallback(() => {
    try { streamRef.current?.getTracks().forEach((t) => t.stop()); } catch { /**/ }
    streamRef.current = null;
    try { pcRef.current?.close(); } catch { /**/ }
    pcRef.current = null;
    if (audioRef.current) {
      try { audioRef.current.srcObject = null; audioRef.current.remove(); } catch { /**/ }
      audioRef.current = null;
    }
    setStatus("idle");
  }, []);

  const start = useCallback(async (kidId: string) => {
    setErrorMsg(null);
    setStatus("connecting");
    try {
      if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
        throw new Error("This device can't use the microphone here. Try Safari.");
      }

      // 1. Ephemeral token + model from our server.
      const tokRes = await fetch("/api/realtime-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kidId }),
      });
      if (!tokRes.ok) throw new Error("Couldn't start the voice session.");
      const { value, model } = await tokRes.json();
      if (!value) throw new Error("Voice session token missing.");

      // 2. Peer connection + remote audio playback.
      const pc = new RTCPeerConnection();
      pcRef.current = pc;

      const audio = document.createElement("audio");
      audio.autoplay = true;
      (audio as HTMLAudioElement & { playsInline?: boolean }).playsInline = true;
      audioRef.current = audio;
      pc.ontrack = (e) => {
        audio.srcObject = e.streams[0];
        audio.play?.().catch(() => { /* gesture already granted via start() */ });
      };

      pc.onconnectionstatechange = () => {
        const s = pc.connectionState;
        if (s === "connected") setStatus("live");
        else if (s === "failed" || s === "closed" || s === "disconnected") {
          setStatus((prev) => (prev === "idle" ? prev : "error"));
        }
      };

      // 3. Mic in.
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      stream.getTracks().forEach((t) => pc.addTrack(t, stream));

      // Events channel (kept open; server VAD drives turn-taking on its own).
      pc.createDataChannel("oai-events");

      // 4. SDP offer/answer with OpenAI.
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      const sdpRes = await fetch(`https://api.openai.com/v1/realtime/calls?model=${encodeURIComponent(model)}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${value}`, "Content-Type": "application/sdp" },
        body: offer.sdp ?? "",
      });
      if (!sdpRes.ok) throw new Error("Couldn't connect the voice session.");
      const answer = await sdpRes.text();
      await pc.setRemoteDescription({ type: "answer", sdp: answer });
      // status flips to "live" via onconnectionstatechange
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Voice session failed.";
      stop();
      setErrorMsg(msg);
      setStatus("error");
    }
  }, [stop]);

  return { status, errorMsg, start, stop };
}
