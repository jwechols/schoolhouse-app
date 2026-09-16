"use client";

import { useRouter } from "next/navigation";
import { KIDS, type KidId, TRUMA_THEME } from "@/lib/kids";

// Truma isn't in the KIDS record (she has her own routes), so her display
// info lives here instead of duplicating a whole KidProfile for one kid.
const TRUMA_INFO = {
  name: "Truma",
  school: "Midland Classical Academy",
  tutorEmoji: "🪻",
  colorHex: TRUMA_THEME.primary,
};

/**
 * Shown instead of a lesson when the kid is at their outside school today
 * (see lib/outside-school.ts). No lesson content or progress is touched —
 * this is purely a "not today" screen; everything picks back up untouched
 * on their next home day.
 */
export default function AtSchoolToday({ kidId }: { kidId: string }) {
  const router = useRouter();
  const kid = KIDS[kidId as KidId];
  const info = kid
    ? { name: kid.name, school: kid.school, tutorEmoji: kid.tutorEmoji, colorHex: kid.colorHex }
    : TRUMA_INFO;
  const hubHref = kidId === "truma" ? "/hub" : `/kids/${kidId}/hub`;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center" style={{ background: "#fff" }}>
      <div style={{ fontSize: 64, marginBottom: 12 }}>{info.tutorEmoji}</div>
      <h1 className="text-2xl font-black mb-2" style={{ color: info.colorHex }}>
        {info.name} is at {info.school} today
      </h1>
      <p className="text-gray-600 mb-6 max-w-sm">
        No new Schoolhouse lesson today, just school. Nothing is lost, everything picks right back up when {info.name} is home.
      </p>
      <button
        onClick={() => router.push(hubHref)}
        className="px-6 py-3 rounded-2xl font-black text-white"
        style={{ backgroundColor: info.colorHex }}
      >
        Back to Hub 🏠
      </button>
    </div>
  );
}
