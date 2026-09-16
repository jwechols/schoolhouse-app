"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

/**
 * MoneyView — a kid's stewardship money screen.
 *
 * Reads the LIVE family coin ledger from Homeward (the single source of truth) via
 * the /api/homeward-coins proxy, so the numbers here match exactly what shows on the
 * Homeward iPad-mini dashboard. Schoolhouse only displays; Homeward owns the money.
 *
 * Shows coins earned this week and how they split GIVE / TAX / SAVE / SPEND off the
 * top (give 10%, tax 5%, save 10%, spend = the rest), plus what's saved so far, the
 * Future Fund, and progress toward a savings goal.
 *
 * Skinned on the Schoolhouse / Homeward family design system: parchment surface,
 * EB Garamond display serif, IBM Plex Sans labels, IBM Plex Mono for money, paper
 * cards with hairline borders. Kid-focused, but unmistakably part of the app.
 */

interface Props {
  kidId: string;
  name: string;
  color: string;
  accent?: string;
  uiSize?: "normal" | "large" | "xlarge";
  kiosk?: boolean;
}

interface KidCoins {
  weekEarnedCoins: number;
  buckets: { give: number; save: number; spend: number };
  futureFund: number;
  save: number;
  goal: { name: string; targetDollars: number; parentApproved: boolean } | null;
  goalPct: number | null;
  projectedPayday: { give: number; save: number; tax: number; spend: number; total: number };
}

const money = (n: number) => `$${(Number(n) || 0).toFixed(2)}`;
const SERIF = "var(--font-display)";
const UI = "var(--font-ui)";
const MONO = "var(--font-mono)";
const tint = (hex: string, pct: number) => `color-mix(in srgb, ${hex} ${pct}%, var(--surface))`;

