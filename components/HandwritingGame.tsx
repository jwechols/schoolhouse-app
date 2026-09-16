"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { recordGameResult } from "@/lib/family-data";

const CONTENT: Record<string, string[]> = {
  lois: ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"],
  mercy: ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","cat","dog","hat","sit","cup","big","fox","run","hop","red"],
  titus: ["dog","fish","boat","rock","tree","rain","God","trust","brave","Work hard.","God is good.","Trust in God.","Peter caught fish.","David was brave.","Jesus loves me."],
  truma: ["perseverance","righteousness","Sola Scriptura","Renaissance","The Lord gives wisdom.","Train up a child.","God's grace is sufficient.","In the beginning, God created.","We hold these truths."],
};

type UiSize = "normal" | "large" | "xlarge";

interface Props {
  kidId: string;
  colorHex: string;
  uiSize?: UiSize;
  backHref: string;
}

type Phase = "intro" | "trace" | "paper" | "done";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const LINE_W: Record<UiSize, number> = { normal: 7, large: 9, xlarge: 12 };
const FONT_SIZE: Record<UiSize, number> = { normal: 72, large: 80, xlarge: 88 };

const BTN_BASE = "font-bold rounded-sm transition-colors text-white";
const BTN_SIZE: Record<UiSize, string> = {
  normal: "text-base px-5 py-2.5",
  large: "text-lg px-6 py-3",
  xlarge: "text-xl px-7 py-4",
};
const TEXT_SIZE: Record<UiSize, string> = {
  normal: "text-base",
  large: "text-lg",
  xlarge: "text-xl",
};
const HEAD_SIZE: Record<UiSize, string> = {
  normal: "text-xl",
  large: "text-2xl",
  xlarge: "text-3xl",
};

