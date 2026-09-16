"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Re-scan the page for Scripture references on client-side navigation.
// RefTagger tags the initial document on load, but Next.js App Router
// swaps content without a full reload, so we re-run tag() on route change.
declare global {
  interface Window {
    refTagger?: {
      tag?: () => void;
      settings?: Record<string, unknown>;
    };
  }
}

export default function RefTaggerRescan() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const rescan = () => {
      if (window.refTagger && typeof window.refTagger.tag === "function") {
        window.refTagger.tag();
      }
    };
    // RefTagger.js may not have loaded yet on the first navigation; retry briefly.
    rescan();
    const t = setTimeout(rescan, 600);
    return () => clearTimeout(t);
  }, [pathname]);

  return null;
}
