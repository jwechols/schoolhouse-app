"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GROWNUPS, GROWNUPS_ORDER, type GrownupId } from "@/lib/grownups";

export default function GrownupsLanding() {
  const router = useRouter();
  const [status, setStatus] = useState<Record<string, boolean>>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/grownup-survey", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "status" }),
    })
      .then(r => r.json())
      .then(d => {
        setStatus({ jm: !!d?.jm?.exists, briana: !!d?.briana?.exists });
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg)",
      backgroundImage: "repeating-linear-gradient(45deg,transparent,transparent 38px,rgba(50,68,70,.02) 38px,rgba(50,68,70,.02) 40px)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: "40px 20px" }}>

      <div style={{ maxWidth: 640, width: "100%" }}>
        <button onClick={() => router.push("/")}
          style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted)",
            fontFamily: "var(--font-body)", fontSize: 14, padding: 0, marginBottom: 18 }}>
          ← Back to the schoolhouse
        </button>

        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontFamily: "var(--font-body)", fontSize: 12.5, letterSpacing: "0.18em",
            textTransform: "uppercase", color: "var(--tfe-olive)", marginBottom: 8 }}>
            The Grown-Ups&rsquo; Table
          </div>
          <h1 style={{ fontFamily: "var(--font-scripture)", fontWeight: 600,
            fontSize: "clamp(2.2rem,6vw,3rem)", color: "var(--ink)", lineHeight: 1.02, margin: 0 }}>
            Learn what you choose
          </h1>
          <p style={{ fontFamily: "var(--font-scripture)", fontStyle: "italic", fontSize: 17,
            color: "var(--ink-2)", marginTop: 12, lineHeight: 1.5 }}>
            Your answers are private. Each of you sets a passcode; no one else can open yours.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {GROWNUPS_ORDER.map((id: GrownupId) => {
            const g = GROWNUPS[id];
            const has = status[id];
            return (
              <button key={id} onClick={() => router.push(`/grownups/${id}`)}
                style={{ cursor: "pointer", textAlign: "left", border: "1px solid var(--border)",
                  borderRadius: 16, padding: 22, background: "#fff",
                  boxShadow: "0 1px 2px rgba(23,20,17,0.05)", display: "flex",
                  flexDirection: "column", gap: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ width: 60, height: 60, borderRadius: 14, flexShrink: 0, display: "grid",
                    placeItems: "center", fontSize: 32, background: g.soft }}>{g.emoji}</div>
                  <div>
                    <div style={{ fontFamily: "var(--font-scripture)", fontWeight: 600, fontSize: 23,
                      color: g.colorDark, lineHeight: 1 }}>{g.name}</div>
                    <div style={{ fontFamily: "var(--font-body)", fontSize: 13,
                      color: "var(--muted)", marginTop: 3 }}>{g.fullName}</div>
                  </div>
                </div>
                <div style={{ fontFamily: "var(--font-body)", fontSize: 13.5, fontWeight: 600,
                  color: g.color, background: g.color + "16", borderRadius: 99,
                  padding: "7px 14px", alignSelf: "flex-start" }}>
                  {!loaded ? "…" : has ? "🔒 Saved — enter passcode" : "Take the survey →"}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </main>
  );
}
