# Backend Code Standards

## TypeScript and Express
* Keep TypeScript strict; avoid `any` and narrow dynamic request payloads.
* Routes define URLs and attach middleware/controllers.
* Controllers validate HTTP input and shape responses.
* Services own database queries and business rules.
* Reuse the existing Supabase JWT middleware for authenticated routes.

## Data and migrations
* Preserve ownership relationships for profiles, evidence, and confirmation requests.
* Generate confirmation tokens with a cryptographically secure random source.
* Make migrations additive and never edit a migration that may already be applied.
* Use explicit Prisma `select` clauses for public response data.

## Repository hygiene
* Never commit environment files, credentials, database URLs, API keys, or archives.
* Before publishing, run `git diff --check`, inspect `git status --short`, and run the relevant build and verification checks.
* Document API and schema changes in `backend/TRUST_PROFILE_API.md`.
