"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getWeeklyCurriculum } from "@/lib/weekly-curriculum";
import { useSTT } from "@/lib/stt";
import { OPENAI_VOICE, VOICE_INSTRUCTIONS } from "@/lib/tts";
import LiveTutor from "./LiveTutor";

// ── Types ─────────────────────────────────────────────────────────────────────
interface Message { role: "user" | "assistant"; content: string }

// Hands-free conversation guardrail: after this many kid turns Scout wraps up.
const MAX_CONVO_TURNS = 20;

export interface ScoutProfile {
  id: string;
  name: string;
  color: string;
  colorDark: string;
  soft: string;
  tutorName: string;
  tutorEmoji: string;
  uiSize?: "xlarge" | "large" | "normal";
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function persist(kidId: string, q: string, a: string) {
  try {
    const key = `scout-log-${kidId}`;
    const stored: { date: string; q: string; a: string }[] =
      JSON.parse(localStorage.getItem(key) ?? "[]");
    stored.push({ date: new Date().toISOString(), q, a });
    if (stored.length > 60) stored.splice(0, stored.length - 60);
    localStorage.setItem(key, JSON.stringify(stored));
  } catch { /**/ }
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function Scout({ profile }: { profile: ScoutProfile }) {
  const router = useRouter();
  const { id: kidId, name, color, colorDark, soft, tutorName, tutorEmoji, uiSize } = profile;

  const [messages,   setMessages]   = useState<Message[]>([]);
  const [listening,  setListening]  = useState(false);
  const [loading,    setLoading]    = useState(false);
  const [liveText,   setLiveText]   = useState("");   // interim speech text
  const [textInput,  setTextInput]  = useState("");
  const [showText,   setShowText]   = useState(false);
  const [muted,      setMuted]      = useState(false);
  const [greeted,    setGreeted]    = useState(false);
  // Realtime speech-to-speech is the DEFAULT experience (far lower latency, natural
  // turn-taking). If it can't connect, LiveTutor's "Go back" drops to the turn-based
  // tap-to-talk mode below as a fallback.
  const [showLive,   setShowLive]   = useState(true);

  const stt             = useSTT();
  const liveRef         = useRef("");
  const scrollRef       = useRef<HTMLDivElement>(null);
  const audioCtxRef     = useRef<AudioContext | null>(null);
  const audioUnlocked   = useRef(false);
  const currentSrcRef   = useRef<AudioBufferSourceNode | null>(null);
  const voice           = OPENAI_VOICE[kidId] ?? "onyx";
  // Hands-free conversation loop, callbacks fire from audio onended / rec events
  // long after the render that made them, so live values stay in refs.
  const [convoActive, setConvoActive] = useState(false);
  const convoRef    = useRef(false);
  const turnsRef    = useRef(0);
  const noSpeechRef = useRef(0);
  const mutedRef    = useRef(false);
  const resumeRef   = useRef<(() => void) | null>(null);

  // ── Auto-scroll ─────────────────────────────────────────────────────────────
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // ── Unlock AudioContext on first user gesture (iOS Safari requires this) ──────
  const unlockAudio = useCallback(() => {
    if (audioUnlocked.current || typeof window === "undefined") return;
    const AC = (window as any).AudioContext || (window as any).webkitAudioContext;
    if (!AC) return;
    const ctx = new AC() as AudioContext;
    audioCtxRef.current = ctx;
    ctx.resume().then(() => { audioUnlocked.current = true; });
  }, []);

  // ── TTS via OpenAI /api/tts ───────────────────────────────────────────────────
  const speak = useCallback(async (text: string) => {
    if (muted || typeof window === "undefined") return;
    currentSrcRef.current?.stop();
    currentSrcRef.current = null;

    try {
      const res = await fetch("/api/tts", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, voice, instructions: VOICE_INSTRUCTIONS[voice] }),
      });
      if (!res.ok) return;
      const arrayBuffer = await res.arrayBuffer();

      if (audioCtxRef.current) {
        const audioBuffer = await audioCtxRef.current.decodeAudioData(arrayBuffer);
        const source = audioCtxRef.current.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioCtxRef.current.destination);
        source.onended = () => resumeRef.current?.();
        currentSrcRef.current = source;
        source.start(0);
      } else {
        const blob = new Blob([arrayBuffer], { type: "audio/mpeg" });
        const url  = URL.createObjectURL(blob);
        const audio = new Audio(url);
        audio.onended = () => { URL.revokeObjectURL(url); resumeRef.current?.(); };
        audio.play().catch(() => {});
      }
    } catch { /* ignore TTS errors */ }
  }, [muted, voice]);

  // ── Send to API ───────────────────────────────────────────────────────────────
  const send = useCallback(async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: Message = { role: "user", content: text };
    const history = [...messages, userMsg];
    setMessages(history);
    setLiveText("");
    liveRef.current = "";
    setTextInput("");
    setLoading(true);

    try {
      const wk = typeof window !== "undefined" ? getWeeklyCurriculum() : null;
      const weekSummary = wk
        ? `${wk.weekLabel}, Catechism Q${wk.catechism.number}: ${wk.catechism.question} / Verse: ${wk.verse.reference} "${wk.verse.theme}"`
        : "";
      const res = await fetch("/api/kid-tutor", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kidId,
          subject: "scout",
          mode:    "scout",
          message: text,
          conversationHistory: messages.map(m => ({ role: m.role, content: m.content })),
          weeklyContentSummary: weekSummary,
        }),
      });
      if (!res.ok) {
        setMessages(prev => [...prev, { role: "assistant", content: "Something went wrong, try again!" }]);
        resumeRef.current?.();
        return;
      }
      const reply = await res.text();
      const aMsg: Message = { role: "assistant", content: reply };
      setMessages(prev => [...prev, aMsg]);
      // Muted: no audio means no onended, so resume the listen loop directly
      if (mutedRef.current) resumeRef.current?.();
      else speak(reply);
      if (text !== "[SYSTEM_GREET:scout]") persist(kidId, text, reply);
    } catch {
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: "Something went wrong, try again!" },
      ]);
      // Keep the conversation alive so the kid can just try again by talking
      resumeRef.current?.();
    } finally {
      setLoading(false);
    }
  }, [kidId, loading, messages, speak]);

  // ── Auto-greet (turn-based fallback only) ─────────────────────────────────────
  // Skipped while the live realtime overlay is up, so the two paths never talk over
  // each other. Fires if/when the kid drops back to the turn-based mode.
  useEffect(() => {
    if (showLive || greeted) return;
    setGreeted(true);
    send("[SYSTEM_GREET:scout]");
  }, [showLive]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Tap-to-talk (records the kid, transcribes via OpenAI Whisper) ─────────────
  // Uses /api/stt because Safari + the installed iPad PWA don't reliably support
  // the browser's SpeechRecognition API.
  function startListening() {
    if (typeof window === "undefined") return;
    unlockAudio();
    currentSrcRef.current?.stop();
    currentSrcRef.current = null;
    setLiveText("");
    liveRef.current = "";

    stt.start({
      onStart: () => setListening(true),
      onFinal: (text) => {
        setListening(false);
        noSpeechRef.current = 0;
        if (convoRef.current) turnsRef.current += 1;
        send(text);
      },
      onEmpty: () => {
        setListening(false);
        if (convoRef.current) {
          // Kid went quiet mid-conversation: nudge once (the nudge's audio onended
          // reopens the mic), then bow out silently on the second silence.
          noSpeechRef.current += 1;
          if (noSpeechRef.current === 1 && !mutedRef.current) {
            speak("Are you still there? I'm listening!");
          } else {
            convoRef.current = false;
            setConvoActive(false);
          }
        }
      },
      onError: () => {
        setListening(false);
        setShowText(true);
        convoRef.current = false;
        setConvoActive(false);
      },
    });
  }

  // Leaving the page kills the mic and audio, never a hot mic after navigation
  useEffect(() => () => {
    convoRef.current = false;
    stt.abort();
    try { currentSrcRef.current?.stop(); } catch { /* already stopped */ }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Conversation loop control ─────────────────────────────────────────────────
  function startConvo() {
    convoRef.current = true;
    turnsRef.current = 0;
    noSpeechRef.current = 0;
    setConvoActive(true);
    startListening();
  }

  function endConvo() {
    convoRef.current = false;
    setConvoActive(false);
    setListening(false);
    stt.abort();
    currentSrcRef.current?.stop();
    currentSrcRef.current = null;
  }

  // Keep the audio-onended callback pointing at a fresh closure (it fires long
  // after the render that created it). Runs every render on purpose.
  useEffect(() => {
    mutedRef.current = muted;
    resumeRef.current = () => {
      if (!convoRef.current) return;
      if (turnsRef.current >= MAX_CONVO_TURNS) {
        convoRef.current = false;
        setConvoActive(false);
        if (!mutedRef.current) speak("That was a great talk! Tap the button when you want to chat more!");
        return;
      }
      // Short breath between the tutor finishing and the mic reopening
      setTimeout(() => { if (convoRef.current) startListening(); }, 400);
    };
  });

  // ── Sizing ────────────────────────────────────────────────────────────────────
  const isXL      = uiSize === "xlarge";
  const isLarge   = uiSize === "large";
  const avatarSz  = isXL ? 110 : isLarge ? 90 : 76;
  const nameSz    = isXL ? 22  : isLarge ? 18 : 16;
  const msgSz     = isXL ? 20  : isLarge ? 17 : 15;
  const btnSz     = isXL ? 84  : isLarge ? 72 : 64;
  const btnFont   = isXL ? 36  : isLarge ? 30 : 26;

  // Back route
  function goBack() {
    // Truma's hub lives at /hub (her /kids/truma path has no index page)
    const base = kidId === "truma" ? "/hub" : `/kids/${kidId}/hub`;
    router.push(base);
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column",
      background: "var(--bg)" }}>

      {showLive && (
        <LiveTutor kidId={kidId} tutorName={tutorName} tutorEmoji={tutorEmoji}
          color={color} colorDark={colorDark} soft={soft}
          onClose={() => setShowLive(false)} />
      )}

      {/* ── Top bar ──────────────────────────────────────────────────────── */}
      <div style={{ display: "flex", alignItems: "center",
        justifyContent: "space-between", padding: "14px 18px",
        borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
        <button onClick={goBack}
          style={{ background: "none", border: "none", cursor: "pointer",
            fontFamily: "var(--font-body)", fontSize: 15, color: "var(--muted)",
            display: "flex", alignItems: "center", gap: 6, padding: "4px 8px", borderRadius: 8 }}>
          ← hub
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: 13,
            color: colorDark, letterSpacing: "0.12em", textTransform: "uppercase" }}>
            Scout
          </span>
          <span style={{ fontSize: 11, color: "var(--muted)",
            fontFamily: "var(--font-body)" }}>· {tutorName}</span>
        </div>

        <button onClick={() => { setMuted(m => !m); currentSrcRef.current?.stop(); currentSrcRef.current = null; }}
          style={{ background: "none", border: "none", cursor: "pointer",
            fontSize: 20, opacity: muted ? 0.35 : 1, padding: "4px 8px" }}
          title={muted ? "Unmute" : "Mute"}>
          {muted ? "🔇" : "🔊"}
        </button>
      </div>

      {/* ── Tutor avatar ─────────────────────────────────────────────────── */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center",
        paddingTop: 24, paddingBottom: 8, gap: 6 }}>
        <div style={{ width: avatarSz, height: avatarSz, borderRadius: "50%",
          background: soft, border: `3px solid ${color}33`,
          display: "grid", placeItems: "center", fontSize: avatarSz * 0.5,
          boxShadow: `0 4px 16px ${color}22` }}>
          {tutorEmoji}
        </div>
        <span style={{ fontFamily: "var(--font-body)", fontWeight: 600,
          fontSize: nameSz, color: colorDark }}>
          {tutorName}
        </span>
        <button onClick={() => setShowLive(true)}
          style={{ marginTop: 8, border: "none", borderRadius: 99, cursor: "pointer",
            padding: "10px 20px", background: color, color: "#fff",
            fontFamily: "var(--font-body)", fontWeight: 700, fontSize: 14,
            display: "inline-flex", alignItems: "center", gap: 8,
            boxShadow: `0 4px 14px ${color}44` }}>
          🔴 Talk Live
        </button>
      </div>

      {/* ── Conversation ──────────────────────────────────────────────────── */}
      <div style={{ flex: 1, overflowY: "auto", padding: "8px 20px 16px",
        display: "flex", flexDirection: "column", gap: 14, maxWidth: 720,
        width: "100%", margin: "0 auto" }}>

        {messages.map((m, i) => {
          const isUser = m.role === "user";
          if (isUser && m.content.startsWith("[SYSTEM_GREET")) return null;
          return (
            <div key={i} style={{ display: "flex",
              justifyContent: isUser ? "flex-end" : "flex-start" }}>
              <div style={{
                maxWidth: "82%",
                padding: isUser ? "11px 16px" : "14px 18px",
                borderRadius: isUser ? "18px 18px 4px 18px" : "4px 18px 18px 18px",
                background: isUser
                  ? `linear-gradient(135deg,${color},${colorDark})`
                  : soft,
                border: isUser ? "none" : `1px solid ${color}22`,
                fontFamily: isUser ? "var(--font-body)" : "var(--font-scripture)",
                fontStyle: isUser ? "normal" : "italic",
                fontSize: msgSz,
                color: isUser ? "#fff" : "var(--ink)",
                lineHeight: 1.6,
                boxShadow: isUser
                  ? `0 3px 10px ${color}33`
                  : "0 2px 8px rgba(0,0,0,0.05)",
              }}>
                {m.content}
              </div>
            </div>
          );
        })}

        {/* Loading dots */}
        {loading && (
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <div style={{ padding: "14px 20px", borderRadius: "4px 18px 18px 18px",
              background: soft, border: `1px solid ${color}22`,
              fontFamily: "var(--font-body)", fontSize: msgSz,
              color: "var(--muted)", fontStyle: "italic" }}>
              {tutorName} is thinking…
            </div>
          </div>
        )}

        {/* Live transcript while recording */}
        {listening && liveText && (
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <div style={{ maxWidth: "82%", padding: "11px 16px",
              borderRadius: "18px 18px 4px 18px",
              background: `${color}22`, border: `1.5px dashed ${color}66`,
              fontFamily: "var(--font-body)", fontSize: msgSz,
              color: colorDark, lineHeight: 1.6, fontStyle: "italic" }}>
              {liveText}
            </div>
          </div>
        )}

        <div ref={scrollRef} />
      </div>

      {/* ── Input area ────────────────────────────────────────────────────── */}
      <div style={{ padding: "16px 20px 32px", borderTop: "1px solid rgba(0,0,0,0.06)",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>

        {/* Big Talk button, tap once to start a hands-free conversation, tap again to stop */}
        <button
          onPointerDown={e => {
            e.preventDefault();
            unlockAudio();
            if (convoActive) endConvo();
            else if (!loading) startConvo();
          }}
          style={{
            width: btnSz * 1.7, height: btnSz,
            borderRadius: 99,
            border: "none",
            background: listening
              ? `linear-gradient(135deg,${colorDark},${colorDark}dd)`
              : convoActive
              ? `linear-gradient(135deg,${color}cc,${colorDark})`
              : loading
              ? "rgba(0,0,0,0.08)"
              : `linear-gradient(135deg,${color},${colorDark})`,
            cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
            fontFamily: "var(--font-body)", fontWeight: 700,
            fontSize: Math.round(btnFont * 0.55),
            color: !convoActive && loading ? "var(--muted)" : "#fff",
            boxShadow: listening
              ? `0 0 0 8px ${color}33, 0 8px 24px ${color}44`
              : `0 6px 20px ${color}44`,
            transform: listening ? "scale(1.04)" : "scale(1)",
            transition: "all .15s ease",
            WebkitUserSelect: "none",
            userSelect: "none",
            touchAction: "none",
          }}>
          <span style={{ fontSize: btnFont }}>
            {listening ? "🔴" : loading ? "⏳" : convoActive ? "🔊" : "🎙️"}
          </span>
          <span>
            {listening ? "Listening…" : loading ? "Thinking…" : convoActive ? "Talking… tap to stop" : "Tap to Talk"}
          </span>
        </button>

        {/* Text fallback */}
        {showText ? (
          <form
            onSubmit={e => { e.preventDefault(); send(textInput); }}
            style={{ display: "flex", gap: 8, width: "100%", maxWidth: 520 }}>
            <input
              value={textInput}
              onChange={e => setTextInput(e.target.value)}
              placeholder={`Ask ${tutorName} anything…`}
              disabled={loading}
              style={{ flex: 1, border: `1.5px solid ${color}44`, borderRadius: 14,
                padding: "13px 16px", fontSize: 16,
                fontFamily: "var(--font-body)", color: "var(--ink)",
                background: "var(--bg)", outline: "none" }}
            />
            <button type="submit" disabled={!textInput.trim() || loading}
              style={{ padding: "13px 20px", borderRadius: 14, border: "none",
                background: `linear-gradient(135deg,${color},${colorDark})`,
                color: "#fff", fontFamily: "var(--font-body)", fontWeight: 700,
                fontSize: 15, cursor: "pointer",
                opacity: (!textInput.trim() || loading) ? 0.4 : 1 }}>
              →
            </button>
          </form>
        ) : (
          <button onClick={() => setShowText(true)}
            style={{ background: "none", border: "none", cursor: "pointer",
              fontFamily: "var(--font-body)", fontSize: 13, color: "var(--muted)",
              textDecoration: "underline", padding: "2px 8px" }}>
            type instead
          </button>
        )}
      </div>
    </div>
  );
}
