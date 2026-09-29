# Proposed profile API contract

This is a proposal for David's frontend and Emmanuel's new backend, not an implemented API. Confirm exact fields together before integration. The frontend currently calls the endpoints below when `VITE_PROFILE_API_BASE_URL` is configured.

Use JSON `{ "data": ... }` on success and `{ "error": "Safe human-readable message" }` on failure. Do not expose raw internal errors.

| Endpoint | Authentication | Request and response |
| --- | --- | --- |
| `GET /profiles/me` | Supabase bearer token | `200 {data: profile}` or `404` for an account without a profile. Never fall back to another user's profile. |
| `POST /profiles` | Supabase bearer token | Send `{name, type: "vendor" or "freelancer", location, description}`; return `{data: profile}`. Enforce ownership, validation, and one profile per account. |
| `GET /profiles/:slug` | Public | Return only published profile fields and public records. Use `404` for private or absent profiles. |
| `GET /confirmations/:token` | Token in URL, no account | Return `{data: {businessName, title, description}}` for a valid, pending request. No customer contact details. |
| `POST /confirmations/:token/respond` | Token in URL, no account | Send `{decision: "confirmed" or "declined"}`; return `{data: {status}}`. Single-use and expiry required. |

Profile shape: `{id, slug, name, type, location, description, records: []}`.

A public record should have `{id, title, completedAt, status}`, where status is `self_reported`, `pending`, `confirmed`, or `declined`. Avoid a generic `verified` label. Do not publish private descriptions, customer identities, contact details, token values, or private audit notes. A customer response is a claim about an interaction, not identity verification or proof against collusion.

The dashboard deliberately does not expose creation or invitation actions for work records yet because their request contract, visibility controls, consent, revocation, and dispute handling need to be agreed. The proposed follow-up flow is: the owner creates a private record, chooses a public summary, sends a single-use request, sees pending/declined/confirmed states, and can unpublish or flag a dispute. Add audit events and abuse rate limits. Never let a browser choose an owner ID or set confirmation status.

## Release checks

- Use two separate vendor accounts, a customer in a separate browser, and an anonymous viewer. Verify that one vendor cannot read or mutate the other's private records or requests.
- Test missing, expired, used, and malformed tokens. Concurrent submissions must result in at most one accepted response. Keep tokens out of public page data and logs.
- Check private-by-default record visibility, consent copy, customer data omission, publish/unpublish, revocation or disputes, and audit history.
- Exercise loading, 401, 403, 404, 409, 429, 500, network failure, and simultaneous sessions. Verify CORS for the actual frontend origins.
- Only after a successful real flow should the homepage copy change from a product under development to a working product claim.
