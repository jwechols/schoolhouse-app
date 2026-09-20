import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import WordListEditor from "@/components/WordListEditor";

export const metadata: Metadata = { title: "This week | Schoolhouse" };

export default async function WordsPage() {
  const cookieStore = await cookies();
  const parentPin = cookieStore.get("ta-parent")?.value;
  if (process.env.PARENT_AUTH_ENFORCE !== "0" && parentPin !== process.env.PARENT_PIN) {
    redirect("/?mode=parent");
  }
  return <WordListEditor />;
}
