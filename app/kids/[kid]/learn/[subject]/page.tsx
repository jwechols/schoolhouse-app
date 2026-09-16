import { notFound } from "next/navigation";
import LessonPage from "@/components/LessonPage";
import { KIDS, type KidId } from "@/lib/kids";
import { getCurriculum } from "@/lib/curriculum";

interface Props {
  params: Promise<{ kid: string; subject: string }>;
}

export default async function KidLearnPage({ params }: Props) {
  const { kid, subject } = await params;
  const profile = KIDS[kid as KidId];
  if (!profile) notFound();

  const curriculum = getCurriculum(kid, subject);
  if (!curriculum) notFound();

  return <LessonPage profile={profile} curriculum={curriculum} />;
}
