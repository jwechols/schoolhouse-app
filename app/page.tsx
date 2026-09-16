import type { Metadata } from "next";
import FamilyLanding from "@/components/FamilyLanding";

export const metadata: Metadata = { title: "Welcome | Schoolhouse" };

export default function LoginPage() {
  return <FamilyLanding />;
}
