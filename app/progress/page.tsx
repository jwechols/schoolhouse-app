import type { Metadata } from "next";
import ProgressView from "@/components/ProgressView";

export const metadata: Metadata = { title: "My Progress | Schoolhouse" };

export default function ProgressPage() {
  return <ProgressView />;
}
