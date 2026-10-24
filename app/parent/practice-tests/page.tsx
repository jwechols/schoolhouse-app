import type { Metadata } from "next";
import { isParent } from "@/lib/parent-auth";
import { redirect } from "next/navigation";
import PracticeTestEditor from "@/components/PracticeTestEditor";

export const metadata: Metadata = { title: "Practice Tests | Schoolhouse" };

export default async function PracticeTestsPage() {
  if (!(await isParent())) {
    redirect("/?mode=parent");
  }
  return <PracticeTestEditor />;
}
