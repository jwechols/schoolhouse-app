"use client";

import { useState } from "react";
import Link from "next/link";
import {
  loadStats,
  saveStats,
  updateStreak,
  recordSubjectPlayed,
  getLevel,
  checkAchievements,
  postSession,
  shuffle,
  bumpDailySession,
  todayISO,
  ACHIEVEMENTS,
  type Question,
  type UnlockedAchievement,
} from "@/lib/data";
import { FRACTION_QUESTIONS } from "@/lib/questions";

const ROUND_SIZE = 5;

type Screen = "idle" | "playing" | "done";

interface RoundResult {
  question: Question;
  chosen: string;
  correct: boolean;
}

function buildTopics(): string[] {
  const seen = new Set<string>();
  const topics: string[] = [];
  for (const q of FRACTION_QUESTIONS) {
    if (!seen.has(q.topic)) {
      seen.add(q.topic);
      topics.push(q.topic);
    }
  }
  return topics;
}

const ALL_TOPICS = buildTopics();

function pickQuestions(topic: string): Question[] {
  const pool =
    topic === "All"
      ? FRACTION_QUESTIONS
      : FRACTION_QUESTIONS.filter((q) => q.topic === topic);
  return shuffle(pool).slice(0, ROUND_SIZE);
}

export default function FractionGame() {
  const [screen, setScreen] = useState<Screen>("idle");
  const [topic, setTopic] = useState("All");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [idx, setIdx] = useState(0);
  const [chosen, setChosen] = useState<string | null>(null);
  const [results, setResults] = useState<RoundResult[]>([]);
  const [newlyUnlocked, setNewlyUnlocked] = useState<UnlockedAchievement[]>([]);
  const [leveledUp, setLeveledUp] = useState(false);
  const [finalXP, setFinalXP] = useState(0);

  function startRound() {
    const qs = pickQuestions(topic);
    setQuestions(qs);
    setIdx(0);
    setChosen(null);
    setResults([]);
    setLeveledUp(false);
    setNewlyUnlocked([]);
    setScreen("playing");
  }

  function handleChoice(choice: string) {
    if (chosen !== null) return;
    setChosen(choice);
  }

  function handleNext() {
    if (chosen === null) return;
    const q = questions[idx];
    const correct = chosen === q.answer;
    const newResults = [...results, { question: q, chosen, correct }];
    setResults(newResults);

    if (idx + 1 < questions.length) {
      setIdx(idx + 1);
      setChosen(null);
    } else {
      const score = newResults.filter((r) => r.correct).length;
      const total = newResults.length;
      const accuracy = total > 0 ? Math.round((score / total) * 100) : 0;
      const xpEarned = score * 10;
      const starsEarned =
        accuracy >= 90 ? 4 : accuracy >= 80 ? 3 : accuracy >= 60 ? 2 : 1;

      setFinalXP(xpEarned);

      let s = loadStats();
      const prevLevel = getLevel(s.xp).level;
      s = updateStreak(s);
      s = recordSubjectPlayed(s, "fractions");
      s.xp += xpEarned;
      s.stars += starsEarned;
      if ((s.topicBest["fractions"] ?? 0) < accuracy)
        s.topicBest["fractions"] = accuracy;

      const newLevel = getLevel(s.xp).level;
      if (newLevel > prevLevel) setLeveledUp(true);

      const newly = checkAchievements(s);
      s.achievementsUnlocked = [...s.achievementsUnlocked, ...newly];
      saveStats(s);
      setNewlyUnlocked(newly);
      bumpDailySession();

      const topicsCovered =
        topic === "All"
          ? [...new Set(newResults.map((r) => r.question.topic))]
          : [topic];

      postSession({
        session_date: todayISO(),
        subject: "fractions",
        mode: "practice",
        score,
        total,
        xp_earned: xpEarned,
        stars_earned: starsEarned,
        topics_covered: topicsCovered,
      });

      setScreen("done");
    }
  }

  if (screen === "idle") {
    return (
      <div className="min-h-screen bg-parchment text-navy px-4 py-8 max-w-md mx-auto">
        <Link href="/hub" className="text-sm text-stone hover:text-navy mb-6 block">
          ← Back to Hub
        </Link>
        <h1 className="text-3xl font-bold text-navy mb-2" style={{ fontFamily: "Georgia, serif" }}>
          Fractions
        </h1>
        <p className="text-stone text-sm mb-6">5 questions per round. Simplify, add, multiply, compare.</p>
        <div className="mb-6">
          <p className="text-sm font-semibold text-navy mb-3">Filter by topic:</p>
          <div className="flex flex-wrap gap-2">
            {["All", ...ALL_TOPICS].map((t) => (
              <button
                key={t}
                onClick={() => setTopic(t)}
                className={`px-3 py-1.5 rounded-sm text-sm font-semibold border transition-colors ${
                  topic === t ? "bg-navy text-white border-navy" : "bg-bone text-navy border-bone hover:border-navy"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        <button onClick={startRound} className="w-full bg-navy text-white font-bold py-3 rounded-sm hover:bg-navy-dark transition-colors text-lg">
          Start →
        </button>
      </div>
    );
  }

  if (screen === "playing") {
    const q = questions[idx];
    const isLast = idx + 1 === questions.length;
    return (
      <div className="min-h-screen bg-parchment text-navy px-4 py-8 max-w-md mx-auto">
        <div className="h-2 bg-bone rounded-full overflow-hidden mb-4">
          <div className="h-full bg-navy rounded-full transition-all duration-300" style={{ width: `${((idx + (chosen !== null ? 1 : 0)) / ROUND_SIZE) * 100}%` }} />
        </div>
        <div className="flex justify-between items-center mb-4 text-xs text-stone">
          <span>Question {idx + 1} of {ROUND_SIZE}</span>
          <span className="bg-parchment border border-stone px-2 py-0.5 rounded-full">{q.topic}</span>
        </div>
        <p className="text-xl font-bold text-navy mb-6 leading-snug" style={{ fontFamily: "Georgia, serif" }}>{q.question}</p>
        <div className="flex flex-col gap-3 mb-4">
          {q.choices.map((c) => {
            let cls = "w-full text-left px-4 py-3 rounded-sm border-2 font-semibold transition-colors text-base ";
            if (chosen === null) cls += "bg-bone text-navy border-transparent hover:border-navy cursor-pointer";
            else if (c === q.answer) cls += "bg-teal text-white border-teal";
            else if (c === chosen && c !== q.answer) cls += "bg-red-100 text-red-700 border-red-300";
            else cls += "bg-bone text-stone border-transparent opacity-60";
            return <button key={c} onClick={() => handleChoice(c)} disabled={chosen !== null} className={cls}>{c}</button>;
          })}
        </div>
        {chosen !== null && (
          <div className="bg-bone rounded-sm p-4 mb-4 border-l-4 border-teal">
            <p className="text-xs text-stone uppercase tracking-wide mb-1 font-semibold">Solution</p>
            <p className="text-sm text-navy leading-relaxed">{q.solution}</p>
          </div>
        )}
        {chosen !== null && (
          <button onClick={handleNext} className="w-full bg-navy text-white font-bold py-3 rounded-sm hover:bg-navy-dark transition-colors">
            {isLast ? "See Results →" : "Next →"}
          </button>
        )}
      </div>
    );
  }

  const score = results.filter((r) => r.correct).length;
  const total = results.length;
  const accuracy = total > 0 ? Math.round((score / total) * 100) : 0;
  return (
    <div className="min-h-screen bg-parchment text-navy px-4 py-8 max-w-md mx-auto">
      <h1 className="text-3xl font-bold text-navy mb-1" style={{ fontFamily: "Georgia, serif" }}>Round Complete!</h1>
      <p className="text-stone text-sm mb-6">Here&apos;s how you did:</p>
      <div className="bg-bone rounded-sm p-5 mb-4">
        <div className="flex justify-between mb-3"><span className="text-stone text-sm">Score</span><span className="font-bold text-navy">{score} / {total}</span></div>
        <div className="flex justify-between mb-3"><span className="text-stone text-sm">Accuracy</span><span className="font-bold text-navy">{accuracy}%</span></div>
        <div className="flex justify-between"><span className="text-stone text-sm">XP earned</span><span className="font-bold text-teal">+{finalXP} XP</span></div>
      </div>
      {leveledUp && <div className="bg-gold text-white rounded-sm p-3 mb-4 text-center font-bold">Level Up! Keep going!</div>}
      {newlyUnlocked.length > 0 && (
        <div className="bg-bone rounded-sm p-4 mb-4">
          <p className="font-bold text-navy mb-2">Achievements unlocked!</p>
          {newlyUnlocked.map((a) => { const def = ACHIEVEMENTS.find((d) => d.id === a.id); return <p key={a.id} className="text-sm text-teal">★ {def ? def.label : a.id.replace(/_/g, " ")}</p>; })}
        </div>
      )}
      <div className="mb-6">
        <h2 className="text-base font-bold text-navy mb-3" style={{ fontFamily: "Georgia, serif" }}>Review</h2>
        <div className="flex flex-col gap-3">
          {results.map((r, i) => (
            <div key={r.question.id} className={`bg-bone rounded-sm p-4 border-l-4 ${r.correct ? "border-teal" : "border-red-400"}`}>
              <div className="flex items-start justify-between gap-2 mb-1">
                <p className="text-sm font-semibold text-navy leading-snug">{i + 1}. {r.question.question}</p>
                <span className={`text-base flex-shrink-0 ${r.correct ? "text-teal" : "text-red-500"}`}>{r.correct ? "✓" : "✗"}</span>
              </div>
              {!r.correct && (
                <>
                  <p className="text-xs text-stone mb-1">Your answer: <span className="text-red-600">{r.chosen}</span>, Correct: <span className="text-teal font-semibold">{r.question.answer}</span></p>
                  <p className="text-xs text-navy leading-relaxed">{r.question.solution}</p>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="flex gap-3">
        <button onClick={startRound} className="flex-1 bg-navy text-white font-bold py-3 rounded-sm hover:bg-navy-dark transition-colors">Play Again</button>
        <Link href="/hub" className="flex-1 text-center bg-bone text-navy font-bold py-3 rounded-sm border border-navy hover:bg-navy hover:text-white transition-colors">Back to Hub</Link>
      </div>
    </div>
  );
}
