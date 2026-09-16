"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { getWeeklyCurriculum } from "@/lib/weekly-curriculum";
import { syncWeeklyCurriculum } from "@/lib/weekly-sync";
import { useSTT } from "@/lib/stt";
import { VOICE_INSTRUCTIONS } from "@/lib/tts";

// ── Per-kid tutor config ──────────────────────────────────────────────────────

const TUTOR_CONFIG = {
  titus: { name: "Buck",            emoji: "🦌", color: "#6B7A45", voice: "ash"     },
  mercy: { name: "Princess Rose",   emoji: "🌹", color: "#A86A78", voice: "coral"   },
  lois:  { name: "Princess Crystal",emoji: "❄️", color: "#8A6A92", voice: "shimmer" },
  truma: { name: "Lydia",           emoji: "🪻", color: "#0BABB9", voice: "nova"    },
} as const;

// ── Per-kid interaction mode ──────────────────────────────────────────────────
// voice   → (legacy, no kid uses it by default): preset tap buttons only, always-on TTS
// guided  → Lois / Mercy / Titus: preset buttons + mic, auto-TTS, no keyboard
// chat    → Truma: text chat with optional mic + read-aloud toggle
// Guided + chat both support hands-free conversation via the Talk toggle.

const TUTOR_MODES = {
  lois:  "guided", // JM 2026-07-02: promoted from voice-only so she can talk with Princess Crystal
  mercy: "guided",
  titus: "guided", // ADHD + limited typing → preset buttons + mic
  truma: "chat",
} as const;

type TutorMode = "voice" | "guided" | "chat";
type KidId = keyof typeof TUTOR_CONFIG;

// ── Preset tap buttons ────────────────────────────────────────────────────────

interface Preset { emoji: string; label: string; msg: string }

const VOICE_PRESETS: Preset[] = [
  { emoji: "🤔", label: "Huh?",    msg: "I don't understand! Explain this to me like I'm 3 years old. Only 2 sentences!" },
  { emoji: "🔁", label: "Again!",  msg: "Say that again but even simpler and more fun for a tiny kid!" },
  { emoji: "❓", label: "Help!",   msg: "Help me! I don't know the answer. Give me just one tiny little clue!" },
  { emoji: "🎉", label: "Yay!",    msg: "I got the right answer! Celebrate with me in 2 very excited sentences!" },
];

// Mercy's guided presets, garden/flower energy
const MERCY_GUIDED_PRESETS: Preset[] = [
  { emoji: "🙋", label: "Help me!",       msg: "I need help understanding this question. Can you explain it more simply?" },
  { emoji: "🔁", label: "Say again",      msg: "Can you explain that again in a simpler way for a Kindergartner?" },
  { emoji: "📖", label: "Tell me more",   msg: "Tell me more about this in a way I can understand!" },
  { emoji: "😕", label: "I don't get it", msg: "I really don't understand. Give me one small hint without telling me the answer." },
  { emoji: "🌸", label: "I got it!",      msg: "I got the right answer! I am so proud! Say something wonderful!" },
];

// Lois's guided presets, age 3, tiny-kid phrasing, princess energy
const LOIS_GUIDED_PRESETS: Preset[] = [
  { emoji: "🤔", label: "Huh?",    msg: "I don't understand! Explain this to me like I'm 3 years old. Only 2 sentences!" },
  { emoji: "🔁", label: "Again!",  msg: "Say that again but even simpler and more fun for a tiny kid!" },
  { emoji: "❓", label: "Help!",   msg: "Help me! I don't know the answer. Give me just one tiny little clue!" },
  { emoji: "🎉", label: "Yay!",    msg: "I got the right answer! Celebrate with me in 2 very excited sentences!" },
];

// Titus's guided presets, hunter/fisherman energy, Reformed Baptist
const TITUS_GUIDED_PRESETS: Preset[] = [
  { emoji: "🦌", label: "Help, Buck!",     msg: "Buck, I need help! Can you explain this like we're out hunting or fishing? Keep it simple." },
  { emoji: "🔁", label: "Say again",       msg: "Can you explain that again? Maybe put it in hunting or fishing terms!" },
  { emoji: "💡", label: "Give a clue",     msg: "Give me one small clue without telling me the answer. Outdoorsman style!" },
  { emoji: "🤔", label: "Why is that?",    msg: "Why is that the right answer? Help me understand the reason." },
  { emoji: "🏆", label: "I got it!",       msg: "YEAH! I got it! Celebrate with me, Buck! Reformed Baptist outdoorsman style!" },
];

interface Message { role: "user" | "assistant"; content: string }

// Hands-free conversation guardrail: after this many kid turns the tutor wraps up.
const MAX_CONVO_TURNS = 20;

