import type { Metadata } from "next";
import FocusTimer from "@/components/FocusTimer";

export const metadata: Metadata = {
  title: "Focus | Schoolhouse",
  description: "Calm Pomodoro focus timer for quiet work time.",
};

export default function FocusPage() {
  return <FocusTimer />;
}
