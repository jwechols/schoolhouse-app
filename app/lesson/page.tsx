import type { Metadata } from "next";
import LessonConductor from "@/components/LessonConductor";

export const metadata: Metadata = { title: "Lesson | Schoolhouse" };

interface Props {
  searchParams: Promise<{ subject?: string; duration?: string; notes?: string }>;
}

export default async function TrumaLessonPage({ searchParams }: Props) {
  const sp = await searchParams;
  const subject = sp.subject ?? "math";
  const duration = parseInt(sp.duration ?? "30", 10);
  const notes = sp.notes ?? "";

  return (
    <LessonConductor
      kidId="truma"
      subject={subject}
      durationMinutes={duration}
      parentNotes={notes}
    />
  );
}
