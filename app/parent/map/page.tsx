"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import MapQuiz from "@/components/MapQuiz";

function Inner() {
  const router = useRouter();
  const params = useSearchParams();
  const kid = params.get("kid") || "titus";
  return <MapQuiz kidId={kid} onDone={() => router.push("/parent/words")} />;
}

export default function ParentMapPage() {
  return (
    <Suspense fallback={<p style={{ padding: 24 }}>Loading map…</p>}}>
      <Inner />
    </Suspense>
  );
}
