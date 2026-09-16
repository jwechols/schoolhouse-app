import type { Metadata } from "next";
import TeacherStation from "@/components/TeacherStation";

export const metadata: Metadata = { title: "Homeroom | Schoolhouse" };

export default function TeacherPage() {
  return <TeacherStation />;
}
