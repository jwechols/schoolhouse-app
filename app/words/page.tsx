import type { Metadata } from "next";
import WordProblems from "@/components/WordProblems";

export const metadata: Metadata = { title: "Word Problems | Schoolhouse" };

export default function WordsPage() {
  return <WordProblems />;
}
