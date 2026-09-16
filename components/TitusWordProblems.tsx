"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { burstConfetti } from "@/lib/confetti";
import { recordGameResult } from "@/lib/family-data";
import { addXP, recordSession, checkBadges } from "@/lib/progress";
import { playCorrect, playWrong, playLevelUp } from "@/lib/sounds";
import { getTitusSettings, setTitusSoundPref } from "@/lib/titus-settings";

const TIMER_DURATION = 12;
const SET_SIZE = 5;
const COLOR = "#2563eb"; // Titus blue

type Phase = "preview" | "playing" | "feedback" | "set-done" | "done";

interface Problem {
  text: string;
  answer: number | string;
  choices: (number | string)[];
  hint: string;
  emoji: string;
}

// All 15 problems. Each round we shuffle and pick SET_SIZE.
const ALL_PROBLEMS: Problem[] = [
  {
    text: "Titus set out 4 crab traps. Each trap caught 6 catfish. How many catfish total?",
    answer: 24,
    choices: [24, 20, 28, 22],
    hint: "When you've got 4 traps and each catches 6, you multiply, just like countin' your harvest at the end of the day, son.",
    emoji: "🎣",
  },
  {
    text: "Buck caught 35 bass last season. He gave 7 to neighbors. How many did he keep?",
    answer: 28,
    choices: [28, 30, 25, 42],
    hint: "Start with what Buck caught, then take away what he gave. That's subtraction, same as countin' what's left in the cooler.",
    emoji: "🐟",
  },
  {
    text: "There are 3 deer stands in the north woods and 5 in the south. How many stands total?",
    answer: 8,
    choices: [8, 6, 10, 7],
    hint: "North stands plus south stands. Add 'em up, you need to know all your spots before the season opens.",
    emoji: "🦌",
  },
  {
    text: "A fishing trip lasts 3 hours. Titus caught 4 fish each hour. How many fish?",
    answer: 12,
    choices: [12, 7, 16, 9],
    hint: "Hours times fish per hour. Multiply it out, that's how you tally up a good day on the water.",
    emoji: "🎣",
  },
  {
    text: "Buck has 48 rounds of ammo. He uses 6 rounds each session. How many sessions can he go?",
    answer: 8,
    choices: [8, 6, 9, 42],
    hint: "Divide the total rounds by how many he uses each time. Division is just sharing equally, like splitting the load before a long hunt.",
    emoji: "🦆",
  },
  {
    text: "Titus and his dad went fishing 5 days. They caught 7 fish per day. Total fish?",
    answer: 35,
    choices: [35, 30, 40, 12],
    hint: "Days times fish per day. That's multiplication, count every day's catch and add 'em all together.",
    emoji: "🎣",
  },
  {
    text: "A deer weighs 180 lbs. After processing, you keep half. How many pounds of meat?",
    answer: 90,
    choices: [90, 80, 100, 60],
    hint: "Half means you divide by 2. The Lord provides, and then you steward what He gives, figure out what half of 180 is.",
    emoji: "🦌",
  },
  {
    text: "Titus has 3 fishing rods. Each rod has 4 lures on it. How many lures total?",
    answer: 12,
    choices: [12, 7, 16, 10],
    hint: "Rods times lures per rod. Multiply, you'll want to know exactly what you're workin' with before you hit the bank.",
    emoji: "🎣",
  },
  {
    text: "There were 24 ducks flying over. 8 landed in the pond. How many kept flying?",
    answer: 16,
    choices: [16, 18, 14, 32],
    hint: "Total ducks minus the ones that landed. Subtract to find out how many kept on going.",
    emoji: "🦆",
  },
  {
    text: "Titus drove 36 miles to the hunting lease and 36 miles back. Total miles?",
    answer: 72,
    choices: [72, 62, 36, 68],
    hint: "Same distance each way, add 'em together. Out and back, just like a good day on the lease.",
    emoji: "🚛",
  },
  {
    text: "A bass weighs 4 lbs. Titus caught 6 bass. How many pounds of fish total?",
    answer: 24,
    choices: [24, 20, 28, 10],
    hint: "Weight per fish times number of fish. Multiply, that's how you know if you've got enough for a fish fry.",
    emoji: "🐟",
  },
  {
    text: "Buck's truck gets 18 miles per gallon. He drove 54 miles. How many gallons did he use?",
    answer: 3,
    choices: [3, 6, 4, 2],
    hint: "Divide total miles by miles per gallon. You always gotta know your fuel before a long drive to the lease.",
    emoji: "🚛",
  },
  {
    text: "Titus planted 7 rows of food plot with 8 seeds each. How many seeds total?",
    answer: 56,
    choices: [56, 48, 63, 54],
    hint: "Rows times seeds per row. The farmer plants in rows so he can count his crop, you multiply to get the whole field.",
    emoji: "🌾",
  },
  {
    text: "It's 6:00 AM when they leave. They drive 2 hours to the lake. What time do they arrive?",
    answer: "8:00 AM",
    choices: ["8:00 AM", "7:00 AM", "9:00 AM", "6:30 AM"],
    hint: "Add 2 hours to 6:00 AM. Start time plus drive time, you gotta know when you're hittin' the water.",
    emoji: "🌅",
  },
  {
    text: "Titus wants to buy a fishing lure for $5. He has $23. How much will he have left?",
    answer: "$18",
    choices: ["$18", "$17", "$19", "$28"],
    hint: "Subtract the price from what you've got. A good hunter always knows what's left in his pocket after a trip to the bait shop.",
    emoji: "💵",
  },
];

