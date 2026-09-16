import { notFound } from "next/navigation";
import Scout from "@/components/Scout";
import { KIDS, type KidId } from "@/lib/kids";

interface Props {
  params: Promise<{ kid: string }>;
}

export default async function ScoutPage({ params }: Props) {
  const { kid } = await params;
  const profile = KIDS[kid as KidId];
  if (!profile) notFound();

  return (
    <Scout
      profile={{
        id:         profile.id,
        name:       profile.name,
        color:      profile.color,
        colorDark:  profile.colorDark,
        soft:       profile.soft,
        tutorName:  profile.tutorName,
        tutorEmoji: profile.tutorEmoji,
        uiSize:     profile.uiSize,
      }}
    />
  );
}
