import type { Metadata } from "next";
import TutorChat from "@/components/TutorChat";

export const metadata: Metadata = { title: "AI Tutor | Schoolhouse" };

export default function TutorPage() {
  return <TutorChat />;
}
