"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { loadStats, saveStats, postSession, todayISO } from "@/lib/data";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const INITIAL_MESSAGE: Message = {
  role: "assistant",
  content:
    "Hi, Truma! I'm your tutor for the Schoolhouse. I can help you with math, grammar, vocabulary, history, and science, or anything you're studying at Midland Classical. What would you like to work on today?",
};

const QUICK_PROMPTS = [
  "Give me a fraction word problem.",
  "Explain a Latin root word.",
  "Tell me about ancient Egypt.",
  "Help me understand ecosystems.",
  "I need grammar help.",
  "Give me a math drill problem.",
];

export default function TutorChat() {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const sessionRecordedRef = useRef(false);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || streaming) return;

    // Record tutor session on first user message
    if (!sessionRecordedRef.current) {
      sessionRecordedRef.current = true;
      const stats = loadStats();
      stats.tutorSessions = (stats.tutorSessions ?? 0) + 1;
      saveStats(stats);
      postSession({
        session_date: todayISO(),
        subject: "tutor",
        mode: "chat",
        score: 0,
        total: 1,
        xp_earned: 0,
        stars_earned: 0,
        topics_covered: [],
      });
    }

    const userMsg: Message = { role: "user", content: trimmed };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setStreaming(true);

    // Add empty assistant message placeholder
    const assistantPlaceholder: Message = { role: "assistant", content: "" };
    setMessages([...updatedMessages, assistantPlaceholder]);

    try {
      const response = await fetch("/api/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      if (!response.ok || !response.body) {
        setMessages((prev) => {
          const copy = [...prev];
          copy[copy.length - 1] = {
            role: "assistant",
            content: "Sorry, I had trouble connecting. Please try again.",
          };
          return copy;
        });
        setStreaming(false);
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        accumulated += chunk;
        const finalAccumulated = accumulated;
        setMessages((prev) => {
          const copy = [...prev];
          copy[copy.length - 1] = {
            role: "assistant",
            content: finalAccumulated,
          };
          return copy;
        });
      }
    } catch {
      setMessages((prev) => {
        const copy = [...prev];
        copy[copy.length - 1] = {
          role: "assistant",
          content: "Something went wrong. Please try again.",
        };
        return copy;
      });
    } finally {
      setStreaming(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  function handleQuickPrompt(prompt: string) {
    sendMessage(prompt);
  }

  const showQuickPrompts = messages.length <= 1;

  return (
    <div className="flex flex-col h-screen bg-parchment text-navy">
      {/* Header */}
      <div className="bg-bone border-b border-stone/20 px-4 py-3 flex-shrink-0">
        <Link href="/hub" className="text-sm text-stone hover:text-navy block mb-1">
          ← Back to Hub
        </Link>
        <h1
          className="text-xl font-bold text-navy"
          style={{ fontFamily: "Georgia, serif" }}
        >
          AI Tutor
        </h1>
        <p className="text-xs text-stone">Ask anything, I&apos;m here to help</p>
      </div>

      {/* Message area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.role === "user" ? (
              <div className="max-w-[80%] bg-navy text-white rounded-sm px-4 py-3 text-sm leading-relaxed">
                {msg.content}
              </div>
            ) : (
              <div className="max-w-[85%] bg-bone text-navy rounded-sm px-4 py-3 text-sm leading-relaxed">
                {msg.content === "" && streaming ? (
                  <span className="text-stone animate-pulse">Thinking…</span>
                ) : (
                  msg.content.split("\n").map((line, li) =>
                    line.trim() === "" ? (
                      <div key={li} className="h-2" />
                    ) : (
                      <p key={li} className="mb-1 last:mb-0">
                        {line}
                      </p>
                    )
                  )
                )}
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick prompt buttons */}
      {showQuickPrompts && (
        <div className="px-4 pb-3 flex-shrink-0">
          <p className="text-xs text-stone mb-2">Quick starts:</p>
          <div className="flex flex-wrap gap-2">
            {QUICK_PROMPTS.map((p) => (
              <button
                key={p}
                onClick={() => handleQuickPrompt(p)}
                disabled={streaming}
                className="text-xs bg-bone text-navy px-3 py-1.5 rounded-full border border-stone/30 hover:border-navy hover:bg-navy hover:text-white transition-colors disabled:opacity-50"
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input area */}
      <div className="bg-bone border-t border-stone/20 px-4 py-3 flex-shrink-0">
        <div className="flex gap-2 items-end">
          <textarea
            ref={textareaRef}
            rows={2}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={streaming}
            placeholder="Ask me anything… (Enter to send, Shift+Enter for new line)"
            className="flex-1 bg-parchment text-navy text-sm rounded-sm px-3 py-2 border border-stone/30 focus:outline-none focus:border-navy resize-none disabled:opacity-50 placeholder:text-stone"
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={streaming || !input.trim()}
            className="bg-navy text-white px-4 py-2 rounded-sm font-semibold text-sm hover:bg-navy-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
          >
            Send
          </button>
        </div>
        <p className="text-xs text-stone mt-1">Enter to send · Shift+Enter for new line</p>
      </div>
    </div>
  );
}
