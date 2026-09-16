import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { KIDS, type KidId } from "@/lib/kids";
import { getCourse } from "@/lib/curriculum-spine";
import PlacementAssessment from "@/components/PlacementAssessment";

interface Props {
  params: Promise<{ kid: string }>;
  searchParams: Promise<{ subject?: string }>;
}

export const metadata: Metadata = { title: "Placement | Schoolhouse" };

export default async function KidPlacementPage({ params, searchParams }: Props) {
  const { kid } = await params;
  const profile = KIDS[kid as KidId];
  if (!profile) notFound();
  const sp = await searchParams;
  const subject = sp.subject ?? profile.subjects?.[0] ?? "math";
  const course = getCourse(kid, subject);
  if (!course) notFound();
  return <PlacementAssessment kidId={kid} subject={subject} course={course} />;
}
