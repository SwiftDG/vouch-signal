# Code Standards

## General
- Enforce a strict one-way data flow: Route ➔ Controller ➔ Service/Engine ➔ Database. Do not bypass layers.
- Keep controllers thin; delegate all business logic, data fetching, and API calls to the `services` or `engine` directories.
- Ensure strict idempotency at system boundaries. Reject duplicate webhook events using the `squadEventId` before initiating any database mutations.

## TypeScript
- Strict mode (`"strict": true`) is required across the entire project in `tsconfig.json`.
- Explicitly define return types for all functions, especially asynchronous operations (e.g., `Promise<number>`, `Promise<void>`).
- Never use `any`. Type unpredictable external payloads as `unknown` and validate them using custom type guards or validation libraries before processing.
- Import database types exclusively from Prisma (`@prisma/client`). Do not manually redefine database interfaces.

## Node.js & Express Architecture
- Acknowledge webhooks synchronously. Return a `200 OK` response to Squad immediately after signature verification, executing the score calculation asynchronously.
- Extract request payloads (`req.body`, `req.params`, `req.query`) exclusively inside the controller. Services must accept typed arguments, not Express request objects.
- Catch unhandled promise rejections globally using a centralized error-handling middleware to prevent process crashes.

## Security & Authentication
- Verify all incoming Squad webhook signatures using HMAC SHA-512 against the `SQUAD_SECRET_KEY` before parsing the payload.
- Require Supabase Auth JWT validation middleware on all internal trader dashboard API routes.
- Abstract all environment variables (`process.env`) into a centralized, typed configuration file and validate their existence at server startup.
- **No PII Logging**: Never log raw Personally Identifiable Information (BVN, NIN, passwords) to the server console, standard output, or error monitoring tools. Redact sensitive payload fields before logging request data.

## API Routes
- Prefix all route mounts with explicit versioning (e.g., `/api/v1/webhooks`, `/api/v1/lenders`).
- Validate and parse request input before executing any controller logic.
- Return consistent, predictable JSON response shapes across all endpoints (e.g., always returning `{ data: ..., error: string | null }`).

## Data and Storage
- Calculate the Market Reputation Score using exclusively verified transaction data from the Squad API. Never feed self-reported user inputs into the scoring engine.
- Store raw webhook payloads in the `WebhookEvent` table as an append-only audit log to guarantee idempotency.
- Track every score adjustment sequentially in the `ScoreLedger` table. Never update a trader's `currentScore` without writing a corresponding ledger entry detailing the reason.

## File Organization
- `src/controllers/` — HTTP request/response handlers and input parameter extraction.
- `src/engine/` — Core business logic, deterministic scoring calculations, and fraud detection rules.
- `src/routes/` — Express router definitions mapping specific URLs to controllers.
- `src/services/` — External API integration wrappers, specifically the Squad API communication layer.
- `src/middlewares/` — Request interceptors for authentication, signature verification, and global error handling.
- `prisma/` — The database schema definition (`schema.prisma`) and migration history.