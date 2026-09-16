"use client";

import { useEffect, useState } from "react";
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
  type UnlockedAchievement,
} from "@/lib/data";
import { SUBJECT_QUESTIONS, SUBJECT_META } from "@/lib/questions";
import type { Question } from "@/lib/data";

interface Props {
  subject: string;
  subjectKey: string;
}

type Screen = "idle" | "playing" | "done";

function starsEarned(accuracy: number): number {
  if (accuracy >= 90) return 4;
  if (accuracy >= 80) return 3;
  if (accuracy >= 60) return 2;
  return 1;
}

const ROUND_SIZE = 5;

export default function SubjectPractice({ subject, subjectKey }: Props) {
  const allQuestions = SUBJECT_QUESTIONS[subject];
  const meta = SUBJECT_META[subject];

  const [screen, setScreen] = useState<Screen>("idle");
  const [topicFilter, setTopicFilter] = useState<string | null>(null);
  const [round, setRound] = useState<Question[]>([]);
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [answers, setAnswers] = useState<(string | null)[]>([]);
  const [newlyUnlocked, setNewlyUnlocked] = useState<UnlockedAchievement[]>([]);
  const [leveledUp, setLeveledUp] = useState(false);

  if (!allQuestions || !meta) {
    return (
      <div className="min-h-screen bg-parchment text-navy px-4 py-8 max-w-md mx-auto">
        <Link href="/hub" className="text-sm text-stone hover:text-navy mb-6 block">← Back to Hub</Link>
        <div className="bg-bone rounded-sm p-6 text-center"><p className="text-stone">Unknown subject: <strong>{subject}</strong></p></div>
      </div>
    );
  }

  const uniqueTopics = Array.from(new Set(allQuestions.map((q) => q.topic)));

  function startRound() {
    const pool = topicFilter ? allQuestions.filter((q) => q.topic === topicFilter) : allQuestions;
    const chosen = shuffle(pool).slice(0, ROUND_SIZE);
    setRound(chosen); setQIndex(0); setSelected(null);
    setAnswers(new Array(chosen.length).fill(null));
    setLeveledUp(false); setNewlyUnlocked([]);
    setScreen("playing");
  }

  function handleAnswer(choice: string) {
    if (selected !== null) return;
    setSelected(choice);
    const updated = [...answers];
    updated[qIndex] = choice;
    setAnswers(updated);
  }

  function handleNext() {
    if (qIndex < round.length - 1) {
      setQIndex(qIndex + 1);
      setSelected(answers[qIndex + 1]);
    } else {
      finishRound();
    }
  }

  function finishRound() {
    const correct = round.filter((q, i) => answers[i] === q.answer).length;
    const total = round.length;
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
    const stars = starsEarned(accuracy);
    const xpEarned = meta.xpPerCorrect * correct;
    const topicsCovered = Array.from(new Set(round.map((q) => q.topic)));
    let s = loadStats();
    const prevLevel = getLevel(s.xp).level;
    s = updateStreak(s); s = recordSubjectPlayed(s, subject);
    s.xp += xpEarned; s.stars += stars;
    if ((s.topicBest[subjectKey] ?? 0) < accuracy) s.topicBest[subjectKey] = accuracy;
    const newLevel = getLevel(s.xp).level;
    if (newLevel > prevLevel) setLeveledUp(true);
    const newly = checkAchievements(s);
    s.achievementsUnlocked = [...s.achievementsUnlocked, ...newly];
    saveStats(s); setNewlyUnlocked(newly); bumpDailySession();
    postSession({ session_date: todayISO(), subject, mode: "practice", score: correct, total, xp_earned: xpEarned, stars_earned: stars, topics_covered: topicsCovered });
    setScreen("done");
  }

  if (screen === "idle") {
    return (
      <div className="min-h-screen bg-parchment text-navy px-4 py-8 max-w-md mx-auto">
        <Link href="/hub" className="text-sm text-stone hover:text-navy mb-6 block">← Back to Hub</Link>
        <h1 className="text-3xl font-bold text-navy mb-2" style={{ fontFamily: "Georgia, serif" }}>{meta.label}</h1>
        <p className="text-stone text-sm mb-5">{meta.description}</p>
        <div className="bg-bone rounded-sm p-4 mb-5">
          <p className="text-xs font-semibold text-navy mb-2 uppercase tracking-wide">Topics covered</p>
          <ul className="list-disc list-inside space-y-1">{meta.topicsCovered.map((t) => <li key={t} className="text-sm text-navy leading-snug">{t}</li>)}</ul>
        </div>
        <div className="mb-6">
          <p className="text-sm font-semibold text-navy mb-2">Filter by topic (optional):</p>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setTopicFilter(null)} className={`px-3 py-1.5 rounded-sm text-sm font-semibold border transition-colors ${topicFilter === null ? "bg-navy text-white border-navy" : "bg-bone text-navy border-bone hover:border-navy"}`}>All Topics</button>
            {uniqueTopics.map((t) => <button key={t} onClick={() => setTopicFilter(t)} className={`px-3 py-1.5 rounded-sm text-sm font-semibold border transition-colors ${topicFilter === t ? "bg-navy text-white border-navy" : "bg-bone text-navy border-bone hover:border-navy"}`}>{t}</button>)}
          </div>
        </div>
        <button onClick={startRound} className="w-full bg-navy text-white font-bold py-3 rounded-sm hover:bg-navy-dark transition-colors text-lg">Start →</button>
      </div>
    );
  }

  if (screen === "playing") {
    const q = round[qIndex];
    const isAnswered = selected !== null;
    const isLastQuestion = qIndex === round.length - 1;
    const progressPct = Math.round(((qIndex + (isAnswered ? 1 : 0)) / round.length) * 100);
    return (
      <div className="min-h-screen bg-parchment text-navy px-4 py-8 max-w-md mx-auto">
        <div className="mb-4">
          <div className="flex justify-between text-xs text-stone mb-1"><span>Question {qIndex + 1} of {round.length}</span><span>{progressPct}% complete</span></div>
          <div className="h-2 bg-bone rounded-full overflow-hidden"><div className="h-full bg-navy rounded-full transition-all duration-300" style={{ width: `${progressPct}%` }} /></div>
        </div>
        <div className="flex justify-end mb-4"><span className="text-xs bg-bone text-stone px-2 py-1 rounded-full border border-stone/30">{q.topic}</span></div>
        <div className="bg-bone rounded-sm p-5 mb-5"><p className="text-lg font-semibold text-navy leading-snug">{q.question}</p></div>
        <div className="space-y-3 mb-5">
          {q.choices.map((choice) => {
            let cls = "w-full text-left px-4 py-3 rounded-sm text-base font-medium border-2 transition-colors ";
            if (!isAnswered) cls += "bg-bone text-navy border-transparent hover:border-navy cursor-pointer";
            else if (choice === q.answer) cls += "bg-teal text-white border-teal";
            else if (choice === selected && choice !== q.answer) cls += "bg-bone text-stone border-stone/40 line-through opacity-70";
            else cls += "bg-bone text-stone border-transparent opacity-50";
            return <button key={choice} onClick={() => handleAnswer(choice)} disabled={isAnswered} className={cls}>{choice}</button>;
          })}
        </div>
        {isAnswered && (
          <div className="bg-bone rounded-sm p-4 mb-5 border-l-4 border-teal">
            <p className="text-xs font-semibold text-teal uppercase tracking-wide mb-1">{selected === q.answer ? "Correct!" : "Not quite, "}</p>
            <p className="text-sm text-navy leading-relaxed">{q.solution}</p>
          </div>
        )}
        {isAnswered && <button onClick={handleNext} className="w-full bg-navy text-white font-bold py-3 rounded-sm hover:bg-navy-dark transition-colors">{isLastQuestion ? "See Results →" : "Next →"}</button>}
      </div>
    );
  }

  const correct = round.filter((q, i) => answers[i] === q.answer).length;
  const total = round.length;
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
  const stars = starsEarned(accuracy);
  const xpEarned = meta.xpPerCorrect * correct;
  const missedQuestions = round.filter((q, i) => answers[i] !== q.answer);

  return (
    <div className="min-h-screen bg-parchment text-navy px-4 py-8 max-w-md mx-auto">
      <h1 className="text-3xl font-bold text-navy mb-1" style={{ fontFamily: "Georgia, serif" }}>Round Complete!</h1>
      <p className="text-stone text-sm mb-5">{meta.label} practice</p>
      <div className="bg-bone rounded-sm p-5 mb-4">
        <div className="flex justify-between mb-3"><span className="text-stone text-sm">Score</span><span className="font-bold text-navy">{correct} / {total}</span></div>
        <div className="flex justify-between mb-3"><span className="text-stone text-sm">Accuracy</span><span className="font-bold text-navy">{accuracy}%</span></div>
        <div className="flex justify-between mb-3"><span className="text-stone text-sm">Stars earned</span><span className="text-gold font-bold">{"★".repeat(stars)}{"☆".repeat(4 - stars)}</span></div>
        <div className="flex justify-between"><span className="text-stone text-sm">XP earned</span><span className="font-bold text-teal">+{xpEarned} XP</span></div>
      </div>
      {leveledUp && <div className="bg-gold text-white rounded-sm p-3 mb-4 text-center font-bold">Level Up! Keep it up!</div>}
      {newlyUnlocked.length > 0 && (
        <div className="bg-bone rounded-sm p-4 mb-4">
          <p className="font-bold text-navy mb-2">Achievements unlocked!</p>
          {newlyUnlocked.map((a) => <p key={a.id} className="text-sm text-teal">★ {a.id.replace(/_/g, " ")}</p>)}
        </div>
      )}
      {missedQuestions.length > 0 && (
        <div className="mb-5">
          <p className="text-sm font-semibold text-navy mb-3">Review missed questions:</p>
          <div className="space-y-3">
            {round.map((q, i) => {
              const wasCorrect = answers[i] === q.answer;
              return (
                <div key={q.id} className={`bg-bone rounded-sm p-4 border-l-4 ${wasCorrect ? "border-teal" : "border-stone/40"}`}>
                  <div className="flex items-start gap-2 mb-1"><span className={wasCorrect ? "text-teal" : "text-stone"}>{wasCorrect ? "✓" : "✗"}</span><p className="text-sm font-medium text-navy leading-snug flex-1">{q.question}</p></div>
                  {!wasCorrect && <div className="mt-2 ml-5"><p className="text-xs text-stone mb-0.5">Your answer: <span className="line-through">{answers[i]}</span></p><p className="text-xs text-teal mb-0.5">Correct: {q.answer}</p><p className="text-xs text-navy mt-1 leading-snug">{q.solution}</p></div>}
                </div>
              );
            })}
          </div>
        </div>
      )}
      <div className="flex gap-3 mt-4">
        <button onClick={() => setScreen("idle")} className="flex-1 bg-navy text-white font-bold py-3 rounded-sm hover:bg-navy-dark transition-colors">Play Again</button>
        <Link href="/hub" className="flex-1 text-center bg-bone text-navy font-bold py-3 rounded-sm border border-navy hover:bg-navy hover:text-white transition-colors">Back to Hub</Link>
      </div>
    </div>
  );
}
