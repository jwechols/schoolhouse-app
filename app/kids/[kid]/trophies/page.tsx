import { notFound } from "next/navigation";
import TrophyRoom from "@/components/TrophyRoom";
import { KIDS, type KidId } from "@/lib/kids";

interface Props {
  params: Promise<{ kid: string }>;
}

export default async function TrophiesPage({ params }: Props) {
  const { kid } = await params;
  const profile = KIDS[kid as KidId];
  if (!profile) notFound();
  return <TrophyRoom profile={profile} />;
}
