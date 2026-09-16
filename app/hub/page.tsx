import type { Metadata } from "next";
import SchoolhouseHub from "@/components/SchoolhouseHub";

export const metadata: Metadata = { title: "Truma | Schoolhouse" };

export default function HubPage() {
  return <SchoolhouseHub kidId="truma" />;
}
