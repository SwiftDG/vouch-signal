# Backend Workflow Rules

## Scope
* Work only on the backend Trust Profile API and its directly related documentation and migrations.
* Keep changes limited to profiles, evidence, confirmation requests/responses, and public profile reads.
* Do not make frontend changes as part of this backend work.

## Implementation
* Follow the route and data contracts in `2-architecture.md` and `3-api-contract.md`.
* Preserve Supabase authentication and ownership checks on every user-owned endpoint.
* Never modify an applied migration. Add a new additive migration for schema changes.
* Generate confirmation tokens with a cryptographically secure random source; enforce expiry and one-time responses in the database update.
* Select public response fields explicitly and exclude confidential/internal data.
* Document endpoint, schema, and migration changes in `backend/TRUST_PROFILE_API.md`.

## Verification
* Build the backend after changes.
* Verify owner scoping, public field selection, both confirmation decisions, token reuse, and expiry behavior where the available test setup permits.
* Run `git diff --check` before publishing.