function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function pickSet(): Problem[] {
  return shuffleArray(ALL_PROBLEMS).slice(0, SET_SIZE);
}

export default function TitusWordProblems() {
  const router = useRouter();

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
  const [questions, setQuestions] = useState<Problem[]>(() => pickSet());
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | string | null>(null);
  const [correct, setCorrect] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [xp, setXp] = useState(0);
  const [timer, setTimer] = useState(TIMER_DURATION);
  const [timedOut, setTimedOut] = useState(false);
  const [shakeBtn, setShakeBtn] = useState<number | string | null>(null);
  const [streakMsg, setStreakMsg] = useState("");
  const [totalSets, setTotalSets] = useState(0);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [totalAsked, setTotalAsked] = useState(0);
  const [correctFlash, setCorrectFlash] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [burstEmojis, setBurstEmojis] = useState<
    { id: number; emoji: string; x: number; y: number }[]
  >([]);

  function triggerBurst(emojis: string[]) {
    const newBursts = emojis.map((emoji, i) => ({
      id: Date.now() + i,
      emoji,
      x: 20 + Math.random() * 60,
      y: 20 + Math.random() * 40,
    }));
    setBurstEmojis((prev) => [...prev, ...newBursts]);
    setTimeout(
      () =>
        setBurstEmojis((prev) =>
          prev.filter((b) => !newBursts.find((n) => n.id === b.id))
        ),
      1500
    );
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
    setShowHint(false);
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

  function handleAnswer(
    choice: number | string,
    e: React.PointerEvent<HTMLButtonElement>
  ) {
    if (phase !== "playing") return;
    stopTimer();
    const isCorrect = choice === q.answer;

    setSelected(choice);

    if (isCorrect) {
      const elapsed = TIMER_DURATION - timer;
      const speedBonus = elapsed <= 4 ? 5 : 0;
      const gained = 10 + speedBonus;
      setCorrect((c) => c + 1);
      setXp((x) => x + gained);
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > bestStreak) setBestStreak(newStreak);

      setCorrectFlash(true);
      setTimeout(() => setCorrectFlash(false), 700);

      if (newStreak >= 5) {
        setStreakMsg("⚡ ON A ROLL!");
        if (soundOn) playLevelUp();
      } else if (newStreak >= 3) {
        setStreakMsg("🔥 BUCKED IT!");
        if (soundOn) playCorrect();
      } else {
        setStreakMsg("");
        if (soundOn) playCorrect();
      }

      burstConfetti(e.clientX, e.clientY, COLOR);
      triggerBurst(["🦌", "⭐", "🎣", "✨", "💫"]);
    } else {
      setStreak(0);
      setStreakMsg("");
      setShakeBtn(choice);
      if (soundOn) playWrong();
      setTimeout(() => setShakeBtn(null), 600);
      triggerBurst(["💪", "🔄", "😅"]);
    }

    setPhase("feedback");
  }

  function handleNext() {
    const isLast = current + 1 >= SET_SIZE;
    const wasCorrect = selected === q.answer;
    const newTotalCorrect = totalCorrect + (wasCorrect ? 1 : 0);
    const newTotalAsked = totalAsked + 1;

    if (isLast) {
      const setCorrectCount = correct + (wasCorrect ? 1 : 0);
      recordGameResult("titus", "wordproblems", setCorrectCount, SET_SIZE);
      addXP("titus", xp);
      recordSession("titus", "wordproblems");
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
      setShowHint(false);
      setPhase("playing");
    }
  }

  function startNewSet() {
    setQuestions(pickSet());
    setCurrent(0);
    setCorrect(0);
    setSelected(null);
    setStreak(0);
    setTimedOut(false);
    setStreakMsg("");
    setXp(0);
    setShowHint(false);
    setPhase("playing");
  }

  function goHome() {
    router.push("/kids/titus/hub");
  }

  // ── PREVIEW ────────────────────────────────────────────────────────────────
  if (phase === "preview") {
    return (
      <main
        className="min-h-screen flex flex-col items-center justify-center px-6 py-12 text-center max-w-sm mx-auto"
        style={{ background: "linear-gradient(160deg, #dbeafe 0%, #fff 70%)" }}
      >
        <button
          onPointerDown={toggleSound}
          className="fixed top-4 right-4 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-lg z-10"
          title={soundOn ? "Turn off sound" : "Turn on sound"}
        >
          {soundOn ? "🔊" : "🔇"}
        </button>

        <div className="text-7xl mb-4">🎣</div>
        <h1 className="text-4xl font-black mb-2" style={{ color: COLOR }}>
          Word Problems!
        </h1>
        <p className="text-gray-500 text-base mb-6">
          Hunting &amp; fishing math with Buck
        </p>

        <div
          className="rounded-2xl p-5 mb-8 text-left shadow-md w-full"
          style={{
            backgroundColor: COLOR + "12",
            border: `2px solid ${COLOR}30`,
          }}
        >
          <p className="font-black text-gray-700 text-lg mb-3">Today's plan:</p>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🦌</span>
              <span className="font-bold text-gray-700">5 outdoor math stories</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">🎉</span>
              <span className="font-bold text-gray-700">Celebration break</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">❓</span>
              <span className="font-bold text-gray-500 text-sm">
                Do 5 more? Your choice!
              </span>
            </div>
          </div>
        </div>

        <button
          onPointerDown={() => setPhase("playing")}
          className="w-full py-5 rounded-3xl font-black text-white text-xl shadow-xl active:scale-95 transition-all"
          style={{ backgroundColor: COLOR }}
        >
          Let's hunt some numbers! →
        </button>
        <button
          onPointerDown={goHome}
          className="mt-3 text-sm text-gray-400 underline"
        >
          Back to hub
        </button>
      </main>
    );
  }

  // ── SET-DONE ───────────────────────────────────────────────────────────────
  if (phase === "set-done") {
    const setScore = correct + (selected === q?.answer ? 1 : 0);
    const pct = Math.round((setScore / SET_SIZE) * 100);
    return (
      <main
        className="min-h-screen flex flex-col items-center justify-center px-6 py-12 text-center max-w-sm mx-auto"
        style={{ background: "linear-gradient(160deg, #dbeafe 0%, #fff 70%)" }}
      >
        <button
          onPointerDown={toggleSound}
          className="fixed top-4 right-4 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-lg z-10"
        >
          {soundOn ? "🔊" : "🔇"}
        </button>

        <div className="text-8xl mb-4 animate-bounce">
          {pct >= 80 ? "🏆" : pct >= 60 ? "🦌" : "💪"}
        </div>
        <h1 className="text-4xl font-black mb-1" style={{ color: COLOR }}>
          {pct >= 80
            ? "That's a trophy shot, son!"
            : pct >= 60
            ? "Good hunt!"
            : "Keep at it!"}
        </h1>
        <p className="text-gray-500 text-base mb-2">
          {setScore}/{SET_SIZE} correct, {pct}%
        </p>

        {/* Buck quote */}
        <div
          className="rounded-2xl p-4 mb-6 text-left w-full"
          style={{
            backgroundColor: COLOR + "10",
            border: `2px solid ${COLOR}25`,
          }}
        >
          <p className="text-sm text-gray-600 italic leading-relaxed">
            {pct >= 80
              ? "🦌 Buck tips his cap: \"Every good gift comes from above.\" You tracked those problems down like a seasoned hunter. Well done."
              : pct >= 60
              ? "🎣 Buck nods: \"You got most of 'em, son. Even the best fisherman loses a few. Keep workin' those skills.\""
              : "🦌 Buck grins: \"Every hunter misses sometimes. The Lord's not done with you yet. Get back out there.\""}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 w-full mb-8">
          <div className="bg-white rounded-2xl p-4 shadow-md text-center">
            <div
              className="text-3xl font-black"
              style={{ color: COLOR }}
            >
              {xp}
            </div>
            <div className="text-xs text-gray-400 mt-1">XP earned</div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-md text-center">
            <div className="text-3xl font-black text-orange-500">
              {bestStreak}
            </div>
            <div className="text-xs text-gray-400 mt-1">Best streak</div>
          </div>
        </div>

        <div className="flex flex-col gap-3 w-full">
          <button
            onPointerDown={startNewSet}
            className="py-5 rounded-3xl font-black text-white text-xl shadow-xl active:scale-95 transition-all"
            style={{ backgroundColor: COLOR }}
          >
            5 more problems! 🎣
          </button>
          <button
            onPointerDown={goHome}
            className="py-4 rounded-3xl font-black text-gray-600 bg-gray-100 transition-all text-lg"
          >
            I'm done for now 🏠
          </button>
        </div>
      </main>
    );
  }

  // ── GAME SCREEN ────────────────────────────────────────────────────────────
  const timerPct = (timer / TIMER_DURATION) * 100;
  const timerColor =
    timer <= 3 ? "#ef4444" : timer <= 5 ? "#f97316" : "#22c55e";

  const isCorrect = selected !== null && selected === q.answer;

  const remaining = SET_SIZE - current - 1;
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
      {/* Sound toggle */}
      <button
        onPointerDown={toggleSound}
        className="fixed top-4 right-4 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-lg z-10"
        title={soundOn ? "Turn off sound" : "Turn on sound"}
      >
        {soundOn ? "🔊" : "🔇"}
      </button>

      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <button
          onPointerDown={goHome}
          className="text-gray-400 text-sm font-medium"
        >
          ← Hub
        </button>
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

      {/* Correct flash */}
      {correctFlash && (
        <div
          className="text-center text-2xl font-black py-1 mb-2 rounded-xl animate-pulse"
          style={{ backgroundColor: "#dcfce7", color: "#16a34a" }}
        >
          That's it, son! ⭐
        </div>
      )}

      {/* Streak */}
      {streakMsg && (
        <div className="text-center text-lg font-black mb-2 animate-pulse">
          {streakMsg}
        </div>
      )}

      {/* Question card */}
      <div
        className="bg-white rounded-3xl shadow-lg p-6 mb-4 text-center"
        style={{ border: `3px solid ${COLOR}22` }}
      >
        {timedOut && phase === "feedback" ? (
          <div className="text-2xl font-black text-red-400">⏰ Time's up!</div>
        ) : (
          <>
            <div className="text-3xl mb-3">{q.emoji}</div>
            <p
              className="text-lg font-bold leading-snug text-gray-800"
            >
              {q.text}
            </p>
          </>
        )}
      </div>

      {/* Hint button (only during playing phase) */}
      {phase === "playing" && !showHint && (
        <button
          onPointerDown={() => setShowHint(true)}
          className="mb-3 text-sm font-bold px-4 py-2 rounded-full self-center"
          style={{
            backgroundColor: "#fef3c7",
            color: "#92400e",
            border: "2px solid #fde68a",
          }}
        >
          🦌 Ask Buck for a hint
        </button>
      )}

      {/* Hint text */}
      {showHint && phase === "playing" && (
        <div
          className="rounded-2xl p-3 mb-3 text-sm italic leading-relaxed text-gray-600"
          style={{
            backgroundColor: "#fef3c7",
            border: "2px solid #fde68a",
          }}
        >
          🦌 Buck says: "{q.hint}"
        </div>
      )}

      {/* Choices */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {q.choices.map((choice, idx) => {
          let bg = "#ffffff";
          let border = "#e5e7eb";
          let textColor = "#1f2937";
          if (phase === "feedback") {
            if (choice === q.answer) {
              bg = "#dcfce7";
              border = "#16a34a";
              textColor = "#15803d";
            } else if (choice === selected) {
              bg = "#fee2e2";
              border = "#dc2626";
              textColor = "#dc2626";
            } else {
              bg = "#f9fafb";
              textColor = "#9ca3af";
            }
          }
          return (
            <button
              key={idx}
              onPointerDown={(e) => handleAnswer(choice, e)}
              onPointerUp={() => {}}
              onPointerLeave={() => {}}
              disabled={phase === "feedback"}
              className="rounded-2xl font-black text-2xl py-5 shadow-md transition-all duration-150 active:scale-95 btn-bouncy"
              style={{
                backgroundColor: bg,
                border: `3px solid ${border}`,
                color: textColor,
                cursor: phase === "feedback" ? "default" : "pointer",
                animation:
                  shakeBtn === choice ? "shake 0.5s ease-in-out" : undefined,
              }}
            >
              {phase === "feedback" && choice === q.answer && "✅ "}
              {phase === "feedback" &&
                choice === selected &&
                choice !== q.answer &&
                "❌ "}
              {String(choice)}
            </button>
          );
        })}
      </div>

      {/* Feedback */}
      {phase === "feedback" && (
        <div>
          {/* Buck's feedback message */}
          <div
            className="rounded-2xl p-3 mb-3 text-center font-bold"
            style={{
              backgroundColor: isCorrect ? "#dcfce7" : "#fef3c7",
              color: isCorrect ? "#15803d" : "#92400e",
            }}
          >
            {timedOut
              ? `⏰ The answer was ${String(q.answer)}. Every hunter misses sometimes, son!`
              : isCorrect
              ? `🦌 That's it, son! You tracked that one down!`
              : `🎣 No worries, every hunter misses sometimes. The answer was ${String(q.answer)}.`}
          </div>

          {/* Buck's hint shown on wrong/timeout in feedback */}
          {!isCorrect && (
            <div
              className="rounded-2xl p-3 mb-3 text-sm italic text-gray-600 leading-relaxed"
              style={{
                backgroundColor: "#f0f9ff",
                border: "2px solid #bae6fd",
              }}
            >
              🦌 Buck explains: "{q.hint}"
            </div>
          )}

          <button
            onPointerDown={handleNext}
            className="w-full py-4 rounded-3xl font-black text-white text-xl shadow-lg active:scale-95 transition-all"
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
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 9999,
        }}
      >
        {burstEmojis.map((b) => (
          <div
            key={b.id}
            style={{
              position: "absolute",
              left: `${b.x}%`,
              top: `${b.y}%`,
              fontSize: "2rem",
              animation: "floatUp 1.5s ease forwards",
              userSelect: "none",
            }}
          >
            {b.emoji}
          </div>
        ))}
      </div>
    </main>
  );
}
