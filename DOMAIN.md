# Domain Model

This captures **what the core entities are and the reasoning behind them** — so the
decisions (and the *why*, which is the expensive part) survive.

**Status:** `Debt` and `Payment` are settled. `PayoffPlan` is not yet designed (see the
end). Entity/field *names* are firm but not sacred; the reasoning is what matters.

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
4. **One source of truth for a debt's balance.** `currentBalance` is *the* number owed. It
   moves when a payment is logged; the user corrects it when reality drifts. There is no
   competing "projected current balance."
5. **Actual vs. projected.** *Actuals* are stored (a debt's state, a `Payment` event).
   *Projections* are derived by the engine and **never stored** (payoff timeline, the
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
reduce to the same inputs so a *single* payoff plan can reason across all of them.

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
- Advance `nextPaymentDueOn` each cycle on the plan's assumption; logging a payment is optional *confirmation*, not a monthly obligation.
- At onboarding, "already paid this month?" seeds `nextPaymentDueOn` — it does **not** touch the balance. (The user enters their current balance directly; we never back-calculate history.)

---

## `Payment`

An **actual, historical** event. Coupled to the balance going forward (the decoupling we
needed was only for *pre-join* history, which is handled by direct balance entry).

| field | notes |
|---|---|
| `debtId` | the one debt it was paid against |
| `amount` | integer cents; **decrements the debt's `currentBalance`** when logged |
| `date` | when the payment was actually made (may differ from when it's logged) |
| `type` | `regular \| windfall` |
| `note` | optional memo |
| `createdAt` | audit |

**Rules**
- Logging decrements `currentBalance` and advances `nextPaymentDueOn`.
- Payments are actual/historical only. Projected/future payments are computed by the engine and **never stored as rows**.

**`type` — `regular` vs `windfall`**
- **regular** = money from the standing monthly budget (minimums + committed extra).
- **windfall** = irregular extra money (bonus, tax refund, side-hustle spike).
- Litmus test: *"Would this dollar show up every month as part of your normal budget?"* No → windfall.
- A recurring "windfall" isn't one — if a side hustle becomes dependable monthly cash, it's a *raise to the committed extra*, not a windfall.
- We deliberately do **not** tag `minimum` vs `extra` — that's a plan concept, and one payment is often both. `regular` covers both.

---

## Windfalls: the two-worlds model

A windfall exists in two worlds with two representations, and the confusion always comes
from conflating them:

- **Forecast world** (the snowball/projection table): a *planned* windfall is an **input**
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

Reconciles "don't make the user log every month" with "logging is critical":

- Each month the app shows what the plan **expects** for that month: minimums across debts,
  the snowball extra to the focus debt, and any planned windfall landing that month.
- The user **confirms** ("this month went as planned") in one low-friction action — which
  realizes those planned amounts into actual `Payment`s and decrements the real balances. If
  reality differed (or a windfall came smaller / not at all), they edit that line first.
- A confirmed windfall is recorded as its **own** `Payment(type: windfall)`, kept separate
  from the regular payment so the regular/windfall breakdown survives.

It's low-friction, but still a *human asserting it happened* — so the forecast (snowball
table) and the actuals (balances) stay two clean, separate things, and we never overstate
progress.

---

## Deferred

Parked, not built (also tracked in project memory):
- A **planned-windfalls management screen** (view all planned windfalls).
- **Balance-history snapshots** for a balance-over-time chart (separate from `Payment`).
- A **windfall grouping entity** (one windfall split across several debts as a single event).

---

## Not yet designed: `PayoffPlan`

The next entity. Expected to own:
- **Strategy** — `snowball | avalanche | custom` (`const → union → Zod`).
- The committed **monthly extra** (the snowball amount).
- **Planned windfalls** — `{ amount, expectedOn, allocation, status }`, including the
  allocation rule (follow-strategy vs specific debt) and the one-time-vs-recurring split.
- The **projection engine** (`domain/payoff`) that produces the snowball table, projected
  balances, the debt-free date, and ahead/behind-plan.
