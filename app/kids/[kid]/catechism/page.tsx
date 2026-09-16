import { notFound } from "next/navigation";
import CatechismDrill from "@/components/CatechismDrill";
import { KIDS, type KidId } from "@/lib/kids";

interface Props {
  params: Promise<{ kid: string }>;
}

export default async function CatechismPage({ params }: Props) {
  const { kid } = await params;
  const profile = KIDS[kid as KidId];
  if (!profile) notFound();
  return <CatechismDrill profile={profile} />;
}
