import type { Metadata } from "next";
import FractionGame from "@/components/FractionGame";

export const metadata: Metadata = { title: "Fractions | Schoolhouse" };

export default function FractionsPage() {
  return <FractionGame />;
}
