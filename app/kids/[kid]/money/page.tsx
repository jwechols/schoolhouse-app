import { notFound } from "next/navigation";
import MoneyView from "@/components/MoneyView";
import { KIDS, type KidId } from "@/lib/kids";

interface Props {
  params: Promise<{ kid: string }>;
}

export default async function MoneyPage({ params }: Props) {
  const { kid } = await params;
  const profile = KIDS[kid as KidId];
  if (!profile) notFound();
  return (
    <MoneyView
      kidId={profile.id}
      name={profile.name}
      color={profile.colorHex}
      accent={profile.accentColor}
      uiSize={profile.uiSize}
    />
  );
}
