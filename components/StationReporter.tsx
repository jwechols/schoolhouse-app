"use client";

// ── StationReporter ─────────────────────────────────────────────────────────────
// Mounted once in the root layout. On any kid's page it (a) publishes that kid's
// live state to the Teacher Station channel, (b) shows a "raise hand" button, and
// (c) listens for commands from the board (launch a lesson, snack-time broadcast,
// lower a raised hand). On non-kid pages it renders nothing and holds no channel.

import { useEffect, useRef, useState, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getProgress } from "@/lib/progress";
import { kidMetaFor, type StationKidMeta } from "@/lib/station-meta";
import {
  joinAsKid, type KidChannel, type KidPresence, type KidStatus,
  type StationCommand, type MasteryChip,
} from "@/lib/station";

// Which path segments mean the kid is actively doing schoolwork (vs browsing).
const WORKING_SEGMENTS = new Set([
  "lesson", "learn", "play", "drill", "test", "facts", "typing",
  "assess", "practice", "track", "prep", "scout", "catechism",
]);

// Resolve which kid (if any) this path belongs to.
function kidFromPath(path: string): string | null {
  if (path === "/hub" || path.startsWith("/kids/truma")) return "truma";
  const m = path.match(/^\/kids\/(titus|mercy|lois)(\/|$)/);
  return m ? m[1] : null;
}

// Derive status + a friendly activity label from the path.
function readPath(path: string): { status: KidStatus; activity: string } {
  const segs = path.split("/").filter(Boolean); // e.g. ["kids","titus","learn","math"]
  const working = segs.find(s => WORKING_SEGMENTS.has(s));
  if (!working) return { status: "ready", activity: "At the hub" };
  const detail = segs[segs.length - 1];
  const label =
    working === "learn"  ? `Learning: ${detail}` :
    working === "play"   ? `Playing: ${detail}` :
    working === "track"  ? `Practicing: ${detail}` :
    working === "prep"   ? "MCA test prep" :
    working === "test"   ? "Taking a test" :
    working === "drill"  ? "Drilling facts" :
    working === "typing" ? "Typing practice" :
    working === "scout"  ? "With the tutor" :
    working === "catechism" ? "Catechism" :
    "In a lesson";
  return { status: "working", activity: label };
}

function buildMastery(kidId: string, meta: StationKidMeta): MasteryChip[] {
  const p = getProgress(kidId);
  return meta.subjects.map(s => {
    const n = p.completedSubjects?.[s.id] ?? 0;
    return { ...s, pct: Math.max(0, Math.min(100, Math.round((n / 8) * 100))) };
  });
}

