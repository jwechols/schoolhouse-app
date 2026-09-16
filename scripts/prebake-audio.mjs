// Pre-bake authored lesson audio to static files.
//
// Authored teaching lines never change, so we synthesize each one ONCE here and
// serve it as a static file from public/lesson-audio/. At runtime useTTS plays
// the baked file instantly (zero OpenAI round-trip, zero cost). Anything not
// baked (a child's own question) still falls back to live synthesis.
//
// Usage:
//   npm run prebake -- truma prealgebra                     # all interactive lessons
//   npm run prebake -- truma prealgebra truma-prealgebra-u1-l1   # one lesson
//
// Needs OPENAI_API_KEY (read from .env.local or the environment).
//
// KEEP spokenForm + audioKey + VOICE + VOICE_INSTRUCTIONS byte-for-byte in sync
// with lib/tts.ts, or the runtime will never find the baked files.

import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const OUT_DIR = join(ROOT, "public", "lesson-audio");

// ── .env.local loader (Next loads this automatically; a plain script does not) ─
function loadEnvLocal() {
  const p = join(ROOT, ".env.local");
  if (!existsSync(p)) return;
  for (const line of readFileSync(p, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}
loadEnvLocal();

// ── In sync with lib/tts.ts ────────────────────────────────────────────────────
const VOICE = { titus: "ash", mercy: "coral", lois: "shimmer", truma: "nova" };
const VOICE_INSTRUCTIONS = {
  ash: "Warm, friendly older outdoorsman, like a favorite hunting-and-fishing uncle. Easygoing, upbeat, a little playful and folksy to keep an 8-year-old boy engaged. Encouraging, never rushed or stern.",
  coral: "Gentle, joyful kindergarten teacher who loves flowers. Warm and bright with a light sing-song lilt. Slow and clear for a 5-year-old, full of delight and encouragement.",
  shimmer: "The softest, gentlest voice for a 3-year-old. Very slow, very simple, very tender. Calm and reassuring, almost like a lullaby. Short and sweet.",
  nova: "Warm, intelligent woman mentor. Calm, thoughtful, and encouraging. Speak to a bright 11-year-old as a capable young scholar, never talk down to her. Unhurried and clear, with a gentle smile in the voice. Pronounce the name 'Truma' as 'TROO-mah' (rhymes with Puma), never 'Truh-ma'.",
};
function spokenForm(t) {
  return t.replace(/Truma/g, "Trooma").replace(/truma/g, "trooma");
}
function audioKey(voice, text) {
  const s = spokenForm(text);
  let h = 0x811c9dc5;
  const keyed = voice + "|" + s;
  for (let i = 0; i < keyed.length; i++) {
    h ^= keyed.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return `${voice}-${(h >>> 0).toString(16).padStart(8, "0")}-${s.length}`;
}

// ── Which course file backs each kid+subject (extend as lessons get authored) ──
const COURSE_MODULES = {
  // Lois (Pre-K)
  "lois/abc": "../lib/curriculum-spine/lois-abc.ts",
  "lois/bible": "../lib/curriculum-spine/lois-bible.ts",
  "lois/logic": "../lib/curriculum-spine/lois-logic.ts",
  "lois/numbers": "../lib/curriculum-spine/lois-numbers.ts",
  "lois/home": "../lib/curriculum-spine/lois-home.ts",
  "lois/money": "../lib/curriculum-spine/lois-money.ts",
  // Mercy (K)
  "mercy/bible": "../lib/curriculum-spine/mercy-bible.ts",
  "mercy/counting": "../lib/curriculum-spine/mercy-counting.ts",
  "mercy/history": "../lib/curriculum-spine/mercy-history.ts",
  "mercy/phonics": "../lib/curriculum-spine/mercy-phonics.ts",
  "mercy/science": "../lib/curriculum-spine/mercy-science.ts",
  "mercy/home": "../lib/curriculum-spine/mercy-home.ts",
  "mercy/money": "../lib/curriculum-spine/mercy-money.ts",
  // Titus (3rd)
  "titus/bible": "../lib/curriculum-spine/titus-bible.ts",
  "titus/grammar": "../lib/curriculum-spine/titus-grammar.ts",
  "titus/history": "../lib/curriculum-spine/titus-history.ts",
  "titus/literature": "../lib/curriculum-spine/titus-literature.ts",
  "titus/logic": "../lib/curriculum-spine/titus-logic.ts",
  "titus/math": "../lib/curriculum-spine/titus-math.ts",
  "titus/science": "../lib/curriculum-spine/titus-science.ts",
  "titus/home": "../lib/curriculum-spine/titus-home.ts",
  "titus/money": "../lib/curriculum-spine/titus-money.ts",
  // Truma (6th)
  "truma/history": "../lib/curriculum-spine/truma-history.ts",
  "truma/literature": "../lib/curriculum-spine/truma-literature.ts",
  "truma/prealgebra": "../lib/curriculum-spine/truma-prealgebra.ts",
  "truma/science": "../lib/curriculum-spine/truma-science.ts",
  "truma/writing": "../lib/curriculum-spine/truma-writing.ts",
  "truma/home": "../lib/curriculum-spine/truma-home.ts",
  "truma/money": "../lib/curriculum-spine/truma-money.ts",
};

// Gather every authored spoken line for a lesson, in the SAME shape the engine
// speaks it (TaughtLesson.tsx). teach/example/memory → one line; try → prompt +
// both feedback lines.
function linesForLesson(lesson) {
  const out = [];
  for (const b of lesson.interactive ?? []) {
    if (b.kind === "try") {
      out.push(b.say ?? b.prompt, b.onRight, b.onWrong);
    } else {
      out.push(b.say ?? b.text);
    }
  }
  // Quiz prompts are now read aloud too (TaughtLesson speaks q.prompt as each
  // question appears), so bake them with the exact same text the engine speaks.
  for (const q of lesson.quiz ?? []) {
    if (q.prompt) out.push(q.prompt);
  }
  return out.filter((s) => s && s.trim());
}

async function synth(voice, line) {
  const res = await fetch("https://api.openai.com/v1/audio/speech", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "gpt-4o-mini-tts",
      input: spokenForm(line).slice(0, 4096),
      voice,
      instructions: VOICE_INSTRUCTIONS[voice] || undefined,
      response_format: "mp3",
    }),
  });
  if (!res.ok) throw new Error(`TTS ${res.status}: ${await res.text()}`);
  return Buffer.from(await res.arrayBuffer());
}

