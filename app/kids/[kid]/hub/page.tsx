import { notFound } from "next/navigation";
import SchoolhouseHub from "@/components/SchoolhouseHub";
import MercyPipStrip from "@/components/MercyPipStrip";
import { KIDS, type KidId } from "@/lib/kids";

interface Props {
  params: Promise<{ kid: string }>;
}

export default async function KidHubPage({ params }: Props) {
  const { kid } = await params;
  if (!KIDS[kid as KidId]) notFound();
  return (
    <>
      {kid === "mercy" ? <MercyPipStrip /> : null}
      <SchoolhouseHub kidId={kid} />
    </>
  );
}
