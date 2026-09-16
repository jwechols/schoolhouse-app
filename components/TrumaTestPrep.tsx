"use client";

import { useState, useEffect } from "react";
import { TOPICS, getMasteryBadge, type TopicKey } from "@/lib/singapore-math";
import TimedDrill, { type DrillResults } from "@/components/TimedDrill";
import PracticeTest from "@/components/PracticeTest";
import MathFactsDrill, { MathFactsPanel } from "@/components/MathFactsDrill";
import WordProblemWorkshop from "@/components/WordProblemWorkshop";

// Truma theme, warm coral-rose
const PRIMARY      = "#E8527A";
const PRIMARY_DARK = "#C93460";
const PRIMARY_LIGHT = "#FFF0F4";
const GOLD         = "#C8820E";
const GOLD_LIGHT   = "#F0A830";
const BG_GRADIENT  = "linear-gradient(160deg, #FFF8F5 0%, #FFEEEE 50%, #FFF5F0 100%)";
const BG_CARD      = "#FFFFFF";
const BORDER       = "rgba(232,82,122,0.14)";
const TEXT         = "#2A1010";
const TEXT_MUTED   = "rgba(42,16,16,0.45)";
const TEXT_GOLD    = "#965A00";
const ROSE_LIGHT   = "#FDE8EF";

// MCA test date: July 31, 2026
const TEST_DATE = new Date("2026-07-31T08:00:00");

// ─── Types ─────────────────────────────────────────────────────────────────────

interface TopicMastery {
  sessions: number;
  avg_score: number;
  avg_time: number;
}

interface DrillSession {
  topic: string;
  correct: number;
  total: number;
  avg_time: number;
  completed_at: string;
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

function loadMastery(): Record<string, TopicMastery> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem("truma-topic-mastery");
    return raw ? (JSON.parse(raw) as Record<string, TopicMastery>) : {};
  } catch {
    return {};
  }
}

function loadDrillHistory(): DrillSession[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem("truma-drill-history");
    return raw ? (JSON.parse(raw) as DrillSession[]) : [];
  } catch {
    return [];
  }
}

function computeOverallReadiness(mastery: Record<string, TopicMastery>): number {
  const topicKeys = Object.keys(TOPICS) as TopicKey[];
  if (topicKeys.length === 0) return 0;
  const scores = topicKeys.map((k) => mastery[k]?.avg_score ?? 0);
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
}

