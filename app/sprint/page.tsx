import type { Metadata } from "next";
import SprintMode from "@/components/SprintMode";

export const metadata: Metadata = { title: "Math Sprint | Schoolhouse" };

export default function SprintPage() {
  return <SprintMode />;
}
