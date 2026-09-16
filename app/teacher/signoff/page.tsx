import type { Metadata } from "next";
import SignoffQueue from "@/components/SignoffQueue";

export const metadata: Metadata = { title: "Sign Off | Schoolhouse" };

export default function SignoffPage() {
  return <SignoffQueue />;
}
