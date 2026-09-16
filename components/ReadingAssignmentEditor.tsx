"use client";

import { useEffect, useMemo, useState } from "react";
import {
  fetchReadingAssignments,
  saveReadingAssignment,
  deleteReadingAssignment,
  type ReadingAssignment,
  type ReadingMethod,
} from "@/lib/reading-assignments";
import { reportLessonToHomeward, TIER_META } from "@/lib/homeward";
import type { PracticeQuestion } from "@/lib/practice-tests";

// ── Briana's reading assignment builder ───────────────────────────────────────
// A book, a check-in method, assigned per kid. Quiz method authors questions
// the same way practice tests do. The other three methods can't be verified by
// the app, so they land in an approval queue below once the kid marks ready.

const KIDS: { id: string; name: string; emoji: string; color: string }[] = [
  { id: "titus", name: "Titus", emoji: "🎣", color: "#2563eb" },
  { id: "mercy", name: "Mercy", emoji: "🌸", color: "#D4508A" },
  { id: "lois", name: "Lois", emoji: "👑", color: "#C026D3" },
  { id: "truma", name: "Truma", emoji: "🪻", color: "#0BABB9" },
];

const METHODS: { id: ReadingMethod; label: string; emoji: string; hint: string }[] = [
  { id: "report", label: "Report", emoji: "📝", hint: "Written or spoken summary, you check it off" },
  { id: "presentation", label: "Presentation", emoji: "🎤", hint: "Tells it to the family, you check it off" },
  { id: "quiz", label: "Quiz", emoji: "🧮", hint: "A few questions, scored automatically" },
  { id: "tell_mom", label: "Tell Mom", emoji: "💬", hint: "For the littles, just talk about it" },
];

function blankQuestion(): PracticeQuestion {
  return { prompt: "", choices: ["", ""], correctIndex: 0, explanation: "" };
}

interface Draft {
  id?: string;
  title: string;
  author: string;
  method: ReadingMethod;
  dueDate: string;
  questions: PracticeQuestion[];
}

function blankDraft(): Draft {
  return { title: "", author: "", method: "quiz", dueDate: "", questions: [blankQuestion()] };
}

function draftFromAssignment(a: ReadingAssignment): Draft {
  return {
    id: a.id,
    title: a.title,
    author: a.author ?? "",
    method: a.method,
    dueDate: a.dueDate ?? "",
    questions: a.questions.length ? a.questions : [blankQuestion()],
  };
}

