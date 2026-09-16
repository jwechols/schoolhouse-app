# Schoolhouse Authoring Tracker

Living tracker for turning stub lessons into **real taught lessons**. Companion to
`docs/lesson-rebuild-rollout.md`.

**Refresh the numbers anytime:**
```
node scripts/authoring-status.mjs         # complete/total map + quiz-only flags
node scripts/authoring-status.mjs --json  # machine-readable
node scripts/instruction-time.mjs         # measured spoken-instruction minutes/lesson
```

## Instruction time — the "too short" gap (measured 2026-07-23)
Spoken tutor instruction per complete lesson (from baked audio): Truma ~4.5 / 4.4 / 3.8 min, Titus 2.4, Mercy 1.6, Lois 0.6. **Average ~2.9 min.** A lesson tagged "deep = 60 min" or "standard = 30 min" for coins delivers only ~3 min of actual teaching (~5% of a 60-min claim). Implications:
- **Coins must scale to real length, not the flat quick/standard/deep tier** (parked item A in lesson-rebuild-rollout). A 3-min lesson paying deep-tier coins is wrong.
- **Deepen the flagship bar** toward ~20-30 min of genuine teach->try->respond. Truma's are closest; little-kid lessons are short by design but still thin.

## Definition of "complete" (the quality bar)
A lesson is complete only when it has ALL of:
1. An authored `interactive` teaching script (teach -> try -> respond beats, in the kid's tutor voice, doctrinally careful).
2. A mastery `quiz` (scored to the 80% threshold).
3. Baked audio (`npm run prebake -- <kid> <subject> <lessonId>`), so it plays instantly and free.

## Snapshot — 2026-07-23
| Kid | Complete | Total | Notes |
|---|---|---|---|
| Truma | 3 | 250 | all 3 in prealgebra (Dimensions Math) |
| Titus | 1 | 214 | math; 1 quiz-only lesson to fix |
| Mercy | 1 | 135 | counting |
| Lois | 1 | 102 | numbers |
| **App** | **6** | **701** | rollout target ~145 full-taught after triage |

## House rules (JM, 2026-07-23)
1. **Every lesson needs a teaching script. NO quiz-only.**
   - Offender: `titus-math-u3-l1` "What Multiplication Is" (has quiz, no script). Author its script.
   - The scanner flags any new quiz-only lesson with a ⚠.
2. **"Dimensions Math" is NOT pre-algebra.** Truma's math course is Dimensions Math 5. The display label is already fixed to "Dimensions Math", but the underlying `prealgebra` slug/framing is wrong. DECISION NEEDED: rename the subject slug + course framing to `math` / "Dimensions Math", or keep the slug and only correct framing/objectives. (Renaming the slug touches routes, progress keys, prebake COURSE_MODULES, and Homeward subject mapping, so do it deliberately.)
3. **Much more Home, Money, and Discipleship for every kid.** Current spines are thin:
   - home: Truma 6, Titus 5, Mercy 5, Lois 4
   - money: Truma 5, Titus 5, Mercy 5, Lois 4
   - discipleship: currently only "bible"; JM wants a real discipleship track (catechism + doctrines of grace + practice), age-scaled, not just Bible facts.
   - Expand these spines with age-appropriate scope, then author to the bar.

## Open design decision — end of a course
Today, when a kid completes every lesson in a subject, `courseProgress().current`
returns null and `LessonRouter` falls through to the generic AI conductor (no
"you finished" state, no review, no advance). NOT a real ending. DECIDE one of:
- Mastery review loop (re-quiz weakest lessons),
- Advance to the next book/level,
- A "course complete" celebration + open practice mode.

## How we get to real taught lessons (the pipeline)
Per lesson, batched by unit:
1. Claude drafts the `interactive` script + `quiz` to the flagship bar (~30-45 min each).
2. JM reviews doctrine, pacing, voice (~10-15 min each) — the real bottleneck, and his lane.
3. Bake audio; verify in dev; deploy by unit.

Rough effort at ~145 full-taught lessons: ~90-130 hrs authoring + ~30-40 hrs JM review, spread over many sessions. TTS cost is a few dollars total.

## Recommended priority order
1. Fix the quiz-only lesson (`titus-math-u3-l1`).
2. Truma pre-algebra / Dimensions Math — MCA placement test ~46 days out (time-sensitive). Finish Unit 1, then the units she is entering.
3. Decide + build the Home / Money / Discipleship expansion (all kids).
4. Decide end-of-course behavior.
5. Work down each kid's core subjects unit by unit.
