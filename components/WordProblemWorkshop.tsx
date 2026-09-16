"use client";

import { useState, useEffect } from "react";
import { getQuestionsByTopic, type SingaporeQuestion } from "@/lib/singapore-math";

const NAVY = "#1b3a6b";
const GOLD = "#f5c518";
const SCAFFOLDED_REQUIRED = 5; // unlock timed mode after 5 scaffolded completions
const TIMED_SECONDS = 90;      // 90-second timer per word problem

// ─── Persistence helpers ─────────────────────────────────────────────────────

function loadScaffoldedCount(): number {
  if (typeof window === "undefined") return 0;
  try {
    return parseInt(localStorage.getItem("truma-wpw-scaffolded") ?? "0", 10) || 0;
  } catch { return 0; }
}

function saveScaffoldedCount(n: number) {
  if (typeof window === "undefined") return;
  localStorage.setItem("truma-wpw-scaffolded", String(n));
}

// ─── Bar model renderers ──────────────────────────────────────────────────────
// All bar models are pure CSS divs, no SVG.

interface BarModelProps {
  question: SingaporeQuestion;
}

/**
 * Determine bar model type from hint/subtopic text.
 * Returns the rendered model or a generic hint display.
 */
function BarModel({ question }: BarModelProps) {
  const hint = question.bar_model_hint ?? "";
  const subtopic = question.subtopic.toLowerCase();
  const text = (hint + " " + subtopic).toLowerCase();

  // Part-whole (subtraction / fraction leftover)
  if (
    text.includes("part") ||
    text.includes("left") ||
    text.includes("remain") ||
    text.includes("subtract") ||
    subtopic.includes("subtracting")
  ) {
    return <PartWholeModel question={question} />;
  }

  // Comparison / ratio (two bars side by side)
  if (
    text.includes("ratio") ||
    text.includes("times as") ||
    text.includes("comparison") ||
    text.includes("unit") ||
    subtopic.includes("ratio")
  ) {
    return <ComparisonModel question={question} />;
  }

  // Before-after
  if (text.includes("before") || text.includes("after") || text.includes("gave") || text.includes("transfer")) {
    return <BeforeAfterModel question={question} />;
  }

  // Default: generic hint box
  return (
    <div
      className="rounded-xl p-4 text-sm font-bold"
      style={{ backgroundColor: GOLD + "22", border: `2px dashed ${GOLD}`, color: NAVY }}
    >
      <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: GOLD }}>
        Bar Model Hint
      </p>
      {hint || "Draw a bar representing the whole, then mark the known and unknown parts."}
    </div>
  );
}

function PartWholeModel({ question }: BarModelProps) {
  // Extract two numbers from the question text heuristically
  const nums = (question.text.match(/[\d¼½¾⅓⅔⅛⅜⅝⅞]+[\s/\d]*/g) ?? []).slice(0, 2);
  const label1 = nums[0]?.trim() || "known part";
  const label2 = nums[1]?.trim() || "known part";

  return (
    <div className="space-y-3">
      <p className="text-xs font-bold uppercase tracking-wider" style={{ color: GOLD }}>
        Bar Model, Part-Whole
      </p>
      {/* Whole bar */}
      <div>
        <div className="text-xs text-blue-300 mb-1">The whole:</div>
        <div
          className="h-10 rounded-lg flex items-center justify-center text-xs font-black"
          style={{ backgroundColor: NAVY + "80", border: `2px solid ${GOLD}60`, color: "white" }}
        >
          Total amount
        </div>
      </div>
      {/* Parts */}
      <div>
        <div className="text-xs text-blue-300 mb-1">Split into parts:</div>
        <div className="flex h-10 rounded-lg overflow-hidden" style={{ border: `2px solid ${GOLD}60` }}>
          <div
            className="flex-1 flex items-center justify-center text-xs font-black"
            style={{ backgroundColor: "#1d4ed8", color: "white" }}
          >
            {label1}
          </div>
          <div
            className="flex-1 flex items-center justify-center text-xs font-black"
            style={{ backgroundColor: "#3b82f6", color: "white" }}
          >
            ??? ← find this
          </div>
        </div>
      </div>
      {question.bar_model_hint && (
        <p className="text-blue-300 text-xs italic">{question.bar_model_hint}</p>
      )}
    </div>
  );
}

