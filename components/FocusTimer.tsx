"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Mode = "work" | "break";

interface Task {
  id: string;
  text: string;
  done: boolean;
}

const WORK_PRESETS = [15, 25, 30, 45] as const;
const BREAK_PRESETS = [5, 10, 15] as const;
const SUBJECTS = ["Math", "Grammar", "Reading", "Science", "History", "Bible"] as const;

const STORAGE_KEY = "schoolhouse-focus-v1";

const CREAM = "#f5f0e6";
const CREAM_CARD = "#fffcf5";
const SAGE = "#6B7A45";
const SAGE_DARK = "#545F36";
const SAGE_SOFT = "#EEF0E2";
const SAGE_LINE = "rgba(107,122,69,0.28)";
const INK = "#171411";
const INK_MUTED = "#6b6458";
const BREAK_ACCENT = "#5a7a8a";
const BREAK_SOFT = "#e8f0f3";

function playSoftChime() {
  try {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const now = ctx.currentTime;
    // Gentle two-note chime (soft, not alarm-like)
    const notes = [
      { f: 523.25, t: 0 },    // C5
      { f: 659.25, t: 0.22 }, // E5
    ];
    for (const n of notes) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = n.f;
      gain.gain.setValueAtTime(0, now + n.t);
      gain.gain.linearRampToValueAtTime(0.08, now + n.t + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + n.t + 1.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + n.t);
      osc.stop(now + n.t + 1.2);
    }
    setTimeout(() => ctx.close().catch(() => {}), 1600);
  } catch {
    // ignore audio failures (autoplay policy, etc.)
  }
}

function loadState() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as {
      tasks?: Task[];
      subject?: string | null;
      workMins?: number;
      breakMins?: number;
      chimeOn?: boolean;
      sessionsToday?: number;
      sessionsDate?: string;
    };
  } catch {
    return null;
  }
}

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

