import { notFound } from "next/navigation";
import ReadingAssignmentHub from "@/components/ReadingAssignmentHub";
import { KIDS, type KidId } from "@/lib/kids";

interface Props {
  params: Promise<{ kid: string }>;
}

export default async function KidReadingPage({ params }: Props) {
  const { kid } = await params;
  if (!KIDS[kid as KidId]) notFound();
  return <ReadingAssignmentHub kidId={kid} />;
}
