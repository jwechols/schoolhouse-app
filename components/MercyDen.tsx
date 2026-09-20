"use client";

import { useEffect, useMemo, useState } from "react";
import { addXP, recordSession } from "@/lib/progress";
import { reportLessonToHomeward, dailyLessonId } from "@/lib/homeward";

const KEY = "hw-mercy-den";
const PARTS = ["ears", "spots", "tail", "locket", "wings", "hoops", "crown"] as const;

function load() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "{}") as {
      sittings?: number;
      pending?: boolean;
    };
  } catch {
    return {};
  }
}

export default function MercyDen() {
  const [sittings, setSittings] = useState(0);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    const s = load();
    setSittings(s.sittings || 0);
    setPending(!!s.pending);
  }, []);

  function save(next: { sittings: number; pending: boolean }) {
    localStorage.setItem(KEY, JSON.stringify(next));
    setSittings(next.sittings);
    setPending(next.pending);
  }

  function start(kind: "words" | "lessons") {
    save({ sittings, pending: true });
    window.location.href = kind === "words" ? "/kids/mercy/words" : "/plan";
  }

  function finished() {
    const next = sittings + 1;
    save({ sittings: next, pending: false });
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

  const unlocked = useMemo(() => PARTS.slice(0, Math.min(sittings, PARTS.length)), [sittings]);

  return (
    <main style={{ minHeight: "100vh", background: "#1a0814", color: "#fff7fb", padding: "24px 18px 48px" }}>
      <div style={{ maxWidth: 420, margin: "0 auto" }}>
        <p style={{ letterSpacing: ".2em", fontSize: 11, fontWeight: 700, color: "#f4b6d2" }}>MERCY’S DEN</p>
        <h1 style={{ fontFamily: "Georgia, serif", fontWeight: 400, fontSize: 36, margin: "6px 0 8px" }}>Pip</h1>
        <p style={{ color: "#e7b7cc", fontStyle: "italic", marginBottom: 18 }}>
          Do Words or a lesson. Come back and tap I finished. Pip gets a new look. You also get coins.
        </p>
        <div style={{ background: "#2a1020", borderRadius: 24, padding: 18, textAlign: "center", marginBottom: 16 }}>
          <div style={{ fontSize: 72, lineHeight: 1 }}>✨</div>
          <p style={{ margin: "8px 0 0", color: "#f4b6d2" }}>
            {unlocked.length ? unlocked.join(" · ") : "Just hatched. First sitting unlocks ears."}
          </p>
          <p style={{ fontSize: 13, color: "#c98eaa" }}>{sittings} sittings</p>
        </div>
        <button onClick={() => start("words")} style={btn("#ff4f9a")}>
          Words
        </button>
        <button onClick={() => start("lessons")} style={btn("#d4a017")}>
          Lessons
        </button>
        {pending && (
          <button onClick={finished} style={btn("#4a5c43")}>
            I finished this sitting
          </button>
        )}
        <p style={{ marginTop: 16, fontSize: 13, color: "#c98eaa" }}>
          Full hub still lives at /kids/mercy/hub if she wants games.
        </p>
      </div>
    </main>
  );
}

function btn(bg: string): React.CSSProperties {
  return {
    display: "block",
    width: "100%",
    margin: "0 0 10px",
    height: 52,
    border: 0,
    borderRadius: 16,
    background: bg,
    color: "#fff",
    fontWeight: 800,
    fontSize: 16,
    cursor: "pointer",
  };
}
