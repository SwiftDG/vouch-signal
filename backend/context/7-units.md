# Backend Work Units

The Trust Profile backend consists of the following independently verifiable areas:

1. Authentication and ownership enforcement for profile and evidence endpoints.
2. Idempotent profile onboarding and authenticated profile read/update.
3. Owner-scoped evidence creation and listing.
4. Owner-scoped, random, time-limited confirmation-request generation.
5. Public confirmation details and one-time confirmed/declined responses.
6. Public profile reads with explicit allowlisted fields and customer-confirmed evidence only.
7. Additive database migrations, API documentation, and verification.

The required route and response contract is documented in `backend/TRUST_PROFILE_API.md`. See `2-architecture.md`, `3-api-contract.md`, and `5-ai-workflow-rules.md` for the invariants and implementation rules.
