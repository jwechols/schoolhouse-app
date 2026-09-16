import { notFound } from "next/navigation";
import type { Metadata } from "next";
import FaithPath from "@/components/FaithPath";
import { KIDS, type KidId } from "@/lib/kids";

export const metadata: Metadata = { title: "Faith Path | Schoolhouse" };

interface Props {
  params: Promise<{ kid: string }>;
}

export default async function KidFaithPage({ params }: Props) {
  const { kid } = await params;
  const profile = KIDS[kid as KidId];
  if (!profile) notFound();

  return <FaithPath profile={profile} />;
}