function getDaysRemaining(): number {
  const now = new Date();
  const diff = TEST_DATE.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

function getMasteryColor(score: number): string {
  if (score >= 80) return "#22c55e";
  if (score >= 55) return GOLD;
  return PRIMARY;
}

function getMasteryLabel(score: number): "Needs Work" | "Improving" | "Strong" {
  return getMasteryBadge(score);
}

function formatDate(iso: string): string {
  if (!iso) return "Never";
  try {
    return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  } catch {
    return "Never";
  }
}

function getParentAssignment(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const todayKey = `parent-assignments-${new Date().toISOString().slice(0, 10)}`;
    const raw = localStorage.getItem(todayKey);
    if (!raw) return null;
    const all = JSON.parse(raw) as Array<{ kid: string; subject: string; duration: number }>;
    const mine = all.find((a) => a.kid === "truma");
    return mine ? `${mine.subject} (${mine.duration} min)` : null;
  } catch {
    return null;
  }
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function CountdownBanner({ daysLeft, readiness }: { daysLeft: number; readiness: number }) {
  const progressPct = Math.min(100, readiness);
  return (
    <div
      className="rounded-2xl p-4 mb-5"
      style={{ backgroundColor: BG_CARD, border: `1.5px solid ${BORDER}` }}
    >
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="font-black text-sm" style={{ color: PRIMARY }}>
            You&apos;re getting ready ✨
          </p>
          <p className="text-xs mt-0.5" style={{ color: TEXT_MUTED }}>
            MCA Upper School Placement Test · {daysLeft} days away
          </p>
        </div>
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center font-black text-sm"
          style={{ backgroundColor: ROSE_LIGHT, color: PRIMARY }}
        >
          {daysLeft}d
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex-1 rounded-full h-3 overflow-hidden" style={{ backgroundColor: ROSE_LIGHT }}>
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${progressPct}%`, backgroundColor: PRIMARY }}
          />
        </div>
        <span className="font-black text-sm w-12 text-right" style={{ color: PRIMARY }}>
          {progressPct}%
        </span>
      </div>
      <p className="text-xs mt-1" style={{ color: TEXT_MUTED }}>Overall readiness</p>
    </div>
  );
}

function TopicCard({
  topicKey,
  mastery,
  onPractice,
}: {
  topicKey: TopicKey;
  mastery: TopicMastery | undefined;
  onPractice: (topic: TopicKey) => void;
}) {
  const score = mastery?.avg_score ?? 0;
  const label = getMasteryLabel(score);

  const badgeBg =
    label === "Strong"
      ? "rgba(34,197,94,0.12)"
      : label === "Improving"
      ? "rgba(200,130,14,0.12)"
      : ROSE_LIGHT;
  const badgeColor =
    label === "Strong"
      ? "#16a34a"
      : label === "Improving"
      ? GOLD
      : PRIMARY;
  const barColor = getMasteryColor(score);

  return (
    <div
      className="rounded-2xl p-4"
      style={{ backgroundColor: BG_CARD, border: `1.5px solid ${BORDER}` }}
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-black text-sm" style={{ color: TEXT }}>{TOPICS[topicKey].name}</h3>
        <span
          className="text-xs font-bold px-2 py-0.5 rounded-full"
          style={{ backgroundColor: badgeBg, color: badgeColor }}
        >
          {label}
        </span>
      </div>

      <div className="flex items-center gap-2 mb-2">
        <div className="flex-1 rounded-full h-2 overflow-hidden" style={{ backgroundColor: ROSE_LIGHT }}>
          <div
            className="h-full rounded-full"
            style={{ width: `${score}%`, backgroundColor: barColor }}
          />
        </div>
        <span className="text-xs font-bold w-8 text-right" style={{ color: TEXT }}>{score}%</span>
      </div>

      <p className="text-xs mb-3" style={{ color: TEXT_MUTED }}>
        {mastery ? `${mastery.sessions} session${mastery.sessions !== 1 ? "s" : ""}` : "Not started"}
        {mastery && mastery.avg_time > 0 ? ` · avg ${mastery.avg_time}s/q` : ""}
      </p>

      <button
        onClick={() => onPractice(topicKey)}
        className="w-full py-2 rounded-xl font-black text-white text-xs transition-all hover:opacity-90 active:scale-95"
        style={{ backgroundColor: PRIMARY }}
      >
        Practice Now
      </button>
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────

type View = "hub" | "drill" | "test" | "facts" | "wordproblems";

function loadWPScaffoldedCount(): number {
  if (typeof window === "undefined") return 0;
  try {
    return parseInt(localStorage.getItem("truma-wpw-scaffolded") ?? "0", 10) || 0;
  } catch { return 0; }
}

export default function TrumaTestPrep({ onBack }: { onBack?: () => void }) {
  const [view, setView] = useState<View>("hub");
  const [activeTopic, setActiveTopic] = useState<TopicKey | "all">("all");
  const [mastery, setMastery] = useState<Record<string, TopicMastery>>({});
  const [recentDrills, setRecentDrills] = useState<DrillSession[]>([]);
  const [parentAssignment, setParentAssignment] = useState<string | null>(null);
  const [daysLeft, setDaysLeft] = useState(getDaysRemaining());
  const [wpScaffolded, setWpScaffolded] = useState(0);

  useEffect(() => {
    setMastery(loadMastery());
    setRecentDrills(loadDrillHistory().slice(0, 7));
    setParentAssignment(getParentAssignment());
    setDaysLeft(getDaysRemaining());
    setWpScaffolded(loadWPScaffoldedCount());
  }, []);

  function refreshData() {
    setMastery(loadMastery());
    setRecentDrills(loadDrillHistory().slice(0, 7));
  }

  function handleDrillComplete(_results: DrillResults) {
    refreshData();
    setView("hub");
  }

  function startDrill(topic: TopicKey | "all") {
    setActiveTopic(topic);
    setView("drill");
  }

  const topicKeys = Object.keys(TOPICS) as TopicKey[];
  const readiness = computeOverallReadiness(mastery);

  // Weakest 2 topics
  const sortedByScore = [...topicKeys].sort(
    (a, b) => (mastery[a]?.avg_score ?? 0) - (mastery[b]?.avg_score ?? 0)
  );
  const weakTopics = sortedByScore.slice(0, 2);

  if (view === "drill") {
    return (
      <TimedDrill
        topic={activeTopic}
        questionCount={10}
        perQuestionSeconds={60}
        testMode={false}
        onComplete={handleDrillComplete}
        onBack={() => setView("hub")}
      />
    );
  }

  if (view === "test") {
    return <PracticeTest onBack={() => { refreshData(); setView("hub"); }} />;
  }

  if (view === "facts") {
    return (
      <MathFactsDrill
        kidId="truma"
        colorHex={PRIMARY}
        onComplete={() => { /* result saved inside component */ }}
        onBack={() => setView("hub")}
      />
    );
  }

  if (view === "wordproblems") {
    return (
      <WordProblemWorkshop
        onBack={() => {
          setWpScaffolded(loadWPScaffoldedCount());
          setView("hub");
        }}
      />
    );
  }

  return (
    <div
      className="min-h-screen px-4 py-6 max-w-lg md:max-w-2xl mx-auto"
      style={{ background: BG_GRADIENT }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider" style={{ color: PRIMARY }}>
            MCA Test Prep
          </p>
          <h1 className="font-black text-2xl" style={{ color: TEXT }}>
            Truma&apos;s Prep Hub
          </h1>
        </div>
        {onBack && (
          <button
            onClick={onBack}
            className="text-sm font-bold transition-colors hover:opacity-70"
            style={{ color: PRIMARY }}
          >
            ← Back
          </button>
        )}
      </div>

      {/* Parent assignment banner */}
      {parentAssignment && (
        <div
          className="rounded-2xl p-4 mb-4 flex items-center gap-3"
          style={{ backgroundColor: ROSE_LIGHT, border: `1.5px solid ${BORDER}` }}
        >
          <span className="text-2xl">💼</span>
          <div className="flex-1">
            <p className="font-black text-sm" style={{ color: TEXT }}>Mom set up your work for today!</p>
            <p className="text-xs" style={{ color: TEXT_MUTED }}>{parentAssignment}</p>
          </div>
          <button
            onClick={() => startDrill("all")}
            className="px-3 py-1.5 rounded-xl font-black text-xs text-white"
            style={{ backgroundColor: PRIMARY }}
          >
            Start →
          </button>
        </div>
      )}

      {/* Countdown banner */}
      <CountdownBanner daysLeft={daysLeft} readiness={readiness} />

      {/* Word Problem Workshop */}
      <button
        onClick={() => setView("wordproblems")}
        className="w-full rounded-2xl p-5 mb-5 flex items-center gap-4 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm"
        style={{
          backgroundColor: BG_CARD,
          border: `1.5px solid ${wpScaffolded < 5 ? PRIMARY : BORDER}`,
          borderLeft: wpScaffolded < 5 ? `4px solid ${PRIMARY}` : `1.5px solid ${BORDER}`,
        }}
      >
        <div className="text-4xl">📐</div>
        <div className="text-left flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-black text-lg" style={{ color: TEXT }}>
              Word Problem Workshop
            </p>
            {wpScaffolded < 5 && (
              <span
                className="text-xs font-black px-2 py-0.5 rounded-full"
                style={{ backgroundColor: PRIMARY, color: "#fff" }}
              >
                Start Here
              </span>
            )}
            {wpScaffolded >= 5 && (
              <span
                className="text-xs font-black px-2 py-0.5 rounded-full"
                style={{ backgroundColor: "rgba(34,197,94,0.12)", color: "#16a34a" }}
              >
                Timed Unlocked ✓
              </span>
            )}
          </div>
          <p className="text-sm" style={{ color: TEXT_MUTED }}>
            {wpScaffolded < 5
              ? `Learn bar model strategy · ${5 - wpScaffolded} guided problems to go`
              : "Strategy + timed challenge · word problems"}
          </p>
        </div>
        <div className="text-2xl" style={{ color: PRIMARY + "80" }}>→</div>
      </button>

      {/* Timed Practice */}
      <button
        onClick={() => setView("test")}
        className="w-full rounded-2xl p-5 mb-5 flex items-center gap-4 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm"
        style={{
          backgroundColor: BG_CARD,
          borderLeft: `4px solid ${PRIMARY}`,
          border: `1.5px solid ${BORDER}`,
        }}
      >
        <div className="text-4xl">📝</div>
        <div className="text-left">
          <p className="font-black text-lg" style={{ color: PRIMARY }}>Timed Practice</p>
          <p className="text-xs" style={{ color: TEXT_MUTED }}>30 questions · 45 minutes · No hints</p>
        </div>
        <div className="ml-auto text-2xl" style={{ color: PRIMARY + "80" }}>→</div>
      </button>

      {/* Today's focus */}
      <div
        className="rounded-2xl p-4 mb-5"
        style={{ backgroundColor: BG_CARD, border: `1.5px solid ${BORDER}` }}
      >
        <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: PRIMARY }}>
          Today&apos;s Focus
        </p>
        <p className="font-black text-base mb-1" style={{ color: TEXT }}>
          {weakTopics.map((t) => TOPICS[t].name).join(" & ")}
        </p>
        {parentAssignment && (
          <p className="text-xs" style={{ color: TEXT_GOLD }}>
            Briana recommends: {parentAssignment}
          </p>
        )}
        <div className="flex gap-2 mt-3">
          {weakTopics.map((t) => (
            <button
              key={t}
              onClick={() => startDrill(t)}
              className="flex-1 py-2 rounded-xl font-black text-xs border transition-all hover:text-white"
              style={{
                backgroundColor: BG_CARD,
                border: `1.5px solid ${PRIMARY}`,
                color: PRIMARY,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = PRIMARY;
                (e.currentTarget as HTMLButtonElement).style.color = "#fff";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = BG_CARD;
                (e.currentTarget as HTMLButtonElement).style.color = PRIMARY;
              }}
            >
              Drill: {TOPICS[t].name}
            </button>
          ))}
        </div>
      </div>

      {/* Math Facts Speed Drills */}
      <div className="mb-5">
        <MathFactsPanel
          colorHex={PRIMARY}
          onLaunch={(_mode) => {
            setView("facts");
          }}
        />
      </div>

      {/* Topic mastery grid */}
      <h2 className="font-bold text-xs uppercase tracking-wider mb-3" style={{ color: PRIMARY }}>
        Topic Mastery
      </h2>
      <div className="grid grid-cols-2 gap-3 mb-5">
        {topicKeys.map((tk) => (
          <TopicCard
            key={tk}
            topicKey={tk}
            mastery={mastery[tk]}
            onPractice={startDrill}
          />
        ))}
      </div>

      {/* Quick drill all */}
      <button
        onClick={() => startDrill("all")}
        className="w-full py-4 rounded-2xl font-black text-white text-base mb-5 shadow-sm hover:opacity-90 active:scale-[0.98] transition-all"
        style={{ backgroundColor: PRIMARY }}
      >
        Mixed Drill, All Topics
      </button>

      {/* Performance history */}
      {recentDrills.length > 0 && (
        <>
          <h2 className="font-bold text-xs uppercase tracking-wider mb-3" style={{ color: PRIMARY }}>
            Recent Practice (Last 7)
          </h2>
          <div className="flex flex-col gap-2 mb-4">
            {recentDrills.map((d, i) => {
              const pct = d.total > 0 ? Math.round((d.correct / d.total) * 100) : 0;
              return (
                <div
                  key={i}
                  className="rounded-xl p-3 flex items-center gap-3"
                  style={{ backgroundColor: BG_CARD, border: `1px solid ${BORDER}` }}
                >
                  <div className="text-lg">
                    {pct >= 80 ? "🔥" : pct >= 60 ? "📈" : "📚"}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold capitalize" style={{ color: TEXT }}>{d.topic}</p>
                    <p className="text-xs" style={{ color: TEXT_MUTED }}>
                      {d.correct}/{d.total} correct · avg {d.avg_time}s/q
                    </p>
                  </div>
                  <div>
                    <p
                      className="font-black text-sm"
                      style={{ color: getMasteryColor(pct) }}
                    >
                      {pct}%
                    </p>
                    <p className="text-xs" style={{ color: TEXT_MUTED }}>{formatDate(d.completed_at)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
