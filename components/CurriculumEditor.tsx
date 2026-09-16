"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  coursesForKidRaw,
  getCourseRaw,
  seedOverrideCache,
  type Course,
  type SpineLesson,
  type QuizQuestion,
  type LessonOverride,
} from "@/lib/curriculum-spine";

// ── Briana's curriculum editor ───────────────────────────────────────────────
// Kid → subject → lesson. She can edit any lesson's text and quiz, flag it
// (matches our book / skip / needs work), leave a note, and add her own lessons.
// Everything saves to /api/curriculum-overrides (parent-PIN gated) and layers on
// top of the code lessons the kids see.

const KIDS: { id: string; name: string; emoji: string; color: string }[] = [
  { id: "titus", name: "Titus", emoji: "🎣", color: "#2563eb" },
  { id: "mercy", name: "Mercy", emoji: "🌸", color: "#D4508A" },
  { id: "lois", name: "Lois", emoji: "👑", color: "#C026D3" },
  { id: "truma", name: "Truma", emoji: "🪻", color: "#0BABB9" },
];

type Status = "matches" | "skip" | "needs_work";
const STATUS_META: Record<Status, { label: string; bg: string; fg: string }> = {
  matches: { label: "Matches our book", bg: "#dcfce7", fg: "#166534" },
  needs_work: { label: "Needs work", bg: "#fef9c3", fg: "#854d0e" },
  skip: { label: "Skipped", bg: "#fee2e2", fg: "#991b1b" },
};

// The editable shape of a lesson (kept flat for the form).
interface Draft {
  title: string;
  objective: string;
  teach: string;
  workedExample: string;
  memoryWork: string;
  quiz: QuizQuestion[];
  status: Status | "";
  note: string;
}

function blankDraft(): Draft {
  return { title: "", objective: "", teach: "", workedExample: "", memoryWork: "", quiz: [], status: "", note: "" };
}

function draftFromLesson(l: SpineLesson, o?: LessonOverride): Draft {
  const p = o?.patch ?? {};
  return {
    title: (p.title as string) ?? l.title ?? "",
    objective: (p.objective as string) ?? l.objective ?? "",
    teach: (p.teach as string) ?? l.teach ?? "",
    workedExample: (p.workedExample as string) ?? l.workedExample ?? "",
    memoryWork: (p.memoryWork as string) ?? l.memoryWork ?? "",
    quiz: (p.quiz as QuizQuestion[]) ?? l.quiz ?? [],
    status: (o?.status as Status) ?? "",
    note: o?.note ?? "",
  };
}