export default function StationReporter() {
  const pathname = usePathname() || "/";
  const router = useRouter();
  const kidId = kidFromPath(pathname);
  // On a lesson page the raise-hand pill would sit on top of the lesson's own
  // bottom controls (the AI-conductor's answer input), so we hide the pill there.
  // Presence still publishes to the Teacher Station; only the button is hidden,
  // and the child already has an in-lesson help path (the tutor mic).
  const onLessonPage = /(^|\/)lesson(\/|$)/.test(pathname);

  const [helpRaised, setHelpRaised] = useState(false);
  const [minutes, setMinutes] = useState(0);
  const [overlay, setOverlay] = useState<{ message: string; emoji: string } | null>(null);

  const chanRef = useRef<KidChannel | null>(null);
  const commandRef = useRef<(cmd: StationCommand) => void>(() => {});
  const workingSince = useRef<number | null>(null);

  const { status: pathStatus, activity } = kidId ? readPath(pathname) : { status: "ready" as KidStatus, activity: "" };
  const effStatus: KidStatus = helpRaised ? "help" : pathStatus;

  // Build the current presence snapshot for this device.
  const snapshot = useCallback((): KidPresence => {
    const meta = kidMetaFor(kidId!);
    const p = getProgress(kidId!);
    return {
      kidId: kidId!, name: meta.name, avatar: meta.avatar,
      status: effStatus, activity, minutes,
      level: p.level || 1, streak: p.streak || 0,
      mastery: buildMastery(kidId!, meta),
      onlineAt: Date.now(),
    };
  }, [kidId, effStatus, activity, minutes]);

  // Command dispatcher, kept in a ref so the once-created channel sees fresh state.
  commandRef.current = (cmd: StationCommand) => {
    if (cmd.type === "launch") {
      setHelpRaised(false);
      router.push(cmd.path);
    } else if (cmd.type === "broadcast") {
      setOverlay({ message: cmd.message, emoji: cmd.emoji });
    } else if (cmd.type === "clearHelp") {
      setHelpRaised(false);
      chanRef.current?.raiseHand(false);
    }
  };

  // Toggle the raised hand, broadcast it so the board hears instantly. Also
  // pings Telegram on raise only, so whoever's set up to get it hears about it
  // even if Homeroom isn't open on their phone right then.
  function toggleHand() {
    setHelpRaised((prev) => {
      const next = !prev;
      chanRef.current?.raiseHand(next);
      if (next && kidId) {
        const meta = kidMetaFor(kidId);
        fetch("/api/notify-help", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ kidName: meta.name, activity }),
        }).catch(() => {});
      }
      return next;
    });
  }

  // Join / leave the channel as the kid changes.
  useEffect(() => {
    if (!kidId) return;
    const chan = joinAsKid(snapshot(), (cmd) => commandRef.current(cmd));
    chanRef.current = chan;
    return () => { chan.destroy(); chanRef.current = null; };
    // Only re-join when the kid identity changes, not on every state tick.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kidId]);

  // Proactively go offline the moment the app is backgrounded or closed,
  // instead of waiting for Supabase to notice the socket dropped (which can
  // lag a long time, or never really happen cleanly on a tablet). Re-track on
  // return so a quick app-switch doesn't leave them stuck offline.
  useEffect(() => {
    if (!kidId) return;
    const handleVisibility = () => {
      chanRef.current?.setVisible(document.visibilityState === "visible");
    };
    const handlePageHide = () => {
      chanRef.current?.setVisible(false);
    };
    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("pagehide", handlePageHide);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("pagehide", handlePageHide);
    };
  }, [kidId]);

  // Track minutes on task while working.
  useEffect(() => {
    if (!kidId || pathStatus !== "working") {
      workingSince.current = null;
      setMinutes(0);
      return;
    }
    workingSince.current = Date.now();
    setMinutes(0);
    const t = setInterval(() => {
      if (workingSince.current) {
        setMinutes(Math.floor((Date.now() - workingSince.current) / 60000));
      }
    }, 30000);
    return () => clearInterval(t);
  }, [kidId, pathStatus, pathname]);

  // Push presence updates whenever the snapshot meaningfully changes.
  useEffect(() => {
    if (kidId && chanRef.current) chanRef.current.update(snapshot());
  }, [kidId, effStatus, activity, minutes, snapshot]);

  // Auto-close a broadcast overlay after 10s (kids may not tap it away).
  useEffect(() => {
    if (!overlay) return;
    const t = setTimeout(() => setOverlay(null), 10000);
    return () => clearTimeout(t);
  }, [overlay]);

  if (!kidId) return null;

  // Wrap in the kid's theme class so --accent (and friends) resolve to their color,
  // matching the Schoolhouse Design System. Custom properties inherit into the
  // fixed-position children below.
  return (
    <div className={`theme-${kidId}`}>
      {/* Raise-hand button, bottom-left so it never covers the tutor (bottom-right).
          Hidden on lesson pages so it never overlaps the lesson's own controls. */}
      {!onLessonPage && (
        <button
          onClick={toggleHand}
          aria-label={helpRaised ? "Lower your hand" : "Raise your hand for help"}
          style={{
            position: "fixed", left: 16, bottom: 16, zIndex: 900,
            border: "none", cursor: "pointer", borderRadius: 99,
            padding: "12px 18px", fontFamily: "var(--font-body)", fontWeight: 700,
            fontSize: 15, color: "var(--text-on-accent)",
            background: helpRaised ? "var(--danger)" : "var(--accent)",
            boxShadow: "var(--sh-lg)",
            animation: helpRaised ? "pulseGlow 1.4s ease infinite" : "none",
          }}
        >
          {helpRaised ? "✋ Hand is up, tap to lower" : "🙋 I need help"}
        </button>
      )}

      {/* Broadcast overlay from the board (snack time, memory verse, tidy up) */}
      {overlay && (
        <div
          onClick={() => setOverlay(null)}
          style={{
            position: "fixed", inset: 0, zIndex: 1000, cursor: "pointer",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            gap: 18, background: `color-mix(in srgb, var(--accent-tint) 96%, var(--surface))`,
            backdropFilter: "blur(3px)", animation: "bounceIn .35s var(--ease)",
          }}
        >
          <div style={{ fontSize: 96, lineHeight: 1 }}>{overlay.emoji}</div>
          <div style={{ fontFamily: "var(--font-heading)", fontSize: 44, textTransform: "uppercase",
            letterSpacing: "0.02em", color: "var(--ink)", textAlign: "center", padding: "0 24px" }}>
            {overlay.message}
          </div>
          <div style={{ fontFamily: "var(--font-body)", fontSize: 15, color: "var(--text-muted)" }}>
            tap anywhere to close
          </div>
        </div>
      )}
    </div>
  );
}
