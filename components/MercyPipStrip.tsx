"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { addXP, recordSession } from "@/lib/progress";
import { reportLessonToHomeward, dailyLessonId } from "@/lib/homeward";

const KEY = "hw-mercy-den";

export default function MercyPipStrip() {
  const router = useRouter();
  const [sittings, setSittings] = useState(0);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    try {
      const s = JSON.parse(localStorage.getItem(KEY) || "{}");
      setSittings(s.sittings || 0);
      setPending(!!s.pending);
    } catch {
      /* ignore */
    }
  }, []);

  function markStart() {
    localStorage.setItem(KEY, JSON.stringify({ sittings, pending: true }));
    setPending(true);
  }

  function finished() {
    const next = sittings + 1;
    localStorage.setItem(KEY, JSON.stringify({ sittings: next, pending: false }));
    setSittings(next);
    setPending(false);
    addXP("mercy", 12);
    recordSession("mercy", "den");
    reportLessonToHomeward({
      kid: "mercy",
      subject: "den",
      lessonId: dailyLessonId("mercy", "den"),
      minutesEarned: 15,
      lessonTitle: "Mercy Den sitting",
      tier: "quick",
    });
  }

  return (
    <section style={{ background: "#2a1020", color: "#fff7fb", borderRadius: 20, padding: "16px 18px", marginBottom: 24 }}>
      <div style={{ fontSize: 11, letterSpacing: ".16em", fontWeight: 700, color: "#f4b6d2" }}>PIP’S DEN</div>
      <div style={{ fontFamily: "Georgia, serif", fontSize: 22, margin: "4px 0 8px" }}>
        {sittings} sitting{sittings === 1 ? "" : "s"} · coins when she finishes
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button onClick={() => { markStart(); router.push("/kids/mercy/words"); }} style={b("#ff4f9a")}>
          Words
        </button>
        <button onClick={() => { markStart(); router.push("/plan"); }} style={b("#d4a017")}>
          Lesson
        </button>
        {pending && (
          <button onClick={finished} style={b("#4a5c43")}>
            I finished
          </button>
        )}
      </div>
    </section>
  );
}

function b(bg: string): React.CSSProperties {
  return {
    border: 0,
    borderRadius: 999,
    padding: "10px 16px",
    fontWeight: 800,
    color: "#fff",
    background: bg,
    cursor: "pointer",
  };
}
