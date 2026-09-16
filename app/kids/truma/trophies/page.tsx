import TrophyRoom from "@/components/TrophyRoom";
import type { KidProfile } from "@/lib/kids";

// Truma isn't in the KIDS map (she has her own hub at /hub)
// TrophyRoom only uses name/emoji/colorHex/subjects, we cast to satisfy the type
const TRUMA_PROFILE = {
  id: "titus",   // valid KidId, overridden by kidIdOverride="truma" for progress lookup
  name: "Truma",
  age: 11,
  grade: "6th Grade",
  school: "Midland Classical Academy",
  emoji: "📚",
  colorHex: "#1b3a6b",
  bgGradient: "linear-gradient(160deg, #0f1e38 0%, #1b2f50 100%)",
  accentColor: "#E8C840",
  themeEmoji: "📚",
  tutorName: "Scholar",
  tutorEmoji: "📖",
  uiSize: "normal",
  maxChoices: 4,
  subjects: ["prealgebra", "writing", "science", "history", "bible", "grammar"],
  tutorEnabled: true,
  games: [],
} as unknown as KidProfile;

export default function TrumaTrophiesPage() {
  return <TrophyRoom profile={TRUMA_PROFILE} kidIdOverride="truma" />;
}
