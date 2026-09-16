import { notFound, redirect } from "next/navigation";
import LearnGame from "@/components/LearnGame";
import KidMathDrills from "@/components/KidMathDrills";
import HandwritingGame from "@/components/HandwritingGame";
import HandwritingPractice from "@/components/HandwritingPractice";
import TitusMathGame from "@/components/TitusMathGame";
import TitusMathFacts from "@/components/TitusMathFacts";
import TitusWordProblems from "@/components/TitusWordProblems";
import MercyPhonicsGame from "@/components/MercyPhonicsGame";
import MercySightWords from "@/components/MercySightWords";
import MercyMathFacts from "@/components/MercyMathFacts";
import LoisPractice from "@/components/LoisPractice";
import LoisTyping from "@/components/LoisTyping";
import MercyTyping from "@/components/MercyTyping";
import TitusTyping from "@/components/TitusTyping";
import TitusBible from "@/components/TitusBible";
import MercyBible from "@/components/MercyBible";
import LoisBible from "@/components/LoisBible";
import BiblePageWrapper from "@/components/BiblePageWrapper";
import { KIDS, type KidId } from "@/lib/kids";

interface Props {
  params: Promise<{ kid: string; game: string }>;
}

export default async function KidPlayPage({ params }: Props) {
  const { kid, game } = await params;
  const profile = KIDS[kid as KidId];
  if (!profile) notFound();

  // ── Bible pages ───────────────────────────────────────────────────────────
  if (game === "bible") {
    if (kid === "titus") return <BiblePageWrapper kidId="titus"><TitusBible /></BiblePageWrapper>;
    if (kid === "mercy") return <BiblePageWrapper kidId="mercy"><MercyBible /></BiblePageWrapper>;
    if (kid === "lois")  return <BiblePageWrapper kidId="lois"><LoisBible /></BiblePageWrapper>;
  }

  // ── Typing curriculum ─────────────────────────────────────────────────────
  if (game === "typing") {
    if (kid === "lois")  return <LoisTyping />;
    if (kid === "mercy") return <MercyTyping />;
    if (kid === "titus") return <TitusTyping />;
  }

  // ── Lois: all other games route to LoisPractice ──────────────────────────
  if (kid === "lois") {
    return <LoisPractice />;
  }

  // ── Titus: math facts ─────────────────────────────────────────────────────
  if (kid === "titus" && game === "mathfacts") {
    return <TitusMathFacts />;
  }

  // ── Titus: word problems ──────────────────────────────────────────────────
  if (kid === "titus" && game === "wordproblems") {
    return <TitusWordProblems />;
  }

  // ── Titus: upgraded math drill ────────────────────────────────────────────
  if (kid === "titus" && game === "math") {
    return <TitusMathGame />;
  }

  // ── Titus: canvas handwriting practice ────────────────────────────────────
  if (kid === "titus" && game === "handwriting") {
    return <HandwritingPractice />;
  }

  // ── Mercy: phonics game ───────────────────────────────────────────────────
  if (kid === "mercy" && game === "phonics") {
    return <MercyPhonicsGame />;
  }

  // ── Mercy: sight words game ───────────────────────────────────────────────
  if (kid === "mercy" && game === "sightwords") {
    return <MercySightWords />;
  }

  // ── Mercy: math facts ─────────────────────────────────────────────────────
  if (kid === "mercy" && game === "mathfacts") {
    return <MercyMathFacts />;
  }

  // ── Legacy fallbacks ──────────────────────────────────────────────────────
  if (game === "handwriting") {
    return (
      <HandwritingGame
        kidId={profile.id}
        colorHex={profile.colorHex}
        uiSize={profile.uiSize}
        backHref={`/kids/${profile.id}/hub`}
      />
    );
  }

  // Titus old math drills (kept for /play/math-drills if needed)
  if (game === "math-drills") {
    return <KidMathDrills profile={profile} />;
  }

  // Safe fallback: if the game ID is not in this kid's games list, redirect to hub
  // rather than rendering a broken or stuck LearnGame screen.
  const isKnownGame = profile.games.some((g) => g.id === game);
  if (!isKnownGame) {
    redirect(`/kids/${profile.id}/hub`);
  }

  return <LearnGame profile={profile} gameId={game} />;
}
