# Architecture

This document describes **where code goes and why**. It's the shared rulebook for the
project — when you're unsure where something belongs, the answer should be here.

---

## Guiding principles

1. **Business logic is pure and lives in one place.** The rules and math of the app
   (`domain/`) don't know about React, Next.js, Prisma, or HTTP. That makes them trivial
   to test and reason about.
2. **The database is touched in exactly one layer** (`server/`). UI and domain code never
   import Prisma.
3. **Routes are thin.** The `app/` tree wires data to components — it holds no business logic.
4. **Every use-case has a reusable home** (a _service_), independent of how it's triggered
   (web UI, webhook, cron, script, test).

The one-line mental model:

> **`domain/` decides _what's true_. `server/` services decide _what happens_.
> `app/` (actions & routes) just _lets someone ask_.**

---

## Directory structure

```
lola-money/
├─ prisma/
│  ├─ schema.prisma      # data model — source of truth for the DB
│  ├─ migrations/        # generated migration history
│  └─ seed.ts            # dev seed data
├─ src/
│  ├─ app/               # App Router — ROUTES ONLY. Thin: wire data → components.
│  │  ├─ api/            #   route handlers — INBOUND HTTP we host (webhooks, OAuth
│  │  │                  #   callbacks, external/3rd-party clients). Not for our own UI.
│  │  ├─ layout.tsx
│  │  └─ page.tsx
│  ├─ components/
│  │  ├─ ui/             # design system — base primitives (Button, Input, Card…)
│  │  └─ <feature>/      # composed feature components, built from ui/ primitives
│  ├─ domain/            # PURE business logic. No React, no Next, no Prisma, no I/O.
│  │  ├─ <entity>/       #   entities, types, value objects
│  ├─ server/            # SERVER-ONLY. The only layer that touches the DB.
│  │  ├─ db.ts           #   Prisma client singleton
│  │  ├─ <entity>/       #   repository (data access) + service (orchestration)
│  │  └─ actions/        #   server actions — the boundary our web UI calls
│  └─ lib/               # cross-cutting utils: formatting, zod schemas, env/config
└─ public/
```

---

## The rules, per location

### `app/` — routing only

Pages and layouts wire data to components. **No business logic, no direct DB access.**
It calls into `server/` (server actions or services).

### `app/api/` — inbound HTTP we host

Endpoints where **the world talks to us**: webhooks, OAuth callbacks, or a separate client
(e.g. a future mobile app) that can't use server actions. Our own web UI does **not** need
this — it uses server actions. This folder usually stays small.

### `components/ui/` — the design system

Base, reusable primitives. **Dumb:** no data fetching, no business logic. These are the
pieces everything else is built from.

### `components/<feature>/` — composed feature UI

Feature-specific components assembled from `ui/` primitives.

### `domain/` — pure business logic (the crown jewel)

Entities, rules, and math as **pure functions**. Imports nothing framework-y — no React,
Next, Prisma, or I/O. This is where "how the snowball orders debts" or "how interest
accrues" lives. Because it's pure, it's unit-testable in isolation.

### `server/` — server-only code (the only place that touches the DB)

- **`db.ts`** — the Prisma client singleton.
- **`<entity>/*.repository.ts`** — data access. Prisma queries live here and nowhere else.
- **`<entity>/*.service.ts`** — the **internal API**. Orchestrates a use-case: loads data
  via a repository, runs pure calculations via `domain/`, calls out via `integrations/`,
  wraps things in a transaction, returns a result. Knows nothing about HTTP or React, so
  it's reusable from actions, route handlers, cron jobs, seeds, and tests.
- **`integrations/`** — **outbound** clients. Typed wrappers around external APIs we call.
- **`actions/`** — Next.js server actions. A **thin adapter** exposing a service to our web
  UI: authenticate, validate input, call the service, shape the response. No business logic.

### `lib/` — cross-cutting utilities

Generic, **domain-agnostic** helpers, ideally safe to import from both client and server:
formatting (`formatUSD(cents)`), shared `zod` schemas, typed env/config, `cn()` classname
merger, small generic helpers. Anything touching Prisma, secrets, or Node-only APIs is
**not** `lib/` — it's `server/`.
