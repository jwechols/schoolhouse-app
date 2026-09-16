"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { burstConfetti } from "@/lib/confetti";
import { recordGameResult } from "@/lib/family-data";
import { addXP, recordSession, checkBadges } from "@/lib/progress";
import { playCorrect, playWrong, playLevelUp } from "@/lib/sounds";
import { getTitusSettings, setTitusSoundPref } from "@/lib/titus-settings";

const TIMER_DURATION = 12; // 12 seconds, ADHD needs more processing time
const SET_SIZE = 5;       // 5 questions per set, then break/celebrate
const TABLES = [2, 3, 4, 5];
const COLOR = "#2563eb"; // Titus blue

function generateQuestion() {
  const a = TABLES[Math.floor(Math.random() * TABLES.length)];
  const b = Math.floor(Math.random() * 9) + 2; // 2–10
  const answer = a * b;

  const wrongs = new Set<number>();
  while (wrongs.size < 3) {
    const offset = Math.floor(Math.random() * 6) - 3;
    const candidate = answer + offset;
    if (candidate !== answer && candidate > 0) wrongs.add(candidate);
  }

  const choices = [answer, ...Array.from(wrongs)].sort(() => Math.random() - 0.5);
  return { a, b, answer, choices };
}

type Phase = "preview" | "playing" | "feedback" | "set-done" | "done";

