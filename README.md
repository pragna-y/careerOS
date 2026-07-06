# CareerOS — MVP

A scoped-down demonstration of an event-sourced application-tracking system with
human-in-the-loop correction. Built as a time-boxed MVP.

## What this demonstrates
- React + TypeScript frontend with a typed API client (`fetch`, not a library — deliberate at this scope).
- A custom hook (`useOptimisticCorrection`) implementing a real optimistic-update-with-rollback
  pattern against a genuine network request (not a simulated timeout).
- Express + TypeScript backend, in-memory data store, two REST endpoints (`GET /events`, `PATCH /events/:id`).
- Confidence-scored status classification (precomputed on mock data at this scope).
- A live "Simulate failure" control on each row so the rollback path can be demonstrated
  deterministically instead of relying on random chance.

## What was deliberately cut, and why
This build intentionally omits authentication, a persistent database, a message queue,
a live LLM classification call, and CI/CD. Those are part of the full designed
architecture (see the accompanying Engineering Blueprint) but are out of scope for a
time-boxed build. Each was cut because it adds infrastructure risk or setup time without
adding to what this specific demo needs to show: real full-stack API integration and a
correctly implemented optimistic-UI pattern.

## Running it

**Terminal 1 — API**
```
cd api
npm install
npm run dev
```
Runs on http://localhost:5000

**Terminal 2 — Web**
```
cd web
npm install
npm run dev
```
Runs on http://localhost:5173 (Vite's default) — open it in your browser.

The frontend expects the API at `http://localhost:4000` (see `web/src/api.ts`).

## Demo script
1. Load the app — events fetch from the live API.
2. Use the "Correct status…" dropdown on any row — see the immediate optimistic update.
3. Click "Simulate failure" on any row — see the optimistic update apply, then roll back
   with a visible error message after the real (awaited) request fails.