interface FloatingTutorProps {
  kidId: string;
  subject?: string;
  autoGreet?: boolean;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function FloatingTutor({ kidId, subject, autoGreet }: FloatingTutorProps) {
  const config   = TUTOR_CONFIG[kidId as KidId] ?? TUTOR_CONFIG.titus;
  // Widened cast: no kid maps to "voice" today, but the voice-mode render below stays
  // available as a fallback, so keep the full TutorMode union alive for comparisons.
  const mode = (TUTOR_MODES[kidId as KidId] ?? "chat") as TutorMode;
  // Pick the right preset buttons for guided mode
  const guidedPresets =
    kidId === "titus" ? TITUS_GUIDED_PRESETS :
    kidId === "lois"  ? LOIS_GUIDED_PRESETS :
    MERCY_GUIDED_PRESETS;

  const [isOpen,    setIsOpen]    = useState(false);
  const [messages,  setMessages]  = useState<Message[]>([]);
  const [input,     setInput]     = useState("");
  const [loading,   setLoading]   = useState(false);
  // voice/guided always have TTS on; chat defaults off
  const [readAloud, setReadAloud] = useState<boolean>(mode !== "chat");
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking,  setIsSpeaking]  = useState(false);
  const [weeklyContentSummary, setWeeklyContentSummary] = useState<string>("");
  const [greetFired, setGreetFired] = useState(false);
  const [lastReply,  setLastReply]  = useState<string>(""); // for re-play in voice mode
  // hasMicSupport drives conditional render of the mic button, ref changes don't trigger re-renders
  const [hasMicSupport, setHasMicSupport] = useState(false);
  const [micError,      setMicError]      = useState<string | null>(null);
  // Conversation mode, hands-free loop: tutor speaks → mic auto-opens → kid talks → repeat
  const [convoActive, setConvoActive] = useState(false);

  const messagesEndRef  = useRef<HTMLDivElement | null>(null);
  const inputRef        = useRef<HTMLInputElement | null>(null);
  const stt             = useSTT();
  // sendMessageRef always points to the latest sendMessage, avoids stale closure in rec.onresult
  const sendMessageRef  = useRef<((text: string, hidden?: boolean) => void) | null>(null);
  const greetTimerRef   = useRef<ReturnType<typeof setTimeout> | null>(null);
  // iOS Safari requires AudioContext.resume() inside a user-gesture handler.
  // Once unlocked, async fetch+play calls work fine.
  const audioCtxRef     = useRef<AudioContext | null>(null);
  const audioUnlocked   = useRef(false);
  const currentSourceRef = useRef<AudioBufferSourceNode | null>(null);
  // Conversation-loop refs, callbacks fired from audio onended / rec events must not
  // capture stale state, so the live values live in refs (same pattern as sendMessageRef).
  const convoRef        = useRef(false);           // is conversation mode on right now
  const convoTurnsRef   = useRef(0);               // kid turns this conversation
  const noSpeechRef     = useRef(0);               // consecutive silent listens
  const resumeListenRef = useRef<(() => void) | null>(null); // latest maybeResumeListening
  const speakRef        = useRef<((text: string) => void) | null>(null); // latest speak()

  // ── Weekly curriculum summary ───────────────────────────────────────────────

  useEffect(() => {
    if (typeof window === "undefined") return;
    const build = (curriculum: ReturnType<typeof getWeeklyCurriculum>) =>
      setWeeklyContentSummary([
        `Week: ${curriculum.weekLabel}`,
        `Catechism Q${curriculum.catechism.number}: "${curriculum.catechism.question}", "${curriculum.catechism.answer}" (${curriculum.catechism.reference})`,
        `Memory Verse: ${curriculum.verse.text}, ${curriculum.verse.reference}`,
        `Hymn: "${curriculum.hymn.title}" by ${curriculum.hymn.author}`,
        `Character Trait: ${curriculum.character.trait}, ${curriculum.character.kidFriendly}`,
      ].join("\n"));
    build(getWeeklyCurriculum());
    // Auto-refresh from the church pipeline (throttled; server blob-cached per week)
    syncWeeklyCurriculum().then((fresh) => { if (fresh) build(fresh); });
  }, []);

  // ── Mic support ─────────────────────────────────────────────────────────────
  // Voice input records the kid and transcribes via /api/stt (OpenAI Whisper).
  // We no longer use the browser SpeechRecognition API, it fails in Safari and
  // in the installed iPad PWA. All we detect here is whether we can record.

  useEffect(() => {
    if (typeof window === "undefined") return;
    const ok = !!navigator.mediaDevices?.getUserMedia && typeof MediaRecorder !== "undefined";
    setHasMicSupport(ok);
  }, []);

  // ── Auto-greet ──────────────────────────────────────────────────────────────

