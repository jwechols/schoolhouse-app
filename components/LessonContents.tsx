"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCourse } from "@/lib/curriculum-spine";
import { courseSequence } from "@/lib/curriculum-spine/types";
import { completedLessonIds, courseProgress } from "@/lib/curriculum-spine/progress";
import { KIDS, type KidId } from "@/lib/kids";

/**
 * LessonContents — the table of contents for a subject: every lesson in order,
 * grouped by unit, showing what's done, where the kid is now, and what's next,
 * with a tap to open any one. Shown when a subject is opened without a specific
 * lesson chosen (the kid picks from here, or hits Continue).
 */
export default function LessonContents({ kidId, subject }: { kidId: string; subject: string }) {
  const router = useRouter();
  // Progress lives in localStorage — read after mount so it's real (no hydration clash).
  const [done, setDone] = useState<Set<string>>(new Set());
  useEffect(() => { setDone(completedLessonIds(kidId, subject)); }, [kidId, subject]);

  const course = getCourse(kidId, subject);
  const kid = KIDS[kidId as KidId];
  const colorHex = kid?.colorHex ?? "#0BABB9"; // Truma isn't in KIDS → teal default
  const hubHref = kidId === "truma" ? "/kids/truma" : `/kids/${kidId}/hub`;

  if (!course) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center" style={{ background: "#fff" }}>
        <p className="text-gray-600 mb-4">No lessons here yet.</p>
        <button onClick={() => router.push(hubHref)} className="px-6 py-3 rounded-2xl font-black text-white" style={{ backgroundColor: colorHex }}>Back to Hub 🏠</button>
      </div>
    );
  }

  const seq = courseSequence(course);
  const current = courseProgress(course).current;
  const base = kidId === "truma" ? "/kids/truma/lesson" : `/kids/${kidId}/lesson`;
  const open = (lessonId: string) => router.push(`${base}?subject=${subject}&lessonId=${lessonId}`);
  const doneCount = seq.filter((l) => done.has(l.id)).length;

  return (
    <div className="min-h-screen" style={{ background: `linear-gradient(180deg, ${colorHex}12 0%, #fff 30%)` }}>
      {/* Header */}
      <div className="sticky top-0 z-10 px-4 py-4 shadow-sm" style={{ backgroundColor: colorHex }}>
        <div className="flex items-center gap-3 text-white">
          <span className="text-3xl">{course.emoji}</span>
          <div className="min-w-0">
            <div className="font-black text-lg leading-none truncate">{course.subjectLabel}</div>
            <div className="text-xs opacity-90 mt-1">{doneCount} of {seq.length} lessons done</div>
          </div>
          <button onClick={() => router.push(hubHref)} className="ml-auto text-sm font-bold underline text-white/90 shrink-0">Hub</button>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-5">
        {current && (
          <button
            onClick={() => open(current.id)}
            className="w-full mb-5 py-4 rounded-2xl font-black text-white text-lg shadow-md active:scale-95 transition-transform text-left px-5"
            style={{ backgroundColor: colorHex }}
          >
            ▶ Continue<span className="opacity-90 font-bold"> · {current.title}</span>
          </button>
        )}

        {course.units.map((u) => (
          <div key={u.id} className="mb-6">
            <div className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: colorHex }}>{u.title}</div>
            <div className="flex flex-col gap-2">
              {u.lessons.map((l) => {
                const isDone = done.has(l.id);
                const isCurrent = current?.id === l.id;
                return (
                  <button
                    key={l.id}
                    onClick={() => open(l.id)}
                    className="flex items-center gap-3 w-full text-left px-4 py-3 rounded-2xl active:scale-95 transition-transform"
                    style={{ background: isCurrent ? `${colorHex}18` : "#fff", border: `1.5px solid ${isCurrent ? colorHex : colorHex + "30"}` }}
                  >
                    <span className="text-lg text-center shrink-0" style={{ width: 26 }}>
                      {isDone ? "✅" : isCurrent ? "▶️" : "•"}
                    </span>
                    <span className="flex-1 font-bold leading-snug" style={{ color: "#1f2937" }}>{l.title}</span>
                    {isDone && <span className="text-xs font-bold shrink-0" style={{ color: "#15803d" }}>done</span>}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
