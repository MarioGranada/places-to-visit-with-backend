# Project Constitution — PlacePicker

This document defines the non-negotiable foundations for this repository. Read it before adding or changing features.

## Guiding Principles

- **Simplicity first** — prefer the smallest solution that solves the problem. If a change needs a long explanation, it is probably over-engineered.
- **No hardcoded secrets or endpoints** — configuration belongs in environment variables; visual design tokens belong in styles, not in `.env` files.
- **Traceability** — every value, dependency, and route should make its origin and purpose obvious.
- **Debuggability** — fail loudly and visibly; avoid silent fallbacks that hide broken data.
- **Official patterns** — use the documented API of each framework and library before inventing a workaround.
- **Portfolio clarity** — this repository is part of a public portfolio. Code should read as clean, intentional, and easy for a reviewer to follow. As a follow-along project, its purpose is to demonstrate the concepts practised in the course, not to imitate production scale.

## Technology Stack Foundations

| Layer | Choice | Rationale |
| --- | --- | --- |
| Framework | React 18 + Vite | Fast development server and a minimal React setup. |
| Backend | Express 5 | A tiny API is enough to demonstrate fetching and persistence; runs as a Vercel Function. |
| Persistence | Supabase Postgres (postgres.js) | Durable storage on serverless hosting; one schema (`places`) in the shared portfolio database. |
| Hosting | Vercel Services + Cron | SPA and API ship together on one origin; nightly demo reset. |
| Styling | Plain CSS | Keeps the focus on React data flow. |

**Rule of thumb:** a new dependency must solve a concrete problem that the current stack cannot solve cleanly. Justify it in the change that introduces it.

## Core Premises

### 1. Scope

A course project focused on effects, data fetching, optimistic UI, and error handling. It is intentionally single-list; authentication and per-user storage are out of scope. The public demo's shared list is emptied by a nightly reset.

### 2. Environment Isolation

- Runtime configuration comes from environment variables: `POSTGRES_URL` / `POSTGRES_URL_NON_POOLING` (Supabase integration) and `CRON_SECRET`. Locally they live in the gitignored root `.env.local` (`vercel env pull .env.local`).
- Document every variable in the README and `AGENTS.md`.
- Never commit keys, tokens, database URLs, or credentials, and never log them or send database errors to the browser.

### 3. Architecture

- All HTTP calls go through `src/helpers/http.js`; components should not build URLs.
- `App.jsx` owns shared saved-place state; child components receive data and callbacks.
- The Express API stays small with explicit routes under `/api`, validates input, and never reads files at runtime (SQL lives in `backend/db/sql.js`).
- The reset endpoint refuses any request without `Authorization: Bearer $CRON_SECRET`.

### 4. Data and State

- The `places` schema is the source of truth for available and saved places; the saved list stores only place ids.
- Only touch the `places` schema; the database is shared with other portfolio apps.
- The frontend updates optimistically and must roll back on failure.
- Geolocation is optional; the app must still work when permission is denied.

### 5. Styling and UX

- Plain CSS in `src/index.css`; keep list, modal, and error styles reusable.
- Preserve the two-column layout on wide screens and stack it on small screens.
- Do not add a UI framework for this project.

### 6. Quality Gates

- `npm run build` is the gate (`npm run lint` needs an ESLint config first).
- Manually test initial load, geolocation allowed and denied, add, duplicate add, remove, cancel remove, API down, and a failed save.
- Confirm the error modal and the rollback both behave correctly.

### 7. Deployment

- One Vercel project (Services in `vercel.json`): `frontend` serves the Vite build, `backend` runs Express. Pushing to `main` deploys production.
- The nightly cron `/api/cron/reset` empties the saved list.
- Delete any test data written to production after verifying.

## What to Avoid

- Hardcoding API URLs in multiple files.
- Assuming geolocation succeeds or that the user grants permission.
- Writing to local files from the API (not durable or writable on Vercel).
- Leaving the UI in a loading state after an error.
- Adding authentication to a demo that has no user model.

## Checklist Before Adding Anything New

- Does this solve a real problem for this project, or am I adding scope for its own sake?
- Is every new value configuration-driven rather than hardcoded?
- Does the change follow the existing folder and naming patterns?
- Is there a clear failure path when data, the network, or the environment is unavailable?
- Have I run the available lint/build/test command and fixed what it reports?
- Did I update `README.md` and `MEMORY.md` if behaviour or setup changed?

## Philosophy Statement

This repository exists to show thoughtful front-end engineering: clear structure, readable code, and deliberate trade-offs. The goal is not to use every tool available, but to make every file explain itself. Simplicity is the feature.
