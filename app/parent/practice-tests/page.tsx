import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import PracticeTestEditor from "@/components/PracticeTestEditor";

export const metadata: Metadata = { title: "Practice Tests | Schoolhouse" };

export default async function PracticeTestsPage() {
  const cookieStore = await cookies();
  const parentPin = cookieStore.get("ta-parent")?.value;
  if (process.env.PARENT_AUTH_ENFORCE !== "0" && parentPin !== process.env.PARENT_PIN) {
    redirect("/?mode=parent");
  }
  return <PracticeTestEditor />;
}
