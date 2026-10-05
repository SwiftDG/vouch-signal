# Implementation Units

Each unit is one atomic step: one PR-sized piece of work, testable and reviewable on its own. Build them in order. Do not start a unit until the previous one is done and verified against `5-ai-workflow-rules.md`.

## Unit 1: Branch and Middleware Audit
* Scope: Create `backend/trust-profile-api` off `rebuild/trust-profile-mvp`. Locate and confirm the existing Supabase JWT middleware (file path, how it attaches the authenticated user to the request).
* Done when: Branch exists; middleware location and usage pattern are documented in `backend/TRUST_PROFILE_API.md`.
* Depends on: none.

## Unit 2: BusinessProfile Migration
* Scope: Additive migration creating the `BusinessProfile` table (Supabase user ID, unique public slug, business name, business type enum, optional category, bio, location, contact URL, timestamps).
* Done when: Migration applies cleanly against a copy of the existing database with no destructive statements.
* Depends on: Unit 1.

## Unit 3: Evidence Migration
* Scope: Additive migration creating the `Evidence` table (business profile ID, title, optional description, evidence type enum, completed date, optional customer name, verification status enum, timestamps).
* Done when: Migration applies cleanly; foreign key to `BusinessProfile` enforced.
* Depends on: Unit 2.

## Unit 4: ConfirmationRequest Migration
* Scope: Additive migration creating the `ConfirmationRequest` table (evidence ID, unguessable unique token, state enum, expiry, optional confirmer name, confirmation time, timestamps).
* Done when: Migration applies cleanly; token column is unique and indexed.
* Depends on: Unit 3.

## Unit 5: Onboarding Endpoint
* Scope: `POST /api/v1/profiles/onboard`. Creates a `BusinessProfile` for the authenticated user.
* Done when: Idempotent, retrying the request with the same user never creates a duplicate profile.
* Depends on: Unit 2.
user
## Unit 6: Profile Read/Update Endpoints
* Scope: `GET` and `PATCH /api/v1/profiles/me`.
* Done when: Both endpoints validate ownership against the authenticated user and return only that user's own profile.
* Depends on: Unit 5.

## Unit 7: Evidence Create/List Endpoints
* Scope: `POST` and `GET /api/v1/profiles/me/evidence`.
* Done when: Evidence is scoped to the caller's own `BusinessProfile`; new evidence defaults to `SELF_REPORTED`.
* Depends on: Unit 3, Unit 6.

## Unit 8: Confirmation Request Endpoint
* Scope: `POST /api/v1/profiles/me/evidence/:evidenceId/confirmation-request`. Generates an unguessable unique token and expiry for one evidence item.
* Done when: Ownership of the target evidence item is validated before a token is issued.
* Depends on: Unit 4, Unit 7.

## Unit 9: Public Confirmation Read Endpoint
* Scope: `GET /api/v1/confirmations/:token`. Public, unauthenticated. Returns the plain statement to confirm.
* Done when: Expired and unknown tokens return a clear error state; no private data (owner email, Supabase user ID) is exposed.
* Depends on: Unit 8.

## Unit 10: Confirmation Action Endpoint
* Scope: `POST /api/v1/confirmations/:token/confirm`. Moves the `ConfirmationRequest` to `CONFIRMED` and the linked `Evidence.verification_status` to `CUSTOMER_CONFIRMED`.
* Done when: A second confirm attempt on the same token is rejected, and an expired token is rejected.
* Depends on: Unit 9.

## Unit 11: Public Profile Endpoint
* Scope: `GET /api/v1/public/profiles/:slug`.
* Done when: Response contains only deliberately public fields, no email, Supabase user ID, confirmation token, or unconfirmed private evidence.
* Depends on: Unit 6, Unit 7.

## Unit 12: Ownership and Security Test Pass
* Scope: Tests (manual or scripted): altering IDs to reach another user's profile or evidence, reusing a confirmed token, using an expired token.
* Done when: All three are rejected with an appropriate error, matching the verification checklist in `5-ai-workflow-rules.md`.
* Depends on: Units 5 through 11.

## Unit 13: Documentation
* Scope: Write or finalize `backend/TRUST_PROFILE_API.md`: every request and response shape, manual test steps, and migration commands.
* Done when: A reviewer could exercise the whole flow from the doc alone.
* Depends on: Units 1 through 12.

## Unit 14: Pull Request
* Scope: Open a PR from `backend/trust-profile-api` into `rebuild/trust-profile-mvp`.
* Done when: PR is open, documented, and NOT merged. David reviews for data leakage, ownership rules, migration safety, and documentation clarity.
* Depends on: Unit 13.
