import { notFound } from "next/navigation";
import WordDrillHub from "@/components/WordDrillHub";
import { KIDS, type KidId } from "@/lib/kids";

interface Props {
  params: Promise<{ kid: string }>;
}

export default async function KidWordsPage({ params }: Props) {
  const { kid } = await params;
  if (!KIDS[kid as KidId]) notFound();
  return <WordDrillHub kidId={kid} />;
}
