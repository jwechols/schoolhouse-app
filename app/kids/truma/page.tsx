import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = { title: "Truma | Schoolhouse" };

export default function TrumaIndexPage() {
  redirect("/hub");
}
