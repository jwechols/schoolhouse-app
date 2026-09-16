"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  GROWNUPS, TOPIC_IDEAS, LEVELS, DEPTHS, TIMES, FORMATS,
  type GrownupId, type LearningWish, type SurveyPayload,
  type LevelId, type DepthId, type TimeId, type FormatId,
} from "@/lib/grownups";

function blankWish(): LearningWish {
  return { topic: "", why: "", level: "new", depth: "working" };
}

type Phase = "loading" | "set" | "enter" | "form" | "summary" | "unconfigured";

// ── Small building blocks ────────────────────────────────────────────────────
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontFamily: "var(--font-body)", fontSize: 12, letterSpacing: "0.16em",
      textTransform: "uppercase", color: "var(--tfe-olive)", marginBottom: 10 }}>
      {children}
    </div>
  );
}

function Chip({ label, hint, active, color, onClick }: {
  label: string; hint?: string; active: boolean; color: string; onClick: () => void;
}) {
  return (
    <button type="button" onClick={onClick}
      style={{ cursor: "pointer", textAlign: "left", borderRadius: 12, padding: "10px 14px",
        border: active ? `2px solid ${color}` : "1.5px solid var(--border)",
        background: active ? color + "16" : "#fff" }}>
      <div style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 14,
        color: active ? color : "var(--ink)" }}>{label}</div>
      {hint && <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--muted)",
        marginTop: 1 }}>{hint}</div>}
    </button>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%", border: "1.5px solid var(--border)", borderRadius: 12, padding: "12px 14px",
  fontSize: 16, fontFamily: "var(--font-body)", color: "var(--ink)", outline: "none",
  background: "#fff", boxSizing: "border-box",
};

