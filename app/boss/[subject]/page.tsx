import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BossGame from "@/components/BossGame";

const VALID_SUBJECTS = ["math", "grammar", "vocab", "history", "science"];

interface Props {
  params: Promise<{ subject: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { subject } = await params;
  return { title: `Boss Battle: ${subject} | Schoolhouse` };
}

export default async function BossPage({ params }: Props) {
  const { subject } = await params;
  if (!VALID_SUBJECTS.includes(subject)) notFound();
  return <BossGame subject={subject} />;
}
