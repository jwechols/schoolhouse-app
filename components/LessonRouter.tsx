"use client";

import { useEffect, useState } from "react";
import { getCourse } from "@/lib/curriculum-spine";
import { courseProgress } from "@/lib/curriculum-spine/progress";
import { courseSequence } from "@/lib/curriculum-spine/types";
import type { SpineLesson } from "@/lib/curriculum-spine/types";
import { TIER_META, type LessonTier } from "@/lib/homeward";
import { isOutsideSchoolToday } from "@/lib/outside-school";
import TaughtLesson from "./TaughtLesson";
import LessonConductor from "./LessonConductor";
import LessonContents from "./LessonContents";
import AtSchoolToday from "./AtSchoolToday";

interface Props {
  kidId: string;
  subject: string;
  durationMinutes: number;
  parentNotes: string;
  lessonId?: string;
}

/**
 * Picks the lesson experience:
 *  - Authored lessons (with a quiz) run the real taught lesson (teach → try → quiz →
 *    80% mastery → Mom sign-off) and carry their own coin tier (lesson.tier).
 *  - Every other lesson runs the AI conductor. There is NO "how long today?" picker
 *    anymore (retired 2026-07-25): a lesson IS the unit of work. The reward tier is
 *    set by the child's age — the littles (Lois, Mercy) earn the "quick" tier, the
 *    older kids the "standard" tier — so younger kids are paid less per lesson.
 *  Resolution happens after mount so the child's real (localStorage) progress is used
 *  without a hydration clash.
 */
export default function LessonRouter({ kidId, subject, parentNotes, lessonId }: Props) {
  const [lesson, setLesson] = useState<SpineLesson | null | undefined>(undefined);

  useEffect(() => {
    const course = getCourse(kidId, subject);
    let l: SpineLesson | null = null;
    if (course) {
      l = lessonId
        ? courseSequence(course).find((x) => x.id === lessonId) ?? null
        : courseProgress(course).current;
    }
    setLesson(l);
  }, [kidId, subject, lessonId]);

  // Outside-school gate: on a kid's own outside-school day (Truma/Titus/Mercy
  // per lib/outside-school.ts; Lois is home every day), no new lesson is
  // presented at all — checked after the effect above so hook order stays
  // stable every render. Nothing here reads or writes lesson/progress data.
  if (isOutsideSchoolToday(kidId)) return <AtSchoolToday kidId={kidId} />;

  // No specific lesson chosen → show the subject's table of contents (kid picks).
  if (!lessonId) return <LessonContents kidId={kidId} subject={subject} />;

  if (lesson === undefined) return null; // resolving (one tick)

  // Authored interactive/quiz lesson: fixed experience, coins by its own tier.
  if (lesson && lesson.quiz && lesson.quiz.length > 0) {
    return <TaughtLesson kidId={kidId} subject={subject} lesson={lesson} />;
  }

  // AI-conductor lesson: straight in, no length menu. Reward tier by age.
  const tier: LessonTier = kidId === "lois" || kidId === "mercy" ? "quick" : "standard";
  return (
    <LessonConductor
      kidId={kidId}
      subject={subject}
      durationMinutes={TIER_META[tier].minutes}
      parentNotes={parentNotes}
      lessonId={lessonId}
      tier={tier}
    />
  );
}
