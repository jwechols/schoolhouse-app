"use client";

import { useRouter } from "next/navigation";
import PracticeTest from "@/components/PracticeTest";

export default function TestPage() {
  const router = useRouter();
  return <PracticeTest onBack={() => router.push("/kids/truma/prep")} />;
}
