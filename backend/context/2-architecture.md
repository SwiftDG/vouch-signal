# Backend Architecture

## Technology
| Layer | Technology | Role |
| :--- | :--- | :--- |
| API | Node.js, Express, TypeScript | Routing, authentication, ownership checks, and Trust Profile operations. |
| Database and authentication | Supabase (PostgreSQL and Auth) | JWT authentication and persistence for profiles, evidence, and confirmation requests. |

## Data model
* `BusinessProfile` is owned by one Supabase user and has a unique public slug.
* `Evidence` belongs to a business profile and defaults to `SELF_REPORTED`.
* `ConfirmationRequest` is linked to one evidence record and has a random token, expiry, response state, and response timestamps.
* Confirmation lifecycle states are `PENDING`, `CONFIRMED`, `DECLINED`, and `EXPIRED`.

## Routes
* `POST /api/v1/profiles/onboard`
* `GET /api/v1/profiles/me`
* `PATCH /api/v1/profiles/me`
* `POST /api/v1/profiles/me/evidence`
* `GET /api/v1/profiles/me/evidence`
* `POST /api/v1/profiles/me/evidence/:id/confirmation-request`
* `GET /api/v1/public/profiles/:slug`
* `POST /api/v1/confirmations/:token`
* `POST /api/v1/confirmations/:token/respond`

## Access and data invariants
* Profile and evidence routes use the existing Supabase JWT middleware and scope all database operations to the authenticated owner.
* Public profile and customer confirmation routes require no owner credentials and return only selected public or confirmation-flow fields.
* Public responses never include email, Supabase user IDs, customer names, confirmation tokens, private notes, or other internal fields.
* A confirmed response updates evidence to `CUSTOMER_CONFIRMED`; a declined response leaves it `SELF_REPORTED`.
* A token can record only one response and cannot be used after expiry.
* Every migration is additive; previously applied migrations are immutable.
