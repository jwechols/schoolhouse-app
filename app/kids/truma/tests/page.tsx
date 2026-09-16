import type { Metadata } from "next";
import PracticeTestHub from "@/components/PracticeTestHub";

export const metadata: Metadata = { title: "Truma's Practice Tests | Schoolhouse" };

export default function TrumaTestsPage() {
  return <PracticeTestHub kidId="truma" />;
}
