"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { TrumaSession } from "@/lib/supabase";
import { loadStats, type KidStats } from "@/lib/family-data";
import { KIDS, KIDS_ORDER } from "@/lib/kids";

// ─── Subject options per kid ──────────────────────────────────────────────────
const KID_SUBJECTS: Record<string, Array<{ id: string; label: string; emoji: string }>> = {
  titus: [
    { id: "math",    label: "Math",    emoji: "✖️" },
    { id: "grammar", label: "Grammar", emoji: "📝" },
    { id: "science", label: "Science", emoji: "🔬" },
    { id: "history", label: "History", emoji: "🏛️" },
    { id: "bible",   label: "Bible",   emoji: "✝️" },
  ],
  mercy: [
    { id: "counting", label: "Counting", emoji: "🔢" },
    { id: "phonics",  label: "Phonics",  emoji: "🔤" },
    { id: "bible",    label: "Bible",    emoji: "📖" },
  ],
  lois: [
    { id: "abc",     label: "ABC's",   emoji: "🔤" },
    { id: "numbers", label: "Numbers", emoji: "🔢" },
    { id: "colors",  label: "Colors",  emoji: "🎨" },
    { id: "shapes",  label: "Shapes",  emoji: "⭐" },
  ],
  truma: [
    { id: "Singapore Math - Timed Drill", label: "MCA Test Prep, Timed Drill", emoji: "🎯" },
    { id: "Singapore Math - Practice Test", label: "MCA Test Prep, Practice Test", emoji: "📝" },
    { id: "math",    label: "Math",       emoji: "➗" },
    { id: "grammar", label: "Grammar",    emoji: "📝" },
    { id: "science", label: "Science",    emoji: "🔬" },
    { id: "history", label: "History",    emoji: "🏛️" },
    { id: "bible",   label: "Bible",      emoji: "✝️" },
    { id: "vocab",   label: "Vocabulary", emoji: "📚" },
  ],
};

interface Props {
  sessions: TrumaSession[];
}

function BarChart({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-sm font-bold w-10 text-right" style={{ color }}>
        {value}%
      </span>
    </div>
  );
}

function timeAgo(dateStr: string): string {
  if (!dateStr) return "Never";
  const date = new Date(dateStr);
  const now = Date.now();
  const diff = now - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 2) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

// All four learners in lesson-start order (Truma uses /lesson, kids use /kids/[kid]/lesson)
const ALL_LEARNER_IDS = ["titus", "mercy", "lois", "truma"];

const ALL_LEARNER_NAMES: Record<string, { name: string; emoji: string; colorHex: string }> = {
  titus: { name: "Titus",  emoji: "🦁", colorHex: "#2563eb" },
  mercy: { name: "Mercy",  emoji: "🌸", colorHex: "#ec4899" },
  lois:  { name: "Lois",   emoji: "🌈", colorHex: "#f59e0b" },
  truma: { name: "Truma",  emoji: "📖", colorHex: "#1b3a6b" },
};

