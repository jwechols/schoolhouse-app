import type { Metadata } from "next";
import HandwritingGame from "@/components/HandwritingGame";

export const metadata: Metadata = { title: "Handwriting | Schoolhouse" };

export default function HandwritingPage() {
  return (
    <HandwritingGame
      kidId="truma"
      colorHex="#1e3a5f"
      uiSize="normal"
      backHref="/hub"
    />
  );
}
