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
import { WORD_PROBLEMS } from "@/lib/questions";

const ROUND_SIZE = 5;
const XP_PER_CORRECT = 15;
const TOPICS_COVERED = ["Fractions", "Ratios", "Percentages", "Rate & Distance"];

type Screen = "idle" | "playing" | "done";

interface RoundResult {
  question: Question;
  chosen: string;
  correct: boolean;
}

function pickQuestions(): Question[] {
  return shuffle(WORD_PROBLEMS).slice(0, ROUND_SIZE);
}

export default function WordProblems() {
  const [screen, setScreen] = useState<Screen>("idle");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [idx, setIdx] = useState(0);
  const [chosen, setChosen] = useState<string | null>(null);
  const [results, setResults] = useState<RoundResult[]>([]);
  const [newlyUnlocked, setNewlyUnlocked] = useState<UnlockedAchievement[]>([]);
  const [leveledUp, setLeveledUp] = useState(false);
  const [finalXP, setFinalXP] = useState(0);

  function startRound() {
    setQuestions(pickQuestions());
    setIdx(0); setChosen(null); setResults([]);
    setLeveledUp(false); setNewlyUnlocked([]);
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
    if (idx + 1 < questions.length) { setIdx(idx + 1); setChosen(null); }
    else {
      const score = newResults.filter((r) => r.correct).length;
      const total = newResults.length;
      const accuracy = total > 0 ? Math.round((score / total) * 100) : 0;
      const xpEarned = score * XP_PER_CORRECT;
      const starsEarned = accuracy >= 90 ? 4 : accuracy >= 80 ? 3 : accuracy >= 60 ? 2 : 1;
      setFinalXP(xpEarned);
      let s = loadStats();
      const prevLevel = getLevel(s.xp).level;
      s = updateStreak(s); s = recordSubjectPlayed(s, "words");
      s.xp += xpEarned; s.stars += starsEarned;
      if ((s.topicBest["words"] ?? 0) < accuracy) s.topicBest["words"] = accuracy;
      const newLevel = getLevel(s.xp).level;
      if (newLevel > prevLevel) setLeveledUp(true);
      const newly = checkAchievements(s);
      s.achievementsUnlocked = [...s.achievementsUnlocked, ...newly];
      saveStats(s); setNewlyUnlocked(newly); bumpDailySession();
      postSession({ session_date: todayISO(), subject: "words", mode: "practice", score, total, xp_earned: xpEarned, stars_earned: starsEarned, topics_covered: [...new Set(newResults.map((r) => r.question.topic))] });
      setScreen("done");
    }
  }

  if (screen === "idle") {
    return (
      <div className="min-h-screen bg-parchment text-navy px-4 py-8 max-w-md mx-auto">
        <Link href="/hub" className="text-sm text-stone hover:text-navy mb-6 block">← Back to Hub</Link>
        <h1 className="text-3xl font-bold text-navy mb-2" style={{ fontFamily: "Georgia, serif" }}>Word Problems</h1>
        <p className="text-stone text-sm mb-5">Singapore-style multi-step problems. Read carefully and think it through!</p>
        <div className="bg-bone rounded-sm p-4 mb-6">
          <p className="text-xs text-stone uppercase tracking-wide mb-2 font-semibold">Topics Covered</p>
          <ul className="space-y-1">{TOPICS_COVERED.map((t) => <li key={t} className="text-sm text-navy flex items-center gap-2"><span className="text-gold">•</span>{t}</li>)}</ul>
        </div>
        <p className="text-xs text-stone mb-6">5 problems per round, {XP_PER_CORRECT} XP per correct answer.</p>
        <button onClick={startRound} className="w-full bg-navy text-white font-bold py-3 rounded-sm hover:bg-navy-dark transition-colors text-lg">Start →</button>
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
          <span>Problem {idx + 1} of {ROUND_SIZE}</span>
          <span className="bg-parchment border border-stone px-2 py-0.5 rounded-full">{q.topic}</span>
        </div>
        <div className="bg-bone rounded-sm p-5 mb-5 border border-stone">
          <p className="text-base text-navy leading-relaxed font-medium" style={{ fontFamily: "Georgia, serif" }}>{q.question}</p>
        </div>
        <p className="text-xs text-stone uppercase tracking-wide mb-3 font-semibold">Choose the correct answer</p>
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
        {chosen !== null && <div className="bg-bone rounded-sm p-4 mb-4 border-l-4 border-teal"><p className="text-xs text-stone uppercase tracking-wide mb-1 font-semibold">Solution</p><p className="text-sm text-navy leading-relaxed">{q.solution}</p></div>}
        {chosen !== null && <button onClick={handleNext} className="w-full bg-navy text-white font-bold py-3 rounded-sm hover:bg-navy-dark transition-colors">{isLast ? "See Results →" : "Next Problem →"}</button>}
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
      <div className="flex gap-3">
        <button onClick={startRound} className="flex-1 bg-navy text-white font-bold py-3 rounded-sm hover:bg-navy-dark transition-colors">Play Again</button>
        <Link href="/hub" className="flex-1 text-center bg-bone text-navy font-bold py-3 rounded-sm border border-navy hover:bg-navy hover:text-white transition-colors">Back to Hub</Link>
      </div>
    </div>
  );
}
