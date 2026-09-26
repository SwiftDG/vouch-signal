# Architecture

Scope: this file documents the backend's part of the system. Frontend architecture is owned and documented by David on `rebuild/trust-profile-mvp`.

## Tech Stack
| Layer | Technology | Role |
| :--- | :--- | :--- |
| Frontend | Vite based build, hosted on Vercel | Trust profile landing page, onboarding UI, dashboard, public profile renderer. Owned by David; exact framework details are not specified in the implementation brief. |
| Backend | Node.js, Express, TypeScript* | API routing, ownership and auth checks, Trust Profile business logic. |
| Database and Auth | Supabase (PostgreSQL + Auth) | User authentication (JWT), BusinessProfile, Evidence, and ConfirmationRequest storage. |
| Backend hosting | Render | Backend deployment target; environment variables set in the Render dashboard. |

*The implementation brief never names the backend framework explicitly, only that Supabase JWT middleware already exists. Node, Express, and TypeScript is Emmanuel's normal stack; confirm it matches whatever already exists on `rebuild/trust-profile-mvp` before scaffolding.

## Repository and Branches
* Repository: `github.com/SwiftDG/vouch-signal`
* `main`: stable branch. No direct feature work.
* `rebuild/trust-profile-mvp`: integration branch. David owns active frontend integration.
* `backend/trust-profile-api`: Emmanuel's branch for the initial backend Trust Profile API implementation, created off `rebuild/trust-profile-mvp`.

## Data Model (Required)

**BusinessProfile**
* Supabase user ID
* Unique public slug
* Business name
* Business type: `VENDOR` or `FREELANCER`
* Category (optional)
* Bio
* Location
* Contact URL
* Timestamps

**Evidence**
* Business profile ID
* Title
* Description (optional)
* Evidence type: `ORDER`, `PROJECT`, `DELIVERY`, `SERVICE`, `OTHER`
* Completed date
* Customer name (optional)
* Verification status: `SELF_REPORTED` or `CUSTOMER_CONFIRMED`
* Timestamps

**ConfirmationRequest**
* Evidence ID
* Unguessable unique token
* State: `PENDING`, `CONFIRMED`, or `EXPIRED`
* Expiry
* Confirmer name (optional)
* Confirmation time
* Timestamps

## Required Endpoints
* `POST /api/v1/profiles/onboard`
* `GET` and `PATCH /api/v1/profiles/me`
* `POST` and `GET /api/v1/profiles/me/evidence`
* `POST /api/v1/profiles/me/evidence/:evidenceId/confirmation-request`
* `GET /api/v1/public/profiles/:slug`
* `GET /api/v1/confirmations/:token`
* `POST /api/v1/confirmations/:token/confirm`

## Auth / Access Model
* All owner endpoints (everything under `/api/v1/profiles/*`) use the existing Supabase JWT middleware.
* Every profile and evidence action validates ownership against the authenticated Supabase user.
* Public and confirmation token endpoints are unauthenticated by design, but must expose only deliberately public data.

## AI / Background Task Model
None required for V1. No AI risk scoring or fraud detection unless a specific, visible, tested, and explainable rule exists, matching the product decision in `1-project-overview.md`.

## Invariants (Hard Rules)
1. Onboarding is idempotent: retrying never creates duplicate profiles.
2. The public endpoint exposes only deliberately public information: no email, no Supabase user ID, no confirmation token, no private unconfirmed evidence.
3. Confirming a request changes evidence from `SELF_REPORTED` to `CUSTOMER_CONFIRMED`, and only that.
4. Migrations are additive only. Never delete or destroy old production data.
5. No BVN, NIN, bank details, loan logic, Squad calls, or secrets, anywhere in backend code.
6. Legacy loan, score, Ajo, Jobs, Squad, and demo code still exists but must never drive the new Trust Profile journey.
7. No direct work on `main`. Open a PR into `rebuild/trust-profile-mvp`; do not merge it.
