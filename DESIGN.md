# Design

The visual rulebook — the counterpart to `DOMAIN.md` (what's true) and `ARCHITECTURE.md`
(where code goes). When you're unsure how something should *look or read*, the answer is here.

Distilled from the **Lola Design System** (a single source PDF, "Lola Design System"). The
tokens it defines are implemented in [`src/app/globals.css`](src/app/globals.css) — that file
is the source of truth for exact values; this doc is the source of truth for *meaning and
usage*. The original design-system bundle (prototype components, specimen cards) is kept
outside the repo as reference; we do **not** vendor its inline-style JSX — we rebuild
primitives in our own conventions.

---

## The one idea

**The page is neutral by default; color is the exception.** Canvas, white cards, quiet gray
text — then a single hue does the talking. If everything is colored, nothing is. Every rule
below is downstream of this.

---

## Voice & content

- **Numbers lead sentences.** "$6,414 Personal loan", not "Personal loan: $6,414". The bold
  value comes first, the name follows, the detail sits beneath. **Never** label:value boxes.
- **Detail lines are quiet, dot-separated fragments:** "11.2% APR · paid off August 2027",
  "Friday, July 18 · min $85".
- **Warm, direct, second person.** "Welcome back, Maya!" Titles may address the user by name.
- **Status words shout only inside pills:** FOCUS, PAID OFF ✓, ✦ SIMULATED, OVERDUE, NOW.
- **`✓` and `✦` are the only glyph decorations. No emoji.**
- **Coral copy is factual, never scolding** — "Overdue since July 10," not "You missed this."

---

## Color — the semantic system

Every hue exists **only as a wash/bold pair** — a pale fill and a saturated ink. Never use a
bold without its wash context, or a wash without its bold. On a wash, text needs the darker
step (blue is the only pair with a dedicated `--blue-text`).

The five hues carry fixed meaning — and that meaning maps straight onto our domain:

| Hue | Means | Used for | Ties to |
|---|---|---|---|
| **Blue** `bg-blue-bold` | action | buttons, active nav, links, charts — the working color | — |
| **Yellow** `bg-yellow-wash` | focus | the highlighter: focus debt, next payment due, milestones | `PayoffPlan`'s derived **focus debt** |
| **Green** `bg-green-bold` | paid | posted payments, paid-off debts, debt-free | `Debt.status = paid_off`, `Payment` |
| **Coral** `bg-coral-bold` | overdue | past due, missed payments, rising balances | overdue debts — **sparingly, never decorative** |
| **Purple** `bg-purple-bold` | Lola | everything the AI says or **simulates** | the ephemeral **windfall simulator** (see DOMAIN.md) |

Two of those ties matter for how the app *reads*: **yellow is the focus debt** the plan is
attacking, and **purple is anything simulated** — which is exactly how a user tells a live
what-if (a windfall knob) apart from a real, posted event. Color does the disambiguation that
we deliberately kept out of the data model.

**Neutrals:** `bg-canvas` (page), `bg-card` (surfaces), `hairline` (inner dividers/fills),
`text-ink` (primary), `text-muted` (secondary), `text-faint` (labels).

---

## Type

- **Display — page titles only.** Hanken Grotesk **Black (900)**, `-0.02em` tracking, **one
  per page**, may carry a single highlight. Use `font-display font-black tracking-display`.
- **Everything else — Plus Jakarta Sans**, and it's the **default** (set on `body`), so you
  rarely write `font-body`. Card headers 700, values 700, labels 500.
- **Values use tabular figures** (`tabular-nums`) so numbers align in columns and don't jitter
  as they change.
- **Labels** are uppercase, letter-spaced (`tracking-label`), and `text-faint`.

---

## Surfaces

- **Cards:** white, `rounded-card` (20px), `shadow-card` (a soft `0 2px 10px` at 6% ink).
  **Never hairline borders** — the shadow does the lifting.
- **Canvas** (`bg-canvas`) sits behind everything.
- **Hairline** (`#F4F3F0`) is for **inner dividers and fills only**, never a card outline.
- **No gradients, photography, or illustration.** The source specifies none. Motion, if any,
  stays to minimal opacity/transform fades.

---

## Components (rebuild as `components/ui/` primitives)

The design system prototypes these; we reimplement each in Tailwind + TS, using its specimen
as a pixel-accurate blueprint.

- **Button** — pill-shaped (`rounded-pill`). Blue solid = primary; 1px `hairline-strong` ghost
  = secondary; ink solid = rare, AI-related.
- **StatusPill** — wash background + bold text, `rounded-pill-status` (12px), weight 700.
  Never outlined, never gray.
- **SentenceRow** — the core list pattern: bold value first, name, detail beneath; a chevron
  or one ghost action on the right.
- **EmphasisBlock** — a yellow-wash panel inside a card, **one per card max**. The wash
  carries urgency; blue owns the action.
- **BarChart** — flat fills, rounded tops (`--radius-chart-bar`). Gray = past, blue = current,
  hatched/dashed = planned/projected. Tabular figures.
- **LolaFab** — the floating `✦` ink circle, bottom-right, present on every page.

---

## Iconography

No icon set was provided. The system uses **unicode glyphs as icons**: `✦` (AI/Lola), `✓`
(paid), `›` (chevron/navigation). **Do not** add an icon font or SVG icon set without new
source material, and **do not** use emoji.

---

## What the source didn't provide

- **No logo.** Render "Lola" in plain type wherever a mark would go. The `✦` glyph marks AI
  features **only** — it is not the brand mark.
- **No font binaries.** We load Hanken Grotesk + Plus Jakarta Sans via `next/font/google`
  (self-hosted at build time). Supply `.woff2` files later to fully self-host.
- **No icon assets, no motion system, no full product screens.** The one home-screen mock in
  the bundle is an assembly of documented patterns, not a canonical layout — treat it as a
  reference for *how the pieces combine*, not a spec.

---

## Where it lives

- **Tokens** → [`src/app/globals.css`](src/app/globals.css) (`@theme`) — exact values.
- **Fonts** → [`src/app/layout.tsx`](src/app/layout.tsx) (`next/font`).
- **Primitives** → `src/components/ui/` (to build).
