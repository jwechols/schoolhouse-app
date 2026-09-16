import type { Metadata } from "next";
import ReadingAssignmentHub from "@/components/ReadingAssignmentHub";

export const metadata: Metadata = { title: "Truma's Reading | Schoolhouse" };

export default function TrumaReadingPage() {
  return <ReadingAssignmentHub kidId="truma" />;
}
