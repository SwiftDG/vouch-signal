# Vouch

Vouch is an early product hypothesis for portable business profiles for independent vendors and freelancers, starting in Nigeria. The intended flow is to record completed work, ask a customer to respond to a short request, and show public evidence with clear provenance. We have not established product demand or a defensible trust score.

The active frontend uses React, Vite, Tailwind, Framer Motion, React Router, and Supabase Auth. The older Express, Prisma, and PostgreSQL backend in `backend/` implements a separate Squad, scoring, and lending prototype. It does not implement the profile and customer confirmation contract in `docs/profile-api-contract.md`. Emmanuel owns the backend. The new frontend must not treat legacy scoring responses as profile evidence.

## Run the frontend

1. `cd frontend && npm ci`
2. Copy `frontend/.env.example` to `frontend/.env.local` and set the public Supabase project URL and anon key. Configure the allowed redirect URL in Supabase Auth.
3. Use `npm run dev` for local development or `npm run build` on a compatible machine to check production compilation.

`VITE_PROFILE_API_BASE_URL` is optional during presentation review. Without a compatible backend, signed-in accounts show an unavailable state; public non-example profiles and customer links cannot load. The Amara Cakes page at `/example/amara-cakes` is fictional. It must never be used as evidence of a real vendor or response.

## Current scope and limits

Supabase signup, sign-in, and email callback are inherited from the previous release. A signed-in dashboard can load or create a profile only when the new API contract is implemented and configured. The public page and confirmation screen are client interfaces for that contract.

We have **not** verified a real customer confirmation, profile ownership, privacy enforcement, simultaneous users, or a live end-to-end flow. The legacy backend remains in the repository for deliberate migration and should not be deployed as the new profile service by accident.

The active frontend excludes old loan, score, jobs, Ajo, and Squad routes. Before a public test, verify the checklist in `docs/profile-api-contract.md` with separate accounts and customers. Do not put customer contact details on a public record.