export default function CurriculumEditor() {
  const [kid, setKid] = useState<string>("titus");
  const [subject, setSubject] = useState<string>("");
  const [overrides, setOverrides] = useState<Record<string, LessonOverride>>({});
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [addingUnitId, setAddingUnitId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft>(blankDraft());
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string>("");
  // "Tell me what you're teaching" panel
  const [teachingInput, setTeachingInput] = useState("");
  const [drafting, setDrafting] = useState(false);
  const [recording, setRecording] = useState(false);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const kidMeta = KIDS.find((k) => k.id === kid)!;
  const courses = useMemo(() => coursesForKidRaw(kid), [kid]);
  const course: Course | undefined = useMemo(
    () => (subject ? getCourseRaw(kid, subject) : undefined),
    [kid, subject],
  );

  // Default the subject to the kid's first course when the kid changes.
  useEffect(() => {
    setSubject(courses[0]?.subject ?? "");
    setEditingId(null);
    setAddingUnitId(null);
  }, [kid, courses]);

  // Load current overrides once.
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch("/api/curriculum-overrides");
        const json = await res.json();
        if (!alive) return;
        const map: Record<string, LessonOverride> = {};
        for (const o of (json.overrides ?? []) as LessonOverride[]) map[o.lessonId] = o;
        setOverrides(map);
        seedOverrideCache(Object.values(map));
      } catch {
        /* offline / not configured — editor still renders on code lessons */
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  function flash(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  }

  function openEdit(l: SpineLesson) {
    setAddingUnitId(null);
    setEditingId(l.id);
    setDraft(draftFromLesson(l, overrides[l.id]));
  }

  function openAdd(unitId: string) {
    setEditingId(null);
    setAddingUnitId(unitId);
    setDraft(blankDraft());
  }

  function closeForm() {
    setEditingId(null);
    setAddingUnitId(null);
  }

  function openAddPrefilled(unitId: string, lesson: SpineLesson) {
    setEditingId(null);
    setAddingUnitId(unitId);
    setDraft(draftFromLesson(lesson));
  }

  // Dictation: record the mic and transcribe via /api/stt (same reliable path
  // the kids' tutors use — Whisper, works in the iPad PWA).
  async function toggleMic() {
    if (recording) {
      recorderRef.current?.stop();
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const rec = new MediaRecorder(stream);
      chunksRef.current = [];
      rec.ondataavailable = (e) => e.data.size > 0 && chunksRef.current.push(e.data);
      rec.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        setRecording(false);
        const blob = new Blob(chunksRef.current, { type: rec.mimeType || "audio/webm" });
        if (blob.size === 0) return;
        const fd = new FormData();
        fd.append("audio", blob, "speech.webm");
        try {
          const res = await fetch("/api/stt", { method: "POST", body: fd });
          const j = await res.json();
          if (j.text) setTeachingInput((prev) => (prev ? `${prev} ${j.text}` : j.text).trim());
          else flash("Didn't catch that. Try again or type it.");
        } catch {
          flash("Couldn't transcribe. Type it instead.");
        }
      };
      recorderRef.current = rec;
      rec.start();
      setRecording(true);
    } catch {
      flash("Microphone not available. Type it instead.");
    }
  }

  async function draftLesson() {
    if (!course || !teachingInput.trim()) return;
    setDrafting(true);
    try {
      const res = await fetch("/api/draft-lesson", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ kidId: kid, subject, prompt: teachingInput.trim() }),
      });
      const j = await res.json();
      if (!res.ok || !j.lesson) {
        flash(j.error || "Couldn't draft that. Try rephrasing.");
        return;
      }
      const unitId = course.units[0]?.id;
      if (unitId) {
        openAddPrefilled(unitId, { id: "draft", ...j.lesson } as SpineLesson);
        setTeachingInput("");
      }
    } catch {
      flash("Couldn't draft (offline?).");
    } finally {
      setDrafting(false);
    }
  }

  async function persist(override: LessonOverride) {
    setSaving(true);
    try {
      const res = await fetch("/api/curriculum-overrides", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(override),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        flash(j.error || "Could not save.");
        return false;
      }
      const next = { ...overrides, [override.lessonId]: override };
      setOverrides(next);
      seedOverrideCache(Object.values(next));
      flash("Saved.");
      return true;
    } catch {
      flash("Could not save (offline?).");
      return false;
    } finally {
      setSaving(false);
    }
  }

  async function revert(lessonId: string) {
    setSaving(true);
    try {
      const res = await fetch(`/api/curriculum-overrides?lessonId=${encodeURIComponent(lessonId)}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        flash(j.error || "Could not revert.");
        return;
      }
      const next = { ...overrides };
      delete next[lessonId];
      setOverrides(next);
      seedOverrideCache(Object.values(next));
      flash("Reverted to the original.");
      closeForm();
    } finally {
      setSaving(false);
    }
  }

  async function saveEdit() {
    if (!course || !editingId) return;
    const override: LessonOverride = {
      lessonId: editingId,
      kidId: kid,
      subject,
      isCustom: overrides[editingId]?.isCustom ?? false,
      unitId: overrides[editingId]?.unitId ?? null,
      status: draft.status || null,
      note: draft.note.trim() || null,
      patch: {
        title: draft.title.trim(),
        objective: draft.objective.trim(),
        teach: draft.teach.trim(),
        workedExample: draft.workedExample.trim(),
        memoryWork: draft.memoryWork.trim(),
        quiz: draft.quiz,
      },
      fullLesson: overrides[editingId]?.fullLesson ?? null,
    };
    // For custom lessons, keep the full lesson in sync with the edits.
    if (override.isCustom && override.fullLesson) {
      override.fullLesson = {
        ...override.fullLesson,
        title: draft.title.trim(),
        objective: draft.objective.trim(),
        teach: draft.teach.trim(),
        workedExample: draft.workedExample.trim() || undefined,
        memoryWork: draft.memoryWork.trim() || undefined,
        quiz: draft.quiz.length ? draft.quiz : undefined,
      };
      override.patch = null;
    }
    if (await persist(override)) closeForm();
  }

  async function saveCustom() {
    if (!course || !addingUnitId) return;
    if (!draft.title.trim() || !draft.teach.trim()) {
      flash("A new lesson needs at least a title and something to teach.");
      return;
    }
    const id = `${kid}-${subject}-custom-${Date.now()}`;
    const lesson: SpineLesson = {
      id,
      title: draft.title.trim(),
      objective: draft.objective.trim() || draft.title.trim(),
      teach: draft.teach.trim(),
      workedExample: draft.workedExample.trim() || undefined,
      memoryWork: draft.memoryWork.trim() || undefined,
      quiz: draft.quiz.length ? draft.quiz : undefined,
      tier: "standard",
    };
    const override: LessonOverride = {
      lessonId: id,
      kidId: kid,
      subject,
      unitId: addingUnitId,
      isCustom: true,
      status: draft.status || null,
      note: draft.note.trim() || null,
      patch: null,
      fullLesson: lesson,
      sortOrder: Date.now(),
    };
    if (await persist(override)) closeForm();
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <main className="min-h-screen px-4 py-6" style={{ background: "#f5f0e6", color: "#171411" }}>
      <div className="mx-auto w-full max-w-2xl">
        <a href="/parent" className="text-sm" style={{ color: "#6b7280" }}>
          ← Parent dashboard
        </a>
        <h1 className="mt-1 text-3xl font-black" style={{ fontFamily: "Georgia, serif" }}>
          Lessons
        </h1>
        <p className="mt-1 text-sm" style={{ color: "#5c5b4a" }}>
          Tune any lesson to match the kids&rsquo; real schoolbooks, flag what to skip, or add your own.
          Changes show up for the kids right away.
        </p>

        {/* Kid picker */}
        <div className="mt-5 flex flex-wrap gap-2">
          {KIDS.map((k) => (
            <button
              key={k.id}
              onClick={() => setKid(k.id)}
              className="rounded-full px-4 py-2 text-sm font-bold active:scale-95 transition-transform"
              style={{
                background: kid === k.id ? k.color : "#fff",
                color: kid === k.id ? "#fff" : "#171411",
                border: `2px solid ${k.color}`,
              }}
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
              onClick={() => {
                setSubject(c.subject);
                closeForm();
              }}
              className="rounded-full px-3 py-1.5 text-sm font-medium active:scale-95 transition-transform"
              style={{
                background: subject === c.subject ? "#171411" : "#fff",
                color: subject === c.subject ? "#fff" : "#171411",
                border: "2px solid #e5decf",
              }}
            >
              {c.emoji} {c.subjectLabel}
            </button>
          ))}
        </div>

        {loading && <p className="mt-6 text-sm text-gray-500">Loading your changes…</p>}

        {/* Course */}
        {course && (
          <div className="mt-6">
            <p className="text-xs uppercase tracking-wide" style={{ color: "#5c5b4a" }}>
              {course.gradeLabel} · {course.subjectLabel}
            </p>
            <p className="mt-1 text-sm" style={{ color: "#5c5b4a" }}>
              {course.overview}
            </p>

            {/* Tell me what you're teaching — the painfree path */}
            <div className="mt-4 rounded-2xl p-4" style={{ background: "#fff", border: `2px solid ${kidMeta.color}` }}>
              <p className="font-bold" style={{ color: "#171411" }}>
                ✨ Just tell me what you&rsquo;re teaching
              </p>
              <p className="text-xs" style={{ color: "#5c5b4a" }}>
                Say or type what {kidMeta.name} is doing in your real book this week. I&rsquo;ll draft the whole lesson for you to look over.
              </p>
              <div className="mt-2 flex items-start gap-2">
                <textarea
                  className="flex-1 rounded-xl px-3 py-2 text-sm"
                  style={{ border: "1.5px solid #e5decf", background: "#faf7f0", color: "#171411", outline: "none" }}
                  rows={2}
                  placeholder={`e.g. "This week ${kidMeta.name} is learning 2-digit multiplication."`}
                  value={teachingInput}
                  onChange={(e) => setTeachingInput(e.target.value)}
                />
                <button
                  onClick={toggleMic}
                  aria-label={recording ? "Stop recording" : "Dictate"}
                  className="flex-shrink-0 rounded-full px-3 py-2 text-lg active:scale-95 transition-transform"
                  style={{ background: recording ? "#ef4444" : "#f3f4f6", color: recording ? "#fff" : "#374151", border: "1px solid #e5e7eb" }}
                >
                  {recording ? "⏺" : "🎤"}
                </button>
              </div>
              <button
                onClick={draftLesson}
                disabled={drafting || !teachingInput.trim()}
                className="mt-2 w-full rounded-full px-4 py-2.5 text-sm font-black active:scale-95 transition-transform disabled:opacity-50"
                style={{ background: kidMeta.color, color: "#fff" }}
              >
                {drafting ? "Drafting the lesson…" : "Draft the lesson for me"}
              </button>
              {recording && (
                <p className="mt-1 text-center text-xs" style={{ color: "#ef4444" }}>
                  Listening… tap ⏺ when you&rsquo;re done.
                </p>
              )}
            </div>

            {course.units.map((u) => {
              const customsForUnit = Object.values(overrides).filter(
                (o) => o.isCustom && o.subject === subject && o.kidId === kid && (o.unitId ?? course.units[0].id) === u.id,
              );
              return (
                <div key={u.id} className="mt-5 rounded-2xl p-4" style={{ background: "#fff", border: "2px solid #e5decf" }}>
                  <p className="font-bold" style={{ color: "#171411" }}>
                    {u.title}
                  </p>
                  <p className="text-xs" style={{ color: "#5c5b4a" }}>
                    {u.summary}
                  </p>

                  <ul className="mt-3 space-y-2">
                    {u.lessons.map((l) => (
                      <LessonRow key={l.id} lesson={l} override={overrides[l.id]} onEdit={() => openEdit(l)} />
                    ))}
                    {customsForUnit.map((o) => (
                      <LessonRow
                        key={o.lessonId}
                        lesson={o.fullLesson as SpineLesson}
                        override={o}
                        custom
                        onEdit={() => o.fullLesson && openEdit(o.fullLesson)}
                      />
                    ))}
                  </ul>

                  <button
                    onClick={() => openAdd(u.id)}
                    className="mt-3 rounded-full px-3 py-1.5 text-sm font-bold active:scale-95 transition-transform"
                    style={{ background: "#727e4e00", color: kidMeta.color, border: `2px dashed ${kidMeta.color}` }}
                  >
                    + Add a lesson to this unit
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Edit / add form */}
      {(editingId || addingUnitId) && (
        <LessonForm
          isNew={!!addingUnitId}
          draft={draft}
          setDraft={setDraft}
          saving={saving}
          accent={kidMeta.color}
          canRevert={!!editingId && !!overrides[editingId]}
          onCancel={closeForm}
          onSave={addingUnitId ? saveCustom : saveEdit}
          onRevert={editingId ? () => revert(editingId) : undefined}
        />
      )}

      {toast && (
        <div
          className="fixed bottom-5 left-1/2 -translate-x-1/2 rounded-full px-5 py-2.5 text-sm font-bold shadow-lg"
          style={{ background: "#171411", color: "#fff" }}
        >
          {toast}
        </div>
      )}
    </main>
  );
}

// ── Lesson row ────────────────────────────────────────────────────────────────
function LessonRow({
  lesson,
  override,
  custom,
  onEdit,
}: {
  lesson: SpineLesson;
  override?: LessonOverride;
  custom?: boolean;
  onEdit: () => void;
}) {
  const edited = !!override?.patch && Object.keys(override.patch).some((k) => {
    const v = (override.patch as Record<string, unknown>)[k];
    return typeof v === "string" ? v.trim() !== "" : Array.isArray(v) ? v.length > 0 : v != null;
  });
  const status = override?.status as Status | undefined;
  const title = (override?.patch?.title as string) || lesson.title;
  return (
    <li>
      <button
        onClick={onEdit}
        className="w-full rounded-xl px-3 py-2 text-left active:scale-[0.99] transition-transform"
        style={{ background: "#faf7f0", border: "1px solid #ece5d6" }}
      >
        <div className="flex items-center gap-2">
          <span className="flex-1 text-sm font-medium" style={{ color: "#171411" }}>
            {title}
          </span>
          {custom && <Badge bg="#e0f2fe" fg="#075985">Mom&rsquo;s</Badge>}
          {edited && !custom && <Badge bg="#ede9fe" fg="#5b21b6">Edited</Badge>}
          {override?.note && <span title="Has a note">📝</span>}
          {status && (
            <Badge bg={STATUS_META[status].bg} fg={STATUS_META[status].fg}>
              {STATUS_META[status].label}
            </Badge>
          )}
        </div>
      </button>
    </li>
  );
}

function Badge({ children, bg, fg }: { children: React.ReactNode; bg: string; fg: string }) {
  return (
    <span className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide" style={{ background: bg, color: fg }}>
      {children}
    </span>
  );
}

// ── Lesson form (edit or add) ─────────────────────────────────────────────────
function LessonForm({
  isNew,
  draft,
  setDraft,
  saving,
  accent,
  canRevert,
  onCancel,
  onSave,
  onRevert,
}: {
  isNew: boolean;
  draft: Draft;
  setDraft: (d: Draft) => void;
  saving: boolean;
  accent: string;
  canRevert: boolean;
  onCancel: () => void;
  onSave: () => void;
  onRevert?: () => void;
}) {
  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setDraft({ ...draft, [k]: v });

  function addQuestion() {
    set("quiz", [...draft.quiz, { prompt: "", choices: ["", ""], correctIndex: 0, explanation: "" }]);
  }
  function updateQuestion(i: number, q: QuizQuestion) {
    set("quiz", draft.quiz.map((old, idx) => (idx === i ? q : old)));
  }
  function removeQuestion(i: number) {
    set("quiz", draft.quiz.filter((_, idx) => idx !== i));
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" style={{ background: "rgba(0,0,0,0.4)" }} onClick={onCancel}>
      <div
        className="w-full sm:max-w-2xl max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl p-5"
        style={{ background: "#fff" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black" style={{ fontFamily: "Georgia, serif" }}>
            {isNew ? "Add a lesson" : "Edit lesson"}
          </h2>
          <button onClick={onCancel} className="text-2xl leading-none" style={{ color: "#9ca3af" }}>
            ×
          </button>
        </div>

        <Field label="Title">
          <input className="tf-input" value={draft.title} onChange={(e) => set("title", e.target.value)} />
        </Field>
        <Field label="Objective (one line: what the child should learn)">
          <input className="tf-input" value={draft.objective} onChange={(e) => set("objective", e.target.value)} />
        </Field>
        <Field label="Teach (how you'd explain it — this drives the lesson)">
          <textarea className="tf-input" rows={4} value={draft.teach} onChange={(e) => set("teach", e.target.value)} />
        </Field>
        <Field label="Worked example (optional — the idea shown done)">
          <textarea className="tf-input" rows={3} value={draft.workedExample} onChange={(e) => set("workedExample", e.target.value)} />
        </Field>
        <Field label="Memory work (optional — verse, fact chant, catechism)">
          <input className="tf-input" value={draft.memoryWork} onChange={(e) => set("memoryWork", e.target.value)} />
        </Field>

        {/* Quiz */}
        <div className="mt-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold">Quiz questions</p>
            <button onClick={addQuestion} className="rounded-full px-3 py-1 text-xs font-bold" style={{ background: accent, color: "#fff" }}>
              + Question
            </button>
          </div>
          <p className="text-xs" style={{ color: "#5c5b4a" }}>
            When a lesson has quiz questions, it runs as a real taught lesson with an 80% mastery check.
          </p>
          {draft.quiz.map((q, i) => (
            <QuestionEditor key={i} q={q} index={i} onChange={(nq) => updateQuestion(i, nq)} onRemove={() => removeQuestion(i)} />
          ))}
        </div>

        {/* Status + note */}
        <div className="mt-4">
          <p className="text-sm font-bold">Flag this lesson</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {(["matches", "needs_work", "skip"] as Status[]).map((s) => (
              <button
                key={s}
                onClick={() => set("status", draft.status === s ? "" : s)}
                className="rounded-full px-3 py-1.5 text-xs font-bold"
                style={{
                  background: draft.status === s ? STATUS_META[s].bg : "#f3f4f6",
                  color: draft.status === s ? STATUS_META[s].fg : "#6b7280",
                  border: draft.status === s ? `1px solid ${STATUS_META[s].fg}33` : "1px solid #e5e7eb",
                }}
              >
                {STATUS_META[s].label}
              </button>
            ))}
          </div>
          <p className="mt-1 text-xs" style={{ color: "#5c5b4a" }}>
            &ldquo;Skip&rdquo; hides this lesson from the child.
          </p>
        </div>
        <Field label="Note to JM (optional)">
          <textarea className="tf-input" rows={2} value={draft.note} onChange={(e) => set("note", e.target.value)} placeholder="e.g. Our book teaches long division a different way." />
        </Field>

        <div className="mt-5 flex items-center gap-3">
          <button
            onClick={onSave}
            disabled={saving}
            className="flex-1 rounded-full px-5 py-3 text-sm font-black active:scale-95 transition-transform disabled:opacity-50"
            style={{ background: accent, color: "#fff" }}
          >
            {saving ? "Saving…" : isNew ? "Add lesson" : "Save changes"}
          </button>
          {canRevert && onRevert && (
            <button onClick={onRevert} disabled={saving} className="rounded-full px-4 py-3 text-sm font-bold disabled:opacity-50" style={{ background: "#f3f4f6", color: "#991b1b" }}>
              Revert
            </button>
          )}
        </div>
      </div>

      <style>{`
        .tf-input {
          width: 100%;
          margin-top: 4px;
          border: 1.5px solid #e5decf;
          border-radius: 12px;
          padding: 10px 12px;
          font-size: 15px;
          color: #171411;
          background: #faf7f0;
          outline: none;
        }
        .tf-input:focus { border-color: ${accent}; background: #fff; }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="mt-3 block">
      <span className="text-xs font-bold" style={{ color: "#5c5b4a" }}>
        {label}
      </span>
      {children}
    </label>
  );
}

function QuestionEditor({
  q,
  index,
  onChange,
  onRemove,
}: {
  q: QuizQuestion;
  index: number;
  onChange: (q: QuizQuestion) => void;
  onRemove: () => void;
}) {
  return (
    <div className="mt-3 rounded-xl p-3" style={{ background: "#faf7f0", border: "1px solid #ece5d6" }}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold" style={{ color: "#5c5b4a" }}>
          Question {index + 1}
        </span>
        <button onClick={onRemove} className="text-xs font-bold" style={{ color: "#991b1b" }}>
          Remove
        </button>
      </div>
      <input className="tf-input" placeholder="Question" value={q.prompt} onChange={(e) => onChange({ ...q, prompt: e.target.value })} />
      <p className="mt-2 text-[11px] font-bold" style={{ color: "#5c5b4a" }}>
        Answer choices (tap the circle to mark the correct one)
      </p>
      {q.choices.map((c, ci) => (
        <div key={ci} className="mt-1 flex items-center gap-2">
          <button
            onClick={() => onChange({ ...q, correctIndex: ci })}
            aria-label="Mark correct"
            className="h-5 w-5 flex-shrink-0 rounded-full"
            style={{ border: "2px solid #16a34a", background: q.correctIndex === ci ? "#16a34a" : "transparent" }}
          />
          <input
            className="tf-input"
            style={{ marginTop: 0 }}
            placeholder={`Choice ${ci + 1}`}
            value={c}
            onChange={(e) => onChange({ ...q, choices: q.choices.map((x, xi) => (xi === ci ? e.target.value : x)) })}
          />
          {q.choices.length > 2 && (
            <button
              onClick={() => onChange({ ...q, choices: q.choices.filter((_, xi) => xi !== ci), correctIndex: Math.min(q.correctIndex, q.choices.length - 2) })}
              className="text-lg"
              style={{ color: "#9ca3af" }}
            >
              ×
            </button>
          )}
        </div>
      ))}
      {q.choices.length < 4 && (
        <button onClick={() => onChange({ ...q, choices: [...q.choices, ""] })} className="mt-1 text-xs font-bold" style={{ color: "#6b7280" }}>
          + Add choice
        </button>
      )}
      <input
        className="tf-input"
        placeholder="Explanation shown after they answer (optional)"
        value={q.explanation ?? ""}
        onChange={(e) => onChange({ ...q, explanation: e.target.value })}
      />
    </div>
  );
}
