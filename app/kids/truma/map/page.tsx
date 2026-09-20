"use client";

import { useRouter } from "next/navigation";
import MapQuiz from "@/components/MapQuiz";

export default function TrumaMapPage() {
  const router = useRouter();
  return <MapQuiz kidId="truma" onDone={() => router.push("/hub")} />;
}
