"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { KidProfile } from "@/lib/kids";
import { getWeeklyCurriculum } from "@/lib/weekly-curriculum";
import { syncWeeklyCurriculum } from "@/lib/weekly-sync";
import { useTTS, OPENAI_VOICE } from "@/lib/tts";
import { addXP, recordSession, checkBadges } from "@/lib/progress";
import { burstConfetti } from "@/lib/confetti";
import { reportLessonToHomeward, dailyLessonId } from "@/lib/homeward";
import FloatingTutor from "@/components/FloatingTutor";

// ── Daily Faith Path ──────────────────────────────────────────────────────────
// The discipleship walk for the week: catechism → memory verse → hymn → done.
// Every step is spoken aloud (OpenAI TTS) so pre-readers can do it alone.
// Completing the path earns XP and marks the day done on the hub card.

const XP_REWARD = 30;

export function faithDoneKey(kidId: string): string {
  const d = new Date();
  const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  return `faith-path-${kidId}-${iso}`;
}

type Step = "start" | "catechism" | "verse" | "hymn" | "done";

export default function FaithPath({ profile }: { profile: KidProfile }) {
  const router = useRouter();
  const [wk, setWk] = useState(() => getWeeklyCurriculum());
  const { speak, unlockAudio, stopAudio } = useTTS(OPENAI_VOICE[profile.id] ?? "nova");

  const [step, setStep] = useState<Step>("start");
  const [answerShown, setAnswerShown] = useState(false);
  const startedAtRef = useState(() => Date.now())[0];

  // Pull this week's content from the church pipeline (cached weekly server-side)
  useEffect(() => {
    syncWeeklyCurriculum().then((fresh) => { if (fresh) setWk(fresh); });
  }, []);

  const isXLarge = profile.uiSize === "xlarge";
  const isLarge = profile.uiSize === "large" || isXLarge;
  const fontBase = isXLarge ? "text-2xl" : isLarge ? "text-xl" : "text-lg";
  const fontLg = isXLarge ? "text-4xl" : isLarge ? "text-3xl" : "text-2xl";

  const STEP_LABELS: { key: Step; emoji: string; label: string }[] = [
    { key: "catechism", emoji: "✝️", label: "Catechism" },
    { key: "verse",     emoji: "📖", label: "Verse" },
    { key: "hymn",      emoji: "🎵", label: "Hymn" },
  ];

  // What each step says out loud when the kid arrives on it
  function speechFor(s: Step): string {
    switch (s) {
      case "catechism":
        return `This week's catechism question: ${wk.catechism.question}. Can you say the answer out loud?`;
      case "verse":
        return `This week's memory verse: ${wk.verse.text}. ${wk.verse.reference}. Now you say it!`;
      case "hymn":
        return `This week's hymn is ${wk.hymn.title}. Listen: ${wk.hymn.verse}`;
      case "done":
        return `You did it! You walked the whole faith path today. God loves you so much!`;
      default:
        return "";
    }
  }

  function goTo(next: Step) {
    unlockAudio(); // every transition is a tap, keeps iOS audio unlocked
    stopAudio();
    setAnswerShown(false);
    setStep(next);
    const line = speechFor(next);
    if (line) setTimeout(() => speak(line), 300);
    if (next === "done") {
      addXP(profile.id, XP_REWARD);
      recordSession(profile.id, "faith");
      checkBadges(profile.id);
      try { localStorage.setItem(faithDoneKey(profile.id), "done"); } catch { /* ignore */ }
      // Homeward gig credit, walking the Faith Path earns real points too
      const minutes = Math.round((Date.now() - startedAtRef) / 60000);
      if (minutes >= 1) {
        reportLessonToHomeward({
          kid: profile.id,
          subject: "faith",
          lessonId: dailyLessonId(profile.id, "faith"),
          minutesEarned: minutes,
          lessonTitle: "Faith Path",
        });
      }
      burstConfetti(window.innerWidth / 2, window.innerHeight / 3, profile.color);
    }
  }

  function revealAnswer() {
    unlockAudio();
    setAnswerShown(true);
    speak(`The answer is: ${wk.catechism.answer}`);
  }

  const bigBtn = (label: string, onClick: () => void, primary = true) => (
    <button
      onPointerDown={() => unlockAudio()}
      onClick={onClick}
      className="w-full py-5 rounded-3xl font-black shadow-xl hover:opacity-90 hover:scale-105 active:scale-95 transition-all duration-200"
      style={{
        backgroundColor: primary ? profile.color : "#ffffff",
        color: primary ? "white" : profile.colorDark,
        border: primary ? "none" : `2px solid ${profile.color}50`,
        fontSize: isLarge ? "1.35rem" : "1.1rem",
      }}
    >
      {label}
    </button>
  );

  const speakAgainBtn = (text: string) => (
    <button
      onPointerDown={() => { unlockAudio(); speak(text); }}
      onClick={(e) => e.preventDefault()}
      className="mx-auto block rounded-full font-bold active:scale-95 transition-all"
      style={{
        background: `${profile.color}18`,
        border: `2px solid ${profile.color}50`,
        color: profile.colorDark,
        padding: isLarge ? "12px 30px" : "10px 24px",
        fontSize: isLarge ? "1.15rem" : "1rem",
      }}
    >
      🔊 Hear it again
    </button>
  );

  const card = (children: React.ReactNode) => (
    <div
      className="bg-white rounded-3xl shadow-md p-6 mb-6"
      style={{ borderLeft: `5px solid ${profile.color}` }}
    >
      {children}
    </div>
  );

  return (
    <main
      className="min-h-screen px-4 py-8 max-w-lg md:max-w-2xl mx-auto flex flex-col"
      style={{ background: `linear-gradient(160deg, ${profile.colorHex}12 0%, #fff 100%)` }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => router.push(`/kids/${profile.id}/hub`)}
          className="text-gray-400 hover:text-gray-600 text-sm font-medium"
        >
          ← Back to Hub
        </button>
        <span
          className="text-sm font-bold px-3 py-1 rounded-full"
          style={{ backgroundColor: profile.colorHex + "20", color: profile.colorHex }}
        >
          🕊️ Faith Path · {wk.weekLabel}
        </span>
      </div>

      {/* Step dots */}
      {step !== "start" && step !== "done" && (
        <div className="flex justify-center gap-3 mb-6">
          {STEP_LABELS.map((s) => (
            <span
              key={s.key}
              className="text-sm font-bold px-3 py-1 rounded-full"
              style={{
                background: step === s.key ? profile.color : `${profile.color}15`,
                color: step === s.key ? "white" : profile.colorDark,
              }}
            >
              {s.emoji} {s.label}
            </span>
          ))}
        </div>
      )}

      {/* ── START ── */}
      {step === "start" && (
        <>
          <div className={`text-center mb-6 ${isXLarge ? "text-9xl" : "text-7xl"}`}>🕊️</div>
          <h1
            className={`font-black text-center mb-6 ${fontLg}`}
            style={{ fontFamily: "Georgia, serif", color: profile.colorHex }}
          >
            Faith Path
          </h1>
          {card(
            <p className={`text-gray-700 leading-relaxed font-medium ${fontBase}`}>
              Three little steps with {profile.tutorName}: this week&apos;s catechism, memory
              verse, and hymn. Say everything out loud, that&apos;s how it sticks!
            </p>
          )}
          {bigBtn("Let's walk! 🕊️", () => goTo("catechism"))}
        </>
      )}

      {/* ── CATECHISM ── */}
      {step === "catechism" && (
        <>
          <div className={`text-center mb-4 ${isXLarge ? "text-8xl" : "text-6xl"}`}>✝️</div>
          {card(
            <>
              <div className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: profile.colorDark }}>
                {wk.catechism.source}
              </div>
              <p className={`font-black text-gray-800 mb-3 ${fontLg}`}>{wk.catechism.question}</p>
              {answerShown ? (
                <>
                  <p className={`text-gray-700 font-medium leading-relaxed ${fontBase}`}>{wk.catechism.answer}</p>
                  <p className="text-sm text-gray-500 mt-2 font-semibold">{wk.catechism.reference}</p>
                </>
              ) : (
                <p className={`italic text-gray-500 ${fontBase}`}>Try to say the answer out loud first!</p>
              )}
            </>
          )}
          <div className="flex flex-col gap-3">
            {speakAgainBtn(speechFor("catechism"))}
            {!answerShown
              ? bigBtn("Show me the answer ✨", revealAnswer)
              : bigBtn("I said it! Next → 📖", () => goTo("verse"))}
          </div>
        </>
      )}

      {/* ── VERSE ── */}
      {step === "verse" && (
        <>
          <div className={`text-center mb-4 ${isXLarge ? "text-8xl" : "text-6xl"}`}>📖</div>
          {card(
            <>
              <div className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: profile.colorDark }}>
                Memory verse · {wk.verse.theme}
              </div>
              <p className={`font-medium text-gray-800 leading-relaxed mb-3 ${fontLg}`} style={{ fontFamily: "Georgia, serif" }}>
                &ldquo;{wk.verse.text}&rdquo;
              </p>
              <p className="text-sm text-gray-500 font-semibold">{wk.verse.reference}</p>
            </>
          )}
          <div className="flex flex-col gap-3">
            {speakAgainBtn(speechFor("verse"))}
            {bigBtn("I said it! Next → 🎵", () => goTo("hymn"))}
          </div>
        </>
      )}

      {/* ── HYMN ── */}
      {step === "hymn" && (
        <>
          <div className={`text-center mb-4 ${isXLarge ? "text-8xl" : "text-6xl"}`}>🎵</div>
          {card(
            <>
              <div className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: profile.colorDark }}>
                This week&apos;s hymn{wk.hymn.doctrine ? ` · ${wk.hymn.doctrine}` : ""}
              </div>
              <p className={`font-black text-gray-800 mb-1 ${fontLg}`}>{wk.hymn.title}</p>
              <p className="text-sm text-gray-500 font-semibold mb-3">
                {wk.hymn.author}{wk.hymn.year ? ` · ${wk.hymn.year}` : ""}
              </p>
              <p className={`text-gray-700 font-medium leading-relaxed whitespace-pre-line ${fontBase}`} style={{ fontFamily: "Georgia, serif" }}>
                {wk.hymn.verse}
              </p>
              {wk.hymn.chorus && (
                <p className={`text-gray-600 italic leading-relaxed whitespace-pre-line mt-3 ${fontBase}`} style={{ fontFamily: "Georgia, serif" }}>
                  {wk.hymn.chorus}
                </p>
              )}
            </>
          )}
          <div className="flex flex-col gap-3">
            {speakAgainBtn(speechFor("hymn"))}
            {bigBtn("Finish the path! 🕊️", () => goTo("done"))}
          </div>
        </>
      )}

      {/* ── DONE ── */}
      {step === "done" && (
        <>
          <div className={`text-center mb-4 ${isXLarge ? "text-9xl" : "text-8xl"}`}>🎉</div>
          <h2 className={`font-black text-center mb-4 ${fontLg}`} style={{ color: profile.colorHex }}>
            You walked the path!
          </h2>
          {card(
            <>
              <p className={`text-gray-700 font-medium leading-relaxed mb-3 ${fontBase}`}>
                +{XP_REWARD} XP earned! This week&apos;s character trait is{" "}
                <strong>{wk.character.trait}</strong>:{" "}
                {isXLarge ? wk.character.toddlerFriendly : wk.character.kidFriendly}
              </p>
              <p className={`text-gray-500 italic ${isLarge ? "text-base" : "text-sm"}`}>
                Want to talk about it? Tap {profile.tutorName}&apos;s button in the corner!
              </p>
            </>
          )}
          <div className="flex flex-col gap-3">
            {bigBtn("Back to my hub 🏠", () => router.push(`/kids/${profile.id}/hub`))}
            {bigBtn("Walk it again 🔁", () => goTo("catechism"), false)}
          </div>
          {/* Tutor is here for a conversation about what they just learned */}
          <FloatingTutor kidId={profile.id} subject="bible" />
        </>
      )}
    </main>
  );
}
