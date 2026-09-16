"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useTTS } from "@/lib/tts";
import { useRouter } from "next/navigation";
import { burstConfetti } from "@/lib/confetti";
import { getTitusSettings, setTitusSoundPref } from "@/lib/titus-settings";

// ─── Letter path data ────────────────────────────────────────────────────────
// Each letter has key waypoints (on a 200×200 grid) and an audio instruction.
// Capital letters only, the canvas draws a dotted guide from these points.

interface LetterDef {
  points: { x: number; y: number }[];
  instruction: string;
}

const LETTER_PATHS: Record<string, LetterDef> = {
  A: {
    points: [
      { x: 50, y: 180 }, { x: 100, y: 20 }, { x: 150, y: 180 },
      { x: 75, y: 110 }, { x: 125, y: 110 },
    ],
    instruction: "Start at the bottom left, go up to a point, then back down. Don't forget the crossbar in the middle!",
  },
  B: {
    points: [
      { x: 60, y: 20 }, { x: 60, y: 180 },
      { x: 60, y: 20 }, { x: 110, y: 20 }, { x: 130, y: 40 }, { x: 130, y: 80 }, { x: 110, y: 100 }, { x: 60, y: 100 },
      { x: 110, y: 100 }, { x: 135, y: 120 }, { x: 135, y: 160 }, { x: 110, y: 180 }, { x: 60, y: 180 },
    ],
    instruction: "Start at the top, go straight down. Then add two bumps on the right, a small bump, then a big bump!",
  },
  C: {
    points: [
      { x: 150, y: 50 }, { x: 110, y: 20 }, { x: 60, y: 40 },
      { x: 40, y: 80 }, { x: 40, y: 120 }, { x: 60, y: 160 },
      { x: 110, y: 180 }, { x: 150, y: 155 },
    ],
    instruction: "Make a big curved shape, like a backwards letter. Start at the top right and curve around!",
  },
  D: {
    points: [
      { x: 60, y: 20 }, { x: 60, y: 180 },
      { x: 60, y: 20 }, { x: 110, y: 20 }, { x: 150, y: 60 },
      { x: 150, y: 140 }, { x: 110, y: 180 }, { x: 60, y: 180 },
    ],
    instruction: "Start at the top, go straight down. Then add a big curve from the top to the bottom on the right!",
  },
  E: {
    points: [
      { x: 60, y: 20 }, { x: 60, y: 180 },
      { x: 60, y: 20 }, { x: 150, y: 20 },
      { x: 60, y: 100 }, { x: 130, y: 100 },
      { x: 60, y: 180 }, { x: 150, y: 180 },
    ],
    instruction: "Go straight down, then add three lines pointing right, one at the top, one in the middle, one at the bottom!",
  },
  F: {
    points: [
      { x: 60, y: 20 }, { x: 60, y: 180 },
      { x: 60, y: 20 }, { x: 150, y: 20 },
      { x: 60, y: 100 }, { x: 130, y: 100 },
    ],
    instruction: "Like the letter E, but no line at the bottom! Go down, then two lines pointing right.",
  },
  G: {
    points: [
      { x: 150, y: 50 }, { x: 110, y: 20 }, { x: 60, y: 40 },
      { x: 40, y: 80 }, { x: 40, y: 130 }, { x: 60, y: 165 },
      { x: 110, y: 185 }, { x: 150, y: 165 },
      { x: 150, y: 115 }, { x: 110, y: 115 },
    ],
    instruction: "Start like the letter C, then add a little shelf pointing inward on the right side!",
  },
  H: {
    points: [
      { x: 60, y: 20 }, { x: 60, y: 180 },
      { x: 60, y: 100 }, { x: 140, y: 100 },
      { x: 140, y: 20 }, { x: 140, y: 180 },
    ],
    instruction: "Two tall lines going down, then connect them in the middle with a crossbar!",
  },
  I: {
    points: [
      { x: 100, y: 20 }, { x: 100, y: 180 },
      { x: 70, y: 20 }, { x: 130, y: 20 },
      { x: 70, y: 180 }, { x: 130, y: 180 },
    ],
    instruction: "One line straight down! Add a little hat on top and a little platform at the bottom.",
  },
  J: {
    points: [
      { x: 70, y: 20 }, { x: 130, y: 20 },
      { x: 110, y: 20 }, { x: 110, y: 150 },
      { x: 110, y: 165 }, { x: 90, y: 185 }, { x: 60, y: 175 }, { x: 55, y: 155 },
    ],
    instruction: "Start with a little hat, then go down and add a hook curving to the left at the bottom!",
  },
  K: {
    points: [
      { x: 60, y: 20 }, { x: 60, y: 180 },
      { x: 150, y: 20 }, { x: 60, y: 100 },
      { x: 60, y: 100 }, { x: 150, y: 180 },
    ],
    instruction: "One tall line down, then kick out two diagonal lines from the middle, like a leg kicking!",
  },
  L: {
    points: [
      { x: 60, y: 20 }, { x: 60, y: 180 },
      { x: 60, y: 180 }, { x: 150, y: 180 },
    ],
    instruction: "Go straight down, then take a right turn at the bottom!",
  },
  M: {
    points: [
      { x: 40, y: 180 }, { x: 40, y: 20 },
      { x: 40, y: 20 }, { x: 100, y: 100 },
      { x: 100, y: 100 }, { x: 160, y: 20 },
      { x: 160, y: 20 }, { x: 160, y: 180 },
    ],
    instruction: "Two tall lines. Connect the tops with a V shape going down in the middle, like a mountain!",
  },
  N: {
    points: [
      { x: 50, y: 180 }, { x: 50, y: 20 },
      { x: 50, y: 20 }, { x: 150, y: 180 },
      { x: 150, y: 180 }, { x: 150, y: 20 },
    ],
    instruction: "Two tall lines. Connect top-left to bottom-right with a diagonal line!",
  },
  O: {
    points: [
      { x: 100, y: 20 }, { x: 150, y: 60 }, { x: 160, y: 100 },
      { x: 150, y: 140 }, { x: 100, y: 180 },
      { x: 50, y: 140 }, { x: 40, y: 100 }, { x: 50, y: 60 }, { x: 100, y: 20 },
    ],
    instruction: "Make a big oval! Start at the top and curve all the way around until you meet the top again.",
  },
  P: {
    points: [
      { x: 60, y: 20 }, { x: 60, y: 180 },
      { x: 60, y: 20 }, { x: 120, y: 20 }, { x: 145, y: 45 },
      { x: 145, y: 80 }, { x: 120, y: 100 }, { x: 60, y: 100 },
    ],
    instruction: "Go straight down, then add one bump on the upper right!",
  },
  Q: {
    points: [
      { x: 100, y: 20 }, { x: 150, y: 60 }, { x: 160, y: 100 },
      { x: 150, y: 140 }, { x: 100, y: 180 },
      { x: 50, y: 140 }, { x: 40, y: 100 }, { x: 50, y: 60 }, { x: 100, y: 20 },
      { x: 115, y: 145 }, { x: 155, y: 185 },
    ],
    instruction: "Make the letter O first, then add a little tail on the bottom right, like a Q has a tail!",
  },
  R: {
    points: [
      { x: 60, y: 20 }, { x: 60, y: 180 },
      { x: 60, y: 20 }, { x: 120, y: 20 }, { x: 145, y: 45 },
      { x: 145, y: 80 }, { x: 120, y: 100 }, { x: 60, y: 100 },
      { x: 80, y: 100 }, { x: 150, y: 180 },
    ],
    instruction: "Like the letter P, but with a leg kicking out to the right from the bump!",
  },
  S: {
    points: [
      { x: 150, y: 45 }, { x: 110, y: 20 }, { x: 65, y: 35 },
      { x: 45, y: 70 }, { x: 80, y: 100 }, { x: 130, y: 115 },
      { x: 155, y: 145 }, { x: 135, y: 170 },
      { x: 90, y: 185 }, { x: 50, y: 165 },
    ],
    instruction: "Make two curves in opposite directions, like a snake winding its body!",
  },
  T: {
    points: [
      { x: 40, y: 20 }, { x: 160, y: 20 },
      { x: 100, y: 20 }, { x: 100, y: 180 },
    ],
    instruction: "Make a hat across the top, then go straight down from the middle!",
  },
  U: {
    points: [
      { x: 50, y: 20 }, { x: 50, y: 140 },
      { x: 50, y: 155 }, { x: 65, y: 180 }, { x: 100, y: 188 },
      { x: 135, y: 180 }, { x: 150, y: 155 }, { x: 150, y: 140 },
      { x: 150, y: 20 },
    ],
    instruction: "Two lines going down, then curve the bottom to connect them, like a bucket!",
  },
  V: {
    points: [
      { x: 40, y: 20 }, { x: 100, y: 180 },
      { x: 100, y: 180 }, { x: 160, y: 20 },
    ],
    instruction: "Two diagonal lines meeting at a point at the bottom, like an upside-down mountain!",
  },
  W: {
    points: [
      { x: 30, y: 20 }, { x: 65, y: 180 },
      { x: 65, y: 180 }, { x: 100, y: 100 },
      { x: 100, y: 100 }, { x: 135, y: 180 },
      { x: 135, y: 180 }, { x: 170, y: 20 },
    ],
    instruction: "Like two V letters side by side, four diagonal lines making a W shape!",
  },
  X: {
    points: [
      { x: 40, y: 20 }, { x: 160, y: 180 },
      { x: 160, y: 20 }, { x: 40, y: 180 },
    ],
    instruction: "Two diagonal lines crossing in the middle, like an X marks the spot!",
  },
  Y: {
    points: [
      { x: 40, y: 20 }, { x: 100, y: 100 },
      { x: 160, y: 20 }, { x: 100, y: 100 },
      { x: 100, y: 100 }, { x: 100, y: 180 },
    ],
    instruction: "Two diagonals meeting in the middle, then one line going straight down from there!",
  },
  Z: {
    points: [
      { x: 40, y: 20 }, { x: 160, y: 20 },
      { x: 160, y: 20 }, { x: 40, y: 180 },
      { x: 40, y: 180 }, { x: 160, y: 180 },
    ],
    instruction: "A line across the top, a diagonal line down to the bottom-left, then a line across the bottom!",
  },
};

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const SESSION_LENGTH = 3; // 3 letters per session (ADHD: short bursts)
const COLOR = "#2563eb";
const CANVAS_SIZE = 240;
const HIT_RADIUS = 22; // px within a waypoint counts as "hit"
const PASS_THRESHOLD = 0.70; // 70% of waypoints covered = good job

