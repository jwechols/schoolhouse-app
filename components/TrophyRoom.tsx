"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getProgress,
  getLevelLabel,
  getLevelXP,
  BADGES,
  ALL_BADGE_IDS,
  type KidProgress,
} from "@/lib/progress";
import type { KidProfile } from "@/lib/kids";

interface Props {
  profile: KidProfile;
  kidIdOverride?: string; // use this kidId for progress lookup instead of profile.id
}

const SUBJECT_LABELS: Record<string, string> = {
  math: "Math",
  prealgebra: "Math",
  writing: "Writing",
  grammar: "Grammar",
  science: "Science",
  history: "History",
  bible: "Bible",
  vocab: "Vocab",
  phonics: "Phonics",
  sightwords: "Reading",
  counting: "Counting",
  addition: "Adding",
  shapes: "Shapes",
  colors: "Colors",
  numbers: "Numbers",
  abc: "ABC's",
  emoji: "Find It!",
  handwriting: "Handwriting",
  wilderness: "Outdoors",
  money: "Money",
  home: "Home Skills",
};

export default function TrophyRoom({ profile, kidIdOverride }: Props) {
  const router = useRouter();
  const [progress, setProgress] = useState<KidProgress | null>(null);
  const kidId = kidIdOverride ?? profile.id;

  useEffect(() => {
    setProgress(getProgress(kidId));
  }, [kidId]);

  if (!progress) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-4xl animate-spin">⭐</div>
      </main>
    );
  }

  const xp = progress.xp;
  const level = progress.level;
  const levelLabel = getLevelLabel(level);
  const { current: levelStart, next: levelEnd } = getLevelXP(level);
  const xpInLevel = xp - levelStart;
  const xpNeeded = levelEnd - levelStart;
  const xpPct = xpNeeded > 0 ? Math.min(100, Math.round((xpInLevel / xpNeeded) * 100)) : 100;

  const earnedBadges = ALL_BADGE_IDS.filter((id) => progress.badges.includes(id));
  const totalBadges = ALL_BADGE_IDS.length;

  const subjectEntries = Object.entries(progress.completedSubjects).sort(
    ([, a], [, b]) => b - a
  );
  const maxSessions = Math.max(...subjectEntries.map(([, v]) => v), 1);

  return (
    <main
      className="min-h-screen px-4 py-8 max-w-lg md:max-w-2xl mx-auto"
      style={{ background: `linear-gradient(160deg, ${profile.colorHex}15 0%, #ffffff 60%)` }}
    >
      {/* Back */}
      <button
        onClick={() => router.back()}
        className="text-sm text-gray-400 mb-5 hover:text-gray-600 transition-colors"
      >
        ← Back
      </button>

      {/* Header */}
      <div className="text-center mb-6">
        <div className="text-8xl mb-2">{profile.emoji}</div>
        <h1
          className="text-3xl font-black mb-1"
          style={{ color: profile.colorHex, fontFamily: "Georgia, serif" }}
        >
          {profile.name}'s Trophies
        </h1>
        <p className="text-gray-500 text-sm">
          Level {level} · {levelLabel}
        </p>
      </div>

      {/* Level badge + XP bar */}
      <div
        className="rounded-2xl p-5 mb-5 text-center shadow-sm"
        style={{ backgroundColor: profile.colorHex + "12", border: `1px solid ${profile.colorHex}30` }}
      >
        <div className="text-5xl mb-2">
          {level >= 5 ? "👑" : level >= 4 ? "🏆" : level >= 3 ? "🌟" : level >= 2 ? "⭐" : "🌱"}
        </div>
        <div className="text-2xl font-black mb-1" style={{ color: profile.colorHex }}>
          {xp} XP
        </div>
        <div className="bg-gray-100 rounded-full h-3 mb-2 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${xpPct}%`, backgroundColor: profile.colorHex }}
          />
        </div>
        <div className="text-xs text-gray-400">
          {xpNeeded > 0 ? `${xpInLevel} / ${xpNeeded} XP to Level ${level + 1}` : "Max Level!"}
        </div>
      </div>

      {/* Streak */}
      {progress.streak >= 2 && (
        <div
          className="rounded-2xl p-4 mb-5 flex items-center gap-3 shadow-sm"
          style={{ backgroundColor: "#fff7ed", border: "1px solid #fed7aa" }}
        >
          <div className="text-4xl">🔥</div>
          <div>
            <div className="font-black text-orange-600 text-lg">
              {progress.streak}-Day Streak!
            </div>
            <div className="text-orange-400 text-xs">Keep it up, practice every day!</div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: "Sessions", value: progress.totalSessions, emoji: "🎮" },
          { label: "Badges", value: `${earnedBadges.length}/${totalBadges}`, emoji: "🏅" },
          { label: "Streak", value: progress.streak, emoji: "🔥" },
        ].map(({ label, value, emoji }) => (
          <div key={label} className="bg-white rounded-2xl p-4 text-center shadow-sm">
            <div className="text-3xl mb-1">{emoji}</div>
            <div className="font-black text-2xl text-gray-800">{value}</div>
            <div className="text-xs text-gray-400">{label}</div>
          </div>
        ))}
      </div>

      {/* Badges */}
      <h2 className="font-black text-gray-700 text-lg mb-3">Badges</h2>
      <div className="grid grid-cols-3 gap-3 mb-6">
        {ALL_BADGE_IDS.map((id) => {
          const badge = BADGES[id];
          const earned = progress.badges.includes(id);
          return (
            <div
              key={id}
              className="rounded-2xl p-3 text-center shadow-sm transition-all"
              style={{
                backgroundColor: earned ? profile.colorHex + "12" : "#f9fafb",
                border: earned ? `2px solid ${profile.colorHex}40` : "2px solid #e5e7eb",
                opacity: earned ? 1 : 0.55,
              }}
            >
              <div className="text-3xl mb-1">{earned ? badge.emoji : "❓"}</div>
              <div
                className="text-xs font-black"
                style={{ color: earned ? profile.colorHex : "#9ca3af" }}
              >
                {earned ? badge.name : "???"}
              </div>
              {earned && (
                <div className="text-xs text-gray-400 mt-0.5 leading-tight">{badge.desc}</div>
              )}
            </div>
          );
        })}
      </div>

      {/* Subject sessions bar chart */}
      {subjectEntries.length > 0 && (
        <>
          <h2 className="font-black text-gray-700 text-lg mb-3">Subject Sessions</h2>
          <div
            className="rounded-2xl p-4 mb-6 shadow-sm"
            style={{ backgroundColor: "#f9fafb" }}
          >
            {subjectEntries.map(([subjectId, count]) => (
              <div key={subjectId} className="mb-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-bold text-gray-600">
                    {SUBJECT_LABELS[subjectId] ?? subjectId}
                  </span>
                  <span className="text-gray-400">{count} session{count !== 1 ? "s" : ""}</span>
                </div>
                <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.round((count / maxSessions) * 100)}%`,
                      backgroundColor: profile.colorHex,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* CTA */}
      <div className="text-center mb-4">
        <p className="text-gray-500 text-sm mb-4">
          {earnedBadges.length === 0
            ? "Start practicing to earn your first badge!"
            : earnedBadges.length < totalBadges
            ? `${totalBadges - earnedBadges.length} more badge${totalBadges - earnedBadges.length !== 1 ? "s" : ""} to earn, keep going!`
            : "Amazing, you've earned every badge! 🎉"}
        </p>
        <button
          onClick={() => router.back()}
          className="py-4 px-8 rounded-3xl font-black text-white shadow-lg hover:opacity-90 active:scale-95 transition-all"
          style={{ backgroundColor: profile.colorHex }}
        >
          Keep Learning! 🚀
        </button>
      </div>
    </main>
  );
}
