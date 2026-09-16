// ── Shared kid metadata for the Teacher Station ────────────────────────────────
// Both the board (TeacherStation) and the kids' reporter (StationReporter) read
// from here so lane colors, avatars, subjects, and launch paths never drift.

import { KIDS, TRUMA_EARTHY } from "./kids";

export const STATION_ORDER = ["truma", "titus", "mercy", "lois"] as const;

export interface StationKidMeta {
  id: string;
  name: string;
  avatar: string;
  grade: string;
  color: string;
  colorDark: string;
  soft: string;
  subjects: { id: string; label: string; emoji: string }[];
  lessonPath: string;
  learnPath: (subjectId: string) => string;
}

export function kidMetaFor(kidId: string): StationKidMeta {
  if (kidId === "truma") {
    return {
      id: "truma",
      name: "Truma",
      avatar: TRUMA_EARTHY.avatar,
      grade: TRUMA_EARTHY.grade,
      color: TRUMA_EARTHY.color,
      colorDark: TRUMA_EARTHY.colorDark,
      soft: TRUMA_EARTHY.soft,
      subjects: [
        { id: "prep",    label: "Test Prep", emoji: "🎯" },
        { id: "math",    label: "Math",      emoji: "✖️" },
        { id: "grammar", label: "Grammar",   emoji: "📝" },
        { id: "bible",   label: "Bible",     emoji: "✝️" },
      ],
      lessonPath: "/kids/truma/lesson",
      learnPath: (s) => (s === "prep" ? "/kids/truma/prep" : "/kids/truma/lesson"),
    };
  }
  const k = KIDS[kidId as keyof typeof KIDS];
  return {
    id: kidId,
    name: k.name,
    avatar: k.emoji,
    grade: k.grade,
    color: k.color,
    colorDark: k.colorDark,
    soft: k.soft,
    subjects: k.games.slice(0, 4).map(g => ({ id: g.id, label: g.label, emoji: g.emoji })),
    lessonPath: `/kids/${kidId}/lesson`,
    learnPath: (s) => `/kids/${kidId}/learn/${s}`,
  };
}
