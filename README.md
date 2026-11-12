# PlacePicker

A small React app for building a personal list of places to visit. Available places are loaded from an Express API, sorted by distance from the browser’s location, and saved back to the server when the user adds or removes one.

The backend is deliberately minimal: three routes over a `places` schema in a hosted Supabase Postgres database. It exists to demonstrate data fetching, optimistic updates, error rollback, modals, and geolocation in React. The SPA and the API deploy together as one Vercel project.

> **Follow-along project.** This app was built while following **React — The Complete Guide (Academind / Maximilian Schwarzmüller)**. It is included in the portfolio as a learning exercise, not as a production product. The implementation is my own work based on the course material.

## Live demo

| | |
| --- | --- |
| **Live site** | https://places-to-visit-with-backend.vercel.app |
| **Repository** | https://github.com/MarioGranada/places-to-visit-with-backend |
| **Portfolio summary** | React place picker with geolocation-based sorting, optimistic updates with rollback and confirmation modals, persisted through an Express API to Supabase Postgres on Vercel. |

The demo is public and the saved list is shared by every visitor. It is emptied every night (04:00 UTC).

## Features

- Available places loaded from the Express API.
- Distance sorting using the browser geolocation API (default order when location is denied).
- Personal list with add and remove actions.
- Optimistic updates with rollback when the save request fails.
- Delete confirmation modal and error modal.
- Loading and empty states for both lists.
- Place images served as static files.

## Tech stack

| Layer | Technology |
| --- | --- |
| Framework | React 18 + Vite |
| Backend | Express 5 (Vercel Function in production) |
| Persistence | Supabase Postgres via postgres.js |
| Hosting | Vercel Services (frontend + backend in one project), nightly Vercel Cron |
| Styling | Plain CSS |

## Project structure

```text
places-to-visit-with-backend/
├── vercel.json                # Services (frontend, backend), /api routing, nightly cron
├── backend/
│   ├── app.js                 # Express API; every route under /api
│   ├── server.js              # Local dev server (port 3000)
│   ├── db/                    # postgres.js client, schema + catalogue seed SQL, reset helper
│   ├── routes/cron.js         # GET /api/cron/reset (needs CRON_SECRET)
│   └── scripts/db.js          # npm run db:migrate | db:reset
├── public/images/             # Place images (served by the frontend)
├── src/
│   ├── components/            # Places, AvailablePlaces, Modal, Error, ProgressBar
│   ├── helpers/http.js        # fetchAvailablePlaces, fetchUserPlaces, updateUserPlaces
│   ├── loc.js                 # Distance sorting
│   ├── App.jsx
│   └── main.jsx
├── index.html
└── vite.config.js
```

## Getting started

### Requirements

- Node.js 22 LTS.
- npm (lockfiles are committed for both apps).
- The Vercel CLI, linked to the project, to pull the database URL (`vercel link`, then `vercel env pull .env.local` in the repo root).
- Two terminals: one for the API and one for Vite.

### 1. Install dependencies

```bash
npm ci
npm ci --prefix backend
```

### 2. Configure the database

```bash
vercel env pull .env.local            # POSTGRES_URL, POSTGRES_URL_NON_POOLING, CRON_SECRET
npm run db:migrate --prefix backend   # idempotent: creates the schema and the 18 places
```

`.env.local` is gitignored. Any Postgres works locally: set `POSTGRES_URL` to it instead.

### 3. Run locally

```bash
npm run dev --prefix backend   # API on http://localhost:3000/api
npm run dev                    # Vite on http://localhost:5173
```

Vite proxies `/api` to the backend, so the SPA uses the same relative URLs as in production.

### Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start Vite on port 5173. |
| `npm run build` | Build the frontend into `dist/`. |
| `npm run preview` | Preview the production build. |
| `npm run lint` | ESLint (currently fails: the repo has no ESLint config). |
| `npm run dev --prefix backend` | API with `--watch` on port 3000. |
| `npm run db:migrate --prefix backend` | Apply the schema and catalogue (idempotent). |
| `npm run db:reset --prefix backend` | Empty the saved list. |

## How it works

`App.jsx` owns the saved places, loading and error state, and the selected place for deletion. It fetches the user list on mount and passes handlers down to the two lists.

`AvailablePlaces.jsx` fetches the catalogue, asks the browser for the current position, and sorts places by distance with `sortPlacesByDistance` from `loc.js`. If geolocation is denied, unavailable, or times out, the places are shown in their default order.

Adding or removing a place updates local state first, then calls `updateUserPlaces` in `helpers/http.js`. On failure the previous list is restored and an error modal is shown, which keeps the UI responsive without hiding the failure.

`backend/app.js` exposes `GET /api/places`, `GET /api/user-places`, and `PUT /api/user-places`. The PUT replaces the saved list; only ids of known places are stored and everything else comes from the catalogue. Server errors return a generic message; database errors are only logged on the server.

## Deployment

- **Live:** https://places-to-visit-with-backend.vercel.app
- One Vercel project with two [Services](https://vercel.com/docs/services) defined in `vercel.json`: `frontend` (Vite static build from the repo root) and `backend` (Express as a Vercel Function). `/api/*` routes to the backend, everything else to the frontend.
- Pushing to `main` deploys production.
- The database comes from the Supabase integration on Vercel, which injects `POSTGRES_URL` into every environment. `CRON_SECRET` protects the reset endpoint.
- A daily Vercel Cron calls `/api/cron/reset` at 04:00 UTC to empty the saved list.

## Notes and limitations

- The saved list is global, not per user. Every browser shares the same list until the nightly reset.
- `npm run lint` has no ESLint config to run against (pre-existing).
- Removing a place closes the modal even when the save request fails; the list rolls back but the user must retry.

---

**Author:** Mario Granada