  useEffect(() => {
    // Bible pages auto-greet for all modes
    if (!autoGreet || subject !== "bible" || greetFired) return;
    greetTimerRef.current = setTimeout(() => {
      setIsOpen(true);
      setGreetFired(true);
      sendMessage("[SYSTEM_GREET_BIBLE]", true);
    }, 1200);
    return () => { if (greetTimerRef.current) clearTimeout(greetTimerRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoGreet, subject, greetFired, weeklyContentSummary]);

  // ── Voice mode: auto-open on mount and greet ────────────────────────────────

  useEffect(() => {
    if (mode !== "voice" || greetFired) return;
    greetTimerRef.current = setTimeout(() => {
      setIsOpen(true);
      setGreetFired(true);
      sendMessage("[SYSTEM_GREET_VOICE]", true);
    }, 1800);
    return () => { if (greetTimerRef.current) clearTimeout(greetTimerRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, greetFired]);

  // ── Scroll to bottom ────────────────────────────────────────────────────────

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // ── Focus text input when chat opens ───────────────────────────────────────

  useEffect(() => {
    if (isOpen && mode === "chat") {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen, mode]);

  // ── OpenAI TTS (iOS-safe via AudioContext) ─────────────────────────────────
  // iOS Safari blocks audio from async callbacks unless AudioContext was resumed
  // inside a prior user-gesture. unlockAudio() does that resume on first tap;
  // all subsequent speak() calls (even from fetch .then()) work fine.

  const speak = useCallback(
    async (text: string) => {
      if (typeof window === "undefined") return;
      currentSourceRef.current?.stop();
      currentSourceRef.current = null;
      setIsSpeaking(false);

      try {
        const res = await fetch("/api/tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, voice: config.voice, instructions: VOICE_INSTRUCTIONS[config.voice] }),
        });
        if (!res.ok) return;

        const arrayBuffer = await res.arrayBuffer();

        if (audioCtxRef.current) {
          const audioBuffer = await audioCtxRef.current.decodeAudioData(arrayBuffer);
          const source = audioCtxRef.current.createBufferSource();
          source.buffer = audioBuffer;
          source.connect(audioCtxRef.current.destination);
          source.onended = () => { setIsSpeaking(false); resumeListenRef.current?.(); };
          currentSourceRef.current = source;
          setIsSpeaking(true);
          source.start(0);
        } else {
          // Non-iOS fallback
          const blob = new Blob([arrayBuffer], { type: "audio/mpeg" });
          const url = URL.createObjectURL(blob);
          const audio = new Audio(url);
          audio.onended = () => { setIsSpeaking(false); URL.revokeObjectURL(url); resumeListenRef.current?.(); };
          setIsSpeaking(true);
          audio.play().catch(() => setIsSpeaking(false));
        }
      } catch {
        setIsSpeaking(false);
      }
    },
    [config.voice]
  );

  // Called inside pointerDown handlers to unlock iOS AudioContext on first gesture
  const unlockAudio = useCallback(() => {
    if (audioUnlocked.current || typeof window === "undefined") return;
    const AC = (window as any).AudioContext || (window as any).webkitAudioContext;
    if (!AC) return;
    const ctx = new AC() as AudioContext;
    audioCtxRef.current = ctx;
    ctx.resume().then(() => { audioUnlocked.current = true; });
  }, []);

  // Replay last response
  const replayLast = useCallback(() => {
    if (lastReply) speak(lastReply);
  }, [lastReply, speak]);

  // ── Send message ────────────────────────────────────────────────────────────

  const sendMessage = useCallback(
    async (text: string, hidden = false) => {
      const trimmed = text.trim();
      if (!trimmed || loading) return;

      const userMsg: Message = { role: "user", content: trimmed };
      const newHistory = hidden ? [...messages] : [...messages, userMsg];
      if (!hidden) setMessages(newHistory);
      setInput("");
      setLoading(true);

      const historyForApi = newHistory.map((m) => ({ role: m.role, content: m.content }));
      if (hidden) historyForApi.push({ role: "user", content: trimmed });

      try {
        const res = await fetch("/api/kid-tutor", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            kidId,
            message: trimmed,
            subject,
            weeklyContentSummary,
            conversationHistory: historyForApi.slice(0, -1),
          }),
        });
        if (!res.ok) throw new Error("API error");

        const responseText = await res.text();
        const assistantMsg: Message = { role: "assistant", content: responseText };

        // Voice mode: only keep the last exchange visible
        if (mode === "voice") {
          setMessages(hidden ? [assistantMsg] : [userMsg, assistantMsg]);
        } else {
          setMessages((prev) => [...prev, assistantMsg]);
        }

        setLastReply(responseText);
        // convoRef: in conversation mode the reply must be spoken or the listen loop never resumes
        if (readAloud || mode === "voice" || mode === "guided" || convoRef.current) speak(responseText);
      } catch {
        const errMsg = mode === "voice"
          ? "Oops! Try again! 😊"
          : "Oops, I had trouble connecting! Try again? 😊";
        const msg: Message = { role: "assistant", content: errMsg };
        if (mode === "voice") {
          setMessages([msg]);
        } else {
          setMessages((prev) => [...prev, msg]);
        }
        if (mode === "voice" || mode === "guided" || convoRef.current) speak(errMsg);
      } finally {
        setLoading(false);
      }
    },
    [loading, messages, kidId, subject, weeklyContentSummary, readAloud, speak, mode]
  );

  // Keep sendMessageRef in sync, placed after sendMessage declaration so TS doesn't flag forward ref
  // This must come after the sendMessage useCallback above
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { sendMessageRef.current = sendMessage; }, [sendMessage]);

