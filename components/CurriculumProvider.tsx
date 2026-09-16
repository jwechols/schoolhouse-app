"use client";

import { seedOverrideCache, type LessonOverride } from "@/lib/curriculum-spine/override-cache";

/**
 * Seeds Briana's lesson overrides into the merge cache. Seeding happens during
 * render (not in an effect) so that getCourse()/courseSequence() called inside
 * the kid components already see the overrides on the first paint, both during
 * SSR and client hydration. `initial` comes from the server (root layout).
 */
export default function CurriculumProvider({
  initial,
  children,
}: {
  initial: LessonOverride[];
  children: React.ReactNode;
}) {
  seedOverrideCache(initial);
  return <>{children}</>;
}
