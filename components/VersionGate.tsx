"use client";

import { useEffect } from "react";
import { APP_VERSION } from "@/lib/version";

/**
 * Prevents stale versions of the app from lingering in a browser or an
 * installed PWA. On load and whenever the tab regains focus, it fetches the
 * live version.json (never cached) and compares it to the version baked into
 * this running bundle. If a newer build is live, it reloads once to pick it up.
 *
 * A sessionStorage guard makes a reload loop impossible: if we already reloaded
 * for a given version and somehow still see a mismatch, we stop rather than
 * bounce. Any fetch error is swallowed so a lesson is never interrupted offline.
 */
export default function VersionGate() {
  useEffect(() => {
    let stopped = false;

    async function check() {
      if (stopped) return;
      try {
        const res = await fetch(`/version.json?t=${Date.now()}`, { cache: "no-store" });
        if (!res.ok) return;
        const { version } = await res.json();
        if (!version) return;

        // We are already current. Clear the anti-loop guard so this tab stays
        // armed for the NEXT deploy, even if it lives for hours across many
        // builds (JM keeps one iPad tab open all day while testing).
        if (version === APP_VERSION) {
          sessionStorage.removeItem("sh_reloaded_for");
          return;
        }

        // A newer build is live and this tab is running an old one.
        if (sessionStorage.getItem("sh_reloaded_for") === version) return; // already tried
        sessionStorage.setItem("sh_reloaded_for", version);
        window.location.reload();
      } catch {
        // Offline or blocked, ignore. Never disrupt a kid mid-lesson.
      }
    }

    check();
    const onFocus = () => check();
    // iOS Safari restores a backgrounded tab from the back-forward cache and
    // fires `pageshow` with persisted=true WITHOUT firing focus/visibility in
    // some versions. That restore is the #1 way a stale build lingers on the
    // iPad, so check on every pageshow too, not just persisted ones.
    const onPageShow = () => check();
    window.addEventListener("focus", onFocus);
    window.addEventListener("pageshow", onPageShow);
    document.addEventListener("visibilitychange", onFocus);
    return () => {
      stopped = true;
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("pageshow", onPageShow);
      document.removeEventListener("visibilitychange", onFocus);
    };
  }, []);

  return null;
}
