# AGENTS.md — PlacePicker

Compact guide for future OpenCode sessions. It records only the facts an agent is likely to miss or get wrong.

## Quickstart

| Command | Description |
| --- | --- |
| `cd backend && npm install && node app.js` | Run the API on port 3000. |
| `npm install && npm run dev` | Run the frontend on port 5173. |
| `npm run lint` | Lint the frontend. |

## Requirements

- Node.js 18+.
- npm (lockfiles are committed for both apps).
- Two terminals: one for the API and one for Vite.
- A browser that allows geolocation for `localhost`.

## Environment

- No environment variables are used. API URLs are hardcoded and must be changed for deployment.
- Geolocation requires permission and a secure context (`localhost` is treated as secure).

## Architecture

- `src/App.jsx` — saved places, loading/error state, and modals.
- `src/components/AvailablePlaces.jsx` — catalogue fetch, geolocation, distance sort.
- `src/helpers/http.js` — all API calls and the hardcoded base URL.
- `src/loc.js` — distance calculation and sorting.
- `backend/app.js` — Express routes and JSON file persistence.

## Commands and build order

- Run both servers; the frontend cannot load places without the API.
- Use `npm run build` to verify the production bundle.
- `npm run lint` is the only static check; there are no tests.

## Conventions and gotchas

- Start the API from `backend/`; running it from the repository root breaks `./data` and `./images` paths.
- The frontend and backend are separate installs.
- There is no proxy; changing the API port requires editing `src/helpers/http.js`.
- Geolocation callbacks are asynchronous; the loading state must be cleared in both success and failure paths.
- The optimistic update in `handleSelectPlace` reads `userPlaces` from the render closure; rapid clicks can save a stale list.

## Memory

- Read `MEMORY.md` first to understand the current status and decisions.
- Before changing behaviour, read `constitution.md` and keep the change aligned with it.
- After a task, update `MEMORY.md` with status, decisions, and mistakes to avoid. Keep it short.
- If a rule becomes permanent, move it into this file instead of leaving it in memory.
- Never store secrets, tokens, or personal data in `MEMORY.md`.
