"use client";

import { coursesForKid } from "@/lib/curriculum-spine";
import { courseProgress } from "@/lib/curriculum-spine/progress";
import { isOutsideSchoolToday } from "@/lib/outside-school";

export const LEARNERS = ["truma", "titus", "mercy", "lois"] as const;
export type LearnerId = (typeof LEARNERS)[number];

const SCHOOL: Record<string, string> = {
  truma: "Midland Classical Academy",
  titus: "Brookside Academy",
  mercy: "Midland Classical Academy",
  lois: "Home",
};

export function hubHref(kidId: string): string {
  return kidId === "truma" ? "/hub" : `/kids/${kidId}/hub`;
}

export function catechismHref(kidId: string): string {
  return kidId === "truma" ? "/kids/truma/catechism" : `/kids/${kidId}/catechism`;
}

export function lessonHref(kidId: string, subject: string, lessonId?: string | null): string {
  const base = kidId === "truma" ? "/kids/truma/lesson" : `/kids/${kidId}/lesson`;
  return `${base}?subject=${encodeURIComponent(subject)}${lessonId ? `&lessonId=${encodeURIComponent(lessonId)}` : ""}`;
}

export interface NextLesson {
  subject: string;
  subjectLabel: string;
  id: string;
  title: string;
  emoji: string;
}

/** First unfinished spine lesson, in course-registration order (math/phonics first). */
export function nextLessonFor(kidId: string): NextLesson | null {
  for (const c of coursesForKid(kidId)) {
    const p = courseProgress(c);
    if (p.current) {
      return {
        subject: c.subject,
        subjectLabel: c.subjectLabel,
        id: p.current.id,
        title: p.current.title,
        emoji: c.emoji,
      };
    }
  }
  return null;
}

export interface KidToday {
  kidId: string;
  atSchool: boolean;
  schoolName: string;
  lesson: NextLesson | null;
  lessonUrl: string | null;
  catechismUrl: string;
  hubUrl: string;
}

export function kidToday(kidId: string): KidToday {
  const atSchool = isOutsideSchoolToday(kidId);
  const lesson = atSchool ? null : nextLessonFor(kidId);
  return {
    kidId,
    atSchool,
    schoolName: SCHOOL[kidId] ?? "School",
    lesson,
    lessonUrl: lesson ? lessonHref(kidId, lesson.subject, lesson.id) : null,
    catechismUrl: catechismHref(kidId),
    hubUrl: hubHref(kidId),
  };
}

export function familyToday(): KidToday[] {
  return LEARNERS.map(kidToday);
}
