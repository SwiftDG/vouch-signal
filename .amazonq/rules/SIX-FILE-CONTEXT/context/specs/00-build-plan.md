# Unit 01: Project Setup & Schema Migration

## Goal
Initialize the Express/TypeScript backend environment and execute the initial Prisma database schema migration.

## Design
Strict layered directory architecture (`src/routes`, `src/controllers`, `src/services`, `src/engine`). Database models follow a normalized PostgreSQL structure as defined in `architecture-context-vouch-signal.md`.

## Implementation

### Node.js & TypeScript Environment
Initialize `package.json`, configure `tsconfig.json` for strict mode, and set up the Express server entry point (`src/server.ts`) with a basic `/health` route.

### Prisma Initialization
Define `schema.prisma` with `Trader`, `KYCProfile`, `Transaction`, `ScoreLedger`, `AjoCircle`, `CircleMember`, and `WebhookEvent` models. Generate Prisma client and run initial DB push.

## Dependencies
- `express` (Core framework)
- `typescript` (Language)
- `@types/express`, `@types/node` (Type definitions)
- `prisma`, `@prisma/client` (Database ORM)

## Verify when done
- [ ] `/health` endpoint returns 200 OK
- [ ] Prisma Studio successfully loads the generated schema
- [ ] No TypeScript errors
- [ ] No console errors
- [ ] API responds consistently via Postman/cURL
- [ ] `npm run build` passes

---

# Unit 02: Identity Generation & Secure Onboarding

## Goal
Build the onboarding flow that securely stores encrypted KYC data and generates a Squad Virtual Account for the trader.

## Design
RESTful API design. PII (BVN/NIN) must be encrypted at the service layer before reaching Prisma. Supabase JWT validation must protect the route.

## Implementation

### Security Middleware
Create `requireSupabaseAuth` middleware to validate JWTs from the internal dashboard.

### Encryption Utility
Build a Node.js `crypto` wrapper in `src/utils/crypto.util.ts` to encrypt and decrypt the 11-digit BVN.

### Squad Virtual Account Service
Implement `squad.service.ts` to make an external HTTP POST to the Squad API for virtual account creation.

### Onboarding Controller & Route
Map `POST /api/v1/traders/onboard`. Extract payload, encrypt BVN, call Squad service, and write to `Trader` and `KYCProfile` tables.

## Dependencies
- `axios` or `node-fetch` (External API requests)
- `crypto` (Built-in Node.js module)

## Verify when done
- [ ] Endpoint successfully generates a Squad Virtual Account
- [ ] BVN is visually encrypted in the database (not plain text)
- [ ] No TypeScript errors
- [ ] No console errors
- [ ] API responds consistently via Postman/cURL
- [ ] `npm run build` passes

---

# Unit 03: Webhook Intake & Idempotency Layer

## Goal
Securely receive Squad payment webhooks, verify their cryptographic signatures, and enforce strict idempotency to prevent duplicate processing.

## Design
Event-driven webhook sink. Must return a synchronous 200 OK response immediately after signature verification to prevent Squad API timeouts.

## Implementation

### Squad Signature Verification
Create `verifySquadSignature` middleware using HMAC SHA-512 against the `SQUAD_SECRET_KEY` header.

### Webhook Controller
Map `POST /api/v1/webhooks/squad`. Accept the payload and log it to the `WebhookEvent` table.

### Idempotency Check
Before logging, query `WebhookEvent` using the `squadEventId`. If it exists, abort processing and return 200 OK. If new, log it and return 200 OK while passing the payload to the asynchronous scoring engine.

## Dependencies
- None (Uses built-in `crypto` for HMAC)

## Verify when done
- [ ] Invalid signatures are rejected with 401 Unauthorized
- [ ] Duplicate `squadEventId` payloads are safely ignored
- [ ] No TypeScript errors
- [ ] No console errors
- [ ] API responds consistently via Postman/cURL
- [ ] `npm run build` passes

---

# Unit 04: AI Scoring Engine & Transaction Ledger

## Goal
Process verified `charge.completed` webhooks to dynamically calculate the Market Reputation Score and append the result to the history ledger.

## Design
Deterministic scoring boundary. Follows the Weighted-Logistic scoring algorithm. `Trader.currentScore` and `ScoreLedger` must be updated within a single Prisma database transaction.

## Implementation

### Scoring Algorithm
Implement `calculateScoreDelta` in `src/engine/scoring.engine.ts` using volume, consistency, and diversity metrics.

### Transaction Service
Parse the raw webhook payload, save the `Transaction` record, and pass the data to the Engine.

