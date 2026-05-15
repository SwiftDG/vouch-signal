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
- [x] Endpoint successfully generates a Squad Virtual Account
- [x] BVN is visually encrypted in the database (not plain text)
- [x] No TypeScript errors
- [x] No console errors
- [x] API responds consistently via Postman/cURL
- [x] `npm run build` passes

---

# Unit 03: Webhook Intake & Idempotency Layer

## Goal
Securely receive Squad payment webhooks v3, verify their cryptographic signatures, and enforce strict idempotency to prevent duplicate processing.

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
- [x] Invalid signatures are rejected with 401 Unauthorized
- [x] Duplicate `squadEventId` payloads are safely ignored
- [x] No TypeScript errors
- [x] No console errors
- [X] API responds consistently via Postman/cURL
- [X] `npm run build` passes

---

# Unit 04: The Vouch Engine Integration

## Goal
Implement the deterministic credit scoring algorithm (`VouchEngine.ts`). The engineering team must write the necessary Prisma aggregation queries to map database records into the `UserData` object expected by the engine, and unit-test the exact mathematical boundaries.

## Design
The scoring engine is implemented as a standalone TypeScript class in the service layer (`src/services/engine/VouchEngine.ts`). It accepts sanitized `UserData` and returns a structured `FinalProfile` object. The Service Layer is responsible for heavy database aggregation, while the Engine is strictly responsible for the math.

## Implementation Details

### The DB Aggregation Requirements (Service Layer Job)
Before calling the engine, the backend must query the transaction history and provide:
* `months_active`: Calculated from the user's creation date.
* `unique_tx_this_month`: The count of unique Squad IDs in the last 30 days.
* `daily_consistency_points`: Sum of points over 30 days (unique senders * 3), capped at 15 points per day.
* `repeat_senders_this_month`: Count of senders in the last 30 days who also have history prior to this window.
* `new_senders_this_month`: Count of brand new senders in the last 30 days.
* `actual_30_day_volume`: Summed Naira value of all successful Squad transactions in the last 30 days.
* `outstanding_balance`, `previous_tier`, and `months_in_default` to drive the utilization penalty edge cases.

### The Algorithm Structure (Engine Math)
1. **Variable A (Age & Activity):** +12 points per active month, capped at 150 points. Requires `unique_tx_this_month` >= 10 to activate.
2. **Variable B (Consistency):** Driven by `daily_consistency_points`. Capped at 300 points.
3. **Variable C (Network Retention):** Repeat senders * 13 + New senders * 7. Capped at 250 points.
4. **Variable D (Volume Scaling):** Base Score (A+B+C) maps to an initial tier. Points = (`actual_30_day_volume` / Target Volume) * Max Volume Points. Tier 1 gets 0 volume points.
5. **Safety Brakes (Risk Assessment):**
   * **Utilization Penalty:** If debt > 80% of limit, applies a -50 point penalty. Compounds by multiplying by `(1 + months_in_default)`.
   * **Soft Landing:** If an organic tier drop leaves debt > new limit, waives the penalty and sets state to `Repayment-Only`.

### B2B Fast-Track Logic
- Run `evaluateB2bFastTrack()` strictly on Day 31 of a business's probation.
- Requires a 70% threshold (`squadVolume` / `claimedVolume` >= 0.70).
- True: Unlocks target tier instantly. False: Falls back to organic score via `calculateFinalProfile()`.

## Dependencies
- Prisma Client (for complex aggregations and time-window queries).
- Jest (Crucial for testing the exact mathematical caps and edge cases).

## Verify when done
- [x] `calculateVariableA` properly zeros out if `unique_tx_this_month` is 9 or less.
- [x] `calculateVariableC` mathematically caps at exactly 250, even if there are 100 repeat senders.
- [x] Tier 1 users strictly receive 0 volume points, regardless of transaction sizes.
- [x] The `processSafetyBrakes` correctly shifts a user to `Repayment-Only` if their tier drops below their outstanding debt limit, without applying the -50 penalty.
- [x] B2B Fast-Track successfully reverts to organic scoring if the volume match is 69.9% or lower.
- [x] Unit tests cover penalty compounding (e.g., 2 months in default = -100 points).

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
- [x] Rapid ping-pong transfers from the same sender trigger the CTE cycle detection and a score drop
- [x] Failed recurring Ajo payment logs a penalty in the ledger
- [x] No TypeScript errors
- [x] No console errors
- [x] API responds consistently via Postman/cURL
- [x] `npm run build` passes

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
- [x] Hitting a score of 500 triggers the Transfer API service
- [x] Trader's `activeTier` updates in the database
- [x] No TypeScript errors
- [x] No console errors
- [x] API responds consistently via Postman/cURL
- [x] `npm run build` passes

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
- [x] Request without valid API key returns 401 Unauthorized
- [x] Valid request returns structured Reputation Profile JSON
- [x] No TypeScript errors
- [x] No console errors
- [x] API responds consistently via Postman/cURL
- [x] `npm run build` passes

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
- [x] Hitting the endpoint with `count: 10` instantly generates 10 ledger entries
- [x] The trader's score visibly jumps in the database
- [x] Endpoint is clearly segregated from production routes
- [x] No TypeScript errors
- [x] No console errors
- [x] `npm run build` passes