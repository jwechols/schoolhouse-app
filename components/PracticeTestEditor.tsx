"use client";

import { useEffect, useMemo, useState } from "react";
import { coursesForKidRaw } from "@/lib/curriculum-spine";
import {
  fetchPracticeTests,
  savePracticeTest,
  deletePracticeTest,
  type PracticeTest,
  type PracticeQuestion,
} from "@/lib/practice-tests";

// ── Briana's practice test builder ────────────────────────────────────────────
// Assembled multiple-choice tests (math and anything else), assigned per kid,
// with an optional due date. Same visual language and PIN-gated save pattern
// as WordListEditor. Questions reuse the same shape lessons already use.

const KIDS: { id: string; name: string; emoji: string; color: string }[] = [
  { id: "titus", name: "Titus", emoji: "🎣", color: "#2563eb" },
  { id: "mercy", name: "Mercy", emoji: "🌸", color: "#D4508A" },
  { id: "lois", name: "Lois", emoji: "👑", color: "#C026D3" },
  { id: "truma", name: "Truma", emoji: "🪻", color: "#0BABB9" },
];

function blankQuestion(): PracticeQuestion {
  return { prompt: "", choices: ["", ""], correctIndex: 0, explanation: "" };
}

interface Draft {
  id?: string;
  title: string;
  dueDate: string;
  questions: PracticeQuestion[];
}

function blankDraft(): Draft {
  return { title: "", dueDate: "", questions: [blankQuestion()] };
}

function draftFromTest(t: PracticeTest): Draft {
  return { id: t.id, title: t.title, dueDate: t.dueDate ?? "", questions: t.questions.length ? t.questions : [blankQuestion()] };
}

