# Schoolhouse — Claude Context

## App Name
The app is called **Schoolhouse**. The repo stays `echols-academy` and the Netlify URL stays `echols-academy.netlify.app`, but the app name, PWA short name, manifest, and all copy use "Schoolhouse".

The old "Learing" joke name has been retired (2026-06-22). Do not restore it.

---

## What This App Is

A homeschool learning app for the Echols family — John-Mark and Briana's four kids. Each kid
gets a personalized hub with games, lessons, a Bible section, and an AI tutor character
matched to their age and personality. Built to run as a PWA on the family iPad.

**Live URLs:** https://schoolhouse.echols.family (primary) · https://learning.echols.family (alias) · https://echols-academy.netlify.app  
**Deploy:** GitHub Actions → Netlify on every push to `main`

---

## The Kids

### Truma (6th Grade, MCA Upper School Placement Test prep)
- **NOT in the `KidId` TypeScript union** — she has her own routing at `/kids/truma/*`
- `KidId = "titus" | "mercy" | "lois"` only — never add Truma to this type
- **TRUMA_THEME** (defined in `lib/kids.ts`): teal-forward palette
  - `primary: "#0BABB9"` (teal — her main color)
  - `rose: "#C94878"` (accent, not dominant)
  - `gold: "#C8820E"`
  - `bg`: teal-to-blush gradient
- Tutor character: **Lydia 🪻** — a warm, brilliant Reformed woman mentor named for Lydia of Thyatira (Acts 16, the seller of purple); engages Truma like a junior theologian, cites 1689 LBCF directly, draws on the great women of faith Truma studies. (Replaced "Professor Quill" the owl, JM 2026-07-03 — a tween girl wasn't into an elder owl professor. Do not restore Quill.)
- Has a dedicated MCA test prep section (`TrumaTestPrep.tsx`) with topic mastery tracking
- Has a Bible hub with "Women Who Walked Before You" section (Katharina von Bora, Elisabeth Elliot, Amy Carmichael, Corrie ten Boom, Sarah Edwards)

### Titus (3rd Grade, Brookside Academy)
- `colorHex: "#2563eb"` — blue
- Theme: hunting and fishing 🎣🦌 — problems use outdoors scenarios, celebrations use hunting/fishing emoji
- Tutor character: **Buck** — wise old hunter and fisherman, explains Doctrines of Grace through outdoorsman stories
- `uiSize: "normal"`, `maxChoices: 4`
- ADHD-friendly high-contrast layout: `bgGradient` is clean sky blue

### Mercy (Kindergarten, Midland Classical Academy)
- `colorHex: "#D4508A"` — rose-pink
- Theme: flowers/garden 🌸
- Tutor character: **Princess Rose 🌹** — frames grace with garden metaphors for a Kindergartner
- `uiSize: "large"`, `maxChoices: 3`

### Lois (Pre-K, age 3, home)
- `colorHex: "#C026D3"` — fuchsia/princess
- Theme: princess 👑, maximum girly
- Tutor character: **Princess Crystal ❄️** — 2-sentence max responses, full love
- `uiSize: "xlarge"`, `maxChoices: 3`
- `tutorEnabled: true` — guided tutor mode (JM 2026-07-02): preset buttons + mic, no keyboard, no free text

---

## Theology (This Is Real, Not Decorative)

The Echols family are **confessional Reformed Baptists**. This shapes every piece of content:
- **Confession:** 1689 London Baptist Confession of Faith
- **Catechism:** *Truth and Grace* by Tom Ascol (Founders Press)
- **Soteriology:** Doctrines of Grace (TULIP) — Total depravity, Unconditional election, etc.
- **Worship:** Regulative principle, psalm-singing

The AI tutors are **warm, pastoral Reformed characters** — not generic motivational coaches. Lydia (Truma) cites the 1689 directly and engages her as a junior theologian. Buck frames everything through sovereign grace in outdoorsman stories. Princess Rose (Mercy) and Princess Crystal (Lois) carry the SAME Reformed backbone as the older tutors — real catechism, doctrines of grace, God's holiness and sovereignty — just scaled down to age 5 and age 3 (JM 2026-07-03: the little girls' tutors must have real Reformed depth, not sweet-but-shallow).

**Do not soften, generify, or "balance" the theology.** The Arminian alternative is not offered.

---

## Design System

### Color Palette (per kid)
| Kid | Primary | Usage |
|-----|---------|-------|
| Truma | `#0BABB9` teal + `#C94878` rose accent | Teal-forward, elegant, mixed |
| Titus | `#2563eb` blue | Clean, high-contrast, ADHD-friendly |
| Mercy | `#D4508A` pink | Warm rose, garden |
| Lois | `#C026D3` fuchsia | Maximum princess |

### App-wide
- **Background:** warm bone `#f5f0e6` — `bg-parchment` class (mapped via `@theme`)
- **Text:** ink `--ink` / `#171411` — `text-navy` class (mapped via `@theme`)
- **Fonts:** EB Garamond (display/body), IBM Plex Sans (UI/labels), IBM Plex Mono (data), League Gothic (hero headings), Luckiest Guy (sign only) — all loaded from Google Fonts except League Gothic (local)
- **Patterns:** Tailwind utility classes + heavy inline `style={}` props throughout

