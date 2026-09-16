// Authoring status for the lesson rollout.
//
// Scans every curriculum-spine course and reports, per kid and subject, how many
// lessons are "complete" (have BOTH an authored `interactive` teaching script AND
// a `quiz`) vs. total. Also flags any "quiz-only" lessons (a quiz but no teaching
// script), which the house rule forbids: every lesson must have a teaching script.
//
// Usage:
//   node scripts/authoring-status.mjs           # human-readable table
//   node scripts/authoring-status.mjs --json     # machine-readable summary
//
// Read-only. Safe to run anytime; touches no files.

import { readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const DIR = join(dirname(fileURLToPath(import.meta.url)), "..", "lib", "curriculum-spine");
const KID_ORDER = ["truma", "titus", "mercy", "lois"];

const rows = [];
const quizOnly = [];
for (const f of readdirSync(DIR).filter((f) => f.endsWith(".ts") && !f.endsWith(".d.ts"))) {
  let mod;
  try { mod = await import(join(DIR, f)); } catch { continue; }
  for (const v of Object.values(mod)) {
    if (!v || typeof v !== "object" || !Array.isArray(v.units) || !v.kidId || !v.subject) continue;
    const lessons = v.units.flatMap((u) => u.lessons ?? []);
    let teach = 0, quiz = 0, complete = 0;
    for (const l of lessons) {
      const hasI = !!l.interactive?.length, hasQ = !!l.quiz?.length;
      if (hasI) teach++;
      if (hasQ) quiz++;
      if (hasI && hasQ) complete++;
      if (hasQ && !hasI) quizOnly.push(`${l.id}  "${l.title}"`);
    }
    rows.push({ kid: v.kidId, subject: v.subject, total: lessons.length, teach, quiz, complete });
  }
}
rows.sort((a, b) => (KID_ORDER.indexOf(a.kid) - KID_ORDER.indexOf(b.kid)) || a.subject.localeCompare(b.subject));

if (process.argv.includes("--json")) {
  const gT = rows.reduce((s, r) => s + r.total, 0);
  const gC = rows.reduce((s, r) => s + r.complete, 0);
  console.log(JSON.stringify({ rows, quizOnly, totals: { complete: gC, total: gT } }, null, 2));
} else {
  const byKid = {};
  for (const r of rows) (byKid[r.kid] ??= []).push(r);
  for (const kid of KID_ORDER) {
    if (!byKid[kid]) continue;
    const rs = byKid[kid];
    const c = rs.reduce((s, r) => s + r.complete, 0);
    const t = rs.reduce((s, r) => s + r.total, 0);
    console.log(`\n### ${kid.toUpperCase()}  —  ${c} complete / ${t} total`);
    for (const r of rs) {
      const flag = r.quiz > r.teach ? "  ⚠ quiz-only present" : "";
      console.log(`  ${r.subject.padEnd(12)} complete:${String(r.complete).padStart(2)}  teach:${String(r.teach).padStart(2)}  quiz:${String(r.quiz).padStart(2)}  total:${String(r.total).padStart(3)}${flag}`);
    }
  }
  console.log(`\n=== WHOLE APP: ${rows.reduce((s, r) => s + r.complete, 0)} complete / ${rows.reduce((s, r) => s + r.total, 0)} total ===`);
  if (quizOnly.length) {
    console.log(`\n⚠ QUIZ-ONLY (needs a teaching script, house rule = no quiz-only):`);
    for (const q of quizOnly) console.log(`  - ${q}`);
  }
}
