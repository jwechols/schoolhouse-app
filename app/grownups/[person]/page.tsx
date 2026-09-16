"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import GrownupSurvey from "@/components/GrownupSurvey";
import { GROWNUPS, type GrownupId } from "@/lib/grownups";

export default function GrownupSurveyPage() {
  const params = useParams();
  const router = useRouter();
  const person = params?.person as string;
  const valid = person === "jm" || person === "briana";

  useEffect(() => {
    if (!valid) router.replace("/grownups");
  }, [valid, router]);

  if (!valid || !GROWNUPS[person as GrownupId]) return null;
  return <GrownupSurvey person={person as GrownupId} />;
}
