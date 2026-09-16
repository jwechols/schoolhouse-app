import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = { title: "Homeroom | Schoolhouse" };

export default function TeacherPage() {
  redirect("/parent");
}
