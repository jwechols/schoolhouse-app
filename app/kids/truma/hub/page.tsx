import type { Metadata } from "next";
import SchoolhouseHub from "@/components/SchoolhouseHub";

export const metadata: Metadata = { title: "Truma | Schoolhouse" };

export default function TrumaHubPage() {
  return <SchoolhouseHub kidId="truma" />;
}
