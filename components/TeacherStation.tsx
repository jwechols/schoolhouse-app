"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import SchoolhouseLogo from "./SchoolhouseLogo";
import { STATION_ORDER, kidMetaFor, type StationKidMeta } from "@/lib/station-meta";
import { joinAsBoard, type BoardChannel, type KidPresence, type KidStatus } from "@/lib/station";

// ── Pure Schoolhouse Design System, no custom palette. Homeroom renders in the
// system's own dark theme (data-theme="dark" on the root); every color is a token,
// so it stays consistent with the rest of the app and flips to light in one edit.
// Per-kid color comes from the `.theme-<kid>` classes; status from --status-*.

type LaneStatus = KidStatus | "offline";

const STATUS: Record<LaneStatus, { label: string; text: string; dot: string }> = {
  ready:   { label: "Ready",      text: "var(--status-ready-text)",   dot: "var(--status-ready-dot)" },
  working: { label: "Working",    text: "var(--status-working-text)", dot: "var(--status-working-dot)" },
  help:    { label: "Needs help", text: "var(--status-help-text)",    dot: "var(--status-help-dot)" },
  done:    { label: "All done",   text: "var(--status-done-text)",    dot: "var(--status-done-dot)" },
  offline: { label: "Offline",    text: "var(--text-muted)",          dot: "var(--border-strong)" },
};

const eyebrow = {
  fontFamily: "var(--font-sub)", fontSize: 11, fontWeight: 700,
  letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "var(--text-muted)",
};

const mix = (c: string, pct: number, base = "transparent") =>
  `color-mix(in srgb, ${c} ${pct}%, ${base})`;

// ── Navy header + bone body ──────────────────────────────────────────────────
// Light design-system theme with a warm bone page and paper cards, capped by a
// deep-navy header (the system's --accent-strong). Cream treatment inside the
// header only.
const BONE      = "#ece3cf";                 // warm bone body
const NAVY      = "var(--accent-strong)";     // system deep navy for the header
const HDR_TX    = "#f6f1e6";                   // cream text on navy
const HDR_SOFT  = "rgba(246,241,230,0.74)";
const HDR_FILL  = "rgba(246,241,230,0.12)";
const HDR_LINE  = "rgba(246,241,230,0.24)";
const HDR_ROOF  = "#cdd9e6";                   // light-blue roof for the mark on navy

interface Lane { meta: StationKidMeta; live: KidPresence | null }

// ── Minute gauge (real minutes on task; 30 min = a full ring) ──────────────────
function MinuteGauge({ minutes, active }: { minutes: number; active: boolean }) {
  const size = 46, stroke = 5;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const value = Math.min(minutes / 30, 1);
  const strokeColor = active ? "var(--accent)" : "var(--border-strong)";
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--border)" strokeWidth={stroke} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={strokeColor} strokeWidth={stroke}
          strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - value)}
          style={{ transition: "stroke-dashoffset .6s var(--ease)" }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center",
        fontFamily: "var(--font-body)", fontWeight: 700, fontSize: 15, color: "var(--ink)" }}>
        {minutes}
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: LaneStatus }) {
  const s = STATUS[status];
  // Only a raised hand pulses, no ambient motion competing for attention (ADHD-friendly).
  const pulse = status === "help" ? "dot-help" : "";
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6,
      fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 12, color: s.text,
      background: mix(s.dot, 15, "var(--surface)"), padding: "3px 10px 3px 8px", borderRadius: 99,
      border: `1px solid ${mix(s.dot, 34)}`, whiteSpace: "nowrap" }}>
      <span className={pulse} style={{ width: 7, height: 7, borderRadius: 99,
        background: s.dot, color: s.dot }} />
      {s.label}
    </span>
  );
}

