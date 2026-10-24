import type { Metadata } from "next";
import { isParent } from "@/lib/parent-auth";
import { redirect } from "next/navigation";
import ReadingAssignmentEditor from "@/components/ReadingAssignmentEditor";

export const metadata: Metadata = { title: "Reading | Schoolhouse" };

export default async function ReadingPage() {
  if (!(await isParent())) {
    redirect("/?mode=parent");
  }
  return <ReadingAssignmentEditor />;
}
