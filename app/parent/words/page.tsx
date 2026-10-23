import type { Metadata } from "next";
import { isParent } from "@/lib/parent-auth";
import { redirect } from "next/navigation";
import WordListEditor from "@/components/WordListEditor";

export const metadata: Metadata = { title: "This week | Schoolhouse" };

export default async function WordsPage() {
  if (!(await isParent())) {
    redirect("/?mode=parent");
  }
  return <WordListEditor />;
}
