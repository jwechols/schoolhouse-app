import CatechismDrill from "@/components/CatechismDrill";
import { TRUMA_EARTHY, type KidProfile } from "@/lib/kids";

/** Truma is not in KidId. Same drill book as the little ones: Boys and Girls. */
const trumaDrill = {
  id: "truma",
  name: "Truma",
  color: TRUMA_EARTHY.color,
  colorDark: TRUMA_EARTHY.colorDark,
  soft: TRUMA_EARTHY.soft,
  uiSize: "normal" as const,
} as unknown as KidProfile;

export default function TrumaCatechismPage() {
  return <CatechismDrill profile={trumaDrill} />;
}
