"use client";

import { useRouter } from "next/navigation";
import TrumaTestPrep from "@/components/TrumaTestPrep";

export default function PrepPage() {
  const router = useRouter();
  return <TrumaTestPrep onBack={() => router.push("/hub")} />;
}
