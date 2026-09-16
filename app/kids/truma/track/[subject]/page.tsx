import { notFound } from "next/navigation";
import type { Metadata } from "next";
import LessonPage from "@/components/LessonPage";
import type { KidProfile } from "@/lib/kids";
import { getCurriculum } from "@/lib/curriculum";

export const metadata: Metadata = { title: "Skill Track | Schoolhouse" };

// Truma is intentionally NOT in the KidId union (hard rule, she has her own
// routing). LessonPage only reads display fields + id, so we hand it a minimal
// profile shaped for her rhetoric-stage experience.
const TRUMA_LESSON_PROFILE = {
  id: "truma",
  name: "Truma",
  colorHex: "#0BABB9",
  uiSize: "normal",
  tutorEnabled: true,
} as unknown as KidProfile;

const TRACK_IDS = ["money", "home"];

interface Props {
  params: Promise<{ subject: string }>;
}

export default async function TrumaTrackPage({ params }: Props) {
  const { subject } = await params;
  if (!TRACK_IDS.includes(subject)) notFound();

  const curriculum = getCurriculum("truma", subject);
  if (!curriculum) notFound();

  return <LessonPage profile={TRUMA_LESSON_PROFILE} curriculum={curriculum} />;
}