// ── Main ─────────────────────────────────────────────────────────────────────
export default function GrownupSurvey({ person }: { person: GrownupId }) {
  const router = useRouter();
  const g = GROWNUPS[person];

  const [phase, setPhase] = useState<Phase>("loading");
  const [passcode, setPasscode] = useState("");      // the active/confirmed code
  const [pcA, setPcA] = useState("");                // set-passcode entry
  const [pcB, setPcB] = useState("");                // set-passcode confirm
  const [pcEnter, setPcEnter] = useState("");        // enter-passcode entry
  const [gateError, setGateError] = useState("");
  const [busy, setBusy] = useState(false);

  const [wishes, setWishes] = useState<LearningWish[]>([blankWish()]);
  const [time, setTime] = useState<TimeId>("20");
  const [formats, setFormats] = useState<FormatId[]>(["interactive"]);
  const [resources, setResources] = useState("");
  const [notes, setNotes] = useState("");
  const [copied, setCopied] = useState(false);
  const [saveError, setSaveError] = useState("");

  // On mount: does this person already have a saved (locked) survey?
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const r = await fetch("/api/grownup-survey", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "unlock", person }),
        });
        const d = await r.json();
        if (cancelled) return;
        if (d?.configured === false) { setPhase("unconfigured"); return; }
        setPhase(d?.exists ? "enter" : "set");
      } catch {
        if (!cancelled) setPhase("unconfigured");
      }
    })();
    return () => { cancelled = true; };
  }, [person]);

  function loadPayload(p: SurveyPayload) {
    setWishes(p.topics?.length ? p.topics : [blankWish()]);
    setTime(p.timePerSitting ?? "20");
    setFormats(p.formats ?? []);
    setResources(p.resources ?? "");
    setNotes(p.notes ?? "");
  }

  function setWish(i: number, patch: Partial<LearningWish>) {
    setWishes(ws => ws.map((w, j) => (j === i ? { ...w, ...patch } : w)));
  }
  function addWish() { setWishes(ws => [...ws, blankWish()]); }
  function removeWish(i: number) { setWishes(ws => ws.filter((_, j) => j !== i)); }
  function toggleFormat(f: FormatId) {
    setFormats(fs => (fs.includes(f) ? fs.filter(x => x !== f) : [...fs, f]));
  }

  // ── Gate actions ──────────────────────────────────────────────────────────
  function confirmSetPasscode() {
    setGateError("");
    if (!/^\d{4,8}$/.test(pcA)) { setGateError("Use 4 to 8 digits."); return; }
    if (pcA !== pcB) { setGateError("The two codes don't match."); return; }
    setPasscode(pcA);
    setPhase("form");
  }

  async function submitEnterPasscode() {
    setGateError("");
    if (!/^\d{4,8}$/.test(pcEnter)) { setGateError("Use 4 to 8 digits."); return; }
    setBusy(true);
    try {
      const r = await fetch("/api/grownup-survey", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "unlock", person, passcode: pcEnter }),
      });
      const d = await r.json();
      if (d?.ok && d?.payload) {
        loadPayload(d.payload as SurveyPayload);
        setPasscode(pcEnter);
        setPhase("form");
      } else {
        setGateError("That passcode didn't match. Try again.");
      }
    } catch {
      setGateError("Something went wrong. Try again.");
    } finally {
      setBusy(false);
    }
  }

  const validWishes = wishes.filter(w => w.topic.trim());
  const canSave = validWishes.length > 0;

  async function handleSave() {
    if (!canSave || busy) return;
    setSaveError("");
    setBusy(true);
    const payload: SurveyPayload = {
      submittedAt: new Date().toISOString(),
      topics: validWishes.map(w => ({ ...w, topic: w.topic.trim(), why: w.why.trim() })),
      timePerSitting: time,
      formats,
      resources: resources.trim(),
      notes: notes.trim(),
    };
    try {
      const r = await fetch("/api/grownup-survey", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "save", person, passcode, payload }),
      });
      const d = await r.json();
      if (d?.ok) {
        setPhase("summary");
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else if (d?.configured === false) {
        setSaveError("Saving isn't set up on this device. Try on the family iPad.");
      } else {
        setSaveError("Couldn't save. Please try again.");
      }
    } catch {
      setSaveError("Couldn't save. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  // ── Gate + status screens ───────────────────────────────────────────────────
  if (phase === "loading") {
    return <main style={pageStyle}><Centered>Loading…</Centered></main>;
  }
  if (phase === "unconfigured") {
    return (
      <main style={pageStyle}>
        <Centered>
          <div style={{ maxWidth: 420, textAlign: "center" }}>
            <div style={{ fontSize: 40, marginBottom: 10 }}>🔒</div>
            <h1 style={headingStyle(g.colorDark)}>Private saving not available here</h1>
            <p style={{ fontFamily: "var(--font-body)", color: "var(--muted)", marginTop: 8 }}>
              Open Schoolhouse on the family iPad to fill out your survey.
            </p>
            <BackBtn onClick={() => router.push("/grownups")} />
          </div>
        </Centered>
      </main>
    );
  }
  if (phase === "set" || phase === "enter") {
    const setting = phase === "set";
    return (
      <main style={pageStyle}>
        <Centered>
          <div style={{ maxWidth: 420, width: "100%" }}>
            <div style={{ textAlign: "center", marginBottom: 22 }}>
              <div style={{ width: 60, height: 60, borderRadius: 14, margin: "0 auto 12px",
                display: "grid", placeItems: "center", fontSize: 32, background: g.soft }}>{g.emoji}</div>
              <h1 style={headingStyle(g.colorDark)}>{g.name}&rsquo;s survey</h1>
              <p style={{ fontFamily: "var(--font-body)", color: "var(--muted)", fontSize: 14.5,
                marginTop: 8, lineHeight: 1.5 }}>
                {setting
                  ? "Pick a passcode (4 to 8 digits). You'll need it to open your answers. No one else can see them."
                  : "Enter your passcode to open your answers."}
              </p>
            </div>
            <div style={{ ...cardStyle, display: "flex", flexDirection: "column", gap: 12 }}>
              {setting ? (
                <>
                  <input type="password" inputMode="numeric" autoFocus value={pcA}
                    onChange={e => setPcA(e.target.value.replace(/\D/g, "").slice(0, 8))}
                    placeholder="Choose a passcode"
                    style={{ ...inputStyle, textAlign: "center", letterSpacing: "0.3em", fontSize: 22 }} />
                  <input type="password" inputMode="numeric" value={pcB}
                    onChange={e => setPcB(e.target.value.replace(/\D/g, "").slice(0, 8))}
                    placeholder="Type it again"
                    onKeyDown={e => e.key === "Enter" && confirmSetPasscode()}
                    style={{ ...inputStyle, textAlign: "center", letterSpacing: "0.3em", fontSize: 22 }} />
                </>
              ) : (
                <input type="password" inputMode="numeric" autoFocus value={pcEnter}
                  onChange={e => setPcEnter(e.target.value.replace(/\D/g, "").slice(0, 8))}
                  placeholder="Passcode"
                  onKeyDown={e => e.key === "Enter" && submitEnterPasscode()}
                  style={{ ...inputStyle, textAlign: "center", letterSpacing: "0.3em", fontSize: 22 }} />
              )}
              {gateError && (
                <p style={{ color: "var(--terracotta)", textAlign: "center", fontSize: 13,
                  fontWeight: 600, margin: 0 }}>{gateError}</p>
              )}
              <button onClick={setting ? confirmSetPasscode : submitEnterPasscode} disabled={busy}
                style={{ ...primaryBtn(g.color, g.colorDark), width: "100%", fontSize: 16,
                  padding: "14px", opacity: busy ? 0.5 : 1 }}>
                {busy ? "…" : setting ? "Set passcode & continue →" : "Open my survey →"}
              </button>
            </div>
            <BackBtn onClick={() => router.push("/grownups")} center />
          </div>
        </Centered>
      </main>
    );
  }

  // ── Summary (after save) ─────────────────────────────────────────────────
  if (phase === "summary") {
    const summary = buildSummaryText(person, {
      submittedAt: "", topics: validWishes, timePerSitting: time, formats, resources, notes,
    });
    return (
      <main style={pageStyle}>
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "32px 20px 80px" }}>
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <div style={{ fontSize: 44 }}>✅</div>
            <h1 style={headingStyle(g.colorDark)}>Got it, {g.name}!</h1>
            <p style={{ fontFamily: "var(--font-body)", color: "var(--muted)", fontSize: 15,
              marginTop: 6 }}>
              Saved privately. Next, these turn into real lessons made just for you.
            </p>
          </div>
          <div style={{ ...cardStyle, whiteSpace: "pre-wrap", fontFamily: "var(--font-scripture)",
            fontSize: 15.5, lineHeight: 1.6, color: "var(--ink)" }}>
            {summary}
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 18, flexWrap: "wrap" }}>
            <button onClick={() => {
                navigator.clipboard?.writeText(summary).then(() => {
                  setCopied(true); setTimeout(() => setCopied(false), 2000);
                }).catch(() => {});
              }}
              style={primaryBtn(g.color, g.colorDark)}>
              {copied ? "Copied ✓" : "Copy my answers"}
            </button>
            <button onClick={() => setPhase("form")} style={ghostBtn}>Edit answers</button>
            <button onClick={() => router.push("/grownups")} style={ghostBtn}>Done</button>
          </div>
        </div>
      </main>
    );
  }

  // ── Form ──────────────────────────────────────────────────────────────────
  return (
    <main style={pageStyle}>
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "28px 20px 100px" }}>
        <BackBtn onClick={() => router.push("/grownups")} />
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 6 }}>
          <div style={{ width: 54, height: 54, borderRadius: 14, display: "grid",
            placeItems: "center", fontSize: 30, background: g.soft }}>{g.emoji}</div>
          <div>
            <h1 style={{ ...headingStyle(g.colorDark), margin: 0 }}>What do you want to learn?</h1>
            <div style={{ fontFamily: "var(--font-body)", color: "var(--muted)", fontSize: 14 }}>
              {g.fullName}&rsquo;s learning survey &middot; 🔒 private
            </div>
          </div>
        </div>
        <p style={{ fontFamily: "var(--font-scripture)", fontStyle: "italic", fontSize: 16,
          color: "var(--ink-2)", lineHeight: 1.5, marginTop: 10, marginBottom: 26 }}>
          Add anything you&rsquo;ve wished you knew more about. No topic is too big or too small.
        </p>

        <SectionLabel>Things I want to learn</SectionLabel>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 18 }}>
          {TOPIC_IDEAS.map(idea => (
            <button key={idea} type="button"
              onClick={() => {
                setWishes(ws => {
                  const firstEmpty = ws.findIndex(w => !w.topic.trim());
                  if (firstEmpty >= 0) return ws.map((w, j) => (j === firstEmpty ? { ...w, topic: idea } : w));
                  return [...ws, { ...blankWish(), topic: idea }];
                });
              }}
              style={{ cursor: "pointer", borderRadius: 99, padding: "7px 13px",
                border: "1.5px solid var(--border)", background: "#fff",
                fontFamily: "var(--font-body)", fontSize: 13.5, color: "var(--ink-2)" }}>
              + {idea}
            </button>
          ))}
        </div>

        {wishes.map((w, i) => (
          <div key={i} style={{ ...cardStyle, marginBottom: 16,
            borderColor: w.topic.trim() ? g.color + "55" : "var(--border)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <input value={w.topic} onChange={e => setWish(i, { topic: e.target.value })}
                placeholder={`Topic ${i + 1} — e.g. "How to read Hebrew"`}
                style={{ ...inputStyle, fontWeight: 600, fontSize: 17 }} />
              {wishes.length > 1 && (
                <button type="button" onClick={() => removeWish(i)} aria-label="Remove topic"
                  style={{ flexShrink: 0, width: 40, height: 40, borderRadius: 10, cursor: "pointer",
                    border: "1.5px solid var(--border)", background: "#fff",
                    color: "var(--terracotta)", fontSize: 18 }}>×</button>
              )}
            </div>
            <input value={w.why} onChange={e => setWish(i, { why: e.target.value })}
              placeholder="Why this? What would you love to do with it? (optional)"
              style={{ ...inputStyle, marginBottom: 14 }} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <SectionLabel>Where I&rsquo;m starting</SectionLabel>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {LEVELS.map(l => (
                    <Chip key={l.id} label={l.label} hint={l.hint} color={g.color}
                      active={w.level === l.id} onClick={() => setWish(i, { level: l.id as LevelId })} />
                  ))}
                </div>
              </div>
              <div>
                <SectionLabel>How deep to go</SectionLabel>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {DEPTHS.map(d => (
                    <Chip key={d.id} label={d.label} hint={d.hint} color={g.color}
                      active={w.depth === d.id} onClick={() => setWish(i, { depth: d.id as DepthId })} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}

        <button type="button" onClick={addWish}
          style={{ ...ghostBtn, width: "100%", marginBottom: 32, borderStyle: "dashed",
            color: g.colorDark }}>
          + Add another topic
        </button>

        <SectionLabel>How much time do you like per sitting?</SectionLabel>
        <div style={{ display: "flex", gap: 10, marginBottom: 26, flexWrap: "wrap" }}>
          {TIMES.map(t => (
            <Chip key={t.id} label={t.label} color={g.color}
              active={time === t.id} onClick={() => setTime(t.id as TimeId)} />
          ))}
        </div>

        <SectionLabel>How do you like to learn? (pick any)</SectionLabel>
        <div style={{ display: "flex", gap: 10, marginBottom: 26, flexWrap: "wrap" }}>
          {FORMATS.map(f => (
            <Chip key={f.id} label={`${f.emoji}  ${f.label}`} color={g.color}
              active={formats.includes(f.id as FormatId)} onClick={() => toggleFormat(f.id as FormatId)} />
          ))}
        </div>

        <SectionLabel>A specific book, passage, or resource? (optional)</SectionLabel>
        <textarea value={resources} onChange={e => setResources(e.target.value)} rows={2}
          placeholder='e.g. "Work through Calvin&apos;s Institutes" or "The book of Romans"'
          style={{ ...inputStyle, marginBottom: 24, resize: "vertical" }} />

        <SectionLabel>Anything else I should know? (optional)</SectionLabel>
        <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2}
          placeholder="Anything at all…"
          style={{ ...inputStyle, marginBottom: 28, resize: "vertical" }} />

        <button onClick={handleSave} disabled={!canSave || busy}
          style={{ ...primaryBtn(g.color, g.colorDark), width: "100%", fontSize: 17, padding: "16px",
            opacity: (canSave && !busy) ? 1 : 0.4, cursor: (canSave && !busy) ? "pointer" : "default" }}>
          {busy ? "Saving…" : "Save my answers →"}
        </button>
        {saveError && (
          <p style={{ textAlign: "center", color: "var(--terracotta)", fontSize: 13,
            fontWeight: 600, fontFamily: "var(--font-body)", marginTop: 10 }}>{saveError}</p>
        )}
        {!canSave && !saveError && (
          <p style={{ textAlign: "center", color: "var(--muted)", fontSize: 13,
            fontFamily: "var(--font-body)", marginTop: 10 }}>Add at least one topic to save.</p>
        )}
      </div>
    </main>
  );
}

// ── Summary text ──────────────────────────────────────────────────────────────
function buildSummaryText(person: GrownupId, s: SurveyPayload): string {
  const g = GROWNUPS[person];
  const levelLabel = (id: string) => LEVELS.find(l => l.id === id)?.label ?? id;
  const depthLabel = (id: string) => DEPTHS.find(d => d.id === id)?.label ?? id;
  const timeLabel = TIMES.find(t => t.id === s.timePerSitting)?.label ?? s.timePerSitting;
  const fmtLabels = s.formats.map(f => FORMATS.find(x => x.id === f)?.label ?? f).join(", ");
  const lines: string[] = [`${g.fullName}'s learning survey`, "", "Wants to learn:"];
  s.topics.forEach((t, i) => {
    lines.push(`  ${i + 1}. ${t.topic}`);
    if (t.why) lines.push(`     why: ${t.why}`);
    lines.push(`     starting: ${levelLabel(t.level)} · depth: ${depthLabel(t.depth)}`);
  });
  lines.push("", `Time per sitting: ${timeLabel}`, `Preferred format: ${fmtLabels || "—"}`);
  if (s.resources) lines.push(`Resources to use: ${s.resources}`);
  if (s.notes) lines.push(`Notes: ${s.notes}`);
  return lines.join("\n");
}

// ── Bits ──────────────────────────────────────────────────────────────────────
function Centered({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center",
      justifyContent: "center", padding: "40px 20px" }}>{children}</div>
  );
}
function BackBtn({ onClick, center }: { onClick: () => void; center?: boolean }) {
  return (
    <button onClick={onClick}
      style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted)",
        fontFamily: "var(--font-body)", fontSize: 14, padding: 0, marginTop: center ? 16 : 0,
        marginBottom: center ? 0 : 14, display: "block",
        marginLeft: center ? "auto" : 0, marginRight: center ? "auto" : 0 }}>
      ← Back
    </button>
  );
}

