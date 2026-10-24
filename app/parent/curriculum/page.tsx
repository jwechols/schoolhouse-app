import type { Metadata } from "next";
import { isParent } from "@/lib/parent-auth";
import { redirect } from "next/navigation";
import CurriculumEditor from "@/components/CurriculumEditor";

export const metadata: Metadata = { title: "Lessons | Schoolhouse" };

export default async function CurriculumPage() {
  if (!(await isParent())) {
    redirect("/?mode=parent");
  }
  return <CurriculumEditor />;
}
