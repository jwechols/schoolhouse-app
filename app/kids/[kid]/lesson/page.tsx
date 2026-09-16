import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { KIDS, type KidId } from "@/lib/kids";
import LessonRouter from "@/components/LessonRouter";

interface Props {
  params: Promise<{ kid: string }>;
  searchParams: Promise<{ subject?: string; duration?: string; notes?: string; lessonId?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { kid } = await params;
  const profile = KIDS[kid as KidId];
  if (!profile) return { title: "Lesson | Schoolhouse" };
  return { title: `${profile.name}'s Lesson | Schoolhouse` };
}

export default async function KidLessonPage({ params, searchParams }: Props) {
  const { kid } = await params;
  const profile = KIDS[kid as KidId];
  if (!profile) notFound();

  const sp = await searchParams;
  const subject = sp.subject ?? profile.subjects[0] ?? "math";
  const duration = parseInt(sp.duration ?? "30", 10);
  const notes = sp.notes ?? "";

  return (
    <LessonRouter
      kidId={kid}
      subject={subject}
      durationMinutes={duration}
      parentNotes={notes}
      lessonId={sp.lessonId}
    />
  );
}
