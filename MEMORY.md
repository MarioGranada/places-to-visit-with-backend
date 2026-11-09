# PlacePicker — Working Memory

_Last updated: 2026-11-02_

## Current status

- Available and saved place lists work against the local Express API.
- Distance sorting, optimistic updates, rollback, and modals are implemented.
- No tests or deployment workflow yet.

## Key decisions

- Kept the backend as a minimal Express + JSON fixture to match the course scope.
- Sorted places on the client so the API stays unaware of the user’s location.

## Known limitations and follow-ups

- API URLs are hardcoded to localhost.
- Saved places are global and persist in a local JSON file.
- No authentication, pagination, or place search.
- No automated tests.

## Mistakes to avoid

- Starting only the frontend leaves both lists empty.
- Running the API from the repository root breaks its relative paths.
- Forgetting that `npm start` does not exist in `backend/`.
- Editing the API port without updating the frontend URL.

## Next steps

- Move the API base URL into a Vite environment variable.
- Add a deployment workflow for the frontend and a host for the API.
- Scope saved places per user, or replace the API with Supabase.

---

Keep this file under ~60 lines. Summarise or delete notes that no longer add value.
