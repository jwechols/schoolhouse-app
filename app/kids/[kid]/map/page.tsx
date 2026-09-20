"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import MapQuiz from "@/components/MapQuiz";

export default function KidMapPage({ params }: { params: Promise<{ kid: string }> }) {
  const { kid } = use(params);
  const router = useRouter();
  return <MapQuiz kidId={kid} onDone={() => router.push(`/kids/${kid}/hub`)} />;
}
