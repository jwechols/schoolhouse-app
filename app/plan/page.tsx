import type { Metadata } from "next";
import PlanView from "@/components/PlanView";

export const metadata: Metadata = { title: "Lesson Plan | Schoolhouse" };

export default function PlanPage() {
  return <PlanView />;
}
