import type { Metadata } from "next";
import TrumaBibleHub from "@/components/TrumaBibleHub";

export const metadata: Metadata = {
  title: "Bible | Schoolhouse",
};

export default function TrumaBiblePage() {
  return <TrumaBibleHub />;
}
