# Progress Tracker

Update this file after every meaningful implementation change.

## Current Phase
- Unit 01: Project Setup & Schema Migration

## Current Goal
- Initialize the Express/TypeScript backend environment and execute the initial Prisma database schema migration.

## Completed
- Defined `project-overview.md`, `architecture.md`, `code-standards.md`, `ai-workflow-rules.md`.
- **Unit 01**: `package.json`, `tsconfig.json` (strict mode), `prisma/schema.prisma` (all 7 models + enums), `src/config/env.ts` (typed env validation), `src/routes/health.route.ts`, `src/server.ts`. Prisma client generated. `npm run build` passes with zero TypeScript errors.

## In Progress
- None.

## Next Up
- **Unit 02**: Security middleware (Supabase JWT), crypto utility (BVN encryption), Squad virtual account service, `POST /api/v1/traders/onboard` endpoint.
- Run `npx prisma db push` once Supabase direct connection is reachable (port 5432 must be open from your network).

## Open Questions
- What specific metrics (e.g., exact weighting of transaction consistency vs. Ajo defaults) will the AI Scoring Engine use, or should that be stubbed initially?
- Does the user have the Squad Sandbox API keys ready for local `.env` configuration?

## Architecture Decisions
- **Strict Idempotency:** Implemented via the `WebhookEvent` table to prevent duplicate transaction processing from Squad API retries.
- **Synchronous Handoff:** Webhook routes will immediately return a `200 OK` to Squad and process score updates asynchronously to prevent timeout errors.
- **Data Source Authority:** The scoring engine is mathematically restricted to using only verified Squad webhook data; self-reported income is strictly prohibited.

## Session Notes
- The architecture requires a strict Controller-Service pattern. Controllers handle routing and extraction, while Services handle external APIs and Prisma mutations. 
- UI development is explicitly out of scope. The deliverable is a functional API backend.