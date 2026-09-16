import { cookies } from "next/headers";
import KioskLogin from "@/components/KioskLogin";
import MoneyView from "@/components/MoneyView";
import { KIDS, TRUMA_THEME, ALL_LEARNER_NAMES } from "@/lib/kids";

// Money kiosk: a shared, PIN-gated screen. Each kid taps their name, enters their own
// PIN, and sees only their own money. "Lock" clears the signed-in kid for the next child.
// Reachable standalone or embeddable (e.g. iframe in Homeward). Per-kid PINs come from
// env vars: TITUS_PIN, MERCY_PIN, LOIS_PIN, TRUMA_PIN.

const KID_COOKIE = "fa-kid";

interface KidDisplay {
  id: string;
  name: string;
  emoji: string;
  color: string;
  accent?: string;
  uiSize: "normal" | "large" | "xlarge";
}

function kidDisplay(id: string): KidDisplay | null {
  if (id === "truma") {
    return { id: "truma", name: "Truma", emoji: ALL_LEARNER_NAMES.truma.emoji, color: TRUMA_THEME.teal, accent: TRUMA_THEME.rose, uiSize: "normal" };
  }
  const p = KIDS[id as keyof typeof KIDS];
  if (!p) return null;
  return { id: p.id, name: p.name, emoji: p.emoji, color: p.colorHex, accent: p.accentColor, uiSize: p.uiSize };
}

const KIOSK_KIDS = ["titus", "mercy", "lois", "truma"];

export default async function KioskPage() {
  const c = await cookies();
  const kidId = c.get(KID_COOKIE)?.value;
  const kid = kidId ? kidDisplay(kidId) : null;

  if (kid) {
    return (
      <MoneyView
        kidId={kid.id}
        name={kid.name}
        color={kid.color}
        accent={kid.accent}
        uiSize={kid.uiSize}
        kiosk
      />
    );
  }

  const kids = KIOSK_KIDS.map(kidDisplay).filter((k): k is KidDisplay => !!k)
    .map((k) => ({ id: k.id, name: k.name, emoji: k.emoji, color: k.color }));
  return <KioskLogin kids={kids} />;
}
