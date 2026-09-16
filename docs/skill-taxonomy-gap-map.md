# Skill-Taxonomy Gap Map

_Supplementing Schoolhouse with the Marble open skill taxonomy._

## What the taxonomy is (and what we take from it)

The [Marble os-taxonomy](https://github.com/withmarbleapp/os-taxonomy) is an open
database of **1,590 elementary micro-topics** (ages 4–18) across 8 subjects, connected
by **3,221 prerequisite edges** ("you need X before Y"). Each topic carries a
description, an age band, **mastery-evidence criteria**, and an **assessment prompt**.

We use it as a **coverage map and prerequisite skeleton only** — not as content:

- We take the **topic graph** (what to teach, in what order) and the **mastery
  evidence / assessment prompts** (what "getting it" looks like).
- We do **not** use its `curriculum-standards.json` file. 818 of the 1,590 topics carry
  a Common Core / NGSS alignment; that field is simply dropped. The topic graph itself is
  standards-free.
- All teaching text is **authored fresh** in the family's classical, confessional
  Reformed idiom. Topics touching ethics, emotions, or pagan history are treated as a
  scaffold to teach _through the 1689 lens_, never imported verbatim.

**License / attribution.** The taxonomy is dual-licensed **ODbL 1.0** (database) and
**CC BY-SA 4.0** (content), attribution required. Since we use it as a reference to
author our own material (not redistributing their dataset), a credit line is sufficient.
Attribution lives in the header of each spine file that draws on it.

## Where Schoolhouse is already strong

Math, reading/phonics, Bible/catechism, and (for the older two) science, history,
grammar, literature, and writing all have real spine courses and/or question banks.
The taxonomy adds little here — we already out-cover it with Singapore math, the
trivium model, and 1689 content.

## Coverage gaps the taxonomy can fill

| Gap | Who it helps | Taxonomy source | Status |
|---|---|---|---|
| **Logic / clear thinking** | Titus | Learning to Learn + early reasoning | ✅ **Built** — `titus-logic.ts` spine, 4 units / 21 lessons (his Logic tile also has a `curriculum.ts` fallback) |
| **Science** | Mercy (K) | Science K-age (119) | ✅ **Built** — `mercy-science.ts` spine (20 lessons) + `MERCY_SCIENCE` curriculum + tile, "the world God made" |
| **History** | Mercy (K) | History K-age (26) | ✅ **Built** — `mercy-history.ts` spine (14 lessons) + `MERCY_HISTORY` curriculum + tile, "His story"; false gods handled truthfully |
| **Thinking (early logic)** | Lois (Pre-K) | age 3-4 reasoning | ✅ **Built** — `lois-logic.ts` spine (9 lessons) behind her existing "Thinking" tile |
| **Logic / Critical Thinking** | Truma (6th) | Learning to Learn + reasoning | ✅ **Built** — `TRUMA_LOGIC` (12 Qs, formal logic + metacognition) + tile; dialectic-stage, doubles as MCA prep |
| **Learning to Learn (metacognition)** | All kids | Learning to Learn (18) | Partly done — folded into Titus/Truma Logic. Could become its own cross-kid layer |
| **Personal & Social Development** | Titus, Mercy | 88 topics (emotions, ethics, self-control) | ⚠️ Not built. Author through the 1689 lens — sanctification, not secular SEL |
| **Life Skills / Stewardship** | all kids | 37 topics (money, needs vs. wants, trade) | Money track exists (`curriculum-tracks.ts`). See the money ↔ Homeward gig integration plan (separate work) |
| **Computing / AI literacy** | Titus, Truma | 21 topics (what AI is, patterns, fairness) | ⚠️ Not built. Secular framing; lowest priority |

## What's built so far (this PR)

Taxonomy-derived supplementary content now lives in **every kid's profile**:

- **Titus** — Logic (spine).
- **Mercy** — Science and History (new subjects: spine + curriculum + tiles).
- **Lois** — a real scope-and-sequence behind her "Thinking" tile.
- **Truma** — Logic / Critical Thinking (her static practice system).

## Remaining ideas (not yet built)

1. A cross-kid **Learning to Learn** layer (study habits surfaced for every kid).
2. **Personal & Social Development**, authored carefully through sanctification.
3. **Life Skills** — connect the money track to the Homeward gig economy so earning,
   saving, and delayed gratification reinforce each other (tracked separately).

## How a new taxonomy-sourced course gets authored

1. Pull the age-appropriate topics for the subject from `topics.json`, sorted by
   `centrality`; drop the `standards` field.
2. Use each topic's `name` + `evidence` as the lesson objective and mastery target.
3. Author `teach` / `memoryWork` fresh in the kid's voice and the family's theology.
4. Add the `Course` file under `lib/curriculum-spine/`, register it in `index.ts`, and
   confirm the subject id is in the kid's `subjects` list in `lib/kids.ts`.
