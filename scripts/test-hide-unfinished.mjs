// Proves outline-only / half-built lessons never surface to kids (JM 2026-10-23).
// Usage: node scripts/test-hide-unfinished.mjs
import assert from "node:assert/strict";
await import("./_ts-resolve.mjs");
const spine = await import("../lib/curriculum-spine/index.ts");
const { COURSES, coursesForKid, getCourse, coursesForKidRaw, isLessonReady, readyCourse } = spine;

let visible = 0, hidden = 0;
for (const kid of ["truma", "titus", "mercy", "lois"]) {
  const raw = coursesForKidRaw(kid).flatMap((c) => c.units.flatMap((u) => u.lessons));
  const shown = coursesForKid(kid);
  const shownLessons = shown.flatMap((c) => c.units.flatMap((u) => u.lessons));
  for (const l of shownLessons) assert.ok(isLessonReady(l), `${kid}: not-ready lesson surfaced ${l.id}`);
  for (const c of shown) {
    assert.ok(c.units.length > 0, `${kid}/${c.subject}: empty course surfaced`);
    for (const u of c.units) assert.ok(u.lessons.length > 0, `${kid}/${u.id}: empty unit surfaced`);
  }
  // every outline-only lesson is unreachable via getCourse
  for (const c of coursesForKidRaw(kid)) {
    const g = getCourse(kid, c.subject);
    const ids = new Set(g ? g.units.flatMap((u) => u.lessons.map((l) => l.id)) : []);
    for (const l of c.units.flatMap((u) => u.lessons)) {
      if (!isLessonReady(l)) assert.ok(!ids.has(l.id), `${kid}: outline ${l.id} reachable`);
    }
  }
  const nReady = raw.filter(isLessonReady).length;
  assert.equal(shownLessons.length, nReady, `${kid}: ready count mismatch`);
  visible += shownLessons.length; hidden += raw.length - shownLessons.length;
  console.log(`${kid}: visible ${shownLessons.length} / hidden ${raw.length - shownLessons.length} / subjects ${shown.map((c) => c.subject).join(",") || "(none)"}`);
}
// synthetic: an outline-only lesson never surfaces, and filling it in un-hides it
const outline = { id: "x-l1", title: "Outline", objective: "o", teach: "t" };
const c = { kidId: "x", subject: "s", subjectLabel: "S", emoji: "", gradeLabel: "", stage: "grammar", overview: "", units: [{ id: "u", title: "U", summary: "", lessons: [outline] }] };
assert.equal(readyCourse(c), null);
const filled = { ...outline, interactive: [{ kind: "teach", say: "hi" }], quiz: [{ q: "?" }] };
assert.equal(readyCourse({ ...c, units: [{ ...c.units[0], lessons: [outline, filled] }] }).units[0].lessons.length, 1);
assert.ok(COURSES.length > 0);
console.log(`PASS hide-unfinished: visible ${visible}, hidden ${hidden}`);
