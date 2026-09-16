"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { KIDS, type KidId } from "@/lib/kids";
import { markLessonComplete, courseProgress } from "@/lib/curriculum-spine/progress";
import { courseSequence } from "@/lib/curriculum-spine/types";
import type { Course } from "@/lib/curriculum-spine/types";

const TUTOR: Record<string, { name: string; emoji: string; color: string }> = {
  titus: { name: "Buck", emoji: "🎣", color: "#2563eb" },
  mercy: { name: "Princess Rose", emoji: "🌹", color: "#D4508A" },
  lois: { name: "Princess Crystal", emoji: "❄️", color: "#C026D3" },
  truma: { name: "Lydia", emoji: "🪻", color: "#0BABB9" },
};

interface Props {
  kidId: string;
  subject: string;
  course: Course;
}

/**
 * A short, low-stakes placement check. The child answers probe questions ordered
 * from easy to hard; we find how far they can go before their first miss, mark
 * everything through that point complete, and start them at the next lesson.
 * No right/wrong feedback shown, this is a diagnostic, not a test to pass.
 */
export default function PlacementAssessment({ kidId, subject, course }: Props) {
  const router = useRouter();
  const kid = KIDS[kidId as KidId];
  const t = TUTOR[kidId] ?? TUTOR.titus;
  const colorHex = kid?.colorHex ?? t.color;
  const probes = course.placement ?? [];

  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [results, setResults] = useState<boolean[]>([]);
  const [done, setDone] = useState(false);
  const [placedName, setPlacedName] = useState<string>("");
  const [placedCount, setPlacedCount] = useState(0);
  const kidName = kid?.name ?? (kidId === "truma" ? "Truma" : kidId);

  function choose(i: number) {
    if (picked !== null) return;
    setPicked(i);
    const correct = i === probes[idx].correctIndex;
    const nextResults = [...results, correct];
    setTimeout(() => {
      if (idx + 1 < probes.length && correct) {
        // keep going only while they're still getting them right
        setResults(nextResults);
        setIdx(idx + 1);
        setPicked(null);
      } else {
        setResults(nextResults);
        finish(nextResults);
      }
    }, 350);
  }

  function finish(res: boolean[]) {
    // First-miss ceiling: the deepest lesson reached with an unbroken run of correct.
    let ceiling: string | null = null;
    for (let i = 0; i < res.length; i++) {
      if (res[i]) ceiling = probes[i].throughLessonId;
      else break;
    }
    const seq = courseSequence(course);
    let count = 0;
    if (ceiling) {
      const ceilIdx = seq.findIndex((l) => l.id === ceiling);
      for (let i = 0; i <= ceilIdx; i++) { markLessonComplete(kidId, subject, seq[i].id); count++; }
    }
    const start = courseProgress(course).current;
    setPlacedName(start ? start.title : "the end, every lesson placed out!");
    setPlacedCount(count);
    setDone(true);
  }

  if (probes.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center" style={{ background: `linear-gradient(160deg, ${colorHex}18, #fff)` }}>
        <div className="text-5xl mb-3">🧭</div>
        <p className="text-lg font-bold text-gray-700 mb-6">No placement check for {course.subjectLabel} yet.</p>
        <button onClick={() => router.back()} className="px-8 py-3 rounded-2xl font-black text-white" style={{ backgroundColor: colorHex }}>Back</button>
      </div>
    );
  }

  if (done) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 text-center" style={{ background: `linear-gradient(160deg, ${colorHex}22, #fff)` }}>
        <div className="text-7xl mb-3">🧭</div>
        <h1 className="text-3xl font-black mb-2" style={{ color: colorHex, fontFamily: "Georgia, serif" }}>All set, {kidName}!</h1>
        <p className="text-sm text-gray-600 mb-1 max-w-xs">
          {placedCount > 0
            ? `You already knew ${placedCount} lesson${placedCount === 1 ? "" : "s"} worth of ${course.subjectLabel}. We'll pick up right where you're ready.`
            : `We'll start ${course.subjectLabel} from the beginning and build a strong foundation.`}
        </p>
        <p className="text-lg font-bold mb-6" style={{ color: colorHex }}>Starting at: {placedName}</p>
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <button
            onClick={() => {
              const start = courseProgress(course).current;
              const base = kidId === "truma" ? "/kids/truma/lesson" : `/kids/${kidId}/lesson`;
              if (start) router.push(`${base}?subject=${subject}&lessonId=${start.id}`);
              else router.back();
            }}
            className="w-full py-4 rounded-2xl font-black text-white text-lg shadow-lg active:scale-95 transition-transform"
            style={{ backgroundColor: colorHex }}>
            Start my first lesson →
          </button>
          <button onClick={() => router.back()} className="w-full py-3 rounded-2xl font-bold text-base" style={{ color: colorHex, border: `2px solid ${colorHex}55` }}>
            Back to Hub
          </button>
        </div>
      </div>
    );
  }

  const p = probes[idx];
  return (
    <div className="min-h-screen flex flex-col" style={{ background: `linear-gradient(180deg, ${colorHex}12 0%, #fff 28%)` }}>
      <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 shadow-sm" style={{ backgroundColor: colorHex }}>
        <div className="flex items-center gap-2 text-white">
          <span className="text-2xl">{kid?.emoji ?? "🧭"}</span>
          <div>
            <div className="font-black text-sm leading-none">{course.subjectLabel} check</div>
            <div className="text-xs opacity-80">Let&apos;s see what you know</div>
          </div>
        </div>
        <div className="text-white text-sm font-bold">{idx + 1} / {probes.length}</div>
      </div>

      <div className="flex-1 flex flex-col max-w-lg mx-auto w-full px-4 py-6 gap-5">
        <p className="text-sm text-gray-500 text-center">Just do your best. If you don&apos;t know one, that&apos;s okay, pick and keep going.</p>
        <p className="text-xl font-bold text-gray-800 text-center px-2">{p.prompt}</p>
        <div className="grid grid-cols-2 gap-3">
          {p.choices.map((choice, i) => (
            <button key={i} onClick={() => choose(i)} disabled={picked !== null}
              className="text-base py-5 px-4 rounded-3xl font-black shadow-sm active:scale-95 transition-all disabled:cursor-default"
              style={{
                backgroundColor: picked === i ? `${colorHex}18` : "white",
                border: picked === i ? `2px solid ${colorHex}` : `1.5px solid ${colorHex}40`,
                color: "#1f2937",
              }}>
              {choice}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
