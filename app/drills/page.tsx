import type { Metadata } from "next";
import DrillGame from "@/components/DrillGame";

export const metadata: Metadata = { title: "Math Drills | Schoolhouse" };

export default function DrillsPage() {
  return <DrillGame />;
}
