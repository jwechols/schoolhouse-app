import { notFound, redirect } from "next/navigation";
import SchoolhouseHub from "@/components/SchoolhouseHub";
import { KIDS, type KidId } from "@/lib/kids";

interface Props {
  params: Promise<{ kid: string }>;
}

export default async function KidHubPage({ params }: Props) {
  const { kid } = await params;
  if (!KIDS[kid as KidId]) notFound();
  if (kid === "mercy") redirect("/kids/mercy/den");
  return <SchoolhouseHub kidId={kid} />;
}