// ─── Helpers ─────────────────────────────────────────────────────────────────

function pickSessionLetters(): string[] {
  const shuffled = [...LETTERS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, SESSION_LENGTH);
}

function drawGuide(ctx: CanvasRenderingContext2D, letter: string) {
  const def = LETTER_PATHS[letter];
  if (!def) return;
  ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  ctx.strokeStyle = "#d1d5db";
  ctx.lineWidth = 2;
  ctx.setLineDash([6, 6]);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  const pts = def.points;
  if (pts.length === 0) return;
  ctx.moveTo(pts[0].x, pts[0].y);
  for (let i = 1; i < pts.length; i++) {
    ctx.lineTo(pts[i].x, pts[i].y);
  }
  ctx.stroke();
  ctx.setLineDash([]);

  // Draw waypoint dots
  ctx.fillStyle = "#e5e7eb";
  for (const p of pts) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
    ctx.fill();
  }
}

function redrawUserStrokes(
  ctx: CanvasRenderingContext2D,
  strokes: { x: number; y: number }[][],
  hitPts: Set<number>
) {
  for (const stroke of strokes) {
    if (stroke.length < 2) continue;
    ctx.beginPath();
    ctx.strokeStyle = COLOR;
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.moveTo(stroke[0].x, stroke[0].y);
    for (let i = 1; i < stroke.length; i++) {
      ctx.lineTo(stroke[i].x, stroke[i].y);
    }
    ctx.stroke();
  }

  // Highlight hit waypoints in green
  const def = LETTER_PATHS[Object.keys(LETTER_PATHS)[0]]; // just for reference
  void def; // unused, hit markers are index-based
  if (hitPts.size > 0) {
    ctx.fillStyle = "#22c55e";
    // We can't easily get back the letter here; caller handles this
  }
}