export default function MoneyView({ kidId, name, color, accent, uiSize = "normal", kiosk = false }: Props) {
  const router = useRouter();
  const isXLarge = uiSize === "xlarge";
  const isLarge = uiSize === "large" || isXLarge;
  const accentColor = accent ?? color;

  const [data, setData] = useState<KidCoins | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [coinValue, setCoinValue] = useState(0.25);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch(`/api/homeward-coins?kid=${encodeURIComponent(kidId)}`, { cache: "no-store" });
        const json = await res.json();
        if (!alive) return;
        const kid = json?.kids?.[0];
        if (!json?.ok || !kid) {
          setStatus("error");
          return;
        }
        setCoinValue(typeof json.coinValueDollars === "number" ? json.coinValueDollars : 0.25);
        setData(kid as KidCoins);
        setStatus("ready");
      } catch {
        if (alive) setStatus("error");
      }
    })();
    return () => { alive = false; };
  }, [kidId]);

  // Type scale, tuned per UI size (kiosk kids get bigger).
  const titleSize = isXLarge ? "2.6rem" : isLarge ? "2.2rem" : "1.9rem";
  const coinSize = isXLarge ? "4rem" : isLarge ? "3.4rem" : "3rem";
  const jarLabel = isLarge ? "1.1rem" : "1rem";
  const jarAmount = isLarge ? "1.35rem" : "1.2rem";

  const pp = data?.projectedPayday;
  // Semantic jar colors, all drawn from the app palette (rose / gold / sky / green).
  const jars = pp
    ? [
        { key: "give", emoji: "💝", label: "Give", amount: pp.give, to: "Colonial Bible Church", base: "#c13b6f" },
        { key: "tax", emoji: "🏛️", label: "Tax", amount: pp.tax, to: "Family Fund · we vote on it", base: "#b8862b" },
        { key: "save", emoji: "🏦", label: "Save", amount: pp.save, to: "your savings", base: "#3f6d93" },
        { key: "spend", emoji: "🎮", label: "Spend", amount: pp.spend, to: "yours — TV or keep it", base: "#3f8a5b" },
      ]
    : [];

  return (
    <main
      className="min-h-screen px-5 py-9 flex flex-col items-center"
      style={{ background: "var(--surface-page)", color: "var(--text)" }}
    >
      <div className="w-full max-w-md">
        {/* Header */}
        <header className="text-center mb-6">
          <p
            className="uppercase mb-1"
            style={{ fontFamily: UI, fontSize: "0.72rem", letterSpacing: "0.14em", color: "var(--text-muted)", fontWeight: 600 }}
          >
            My Stewardship
          </p>
          <h1 style={{ fontFamily: SERIF, fontSize: titleSize, lineHeight: 1.05, color: "var(--text)", fontWeight: 600 }}>
            {name}&apos;s Money
          </h1>
        </header>

        {status === "loading" && (
          <p className="text-center mt-8" style={{ fontFamily: UI, color: "var(--text-faint)" }}>
            Loading your coins…
          </p>
        )}

        {status === "error" && (
          <div
            className="mt-4 px-5 py-4 text-center"
            style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 20, color: "var(--text-soft)", fontFamily: UI, boxShadow: "var(--sh-sm)" }}
          >
            Can&apos;t reach the coin bank right now. Your coins are safe in Homeward, check back in a bit.
          </div>
        )}

        {status === "ready" && data && (
          <>
            {/* This week's coins — hero card */}
            <section
              className="text-center px-6 py-6"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderTop: `4px solid ${color}`,
                borderRadius: 28,
                boxShadow: "var(--sh-md)",
              }}
            >
              <p className="uppercase" style={{ fontFamily: UI, fontSize: "0.72rem", letterSpacing: "0.12em", color: "var(--text-muted)", fontWeight: 600 }}>
                Coins earned this week
              </p>
              <p className="leading-none my-1" style={{ fontFamily: SERIF, fontSize: coinSize, color: color, fontWeight: 700 }}>
                {data.weekEarnedCoins} <span style={{ fontSize: "0.5em", verticalAlign: "middle" }}>🪙</span>
              </p>
              <p style={{ fontFamily: MONO, fontSize: "0.9rem", color: "var(--text-muted)" }}>
                ≈ {money(data.projectedPayday.total)} this Friday · {money(coinValue)} a coin
              </p>
            </section>

            {/* Split explainer */}
            <p className="text-center mt-6 mb-3 px-2" style={{ fontFamily: UI, fontSize: "0.92rem", color: "var(--text-soft)" }}>
              Give, tax, and save come off the top first. What&apos;s left is yours to spend.
            </p>

            {/* Jars: this week's split */}
            <div className="space-y-3">
              {jars.map((j) => (
                <div
                  key={j.key}
                  className="flex items-center gap-4 px-4 py-3"
                  style={{
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderLeft: `4px solid ${j.base}`,
                    borderRadius: 18,
                    boxShadow: "var(--sh-sm)",
                  }}
                >
                  <div
                    className="flex items-center justify-center shrink-0"
                    style={{ width: 46, height: 46, borderRadius: 14, background: tint(j.base, 14), fontSize: "1.6rem" }}
                  >
                    {j.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p style={{ fontFamily: SERIF, fontSize: jarLabel, fontWeight: 600, color: j.base }}>{j.label}</p>
                    <p style={{ fontFamily: UI, fontSize: "0.78rem", color: "var(--text-muted)" }}>to {j.to}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p style={{ fontFamily: MONO, fontSize: jarAmount, fontWeight: 600, color: j.base }}>{money(j.amount)}</p>
                    <p className="uppercase" style={{ fontFamily: UI, fontSize: "0.6rem", letterSpacing: "0.08em", color: "var(--text-faint)" }}>this week</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Totals: saved + future fund */}
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="text-center px-4 py-4" style={{ background: tint("#3f6d93", 9), border: "1px solid var(--border)", borderRadius: 18 }}>
                <p className="uppercase" style={{ fontFamily: UI, fontSize: "0.66rem", letterSpacing: "0.1em", color: "var(--sky-ink)", fontWeight: 600 }}>Saved so far</p>
                <p style={{ fontFamily: MONO, fontSize: "1.5rem", fontWeight: 600, color: "var(--sky-ink)" }}>{money(data.buckets.save)}</p>
              </div>
              <div className="text-center px-4 py-4" style={{ background: tint("#7c3aed", 9), border: "1px solid var(--border)", borderRadius: 18 }}>
                <p className="uppercase" style={{ fontFamily: UI, fontSize: "0.66rem", letterSpacing: "0.1em", color: "#6d28d9", fontWeight: 600 }}>Future Fund</p>
                <p style={{ fontFamily: MONO, fontSize: "1.5rem", fontWeight: 600, color: "#6d28d9" }}>{money(data.futureFund)}</p>
              </div>
            </div>

            {/* Goal progress */}
            {data.goal && data.goalPct !== null && (
              <div className="mt-4 px-4 py-4" style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 18, boxShadow: "var(--sh-sm)" }}>
                <div className="flex items-center justify-between mb-2">
                  <p style={{ fontFamily: SERIF, fontSize: "1rem", fontWeight: 600, color: "var(--text)" }}>🎯 {data.goal.name}</p>
                  <p style={{ fontFamily: MONO, fontSize: "0.8rem", fontWeight: 600, color: "var(--text-muted)" }}>
                    {money(data.buckets.save)} / {money(data.goal.targetDollars)}
                  </p>
                </div>
                <div className="h-3 rounded-full overflow-hidden" style={{ background: tint(color, 18) }}>
                  <div className="h-full rounded-full transition-all" style={{ width: `${data.goalPct}%`, background: color }} />
                </div>
              </div>
            )}

            {/* Saver's-bonus nudge */}
            <div className="mt-4 px-4 py-3 text-center" style={{ background: tint("#b8862b", 10), border: "1px dashed var(--notyet)", borderRadius: 18 }}>
              <p style={{ fontFamily: UI, fontSize: "0.88rem", fontWeight: 500, color: "var(--notyet-ink)" }}>
                Coins you keep are worth <span style={{ fontWeight: 700 }}>20% more</span> than spending them on TV. Saving pays!
              </p>
            </div>
          </>
        )}

        {/* Verse */}
        <p className="text-center mt-7 px-4 italic" style={{ fontFamily: SERIF, fontSize: "0.9rem", color: "var(--text-muted)" }}>
          &ldquo;Honor the Lord with your wealth and with the firstfruits of all your produce.&rdquo;
          <span className="not-italic"> Proverbs 3:9</span>
        </p>

        {/* Nav */}
        <div className="flex justify-center mt-6">
          {kiosk ? (
            <button
              onClick={async () => {
                await fetch("/api/auth", { method: "DELETE" });
                window.location.href = "/kiosk";
              }}
              className="px-6 py-3 font-semibold active:scale-95 transition-transform"
              style={{ background: accentColor, color: "var(--accent-contrast)", borderRadius: 16, fontFamily: UI, fontSize: isLarge ? "1.05rem" : "0.95rem" }}
            >
              🔒 Lock
            </button>
          ) : (
            <button
              onClick={() => router.push(kidId === "truma" ? "/kids/truma" : `/kids/${kidId}/hub`)}
              className="px-6 py-3 font-semibold active:scale-95 transition-transform"
              style={{ background: accentColor, color: "var(--accent-contrast)", borderRadius: 16, fontFamily: UI, fontSize: isLarge ? "1.05rem" : "0.95rem" }}
            >
              Back to Hub 🏠
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