### Ledger Commit
Update the `Trader`'s score and insert a `ScoreLedger` row detailing the point change and reason using `prisma.$transaction`.

## Dependencies
- None

## Verify when done
- [ ] Simulated inbound payment increases the trader's score
- [ ] A corresponding reason string appears in `ScoreLedger`
- [ ] No TypeScript errors
- [ ] No console errors
- [ ] API responds consistently via Postman/cURL
- [ ] `npm run build` passes

---

# Unit 05: Fraud Detection & Ajo Mechanics

## Goal
Implement pattern analysis to penalize circular fraud using native PostgreSQL graph traversal, and reward consistent Ajo (recurring) payment behavior.

## Design
Interceptor pattern inside the Engine layer. Utilizes native database capabilities (Recursive CTEs) to avoid microservice overhead.

## Implementation

### Fraud Detector Module (Graph Engine)
Build `src/engine/fraud.detector.ts`. Implement a Recursive CTE via Prisma's `$queryRaw` to trace `senderAccount` histories up to 4 hops deep within a 24-hour window. If the loop returns to the origin account, apply a severe score penalty (-150).

### Ajo Recurring Handler
Extend the webhook controller to route `recurring.completed` and `recurring.failed` events to an `AjoService` that applies high-weight positive or negative score deltas.

## Dependencies
- None (Uses Prisma `$queryRaw` for SQL)

## Verify when done
- [ ] Rapid ping-pong transfers from the same sender trigger the CTE cycle detection and a score drop
- [ ] Failed recurring Ajo payment logs a penalty in the ledger
- [ ] No TypeScript errors
- [ ] No console errors
- [ ] API responds consistently via Postman/cURL
- [ ] `npm run build` passes

---

# Unit 06: Automated Credit Unlock & Disbursement

## Goal
Automatically trigger loan disbursements via the Squad Transfer API when a trader's score crosses predefined tier thresholds.

## Design
Threshold observer. The logic evaluates the `currentScore` immediately after a ledger commit and interacts with external banking rails.

## Implementation

### Tier Evaluation Logic
Create a post-score hook that checks if the new score crossed 500. Update the trader's `activeTier` if true.

### Squad Transfer Service
Implement `squad.service.ts` method to call the Squad Transfer API, utilizing the trader's virtual account as the destination.

## Dependencies
- None

## Verify when done
- [ ] Hitting a score of 500 triggers the Transfer API service
- [ ] Trader's `activeTier` updates in the database
- [ ] No TypeScript errors
- [ ] No console errors
- [ ] API responds consistently via Postman/cURL
- [ ] `npm run build` passes

---

# Unit 07: External Lender Trust API

## Goal
Expose a secure, read-only endpoint that allows external partners to query a trader's Vouch Signal score.

## Design
B2B API boundary. Requires dedicated API key management (distinct from Supabase user auth).

## Implementation

### API Key Middleware
Create `requirePartnerApiKey` middleware that checks headers against allowed partner keys stored in `.env`.

### Reputation Endpoint
Map `GET /api/v1/lenders/score/:virtualAccount`. Return a structured JSON response containing the `currentScore`, `activeTier`, and a boolean `fraudFlag`.

## Dependencies
- None

## Verify when done
- [ ] Request without valid API key returns 401 Unauthorized
- [ ] Valid request returns structured Reputation Profile JSON
- [ ] No TypeScript errors
- [ ] No console errors
- [ ] API responds consistently via Postman/cURL
- [ ] `npm run build` passes

---

# Unit 08: Demo Trigger & Simulation Environment

## Goal
Build a dedicated debug endpoint to instantly simulate transaction velocity for live pitch demonstrations without relying on external network requests.

## Design
"God Mode" bypass route. Must skip the Squad API entirely and inject directly into the internal scoring engine. Should be restricted to development/demo environments.

## Implementation

### Simulation Route
Create `POST /api/v1/debug/simulate-payments`. The payload should accept `traderId` and `count` (number of transactions to simulate).

### Engine Bypass Logic
Write a loop that generates fake `charge.completed` webhook payloads and feeds them directly into `processWebhookTransaction()` from Unit 04. This will instantly calculate the score delta and append to the `ScoreLedger` multiple times in succession.

## Dependencies
- None

## Verify when done
- [ ] Hitting the endpoint with `count: 10` instantly generates 10 ledger entries
- [ ] The trader's score visibly jumps in the database
- [ ] Endpoint is clearly segregated from production routes
- [ ] No TypeScript errors
- [ ] No console errors
- [ ] `npm run build` passes