function checkHits(
  point: { x: number; y: number },
  waypoints: { x: number; y: number }[],
  hit: Set<number>
): Set<number> {
  const next = new Set(hit);
  for (let i = 0; i < waypoints.length; i++) {
    if (next.has(i)) continue;
    const dx = point.x - waypoints[i].x;
    const dy = point.y - waypoints[i].y;
    if (Math.sqrt(dx * dx + dy * dy) <= HIT_RADIUS) {
      next.add(i);
    }
  }
  return next;
}

// ─── Component ───────────────────────────────────────────────────────────────

type Phase = "preview" | "intro" | "tracing" | "result" | "done";

export default function HandwritingPractice() {
  const router = useRouter();
  const canvasRef = useRef<any>(null);
  const { speak } = useTTS("onyx");

  const [soundOn, setSoundOn] = useState(true);
  const [sessionLetters] = useState<string[]>(() => pickSessionLetters());
  const [currentIdx, setCurrentIdx] = useState(0);
  const [phase, setPhase] = useState<Phase>("preview");
  const [isDrawing, setIsDrawing] = useState(false);
  const [strokes, setStrokes] = useState<{ x: number; y: number }[][]>([]);
  const [currentStroke, setCurrentStroke] = useState<{ x: number; y: number }[]>([]);
  const [hitWaypoints, setHitWaypoints] = useState<Set<number>>(new Set());
  const [passed, setPassed] = useState(false);

  const currentLetter = sessionLetters[currentIdx];
  const letterDef = LETTER_PATHS[currentLetter];

  // ── Sound ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    setSoundOn(getTitusSettings().soundEnabled);
  }, []);

  function toggleSound() {
    const next = !soundOn;
    setSoundOn(next);
    setTitusSoundPref(next);
  }

  function speakIfOn(text: string) {
    if (!soundOn) return;
    speak(text);
  }

  // ── Canvas drawing ──────────────────────────────────────────────────────────
  const redraw = useCallback(
    (strokeList: { x: number; y: number }[][], hits: Set<number>) => {
      const canvas = canvasRef.current as HTMLCanvasElement | null;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      drawGuide(ctx, currentLetter);
      redrawUserStrokes(ctx, strokeList, hits);

      // Re-draw hit waypoints in green
      const pts = LETTER_PATHS[currentLetter]?.points ?? [];
      for (const i of hits) {
        const p = pts[i];
        if (!p) continue;
        ctx.beginPath();
        ctx.fillStyle = "#22c55e";
        ctx.arc(p.x, p.y, 7, 0, Math.PI * 2);
        ctx.fill();
      }
    },
    [currentLetter]
  );

  // Draw guide whenever letter changes
  useEffect(() => {
    const canvas = canvasRef.current as HTMLCanvasElement | null;
    if (!canvas || phase !== "tracing") return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    drawGuide(ctx, currentLetter);
  }, [currentLetter, phase]);

  // ── Pointer handlers ────────────────────────────────────────────────────────
  function getPos(
    e: React.PointerEvent<HTMLCanvasElement>
  ): { x: number; y: number } {
    const canvas = canvasRef.current as HTMLCanvasElement;
    const rect = canvas.getBoundingClientRect();
    const scaleX = CANVAS_SIZE / rect.width;
    const scaleY = CANVAS_SIZE / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  }

  function onPointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    if (phase !== "tracing") return;
    (e.target as HTMLCanvasElement).setPointerCapture(e.pointerId);
    setIsDrawing(true);
    const pos = getPos(e);
    setCurrentStroke([pos]);
  }

  function onPointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!isDrawing || phase !== "tracing") return;
    const pos = getPos(e);
    const next = [...currentStroke, pos];
    setCurrentStroke(next);

    // Check hits live
    const newHits = checkHits(pos, letterDef?.points ?? [], hitWaypoints);
    if (newHits.size !== hitWaypoints.size) {
      setHitWaypoints(newHits);
    }

    // Live draw
    const canvas = canvasRef.current as HTMLCanvasElement | null;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    redraw([...strokes, next], newHits);
  }

  function onPointerUp() {
    if (!isDrawing) return;
    setIsDrawing(false);
    const finishedStrokes = [...strokes, currentStroke];
    setStrokes(finishedStrokes);
    setCurrentStroke([]);
    redraw(finishedStrokes, hitWaypoints);
  }

  // ── Letter intro ───────────────────────────────────────────────────────────
  function startLetter() {
    setStrokes([]);
    setCurrentStroke([]);
    setHitWaypoints(new Set());
    setPassed(false);
    setPhase("tracing");
    // Small delay so canvas renders before we speak
    setTimeout(() => {
      speakIfOn(`${currentLetter}! ${letterDef?.instruction ?? ""}`);
    }, 300);
  }

  // ── Check result ────────────────────────────────────────────────────────────
  function checkResult() {
    const total = letterDef?.points.length ?? 1;
    const pct = hitWaypoints.size / total;
    const ok = pct >= PASS_THRESHOLD;
    setPassed(ok);
    setPhase("result");
    if (ok) {
      speakIfOn(`Great job on the letter ${currentLetter}!`);
    } else {
      speakIfOn(`Nice try! Let's trace the letter ${currentLetter} again.`);
    }
  }

  function tryAgain() {
    setStrokes([]);
    setCurrentStroke([]);
    setHitWaypoints(new Set());
    setPassed(false);
    setPhase("tracing");
    setTimeout(() => {
      const canvas = canvasRef.current as HTMLCanvasElement | null;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      drawGuide(ctx, currentLetter);
    }, 50);
    speakIfOn(`${currentLetter}, let's try again!`);
  }

  function nextLetter() {
    if (currentIdx + 1 >= SESSION_LENGTH) {
      setPhase("done");
      speakIfOn("Amazing handwriting practice! You did all three letters!");
    } else {
      setCurrentIdx((i) => i + 1);
      setStrokes([]);
      setCurrentStroke([]);
      setHitWaypoints(new Set());
      setPassed(false);
      setPhase("intro");
    }
  }

  // When phase moves to intro, speak the letter name
  useEffect(() => {
    if (phase === "intro") {
      speakIfOn(`Next letter: ${currentLetter}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, currentIdx]);

  // ── PREVIEW ────────────────────────────────────────────────────────────────
  if (phase === "preview") {
    return (
      <main
        className="min-h-screen flex flex-col items-center justify-center px-6 py-12 text-center max-w-sm mx-auto"
        style={{ background: "linear-gradient(160deg, #dbeafe 0%, #fff 70%)" }}
      >
        <button
          onClick={toggleSound}
          className="fixed top-4 right-4 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-lg hover:shadow-lg transition-shadow z-10"
        >
          {soundOn ? "🔊" : "🔇"}
        </button>

        <div className="text-7xl mb-5">✏️</div>
        <h1 className="text-4xl font-black mb-2" style={{ color: COLOR }}>
          Handwriting Practice
        </h1>
        <p className="text-gray-500 mb-6">Trace the letters to practice your handwriting!</p>

        <div
          className="rounded-2xl p-5 mb-8 text-left w-full"
          style={{ backgroundColor: COLOR + "10", border: `2px solid ${COLOR}25` }}
        >
          <p className="font-black text-gray-700 mb-3">Today:</p>
          <div className="flex flex-col gap-2">
            {sessionLetters.map((l, i) => (
              <div key={l} className="flex items-center gap-3">
                <span
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-black text-white"
                  style={{ backgroundColor: COLOR }}
                >
                  {i + 1}
                </span>
                <span className="font-black text-gray-700 text-xl">{l}</span>
              </div>
            ))}
          </div>
          <p className="text-gray-400 text-xs mt-3">Then you're done! 🎉</p>
        </div>

        <button
          onClick={() => {
            setPhase("intro");
          }}
          className="w-full py-5 rounded-3xl font-black text-white text-xl shadow-xl hover:opacity-90 active:scale-95 transition-all"
          style={{ backgroundColor: COLOR }}
        >
          Let's practice! →
        </button>
        <button
          onClick={() => router.push("/kids/titus/hub")}
          className="mt-3 text-sm text-gray-400 underline hover:text-gray-600"
        >
          Back to hub
        </button>
      </main>
    );
  }

  // ── DONE ───────────────────────────────────────────────────────────────────
  if (phase === "done") {
    return (
      <main
        className="min-h-screen flex flex-col items-center justify-center px-6 py-12 text-center max-w-sm mx-auto"
        style={{ background: "linear-gradient(160deg, #dbeafe 0%, #fff 70%)" }}
      >
        <button
          onClick={toggleSound}
          className="fixed top-4 right-4 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-lg hover:shadow-lg transition-shadow z-10"
        >
          {soundOn ? "🔊" : "🔇"}
        </button>

        <div className="text-9xl mb-4 animate-bounce">🦁</div>
        <h1 className="text-4xl font-black mb-2" style={{ color: COLOR }}>
          Great handwriting practice!
        </h1>
        <p className="text-gray-500 text-lg mb-2">
          You practiced: {sessionLetters.join(", ")}
        </p>
        <p className="text-gray-400 text-sm mb-8">
          Keep practicing and you'll be a handwriting pro!
        </p>

        <div className="flex flex-col gap-3 w-full">
          <button
            onClick={() => {
              router.refresh();
              // Re-mount with new letters by navigating to same page
              router.push("/kids/titus/play/handwriting");
            }}
            className="py-5 rounded-3xl font-black text-white text-xl shadow-xl hover:opacity-90 active:scale-95 transition-all"
            style={{ backgroundColor: COLOR }}
          >
            Practice more letters ✏️
          </button>
          <button
            onClick={() => router.push("/kids/titus/hub")}
            className="py-4 rounded-3xl font-black text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all text-lg"
          >
            I'm done for today 🏠
          </button>
        </div>
      </main>
    );
  }

  // ── INTRO ──────────────────────────────────────────────────────────────────
  if (phase === "intro") {
    const remaining = SESSION_LENGTH - currentIdx;
    return (
      <main
        className="min-h-screen flex flex-col items-center justify-center px-6 py-12 text-center max-w-sm mx-auto"
        style={{ background: "linear-gradient(160deg, #dbeafe 0%, #fff 70%)" }}
      >
        <button
          onClick={toggleSound}
          className="fixed top-4 right-4 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-lg hover:shadow-lg transition-shadow z-10"
        >
          {soundOn ? "🔊" : "🔇"}
        </button>

        {/* Progress dots */}
        <div className="flex gap-3 mb-8">
          {sessionLetters.map((_, i) => (
            <div
              key={i}
              className="w-4 h-4 rounded-full transition-all"
              style={{
                backgroundColor: i < currentIdx ? "#22c55e" : i === currentIdx ? COLOR : "#e5e7eb",
              }}
            />
          ))}
        </div>

        <div
          className="w-40 h-40 rounded-3xl flex items-center justify-center mb-6 shadow-lg"
          style={{ backgroundColor: COLOR + "15", border: `3px solid ${COLOR}30` }}
        >
          <span className="font-black" style={{ fontSize: 96, color: COLOR, lineHeight: 1 }}>
            {currentLetter}
          </span>
        </div>

        <p className="text-gray-500 text-base mb-2 px-4">
          {letterDef?.instruction}
        </p>
        <p className="text-gray-400 text-xs mb-8">
          {remaining} letter{remaining !== 1 ? "s" : ""} left this session
        </p>

        <button
          onClick={startLetter}
          className="w-full py-5 rounded-3xl font-black text-white text-xl shadow-xl hover:opacity-90 active:scale-95 transition-all"
          style={{ backgroundColor: COLOR }}
        >
          Trace the letter {currentLetter} →
        </button>
      </main>
    );
  }

  // ── TRACING ────────────────────────────────────────────────────────────────
  const hitPct = letterDef
    ? Math.round((hitWaypoints.size / letterDef.points.length) * 100)
    : 0;

  if (phase === "tracing") {
    return (
      <main
        className="min-h-screen flex flex-col items-center px-4 pt-6 pb-10 max-w-sm mx-auto"
        style={{ background: "linear-gradient(160deg, #dbeafe 0%, #ffffff 70%)" }}
      >
        <button
          onClick={toggleSound}
          className="fixed top-4 right-4 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-lg hover:shadow-lg transition-shadow z-10"
        >
          {soundOn ? "🔊" : "🔇"}
        </button>

        {/* Header */}
        <div className="flex items-center justify-between w-full mb-4">
          <button
            onClick={() => router.push("/kids/titus/hub")}
            className="text-gray-400 hover:text-gray-600 text-sm font-medium"
          >
            ← Hub
          </button>
          <span className="font-black text-gray-500 text-sm">
            Letter {currentIdx + 1} of {SESSION_LENGTH}
          </span>
          <div style={{ width: 40 }} />
        </div>

        {/* Instruction */}
        <div
          className="w-full rounded-2xl p-4 mb-4 text-center"
          style={{ backgroundColor: COLOR + "12", border: `2px solid ${COLOR}25` }}
        >
          <p className="font-black text-xl mb-1" style={{ color: COLOR }}>
            Trace the letter {currentLetter}
          </p>
          <p className="text-gray-500 text-xs">{letterDef?.instruction}</p>
        </div>

        {/* Canvas */}
        <div
          className="rounded-3xl overflow-hidden shadow-xl mb-4"
          style={{ border: `3px solid ${COLOR}30` }}
        >
          <canvas
            ref={canvasRef}
            width={CANVAS_SIZE}
            height={CANVAS_SIZE}
            style={{
              width: CANVAS_SIZE,
              height: CANVAS_SIZE,
              background: "#ffffff",
              touchAction: "none",
              cursor: "crosshair",
              display: "block",
            }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerLeave={onPointerUp}
          />
        </div>

        {/* Coverage bar */}
        <div className="w-full mb-4">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>Tracing coverage</span>
            <span>{hitPct}%</span>
          </div>
          <div className="bg-gray-100 rounded-full h-3 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${hitPct}%`,
                backgroundColor: hitPct >= 70 ? "#22c55e" : COLOR,
              }}
            />
          </div>
        </div>

        <div className="flex gap-3 w-full">
          <button
            onClick={() => {
              setStrokes([]);
              setCurrentStroke([]);
              setHitWaypoints(new Set());
              const canvas = canvasRef.current as HTMLCanvasElement | null;
              if (canvas) {
                const ctx = canvas.getContext("2d");
                if (ctx) drawGuide(ctx, currentLetter);
              }
            }}
            className="flex-1 py-4 rounded-2xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all text-sm"
          >
            Clear ↺
          </button>
          <button
            onClick={checkResult}
            className="flex-2 flex-1 py-4 rounded-2xl font-black text-white text-base shadow-lg hover:opacity-90 active:scale-95 transition-all"
            style={{ backgroundColor: COLOR }}
          >
            Done! Check it →
          </button>
        </div>
      </main>
    );
  }

  // ── RESULT ─────────────────────────────────────────────────────────────────
  if (phase === "result") {
    return (
      <main
        className="min-h-screen flex flex-col items-center justify-center px-6 py-12 text-center max-w-sm mx-auto"
        style={{ background: "linear-gradient(160deg, #dbeafe 0%, #fff 70%)" }}
      >
        <button
          onClick={toggleSound}
          className="fixed top-4 right-4 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-lg hover:shadow-lg transition-shadow z-10"
        >
          {soundOn ? "🔊" : "🔇"}
        </button>

        <div className={`text-8xl mb-4 ${passed ? "animate-bounce" : ""}`}>
          {passed ? "🦁" : "💪"}
        </div>
        <h1 className="text-4xl font-black mb-2" style={{ color: passed ? "#16a34a" : COLOR }}>
          {passed ? "Good job! 🦁" : "Nice try!"}
        </h1>
        <p className="text-gray-500 text-base mb-2">
          Letter {currentLetter}, {hitPct}% coverage
        </p>
        {!passed && (
          <p className="text-gray-400 text-sm mb-6">
            Try tracing more of the dotted lines, you need 70% to pass!
          </p>
        )}
        {passed && (
          <p className="text-gray-400 text-sm mb-6">
            {currentIdx + 1 < SESSION_LENGTH
              ? `${SESSION_LENGTH - currentIdx - 1} more letter${SESSION_LENGTH - currentIdx - 1 !== 1 ? "s" : ""} to go!`
              : "That was the last one, amazing work!"}
          </p>
        )}

        <div className="flex flex-col gap-3 w-full mt-4">
          {passed ? (
            <button
              onClick={nextLetter}
              className="py-5 rounded-3xl font-black text-white text-xl shadow-xl hover:opacity-90 active:scale-95 transition-all"
              style={{ backgroundColor: COLOR }}
            >
              {currentIdx + 1 < SESSION_LENGTH ? "Next letter →" : "See my results! 🎉"}
            </button>
          ) : (
            <button
              onClick={tryAgain}
              className="py-5 rounded-3xl font-black text-white text-xl shadow-xl hover:opacity-90 active:scale-95 transition-all"
              style={{ backgroundColor: COLOR }}
            >
              Try again ↺
            </button>
          )}
          <button
            onClick={() => router.push("/kids/titus/hub")}
            className="py-3 rounded-2xl font-bold text-gray-400 text-sm hover:text-gray-600 transition-colors"
          >
            Back to hub
          </button>
        </div>
      </main>
    );
  }

  return null;
}
