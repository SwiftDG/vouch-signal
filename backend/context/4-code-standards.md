# Code Standards

## TypeScript Conventions
* Strict mode: `"strict": true`.
* Avoid `any`. Use `unknown` for genuinely dynamic shapes, then narrow.
* `interface` for object models, `type` for unions and aliases.

## Express (Backend) Structure
* Routes: define endpoint URLs, attach to controllers. No business logic here.
* Controllers: HTTP request parsing, response formatting, error catching.
* Services: pure business logic and database queries. Keep isolated and testable.
* Middlewares: JWT validation (the existing Supabase middleware), ownership checks, request sanitization.

## Data and Migration Rules
* Build exactly the three required models, `BusinessProfile`, `Evidence`, and `ConfirmationRequest`, with the fields and enums defined in `2-architecture.md`.
* Confirmation tokens must be unguessable and unique.
* Migrations are additive only. Never delete or destroy old production data.
* Never modify a migration file once it has been applied.

## Git and Secrets
* Never commit `.env` files, Supabase keys, database URLs, API keys, or archives.
* Before every push, run `git diff --check`, `git status --short`, and the relevant build or test where the device supports it.
* Environment variables are set only in the Render (backend) or Vercel (frontend) dashboards, never in Git.

## Branch and Documentation Workflow
* Work on `backend/trust-profile-api`, branched off `rebuild/trust-profile-mvp`.
* Document every request, response, manual test, and migration command in `backend/TRUST_PROFILE_API.md`.
* Open a PR into `rebuild/trust-profile-mvp`. Do not merge it; David reviews for data leakage, ownership rules, migration safety, and documentation clarity before merge.