export default function TitusMathGame() {
  const router = useRouter();

  // Sound preference, read once on mount
  const [soundOn, setSoundOn] = useState(true);
  useEffect(() => {
    setSoundOn(getTitusSettings().soundEnabled);
  }, []);

  function toggleSound() {
    const next = !soundOn;
    setSoundOn(next);
    setTitusSoundPref(next);
  }

  const [phase, setPhase] = useState<Phase>("preview");
  const [questions, setQuestions] = useState(() =>
    Array.from({ length: SET_SIZE }, generateQuestion)
  );
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [correct, setCorrect] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [xp, setXp] = useState(0);
  const [timer, setTimer] = useState(TIMER_DURATION);
  const [timedOut, setTimedOut] = useState(false);
  const [shakeBtn, setShakeBtn] = useState<number | null>(null);
  const [streakMsg, setStreakMsg] = useState("");
  const [totalSets, setTotalSets] = useState(0);      // sets completed
  const [totalCorrect, setTotalCorrect] = useState(0); // across all sets
  const [totalAsked, setTotalAsked] = useState(0);
  const [correctFlash, setCorrectFlash] = useState(false); // brief per-answer celebration
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [burstEmojis, setBurstEmojis] = useState<{id: number, emoji: string, x: number, y: number}[]>([]);

  function triggerBurst(emojis: string[]) {
    const newBursts = emojis.map((emoji, i) => ({
      id: Date.now() + i,
      emoji,
      x: 20 + Math.random() * 60,
      y: 20 + Math.random() * 40,
    }));
    setBurstEmojis(prev => [...prev, ...newBursts]);
    setTimeout(() => setBurstEmojis(prev => prev.filter(b => !newBursts.find(n => n.id === b.id))), 1500);
  }

  const q = questions[current];

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const handleTimeout = useCallback(() => {
    stopTimer();
    setTimedOut(true);
    setSelected(null);
    setStreak(0);
    setPhase("feedback");
  }, [stopTimer]);

  useEffect(() => {
    if (phase !== "playing") return;
    setTimer(TIMER_DURATION);
    timerRef.current = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) {
          handleTimeout();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => stopTimer();
  }, [phase, current, handleTimeout, stopTimer]);

  function handleAnswer(choice: number, e: React.MouseEvent<HTMLButtonElement>) {
    if (phase !== "playing") return;
    stopTimer();
    const elapsed = TIMER_DURATION - timer;
    const isCorrect = choice === q.answer;

    setSelected(choice);

    if (isCorrect) {
      const speedBonus = elapsed <= 4 ? 5 : 0;
      const gained = 10 + speedBonus;
      setCorrect((c) => c + 1);
      setXp((x) => x + gained);
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > bestStreak) setBestStreak(newStreak);

      // Brief per-answer flash celebration (ADHD: reward every win immediately)
      setCorrectFlash(true);
      setTimeout(() => setCorrectFlash(false), 700);

      if (newStreak >= 5) {
        setStreakMsg("⚡ UNSTOPPABLE!");
        if (soundOn) playLevelUp();
      } else if (newStreak >= 3) {
        setStreakMsg("🔥 ON FIRE!");
        if (soundOn) playCorrect();
      } else {
        setStreakMsg("");
        if (soundOn) playCorrect();
      }

      burstConfetti(e.clientX, e.clientY, COLOR);
      triggerBurst(["⭐","🎉","✨","🎣","💫"]);
    } else {
      setStreak(0);
      setStreakMsg("");
      setShakeBtn(choice);
      if (soundOn) playWrong();
      setTimeout(() => setShakeBtn(null), 600);
      triggerBurst(["💪","🔄","😅"]);
    }

    setPhase("feedback");
  }

  function handleNext() {
    const isLast = current + 1 >= SET_SIZE;
    const wasCorrect = selected === q.answer;
    const newTotalCorrect = totalCorrect + (wasCorrect ? 1 : 0);
    const newTotalAsked = totalAsked + 1;

    if (isLast) {
      // Set complete, record this set then show celebration
      const setCorrectCount = correct + (wasCorrect ? 1 : 0);
      recordGameResult("titus", "math", setCorrectCount, SET_SIZE);
      addXP("titus", xp);
      recordSession("titus", "math");
      checkBadges("titus");
      setTotalCorrect(newTotalCorrect);
      setTotalAsked(newTotalAsked);
      setTotalSets((s) => s + 1);
      setPhase("set-done");
    } else {
      setTotalCorrect(newTotalCorrect);
      setTotalAsked(newTotalAsked);
      setCurrent((c) => c + 1);
      setSelected(null);
      setTimedOut(false);
      setPhase("playing");
    }
  }

  function startNewSet() {
    setQuestions(Array.from({ length: SET_SIZE }, generateQuestion));
    setCurrent(0);
    setCorrect(0);
    setSelected(null);
    setStreak(0);
    setTimedOut(false);
    setStreakMsg("");
    setXp(0);
    setPhase("playing");
  }

  function goHome() {
    router.push("/kids/titus/hub");
  }

  // ── PREVIEW SCREEN ─────────────────────────────────────────────────────────
  if (phase === "preview") {
    return (
      <main
        className="min-h-screen flex flex-col items-center justify-center px-6 py-12 text-center max-w-sm mx-auto"
        style={{ background: "linear-gradient(160deg, #dbeafe 0%, #fff 70%)" }}
      >
        {/* Sound toggle, always accessible */}
        <button
          onClick={toggleSound}
          className="fixed top-4 right-4 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-lg hover:shadow-lg transition-shadow"
          title={soundOn ? "Turn off sound" : "Turn on sound"}
        >
          {soundOn ? "🔊" : "🔇"}
        </button>

        <div className="text-7xl mb-6">⚡</div>
        <h1 className="text-4xl font-black mb-2" style={{ color: COLOR }}>
          Math Facts!
        </h1>
        <div
          className="rounded-2xl p-5 mb-8 text-left shadow-md"
          style={{ backgroundColor: COLOR + "12", border: `2px solid ${COLOR}30` }}
        >
          <p className="font-black text-gray-700 text-lg mb-3">Today's plan:</p>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🔢</span>
              <span className="font-bold text-gray-700">5 multiplication facts</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">🎉</span>
              <span className="font-bold text-gray-700">Celebration break</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">❓</span>
              <span className="font-bold text-gray-500 text-sm">Do 5 more? Your choice!</span>
            </div>
          </div>
        </div>
        <button
          onClick={() => setPhase("playing")}
          className="w-full py-5 rounded-3xl font-black text-white text-xl shadow-xl hover:opacity-90 active:scale-95 transition-all"
          style={{ backgroundColor: COLOR }}
        >
          Ready! Let's go →
        </button>
        <button
          onClick={goHome}
          className="mt-3 text-sm text-gray-400 underline hover:text-gray-600"
        >
          Back to hub
        </button>
      </main>
    );
  }

  // ── SET-DONE CELEBRATION SCREEN ────────────────────────────────────────────
  if (phase === "set-done") {
    const setScore = correct + (selected === q?.answer ? 1 : 0);
    const pct = Math.round((setScore / SET_SIZE) * 100);
    return (
      <main
        className="min-h-screen flex flex-col items-center justify-center px-6 py-12 text-center max-w-sm mx-auto"
        style={{ background: "linear-gradient(160deg, #dbeafe 0%, #fff 70%)" }}
      >
        <button
          onClick={toggleSound}
          className="fixed top-4 right-4 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-lg hover:shadow-lg transition-shadow"
        >
          {soundOn ? "🔊" : "🔇"}
        </button>

        <div className="text-8xl mb-4 animate-bounce">
          {pct >= 80 ? "🏆" : pct >= 60 ? "⭐" : "💪"}
        </div>
        <h1 className="text-4xl font-black mb-1" style={{ color: COLOR }}>
          {pct >= 80 ? "You did it!" : pct >= 60 ? "Great work!" : "Nice try!"}
        </h1>
        <p className="text-gray-500 text-base mb-6">
          {setScore}/{SET_SIZE} correct, {pct}%
        </p>

        <div className="grid grid-cols-2 gap-3 w-full mb-8">
          <div className="bg-white rounded-2xl p-4 shadow-md text-center">
            <div className="text-3xl font-black" style={{ color: COLOR }}>{xp}</div>
            <div className="text-xs text-gray-400 mt-1">XP earned</div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-md text-center">
            <div className="text-3xl font-black text-orange-500">{bestStreak}</div>
            <div className="text-xs text-gray-400 mt-1">Best streak</div>
          </div>
        </div>

        {/* Keep going option */}
        <div className="flex flex-col gap-3 w-full">
          <button
            onClick={startNewSet}
            className="py-5 rounded-3xl font-black text-white text-xl shadow-xl hover:opacity-90 active:scale-95 transition-all"
            style={{ backgroundColor: COLOR }}
          >
            Do 5 more! ⚡
          </button>
          <button
            onClick={goHome}
            className="py-4 rounded-3xl font-black text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all text-lg"
          >
            I'm done for now 🏠
          </button>
        </div>
      </main>
    );
  }

  // ── GAME SCREEN ─────────────────────────────────────────────────────────────
  const timerPct = (timer / TIMER_DURATION) * 100;
  const timerColor =
    timer <= 3 ? "#ef4444" : timer <= 5 ? "#f97316" : "#22c55e";

  const isCorrect = selected !== null && selected === q.answer;

  // "X more to go!" phrasing, ADHD brains need finish-line visibility
  const remaining = SET_SIZE - current - 1; // questions left after this one
  const progressLabel =
    remaining === 0
      ? "Last one!"
      : remaining === 1
      ? "1 more after this!"
      : `${remaining} more after this!`;

  return (
    <main
      className="min-h-screen flex flex-col px-4 py-6 max-w-lg md:max-w-2xl mx-auto"
      style={{ background: "linear-gradient(160deg, #dbeafe 0%, #ffffff 70%)" }}
    >
      {/* Sound toggle, fixed, always accessible */}
      <button
        onClick={toggleSound}
        className="fixed top-4 right-4 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-lg hover:shadow-lg transition-shadow z-10"
        title={soundOn ? "Turn off sound" : "Turn on sound"}
      >
        {soundOn ? "🔊" : "🔇"}
      </button>

      {/* Header, minimal, no clutter */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={goHome}
          className="text-gray-400 hover:text-gray-600 text-sm font-medium"
        >
          ← Hub
        </button>
        {/* Finish-line visibility instead of raw counter */}
        <span
          className="text-sm font-black px-3 py-1 rounded-full"
          style={{ backgroundColor: COLOR + "18", color: COLOR }}
        >
          {progressLabel}
        </span>
        <span
          className="text-sm font-bold px-3 py-1 rounded-full"
          style={{ backgroundColor: "#fef3c7", color: "#d97706" }}
        >
          ⭐ {xp} XP
        </span>
      </div>

      {/* Timer bar */}
      <div className="bg-gray-100 rounded-full h-4 mb-3 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000"
          style={{ width: `${timerPct}%`, backgroundColor: timerColor }}
        />
      </div>

      {/* Immediate correct-answer flash (ADHD: celebrate every win) */}
      {correctFlash && (
        <div
          className="text-center text-2xl font-black py-1 mb-2 rounded-xl animate-pulse"
          style={{ backgroundColor: "#dcfce7", color: "#16a34a" }}
        >
          YES! ⭐
        </div>
      )}

      {/* Streak display, only when there is a streak */}
      {streakMsg && (
        <div className="text-center text-lg font-black mb-2 animate-pulse">
          {streakMsg}
        </div>
      )}

      {/* Question card */}
      <div
        className="bg-white rounded-3xl shadow-lg p-8 mb-6 text-center"
        style={{ border: `3px solid ${COLOR}22` }}
      >
        {timedOut && phase === "feedback" ? (
          <div className="text-2xl font-black text-red-400">⏰ Time's up!</div>
        ) : (
          <>
            <p className="text-6xl font-black mb-0" style={{ color: COLOR }}>
              {q.a} × {q.b}
            </p>
            <p className="text-4xl font-black text-gray-300 mt-2">= ?</p>
          </>
        )}
      </div>

      {/* Choices, clean: one question, four buttons, nothing else */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {q.choices.map((choice) => {
          let bg = "#ffffff";
          let border = "#e5e7eb";
          let textColor = "#1f2937";
          if (phase === "feedback") {
            if (choice === q.answer) {
              bg = "#dcfce7"; border = "#16a34a"; textColor = "#15803d";
            } else if (choice === selected) {
              bg = "#fee2e2"; border = "#dc2626"; textColor = "#dc2626";
            } else {
              bg = "#f9fafb"; textColor = "#9ca3af";
            }
          }
          return (
            <button
              key={choice}
              onClick={(e) => handleAnswer(choice, e)}
              disabled={phase === "feedback"}
              className="rounded-2xl font-black text-4xl py-5 shadow-md transition-all duration-150 active:scale-95 btn-bouncy"
              style={{
                backgroundColor: bg,
                border: `3px solid ${border}`,
                color: textColor,
                cursor: phase === "feedback" ? "default" : "pointer",
                animation: shakeBtn === choice ? "shake 0.5s ease-in-out" : undefined,
              }}
            >
              {phase === "feedback" && choice === q.answer && "✅ "}
              {phase === "feedback" && choice === selected && choice !== q.answer && "❌ "}
              {choice}
            </button>
          );
        })}
      </div>

      {/* Feedback */}
      {phase === "feedback" && (
        <div>
          <div
            className="rounded-2xl p-3 mb-3 text-center font-bold"
            style={{
              backgroundColor: isCorrect ? "#dcfce7" : "#fef3c7",
              color: isCorrect ? "#15803d" : "#92400e",
            }}
          >
            {timedOut
              ? `⏰ The answer was ${q.answer}. Next time!`
              : isCorrect
              ? `🎉 ${timer >= TIMER_DURATION - 4 ? "Super fast! +5 bonus XP!" : "That's right!"}`
              : `Not quite, the answer is ${q.answer}. You've got this!`}
          </div>
          <button
            onClick={handleNext}
            className="w-full py-4 rounded-3xl font-black text-white text-xl shadow-lg hover:opacity-90 transition-all"
            style={{ backgroundColor: COLOR }}
          >
            {current + 1 >= SET_SIZE ? "See how I did! 🏆" : "Next →"}
          </button>
        </div>
      )}

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-5px); }
          80% { transform: translateX(5px); }
        }
      `}</style>

      {/* Emoji burst layer */}
      <div style={{position:"fixed",top:0,left:0,width:"100%",height:"100%",pointerEvents:"none",zIndex:9999}}>
        {burstEmojis.map(b => (
          <div key={b.id} style={{
            position:"absolute",
            left:`${b.x}%`,
            top:`${b.y}%`,
            fontSize:"2rem",
            animation:"floatUp 1.5s ease forwards",
            userSelect:"none",
          }}>{b.emoji}</div>
        ))}
      </div>
    </main>
  );
}
