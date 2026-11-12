# PlacePicker — Working Memory

_Last updated: 2026-11-12_

## Current status

- Live on Vercel: https://places-to-visit-with-backend.vercel.app (pushes to `main` deploy production).
- One Vercel project with Services: `frontend` (Vite SPA at the repo root) + `backend` (Express 5 under `/api`).
- Catalogue (18 places) and the shared saved list live in the `places` schema of the shared Supabase Postgres (`portfolio-db`).
- Nightly Vercel Cron (04:00 UTC) calls `/api/cron/reset`, which empties the saved list.
- Load, add, reload persistence and remove-with-confirmation verified in headless Chrome against production.
- No tests; `npm run lint` fails because the repo has no ESLint config (pre-existing).

## Key decisions

- Sorted places on the client so the API stays unaware of the user’s location.
- Replaced the JSON files with Postgres; the saved list stores only place ids.
- Images moved to `public/images` so the CDN serves them.
- Same-origin `/api` (Vite proxy locally): no CORS, no URL env var.
- Fixed: the available list loaded forever when geolocation was denied or unavailable; it now falls back to the default order.

## Known limitations and follow-ups

- Saved places are global (one shared list), with no authentication.
- No pagination or place search; no automated tests.

## Mistakes to avoid

- Starting only the frontend leaves both lists empty.
- Mounting backend routes without the `/api` prefix: Vercel forwards the original path.
- Headless browsers never grant geolocation; tests rely on the fallback order.

## Next steps

- Add an ESLint flat config so `npm run lint` works.
- Scope saved places per visitor if the demo needs it.

---

Keep this file under ~60 lines. Summarise or delete notes that no longer add value.
