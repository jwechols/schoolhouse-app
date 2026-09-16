import type { Metadata } from "next";
import WordDrillHub from "@/components/WordDrillHub";

export const metadata: Metadata = { title: "Truma's Drills | Schoolhouse" };

export default function TrumaWordsPage() {
  return <WordDrillHub kidId="truma" />;
}
