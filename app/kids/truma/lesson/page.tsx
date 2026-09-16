import type { Metadata } from "next";
import LessonRouter from "@/components/LessonRouter";

export const metadata: Metadata = { title: "Truma's Lesson | Schoolhouse" };

interface Props {
  searchParams: Promise<{ subject?: string; duration?: string; lessonId?: string }>;
}

// Truma keeps her own route (she isn't in the KidId union), but she now runs the
// SAME shared lesson engine as the younger kids via LessonRouter: a real taught
// lesson (readout + conversational tutor + quiz + 80% mastery + Mom sign-off)
// whenever the target lesson has an authored quiz, otherwise the AI conductor.
export default async function TrumaLessonPage({ searchParams }: Props) {
  const sp = await searchParams;
  const subject = sp.subject ?? "prealgebra";
  const duration = parseInt(sp.duration ?? "30", 10);

  return (
    <LessonRouter
      kidId="truma"
      subject={subject}
      durationMinutes={duration}
      parentNotes=""
      lessonId={sp.lessonId}
    />
  );
}