  // ── Input handlers (chat mode) ──────────────────────────────────────────────

  const handleSend = () => { if (input.trim()) sendMessage(input); };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  // ── Mic toggle ──────────────────────────────────────────────────────────────

  const startListening = () => {
    if (isListening) return;
    setMicError(null);
    stt.start({
      onStart: () => setIsListening(true),
      onFinal: (transcript) => {
        setIsListening(false);
        noSpeechRef.current = 0;
        if (convoRef.current) convoTurnsRef.current += 1;
        if (mode === "guided" || convoRef.current) {
          // Use ref so we always call the current sendMessage, not a stale closure version
          sendMessageRef.current?.(transcript);
        } else {
          setInput(transcript);
        }
      },
      onEmpty: () => {
        setIsListening(false);
        if (convoRef.current) {
          // Kid went quiet mid-conversation: nudge once (the nudge's audio onended
          // reopens the mic), then bow out silently on the second silence.
          noSpeechRef.current += 1;
          if (noSpeechRef.current === 1) {
            speakRef.current?.("Are you still there? I'm listening!");
          } else {
            convoRef.current = false;
            setConvoActive(false);
          }
        }
      },
      onError: () => {
        setIsListening(false);
        setMicError("Microphone access was denied. Check your browser/OS settings.");
        convoRef.current = false;
        setConvoActive(false);
      },
    });
  };

  const endConvo = () => {
    convoRef.current = false;
    setConvoActive(false);
    stt.abort();
    setIsListening(false);
  };

  const startConvo = () => {
    convoRef.current = true;
    convoTurnsRef.current = 0;
    noSpeechRef.current = 0;
    setConvoActive(true);
    startListening();
  };

  // Keep the audio-onended callbacks pointing at fresh closures (they fire long
  // after the render that created them). Runs every render on purpose.
  useEffect(() => {
    speakRef.current = speak;
    resumeListenRef.current = () => {
      if (!convoRef.current) return;
      if (convoTurnsRef.current >= MAX_CONVO_TURNS) {
        convoRef.current = false;
        setConvoActive(false);
        speak("That was a great talk! Tap Talk when you want to chat with me again!");
        return;
      }
      // Short breath between the tutor finishing and the mic reopening
      setTimeout(() => { if (convoRef.current) startListening(); }, 400);
    };
  });

