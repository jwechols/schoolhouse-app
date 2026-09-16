# Schoolhouse Lesson Rebuild — Full Rollout Plan

_Planning doc, 2026-07-23. No lessons authored yet under this plan; this maps the scope so the rollout is deliberate._

## The problem this fixes

Most lessons do not actively teach before they test. A lesson teaches properly only when it
carries an authored `interactive` script (teach → try → respond beats). Today:

- **1 lesson** in the whole app has that script: Truma pre-algebra "Fractions and Division" (the flagship).
- **4 lessons** have a mastery `quiz` at all (Titus math, Mercy counting, Lois numbers, Truma pre-algebra).
- Everything else has `teach` text only, so it either does a paced **readout → quiz** (the 3 quiz
  lessons without beats) or hands off to the **live AI conductor**, which improvises the lesson.

So "full instruction + quizzing for all four kids" is not true yet. The pattern is proven; the rollout is ~0%.

## Definition of "done" per lesson (the quality bar, set by the flagship)

Each finished lesson must have:
1. `objective` — one line (most lessons already have this).
2. `teach` — 2 to 5 sentences of real teaching (most already have this).
3. `workedExample` — the idea shown done, step by step.
4. `interactive[]` — ~10 to 14 beats: `teach` / `example` / `try` / `memory`. Every `try` beat has
   choices + `onRight` + `onWrong` coaching. Every spoken `say` line is in that kid's tutor voice
   (Lydia / Buck / Princess Rose / Princess Crystal), classical-Christian and 1689-sound.
5. `quiz[]` — 4 to 6 multiple-choice mastery questions (80% to pass → Mom sign-off).
6. **Pre-baked audio** — `npm run prebake -- <kid> <subject> <lessonId>` bakes each spoken line to a
   static file so playback is instant and free at runtime. Needs `OPENAI_API_KEY`.

## The real bottleneck

Not money, not compute. OpenAI TTS for the whole rollout is a few dollars total. The bottleneck is:
- **Authoring craft** — beats must actually teach, in each tutor's voice, doctrinally careful.
- **JM's review** — doctrine, pacing, and voice review is JM's lane and his time/energy is the limit.

Rushing this turns a deep Reformed curriculum into shallow AI filler. Pace over speed.

## Scope by kid (academic lessons; excludes the 1 home + 1 money spine each)

| Kid | Subjects (lesson counts) | Academic total | Notes |
|-----|--------------------------|----------------|-------|
| **Lois** (PreK) | abc 7, bible 8, logic 3, numbers 9 | **27** | Youngest; can't read, so audio matters most. Short beats. Fast wins. |
| **Mercy** (K) | bible 7, counting 7, history 4, phonics 6, science 4 | **28** | Simple beats; garden-voice (Princess Rose). |
| **Titus** (3rd) | bible 7, grammar 6, history 7, literature 6, logic 4, math 6, science 6 | **42** | Buck's voice; hunting/fishing scenarios already in the `teach` text. |
| **Truma** (6th) | history 6, literature 40, prealgebra 71, science 41, writing 6 | **164** | NEEDS TRIAGE (below). Lydia's voice; MCA prep is time-sensitive. |
| | | **~261 total** | |

### Truma triage — DONE 2026-07-23 (real counts from the spine files)
Split each big subject into (a) true **tutor-taught lessons** (full beats + quiz) vs (b) **reading /
drill entries** that need at most a short quiz, not authored beats:

| Subject | Raw | Full taught | Lighter (reading / practice drill) |
|---------|-----|-------------|-------------------------------------|
| Literature | 40 | ~19 concept/skill (story elements, figurative language, Christian imagination, reading like a scholar) | ~14 book-reading entries (Arthur, Robin Hood, Adam of the Road) |
| Science | 41 | ~33 (nearly all: classification, birds, human body) | ~1 field activity |
| Pre-algebra | 71 | ~34 concept lessons | ~22 "Practice" drill entries |

- Truma full-taught load: **~86 in the big three + ~12 history/writing = ~98**, not 164. Another ~36 are lighter.
- Whole-app scope drops from ~261 to roughly **~145 full taught + ~36 light**.
- MCA placement test is now ~46 days out (was ~66 in early July): pre-algebra is genuinely time-sensitive.

## Recommended rollout order

Ride the daily-use path so every session improves immediately:
1. **Each kid's current/next lesson** (4 lessons) — instant improvement for what they actually open next.
2. **Lois + Mercy core** (numbers/counting, phonics/abc) — youngest, fewest, audio-critical, fast.
3. **Titus math, then Titus reading/grammar** — his math is the reported pain point.
4. **Truma pre-algebra** (after triage) — MCA test-prep priority.
5. Enrichment subjects (history, science, literature, logic, bible) last, per kid.

Batch in **units** (4 to 9 lessons), not one-offs: author a unit → prebake the unit → JM reviews the
unit in-app → deploy. One clean review loop per unit.

## Per-lesson pipeline (repeat per lesson, batched by unit)
1. Draft `workedExample` + `interactive[]` + `quiz[]` in the kid's tutor voice.
2. `npm run prebake -- <kid> <subject> <lessonId>` (bakes audio; commit the new `public/lesson-audio/` files).
3. Verify in-app on localhost (teach beats play, tries coach, quiz scores, audio instant).
4. Commit + deploy (GH Actions → Netlify).

## Honest effort estimate
- Drafting: ~30 to 45 min of careful authoring per lesson (I draft).
- JM review: ~10 to 15 min per lesson (doctrine/pace/voice), batched by unit.
- At ~150 to 175 taught lessons (post-triage): **roughly 90 to 130 hours of authoring + ~30 to 40 hours of JM review**, spread over many sessions. Not a one-week job.
- TTS cost across the whole rollout: a few dollars. Negligible.

## Progress log
- **2026-07-23 — Validation batch DONE (authored + baked + verified in dev; pending deploy).**
  One flagship-bar lesson per kid, each with full `interactive[]` beats + `quiz` + baked audio:
  - Truma: `truma-prealgebra-u4-l2` "Adding Unlike Fractions" (Lydia, 12 beats, 4 tries, 5 quiz)
  - Titus: `titus-math-u1-l1` "Hundreds, Tens & Ones" (Buck, 9 beats, 3 tries, 5 quiz)
  - Mercy: `mercy-counting-u1-l1` "Counting to 10" (Princess Rose, 7 beats, 2 tries)
  - Lois: `lois-numbers-u1-l1` "One and Two" (Princess Crystal, 5 beats, 2 tries)
  Verified in dev: beats render, try-checks gate Next, authored feedback fires, baked audio plays.
  `scripts/prebake-audio.mjs` COURSE_MODULES map extended to every kid/subject (was Truma-only).
  56 new mp3s in `public/lesson-audio/`. NOT yet committed/deployed — waiting on JM.

## First concrete step (next session)
Validation batch above proves the loop for all four voices. Next unit: pick per the rollout order
(Lois + Mercy core, or Titus math, or Truma pre-algebra Unit 4 continuation), author as a batch of
4 to 9, prebake, JM reviews in-app, deploy.
