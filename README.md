# PlacePicker

A small React app for building a personal list of places to visit. Available places are loaded from a local Express API, sorted by distance from the browser’s location, and saved back to the server when the user adds or removes one.

The backend is deliberately minimal: two JSON files and three routes. It exists to demonstrate data fetching, optimistic updates, error rollback, modals, and geolocation in React.

> **Follow-along project.** This app was built while following **React — The Complete Guide (Academind / Maximilian Schwarzmüller)**. It is included in the portfolio as a learning exercise, not as a production product. The implementation is my own work based on the course material.

## Features

- Available places loaded from the Express API.
- Distance sorting using the browser geolocation API.
- Personal list with add and remove actions.
- Optimistic updates with rollback when the save request fails.
- Delete confirmation modal and error modal.
- Loading and empty states for both lists.
- Place images served by the backend.

## Tech stack

| Layer | Technology |
| --- | --- |
| Framework | React 18 + Vite |
| Backend | Express 4 + body-parser |
| Persistence | JSON files |
| Styling | Plain CSS |

## Project structure

```text
places-to-visit-with-backend/
├── backend/
│   ├── app.js                 # Express API (port 3000)
│   ├── data/
│   │   ├── places.json        # Available places
│   │   └── user-places.json   # Saved places
│   └── images/                # Place images served at /
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

- Node.js 18+.
- npm (lockfiles are committed for both apps).
- Two terminals: one for the API and one for Vite.
- A browser that allows geolocation for `localhost`.

### 1. Install dependencies

```bash
# Terminal 1 — backend
cd backend && npm install

# Terminal 2 — frontend
cd .. && npm install
```

### 2. Run locally

**Start the backend API**

```bash
cd backend && node app.js
```

Open http://localhost:3000.

The backend has no `start` script; run it with Node from the `backend/` directory.

**Start the frontend**

```bash
npm run dev
```

Open http://localhost:5173.

The app calls `http://localhost:3000` directly; there is no Vite proxy.

### Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start Vite on port 5173. |
| `npm run build` | Build the frontend into `dist/`. |
| `npm run preview` | Preview the production build. |
| `npm run lint` | Run ESLint over JS/JSX files. |
| `cd backend && node app.js` | Start the Express API on port 3000. |

## How it works

`App.jsx` owns the saved places, loading and error state, and the selected place for deletion. It fetches the user list on mount and passes handlers down to the two lists.

`AvailablePlaces.jsx` fetches the catalogue, asks the browser for the current position, and sorts places by distance with `sortPlacesByDistance` from `loc.js`. If geolocation fails, the list is not sorted.

Adding or removing a place updates local state first, then calls `updateUserPlaces` in `helpers/http.js`. On failure the previous list is restored and an error modal is shown, which keeps the UI responsive without hiding the failure.

`backend/app.js` serves `images/` statically and exposes `GET /places`, `GET /user-places`, and `PUT /user-places`. Reads and writes are relative to `backend/`, so the process must be started from that directory.

## Deployment

- Target: GitHub Actions can build the Vite frontend and publish `dist/` to GitHub Pages.
- The Express API needs a Node host (Render, Railway, Fly.io) or replacement with Supabase. JSON files are not durable on most hosting platforms.
- Replace the hardcoded `http://localhost:3000` URLs in `src/helpers/http.js` with an environment-driven base URL before deploying.
- The portfolio’s preferred direction for apps with a backend is Vercel for the frontend plus Supabase for data.

## Notes and limitations

- `backend/package.json` has no `start` script, so `npm start` fails there.
- The API listens on port 3000, which is the same port used by many other projects; stop other servers before starting this one.
- `user-places.json` is global, not per user. Every browser shares the same saved list.
- The backend allows all origins and only GET/PUT methods; it is a demo fixture, not a secure API.
- Removing a place closes the modal even when the save request fails; the list rolls back but the user must retry.

---

**Author:** Mario Granada
