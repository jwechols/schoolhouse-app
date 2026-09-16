"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import TimedDrill from "@/components/TimedDrill";
import type { TopicKey } from "@/lib/singapore-math";
import type { DrillResults } from "@/components/TimedDrill";

function DrillPageInner() {
  const params = useSearchParams();
  const router = useRouter();

  const topic = (params.get("topic") ?? "all") as TopicKey | "all";
  const modeParam = params.get("mode");
  const testMode = modeParam === "test";
  const countParam = parseInt(params.get("count") ?? "10", 10);

  // Games no longer mint coins. Coins are earned only through lessons
  // (choose-your-length tiers) and tracked in the Homeward ledger.
  function handleComplete(_results: DrillResults) {
    router.push("/kids/truma/prep");
  }

  return (
    <TimedDrill
      topic={topic}
      questionCount={isNaN(countParam) ? 10 : countParam}
      perQuestionSeconds={testMode ? 90 : 60}
      testMode={testMode}
      onComplete={handleComplete}
      onBack={() => router.push("/kids/truma/prep")}
    />
  );
}

export default function DrillPage() {
  return (
    <Suspense fallback={
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "linear-gradient(160deg, #1b3a6b 0%, #0f2547 100%)" }}
      >
        <p className="text-white text-lg">Loading drill…</p>
      </div>
    }>
      <DrillPageInner />
    </Suspense>
  );
}
