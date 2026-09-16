import { notFound } from "next/navigation";
import KidAssessment from "@/components/KidAssessment";
import { KIDS, type KidId } from "@/lib/kids";

interface Props {
  params: Promise<{ kid: string }>;
}

export default async function KidAssessPage({ params }: Props) {
  const { kid } = await params;
  const profile = KIDS[kid as KidId];
  if (!profile) notFound();

  return (
    <KidAssessment
      kidId={profile.id}
      grade={profile.grade}
      name={profile.name}
      colorHex={profile.colorHex}
      emoji={profile.emoji}
    />
  );
}