function ComparisonModel({ question }: BarModelProps) {
  const hint = question.bar_model_hint ?? "";
  // Try to extract the ratio from hint (e.g. "3 units")
  const unitMatch = hint.match(/(\d)\s*unit/i);
  const bigUnits = unitMatch ? parseInt(unitMatch[1], 10) : 3;
  const smallUnits = 1;

  return (
    <div className="space-y-3">
      <p className="text-xs font-bold uppercase tracking-wider" style={{ color: GOLD }}>
        Bar Model, Comparison
      </p>
      <div className="space-y-2">
        <div>
          <div className="text-xs text-blue-300 mb-1">Larger amount:</div>
          <div className="flex gap-1 h-9">
            {Array.from({ length: bigUnits }).map((_, i) => (
              <div
                key={i}
                className="flex-1 rounded flex items-center justify-center text-xs font-black"
                style={{ backgroundColor: "#1d4ed8", color: "white" }}
              >
                {i === 0 ? "1u" : ""}
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="text-xs text-blue-300 mb-1">Smaller amount:</div>
          <div className="flex gap-1 h-9" style={{ width: `${(smallUnits / bigUnits) * 100}%` }}>
            {Array.from({ length: smallUnits }).map((_, i) => (
              <div
                key={i}
                className="flex-1 rounded flex items-center justify-center text-xs font-black"
                style={{ backgroundColor: "#3b82f6", color: "white" }}
              >
                1u
              </div>
            ))}
          </div>
        </div>
      </div>
      {hint && <p className="text-blue-300 text-xs italic">{hint}</p>}
    </div>
  );
}

function BeforeAfterModel({ question }: BarModelProps) {
  const hint = question.bar_model_hint ?? "";
  return (
    <div className="space-y-3">
      <p className="text-xs font-bold uppercase tracking-wider" style={{ color: GOLD }}>
        Bar Model, Before / After
      </p>
      <div className="space-y-2">
        <div>
          <div className="text-xs text-blue-300 mb-1">Before:</div>
          <div
            className="h-9 rounded-lg flex items-center justify-center text-xs font-black"
            style={{ backgroundColor: "#1d4ed8", color: "white", border: `2px solid ${GOLD}40` }}
          >
            Starting amount
          </div>
        </div>
        <div className="flex items-center justify-center text-yellow-400 text-sm font-bold">↓ change happens ↓</div>
        <div>
          <div className="text-xs text-blue-300 mb-1">After:</div>
          <div className="flex h-9 rounded-lg overflow-hidden" style={{ border: `2px solid ${GOLD}40` }}>
            <div
              className="flex-1 flex items-center justify-center text-xs font-black"
              style={{ backgroundColor: "#1e40af", color: "white" }}
            >
              Known part
            </div>
            <div
              className="flex-[0.5] flex items-center justify-center text-xs font-black"
              style={{ backgroundColor: GOLD + "30", color: GOLD, border: `2px dashed ${GOLD}` }}
            >
              ???
            </div>
          </div>
        </div>
      </div>
      {hint && <p className="text-blue-300 text-xs italic">{hint}</p>}
    </div>
  );
}

// ─── Strategy reference card ─────────────────────────────────────────────────

function StrategyCard({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  return (
    <div
      className="rounded-2xl mb-4 overflow-hidden"
      style={{ backgroundColor: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)" }}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-3 text-left"
      >
        <span className="text-white font-black text-sm">Word Problem Strategy</span>
        <span className="text-blue-300 text-xs">{collapsed ? "Show ▾" : "Hide ▴"}</span>
      </button>
      {!collapsed && (
        <div className="px-4 pb-4 space-y-2">
          {[
            { n: 1, step: "Read the whole problem" },
            { n: 2, step: "Circle the numbers and units" },
            { n: 3, step: 'Ask: "What do I need to find?"' },
            { n: 4, step: "Draw a bar model" },
            { n: 5, step: "Write the equation" },
            { n: 6, step: "Solve & check" },
          ].map(({ n, step }) => (
            <div key={n} className="flex items-start gap-3">
              <span
                className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-black"
                style={{ backgroundColor: GOLD, color: NAVY }}
              >
                {n}
              </span>
              <span className="text-blue-100 text-sm">{step}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Scaffolded mode ──────────────────────────────────────────────────────────

type ScaffoldStep = 1 | 2 | 3 | 4 | 5;

interface ScaffoldedModeProps {
  questions: SingaporeQuestion[];
  onComplete: () => void;
  onBack: () => void;
}

function ScaffoldedMode({ questions, onComplete, onBack }: ScaffoldedModeProps) {
  const [qIndex, setQIndex] = useState(0);
  const [step, setStep] = useState<ScaffoldStep>(1);
  const [step3Choice, setStep3Choice] = useState<number | null>(null);
  const [step5Answer, setStep5Answer] = useState<number | null>(null);
  const [showSolution, setShowSolution] = useState(false);
  const [strategyCollapsed, setStrategyCollapsed] = useState(true);
  const [completedCount, setCompletedCount] = useState(0);

  const q = questions[qIndex];
  if (!q) return null;

  // Step 3 distractors: show the correct choice + 2 plausible wrong ones
  // We use the question's own choices but rephrase them as "what are we finding"
  const step3Options = [
    q.choices[q.correct_index],
    ...q.choices.filter((_, i) => i !== q.correct_index).slice(0, 2),
  ].sort(() => Math.random() - 0.5);

  function nextStep() {
    if (step < 5) {
      setStep((s) => (s + 1) as ScaffoldStep);
    }
  }

  function handleStep3Select(idx: number) {
    setStep3Choice(idx);
  }

  function handleStep5Select(idx: number) {
    setStep5Answer(idx);
    setShowSolution(true);
  }

  function nextQuestion() {
    const newCount = completedCount + 1;
    setCompletedCount(newCount);

    // Save to localStorage
    const prev = loadScaffoldedCount();
    saveScaffoldedCount(prev + 1);

    if (qIndex + 1 >= questions.length || newCount >= 5) {
      onComplete();
    } else {
      setQIndex((i) => i + 1);
      setStep(1);
      setStep3Choice(null);
      setStep5Answer(null);
      setShowSolution(false);
    }
  }

  const isStep3Correct = step3Choice !== null && step3Options[step3Choice] === q.choices[q.correct_index];
  const isStep5Correct = step5Answer !== null && step5Answer === q.correct_index;

  return (
    <div
      className="min-h-screen px-4 py-6 max-w-lg md:max-w-2xl mx-auto"
      style={{ background: "linear-gradient(160deg, #1b3a6b 0%, #0f2547 100%)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={onBack} className="text-blue-300 text-sm font-bold hover:text-white">
          ← Back
        </button>
        <div className="text-center">
          <p className="text-white font-black text-sm">Learn the Strategy</p>
          <p className="text-blue-400 text-xs">Problem {qIndex + 1} of {Math.min(questions.length, 5)}</p>
        </div>
        <div
          className="text-xs font-black px-2 py-1 rounded-full"
          style={{ backgroundColor: GOLD + "22", color: GOLD }}
        >
          Step {step}/5
        </div>
      </div>

      <StrategyCard collapsed={strategyCollapsed} onToggle={() => setStrategyCollapsed((c) => !c)} />

      {/* Step progress dots */}
      <div className="flex gap-2 justify-center mb-5">
        {([1, 2, 3, 4, 5] as ScaffoldStep[]).map((s) => (
          <div
            key={s}
            className="w-3 h-3 rounded-full transition-all"
            style={{
              backgroundColor: s < step ? "#22c55e" : s === step ? GOLD : "rgba(255,255,255,0.15)",
            }}
          />
        ))}
      </div>

      {/* ── STEP 1: READ ─────────────────────────────────────────────── */}
      {step === 1 && (
        <div className="space-y-4">
          <div
            className="rounded-2xl p-3 text-center"
            style={{ backgroundColor: GOLD + "22", color: GOLD }}
          >
            <p className="font-black text-sm">Step 1, Read the Problem</p>
          </div>
          <div
            className="rounded-2xl p-5"
            style={{ backgroundColor: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.10)" }}
          >
            <p className="text-white text-base leading-relaxed">{q.text}</p>
          </div>
          <button
            onClick={nextStep}
            className="w-full py-4 rounded-2xl font-black text-navy text-base shadow-lg hover:opacity-90 active:scale-95"
            style={{ backgroundColor: GOLD }}
          >
            I've read it →
          </button>
        </div>
      )}

      {/* ── STEP 2: FIND THE FACTS ────────────────────────────────────── */}
      {step === 2 && (
        <div className="space-y-4">
          <div
            className="rounded-2xl p-3 text-center"
            style={{ backgroundColor: GOLD + "22", color: GOLD }}
          >
            <p className="font-black text-sm">Step 2, Find the Facts</p>
          </div>
          <div
            className="rounded-2xl p-5"
            style={{ backgroundColor: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.10)" }}
          >
            <p className="text-blue-300 text-xs font-bold uppercase tracking-wider mb-2">The problem:</p>
            <p className="text-white text-sm leading-relaxed mb-4">{q.text}</p>
            <div
              className="rounded-xl p-3"
              style={{ backgroundColor: GOLD + "18", border: `1px solid ${GOLD}40` }}
            >
              <p className="font-black text-xs uppercase tracking-wider mb-2" style={{ color: GOLD }}>
                I know:
              </p>
              {/* Show the known numbers from the solution steps */}
              {q.solution_steps.slice(0, 2).map((s, i) => (
                <p key={i} className="text-blue-100 text-sm font-bold">
                  {i === 0 ? "→ " : "AND "}{s}
                </p>
              ))}
            </div>
          </div>
          <button
            onClick={nextStep}
            className="w-full py-4 rounded-2xl font-black text-navy text-base shadow-lg hover:opacity-90 active:scale-95"
            style={{ backgroundColor: GOLD }}
          >
            I found the facts →
          </button>
        </div>
      )}

      {/* ── STEP 3: WHAT ARE WE SOLVING? ─────────────────────────────── */}
      {step === 3 && (
        <div className="space-y-4">
          <div
            className="rounded-2xl p-3 text-center"
            style={{ backgroundColor: GOLD + "22", color: GOLD }}
          >
            <p className="font-black text-sm">Step 3, What Are We Solving?</p>
          </div>
          <div
            className="rounded-2xl p-4"
            style={{ backgroundColor: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.10)" }}
          >
            <p className="text-blue-200 text-sm mb-4">
              We need to find: <span className="text-white font-black">___</span>
            </p>
            <p className="text-blue-300 text-xs font-bold uppercase mb-3">Pick the right answer:</p>
            <div className="space-y-2">
              {step3Options.map((opt, i) => {
                let bg = "rgba(255,255,255,0.07)";
                let border = "1px solid rgba(255,255,255,0.12)";
                let textC = "white";
                if (step3Choice !== null) {
                  const isThis = step3Options[step3Choice] === opt;
                  const isCorrectOpt = opt === q.choices[q.correct_index];
                  if (isThis && isCorrectOpt) { bg = "rgba(34,197,94,0.20)"; border = "1px solid #22c55e"; }
                  else if (isThis) { bg = "rgba(239,68,68,0.20)"; border = "1px solid #ef4444"; }
                  else if (isCorrectOpt && step3Choice !== null) { bg = "rgba(34,197,94,0.12)"; border = "1px solid #22c55e40"; }
                }
                return (
                  <button
                    key={i}
                    onClick={() => handleStep3Select(i)}
                    disabled={step3Choice !== null}
                    className="w-full text-left px-4 py-3 rounded-xl font-bold text-sm transition-all"
                    style={{ backgroundColor: bg, border, color: textC }}
                  >
                    {step3Choice !== null && opt === q.choices[q.correct_index] && "✅ "}
                    {step3Choice !== null && step3Options[step3Choice] === opt && opt !== q.choices[q.correct_index] && "❌ "}
                    {opt}
                  </button>
                );
              })}
            </div>
            {step3Choice !== null && (
              <p
                className="mt-3 text-sm font-bold"
                style={{ color: isStep3Correct ? "#22c55e" : "#f59e0b" }}
              >
                {isStep3Correct
                  ? "Exactly right!"
                  : `The answer we're looking for is: ${q.choices[q.correct_index]}`}
              </p>
            )}
          </div>
          {step3Choice !== null && (
            <button
              onClick={nextStep}
              className="w-full py-4 rounded-2xl font-black text-navy text-base shadow-lg hover:opacity-90 active:scale-95"
              style={{ backgroundColor: GOLD }}
            >
              Got it →
            </button>
          )}
        </div>
      )}

      {/* ── STEP 4: BAR MODEL ────────────────────────────────────────── */}
      {step === 4 && (
        <div className="space-y-4">
          <div
            className="rounded-2xl p-3 text-center"
            style={{ backgroundColor: GOLD + "22", color: GOLD }}
          >
            <p className="font-black text-sm">Step 4, Draw a Bar Model</p>
          </div>
          <div
            className="rounded-2xl p-5"
            style={{ backgroundColor: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.10)" }}
          >
            <BarModel question={q} />
          </div>
          <button
            onClick={nextStep}
            className="w-full py-4 rounded-2xl font-black text-navy text-base shadow-lg hover:opacity-90 active:scale-95"
            style={{ backgroundColor: GOLD }}
          >
            I understand the model →
          </button>
        </div>
      )}

      {/* ── STEP 5: SOLVE ────────────────────────────────────────────── */}
      {step === 5 && (
        <div className="space-y-4">
          <div
            className="rounded-2xl p-3 text-center"
            style={{ backgroundColor: GOLD + "22", color: GOLD }}
          >
            <p className="font-black text-sm">Step 5, Solve It!</p>
          </div>

          {/* Equation hint from solution_steps[0] */}
          <div
            className="rounded-2xl p-4"
            style={{ backgroundColor: "rgba(255,255,255,0.06)", border: `1px solid ${GOLD}30` }}
          >
            <p className="text-blue-300 text-xs font-bold uppercase mb-2">The equation:</p>
            <p className="text-white font-black text-base">{q.solution_steps[0]}</p>
          </div>

          {/* Answer choices */}
          <div className="grid grid-cols-2 gap-3">
            {q.choices.map((choice, i) => {
              let bg = "rgba(255,255,255,0.07)";
              let border = "1px solid rgba(255,255,255,0.12)";
              let textC = "white";
              if (step5Answer !== null) {
                const selected = step5Answer === i;
                const correct = i === q.correct_index;
                if (selected && correct) { bg = "rgba(34,197,94,0.22)"; border = "2px solid #22c55e"; }
                else if (selected) { bg = "rgba(239,68,68,0.22)"; border = "2px solid #ef4444"; }
                else if (correct) { bg = "rgba(34,197,94,0.12)"; border = "2px solid #22c55e50"; }
              }
              return (
                <button
                  key={i}
                  onClick={() => handleStep5Select(i)}
                  disabled={step5Answer !== null}
                  className="py-4 rounded-2xl font-black text-lg transition-all active:scale-95"
                  style={{ backgroundColor: bg, border, color: textC }}
                >
                  {step5Answer !== null && i === q.correct_index && "✅ "}
                  {step5Answer !== null && step5Answer === i && i !== q.correct_index && "❌ "}
                  {choice}
                </button>
              );
            })}
          </div>

          {/* Full solution walkthrough */}
          {showSolution && (
            <div
              className="rounded-2xl p-4"
              style={{
                backgroundColor: isStep5Correct ? "rgba(34,197,94,0.12)" : "rgba(245,197,24,0.10)",
                border: `1px solid ${isStep5Correct ? "#22c55e50" : GOLD + "50"}`,
              }}
            >
              <p
                className="font-black text-sm mb-3"
                style={{ color: isStep5Correct ? "#22c55e" : GOLD }}
              >
                {isStep5Correct ? "Correct! Here's the full solution:" : "Here's how to solve it step by step:"}
              </p>
              <div className="space-y-1">
                {q.solution_steps.map((step, i) => (
                  <div key={i} className="flex gap-2">
                    <span className="text-blue-400 text-xs font-bold flex-shrink-0 mt-0.5">
                      {i + 1}.
                    </span>
                    <p className="text-blue-100 text-sm">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {showSolution && (
            <button
              onClick={nextQuestion}
              className="w-full py-4 rounded-2xl font-black text-navy text-base shadow-lg hover:opacity-90 active:scale-95"
              style={{ backgroundColor: GOLD }}
            >
              {qIndex + 1 >= Math.min(questions.length, 5) ? "Finish session! 🎉" : "Next problem →"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Timed challenge mode ─────────────────────────────────────────────────────

interface TimedModeProps {
  questions: SingaporeQuestion[];
  onBack: () => void;
}

function TimedMode({ questions, onBack }: TimedModeProps) {
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [phase, setPhase] = useState<"playing" | "feedback" | "done">("playing");
  const [timer, setTimer] = useState(TIMED_SECONDS);
  const [correct, setCorrect] = useState(0);
  const [strategyCollapsed, setStrategyCollapsed] = useState(true);

  const q = questions[qIndex];

  useEffect(() => {
    if (phase !== "playing") return;
    setTimer(TIMED_SECONDS);
    const id = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) {
          clearInterval(id);
          setPhase("feedback");
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [phase, qIndex]);

  function handleAnswer(i: number) {
    if (phase !== "playing") return;
    setSelected(i);
    if (i === q.correct_index) setCorrect((c) => c + 1);
    setPhase("feedback");
  }

  function handleNext() {
    if (qIndex + 1 >= questions.length) {
      setPhase("done");
    } else {
      setQIndex((i) => i + 1);
      setSelected(null);
      setPhase("playing");
    }
  }

  const timerPct = (timer / TIMED_SECONDS) * 100;
  const timerColor = timer <= 15 ? "#ef4444" : timer <= 30 ? "#f97316" : "#22c55e";

  if (phase === "done") {
    const pct = Math.round((correct / questions.length) * 100);
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center px-6 py-12 text-center"
        style={{ background: "linear-gradient(160deg, #1b3a6b 0%, #0f2547 100%)" }}
      >
        <div className="text-8xl mb-4 animate-bounce">
          {pct >= 80 ? "🏆" : pct >= 60 ? "⭐" : "💪"}
        </div>
        <h1 className="text-4xl font-black text-white mb-2">
          {pct >= 80 ? "Excellent!" : pct >= 60 ? "Good work!" : "Keep practicing!"}
        </h1>
        <p className="text-4xl font-black mb-6" style={{ color: GOLD }}>{pct}%</p>
        <p className="text-blue-200 mb-8">
          {correct}/{questions.length} word problems correct, no hints!
        </p>
        <button
          onClick={onBack}
          className="w-full py-4 rounded-2xl font-black text-navy text-base max-w-xs"
          style={{ backgroundColor: GOLD }}
        >
          Back to Workshop
        </button>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen px-4 py-6 max-w-lg md:max-w-2xl mx-auto"
      style={{ background: "linear-gradient(160deg, #1b3a6b 0%, #0f2547 100%)" }}
    >
      <div className="flex items-center justify-between mb-4">
        <button onClick={onBack} className="text-blue-300 text-sm font-bold hover:text-white">
          ← Back
        </button>
        <p className="text-white font-black text-sm">
          {qIndex + 1}/{questions.length}, Timed Challenge
        </p>
        <span className="font-black text-lg" style={{ color: timerColor }}>
          {timer}s
        </span>
      </div>

      {/* Timer bar */}
      <div className="bg-blue-900 rounded-full h-3 mb-4 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000"
          style={{ width: `${timerPct}%`, backgroundColor: timerColor }}
        />
      </div>

      <StrategyCard collapsed={strategyCollapsed} onToggle={() => setStrategyCollapsed((c) => !c)} />

      {/* Question */}
      <div
        className="rounded-2xl p-5 mb-5"
        style={{ backgroundColor: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)" }}
      >
        <p className="text-white text-base leading-relaxed">{q.text}</p>
      </div>

      {/* Choices */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {q.choices.map((choice, i) => {
          let bg = "rgba(255,255,255,0.07)";
          let border = "1px solid rgba(255,255,255,0.12)";
          let textC = "white";
          if (phase === "feedback") {
            if (i === q.correct_index) { bg = "rgba(34,197,94,0.22)"; border = "2px solid #22c55e"; }
            else if (i === selected) { bg = "rgba(239,68,68,0.22)"; border = "2px solid #ef4444"; }
          }
          return (
            <button
              key={i}
              onClick={() => handleAnswer(i)}
              disabled={phase === "feedback"}
              className="py-4 px-3 rounded-2xl font-bold text-sm transition-all active:scale-95"
              style={{ backgroundColor: bg, border, color: textC }}
            >
              {phase === "feedback" && i === q.correct_index && "✅ "}
              {phase === "feedback" && i === selected && i !== q.correct_index && "❌ "}
              {choice}
            </button>
          );
        })}
      </div>

      {phase === "feedback" && (
        <button
          onClick={handleNext}
          className="w-full py-4 rounded-2xl font-black text-navy text-base"
          style={{ backgroundColor: GOLD }}
        >
          {qIndex + 1 >= questions.length ? "See results! 🏆" : "Next →"}
        </button>
      )}
    </div>
  );
}

// ─── Hub (main view) ──────────────────────────────────────────────────────────

type Mode = "hub" | "scaffolded" | "timed";

export default function WordProblemWorkshop({ onBack }: { onBack?: () => void }) {
  const [mode, setMode] = useState<Mode>("hub");
  const [scaffoldedCount, setScaffoldedCount] = useState(0);
  const [strategyCollapsed, setStrategyCollapsed] = useState(true);

  // Load all word problem questions
  const wpQuestions = getQuestionsByTopic("wordproblems").slice(0, 10);
  const timedUnlocked = scaffoldedCount >= SCAFFOLDED_REQUIRED;

  useEffect(() => {
    setScaffoldedCount(loadScaffoldedCount());
  }, []);

  function handleScaffoldedComplete() {
    const newCount = loadScaffoldedCount(); // re-read after saves inside ScaffoldedMode
    setScaffoldedCount(newCount);
    setMode("hub");
  }

  if (mode === "scaffolded") {
    return (
      <ScaffoldedMode
        questions={wpQuestions}
        onComplete={handleScaffoldedComplete}
        onBack={() => setMode("hub")}
      />
    );
  }

  if (mode === "timed") {
    return <TimedMode questions={wpQuestions} onBack={() => setMode("hub")} />;
  }

  // ── Hub view ───────────────────────────────────────────────────────────────
  return (
    <div
      className="min-h-screen px-4 py-6 max-w-lg md:max-w-2xl mx-auto"
      style={{ background: "linear-gradient(160deg, #1b3a6b 0%, #0f2547 100%)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-blue-200 text-xs font-bold uppercase tracking-wider">
            Word Problem Workshop
          </p>
          <h1 className="text-white font-black text-2xl">Strategy Practice</h1>
        </div>
        {onBack && (
          <button
            onClick={onBack}
            className="text-blue-300 text-sm font-bold hover:text-white"
          >
            ← Back
          </button>
        )}
      </div>

      <StrategyCard collapsed={strategyCollapsed} onToggle={() => setStrategyCollapsed((c) => !c)} />

      {/* Progress indicator */}
      <div
        className="rounded-2xl p-4 mb-5"
        style={{ backgroundColor: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
      >
        <div className="flex items-center justify-between mb-2">
          <p className="text-blue-200 text-xs font-bold uppercase tracking-wider">
            Scaffolded completions
          </p>
          <p className="text-white font-black text-sm">
            {scaffoldedCount}/{SCAFFOLDED_REQUIRED}
          </p>
        </div>
        <div className="bg-blue-950 rounded-full h-3 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${Math.min(100, (scaffoldedCount / SCAFFOLDED_REQUIRED) * 100)}%`,
              backgroundColor: timedUnlocked ? "#22c55e" : GOLD,
            }}
          />
        </div>
        {!timedUnlocked && (
          <p className="text-blue-400 text-xs mt-2">
            {SCAFFOLDED_REQUIRED - scaffoldedCount} more to unlock Timed Challenge
          </p>
        )}
        {timedUnlocked && (
          <p className="text-green-400 text-xs mt-2 font-bold">
            Timed Challenge unlocked!
          </p>
        )}
      </div>

      {/* START HERE card, prominent if not yet completed scaffolded */}
      <button
        onClick={() => setMode("scaffolded")}
        className="w-full rounded-2xl p-5 mb-4 flex items-center gap-4 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl"
        style={{
          background: !timedUnlocked
            ? `linear-gradient(135deg, ${GOLD}, #c49b0f)`
            : "rgba(255,255,255,0.07)",
          border: timedUnlocked ? "1px solid rgba(255,255,255,0.10)" : "none",
        }}
      >
        <div className="text-4xl">📐</div>
        <div className="text-left flex-1">
          <div className="flex items-center gap-2">
            <p
              className="font-black text-lg"
              style={{ color: !timedUnlocked ? NAVY : "white" }}
            >
              Learn the Strategy
            </p>
            {!timedUnlocked && (
              <span
                className="text-xs font-black px-2 py-0.5 rounded-full"
                style={{ backgroundColor: NAVY, color: GOLD }}
              >
                START HERE
              </span>
            )}
          </div>
          <p
            className="text-sm"
            style={{ color: !timedUnlocked ? NAVY + "cc" : "#93c5fd" }}
          >
            5 guided steps · bar models · full solutions
          </p>
        </div>
        <div
          className="text-2xl"
          style={{ color: !timedUnlocked ? NAVY + "aa" : "rgba(255,255,255,0.5)" }}
        >
          →
        </div>
      </button>

      {/* Timed challenge */}
      <button
        onClick={() => timedUnlocked && setMode("timed")}
        disabled={!timedUnlocked}
        className="w-full rounded-2xl p-5 flex items-center gap-4 transition-all shadow-xl"
        style={{
          background: timedUnlocked
            ? `linear-gradient(135deg, #c93030, #8b1a1a)`
            : "rgba(255,255,255,0.04)",
          opacity: timedUnlocked ? 1 : 0.5,
          cursor: timedUnlocked ? "pointer" : "not-allowed",
          border: timedUnlocked ? "none" : "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div className="text-4xl">{timedUnlocked ? "⏱️" : "🔒"}</div>
        <div className="text-left flex-1">
          <p className="text-white font-black text-lg">Timed Challenge</p>
          <p className="text-red-200 text-sm">
            {timedUnlocked
              ? "90 seconds per problem · no hints"
              : `Complete ${SCAFFOLDED_REQUIRED} guided problems first`}
          </p>
        </div>
        <div className="text-white/50 text-2xl">→</div>
      </button>

      {/* Topic list */}
      <div className="mt-6">
        <p className="text-blue-300 text-xs font-bold uppercase tracking-wider mb-3">
          Problems covered
        </p>
        <div className="flex flex-wrap gap-2">
          {["Part-whole", "Ratio comparison", "Percentage", "Before-after", "Multi-step"].map((t) => (
            <span
              key={t}
              className="text-xs font-bold px-3 py-1 rounded-full"
              style={{ backgroundColor: "rgba(255,255,255,0.08)", color: "#93c5fd" }}
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
