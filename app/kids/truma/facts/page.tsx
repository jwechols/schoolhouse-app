"use client";

import { useRouter } from "next/navigation";
import MathFactsDrill from "@/components/MathFactsDrill";

export default function FactsPage() {
  const router = useRouter();
  return (
    <MathFactsDrill
      kidId="truma"
      colorHex="#1b3a6b"
      onBack={() => router.push("/kids/truma/prep")}
    />
  );
}