export default function ReadingAssignmentEditor() {
  const [kid, setKid] = useState("titus");
  const [assignments, setAssignments] = useState<ReadingAssignment[]>([]);
  const [submitted, setSubmitted] = useState<ReadingAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Draft | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");

  const kidMeta = KIDS.find((k) => k.id === kid)!;

  async function reload() {
    setLoading(true);
    const [rows, subs] = await Promise.all([
      fetchReadingAssignments({ kidId: kid }),
      fetchReadingAssignments({ status: "submitted" }),
    ]);
    setAssignments(rows);
    setSubmitted(subs);
    setLoading(false);
  }

  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kid]);

  function flash(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  }

  function openNew() {
    setEditing(blankDraft());
  }
  function openEdit(a: ReadingAssignment) {
    setEditing(draftFromAssignment(a));
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
    if (!editing) return;
    if (!editing.title.trim()) {
      flash("Give the book a title.");
      return;
    }
    const questions = editing.method === "quiz"
      ? editing.questions.filter((q) => q.prompt.trim() && q.choices.filter((c) => c.trim()).length >= 2)
      : [];
    if (editing.method === "quiz" && questions.length === 0) {
      flash("A quiz needs at least one complete question.");
      return;
    }
    setSaving(true);
    const res = await saveReadingAssignment({
      id: editing.id,
      kidId: kid,
      title: editing.title.trim(),
      author: editing.author.trim() || null,
      method: editing.method,
      questions,
      dueDate: editing.dueDate || null,
      active: true,
    });
    setSaving(false);
    if (!res.ok) {
      flash(res.error || "Could not save.");
      return;
    }
    flash("Assigned.");
    setEditing(null);
    reload();
  }

  async function remove(id: string) {
    const res = await deleteReadingAssignment(id);
    if (res.ok) {
      flash("Deleted.");
      setEditing(null);
      reload();
    } else {
      flash(res.error || "Could not delete.");
    }
  }

  async function approve(a: ReadingAssignment) {
    const res = await saveReadingAssignment({
      id: a.id,
      kidId: a.kidId,
      title: a.title,
      author: a.author,
      method: a.method,
      questions: a.questions,
      dueDate: a.dueDate,
      active: a.active,
      status: "approved",
    });
    if (!res.ok) {
      flash(res.error || "Could not approve.");
      return;
    }
    // Same credit path every other lesson/drill/test uses.
    await reportLessonToHomeward({
      kid: a.kidId,
      subject: "reading",
      lessonId: a.id,
      minutesEarned: TIER_META.standard.minutes,
      lessonTitle: a.title,
      tier: "standard",
    });
    flash(`Approved. ${KIDS.find((k) => k.id === a.kidId)?.name ?? a.kidId} earned credit.`);
    reload();
  }

  const kidMethodLabel = (m: ReadingMethod) => METHODS.find((x) => x.id === m)?.label ?? m;

  return (
    <main className="min-h-screen px-4 py-6" style={{ background: "#f5f0e6", color: "#171411" }}>
      <div className="mx-auto w-full max-w-2xl">
        <a href="/parent" className="text-sm" style={{ color: "#6b7280" }}>
          ← Parent dashboard
        </a>
        <h1 className="mt-1 text-3xl font-black" style={{ fontFamily: "Georgia, serif" }}>
          Reading
        </h1>
        <p className="mt-1 text-sm" style={{ color: "#5c5b4a" }}>
          Assign a book, pick how they check in, and give it a due date.
        </p>

        {/* Approval queue, across all kids */}
        {submitted.length > 0 && (
          <div className="mt-5 rounded-2xl p-4" style={{ background: "#fff7e6", border: "2px solid #eab308" }}>
            <p className="text-sm font-bold" style={{ color: "#854d0e" }}>Waiting on you</p>
            {submitted.map((a) => (
              <div key={a.id} className="mt-2 flex items-center justify-between gap-2 rounded-xl p-3" style={{ background: "#fff" }}>
                <div>
                  <p className="text-sm font-bold">{KIDS.find((k) => k.id === a.kidId)?.name ?? a.kidId}: {a.title}</p>
                  <p className="text-xs" style={{ color: "#5c5b4a" }}>{kidMethodLabel(a.method)} · ready to check off</p>
                </div>
                <button onClick={() => approve(a)} className="flex-shrink-0 rounded-full px-3 py-1.5 text-xs font-bold" style={{ background: "#16a34a", color: "#fff" }}>
                  ✓ Approve
                </button>
              </div>
            ))}
          </div>
        )}

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

        {loading && <p className="mt-6 text-sm text-gray-500">Loading&hellip;</p>}

        <div className="mt-6 space-y-3">
          {assignments.map((a) => (
            <button
              key={a.id}
              onClick={() => openEdit(a)}
              className="w-full rounded-2xl p-4 text-left active:scale-[0.99] transition-transform"
              style={{ background: "#fff", border: `2px solid ${a.active ? kidMeta.color : "#e5decf"}`, opacity: a.active ? 1 : 0.6 }}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold">{a.title}{a.author ? ` — ${a.author}` : ""}</span>
                <span className="text-xs font-bold uppercase tracking-wide" style={{ color: kidMeta.color }}>{a.status}</span>
              </div>
              <p className="mt-1 text-xs" style={{ color: "#5c5b4a" }}>
                {METHODS.find((m) => m.id === a.method)?.emoji} {kidMethodLabel(a.method)}{a.dueDate ? ` · due ${a.dueDate}` : ""}
              </p>
            </button>
          ))}
          {!loading && assignments.length === 0 && (
            <p className="text-sm" style={{ color: "#5c5b4a" }}>No books assigned to {kidMeta.name} yet.</p>
          )}
        </div>

        <button
          onClick={openNew}
          className="mt-4 w-full rounded-full px-4 py-3 text-sm font-black active:scale-95 transition-transform"
          style={{ background: kidMeta.color, color: "#fff" }}
        >
          + Assign a book to {kidMeta.name}
        </button>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" style={{ background: "rgba(0,0,0,0.4)" }} onClick={() => setEditing(null)}>
          <div className="w-full sm:max-w-2xl max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl p-5" style={{ background: "#fff" }} onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black" style={{ fontFamily: "Georgia, serif" }}>{editing.id ? "Edit assignment" : "Assign a book"}</h2>
              <button onClick={() => setEditing(null)} className="text-2xl leading-none" style={{ color: "#9ca3af" }}>×</button>
            </div>

            <label className="mt-3 block">
              <span className="text-xs font-bold" style={{ color: "#5c5b4a" }}>Book title</span>
              <input className="tf-input" value={editing.title} onChange={(e) => set("title", e.target.value)} />
            </label>
            <label className="mt-3 block">
              <span className="text-xs font-bold" style={{ color: "#5c5b4a" }}>Author (optional)</span>
              <input className="tf-input" value={editing.author} onChange={(e) => set("author", e.target.value)} />
            </label>
            <label className="mt-3 block">
              <span className="text-xs font-bold" style={{ color: "#5c5b4a" }}>Due date (optional)</span>
              <input type="date" className="tf-input" value={editing.dueDate} onChange={(e) => set("dueDate", e.target.value)} />
            </label>

            <div className="mt-4">
              <p className="text-xs font-bold" style={{ color: "#5c5b4a" }}>How do they check in?</p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {METHODS.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => set("method", m.id)}
                    className="rounded-xl p-3 text-left"
                    style={{ background: editing.method === m.id ? kidMeta.color : "#faf7f0", color: editing.method === m.id ? "#fff" : "#171411", border: "1px solid #ece5d6" }}
                  >
                    <p className="text-sm font-bold">{m.emoji} {m.label}</p>
                    <p className="text-[11px]" style={{ opacity: 0.85 }}>{m.hint}</p>
                  </button>
                ))}
              </div>
            </div>

            {editing.method === "quiz" && (
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
                          <button onClick={() => updateQuestion(i, { ...q, choices: q.choices.filter((_, xi) => xi !== ci), correctIndex: Math.min(q.correctIndex, q.choices.length - 2) })} className="text-lg" style={{ color: "#9ca3af" }}>×</button>
                        )}
                      </div>
                    ))}
                    {q.choices.length < 4 && (
                      <button onClick={() => updateQuestion(i, { ...q, choices: [...q.choices, ""] })} className="mt-1 text-xs font-bold" style={{ color: "#6b7280" }}>+ Add choice</button>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="mt-5 flex items-center gap-3">
              <button onClick={save} disabled={saving} className="flex-1 rounded-full px-5 py-3 text-sm font-black active:scale-95 transition-transform disabled:opacity-50" style={{ background: kidMeta.color, color: "#fff" }}>
                {saving ? "Saving…" : "Save & assign"}
              </button>
              {editing.id && (
                <button onClick={() => remove(editing.id!)} className="rounded-full px-4 py-3 text-sm font-bold" style={{ background: "#f3f4f6", color: "#991b1b" }}>Delete</button>
              )}
            </div>
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