// ── KidLane ──────────────────────────────────────────────────────────────────
function KidLane({ lane, onSummon, onLearn, onResolve, onOpen }: {
  lane: Lane;
  onSummon: (id: string) => void;
  onLearn: (id: string, subjectId: string, label: string) => void;
  onResolve: (id: string) => void;
  onOpen: (id: string) => void;
}) {
  const { meta, live } = lane;
  const online = !!live;
  const status: LaneStatus = live ? live.status : "offline";
  const help = status === "help";

  return (
    <div className={`theme-${meta.id}`}
      style={{ display: "flex", flexDirection: "column", gap: 10, background: "var(--surface)",
        borderRadius: 18, padding: 13, minHeight: "100%", boxSizing: "border-box",
        opacity: online ? 1 : 0.72,
        boxShadow: help ? `0 0 0 2px var(--status-help-dot), var(--sh-lg)` : "var(--sh-md)",
        border: help ? "1px solid transparent" : "1px solid var(--border)" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <button onClick={() => onOpen(meta.id)} className="btn-bouncy"
          style={{ border: "none", cursor: "pointer", width: 44, height: 44, borderRadius: 12,
            display: "grid", placeItems: "center", fontSize: 24,
            background: online ? "var(--accent-tint)" : "var(--surface-sunken)",
            boxShadow: `inset 0 0 0 2px ${online ? "var(--accent-line)" : "var(--border)"}`,
            filter: online ? "none" : "grayscale(0.4)" }}>
          {meta.avatar}
        </button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: "var(--font-scripture)", fontWeight: 600, fontSize: 19,
            color: "var(--ink)", lineHeight: 1 }}>{meta.name}</div>
          <div style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--text-muted)", marginTop: 3 }}>
            {meta.grade}{online ? ` · Lv ${live!.level}${live!.streak > 0 ? ` · ${live!.streak}🔥` : ""}` : ""}</div>
        </div>
        <StatusPill status={status} />
      </div>

      {/* Now card */}
      <div style={{ borderRadius: 13, padding: 11,
        background: online ? "var(--accent-tint)" : "var(--surface-sunken)",
        border: `1px solid ${online ? "var(--accent-line)" : "var(--border)"}` }}>
        <div style={{ ...eyebrow, fontSize: 10, letterSpacing: "0.08em", marginBottom: 7,
          color: online ? "var(--accent-ink)" : "var(--text-muted)" }}>
          {!online ? "Offline" : status === "help" ? "Raised a hand" : status === "working" ? "Working on now" : "At the hub"}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
          <MinuteGauge minutes={online ? live!.minutes : 0} active={online} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: "var(--font-body)", fontWeight: 500, fontSize: 13.5,
              color: "var(--ink)", lineHeight: 1.15 }}>
              {online ? live!.activity : "iPad not open"}
            </div>
            <div style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
              {!online ? "Waiting for this device" : live!.minutes > 0 ? `${live!.minutes} min on task` : "Just started"}
            </div>
          </div>
        </div>
      </div>

      {/* Primary action */}
      {help ? (
        <button onClick={() => onResolve(meta.id)} className="btn-bouncy"
          style={{ cursor: "pointer", border: "none", borderRadius: 12, padding: "11px",
            fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 14,
            color: "var(--text-on-accent)", background: "var(--danger)", boxShadow: "var(--sh-sm)" }}>
          🙋 Help raised, I&rsquo;ve got it
        </button>
      ) : (
        <button onClick={() => online && onSummon(meta.id)} disabled={!online} className="btn-bouncy"
          style={{ cursor: online ? "pointer" : "default", borderRadius: 12, padding: "11px",
            fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 14,
            color: online ? "var(--text-on-accent)" : "var(--text-faint)",
            background: online ? "var(--accent)" : "var(--surface-sunken)",
            border: online ? "none" : "1px solid var(--border)",
            boxShadow: online ? "var(--sh-sm)" : "none" }}>
          {online ? "▶ Summon to lesson" : "Waiting for iPad"}
        </button>
      )}

      {/* Quick-launch subjects, only when the lane is live (offline stays dead simple) */}
      {online && (
        <div>
          <div style={{ ...eyebrow, fontSize: 10, letterSpacing: "0.08em", margin: "2px 0 6px" }}>
            Send them to
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {meta.subjects.map(s => (
              <button key={s.id} onClick={() => onLearn(meta.id, s.id, s.label)}
                className="btn-bouncy"
                style={{ display: "inline-flex", alignItems: "center", gap: 5, cursor: "pointer",
                  border: "1px solid var(--border)", background: "var(--surface-sunken)", borderRadius: 9,
                  padding: "6px 10px", fontFamily: "var(--font-body)", fontSize: 12.5,
                  fontWeight: 600, color: "var(--text-soft)" }}>
                <span>{s.emoji}</span><span>{s.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}

// ── Toast ─────────────────────────────────────────────────────────────────────
function Toast({ msg, onDone }: { msg: string; onDone: () => void }) {
  useEffect(() => { const t = setTimeout(onDone, 2600); return () => clearTimeout(t); }, [onDone]);
  return (
    <div style={{ position: "fixed", bottom: 84, left: "50%", transform: "translateX(-50%)",
      background: "var(--ink)", color: "var(--surface)", borderRadius: 99, padding: "12px 24px",
      fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 14, whiteSpace: "nowrap",
      boxShadow: "var(--sh-lg)", zIndex: 999, animation: "toastIn .3s var(--ease)" }}>
      {msg}
    </div>
  );
}

// ── Responsive hook ────────────────────────────────────────────────────────────
function useResponsive() {
  const [w, setW] = useState(1280);
  useEffect(() => {
    const on = () => setW(window.innerWidth);
    on();
    window.addEventListener("resize", on);
    return () => window.removeEventListener("resize", on);
  }, []);
  return { isMobile: w <= 680, cols: w <= 680 ? 1 : w <= 1024 ? 2 : 4 };
}

// ── Main component ────────────────────────────────────────────────────────────
export default function TeacherStation() {
  const router = useRouter();
  const { isMobile, cols } = useResponsive();
  const [presence, setPresence] = useState<Record<string, KidPresence>>({});
  const [helpKids, setHelpKids] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState("");
  const [clock, setClock] = useState<Date>(() => new Date());
  const boardRef = useRef<BoardChannel | null>(null);
  const audioRef = useRef<AudioContext | null>(null);

  // A gentle two-note bell when a child raises a hand (no asset, WebAudio).
  const chime = useCallback(() => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const AC = (window as any).AudioContext || (window as any).webkitAudioContext;
      if (!AC) return;
      const ctx: AudioContext = audioRef.current ?? (audioRef.current = new AC());
      if (ctx.state === "suspended") ctx.resume();
      const now = ctx.currentTime;
      ([[880, 0], [1174.66, 0.16]] as const).forEach(([f, t]) => {
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.type = "sine"; o.frequency.value = f;
        o.connect(g); g.connect(ctx.destination);
        const s = now + t;
        g.gain.setValueAtTime(0.0001, s);
        g.gain.exponentialRampToValueAtTime(0.22, s + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, s + 0.5);
        o.start(s); o.stop(s + 0.55);
      });
    } catch { /* audio blocked (no gesture yet), the visual alert still shows */ }
  }, []);

  useEffect(() => {
    const board = joinAsBoard(
      (kids) => {
        const map: Record<string, KidPresence> = {};
        for (const k of kids) map[k.kidId] = k;
        setPresence(map);
      },
      (signal) => {
        setHelpKids((prev) => {
          const next = new Set(prev);
          if (signal.raised) next.add(signal.kidId); else next.delete(signal.kidId);
          return next;
        });
        if (signal.raised) { chime(); setToast(`🙋 ${signal.name} needs help!`); }
      },
    );
    boardRef.current = board;
    return () => { board.destroy(); boardRef.current = null; };
  }, [chime]);

  // Live header clock, a concrete, always-visible time cue (ADHD-friendly).
  useEffect(() => {
    const t = setInterval(() => setClock(new Date()), 15000);
    return () => clearInterval(t);
  }, []);

  const showToast = useCallback((msg: string) => setToast(msg), []);

  const lanes: Lane[] = STATION_ORDER.map(id => {
    const meta = kidMetaFor(id);
    let live = presence[id] ?? null;
    // A broadcast hand-raise overrides status to "help" (presence status-updates
    // don't propagate reliably; the help broadcast does).
    if (helpKids.has(id)) {
      live = live
        ? { ...live, status: "help" as KidStatus }
        : { kidId: id, name: meta.name, avatar: meta.avatar, status: "help", activity: "Raised a hand", minutes: 0, level: 1, streak: 0, mastery: [], onlineAt: Date.now() };
    }
    return { meta, live };
  });

  function summon(id: string) {
    const meta = kidMetaFor(id);
    boardRef.current?.sendCommand({ type: "launch", target: id, path: meta.lessonPath, label: "lesson" });
    showToast(`Sent ${meta.name} to their lesson`);
  }

  function sendToLearn(id: string, subjectId: string, label: string) {
    const meta = kidMetaFor(id);
    boardRef.current?.sendCommand({ type: "launch", target: id, path: meta.learnPath(subjectId), label });
    showToast(`Sent ${meta.name} to ${label}`);
  }

  function resolve(id: string) {
    boardRef.current?.sendCommand({ type: "clearHelp", target: id });
    setHelpKids(prev => { const next = new Set(prev); next.delete(id); return next; });
    showToast(`On your way to help ${kidMetaFor(id).name} 💛`);
  }

  function openHub(id: string) {
    router.push(id === "truma" ? "/hub" : `/kids/${id}/hub`);
  }

  function startMorning() {
    const ready = lanes.filter(l => l.live && l.live.status === "ready");
    ready.forEach(l => boardRef.current?.sendCommand({
      type: "launch", target: l.meta.id, path: l.meta.lessonPath, label: "lesson",
    }));
    showToast(ready.length
      ? `Morning Block sent to ${ready.length} ${ready.length === 1 ? "child" : "children"} ☀️`
      : "No one is waiting at the hub yet");
  }

  function broadcast(message: string, emoji: string) {
    boardRef.current?.sendCommand({ type: "broadcast", target: "all", message, emoji });
    showToast(`Sent to every screen: ${message}`);
  }

  const online = lanes.filter(l => l.live).length;
  const working = lanes.filter(l => l.live && l.live.status === "working").length;
  const helpCount = lanes.filter(l => l.live && l.live.status === "help").length;
  const dateStr = clock.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  const timeStr = clock.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

  return (
    // Light design-system theme with a warm bone page (scoped override) and a
    // navy header below.
    <div
      style={{ ["--surface-page" as string]: BONE, height: isMobile ? "auto" : "100vh",
        minHeight: isMobile ? "100vh" : undefined,
        display: "flex", flexDirection: "column", backgroundColor: BONE,
        backgroundImage: `repeating-linear-gradient(45deg,transparent,transparent 40px,${mix("var(--ink)", 3)} 40px,${mix("var(--ink)", 3)} 41px)` } as React.CSSProperties}>

      {/* ── Top bar (deep navy band over the bone body) ──────────────── */}
      <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap",
        gap: isMobile ? 12 : 18, padding: isMobile ? "12px 16px" : "14px 24px",
        background: NAVY, color: HDR_TX, flexShrink: 0,
        borderBottom: `1px solid ${HDR_LINE}`,
        position: isMobile ? "sticky" : "static", top: 0, zIndex: 50,
        boxShadow: "0 2px 12px rgba(23,32,58,0.28)" }}>
        <button onClick={() => router.push("/")} className="btn-bouncy"
          style={{ cursor: "pointer", border: `1px solid ${HDR_LINE}`,
            background: HDR_FILL, color: HDR_TX, borderRadius: 11,
            padding: "8px 13px", fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 13 }}>
          ← Sign
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ ["--ink" as string]: HDR_TX, ["--surface" as string]: "#2c4a66",
            ["--accent" as string]: HDR_ROOF, display: "inline-flex" } as React.CSSProperties}>
            <SchoolhouseLogo size={42} />
          </span>
          <div>
            <div style={{ ...eyebrow, color: HDR_SOFT }}>Echols Academy</div>
            <div style={{ fontFamily: "var(--font-scripture)", fontWeight: 600,
              fontSize: isMobile ? 32 : 30, lineHeight: 1, color: HDR_TX, marginTop: 2 }}>
              Homeroom
            </div>
            <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: HDR_SOFT, marginTop: 3 }}>
              Good morning, Briana
            </div>
          </div>
        </div>
        <div style={{ marginLeft: isMobile ? 0 : "auto", width: isMobile ? "100%" : "auto",
          display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10 }}>
          {/* Live clock, big, always visible */}
          <div style={{ textAlign: isMobile ? "left" : "right", width: isMobile ? "100%" : "auto",
            marginRight: isMobile ? 0 : 8 }}>
            <div style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: isMobile ? 34 : 28,
              lineHeight: 1, color: HDR_TX, fontVariantNumeric: "tabular-nums" }}>{timeStr}</div>
            <div style={{ fontFamily: "var(--font-body)", fontSize: 11, color: HDR_SOFT, marginTop: 4 }}>{dateStr}</div>
          </div>
          {[
            { value: `${online}/4`, label: "Online now" },
            { value: working, label: "Working" },
            { value: helpCount, label: "Need help" },
          ].map(s => (
            <div key={s.label} style={{ background: HDR_FILL,
              border: `1px solid ${HDR_LINE}`, borderRadius: 12,
              padding: "7px 14px", textAlign: "center", minWidth: 78, flex: isMobile ? 1 : "0 0 auto" }}>
              <div style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: 19,
                lineHeight: 1, color: HDR_TX }}>{s.value}</div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 10.5, color: HDR_SOFT,
                marginTop: 3, whiteSpace: "nowrap" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Help banner ─────────────────────────────────────────── */}
      {helpCount > 0 && (
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 24px",
          background: mix("var(--danger)", 15, "var(--surface)"),
          borderBottom: `1px solid ${mix("var(--danger)", 34)}`, flexShrink: 0 }}>
          <span style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 13,
            color: "var(--danger-ink)", whiteSpace: "nowrap" }}>
            🙋 {helpCount} {helpCount === 1 ? "child needs" : "children need"} help
          </span>
          <span style={{ fontFamily: "var(--font-body)", fontSize: 12.5, color: "var(--danger-ink)" }}>
           , {lanes.filter(l => l.live && l.live.status === "help").map(l => l.meta.name).join(", ")}.
            Their lane is highlighted.
          </span>
        </div>
      )}

      {/* ── Offline hint ────────────────────────────────────────── */}
      {online === 0 && helpCount === 0 && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 24px",
          background: "var(--surface-sunken)", borderBottom: "1px solid var(--border)", flexShrink: 0 }}>
          <span style={{ fontFamily: "var(--font-body)", fontSize: 12.5, color: "var(--text-soft)" }}>
            Waiting for the kids&rsquo; iPads. A lane goes live the moment a child opens Schoolhouse.
          </span>
        </div>
      )}

      {/* ── Lanes ────────────────────────────────────────────────── */}
      <div style={{ flex: isMobile ? "none" : 1, minHeight: 0,
        padding: isMobile ? "14px 16px" : "16px 24px",
        display: "grid", gridTemplateColumns: `repeat(${cols},1fr)`,
        gap: 14, overflow: isMobile ? "visible" : "hidden" }}>
        {lanes.map(lane => (
          <div key={lane.meta.id} style={{ minHeight: 0, overflowY: isMobile ? "visible" : "auto" }}>
            <KidLane lane={lane} onSummon={summon} onLearn={sendToLearn} onResolve={resolve} onOpen={openHub} />
          </div>
        ))}
      </div>

      {/* ── Broadcast bar ─────────────────────────────────────────── */}
      <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap",
        gap: isMobile ? 8 : 12, padding: isMobile ? "10px 16px" : "12px 24px",
        background: "var(--surface)", borderTop: "1px solid var(--border)", flexShrink: 0,
        position: "sticky", bottom: 0, zIndex: 40, boxShadow: isMobile ? "var(--sh-md)" : "none" }}>
        <button onClick={startMorning} className="btn-bouncy"
          style={{ cursor: "pointer", border: "none", borderRadius: 13, padding: "12px 20px",
            fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 14,
            color: "var(--text-on-accent)", background: "var(--accent)",
            width: isMobile ? "100%" : "auto", boxShadow: "var(--sh-sm)", whiteSpace: "nowrap" }}>
          ☀️ Start Morning Block
        </button>
        <div style={{ width: 1, height: 28, background: "var(--border)", display: isMobile ? "none" : "block" }} />
        <span style={{ fontFamily: "var(--font-body)", fontWeight: 500, fontSize: 12,
          color: "var(--text-muted)" }}>Send to all:</span>
        {[
          ["📖 Memory verse", "Family memory verse, everyone to the table", "📖"],
          ["🍎 Snack time",   "Snack time! Pencils down", "🍎"],
          ["🧹 Tidy up",      "Tidy-up time, five minute warning", "🧹"],
        ].map(([lbl, msg, emoji]) => (
          <button key={lbl} onClick={() => broadcast(msg, emoji)} className="btn-bouncy"
            style={{ cursor: "pointer", border: "1px solid var(--border)",
              background: "var(--surface-sunken)", borderRadius: 11, padding: "9px 14px",
              fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 13,
              color: "var(--text-soft)", whiteSpace: "nowrap" }}>
            {lbl}
          </button>
        ))}
        <div style={{ marginLeft: "auto" }}>
          <button onClick={() => router.push("/parent")} className="btn-bouncy"
            style={{ cursor: "pointer", border: "1px solid var(--border)",
              background: "var(--surface-sunken)", borderRadius: 11, padding: "9px 14px",
              fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 13,
              color: "var(--text-soft)" }}>
            🪙 Coin Dashboard
          </button>
        </div>
      </div>

      {/* Toast */}
      {toast && <Toast msg={toast} onDone={() => setToast("")} />}
    </div>
  );
}
