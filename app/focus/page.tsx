import type { Metadata } from "next";
import { Suspense } from "react";
import FocusTimer from "@/components/FocusTimer";

export const metadata: Metadata = {
  title: "Focus | Schoolhouse",
  description: "Calm Pomodoro focus timer for quiet work time.",
};

export default function FocusPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: "100vh",
            display: "grid",
            placeItems: "center",
            background: "#f5f0e6",
            color: "#6b6458",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          Loading focus timer…
        </div>
      }
    >
      <FocusTimer />
    </Suspense>
  );
}
