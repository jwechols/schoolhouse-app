"use client";

import Scout from "@/components/Scout";
import { TRUMA_EARTHY } from "@/lib/kids";

export default function TrumaScoutPage() {
  return (
    <Scout
      profile={{
        id:         "truma",
        name:       "Truma",
        color:      TRUMA_EARTHY.color,
        colorDark:  TRUMA_EARTHY.colorDark,
        soft:       TRUMA_EARTHY.soft,
        tutorName:  TRUMA_EARTHY.tutorName,
        tutorEmoji: TRUMA_EARTHY.tutorEmoji,
        uiSize:     "normal",
      }}
    />
  );
}
