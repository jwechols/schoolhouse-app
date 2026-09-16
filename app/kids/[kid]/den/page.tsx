import MercyDen from "@/components/MercyDen";
import SchoolhouseHub from "@/components/SchoolhouseHub";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ kid: string }>;
}

export default async function KidDenPage({ params }: Props) {
  const { kid } = await params;
  if (kid !== "mercy") notFound();
  return (
    <>
      <MercyDen />
      <SchoolhouseHub kidId="mercy" />
    </>
  );
}