async function main() {
  const [kidId, subject, lessonId] = process.argv.slice(2);
  if (!kidId || !subject) {
    console.error("Usage: npm run prebake -- <kidId> <subject> [lessonId]");
    process.exit(1);
  }
  if (!process.env.OPENAI_API_KEY) {
    console.error("OPENAI_API_KEY not set (add it to .env.local).");
    process.exit(1);
  }
  const voice = VOICE[kidId];
  if (!voice) { console.error(`Unknown kid "${kidId}".`); process.exit(1); }

  const modPath = COURSE_MODULES[`${kidId}/${subject}`];
  if (!modPath) { console.error(`No course module mapped for ${kidId}/${subject}.`); process.exit(1); }
  const mod = await import(modPath);
  const course = Object.values(mod).find((v) => v && v.kidId === kidId && v.subject === subject);
  if (!course) { console.error(`Course export not found in ${modPath}.`); process.exit(1); }

  const lessons = course.units
    .flatMap((u) => u.lessons)
    .filter((l) => l.interactive?.length && (!lessonId || l.id === lessonId));
  if (!lessons.length) { console.error("No interactive lessons matched."); process.exit(1); }

  mkdirSync(OUT_DIR, { recursive: true });
  let baked = 0, skipped = 0;
  for (const lesson of lessons) {
    console.log(`\n▶ ${lesson.id} — ${lesson.title} (voice: ${voice})`);
    for (const line of linesForLesson(lesson)) {
      const key = audioKey(voice, line);
      const file = join(OUT_DIR, `${key}.mp3`);
      if (existsSync(file)) { skipped++; continue; }
      process.stdout.write(`  baking ${key} … `);
      const buf = await synth(voice, line);
      writeFileSync(file, buf);
      baked++;
      console.log(`ok (${(buf.length / 1024).toFixed(0)} KB)`);
    }
  }

  // Rewrite manifest = every baked key present on disk (authoritative).
  const keys = readdirSync(OUT_DIR).filter((f) => f.endsWith(".mp3")).map((f) => f.replace(/\.mp3$/, ""));
  writeFileSync(join(OUT_DIR, "manifest.json"), JSON.stringify(keys, null, 0));
  console.log(`\n✅ baked ${baked}, skipped ${skipped} already present. Manifest: ${keys.length} files.`);
}

main().catch((e) => { console.error(e); process.exit(1); });
