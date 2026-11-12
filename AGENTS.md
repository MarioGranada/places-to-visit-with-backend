# AGENTS.md — PlacePicker

Compact guide for future OpenCode sessions. It records only the facts an agent is likely to miss or get wrong.

## Quickstart

| Command | Description |
| --- | --- |
| `vercel env pull .env.local` | Pull `POSTGRES_URL` and `CRON_SECRET` into the gitignored root `.env.local`. |
| `npm ci --prefix backend && npm run db:migrate --prefix backend` | Install the API and apply the idempotent schema + catalogue. |
| `npm run dev --prefix backend` | Run the API on port 3000 (routes under `/api`). |
| `npm ci && npm run dev` | Run the frontend on port 5173; Vite proxies `/api`. |
| `npm run build` | Verify the production bundle. |

## Requirements

- Node.js 22 LTS (`backend/package.json` pins `22.x` for the Vercel Function).
- npm (lockfiles are committed for both apps).
- Two terminals: one for the API and one for Vite.
- A browser that allows geolocation for `localhost`.

## Environment

- `POSTGRES_URL` (transaction pooler) and `POSTGRES_URL_NON_POOLING` come from the Supabase integration on Vercel. `CRON_SECRET` protects `/api/cron/reset`. Locally they live in the root `.env.local` (gitignored); backend scripts load it with `--env-file-if-exists=../.env.local`.
- The SPA calls the same-origin `/api`; there is no API URL variable.
- Never commit `.env*` files (except `.env.example`), `.vercel/`, database URLs, or credentials.
- Geolocation requires permission and a secure context (`localhost` is treated as secure).

## Architecture

- `src/App.jsx` — saved places, loading/error state, and modals.
- `src/components/AvailablePlaces.jsx` — catalogue fetch, geolocation, distance sort.
- `src/helpers/http.js` — all API calls (same-origin `/api`).
- `src/loc.js` — distance calculation and sorting.
- `vercel.json` — Vercel Services: `frontend` (repo root, Vite) and `backend` (Express); `/api/*` → backend; nightly cron.
- `backend/app.js` — Express 5 routes; exported for Vercel, `server.js` only listens locally.
- `backend/db/sql.js` — schema, catalogue seed and reset SQL (in JS so the function bundle includes it); `db/seed.js` applies them.
- `backend/routes/cron.js` — nightly reset of the saved list, refuses requests without `Bearer $CRON_SECRET`.

## Commands and build order

- Run both servers; the frontend cannot load places without the API.
- Use `npm run build` to verify the production bundle.
- `npm run lint` fails today (no ESLint config); there are no tests.
- Schema changes go in `backend/db/sql.js`, must stay idempotent, and need `npm run db:migrate --prefix backend` against the shared database.

## Conventions and gotchas

- The frontend and backend are separate installs.
- Every API route lives under `/api`, because Vercel passes the original path to the backend service.
- Place images are static files in `public/images`; the catalogue stores only the file name.
- Do not read files at runtime in the backend; keep `prepare: false` in `db/index.js`.
- The database is shared with other portfolio apps; only touch the `places` schema.
- Geolocation callbacks are asynchronous; the loading state must be cleared in both success and failure paths.
- The optimistic update in `handleSelectPlace` reads `userPlaces` from the render closure; rapid clicks can save a stale list.

## Memory

- Read `MEMORY.md` first to understand the current status and decisions.
- Before changing behaviour, read `constitution.md` and keep the change aligned with it.
- After a task, update `MEMORY.md` with status, decisions, and mistakes to avoid. Keep it short.
- If a rule becomes permanent, move it into this file instead of leaving it in memory.
- Never store secrets, tokens, or personal data in `MEMORY.md`.
