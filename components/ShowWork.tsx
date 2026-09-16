"use client";

import { useState } from "react";

interface ShowWorkProps {
  problem: string;
  steps: string[];
  answer: string;
  colorHex?: string;
  onClose?: () => void;
}

export default function ShowWork({
  problem,
  steps,
  answer,
  colorHex = "#1b3a6b",
  onClose,
}: ShowWorkProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const allStepsShown = currentStep >= steps.length;

  function handleNext() {
    if (currentStep < steps.length) {
      setCurrentStep((s) => s + 1);
    }
  }

  const progressPct = steps.length > 0 ? Math.round((currentStep / steps.length) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div
        className="w-full max-w-lg rounded-3xl bg-white shadow-2xl flex flex-col overflow-hidden"
        style={{ maxHeight: "90vh" }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-5"
          style={{ borderBottom: `3px solid ${colorHex}` }}
        >
          <h2 className="font-black text-xl" style={{ color: colorHex }}>
            Let me show you how 📖
          </h2>
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-700 text-2xl font-bold leading-none transition-colors"
              aria-label="Close show work"
            >
              ×
            </button>
          )}
        </div>

        {/* Progress bar */}
        <div className="px-6 pt-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              {allStepsShown ? "All steps complete!" : `Step ${currentStep} of ${steps.length}`}
            </span>
            <span className="text-xs font-bold" style={{ color: colorHex }}>
              {progressPct}%
            </span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%`, backgroundColor: colorHex }}
            />
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-6 py-4 min-h-0">
          {/* Problem */}
          <div
            className="rounded-2xl p-4 mb-5"
            style={{ backgroundColor: colorHex + "0f", border: `1px solid ${colorHex}30` }}
          >
            <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: colorHex }}>
              Problem
            </p>
            <p className="text-gray-800 text-sm leading-relaxed font-medium">{problem}</p>
          </div>

          {/* Steps revealed so far */}
          <div className="flex flex-col gap-3 mb-4">
            {steps.slice(0, currentStep).map((step, i) => (
              <div
                key={i}
                className="flex items-start gap-3 rounded-2xl p-4 transition-all duration-300"
                style={{
                  backgroundColor: i === currentStep - 1 ? colorHex + "18" : "#f9fafb",
                  border: `2px solid ${i === currentStep - 1 ? colorHex : "transparent"}`,
                  animation: i === currentStep - 1 ? "slideIn 0.3s ease-out" : undefined,
                }}
              >
                <span
                  className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-black text-white"
                  style={{ backgroundColor: colorHex }}
                >
                  {i + 1}
                </span>
                <p className="text-gray-800 text-sm leading-relaxed">{step}</p>
              </div>
            ))}
          </div>

          {/* Final answer */}
          {allStepsShown && (
            <div
              className="rounded-2xl p-5 text-center"
              style={{ backgroundColor: colorHex, animation: "slideIn 0.4s ease-out" }}
            >
              <p className="text-white/80 text-xs font-bold uppercase tracking-wider mb-1">
                Final Answer
              </p>
              <p className="text-white font-black text-2xl">✓ {answer}</p>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div
          className="px-6 py-4 flex gap-3"
          style={{ borderTop: "1px solid #f3f4f6" }}
        >
          {!allStepsShown ? (
            <button
              onClick={handleNext}
              className="flex-1 py-4 rounded-2xl font-black text-white text-base transition-all hover:opacity-90 active:scale-[0.98]"
              style={{ backgroundColor: colorHex }}
            >
              Next Step →
            </button>
          ) : (
            <button
              onClick={() => {
                setCurrentStep(0);
                if (onClose) onClose();
              }}
              className="flex-1 py-4 rounded-2xl font-black text-white text-base transition-all hover:opacity-90 active:scale-[0.98]"
              style={{ backgroundColor: colorHex }}
            >
              Try a Similar Problem
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="py-4 px-5 rounded-2xl font-bold text-gray-500 text-sm hover:text-gray-700 transition-colors"
              style={{ backgroundColor: "#f3f4f6" }}
            >
              Close
            </button>
          )}
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