export default function ParentDashboard({ sessions }: Props) {
  const router = useRouter();

  // ── Lesson launcher state ──────────────────────────────────────────────────
  const [selectedKid, setSelectedKid] = useState("titus");
  const [selectedSubject, setSelectedSubject] = useState("math");
  const [selectedDuration, setSelectedDuration] = useState(30);
  const [lessonNotes, setLessonNotes] = useState("");

  // Keep subject in sync when kid changes
  useEffect(() => {
    const subjects = KID_SUBJECTS[selectedKid] ?? [];
    if (subjects.length > 0) setSelectedSubject(subjects[0].id);
  }, [selectedKid]);

  function handleStartLesson() {
    const params = new URLSearchParams({
      subject: selectedSubject,
      duration: String(selectedDuration),
      notes: lessonNotes,
    });
    if (selectedKid === "truma") {
      router.push(`/lesson?${params}`);
    } else {
      router.push(`/kids/${selectedKid}/lesson?${params}`);
    }
  }

  const [reportText, setReportText] = useState("");
  const [generatingReport, setGeneratingReport] = useState(false);
  const [kidStats, setKidStats] = useState<Record<string, KidStats>>({});

  // Load kid stats from localStorage on client
  useEffect(() => {
    const all: Record<string, KidStats> = {};
    for (const kidId of KIDS_ORDER) {
      all[kidId] = loadStats(kidId);
    }
    setKidStats(all);
  }, []);

  // Coins/payout are no longer tracked here. Homeward is the single family coin
  // ledger and owns payout + the Friday/month-end reminders (see the card below).

  // ── Derived stats ────────────────────────────────────────────────────────────
  const totalSessions = sessions.length;
  const totalXP = sessions.reduce((sum, s) => sum + s.xp_earned, 0);

  const practiceSessionsWithScore = sessions.filter((s) => s.total > 0);
  const avgAccuracy =
    practiceSessionsWithScore.length > 0
      ? Math.round(
          (practiceSessionsWithScore.reduce((sum, s) => sum + s.score / s.total, 0) /
            practiceSessionsWithScore.length) *
            100
        )
      : 0;

  const uniqueSubjects = Array.from(new Set(sessions.map((s) => s.subject)));

  const subjectStats: Record<string, { bestPct: number; count: number; sessions: TrumaSession[] }> = {};
  for (const s of sessions) {
    const pct = s.total > 0 ? Math.round((s.score / s.total) * 100) : 0;
    if (!subjectStats[s.subject]) {
      subjectStats[s.subject] = { bestPct: 0, count: 0, sessions: [] };
    }
    subjectStats[s.subject].count += 1;
    subjectStats[s.subject].sessions.push(s);
    if (pct > subjectStats[s.subject].bestPct) {
      subjectStats[s.subject].bestPct = pct;
    }
  }

  const sortedSessions = [...sessions].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  // ── Generate report ───────────────────────────────────────────────────────────
  async function generateReport() {
    if (generatingReport) return;
    setGeneratingReport(true);
    setReportText("");

    try {
      const response = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessions }),
      });

      if (!response.ok || !response.body) {
        setReportText("Sorry, could not generate the report. Please try again.");
        setGeneratingReport(false);
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        setReportText(accumulated);
      }
    } catch {
      setReportText("Something went wrong. Please try again.");
    } finally {
      setGeneratingReport(false);
    }
  }

  return (
    <div
      className="min-h-screen px-4 py-8 max-w-3xl mx-auto"
      style={{ backgroundColor: "#F5F0E6", color: "#5C3317" }}
    >
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between">
          <div>
            <h1
              className="text-4xl font-bold mb-1"
              style={{ fontFamily: "Georgia, serif", color: "#5C3317" }}
            >
              Parent Dashboard
            </h1>
            <p className="text-sm" style={{ color: "#5C331799" }}>Echols Schoolhouse, all learners</p>
          </div>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => router.push("/teacher")}
              className="px-4 py-2 rounded-2xl font-black text-white text-sm shadow-md hover:opacity-90 active:scale-95 transition-all"
              style={{ backgroundColor: "#4E9A28" }}
            >
              Teacher Dashboard →
            </button>
            <button
              onClick={() => router.push("/parent/curriculum")}
              className="px-4 py-2 rounded-2xl font-black text-white text-sm shadow-md hover:opacity-90 active:scale-95 transition-all"
              style={{ backgroundColor: "#3AAEBC" }}
            >
              ✏️ Edit Lessons →
            </button>
            <button
              onClick={() => router.push("/parent/words")}
              className="px-4 py-2 rounded-2xl font-black text-white text-sm shadow-md hover:opacity-90 active:scale-95 transition-all"
              style={{ backgroundColor: "#8B5CF6" }}
            >
              📝 Words &amp; Drills →
            </button>
            <button
              onClick={() => router.push("/parent/practice-tests")}
              className="px-4 py-2 rounded-2xl font-black text-white text-sm shadow-md hover:opacity-90 active:scale-95 transition-all"
              style={{ backgroundColor: "#DB6A2E" }}
            >
              🧮 Practice Tests →
            </button>
            <button
              onClick={() => router.push("/parent/reading")}
              className="px-4 py-2 rounded-2xl font-black text-white text-sm shadow-md hover:opacity-90 active:scale-95 transition-all"
              style={{ backgroundColor: "#0E7C7B" }}
            >
              📚 Reading →
            </button>
          </div>
        </div>
      </div>

      {/* ── Start a Lesson ────────────────────────────────────────────────────── */}
      <div className="mb-10">
        <h2
          className="text-xl font-bold mb-4"
          style={{ fontFamily: "Georgia, serif", color: "#5C3317" }}
        >
          🎓 Start a Lesson
        </h2>
        <div className="bg-white rounded-2xl p-6 shadow-md border-l-4" style={{ borderLeftColor: "#3AAEBC" }}>

          {/* Kid selector */}
          <div className="mb-5">
            <p className="text-xs font-bold uppercase tracking-wide text-stone mb-2">Learner</p>
            <div className="flex gap-3 flex-wrap">
              {ALL_LEARNER_IDS.map((id) => {
                const info = ALL_LEARNER_NAMES[id];
                const isSelected = selectedKid === id;
                return (
                  <button
                    key={id}
                    onClick={() => setSelectedKid(id)}
                    className="flex items-center gap-2 px-4 py-2 rounded-2xl font-bold text-sm transition-all"
                    style={{
                      backgroundColor: isSelected ? info.colorHex : info.colorHex + "15",
                      color: isSelected ? "white" : info.colorHex,
                      border: `2px solid ${isSelected ? info.colorHex : info.colorHex + "40"}`,
                    }}
                  >
                    <span>{info.emoji}</span>
                    <span>{info.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Subject selector */}
          <div className="mb-5">
            <p className="text-xs font-bold uppercase tracking-wide text-stone mb-2">Subject</p>
            <div className="flex gap-2 flex-wrap">
              {(KID_SUBJECTS[selectedKid] ?? []).map((subj) => {
                const info = ALL_LEARNER_NAMES[selectedKid];
                const isSelected = selectedSubject === subj.id;
                return (
                  <button
                    key={subj.id}
                    onClick={() => setSelectedSubject(subj.id)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-2xl text-sm font-bold transition-all"
                    style={{
                      backgroundColor: isSelected ? info.colorHex : "#f3f4f6",
                      color: isSelected ? "white" : "#374151",
                      border: `2px solid ${isSelected ? info.colorHex : "#e5e7eb"}`,
                    }}
                  >
                    <span>{subj.emoji}</span>
                    <span>{subj.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Duration selector */}
          <div className="mb-5">
            <p className="text-xs font-bold uppercase tracking-wide text-stone mb-2">Duration</p>
            <div className="flex gap-3">
              {[15, 30, 45].map((min) => (
                <button
                  key={min}
                  onClick={() => setSelectedDuration(min)}
                  className="px-5 py-2 rounded-2xl font-bold text-sm transition-all"
                  style={{
                    backgroundColor: selectedDuration === min ? "#4E9A28" : "#f3f4f6",
                    color: selectedDuration === min ? "white" : "#374151",
                    border: `2px solid ${selectedDuration === min ? "#4E9A28" : "#e5e7eb"}`,
                  }}
                >
                  {min}m
                </button>
              ))}
            </div>
          </div>

          {/* Notes for tutor */}
          <div className="mb-6">
            <p className="text-xs font-bold uppercase tracking-wide text-stone mb-2">
              Notes for tutor <span className="font-normal text-stone/60">(optional)</span>
            </p>
            <input
              type="text"
              value={lessonNotes}
              onChange={(e) => setLessonNotes(e.target.value)}
              placeholder="e.g. Focus on multiplication by 4s today"
              className="w-full px-4 py-3 rounded-xl border border-stone/20 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-navy/30 bg-gray-50"
            />
          </div>

          {/* Start button */}
          <button
            onClick={handleStartLesson}
            className="w-full sm:w-auto px-10 py-4 rounded-2xl font-black text-white text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-95 transition-all"
            style={{
              background: `linear-gradient(135deg, ${ALL_LEARNER_NAMES[selectedKid].colorHex}, ${ALL_LEARNER_NAMES[selectedKid].colorHex}cc)`,
            }}
          >
            ▶ Start Lesson for {ALL_LEARNER_NAMES[selectedKid].name}
          </button>
        </div>
      </div>

      {/* ── Kids overview cards ──────────────────────────────────────────────── */}
      <div className="mb-8">
        <h2
          className="text-xl font-bold mb-4"
          style={{ fontFamily: "Georgia, serif", color: "#5C3317" }}
        >
          Learners
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {KIDS_ORDER.map((kidId) => {
            const kid = KIDS[kidId];
            const stats = kidStats[kidId];
            const level = stats ? Math.floor(stats.xp / 100) + 1 : 1;
            const xpInLevel = stats ? stats.xp % 100 : 0;
            const lastActive = stats?.lastPlayDate
              ? timeAgo(stats.lastPlayDate + "T12:00:00")
              : "Never";

            return (
              <div
                key={kidId}
                className="bg-white rounded-2xl p-5 shadow-md"
                style={{ borderTop: `4px solid ${kid.colorHex}` }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="text-3xl">{kid.emoji}</div>
                  <div>
                    <div className="font-black text-navy">{kid.name}</div>
                    <div className="text-xs text-stone">{kid.grade}</div>
                  </div>
                  <div
                    className="ml-auto text-xs font-bold px-2 py-1 rounded-full"
                    style={{ backgroundColor: kid.colorHex + "20", color: kid.colorHex }}
                  >
                    Lv {level}
                  </div>
                </div>

                {/* XP bar */}
                <div className="bg-gray-100 rounded-full h-2 mb-3 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${xpInLevel}%`, backgroundColor: kid.colorHex }}
                  />
                </div>

                <div className="grid grid-cols-3 gap-2 text-center mb-3">
                  <div>
                    <div className="text-lg font-black text-navy">{stats?.stars ?? 0}</div>
                    <div className="text-xs text-stone">⭐ Stars</div>
                  </div>
                  <div>
                    <div className="text-lg font-black text-navy">{stats?.xp ?? 0}</div>
                    <div className="text-xs text-stone">⚡ XP</div>
                  </div>
                  <div>
                    <div className="text-lg font-black text-navy">{stats?.gamesPlayed ?? 0}</div>
                    <div className="text-xs text-stone">🎮 Games</div>
                  </div>
                </div>

                {/* Subject bars */}
                {stats && Object.entries(stats.gameScores).length > 0 && (
                  <div className="space-y-1.5 mb-3">
                    {Object.entries(stats.gameScores)
                      .filter(([, d]) => d.best > 0)
                      .slice(0, 3)
                      .map(([subj, data]) => (
                        <div key={subj}>
                          <div className="text-xs text-stone capitalize mb-0.5">{subj}</div>
                          <BarChart value={data.best} max={100} color={kid.colorHex} />
                        </div>
                      ))}
                  </div>
                )}

                <div className="text-xs text-stone">
                  Last active: <span className="font-bold">{lastActive}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Truma session summary ─────────────────────────────────────────────── */}
      <div className="mb-6">
        <h2
          className="text-xl font-bold mb-4"
          style={{ fontFamily: "Georgia, serif", color: "#5C3317" }}
        >
          Truma, Session Summary
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: "Sessions", value: totalSessions, color: "#1b3a6b" },
            { label: "Total XP", value: totalXP, color: "#c48a1a" },
            { label: "Avg. Accuracy", value: `${avgAccuracy}%`, color: "#2d6a4f" },
            { label: "Subjects", value: uniqueSubjects.length, color: "#1b3a6b" },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-white rounded-xl p-4 text-center shadow-sm">
              <p className="text-2xl font-bold" style={{ color }}>{value}</p>
              <p className="text-xs text-stone mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Subject mastery bars */}
        {uniqueSubjects.length > 0 && (
          <div className="bg-white rounded-xl p-5 shadow-sm mb-4">
            <h3 className="font-bold mb-4 text-sm uppercase tracking-wide" style={{ color: "#5C3317" }}>Subject Mastery</h3>
            <div className="space-y-3">
              {uniqueSubjects.map((subj) => {
                const st = subjectStats[subj];
                return (
                  <div key={subj}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-navy capitalize">{subj}</span>
                      <span className="text-stone text-xs">{st.count} sessions</span>
                    </div>
                    <BarChart value={st.bestPct} max={100} color="#2d6a4f" />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Sessions log */}
      <div className="mb-6">
        <h2
          className="text-xl font-bold mb-3"
          style={{ fontFamily: "Georgia, serif", color: "#5C3317" }}
        >
          Session Log
        </h2>
        {sortedSessions.length === 0 ? (
          <div className="bg-white rounded-xl p-6 text-center">
            <p className="text-stone text-sm">No sessions recorded yet.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl overflow-x-auto shadow-sm">
            <table className="w-full text-sm min-w-[500px]">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-4 py-3 text-xs text-stone uppercase tracking-wide font-semibold">Date</th>
                  <th className="text-left px-4 py-3 text-xs text-stone uppercase tracking-wide font-semibold">Subject</th>
                  <th className="text-left px-4 py-3 text-xs text-stone uppercase tracking-wide font-semibold">Mode</th>
                  <th className="text-right px-4 py-3 text-xs text-stone uppercase tracking-wide font-semibold">Score</th>
                  <th className="text-right px-4 py-3 text-xs text-stone uppercase tracking-wide font-semibold">Accuracy</th>
                  <th className="text-right px-4 py-3 text-xs text-stone uppercase tracking-wide font-semibold">XP</th>
                </tr>
              </thead>
              <tbody>
                {sortedSessions.map((s) => {
                  const accuracy = s.total > 0 ? Math.round((s.score / s.total) * 100) : null;
                  return (
                    <tr key={s.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-stone">{s.session_date}</td>
                      <td className="px-4 py-3 font-medium text-navy capitalize">{s.subject}</td>
                      <td className="px-4 py-3 text-stone capitalize">{s.mode}</td>
                      <td className="px-4 py-3 text-right text-navy">{s.score}/{s.total}</td>
                      <td className="px-4 py-3 text-right font-semibold text-teal">
                        {accuracy !== null ? `${accuracy}%` : ", "}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-gold">+{s.xp_earned}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Generate Report, prominent button */}
      <div className="mb-6">
        <h2
          className="text-xl font-bold mb-3"
          style={{ fontFamily: "Georgia, serif", color: "#5C3317" }}
        >
          AI Learning Report
        </h2>
        <p className="text-stone text-sm mb-4">
          Get a personalized narrative summary of Truma&apos;s recent progress powered by AI.
        </p>
        <button
          onClick={generateReport}
          disabled={generatingReport || sessions.length === 0}
          className="w-full sm:w-auto px-8 py-4 rounded-2xl font-black text-white text-lg shadow-lg hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            background: generatingReport
              ? "#6b7280"
              : "linear-gradient(135deg, #4E9A28, #3A7A18)",
          }}
        >
          {generatingReport ? "✍️ Writing report…" : "✨ Generate AI Report"}
        </button>

        {(reportText || generatingReport) && (
          <div className="mt-4 bg-white rounded-xl p-5 shadow-sm border-l-4" style={{ borderLeftColor: "#3AAEBC" }}>
            {reportText ? (
              <div className="text-sm text-navy leading-relaxed">
                {reportText.split("\n").map((line, i) =>
                  line.trim() === "" ? (
                    <div key={i} className="h-3" />
                  ) : (
                    <p key={i} className="mb-1 last:mb-0">{line}</p>
                  )
                )}
              </div>
            ) : (
              <p className="text-stone text-sm animate-pulse">Writing report…</p>
            )}
          </div>
        )}
      </div>

      {/* ── Coins & Payout now live in Homeward ────────────────────────────── */}
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
        <h2 className="font-black text-lg text-amber-900 mb-1">🪙 Coins &amp; Payout</h2>
        <p className="text-sm text-amber-800 leading-relaxed">
          Coins, giving, saving, and Friday payout now live in <strong>Homeward</strong>, the
          single family ledger. Each kid&apos;s live balance and this week&apos;s projected payday
          show on the Homeward dashboard, and Homeward sends the Friday and month-end reminders.
          The kids see the same numbers on their &ldquo;My Stewardship&rdquo; screen here in Schoolhouse.
        </p>
        <a
          href="https://homeward.echols.family"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-3 px-4 py-2 rounded-lg text-sm font-black text-white bg-amber-600 hover:bg-amber-700 transition-all"
        >
          Open Homeward →
        </a>
      </div>

      {/* Sign out */}
      <div className="border-t border-stone/20 pt-4 text-center">
        <button
          onClick={() => { window.location.href = "/"; }}
          className="text-sm text-stone underline hover:text-navy transition-colors"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
