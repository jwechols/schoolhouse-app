import type { Metadata } from "next";
import TeacherStation from "@/components/TeacherStation";

export const metadata: Metadata = { title: "Who is on | Schoolhouse" };

export default function TeacherRoomPage() {
  return <TeacherStation />;
}
