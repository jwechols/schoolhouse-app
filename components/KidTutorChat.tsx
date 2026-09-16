"use client";

import { useState, useRef, useEffect } from "react";
import { useTTS, OPENAI_VOICE } from "@/lib/tts";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface Props {
  kidId: string;
  kidName: string;
  colorHex: string;
  subject?: string;
  currentQuestion?: string;
  onClose: () => void;
}

// Per-kid tutor avatar + name
const TUTOR_CONFIG: Record<string, { avatar: string; name: string }> = {
  titus: { avatar: "🎣", name: "Buck" },
  mercy: { avatar: "🌹", name: "Princess Rose" },
  lois:  { avatar: "❄️", name: "Princess Crystal" },
};

function TypingDots({ color }: { color: string }) {
  return (
    <div className="flex items-center gap-1 py-1">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="rounded-full"
          style={{
            width: 7,
            height: 7,
            backgroundColor: color,
            opacity: 0.6,
            animation: `typingDot 1.2s ease-in-out ${i * 0.2}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

export default function KidTutorChat({
  kidId,
  kidName,
  colorHex,
  subject,
  currentQuestion,
  onClose,
}: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [muted, setMuted] = useState(false);
  const [listening, setListening] = useState(false);
  const [hasSpeechRecognition, setHasSpeechRecognition] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);
  const { speak: ttsSpeak, stopAudio } = useTTS(OPENAI_VOICE[kidId] ?? "nova");

  const tutor = TUTOR_CONFIG[kidId] ?? { avatar: "🤖", name: "Tutor" };

  // Detect SpeechRecognition support (client-side only)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      setHasSpeechRecognition(!!SR);
    }
  }, []);

  // Greeting on first open
  useEffect(() => {
    const greeting =
      kidId === "mercy"
        ? `Hi ${kidName}! ${tutor.avatar} I'm ${tutor.name}! I'm here to help! What do you need? 💕`
        : `Hey ${kidName}! ${tutor.avatar} I'm ${tutor.name}, your personal tutor! Ask me anything about what you're learning!`;
    setMessages([{ role: "assistant", content: greeting }]);
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [kidId, kidName, tutor.avatar, tutor.name]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Stop speech on unmount
  useEffect(() => {
    return () => {
      stopAudio();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Speak last assistant message when loading finishes
  useEffect(() => {
    if (!loading && messages.length > 0) {
      const last = messages[messages.length - 1];
      if (last.role === "assistant" && last.content) {
        if (!muted) ttsSpeak(last.content);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  function toggleMic() {
    if (typeof window === "undefined") return;
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;

    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }

    const recognition = new SR();
    recognitionRef.current = recognition;
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.onerror = () => {
      setListening(false);
    };

    recognition.start();
    setListening(true);
  }

  async function sendMessage(text?: string) {
    const userText = (text ?? input).trim();
    if (!userText || loading) return;

    setInput("");
    const newMessages: Message[] = [...messages, { role: "user", content: userText }];
    setMessages(newMessages);
    setLoading(true);

    const historyForApi = newMessages.slice(1, -1);

    try {
      const res = await fetch("/api/kid-tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kidId,
          subject,
          message: userText,
          history: historyForApi,
        }),
      });

      if (!res.ok || !res.body) throw new Error("Failed to get response");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let assistantText = "";

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        assistantText += decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: "assistant", content: assistantText };
          return updated;
        });
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Oops, I had a problem! Try again 😊" },
      ]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }

  const quickPrompts =
    kidId === "mercy"
      ? ["Help me! 🙋", "I don't get it 😕", "Tell me again 🔁", "Give me a hint 💡", "Make it easier 🌸"]
      : ["Give me a hint 💡", "Explain it differently 🔄", "Give me a practice problem 🎯", "Is this right? ✅", "Use a hunting or fishing example 🎣"];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40">
      <div
        className="w-full max-w-md rounded-3xl shadow-2xl flex flex-col overflow-hidden"
        style={{ maxHeight: "85vh", backgroundColor: "#ffffff" }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ backgroundColor: colorHex }}
        >
          <div className="flex items-center gap-3">
            <div className="text-3xl">{tutor.avatar}</div>
            <div>
              <div className="text-white font-black text-base">{tutor.name}</div>
              {subject && (
                <div className="text-white/80 text-xs">Helping with: {subject}</div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Mute toggle */}
            <button
              onClick={() => {
                if (!muted) stopAudio();
                setMuted((m) => !m);
              }}
              className="text-white/80 hover:text-white text-xl transition-colors"
              aria-label={muted ? "Unmute tutor voice" : "Mute tutor voice"}
              title={muted ? "Unmute" : "Mute"}
            >
              {muted ? "🔇" : "🔊"}
            </button>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white text-2xl font-bold leading-none transition-colors"
              aria-label="Close tutor"
            >
              ×
            </button>
          </div>
        </div>

        {/* Current question context */}
        {currentQuestion && (
          <div
            className="px-4 py-2 text-xs border-b"
            style={{ backgroundColor: colorHex + "15", color: colorHex, borderColor: colorHex + "30" }}
          >
            <span className="font-bold">Current question: </span>
            {currentQuestion}
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 min-h-0">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "assistant" && (
                <div className="text-2xl mr-2 mt-1 flex-shrink-0">{tutor.avatar}</div>
              )}
              <div
                className="rounded-2xl px-4 py-3 max-w-xs text-sm leading-relaxed"
                style={
                  msg.role === "user"
                    ? { backgroundColor: colorHex, color: "white" }
                    : { backgroundColor: "#f3f4f6", color: "#1f2937" }
                }
              >
                {msg.content || (loading && i === messages.length - 1 ? (
                  <TypingDots color={colorHex} />
                ) : (
                  <span className="text-gray-400 italic">
                    {kidId === "mercy" ? "Thinking... 🌸" : "Thinking..."}
                  </span>
                ))}
              </div>
            </div>
          ))}

          {/* Typing indicator as separate bubble */}
          {loading && messages[messages.length - 1]?.role !== "assistant" && (
            <div className="flex justify-start">
              <div className="text-2xl mr-2 mt-1">{tutor.avatar}</div>
              <div className="rounded-2xl px-4 py-3 bg-gray-100">
                <TypingDots color={colorHex} />
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Quick prompts, scrollable row */}
        {messages.length <= 2 && (
          <div className="px-4 pb-2 overflow-x-auto">
            <div className="flex gap-2 pb-1" style={{ minWidth: "max-content" }}>
              {quickPrompts.map((p) => (
                <button
                  key={p}
                  onClick={() => sendMessage(p)}
                  disabled={loading}
                  className="text-xs px-3 py-2 rounded-full border-2 font-bold transition-all hover:opacity-80 disabled:opacity-40 whitespace-nowrap"
                  style={{ borderColor: colorHex, color: colorHex }}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="px-4 pb-4 pt-2 border-t border-gray-100">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder={kidId === "mercy" ? "Type here… 🌸" : "Ask anything…"}
              disabled={loading}
              className="flex-1 border-2 rounded-2xl px-4 py-3 text-sm focus:outline-none transition-colors disabled:opacity-50"
              style={{ borderColor: colorHex + "66" }}
            />
            {/* Mic button, only rendered when SpeechRecognition is available */}
            {hasSpeechRecognition && (
              <button
                onClick={toggleMic}
                disabled={loading}
                aria-label={listening ? "Stop listening" : "Start voice input"}
                className="flex items-center justify-center w-12 h-12 rounded-2xl transition-all disabled:opacity-40"
                style={{
                  backgroundColor: listening ? "#ef4444" : colorHex + "22",
                  border: `2px solid ${listening ? "#ef4444" : colorHex + "66"}`,
                  animation: listening ? "micPulse 1s ease-in-out infinite" : undefined,
                }}
              >
                <span className="text-lg">🎤</span>
              </button>
            )}
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
              className="px-4 py-3 rounded-2xl font-black text-white transition-all disabled:opacity-40 hover:opacity-90"
              style={{ backgroundColor: colorHex }}
            >
              →
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes typingDot {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-5px); opacity: 1; }
        }
        @keyframes micPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.5); }
          50% { box-shadow: 0 0 0 8px rgba(239, 68, 68, 0); }
        }
      `}</style>
    </div>
  );
}
