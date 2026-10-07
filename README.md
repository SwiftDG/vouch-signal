# Vouch

Vouch is an early product hypothesis for portable business trust profiles, starting with independent online vendors and freelancers in Nigeria. A business can record completed work, ask a customer to respond to a specific description through a private one-use link, and share a public profile of customer-confirmed work. A self-reported record is not customer-confirmed. A response does not establish the respondent's identity, prevent collusion, or guarantee future work. We have not established product demand.

## Repository

`frontend/` is a React, JavaScript, Vite, Tailwind, Framer Motion, React Router, and Supabase Auth application. `backend/` is Emmanuel's Express, TypeScript, Prisma, and PostgreSQL trust-profile API. Its routes and security notes are in `backend/TRUST_PROFILE_API.md`; compare that document against the code before relying on a route description. Earlier Squad and financial-score work remains in repository history, not the active Vouch experience. The product name is Vouch even though the repository and existing deployment URL retain the old name.

The current active flow has account creation and sign-in, owner profile creation and editing, completed-work records, private customer links, customer confirm/decline responses, and public profiles that display customer-confirmed records. The Amara Cakes page at `/example/amara-cakes` is explicitly fictional. The homepage is a product explanation, not proof of real vendors or customer responses.

## Local setup

1. In `frontend/`, run `npm ci`.
2. Copy `.env.example` to `.env.local`. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from the intended Supabase project, and set `VITE_PROFILE_API_BASE_URL` to the running backend's `/api/v1` base URL. These are public client configuration values, never server secrets.
3. Configure the corresponding allowed authentication redirect URL in Supabase, including `/auth/callback` for the frontend origin.
4. Run `npm run dev` in `frontend/`. Run `npm run build` to compile a production frontend.
5. Backend setup requires its own environment and database migration configuration. Coordinate those values with Emmanuel, who owns `backend/`; do not infer a running backend from the frontend build.

Without the API base URL, profile, confirmation, and non-example public-profile requests show an unavailable state. A profile owner sees self-reported versus customer-confirmed evidence, but the current owner API does not expose pending, expired, or declined request history. Creating another link for an unconfirmed record invalidates the prior unused link. The public endpoint selects only customer-confirmed evidence and omits customer names. Do not put private customer details in a public title or description.

## Release limitations

The frontend build and static checks do not prove a live flow. Before recruiting external testers, run the real frontend and backend against an appropriate test environment with two distinct owner accounts and a separate customer browser. Verify owner isolation, public-field selection, one-use token expiry and replay, confirm and decline behavior, concurrent responses, privacy, errors, redirects, and mobile accessibility. Confirm the production frontend points to the intended backend and Supabase projects. There is no payment integration, identity verification, lending, numerical trust score, dispute/revocation UI, or defensible fraud-prevention claim in the active product.

The initial question to test is whether a specific group of vendors can use a profile and customer response to help a new buyer make a better decision than screenshots alone. This has not yet been validated.