  // Closing the tutor panel always ends the conversation, no hot mic behind a closed window
  useEffect(() => {
    if (!isOpen && convoRef.current) {
      convoRef.current = false;
      setConvoActive(false);
      stt.abort();
      setIsListening(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Unmount (page navigation) kills the mic and audio, never a hot mic left behind
  useEffect(() => () => {
    convoRef.current = false;
    stt.abort();
    try { currentSourceRef.current?.stop(); } catch { /* already stopped */ }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Lois can't read, opening her tutor goes straight into hands-free conversation:
  // spoken greeting, then the mic auto-opens (the greeting's audio onended fires resumeListenRef).
  const autoConvo = kidId === "lois" || kidId === "mercy";
  useEffect(() => {
    if (!isOpen || !autoConvo || convoRef.current) return;
    convoRef.current = true;
    convoTurnsRef.current = 0;
    noSpeechRef.current = 0;
    setConvoActive(true);
    sendMessageRef.current?.(
      `[SYSTEM CONTEXT: The child just tapped your button to talk with you out loud. Greet her by name as ${config.name} in 2 very short, joyful sentences and ask one tiny easy question to start a chat.]`,
      true
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, autoConvo]);

  const toggleMic = () => {
    if (!hasMicSupport) return;
    if (isListening) {
      // Manually stopping mid-recording sends what was captured, then exits convo mode.
      convoRef.current = false;
      setConvoActive(false);
      stt.stop();
    } else {
      startListening();
    }
  };

  const clearChat = () => {
    setMessages([]);
    setLastReply("");
    currentSourceRef.current?.stop(); currentSourceRef.current = null;
    setIsSpeaking(false);
  };

  // ── Shared styles ───────────────────────────────────────────────────────────

  const shadow = `0 8px 40px ${config.color}40, 0 2px 12px rgba(0,0,0,0.15)`;
  const headerGrad = `linear-gradient(135deg, ${config.color}, ${config.color}cc)`;

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER: VOICE MODE (Lois, can't read, everything is voice + big tap targets)
  // ═══════════════════════════════════════════════════════════════════════════

  if (mode === "voice") {
    const lastMsg = messages.filter((m) => m.role === "assistant").slice(-1)[0];

    return (
      <>
        {isOpen && (
          <div style={{
            position: "fixed", bottom: 100, right: 16,
            width: 300,
            background: "#ffffff",
            borderRadius: 24,
            boxShadow: shadow,
            border: `2px solid ${config.color}30`,
            display: "flex", flexDirection: "column",
            zIndex: 9998, overflow: "hidden",
          }}>
            {/* Header */}
            <div style={{ background: headerGrad, padding: "14px 16px", display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 26 }}>{config.emoji}</span>
              <span style={{ color: "white", fontWeight: 900, fontSize: 17, flex: 1 }}>{config.name}!</span>
              {isSpeaking && (
                <span style={{ color: "rgba(255,255,255,0.9)", fontSize: 13, fontWeight: 700, animation: "pulse 1s infinite" }}>
                  🔊 listening…
                </span>
              )}
              <button onClick={() => setIsOpen(false)} style={{
                background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 8,
                padding: "4px 10px", cursor: "pointer", color: "white", fontSize: 18, fontWeight: 900, lineHeight: 1,
              }}>×</button>
            </div>

            {/* Response bubble */}
            <div style={{ padding: "16px 16px 8px", minHeight: 72 }}>
              {loading ? (
                <div style={{ display: "flex", gap: 6, justifyContent: "center", padding: "12px 0" }}>
                  {["", "0.2s", "0.4s"].map((d, i) => (
                    <span key={i} style={{ width: 12, height: 12, borderRadius: "50%", background: config.color, display: "inline-block", animation: `voiceDot 1s infinite ${d}` }} />
                  ))}
                </div>
              ) : lastMsg ? (
                <div style={{
                  background: `${config.color}12`,
                  borderRadius: 16,
                  padding: "12px 14px",
                  fontSize: 18,
                  fontWeight: 700,
                  color: "#1f2937",
                  lineHeight: 1.45,
                  textAlign: "center",
                }}>
                  {lastMsg.content}
                </div>
              ) : (
                <div style={{ textAlign: "center", color: "#9ca3af", fontSize: 16, padding: "8px 0" }}>
                  {config.emoji} Tap a button!
                </div>
              )}
            </div>

            {/* Replay button */}
            {lastReply && !loading && (
              <div style={{ padding: "0 16px 8px", textAlign: "center" }}>
                <button
                  onPointerDown={() => { unlockAudio(); replayLast(); }}
                  onClick={(e) => e.preventDefault()}
                  style={{
                    background: `${config.color}18`,
                    border: `1.5px solid ${config.color}40`,
                    borderRadius: 20, padding: "6px 20px",
                    fontSize: 15, fontWeight: 700, color: config.color, cursor: "pointer",
                  }}>
                  🔁 Say it again
                </button>
              </div>
            )}

            {/* Big preset tap buttons, 2×2 grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, padding: "8px 14px 16px" }}>
              {VOICE_PRESETS.map((p) => (
                <button
                  key={p.label}
                  // iOS Safari: move action to onPointerDown so speak() fires inside a gesture handler
                  onPointerDown={(e) => {
                    if (loading) return;
                    unlockAudio();
                    (e.currentTarget as HTMLButtonElement).style.transform = "scale(0.93)";
                    sendMessage(p.msg);
                  }}
                  onPointerUp={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; }}
                  onPointerLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; }}
                  // Keep onClick as no-op to prevent double-firing on desktop
                  onClick={(e) => e.preventDefault()}
                  disabled={loading}
                  style={{
                    background: loading ? "#f3f4f6" : `${config.color}18`,
                    border: `2px solid ${loading ? "#e5e7eb" : config.color + "50"}`,
                    borderRadius: 18,
                    // ≥ 80px tall for Lois's tiny fingers
                    minHeight: 80,
                    padding: "14px 8px",
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 5,
                    cursor: loading ? "not-allowed" : "pointer",
                    transition: "transform 0.1s, background 0.15s",
                  }}
                >
                  <span style={{ fontSize: 32 }}>{p.emoji}</span>
                  <span style={{ fontSize: 15, fontWeight: 800, color: loading ? "#9ca3af" : config.color }}>{p.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Float button, big + touch-friendly */}
        <button
          onClick={() => setIsOpen((v) => !v)}
          aria-label={`${config.name} is here to help!`}
          style={{
            position: "fixed", bottom: 24, right: 20,
            width: 72, height: 72, borderRadius: "50%",
            background: headerGrad, border: "none", cursor: "pointer",
            fontSize: 32, zIndex: 9999,
            boxShadow: `0 4px 20px ${config.color}60, 0 2px 8px rgba(0,0,0,0.2)`,
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "transform 0.15s",
          }}
          onPointerDown={(e) => {
            unlockAudio(); // iOS: satisfy user-gesture requirement for TTS
            (e.currentTarget as HTMLButtonElement).style.transform = "scale(0.92)";
          }}
          onPointerUp={(e)   => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; }}
          onPointerLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; }}
        >
          {config.emoji}
          {/* Pulsing ring */}
          {!isOpen && (
            <span style={{
              position: "absolute", inset: -5, borderRadius: "50%",
              border: `3px solid ${config.color}`,
              animation: "tutorRing 2s ease-out infinite", pointerEvents: "none",
            }} />
          )}
        </button>

        <style>{`
          @keyframes voiceDot { 0%,100%{opacity:0.3;transform:scale(0.8)} 50%{opacity:1;transform:scale(1.1)} }
          @keyframes tutorRing { 0%{transform:scale(1);opacity:0.7} 100%{transform:scale(1.6);opacity:0} }
          @keyframes pulse { 0%,100%{opacity:0.7} 50%{opacity:1} }
        `}</style>
      </>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER: GUIDED MODE (Mercy, barely reads, preset buttons + mic, auto-TTS)
  // ═══════════════════════════════════════════════════════════════════════════

  if (mode === "guided") {
    return (
      <>
        {isOpen && (
          <div style={{
            position: "fixed", bottom: 100, right: 16,
            width: 340, maxHeight: 560,
            background: "#ffffff",
            borderRadius: 22,
            boxShadow: shadow,
            border: `2px solid ${config.color}30`,
            display: "flex", flexDirection: "column",
            zIndex: 9998, overflow: "hidden",
          }}>
            {/* Header */}
            <div style={{ background: headerGrad, padding: "12px 16px", display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
              <span style={{ fontSize: 22 }}>{config.emoji}</span>
              <span style={{ color: "white", fontWeight: 900, fontSize: 15, flex: 1 }}>{config.name}</span>
              {isSpeaking && <span style={{ color: "rgba(255,255,255,0.9)", fontSize: 12, fontWeight: 700 }}>🔊</span>}
              <button onClick={clearChat} style={{ background: "rgba(255,255,255,0.18)", border: "none", borderRadius: 8, padding: "4px 9px", cursor: "pointer", color: "white", fontSize: 12, fontWeight: 700 }}>Clear</button>
              <button onClick={() => setIsOpen(false)} style={{ background: "rgba(255,255,255,0.18)", border: "none", borderRadius: 8, padding: "4px 9px", cursor: "pointer", color: "white", fontSize: 16, fontWeight: 900, lineHeight: 1 }}>×</button>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: "auto", padding: "12px 14px", display: "flex", flexDirection: "column", gap: 8, minHeight: 0 }}>
              {messages.length === 0 && !loading && (
                <div style={{ textAlign: "center", color: "#9ca3af", fontSize: 15, paddingTop: 20 }}>
                  {config.emoji} Tap a button below to ask {config.name}!
                </div>
              )}
              {messages.map((msg, i) => (
                <div key={i} style={{
                  alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                  maxWidth: "90%",
                  background: msg.role === "user" ? `linear-gradient(135deg,${config.color},${config.color}cc)` : "#f3f4f6",
                  color: msg.role === "user" ? "white" : "#1f2937",
                  padding: "10px 14px",
                  borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                  fontSize: 15,
                  fontWeight: 600,
                  lineHeight: 1.5,
                  boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                }}>
                  {msg.content}
                </div>
              ))}
              {loading && (
                <div style={{ alignSelf: "flex-start", background: "#f3f4f6", padding: "10px 16px", borderRadius: "18px 18px 18px 4px" }}>
                  <span style={{ fontSize: 20, letterSpacing: 3 }}>
                    {["●","●","●"].map((d, i) => <span key={i} style={{ animation: `voiceDot 1s infinite ${i*0.2}s` }}>{d}</span>)}
                  </span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Preset buttons */}
            <div style={{ borderTop: `1px solid ${config.color}20`, padding: "10px 12px 6px", display: "flex", flexDirection: "column", gap: 7, flexShrink: 0, background: "#fafafa" }}>
              {guidedPresets.map((p) => (
                <button
                  key={p.label}
                  // iOS Safari: fire action in onPointerDown (a user gesture) so TTS works
                  onPointerDown={(e) => {
                    if (loading) return;
                    unlockAudio();
                    (e.currentTarget as HTMLButtonElement).style.background = `${config.color}18`;
                    sendMessage(p.msg);
                  }}
                  onPointerUp={(e)   => { (e.currentTarget as HTMLButtonElement).style.background = "#ffffff"; }}
                  onPointerLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#ffffff"; }}
                  onClick={(e) => e.preventDefault()}
                  disabled={loading}
                  style={{
                    background: loading ? "#f3f4f6" : "#ffffff",
                    border: `2px solid ${loading ? "#e5e7eb" : config.color + "40"}`,
                    borderRadius: 14,
                    minHeight: 56,
                    padding: "10px 14px",
                    display: "flex", alignItems: "center", gap: 10,
                    cursor: loading ? "not-allowed" : "pointer",
                    textAlign: "left", transition: "background 0.12s",
                  }}
                >
                  <span style={{ fontSize: 20 }}>{p.emoji}</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: loading ? "#9ca3af" : "#1f2937" }}>{p.label}</span>
                </button>
              ))}
            </div>

            {/* Mic row, hasMicSupport drives visibility (ref changes don't re-render) */}
            {hasMicSupport && (
              <div style={{ padding: "8px 12px 12px", background: "#fafafa", borderTop: `1px solid ${config.color}10`, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <div style={{ display: "flex", gap: 8 }}>
                  {!convoActive && (
                    <button
                      onPointerDown={toggleMic}
                      onClick={(e) => e.preventDefault()}
                      style={{
                        background: isListening ? "#ef4444" : `${config.color}20`,
                        border: `2px solid ${isListening ? "#ef4444" : config.color + "50"}`,
                        borderRadius: 24, padding: "10px 24px",
                        cursor: "pointer", fontSize: 20, fontWeight: 700,
                        color: isListening ? "white" : config.color,
                        display: "flex", alignItems: "center", gap: 8,
                        transition: "all 0.15s",
                      }}
                    >
                      {isListening ? "⏹ Stop" : "🎤 Speak"}
                    </button>
                  )}
                  {/* Hands-free conversation toggle */}
                  <button
                    onPointerDown={() => { unlockAudio(); if (convoActive) { endConvo(); } else { startConvo(); } }}
                    onClick={(e) => e.preventDefault()}
                    style={{
                      background: convoActive ? "#ef4444" : config.color,
                      border: `2px solid ${convoActive ? "#ef4444" : config.color}`,
                      borderRadius: 24, padding: "10px 24px",
                      cursor: "pointer", fontSize: 20, fontWeight: 700,
                      color: "white",
                      display: "flex", alignItems: "center", gap: 8,
                      transition: "all 0.15s",
                    }}
                  >
                    {convoActive ? "⏹ Stop talking" : "🗣️ Talk"}
                  </button>
                </div>
                {convoActive && (
                  <div style={{ fontSize: 13, fontWeight: 700, color: config.color, animation: "pulse 1s infinite" }}>
                    {isSpeaking ? `🔊 ${config.name} is talking…` : isListening ? "🎙️ Listening, just talk!" : loading ? "💭 Thinking…" : "🎙️ Talk whenever you're ready!"}
                  </div>
                )}
                {micError && (
                  <div style={{ fontSize: 12, color: "#b91c1c", textAlign: "center", fontWeight: 600 }}>
                    {micError}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Float button */}
        <button
          onClick={() => setIsOpen((v) => !v)}
          aria-label={`${config.name} is here to help!`}
          style={{
            position: "fixed", bottom: 24, right: 20,
            width: 68, height: 68, borderRadius: "50%",
            background: headerGrad, border: "none", cursor: "pointer",
            fontSize: 30, zIndex: 9999,
            boxShadow: `0 4px 20px ${config.color}60, 0 2px 8px rgba(0,0,0,0.2)`,
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "transform 0.15s",
          }}
          onPointerDown={(e) => {
            unlockAudio(); // iOS TTS unlock
            (e.currentTarget as HTMLButtonElement).style.transform = "scale(0.92)";
          }}
          onPointerUp={(e)   => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; }}
          onPointerLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; }}
        >
          {config.emoji}
          {autoGreet && !isOpen && (
            <span style={{ position: "absolute", inset: -4, borderRadius: "50%", border: `3px solid ${config.color}`, animation: "tutorRing 1.5s ease-out infinite", pointerEvents: "none" }} />
          )}
        </button>

        <style>{`
          @keyframes voiceDot { 0%,100%{opacity:0.3} 50%{opacity:1} }
          @keyframes tutorRing { 0%{transform:scale(1);opacity:0.8} 100%{transform:scale(1.5);opacity:0} }
          @keyframes pulse { 0%,100%{opacity:0.7} 50%{opacity:1} }
        `}</style>
      </>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER: CHAT MODE (Titus / Truma, can read, full text + optional mic/TTS)
  // ═══════════════════════════════════════════════════════════════════════════

  return (
    <>
      {isOpen && (
        <div style={{
          position: "fixed", bottom: 100, right: 24,
          width: 360, maxHeight: 480,
          background: "#ffffff",
          borderRadius: 20,
          boxShadow: shadow,
          border: `2px solid ${config.color}30`,
          display: "flex", flexDirection: "column",
          zIndex: 9998, overflow: "hidden",
        }}>
          {/* Header */}
          <div style={{ background: headerGrad, padding: "12px 16px", display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            <span style={{ fontSize: 22 }}>{config.emoji}</span>
            <span style={{ color: "white", fontWeight: 900, fontSize: 15, flex: 1 }}>{config.name}</span>

            <button onClick={() => setReadAloud((v) => !v)} style={{ background: readAloud ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.15)", border: "none", borderRadius: 8, padding: "4px 8px", cursor: "pointer", color: "white", fontSize: 14, fontWeight: 700 }}>
              {readAloud ? "🔊" : "🔇"}
            </button>
            <button onClick={clearChat} style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: 8, padding: "4px 8px", cursor: "pointer", color: "white", fontSize: 13, fontWeight: 700 }}>
              ✕ Clear
            </button>
            <button onClick={() => setIsOpen(false)} style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: 8, padding: "4px 8px", cursor: "pointer", color: "white", fontSize: 16, fontWeight: 900, lineHeight: 1 }}>
              ×
            </button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto", padding: "12px 14px", display: "flex", flexDirection: "column", gap: 8, minHeight: 0 }}>
            {messages.length === 0 && !loading && (
              <div style={{ textAlign: "center", color: "#9ca3af", fontSize: 13, paddingTop: 24 }}>
                {config.emoji} {config.name} is ready to help! Ask anything.
              </div>
            )}
            {messages.map((msg, i) => (
              <div key={i} style={{
                alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                maxWidth: "85%",
                background: msg.role === "user" ? `linear-gradient(135deg,${config.color},${config.color}cc)` : "#f3f4f6",
                color: msg.role === "user" ? "white" : "#1f2937",
                padding: "8px 12px",
                borderRadius: msg.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                fontSize: 13, lineHeight: 1.5,
                boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
              }}>
                {msg.content}
              </div>
            ))}
            {loading && (
              <div style={{ alignSelf: "flex-start", background: "#f3f4f6", padding: "8px 14px", borderRadius: "16px 16px 16px 4px", fontSize: 18, letterSpacing: 2 }}>
                <span style={{ animation: "chatDot 1s infinite" }}>●</span>
                <span style={{ animation: "chatDot 1s infinite 0.2s" }}>●</span>
                <span style={{ animation: "chatDot 1s infinite 0.4s" }}>●</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input row */}
          <div style={{ borderTop: `1px solid ${config.color}20`, padding: "10px 12px", display: "flex", flexDirection: "column", gap: 6, flexShrink: 0, background: "#fafafa" }}>
            <div style={{ display: "flex", gap: 6 }}>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Ask ${config.name}…`}
                disabled={loading}
                style={{ flex: 1, border: `1.5px solid ${config.color}40`, borderRadius: 12, padding: "8px 12px", fontSize: 13, outline: "none", background: "white", color: "#1f2937" }}
              />
              {/* hasMicSupport drives visibility, ref changes don't re-render */}
              {hasMicSupport && (
                <button
                  onPointerDown={toggleMic}
                  onClick={(e) => e.preventDefault()}
                  style={{ background: isListening ? "#ef4444" : `${config.color}18`, border: `1.5px solid ${isListening ? "#ef4444" : config.color + "40"}`, borderRadius: 12, padding: "0 10px", cursor: "pointer", fontSize: 16, flexShrink: 0, transition: "all 0.15s" }}
                >
                  {isListening ? "⏹" : "🎤"}
                </button>
              )}
              {/* Hands-free conversation toggle */}
              {hasMicSupport && (
                <button
                  onPointerDown={() => { unlockAudio(); if (convoActive) { endConvo(); } else { startConvo(); } }}
                  onClick={(e) => e.preventDefault()}
                  title={convoActive ? "Stop conversation" : `Talk with ${config.name}`}
                  style={{ background: convoActive ? "#ef4444" : config.color, border: "none", borderRadius: 12, padding: "0 10px", cursor: "pointer", fontSize: 16, flexShrink: 0, color: "white", transition: "all 0.15s" }}
                >
                  {convoActive ? "⏹" : "🗣️"}
                </button>
              )}
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                style={{ background: loading || !input.trim() ? "#e5e7eb" : config.color, border: "none", borderRadius: 12, padding: "0 14px", cursor: loading || !input.trim() ? "not-allowed" : "pointer", color: loading || !input.trim() ? "#9ca3af" : "white", fontWeight: 900, fontSize: 16, flexShrink: 0, transition: "all 0.15s" }}
              >
                →
              </button>
            </div>
            {micError && (
              <div style={{ fontSize: 11, color: "#b91c1c", fontWeight: 600, paddingLeft: 4 }}>
                {micError}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Float button */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        aria-label={`Open ${config.name} tutor`}
        style={{
          position: "fixed", bottom: 24, right: 24,
          width: 64, height: 64, borderRadius: "50%",
          background: headerGrad, border: "none", cursor: "pointer",
          fontSize: 28, zIndex: 9999,
          boxShadow: `0 4px 20px ${config.color}60, 0 2px 8px rgba(0,0,0,0.2)`,
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "transform 0.15s",
        }}
        onPointerDown={(e) => {
          unlockAudio(); // iOS TTS unlock
          (e.currentTarget as HTMLButtonElement).style.transform = "scale(0.93)";
        }}
        onPointerUp={(e)   => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; }}
        onPointerLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; }}
      >
        {config.emoji}
        {autoGreet && !isOpen && (
          <span style={{ position: "absolute", inset: -4, borderRadius: "50%", border: `3px solid ${config.color}`, animation: "tutorRing 1.5s ease-out infinite", pointerEvents: "none" }} />
        )}
      </button>

      <style>{`
        @keyframes chatDot { 0%,100%{opacity:0.3} 50%{opacity:1} }
        @keyframes tutorRing { 0%{transform:scale(1);opacity:0.8} 100%{transform:scale(1.5);opacity:0} }
      `}</style>
    </>
  );
}