export default function HandwritingGame({ kidId, colorHex, uiSize = "normal", backHref }: Props) {
  const items = useRef<string[]>([]);
  const [phase, setPhase] = useState<Phase>("intro");
  const [index, setIndex] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);

  useEffect(() => {
    const pool = CONTENT[kidId] ?? CONTENT["truma"];
    items.current = shuffle(pool).slice(0, 5);
  }, [kidId]);

  const currentItem = items.current[index] ?? "";

  const drawModel = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const W = canvas.width;
    const H = canvas.height;

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#fafaf9";
    ctx.fillRect(0, 0, W, H);

    // horizontal guide lines
    ctx.strokeStyle = "#e5e7eb";
    ctx.lineWidth = 1;
    for (let i = 1; i <= 3; i++) {
      ctx.beginPath();
      ctx.moveTo(0, (i * H) / 4);
      ctx.lineTo(W, (i * H) / 4);
      ctx.stroke();
    }

    // red baseline
    ctx.strokeStyle = "#fca5a5";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, H * 0.78);
    ctx.lineTo(W, H * 0.78);
    ctx.stroke();

    // model text
    const fontSize = FONT_SIZE[uiSize];
    ctx.font = `${fontSize}px Georgia, serif`;
    ctx.fillStyle = "#d1d5db";
    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";
    ctx.fillText(currentItem, W / 2, H * 0.78, W - 40);
  }, [currentItem, uiSize]);

  useEffect(() => {
    if (phase === "trace") drawModel();
  }, [phase, drawModel]);

  function getPos(
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>,
    canvas: HTMLCanvasElement
  ) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    if ("touches" in e) {
      const t = e.touches[0];
      return { x: (t.clientX - rect.left) * scaleX, y: (t.clientY - rect.top) * scaleY };
    }
    return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY };
  }

  function startDraw(e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas || phase !== "trace") return;
    drawing.current = true;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const { x, y } = getPos(e, canvas);
    ctx.beginPath();
    ctx.moveTo(x, y);
  }

  function moveDraw(e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) {
    e.preventDefault();
    if (!drawing.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const { x, y } = getPos(e, canvas);
    ctx.lineWidth = LINE_W[uiSize];
    ctx.strokeStyle = colorHex;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  }

  function endDraw(e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) {
    e.preventDefault();
    drawing.current = false;
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) ctx.beginPath();
  }

  function clearCanvas() {
    drawModel();
  }

  function advanceFromTrace() {
    setPhase("paper");
  }

  function advanceFromPaper() {
    if (index + 1 < items.current.length) {
      setIndex((i) => i + 1);
      setPhase("trace");
    } else {
      if (kidId !== "truma") {
        recordGameResult(kidId, "handwriting", items.current.length, items.current.length);
      }
      setPhase("done");
    }
  }

  const btnCls = `${BTN_BASE} ${BTN_SIZE[uiSize]}`;

  if (phase === "intro") {
    return (
      <div className="min-h-screen bg-parchment flex flex-col items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <p className="text-5xl mb-4">✏️</p>
          <h1
            className={`font-bold text-navy mb-2 ${HEAD_SIZE[uiSize]}`}
            style={{ fontFamily: "Georgia, serif" }}
          >
            Handwriting Practice
          </h1>
          <p className={`text-stone mb-6 ${TEXT_SIZE[uiSize]}`}>
            You&apos;ll practice <strong>5</strong> items today.
            <br />Trace on screen, then write on paper!
          </p>
          <button
            className={btnCls}
            style={{ backgroundColor: colorHex }}
            onClick={() => setPhase("trace")}
          >
            Let&apos;s Go!
          </button>
          <div className="mt-4">
            <a href={backHref} className="text-sm text-stone underline hover:text-navy">
              ← Back
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (phase === "trace") {
    return (
      <div className="min-h-screen bg-parchment px-4 py-6 flex flex-col items-center">
        <div className="w-full max-w-2xl">
          <div className="flex items-center justify-between mb-4">
            <a href={backHref} className="text-sm text-stone underline hover:text-navy">
              ← Back
            </a>
            <span className="text-sm text-stone font-semibold">
              {index + 1} / {items.current.length}
            </span>
          </div>

          <h2
            className={`font-bold text-navy mb-1 ${HEAD_SIZE[uiSize]}`}
            style={{ fontFamily: "Georgia, serif" }}
          >
            Trace it!
          </h2>
          <p className={`text-stone mb-3 ${TEXT_SIZE[uiSize]}`}>
            Trace the gray letters with your finger.
          </p>

          <div
            className="border-2 rounded-sm overflow-hidden mb-3"
            style={{ borderColor: colorHex }}
          >
            <canvas
              ref={canvasRef}
              width={600}
              height={240}
              className="w-full touch-none block"
              onMouseDown={startDraw}
              onMouseMove={moveDraw}
              onMouseUp={endDraw}
              onMouseLeave={endDraw}
              onTouchStart={startDraw}
              onTouchMove={moveDraw}
              onTouchEnd={endDraw}
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={clearCanvas}
              className={`${BTN_SIZE[uiSize]} font-bold rounded-sm border-2 bg-bone text-navy hover:bg-parchment transition-colors`}
              style={{ borderColor: colorHex }}
            >
              Clear
            </button>
            <button
              onClick={advanceFromTrace}
              className={btnCls}
              style={{ backgroundColor: colorHex }}
            >
              Done Tracing →
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (phase === "paper") {
    return (
      <div className="min-h-screen bg-parchment flex flex-col items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <p className="text-4xl mb-4">📝</p>
          <h2
            className={`font-bold text-navy mb-3 ${HEAD_SIZE[uiSize]}`}
            style={{ fontFamily: "Georgia, serif" }}
          >
            Now write it on paper!
          </h2>

          <div
            className="font-bold mb-4 px-4 py-4 bg-bone rounded-sm border-2"
            style={{
              color: colorHex,
              borderColor: colorHex,
              fontFamily: "Georgia, serif",
              fontSize: uiSize === "xlarge" ? "3rem" : uiSize === "large" ? "2.5rem" : "2rem",
            }}
          >
            {currentItem}
          </div>

          <p className={`text-stone mb-6 ${TEXT_SIZE[uiSize]}`}>
            Write <strong style={{ color: colorHex }}>&ldquo;{currentItem}&rdquo;</strong> three times on your lined paper.
          </p>

          <button
            className={btnCls}
            style={{ backgroundColor: colorHex }}
            onClick={advanceFromPaper}
          >
            ✓ Done Writing
          </button>

          <div className="mt-3 text-xs text-stone">
            {index + 1} of {items.current.length}
          </div>
        </div>
      </div>
    );
  }

  // done
  return (
    <div className="min-h-screen bg-parchment flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <p className="text-5xl mb-4">🌟</p>
        <h2
          className={`font-bold text-navy mb-2 ${HEAD_SIZE[uiSize]}`}
          style={{ fontFamily: "Georgia, serif" }}
        >
          Great work!
        </h2>
        <p className={`text-stone mb-6 ${TEXT_SIZE[uiSize]}`}>
          You practiced {items.current.length} items today!
        </p>
        <a
          href={backHref}
          className={`inline-block ${btnCls}`}
          style={{ backgroundColor: colorHex }}
        >
          ← Back to Hub
        </a>
      </div>
    </div>
  );
}
