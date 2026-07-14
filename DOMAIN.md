# Domain Model

This captures **what the core entities are and the reasoning behind them** — so the
decisions (and the _why_, which is the expensive part) survive.

**Status:** `Debt`, `Payment`, and `PayoffPlan`'s MVP shape are all **settled** (see the
end) — `PayoffPlan` is a deliberately thin entity. The `domain/payoff` engine is business
logic, deferred to a later phase. Entity/field _names_ are firm but not sacred; the reasoning
is what matters.

---

## Principles

These drove most of the specific decisions below.

1. **Money is integer cents, everywhere.** Store `$1,204.50` as `120450`. Floating-point
   math on money silently drifts, and this app does a lot of money math. Format to dollars
   only at display time.
2. **APR is a basis-point integer.** `19.99%` → `1999`. Same integer-precision reasoning.
3. **Enumerated values follow `const → union → Zod`.** A fixed set of values lives once in
   TS as a `const` array, which yields the union type and the validator. No DB enums (not
   portable, painful to migrate) and no lookup-table models (over-engineering for fixed sets).
   Integrity is enforced at the service boundary (Zod), not the DB column.
4. **One source of truth for a debt's balance.** `currentBalance` is _the_ number owed. It
   moves when a payment is logged; the user corrects it when reality drifts. There is no
   competing "projected current balance."
