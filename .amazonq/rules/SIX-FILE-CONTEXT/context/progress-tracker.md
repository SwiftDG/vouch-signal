# Progress Tracker

Update this file after every meaningful implementation change.

## Current Phase
- Unit 05: Fraud Detection & Ajo Mechanics

## Current Goal
- Implement circular fraud detection via PostgreSQL Recursive CTEs and reward consistent Ajo recurring payment behaviour.

## Completed
- Defined `project-overview.md`, `architecture.md`, `code-standards.md`, `ai-workflow-rules.md`.
- ✅ **Unit 01 — COMPLETE**: `package.json`, `tsconfig.json` (strict mode), `prisma/schema.prisma` (all 7 models + enums), `src/config/env.ts` (typed env validation), `src/routes/health.route.ts`, `src/server.ts`. Prisma client generated. `npm run build` passes with zero TypeScript errors. Pushed to `main` on GitHub.
- ✅ **Unit 02 — COMPLETE**: `src/middlewares/auth.middleware.ts` (Supabase JWT), `src/utils/crypto.util.ts` (AES-256-GCM BVN encryption), `src/services/squad.service.ts` (virtual account creation), `src/controllers/trader.controller.ts`, `src/routes/trader.route.ts`. `POST /api/v1/traders/onboard` mounted. Zero TypeScript errors. Pushed to `feat/02-identity-onboarding` on GitHub.
- ✅ **Unit 03 — COMPLETE**: `src/middlewares/webhook.middleware.ts` (HMAC SHA-512), `src/controllers/webhook.controller.ts` (idempotency + async handoff), `src/routes/webhook.route.ts`. `POST /api/v1/webhooks/squad` mounted. Zero TypeScript errors.
- ✅ **Unit 04 — COMPLETE**: `src/engine/scoring.engine.ts` (calculateScoreDelta — volume/consistency/diversity), `src/services/transaction.service.ts` (Transaction save + atomic ledger commit), webhook controller wired. `server.ts` fixed to mount webhook router before `express.json()`. Zero TypeScript errors.
- **Unit 05 — IN PROGRESS**: `src/engine/fraud.detector.ts` (Recursive CTE 4-hop cycle detection, -150 penalty), `src/services/ajo.service.ts` (recurring.completed +40 / recurring.failed -60), webhook controller extended, fraud check wired into transaction service. Zero TypeScript errors.

## In Progress
- None.

## Next Up
- **Unit 06**: Tier evaluation post-score hook, Squad Transfer API disbursement.

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