// ── Shared styles ────────────────────────────────────────────────────────────
const pageStyle: React.CSSProperties = {
  minHeight: "100vh", background: "var(--bg)",
  backgroundImage: "repeating-linear-gradient(45deg,transparent,transparent 38px,rgba(50,68,70,.02) 38px,rgba(50,68,70,.02) 40px)",
};
const cardStyle: React.CSSProperties = {
  background: "#fff", borderRadius: 18, padding: 20,
  border: "1.5px solid var(--border)", boxShadow: "0 4px 16px rgba(50,68,70,0.07)",
};
function headingStyle(color: string): React.CSSProperties {
  return { fontFamily: "var(--font-scripture)", fontWeight: 600, fontSize: "clamp(1.8rem,5vw,2.4rem)",
    color, lineHeight: 1.05, margin: "6px 0 0" };
}
function primaryBtn(color: string, colorDark: string): React.CSSProperties {
  return { border: "none", borderRadius: 14, padding: "13px 22px",
    background: `linear-gradient(135deg,${color},${colorDark})`, color: "#fff",
    fontFamily: "var(--font-body)", fontWeight: 700, fontSize: 15, cursor: "pointer",
    boxShadow: `0 4px 14px ${color}44` };
}
const ghostBtn: React.CSSProperties = {
  border: "1.5px solid var(--border)", borderRadius: 14, padding: "13px 22px",
  background: "#fff", color: "var(--ink)", fontFamily: "var(--font-body)",
  fontWeight: 600, fontSize: 15, cursor: "pointer",
};
