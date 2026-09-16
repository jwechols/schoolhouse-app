# Money, Stewardship & the Gig Economy — Design Plan

_Status: proposal for review. No mechanics built yet. Intro to Money lessons (the
prerequisite) are already shipped._

## Goal

Connect what the kids **learn** about money to what they **earn**, so that saving,
delayed gratification, and Biblical stewardship are practiced, not just taught. One
currency, earned for good work, redeemable for screen time or real Greenlight money.

Everything here is infused with stewardship: give first (firstfruits, Proverbs 3:9),
save as wisdom (Proverbs 21:20), spend with gratitude, and hold it all with an open hand
because it is God's (Luke 16:10; Psalm 24:1). Money is a servant, never a master
(Matthew 6:24).

## The core decision: who owns the balance?

Today there are two disconnected "currencies":
- **Local coins** (`lib/rewards.ts`, `elc-rewards-${kid}` in the browser) — earned in
  games, spent in the in-app store, convertible to screen minutes.
- **Homeward** (external service at `homeward.echols.family`) — receives one-way
  learning-*minute* credits, dedupes per day, enforces a 5-min min / 60-min cap, and
  "banks toward Friday payday." The app never reads a balance back.

We want **one** currency. Two options:

| | Local coins as ledger (recommended) | Homeward as ledger |
|---|---|---|
| Source of truth | This app (localStorage, + optional Supabase sync) | External Homeward service |
| Build cost | Low — wallet, store, screen-time conversion, and `COINS_PER_DOLLAR` already exist here | High — needs Homeward-side API to read balance, hold jars, and issue payouts |
| Cross-device | Single family iPad today, so low concern; can add Supabase sync later | Already server-side |
| Real-money safety | Payouts are parent-approved requests (human in the loop) | Same |
| Control | Fully in this repo | Split across two systems |

**Recommendation:** make **local coins the single ledger**. The family uses one iPad, the
app already has the wallet + store + screen-time rails, and every real-money payout is
parent-approved, so a client-side balance is safe enough. Keep Homeward as an optional
**background sync** (so any existing payday dashboard keeps working), not a second
currency the kids see. If you later want a server-authoritative balance, we lean on the
existing `lib/supabase.ts` rather than Homeward.

_This is the one call I need from you before wiring redemption._

## Give / Save / Spend at the coin level (revised)

The split happens **when coins are earned**, not as three jars the kid shuffles. Every
coin is tagged give / save / spend by mandatory family floors (JM, 2026-07-10): **give ≥
10%** (to Colonial Bible Church), **save ≥ 20%**, so **spend ≤ 70%**. A kid may choose to
give more and/or save more (which lowers spend), but never undercut the floors and never
raise spend above 70%. Not the OT tithe as binding law, but a family floor of generosity
and thrift. Implemented in `lib/money-split.ts` (built).

- **Spend** — usable now, in Schoolhouse, for screen time (and later on-demand Greenlight
  spend). This is the only portion TV can draw from.
- **Save** and **Give** — locked in-app and settle into their **Greenlight** buckets at
  the weekly payday. Greenlight natively holds give/save/spend categories, so it is the
  real-money home for these; Schoolhouse just accrues them until payday.

This enforces stewardship structurally: a kid **cannot** spend the whole week on TV,
because TV only ever touches the Spend portion. The kid may **voluntarily move Spend →
Save** (save more), never the reverse.

## Weekly payday + the budget tool

Payday lands **once a week** (via Homeward, not live until at least next week). So the kid
receives a lump and must plan it across the week. Schoolhouse gives them a **weekly budget
planner**: "you have X spend-coins this week; if you use Y on TV, Z is left." It makes the
trade-off and the cost of TV visible up front, and is itself the stewardship lesson.

At payday, the accrued Save and Give settle into Greenlight (parent-approved), and the
week resets.

## The store & treats-as-bonus (revised)

Today the Coin Store (`lib/coin-store.ts`, `/kids/[kid]/store`) holds: instant digital
unlocks (Titus facts/jokes, Lois princess stories, Mercy garden parables, a bonus Bible
story) and parent-honored physical coupons (pick dinner, pick the movie, late bedtime,
special treat, Dad reads to me).

**Change:** reframe the physical treats as **bonuses earned for good stewardship** —
hitting a savings goal, keeping to the week's budget, a mastery/consistency streak —
rather than everyday purchases that compete with saving. This keeps the Spend currency
pointed at TV/Greenlight and makes treats special rewards for faithfulness, not just
another coin sink. Digital unlocks can remain small instant treats or also move to bonus.

## Redemption plan

- **Screen time** ← Spend portion. Redeem shows the cost (`COINS_PER_SCREEN_MINUTE = 10`)
  and the opportunity-cost nudge ("30 coins on TV is Z further from your goal"), then
  fires the existing `ha-event` webhook. Optional parent PIN.
- **Greenlight money** ← Spend portion on demand, plus the Save/Give that settle at
  payday. Coins → dollars at `COINS_PER_DOLLAR = 50` via a **parent-approval request**
  (the app never moves real money itself; parent moves it in Greenlight and marks it
  honored).
- **Giving** ← Give portion, settled to the Greenlight Give bucket at payday.
- **Bonus treats** ← earned for stewardship milestones (see above), parent-honored.

## The gate

A kid cannot see the earning/redemption UI until they have completed their **Intro to
Money** lesson (already built). Understanding precedes earning.

## Build order

**Now (Schoolhouse side, no real money, reversible):**
1. Coin-level give/save/spend tagging on the existing wallet, per-kid ratio config.
2. Unify earning so all learning (including money lessons) grants coins.
3. Weekly budget planner tool + the opportunity-cost nudge at screen-time redemption.
4. Reframe store treats as stewardship bonuses.
5. Gate the earning UI behind Intro to Money completion.

**Next week (when payday is live):**
6. Payday job that settles Save/Give into Greenlight (parent-approved).
7. On-demand Greenlight spend cash-out (parent-approved request + honor screen).

## Decisions locked (JM, 2026-07-10)

- **Split floors:** give ≥ 10% (Colonial Bible Church), save ≥ 20%, spend ≤ 70%.
  Voluntary give-more / save-more allowed; spend can never be raised. Built in
  `lib/money-split.ts`.
- **Give destination:** Colonial Bible Church.
- **Budget planner:** a family activity for the Sunday meetings (a parent/family planning
  view), not a solo kid tool.
- **Payday:** not live until at least next week; Schoolhouse-side first, settlement later.

## Open questions for John-Mark

- **"Treats" (the 5 physical store rewards):** keep them coin-purchasable as today, or
  reframe as stewardship-earned bonuses? (Held pending your call.)
- **Ledger:** confirm local coins hold the pre-payday balance and Homeward is purely the
  weekly payday engine that settles Save/Give into Greenlight.
- Should the app **record giving over time** (a giving history to Colonial Bible Church)?
