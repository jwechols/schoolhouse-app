import { notFound } from "next/navigation";
import PracticeTestHub from "@/components/PracticeTestHub";
import { KIDS, type KidId } from "@/lib/kids";

interface Props {
  params: Promise<{ kid: string }>;
}

export default async function KidTestsPage({ params }: Props) {
  const { kid } = await params;
  if (!KIDS[kid as KidId]) notFound();
  return <PracticeTestHub kidId={kid} />;
}
