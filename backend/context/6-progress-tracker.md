# Progress Tracker

Update this file after every meaningful implementation change.

## Current Phase
* Pre build: backend Trust Profile API not yet started.

## Current Goal
* Scaffold `backend/trust-profile-api` off `rebuild/trust-profile-mvp` and implement the three required models plus the seven required endpoints (see `2-architecture.md`), satisfying every rule in the verification checklist in `5-ai-workflow-rules.md`.

## Current State (as of the implementation brief)
* Email signup and confirmation callback are fixed.
* The trust profile landing page and sample route `/p/amara-cakes` were introduced on `rebuild/trust-profile-mvp`.
* Old loan, score, Ajo, Jobs, Squad, and demo code still exists as legacy code and must not drive the new user journey.
* David's Termux checkout is at `~/projects/vouch` on `rebuild/trust-profile-mvp`.
* Vite 8's Android native binding crashes during a Termux production build. Termux remains suitable for Git and code edits; the laptop is used later for frontend build and visual checks. Relevant to the backend mainly for knowing when full stack integration testing becomes possible.

## Completed
* (none yet on the backend side)

## In Progress
* (not started)

## Next Up
* Clone the repo and create `backend/trust-profile-api`.
* Write the additive migration for `BusinessProfile`, `Evidence`, and `ConfirmationRequest`.
* Implement the seven required endpoints behind the existing Supabase JWT middleware.
* Write `backend/TRUST_PROFILE_API.md` alongside the implementation.
* Open a PR into `rebuild/trust-profile-mvp` (do not merge).

## Open Questions
* Exact backend framework: the brief does not name one. Confirm whether `rebuild/trust-profile-mvp` already has backend scaffolding, or whether Node, Express, and TypeScript should be introduced fresh.
* Where the existing Supabase JWT middleware currently lives in the repo.
* Confirmation token generation method (library or approach) to use for the "unguessable unique token."

## Architecture Decisions
* (leave blank for me to fill in as real decisions are made)

## Session Notes
* Target release: Vouch v0.1, October 1, 2026. Ships only when the full trust loop works without manual database editing.
* Base setup commands (Emmanuel):
  ```
  git clone https://github.com/SwiftDG/vouch-signal.git
  cd vouch-signal
  git switch rebuild/trust-profile-mvp
  git pull origin rebuild/trust-profile-mvp
  git switch -c backend/trust-profile-api
  ```
* Daily control loop: pull your branch, review open PR assumptions, complete one narrow unit, test it, commit and push, then record the next task here.