export default function PracticeTestEditor() {
  const [kid, setKid] = useState("titus");
  const [subject, setSubject] = useState("");
  const [tests, setTests] = useState<PracticeTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Draft | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");

  const kidMeta = KIDS.find((k) => k.id === kid)!;
  const courses = useMemo(() => coursesForKidRaw(kid), [kid]);

  useEffect(() => {
    setSubject(courses[0]?.subject ?? "");
  }, [kid, courses]);

  async function reload() {
    setLoading(true);
    const rows = await fetchPracticeTests({ kidId: kid });
    setTests(rows);
    setLoading(false);
  }

  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kid]);

  const visible = useMemo(() => tests.filter((t) => t.subject === subject), [tests, subject]);

  function flash(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  }

  function openNew() {
    setEditing(blankDraft());
  }

  function openEdit(t: PracticeTest) {
    setEditing(draftFromTest(t));
  }

  function set<K extends keyof Draft>(k: K, v: Draft[K]) {
    if (!editing) return;
    setEditing({ ...editing, [k]: v });
  }

  function addQuestion() {
    if (!editing) return;
    set("questions", [...editing.questions, blankQuestion()]);
  }
  function updateQuestion(i: number, q: PracticeQuestion) {
    if (!editing) return;
    set("questions", editing.questions.map((old, idx) => (idx === i ? q : old)));
  }
  function removeQuestion(i: number) {
    if (!editing) return;
    const qs = editing.questions.filter((_, idx) => idx !== i);
    set("questions", qs.length ? qs : [blankQuestion()]);
  }

  async function save() {
    if (!editing || !subject) return;
    const questions = editing.questions.filter((q) => q.prompt.trim() && q.choices.filter((c) => c.trim()).length >= 2);
    if (!editing.title.trim() || questions.length === 0) {
      flash("Give it a title and at least one complete question.");
      return;
    }
    setSaving(true);
    const res = await savePracticeTest({
      id: editing.id,
      kidId: kid,
      subject,
      title: editing.title.trim(),
      questions,
      dueDate: editing.dueDate || null,
      active: true,
    });
    setSaving(false);
    if (!res.ok) {
      flash(res.error || "Could not save.");
      return;
    }
    flash("Saved and assigned.");
    setEditing(null);
    reload();
  }

  async function toggleActive(t: PracticeTest) {
    const res = await savePracticeTest({
      id: t.id,
      kidId: t.kidId,
      subject: t.subject,
      title: t.title,
      questions: t.questions,
      dueDate: t.dueDate,
      active: !t.active,
    });
    if (res.ok) reload();
  }

  async function remove(id: string) {
    const res = await deletePracticeTest(id);
    if (res.ok) {
      flash("Deleted.");
      setEditing(null);
      reload();
    } else {
      flash(res.error || "Could not delete.");
    }
  }

  return (
    <main className="min-h-screen px-4 py-6" style={{ background: "#f5f0e6", color: "#171411" }}>
      <div className="mx-auto w-full max-w-2xl">
        <a href="/parent" className="text-sm" style={{ color: "#6b7280" }}>
          ← Parent dashboard
        </a>
        <h1 className="mt-1 text-3xl font-black" style={{ fontFamily: "Georgia, serif" }}>
          Practice Tests
        </h1>
        <p className="mt-1 text-sm" style={{ color: "#5c5b4a" }}>
          Assemble a scored multiple-choice test (math or anything else) and assign it to a kid.
        </p>

        {/* Kid picker */}
        <div className="mt-5 flex flex-wrap gap-2">
          {KIDS.map((k) => (
            <button
              key={k.id}
              onClick={() => setKid(k.id)}
              className="rounded-full px-4 py-2 text-sm font-bold active:scale-95 transition-transform"
              style={{ background: kid === k.id ? k.color : "#fff", color: kid === k.id ? "#fff" : "#171411", border: `2px solid ${k.color}` }}
            >
              {k.emoji} {k.name}
            </button>
          ))}
        </div>

        {/* Subject picker */}
        <div className="mt-3 flex flex-wrap gap-2">
          {courses.map((c) => (
            <button
              key={c.subject}
              onClick={() => setSubject(c.subject)}
              className="rounded-full px-3 py-1.5 text-sm font-medium active:scale-95 transition-transform"
              style={{ background: subject === c.subject ? "#171411" : "#fff", color: subject === c.subject ? "#fff" : "#171411", border: "2px solid #e5decf" }}
            >
              {c.emoji} {c.subjectLabel}
            </button>
          ))}
        </div>

        {loading && <p className="mt-6 text-sm text-gray-500">Loading&hellip;</p>}

        <div className="mt-6 space-y-3">
          {visible.map((t) => (
            <button
              key={t.id}
              onClick={() => openEdit(t)}
              className="w-full rounded-2xl p-4 text-left active:scale-[0.99] transition-transform"
              style={{ background: "#fff", border: `2px solid ${t.active ? kidMeta.color : "#e5decf"}`, opacity: t.active ? 1 : 0.6 }}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold" style={{ color: "#171411" }}>{t.title}</span>
                <span className="text-xs font-bold uppercase tracking-wide" style={{ color: t.active ? kidMeta.color : "#9ca3af" }}>
                  {t.active ? "Assigned" : "Paused"}
                </span>
              </div>
              <p className="mt-1 text-xs" style={{ color: "#5c5b4a" }}>
                {t.questions.length} question{t.questions.length === 1 ? "" : "s"}{t.dueDate ? ` · due ${t.dueDate}` : ""}
              </p>
            </button>
          ))}
          {!loading && visible.length === 0 && (
            <p className="text-sm" style={{ color: "#5c5b4a" }}>No practice tests for this subject yet.</p>
          )}
        </div>

        <button
          onClick={openNew}
          disabled={!subject}
          className="mt-4 w-full rounded-full px-4 py-3 text-sm font-black active:scale-95 transition-transform disabled:opacity-50"
          style={{ background: kidMeta.color, color: "#fff" }}
        >
          + New practice test for {kidMeta.name}
        </button>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" style={{ background: "rgba(0,0,0,0.4)" }} onClick={() => setEditing(null)}>
          <div className="w-full sm:max-w-2xl max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl p-5" style={{ background: "#fff" }} onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black" style={{ fontFamily: "Georgia, serif" }}>{editing.id ? "Edit test" : "New test"}</h2>
              <button onClick={() => setEditing(null)} className="text-2xl leading-none" style={{ color: "#9ca3af" }}>×</button>
            </div>

            <label className="mt-3 block">
              <span className="text-xs font-bold" style={{ color: "#5c5b4a" }}>Title</span>
              <input className="tf-input" placeholder="e.g. Multiplication facts through 12s" value={editing.title} onChange={(e) => set("title", e.target.value)} />
            </label>

            <label className="mt-3 block">
              <span className="text-xs font-bold" style={{ color: "#5c5b4a" }}>Due date (optional)</span>
              <input type="date" className="tf-input" value={editing.dueDate} onChange={(e) => set("dueDate", e.target.value)} />
            </label>

            <div className="mt-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold">Questions</p>
                <button onClick={addQuestion} className="rounded-full px-3 py-1 text-xs font-bold" style={{ background: kidMeta.color, color: "#fff" }}>+ Question</button>
              </div>
              {editing.questions.map((q, i) => (
                <div key={i} className="mt-3 rounded-xl p-3" style={{ background: "#faf7f0", border: "1px solid #ece5d6" }}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold" style={{ color: "#5c5b4a" }}>Question {i + 1}</span>
                    <button onClick={() => removeQuestion(i)} className="text-xs font-bold" style={{ color: "#991b1b" }}>Remove</button>
                  </div>
                  <input className="tf-input" placeholder="Question" value={q.prompt} onChange={(e) => updateQuestion(i, { ...q, prompt: e.target.value })} />
                  <p className="mt-2 text-[11px] font-bold" style={{ color: "#5c5b4a" }}>Answer choices (tap the circle to mark correct)</p>
                  {q.choices.map((c, ci) => (
                    <div key={ci} className="mt-1 flex items-center gap-2">
                      <button
                        onClick={() => updateQuestion(i, { ...q, correctIndex: ci })}
                        aria-label="Mark correct"
                        className="h-5 w-5 flex-shrink-0 rounded-full"
                        style={{ border: "2px solid #16a34a", background: q.correctIndex === ci ? "#16a34a" : "transparent" }}
                      />
                      <input
                        className="tf-input"
                        style={{ marginTop: 0 }}
                        placeholder={`Choice ${ci + 1}`}
                        value={c}
                        onChange={(e) => updateQuestion(i, { ...q, choices: q.choices.map((x, xi) => (xi === ci ? e.target.value : x)) })}
                      />
                      {q.choices.length > 2 && (
                        <button
                          onClick={() => updateQuestion(i, { ...q, choices: q.choices.filter((_, xi) => xi !== ci), correctIndex: Math.min(q.correctIndex, q.choices.length - 2) })}
                          className="text-lg"
                          style={{ color: "#9ca3af" }}
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                  {q.choices.length < 4 && (
                    <button onClick={() => updateQuestion(i, { ...q, choices: [...q.choices, ""] })} className="mt-1 text-xs font-bold" style={{ color: "#6b7280" }}>
                      + Add choice
                    </button>
                  )}
                  <input
                    className="tf-input"
                    placeholder="Explanation shown after they answer (optional)"
                    value={q.explanation ?? ""}
                    onChange={(e) => updateQuestion(i, { ...q, explanation: e.target.value })}
                  />
                </div>
              ))}
            </div>

            <div className="mt-5 flex items-center gap-3">
              <button onClick={save} disabled={saving} className="flex-1 rounded-full px-5 py-3 text-sm font-black active:scale-95 transition-transform disabled:opacity-50" style={{ background: kidMeta.color, color: "#fff" }}>
                {saving ? "Saving…" : "Save & assign"}
              </button>
              {editing.id && (
                <button onClick={() => remove(editing.id!)} className="rounded-full px-4 py-3 text-sm font-bold" style={{ background: "#f3f4f6", color: "#991b1b" }}>
                  Delete
                </button>
              )}
            </div>
            {editing.id && (
              <button
                onClick={() => {
                  const t = tests.find((x) => x.id === editing.id);
                  if (t) toggleActive(t);
                  setEditing(null);
                }}
                className="mt-2 w-full rounded-full px-4 py-2 text-xs font-bold"
                style={{ background: "#f3f4f6", color: "#5c5b4a" }}
              >
                {tests.find((x) => x.id === editing.id)?.active ? "Pause (hide from kid)" : "Resume (show to kid)"}
              </button>
            )}
          </div>

          <style>{`
            .tf-input { width: 100%; margin-top: 8px; border: 1.5px solid #e5decf; border-radius: 12px; padding: 10px 12px; font-size: 15px; color: #171411; background: #faf7f0; outline: none; }
            .tf-input:focus { border-color: ${kidMeta.color}; background: #fff; }
          `}</style>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 rounded-full px-5 py-2.5 text-sm font-bold shadow-lg" style={{ background: "#171411", color: "#fff" }}>
          {toast}
        </div>
      )}
    </main>
  );
}