5. **Actual vs. projected.** _Actuals_ are stored (a debt's state, a `Payment` event).
   _Projections_ are derived by the engine and **never stored** (payoff timeline, the
   snowball table, the debt-free date).
6. **The plan forecasts; the user realizes.** The app never fabricates progress. Progress
   only moves when a human asserts a real event (logs/confirms a payment). No clock tick
   ever creates a payment.
7. **Store facts, derive the rest.** Only store what we can't recompute. Anything derivable
   (paid-off amount, % complete, future balances) is computed, never persisted — so it
   can't go stale and lie.

---

## `Debt`

The atom. One flexible entity with a `type`, because every debt — card or mortgage — has to
reduce to the same inputs so a _single_ payoff plan can reason across all of them.

**Identity**
| field | notes |
|---|---|
| `name` | display label ("Chase Sapphire") |
| `type` | `credit_card \| student_loan \| auto \| mortgage \| personal \| medical \| other` |
| `status` | `active \| paid_off \| archived` |

**The money** — integer cents
| field | notes |
|---|---|
| `currentBalance` | **single source of truth.** Decremented by logged payments; user-correctable when it drifts (interest/fees). |
| `highestBalance` | running maximum; service-maintained monotonic. The denominator for progress. |
| `apr` | basis-point integer |
| `minimumPayment` | fixed value the user enters |

**Scheduling**
| field | notes |
|---|---|
| `dueDayOfMonth` | the recurring rule; clamps for short months (a "31st" in February) |
| `nextPaymentDueOn` | service-maintained concrete next due date; advances per cycle on the plan's assumption; seeded at onboarding |

**Structural** (settled at the schema step): `id`, `createdAt`, `updatedAt`, and the
`owner`/`User` link.

**Derived — never stored**

- `paidOff` = `highestBalance − currentBalance`
- `percentComplete` = `paidOff / highestBalance`

**Behavioral rules** (live in the debt service, not the column)

- Logging a payment **decrements** `currentBalance`.
- Keep `highestBalance` monotonic — bump it up if `currentBalance` is ever edited above it; never lower it.
- Advance `nextPaymentDueOn` each cycle on the plan's assumption; logging a payment is optional _confirmation_, not a monthly obligation.
- At onboarding, "already paid this month?" seeds `nextPaymentDueOn` — it does **not** touch the balance. (The user enters their current balance directly; we never back-calculate history.)

---

## `Payment`

An **actual, historical** event. Coupled to the balance going forward (the decoupling we
needed was only for _pre-join_ history, which is handled by direct balance entry).

| field       | notes                                                                 |
| ----------- | --------------------------------------------------------------------- |
| `debtId`    | the one debt it was paid against                                      |
| `amount`    | integer cents; **decrements the debt's `currentBalance`** when logged |
| `date`      | when the payment was actually made (may differ from when it's logged) |
| `type`      | `regular \| windfall`                                                 |
| `note`      | optional memo                                                         |
| `createdAt` | audit                                                                 |

**Rules**

- Logging decrements `currentBalance` and advances `nextPaymentDueOn`.
- Payments are actual/historical only. Projected/future payments are computed by the engine and **never stored as rows**.

**`type` — `regular` vs `windfall`**

- **regular** = money from the standing monthly budget (minimums + committed extra).
- **windfall** = irregular extra money (bonus, tax refund, side-hustle spike).
- Litmus test: _"Would this dollar show up every month as part of your normal budget?"_ No → windfall.
- A recurring "windfall" isn't one — if a side hustle becomes dependable monthly cash, it's a _raise to the committed extra_, not a windfall.
- We deliberately do **not** tag `minimum` vs `extra` — that's a plan concept, and one payment is often both. `regular` covers both.

---

## Windfalls: the two-worlds model

> **MVP scope:** MVP does **not** store a planned windfall — see `PayoffPlan`. In MVP the
> _forecast-world_ windfall below is an **ephemeral simulator input** (a live what-if knob),
> not a persisted entity; only the _actual-world_ `Payment` is stored. The stored
> **lifecycle** described here is the **post-MVP** durable-windfall design — the reasoning is
> kept, the storage is deferred.

A windfall exists in two worlds with two representations, and the confusion always comes
from conflating them:

- **Forecast world** (the snowball/projection table): a _planned_ windfall is an **input**
  the engine applies at its expected month — like the "one-time extra payment" column in a
  classic debt-snowball spreadsheet. It shapes the projection and pulls the debt-free date
  earlier. It touches **no real balance.**
- **Actual world** (history/balance): once it really happens, it's a `Payment(type: windfall)`
  that decrements `currentBalance` like any payment.

**The projection table runs on plan inputs, not on `Payment` records.** It starts from
today's real balances and rolls forward using balances, APRs, minimums, the snowball extra,
and any planned windfalls. It would render identically whether or not a single payment has
ever been logged.

**Lifecycle of a planned windfall**

1. **Planned** — `{ amount, expectedOn, allocation }`. Forecast only; no balance impact.
2. **Realized** — the money arrives, the user confirms → creates a `Payment(type: windfall)`
   against the chosen debt. Allocation resolves to a concrete debt at this moment (if it was
   "follow the strategy," we suggest the current target; the user confirms or redirects). The
   `Payment` records **reality** — the actual amount, even if it differs from the plan.
3. **Canceled / missed** — didn't materialize; drops out of the forecast. No payment, no
   phantom progress.

---

## Monthly realization flow

> **MVP scope:** the _planned-windfall_ parts of this flow are **post-MVP** (MVP stores no
> planned windfalls — see `PayoffPlan`). Kept here for the reasoning.

Reconciles "don't make the user log every month" with "logging is critical":

- Each month the app shows what the plan **expects** for that month: minimums across debts,
  the snowball extra to the focus debt, and any planned windfall landing that month.
- The user **confirms** ("this month went as planned") in one low-friction action — which
  realizes those planned amounts into actual `Payment`s and decrements the real balances. If
  reality differed (or a windfall came smaller / not at all), they edit that line first.
- A confirmed windfall is recorded as its **own** `Payment(type: windfall)`, kept separate
  from the regular payment so the regular/windfall breakdown survives.

It's low-friction, but still a _human asserting it happened_ — so the forecast (snowball
table) and the actuals (balances) stay two clean, separate things, and we never overstate
progress.

---

## Deferred

Parked, not built (also tracked in project memory):

- A **planned-windfalls management screen** (view all planned windfalls).
- **Balance-history snapshots** for a balance-over-time chart (separate from `Payment`).
- A **windfall grouping entity** (one windfall split across several debts as a single event).

---

## `PayoffPlan`

The strategy layer, and deliberately **thin**. `Debt` is _what's owed_, `Payment` is _what
happened_; `PayoffPlan` is only _how the user has decided to attack it all_. One active plan
per user, reasoning across every active `Debt`. It stores just the user's commitments —
everything a user would call "their plan" (the focus debt, the snowball table, the debt-free
date, total interest) is **derived** by the engine from the debts + these inputs and is
**never stored**.

**Stored — essentially the whole entity**
| field | notes |
|---|---|
| `strategy` | `snowball \| avalanche \| custom` (`const → union → Zod`) |
| `monthlyExtra` | integer cents. The committed extra **above every minimum**, thrown at the focus debt each month — the "snowball amount." It's _standing monthly budget_, which is exactly what separates it from a windfall. |
| `customOrder` | ordered `debtId[]` — the user's raw attack-order _preference_, only meaningful when `strategy === 'custom'`. Stored as a **hint**; the effective order is derived from it (see below). Persists dormant when off custom. |

Plus the structural fields (`id`, `owner`/`User`, `createdAt`, `updatedAt`) settled at the
schema step.

**Strategy → attack order**

- **snowball** → `currentBalance` ascending (smallest first: quick wins, momentum).
- **avalanche** → `apr` descending (highest rate first: least interest paid).
- **custom** → the user's explicit order.
- snowball/avalanche are **pure** — derived from the debts, nothing persisted. Only `custom`
  needs stored state.

**Custom ordering — store the preference, derive the order.** The custom order can't be
recomputed (it's pure human preference), so it _must_ be stored — but we don't keep the
stored list _correct_. We treat it as a **hint** and reconcile against the live debts at read
time. That one move dodges every drift bug.

- **Stored:** `customOrder`, an ordered list of debt IDs = the user's raw preference. It lives
  on the **plan**, not as a `rank` on `Debt` — custom order is a plan concept, and the atoms
  stay pure (same discipline as refusing to tag `minimum`/`extra` on `Payment`).
- **Derived — the effective attack order:** at read time, take the active debts, order them by
  their position in `customOrder`, and **append any not in the list to the end**
  (deterministically). Reads never write.
- **Drift handled for free by that single rule:**
  - _new debt_ → not in the list → appended at the end (lowest priority; never leapfrogs the
    debt the user is focused on).
  - _paid-off debt_ → stays in the list but the engine skips it (balance 0); if it ever
    resurrects it keeps its old slot. Preference is decoupled from balance state.
  - _deleted / archived debt_ → its ID matches no active debt, so it's silently ignored — no
    dangling-reference cleanup, no maintenance job.
- **Writes only on a user action** (the invariant). `customOrder` is persisted only when the
  user **reorders** debts, or **switches to custom** — which _seeds_ the list from their
  current effective order so they start from a sensible sequence and tweak rather than
  rebuild. Switching _away_ from custom leaves `customOrder` dormant (harmless preference
  data) for if they switch back.

**Windfalls in MVP: ephemeral, not stored.** A windfall is a live **simulator overlay** — a
what-if knob on the forecast (the debt-free date moves; nothing is written). When the money
actually arrives it's logged as a `Payment(type: windfall)`, the only persisted truth. There
is **no stored planned-windfall entity** in MVP. A _durable_ known-upcoming windfall — one
that permanently shapes the standing dashboard forecast without re-entry each session — is
**post-MVP** (the stored lifecycle in _Windfalls: the two-worlds model_ describes that
deferred design).

**Cut from MVP — ahead/behind-plan.** Telling the user they're "2 months ahead" needs a
_baseline_ to compare today's projection against — and a stored baseline is a frozen
projection, which violates _"projections are never stored."_ Deferred until real
balance-history exists to compare against (see _Deferred_).

**The projection engine (`domain/payoff`)** will consume the debts + these plan inputs to
produce the snowball table, projected balances, and the debt-free date. Pure and
storage-free. **Deferred to a later phase** — it's business logic, and we're still in data
modeling; not designed here.
