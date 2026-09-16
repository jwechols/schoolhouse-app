import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCourse } from "@/lib/curriculum-spine";
import PlacementAssessment from "@/components/PlacementAssessment";

interface Props {
  searchParams: Promise<{ subject?: string }>;
}

export const metadata: Metadata = { title: "Placement | Schoolhouse" };

export default async function TrumaPlacementPage({ searchParams }: Props) {
  const sp = await searchParams;
  const subject = sp.subject ?? "prealgebra";
  const course = getCourse("truma", subject);
  if (!course) notFound();
  return <PlacementAssessment kidId="truma" subject={subject} course={course} />;
}