export default function FocusTimer() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const kidId = (searchParams.get("kid") || "truma").toLowerCase();
  const hubHref = useMemo(() => {
    if (kidId === "truma") return "/hub";
    if (kidId === "titus" || kidId === "mercy" || kidId === "lois") return `/kids/${kidId}/hub`;
    return "/hub";
  }, [kidId]);
  const hubLabel = useMemo(() => {
    const names: Record<string, string> = {
      truma: "Truma",
      titus: "Titus",
      mercy: "Mercy",
      lois: "Lois",
    };
    const name = names[kidId] || "Schoolhouse";
    return `← ${name}'s hub`;
  }, [kidId]);
  const saved = useRef(loadState());

  const [mode, setMode] = useState<Mode>("work");
  const [workMins, setWorkMins] = useState(saved.current?.workMins ?? 25);
  const [breakMins, setBreakMins] = useState(saved.current?.breakMins ?? 5);
  const [running, setRunning] = useState(false);
  const [remainingMs, setRemainingMs] = useState((saved.current?.workMins ?? 25) * 60_000);
  const [subject, setSubject] = useState<string | null>(saved.current?.subject ?? null);
  const [tasks, setTasks] = useState<Task[]>(saved.current?.tasks ?? []);
  const [taskDraft, setTaskDraft] = useState("");
  const [chimeOn, setChimeOn] = useState(saved.current?.chimeOn ?? true);
  const [sessions, setSessions] = useState(() => {
    const s = saved.current;
    if (s?.sessionsDate === todayKey()) return s.sessionsToday ?? 0;
    return 0;
  });
  const [hydrated, setHydrated] = useState(false);

  // Absolute end timestamp — stays accurate when tab is backgrounded
  const endAtRef = useRef<number | null>(null);
  const remainingWhenPausedRef = useRef(remainingMs);
  const tickRef = useRef<number | null>(null);
  const modeRef = useRef(mode);
  const chimeOnRef = useRef(chimeOn);
  const workMinsRef = useRef(workMins);
  const breakMinsRef = useRef(breakMins);

  useEffect(() => { modeRef.current = mode; }, [mode]);
  useEffect(() => { chimeOnRef.current = chimeOn; }, [chimeOn]);
  useEffect(() => { workMinsRef.current = workMins; }, [workMins]);
  useEffect(() => { breakMinsRef.current = breakMins; }, [breakMins]);

  useEffect(() => {
    setHydrated(true);
  }, []);

  // Persist preferences + tasks
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          tasks,
          subject,
          workMins,
          breakMins,
          chimeOn,
          sessionsToday: sessions,
          sessionsDate: todayKey(),
        }),
      );
    } catch {
      // ignore quota errors
    }
  }, [tasks, subject, workMins, breakMins, chimeOn, sessions, hydrated]);

  const totalMs = (mode === "work" ? workMins : breakMins) * 60_000;
  const progress = Math.max(0, Math.min(1, 1 - remainingMs / totalMs));

  const clearTick = () => {
    if (tickRef.current != null) {
      window.clearInterval(tickRef.current);
      tickRef.current = null;
    }
  };

  const finishPeriod = useCallback(() => {
    clearTick();
    endAtRef.current = null;
    setRunning(false);
    if (chimeOnRef.current) playSoftChime();

    if (modeRef.current === "work") {
      setSessions((n) => n + 1);
      setMode("break");
      const ms = breakMinsRef.current * 60_000;
      remainingWhenPausedRef.current = ms;
      setRemainingMs(ms);
    } else {
      setMode("work");
      const ms = workMinsRef.current * 60_000;
      remainingWhenPausedRef.current = ms;
      setRemainingMs(ms);
    }
  }, []);

  const tick = useCallback(() => {
    const endAt = endAtRef.current;
    if (endAt == null) return;
    const left = Math.max(0, endAt - Date.now());
    setRemainingMs(left);
    remainingWhenPausedRef.current = left;
    if (left <= 0) finishPeriod();
  }, [finishPeriod]);

  useEffect(() => {
    if (!running) {
      clearTick();
      return;
    }
    tick();
    tickRef.current = window.setInterval(tick, 250);
    return clearTick;
  }, [running, tick]);

  // Recalculate when tab becomes visible again
  useEffect(() => {
    const onVis = () => {
      if (document.visibilityState === "visible" && endAtRef.current != null) tick();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [tick]);

  const start = () => {
    if (remainingWhenPausedRef.current <= 0) {
      remainingWhenPausedRef.current = totalMs;
      setRemainingMs(totalMs);
    }
    endAtRef.current = Date.now() + remainingWhenPausedRef.current;
    setRunning(true);
  };

  const pause = () => {
    if (endAtRef.current != null) {
      remainingWhenPausedRef.current = Math.max(0, endAtRef.current - Date.now());
      setRemainingMs(remainingWhenPausedRef.current);
    }
    endAtRef.current = null;
    setRunning(false);
  };

  const reset = () => {
    clearTick();
    endAtRef.current = null;
    setRunning(false);
    const ms = (mode === "work" ? workMins : breakMins) * 60_000;
    remainingWhenPausedRef.current = ms;
    setRemainingMs(ms);
  };

  const applyWork = (mins: number) => {
    setWorkMins(mins);
    if (mode === "work" && !running) {
      const ms = mins * 60_000;
      remainingWhenPausedRef.current = ms;
      setRemainingMs(ms);
    }
  };

  const applyBreak = (mins: number) => {
    setBreakMins(mins);
    if (mode === "break" && !running) {
      const ms = mins * 60_000;
      remainingWhenPausedRef.current = ms;
      setRemainingMs(ms);
    }
  };

  const switchMode = (next: Mode) => {
    if (running) return;
    setMode(next);
    const ms = (next === "work" ? workMins : breakMins) * 60_000;
    remainingWhenPausedRef.current = ms;
    setRemainingMs(ms);
  };

  const addTask = () => {
    const text = taskDraft.trim();
    if (!text) return;
    setTasks((t) => [...t, { id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, text, done: false }]);
    setTaskDraft("");
  };

  const toggleTask = (id: string) => {
    setTasks((t) => t.map((x) => (x.id === id ? { ...x, done: !x.done } : x)));
  };

  const removeTask = (id: string) => {
    setTasks((t) => t.filter((x) => x.id !== id));
  };

  const mins = Math.floor(remainingMs / 60_000);
  const secs = Math.floor((remainingMs % 60_000) / 1000);
  const timeLabel = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;

  const ringSize = 280;
  const stroke = 12;
  const radius = (ringSize - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - progress);
  const accent = mode === "work" ? SAGE : BREAK_ACCENT;
  const soft = mode === "work" ? SAGE_SOFT : BREAK_SOFT;

  const dots = Array.from({ length: Math.max(sessions, 4) }, (_, i) => i < sessions);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: `linear-gradient(180deg, ${CREAM} 0%, ${SAGE_SOFT} 55%, ${CREAM} 100%)`,
        color: INK,
        fontFamily: "var(--font-ui)",
        padding: "20px 16px 48px",
      }}
    >
      <div style={{ maxWidth: 520, margin: "0 auto" }}>
        <button
          onClick={() => router.push(hubHref)}
          style={{
            background: "none",
            border: "none",
            color: INK_MUTED,
            fontWeight: 600,
            cursor: "pointer",
            fontSize: 14,
            marginBottom: 16,
            padding: "8px 0",
            minHeight: 44,
          }}
        >
          {hubLabel}
        </button>

        <div style={{ textAlign: "center", marginBottom: 8 }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: SAGE_DARK,
              marginBottom: 6,
            }}
          >
            Focus timer
          </div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              fontSize: 32,
              lineHeight: 1.1,
              margin: 0,
              color: INK,
            }}
          >
            Quiet work time
          </h1>
          <p style={{ fontSize: 14, color: INK_MUTED, margin: "8px 0 0" }}>
            Work, then rest. No rush.
          </p>
        </div>

        {/* Mode badge */}
        <div style={{ display: "flex", justifyContent: "center", gap: 10, margin: "20px 0 8px" }}>
          {(["work", "break"] as Mode[]).map((m) => {
            const active = mode === m;
            return (
              <button
                key={m}
                onClick={() => switchMode(m)}
                disabled={running}
                style={{
                  minHeight: 44,
                  minWidth: 110,
                  padding: "10px 20px",
                  borderRadius: 999,
                  border: active ? `2px solid ${m === "work" ? SAGE : BREAK_ACCENT}` : `1px solid ${SAGE_LINE}`,
                  background: active ? (m === "work" ? SAGE : BREAK_ACCENT) : CREAM_CARD,
                  color: active ? "#fff" : INK_MUTED,
                  fontWeight: 600,
                  fontSize: 15,
                  cursor: running ? "not-allowed" : "pointer",
                  opacity: running && !active ? 0.5 : 1,
                }}
              >
                {m === "work" ? "Work" : "Break"}
              </button>
            );
          })}
        </div>

        {/* Ring + time */}
        <div style={{ display: "flex", justifyContent: "center", margin: "12px 0 8px" }}>
          <div style={{ position: "relative", width: ringSize, height: ringSize }}>
            <svg width={ringSize} height={ringSize} style={{ transform: "rotate(-90deg)" }} aria-hidden>
              <circle
                cx={ringSize / 2}
                cy={ringSize / 2}
                r={radius}
                fill={CREAM_CARD}
                stroke={soft}
                strokeWidth={stroke}
              />
              <circle
                cx={ringSize / 2}
                cy={ringSize / 2}
                r={radius}
                fill="none"
                stroke={accent}
                strokeWidth={stroke}
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                style={{ transition: running ? "none" : "stroke-dashoffset 0.3s ease" }}
              />
            </svg>
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                pointerEvents: "none",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 56,
                  fontWeight: 500,
                  letterSpacing: "-0.02em",
                  color: INK,
                  lineHeight: 1,
                  fontVariantNumeric: "tabular-nums",
                }}
                aria-live="polite"
                aria-atomic="true"
              >
                {timeLabel}
              </div>
              <div
                style={{
                  marginTop: 10,
                  fontSize: 13,
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: accent,
                }}
              >
                {mode === "work" ? (subject ? subject : "Work") : "Break"}
                {running ? " · going" : ""}
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: "flex", justifyContent: "center", gap: 12, marginBottom: 22, flexWrap: "wrap" }}>
          {!running ? (
            <button
              onClick={start}
              style={{
                minHeight: 56,
                minWidth: 140,
                padding: "0 28px",
                borderRadius: 999,
                border: "none",
                background: SAGE,
                color: "#fff",
                fontWeight: 600,
                fontSize: 18,
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(84,95,54,0.25)",
              }}
            >
              Start
            </button>
          ) : (
            <button
              onClick={pause}
              style={{
                minHeight: 56,
                minWidth: 140,
                padding: "0 28px",
                borderRadius: 999,
                border: "none",
                background: SAGE_DARK,
                color: "#fff",
                fontWeight: 600,
                fontSize: 18,
                cursor: "pointer",
              }}
            >
              Pause
            </button>
          )}
          <button
            onClick={reset}
            style={{
              minHeight: 56,
              minWidth: 110,
              padding: "0 22px",
              borderRadius: 999,
              border: `1.5px solid ${SAGE_LINE}`,
              background: CREAM_CARD,
              color: SAGE_DARK,
              fontWeight: 600,
              fontSize: 16,
              cursor: "pointer",
            }}
          >
            Reset
          </button>
        </div>

        {/* Session dots */}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: INK_MUTED,
              marginBottom: 8,
            }}
          >
            Sessions today · {sessions}
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: 8, flexWrap: "wrap" }}>
            {dots.map((filled, i) => (
              <span
                key={i}
                aria-hidden
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  background: filled ? SAGE : "transparent",
                  border: `2px solid ${filled ? SAGE : SAGE_LINE}`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Presets */}
        <section
          style={{
            background: CREAM_CARD,
            border: `1px solid ${SAGE_LINE}`,
            borderRadius: 20,
            padding: 18,
            marginBottom: 14,
            boxShadow: "0 1px 3px rgba(23,20,17,0.04)",
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: INK_MUTED,
              marginBottom: 10,
            }}
          >
            Work length
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
            {WORK_PRESETS.map((m) => (
              <button
                key={m}
                onClick={() => applyWork(m)}
                disabled={running && mode === "work"}
                style={{
                  minHeight: 48,
                  minWidth: 64,
                  padding: "0 16px",
                  borderRadius: 12,
                  border: workMins === m ? `2px solid ${SAGE}` : `1px solid ${SAGE_LINE}`,
                  background: workMins === m ? SAGE_SOFT : "#fff",
                  color: SAGE_DARK,
                  fontWeight: 600,
                  fontSize: 16,
                  cursor: running && mode === "work" ? "not-allowed" : "pointer",
                }}
              >
                {m}
              </button>
            ))}
          </div>
          <div
            style={{
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: INK_MUTED,
              marginBottom: 10,
            }}
          >
            Break length
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {BREAK_PRESETS.map((m) => (
              <button
                key={m}
                onClick={() => applyBreak(m)}
                disabled={running && mode === "break"}
                style={{
                  minHeight: 48,
                  minWidth: 64,
                  padding: "0 16px",
                  borderRadius: 12,
                  border: breakMins === m ? `2px solid ${BREAK_ACCENT}` : `1px solid ${SAGE_LINE}`,
                  background: breakMins === m ? BREAK_SOFT : "#fff",
                  color: BREAK_ACCENT,
                  fontWeight: 600,
                  fontSize: 16,
                  cursor: running && mode === "break" ? "not-allowed" : "pointer",
                }}
              >
                {m}
              </button>
            ))}
          </div>
        </section>

        {/* Subjects */}
        <section
          style={{
            background: CREAM_CARD,
            border: `1px solid ${SAGE_LINE}`,
            borderRadius: 20,
            padding: 18,
            marginBottom: 14,
            boxShadow: "0 1px 3px rgba(23,20,17,0.04)",
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: INK_MUTED,
              marginBottom: 10,
            }}
          >
            Subject
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {SUBJECTS.map((s) => {
              const on = subject === s;
              return (
                <button
                  key={s}
                  onClick={() => setSubject(on ? null : s)}
                  style={{
                    minHeight: 44,
                    padding: "0 16px",
                    borderRadius: 999,
                    border: on ? `2px solid ${SAGE}` : `1px solid ${SAGE_LINE}`,
                    background: on ? SAGE : "#fff",
                    color: on ? "#fff" : SAGE_DARK,
                    fontWeight: 600,
                    fontSize: 14,
                    cursor: "pointer",
                  }}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </section>

        {/* Tasks */}
        <section
          style={{
            background: CREAM_CARD,
            border: `1px solid ${SAGE_LINE}`,
            borderRadius: 20,
            padding: 18,
            marginBottom: 14,
            boxShadow: "0 1px 3px rgba(23,20,17,0.04)",
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: INK_MUTED,
              marginBottom: 10,
            }}
          >
            This session
          </div>
          <div style={{ display: "flex", gap: 8, marginBottom: tasks.length ? 12 : 0 }}>
            <input
              value={taskDraft}
              onChange={(e) => setTaskDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") addTask();
              }}
              placeholder="Add a task…"
              style={{
                flex: 1,
                minHeight: 48,
                borderRadius: 12,
                border: `1px solid ${SAGE_LINE}`,
                padding: "0 14px",
                fontSize: 16,
                background: "#fff",
                color: INK,
                outline: "none",
              }}
            />
            <button
              onClick={addTask}
              style={{
                minHeight: 48,
                minWidth: 72,
                borderRadius: 12,
                border: "none",
                background: SAGE,
                color: "#fff",
                fontWeight: 600,
                fontSize: 15,
                cursor: "pointer",
              }}
            >
              Add
            </button>
          </div>
          <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {tasks.map((t) => (
              <li
                key={t.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 0",
                  borderTop: `1px solid ${SAGE_LINE}`,
                }}
              >
                <button
                  onClick={() => toggleTask(t.id)}
                  aria-label={t.done ? "Mark not done" : "Mark done"}
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    border: `2px solid ${t.done ? SAGE : SAGE_LINE}`,
                    background: t.done ? SAGE : "#fff",
                    color: "#fff",
                    cursor: "pointer",
                    flexShrink: 0,
                    fontSize: 14,
                    fontWeight: 700,
                  }}
                >
                  {t.done ? "✓" : ""}
                </button>
                <span
                  style={{
                    flex: 1,
                    fontSize: 16,
                    color: t.done ? INK_MUTED : INK,
                    textDecoration: t.done ? "line-through" : "none",
                  }}
                >
                  {t.text}
                </span>
                <button
                  onClick={() => removeTask(t.id)}
                  aria-label="Remove task"
                  style={{
                    background: "none",
                    border: "none",
                    color: INK_MUTED,
                    cursor: "pointer",
                    fontSize: 18,
                    padding: 8,
                    minHeight: 44,
                    minWidth: 44,
                  }}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        </section>

        {/* Chime toggle */}
        <section
          style={{
            background: CREAM_CARD,
            border: `1px solid ${SAGE_LINE}`,
            borderRadius: 20,
            padding: "14px 18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            boxShadow: "0 1px 3px rgba(23,20,17,0.04)",
          }}
        >
          <div>
            <div style={{ fontWeight: 600, fontSize: 16, color: INK }}>Soft chime</div>
            <div style={{ fontSize: 13, color: INK_MUTED }}>Gentle tone when a period ends</div>
          </div>
          <button
            role="switch"
            aria-checked={chimeOn}
            onClick={() => {
              const next = !chimeOn;
              setChimeOn(next);
              if (next) playSoftChime();
            }}
            style={{
              width: 56,
              height: 32,
              borderRadius: 999,
              border: "none",
              background: chimeOn ? SAGE : "#d4cbb8",
              cursor: "pointer",
              position: "relative",
              flexShrink: 0,
              transition: "background 0.2s",
            }}
          >
            <span
              style={{
                position: "absolute",
                top: 4,
                left: chimeOn ? 28 : 4,
                width: 24,
                height: 24,
                borderRadius: "50%",
                background: "#fff",
                boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                transition: "left 0.2s",
              }}
            />
          </button>
        </section>
      </div>
    </div>
  );
}
