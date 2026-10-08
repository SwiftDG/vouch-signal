# Trust Profile API

The backend supports business profile onboarding and updates, evidence records, customer confirmation, and public profile reads.

## Routes

| Method | Route | Access |
| --- | --- | --- |
| `POST` | `/api/v1/profiles/onboard` | Authenticated owner |
| `GET` | `/api/v1/profiles/me` | Authenticated owner |
| `PATCH` | `/api/v1/profiles/me` | Authenticated owner |
| `POST` | `/api/v1/profiles/me/evidence` | Authenticated owner |
| `GET` | `/api/v1/profiles/me/evidence` | Authenticated owner |
| `POST` | `/api/v1/profiles/me/evidence/:id/confirmation-request` | Authenticated owner |
| `GET` | `/api/v1/public/profiles/:slug` | Public |
| `GET` | `/api/v1/confirmations/:token` | Public |
| `POST` | `/api/v1/confirmations/:token/respond` | Public |

Every owner route uses Supabase JWT authentication. Profile and evidence queries are scoped to the authenticated user's `req.user.id`; clients cannot select another owner's record by supplying a user ID.

Successful responses use `{ "data": ..., "error": null }`. Errors use `{ "data": ..., "error": "..." }`.

## Profile onboarding and maintenance

`POST /api/v1/profiles/onboard` accepts `businessName`, `businessType` (`VENDOR` or `FREELANCER`), and `publicSlug`. Optional fields are `category`, `bio`, `location`, and `contactUrl`. Repeating onboarding for the same authenticated user returns the existing profile without modifying it.

`GET /api/v1/profiles/me` reads the authenticated user's profile. `PATCH /api/v1/profiles/me` accepts one or more editable profile fields: `businessName`, `businessType`, `publicSlug`, `category`, `bio`, `location`, and `contactUrl`. Supabase user IDs cannot be changed via request data.

The profile responses exclude `supabaseUserId`. Missing profiles return HTTP 404, invalid input returns HTTP 400, duplicate slugs return HTTP 409, and missing/invalid authentication returns HTTP 401.

## Evidence

`POST /api/v1/profiles/me/evidence` accepts:

```json
{
  "title": "Delivered birthday cake order",
  "evidenceType": "ORDER",
  "completedDate": "2026-09-20",
  "description": "Three-tier custom cake delivered to the customer",
  "customerName": "Ada"
}
```

`title`, `evidenceType` (`ORDER`, `PROJECT`, `DELIVERY`, `SERVICE`, or `OTHER`), and a valid `completedDate` are required. `description` and `customerName` are optional strings or `null`. Ownership and initial `SELF_REPORTED` status are set by the server.

`GET /api/v1/profiles/me/evidence` returns only the authenticated owner's evidence ordered by completion date descending. It includes the request state and timestamps when a request exists, but never its token. A pending request past `expiresAt` should be displayed as expired even before its state is updated on read. Evidence create/list returns HTTP 404 if the user has no profile. Owner evidence responses may include the customer name; this field is never included in public responses.

## Confirmation request

`POST /api/v1/profiles/me/evidence/:id/confirmation-request` has no body. The evidence must belong to the authenticated owner. A token is generated using 32 cryptographically random bytes and expires seven days after issue. The HTTP 201 response contains the token and expiry; the owner shares the token with the intended customer. The token is not returned by public read or response endpoints.

Reissuing a pending or expired request rotates its token and expiry, invalidating the previous token. Confirmed and declined evidence cannot be requested again; a decline remains in the audit record. Evidence belonging to another user or an unknown ID returns HTTP 404.

## Customer confirmation

`GET /api/v1/confirmations/:token` returns the statement needed to render the confirmation prompt:

```json
{
  "data": {
    "kind": "available",
    "state": "pending",
    "statement": "Did Amara Cakes complete \"Birthday cake order\" on 2026-09-20?",
    "expiresAt": "..."
  },
  "error": null
}
```

Supported lifecycle states are `pending`, `confirmed`, `declined`, and `expired`. Unknown tokens return HTTP 404. Expired tokens return HTTP 410 and their pending request is marked expired. A consumed token cannot load the prompt again or accept another response; both calls return HTTP 409 with its terminal state.

`POST /api/v1/confirmations/:token/respond` accepts exactly one decision field:

```json
{ "decision": "confirmed" }
```

The only supported decisions are `confirmed` and `declined`.

* `confirmed`: atomically marks the request `CONFIRMED`, records `confirmedAt`, and updates linked evidence to `CUSTOMER_CONFIRMED`.
* `declined`: atomically marks the request `DECLINED` and records `declinedAt`. Linked evidence remains `SELF_REPORTED`.

Successful responses return the lowercase state and `respondedAt`. Invalid decisions or payloads return HTTP 400. Unknown tokens return HTTP 404, expired tokens return HTTP 410, and already-used tokens return HTTP 409. The update is conditional on a pending, unexpired request, so concurrent responses cannot consume the token twice.

## Public profile

`GET /api/v1/public/profiles/:slug` returns only the profile's public slug, business name/type, category, bio, location, contact URL, and its customer-confirmed evidence (`title`, `description`, `evidenceType`, `completedDate`, and `verificationStatus`). Evidence is filtered to `CUSTOMER_CONFIRMED` in the database. Unknown slugs return HTTP 404.

Public profile and confirmation responses never expose owner email, Supabase user IDs, customer names, confirmation tokens, private notes, internal profile/evidence IDs, or other unselected internal fields. Prisma queries use explicit selections for these responses.

## Schema changes and verification

Database migrations are additive. Previously applied migration files must not be changed. The follow-up migration `prisma/migrations/20261005000000_add_declined_confirmation/migration.sql` adds the `DECLINED` enum value and nullable `declinedAt` timestamp; the original confirmation migration remains unchanged.

Run the backend build and the database-backed security check against an isolated test database with the migrations applied:

```sh
npm run build
npm run verify:security
```

Before publishing, run `git diff --check` and the available trust-profile verification scripts. Verify owner scoping, public field selection, both customer decisions, response replay, and token expiry.
