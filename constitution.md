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
| Backend | Express 4 + body-parser | A tiny API is enough to demonstrate fetching and persistence. |
| Persistence | JSON files | No database setup is needed for the course project. |
| Styling | Plain CSS | Keeps the focus on React data flow. |

**Rule of thumb:** a new dependency must solve a concrete problem that the current stack cannot solve cleanly. Justify it in the change that introduces it.

## Core Premises

### 1. Scope

A course project focused on effects, data fetching, optimistic UI, and error handling. It is intentionally local and single-user; authentication, per-user storage, and production hosting are out of scope.

### 2. Environment Isolation

- This project has no runtime secrets. Do not introduce `.env` files unless a real secret or environment-specific URL appears.
- If configuration is added, use environment variables and document them in the README.
- Never commit keys, tokens, database URLs, or credentials.

### 3. Architecture

- All HTTP calls go through `src/helpers/http.js`; components should not build URLs.
- `App.jsx` owns shared saved-place state; child components receive data and callbacks.
- The Express API stays a small fixture with explicit routes.

### 4. Data and State

- The backend JSON files are the source of truth for available and saved places.
- The frontend updates optimistically and must roll back on failure.
- Geolocation is optional; the app must still work when permission is denied.

### 5. Styling and UX

- Plain CSS in `src/index.css`; keep list, modal, and error styles reusable.
- Preserve the two-column layout on wide screens and stack it on small screens.
- Do not add a UI framework for this project.

### 6. Quality Gates

- `npm run lint` and `npm run build` are the gates.
- Manually test initial load, geolocation allowed and denied, add, duplicate add, remove, cancel remove, API down, and a failed save.
- Confirm the error modal and the rollback both behave correctly.

### 7. Deployment

- Frontend: static build for GitHub Pages.
- Backend: a Node host or a Supabase replacement; JSON files are not durable hosting storage.
- Move the API base URL into an environment variable before deploying.

## What to Avoid

- Hardcoding API URLs in multiple files.
- Assuming geolocation succeeds or that the user grants permission.
- Treating the JSON files as durable production storage.
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