### Animations (defined in `app/globals.css`)
- `popIn`, `wiggle`, `floatUp`, `shake`, `starBurst`, `confettiFall`, `heartbeat`, `rainbowPop`
- `.btn-bouncy` — spring physics hover/press on all interactive buttons
- `.correct-glow` — green glow on correct answers
- `.wrong-shake` — shake + red tint on wrong answers

### Icon / Logo
- **ELCLogo.tsx** — SVG treehouse with colorful leaf clusters (teal, orange, pink, green)
- PWA icons: `public/icon-192.png`, `public/icon-512.png`, `public/apple-touch-icon.png`
- Theme color: `#7DC842` (green)

---

## File Structure

```
app/
  layout.tsx          — root layout, PWA meta tags, manifest link
  page.tsx            — renders FamilyLanding (the kid-picker home screen)
  globals.css         — animations, .btn-bouncy, theme variables
  [kid]/              — dynamic route for titus/mercy/lois
    hub/page.tsx      — each kid's hub
    play/[game]/      — individual games
  kids/
    truma/            — Truma's separate routing (not [kid])
      page.tsx
      prep/           — MCA test prep (TrumaTestPrep.tsx)
      bible/          — Bible hub (TrumaBibleHub.tsx)
  api/
    kid-tutor/route.ts — AI tutor endpoint (ANTHROPIC_API_KEY required)

components/
  FamilyLanding.tsx   — home screen, kid card picker, ScamWelcome import
  ScamWelcome.tsx     — one-time joke popup (Nigerian scam parody), KEEP IT
  KidHub.tsx          — shared hub shell
  TrumaTestPrep.tsx   — MCA prep dashboard (teal theme, NOT navy)
  TrumaBibleHub.tsx   — Truma's Bible page
  TitusBible.tsx      — Titus Bible page (includes WORLD podcast links)
  MercyBible.tsx      — Mercy Bible page
  LoisBible.tsx       — Lois Bible page
  FloatingTutor.tsx   — AI tutor chat UI (voice out: OpenAI TTS via /api/tts; voice in: browser SpeechRecognition)
  ELCLogo.tsx         — treehouse SVG logo

lib/
  tts.ts              — shared useTTS hook (OpenAI TTS) + OPENAI_VOICE map: titus=ash, mercy=coral, lois=shimmer, truma=nova
                        (corrected 2026-08-04; the old "titus=onyx / mercy=nova / truma=fable" line was stale.
                         lib/tts.ts is the source of truth, and VOICE_INSTRUCTIONS is keyed by voice, so a kid's
                         voice and their instructions must stay in lockstep.)
  kids.ts             — KidId type, KIDS record, KIDS_ORDER, TRUMA_THEME
  adaptive-learning.ts — adaptive difficulty logic
```

---

## Key Rules

1. **The app is called Schoolhouse.** "Learing" was retired 2026-06-22. Use "Schoolhouse" everywhere.
2. **KidId never includes Truma.** She has her own routes.
3. **TRUMA_THEME is teal-primary.** Rose is an accent. The old navy/military look was removed.
4. **All theology is 1689 confessional.** Don't water it down.
5. **ScamWelcome.tsx is RETIRED (JM, 2026-07-02).** The one-time scam-parody welcome popup was removed at JM's request (it kept resurfacing on new devices with stale branding). Do not restore it.
6. **localStorage reads happen inside `useEffect`** or behind `typeof window !== "undefined"` guards — never at module scope.
7. **The AI tutor endpoint requires `ANTHROPIC_API_KEY`**, and **all spoken voice requires `OPENAI_API_KEY`** (the `/api/tts` route) — both in Netlify env vars. Tutors fail gracefully if a key is absent.
7b. **All TTS goes through `useTTS` in `lib/tts.ts`** — never use `window.speechSynthesis` (fully removed 2026-06-30/07-02). `unlockAudio()` must be called from a user-gesture handler for iOS.
7c. **Conversation mode (FloatingTutor + Scout)**: hands-free loop — tutor speaks, mic auto-reopens on audio `onended`, kid talks, repeat. Guardrails everywhere: 20-turn cap per conversation, one "are you still there?" nudge then silent exit on two silences, tapping Stop / closing the panel / navigating away kills the mic. FloatingTutor: 🗣️ Talk toggle in guided + chat modes; **Lois auto-enters conversation when her tutor opens** (she can't read — spoken greeting, then the mic opens). Scout: the big button is tap-to-talk (toggles the loop; the old hold-to-speak is gone); mic failure falls back to the text input. Kid modes: Lois/Mercy/Titus = guided (presets + mic), Truma = chat.
8. **The app is a PWA** — `manifest.json` and icons are in `public/`. Briana installs it via Safari → Add to Home Screen on the family iPad.
9. **Emoji animations are intentional and wanted.** Correct answers burst emoji at the kids. Wrong answers give encouraging emoji. Streaks give mega-bursts.
10. **Podcast links are real.** Bible sections link to *The World and Everything in It* (WORLD News Group) and *Renewing Your Mind* (Ligonier/R.C. Sproul). Do not remove them.

---

## People

- **John-Mark Echols (JM)** — Dad, built this, Reformed Baptist elder in training
- **Briana Echols** — Mom, primary user for launching lessons with the kids
- **Truma** — 6th grade daughter, MCA placement test in ~66 days
- **Titus** — 3rd grade son, dinosaur-obsessed, ADHD-friendly UI
- **Mercy** — Kindergarten daughter, flowers and grace
- **Lois** — 3-year-old daughter, princess, pre-K basics
