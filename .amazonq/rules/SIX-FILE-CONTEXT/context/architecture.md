# Architecture Context

## Stack

| Layer       | Technology                  | Role   |
| --------- | --------------------------- | ------ |
| Framework | Node.js + Express + TypeScript | Core backend environment, webhook routing, and API development |
| UI        | None (Out of Scope)         | N/A - This project is strictly backend infrastructure |
| Auth      | Supabase Auth               | Trader authentication, secure JWT generation (RS256 Asymmetric Keys via `jwks-rsa`), and session management |
| Database  | Prisma + Supabase (PostgreSQL)| Relational data mapping, storage, and database migrations |
| Integration | Squad API                   | Generation of Virtual Accounts, payment gateway, and fund disbursements |

## System Boundaries
- Use https://docs.squadco.com/ to check docs on the squad apis

- `src/routes` — Owns all API endpoints, including the external Lender API and the inbound Squad webhook listener.
- `src/routes/debug` — **[NEW]** Owns the simulation and "God Mode" endpoints used strictly for local development and hackathon demonstrations.
- `src/services` — Owns all external communication, specifically the configuration and requests to the Squad API.
- `src/engine` — Owns the core business logic (`VouchEngine.ts`). **Includes deterministic credit scoring (Variables A-D), automated Safety Brakes (Utilization Penalties, Soft Landings), the B2B Fast-Track Gateway, and must utilize native PostgreSQL graph traversal (Recursive CTEs via Prisma `$queryRaw`) for fraud detection to prevent microservice/Python overhead.**
- `prisma` — Owns the database schema (`schema.prisma`), database models, and migration histories.

## Storage Model

- **Trader (Core Identity & State)**:
  - **Purpose**: Acts as the central entity linking a user to their financial identity and current reputation.
  - **Key Fields**: `id`, `phoneNumber`, `businessName`, `squadVirtualAccount`, `currentScore` (default: 0), `activeTier`, `previousTier`, `creditLimit`, `outstandingBalance`.
  - **Why**: The system needs a fast way to query a user's current score, tier limits, and debt state for the Lender API and Safety Brakes without recalculating their entire history on every request.
- **Transaction (The Event Stream)**:
  - **Purpose**: The source of truth for all financial movements that feed the scoring engine.
  - **Key Fields**: `id`, `traderId`, `amount`, `senderAccount` (for diversity checking), `squadReference` (unique), `transactionType` (INBOUND, OUTBOUND, AJO_CONTRIBUTION), `timestamp`.
  - **Why**: The deterministic scoring engine and fraud detection modules require raw historical data to calculate consistency (Var B), network spread (Var C), actual volume (Var D), and detect circular fraud.
- **ScoreLedger (Historical Trust Tracking)**:
  - **Purpose**: An append-only log tracking every time a trader's score changes.
  - **Key Fields**: `id`, `traderId`, `scoreChange` (+15, -50), `newTotalScore`, `reason` (e.g., "Var C Network Growth", "Utilization Penalty Active"), `timestamp`.
  - **Why**: Lenders require data on score stability over time, not just the current number. This model also provides the data to render the growth chart on the Trader Dashboard.
- **AjoCircle & CircleMember (Community Trust Mechanics)**:
  - **Purpose**: Manages the Vouch Circles module and enforces lock-in periods.
  - **Key Fields (AjoCircle)**: `id`, `potSize`, `contributionAmount`, `cycleDuration`, `status`.
  - **Key Fields (CircleMember)**: `circleId`, `traderId`, `payoutPosition`, `lockInEndDate`, `hasDefaulted` (boolean).
  - **Why**: Required to track who is participating, enforce the Squad payout lock-in, and automatically flag defaults to the scoring engine.
- **WebhookEvent (Idempotency & Audit Log)**:
  - **Purpose**: Stores the raw payload of every webhook received from Squad before processing.
  - **Key Fields**: `id`, `squadEventId` (unique), `eventType`, `payload` (JSON), `processingStatus` (PENDING, PROCESSED, FAILED).
  - **Why**: Financial systems require strict idempotency. If Squad fires the same webhook twice due to a network retry, this table ensures the backend does not count the transaction or update the score twice.
- **KYCProfile (Identity Verification)**:
  - **Purpose**: Isolates and securely stores highly sensitive Personally Identifiable Information (PII) separately from the core Trader record.
  - **Key Fields**: `id`, `traderId`, `encryptedBvn`, `encryptedNin`, `bvnVerified`, `ninVerified`.
  - **Why**: Enforces data security by ensuring routine queries for scoring or dashboard rendering do not expose sensitive identity numbers.

## Auth and Access Model

- Traders authenticate to the internal dashboard using Supabase Auth (verifying **RS256 Asymmetric JWTs** via `jwks-rsa`), which issues JWTs for secure session management.
- External partners (Lenders, Banks, Social Commerce platforms) access the Vouch Signal Score API using securely issued API keys.
- Squad Webhook access is controlled via HMAC SHA-512 signature verification (`x-squad-signature`) to guarantee payloads originate directly from Squad.

## Invariants

1. **Strict Idempotency**: Webhook handlers must never process the same `squadEventId` twice; duplicate webhook requests must be gracefully ignored.
2. **Backend Isolation**: The codebase must remain strictly a backend service; no UI components or frontend rendering logic may be introduced.
3. **Data Source Authority**: The Vouch Engine must never use self-reported transaction data; all financial data feeding the score must originate exclusively from verified Squad API webhooks.
4. **Synchronous Acknowledgement**: Webhook listeners must return a `200 OK` response to Squad immediately after signature verification, pushing the actual score calculation to an asynchronous process.
5. **PII Encryption**: Sensitive identity data (BVN, NIN) must never be stored in plain text. It must be encrypted at the application layer before database insertion and decrypted only when strictly necessary for external API transmission.
6. **Production Safeguards**: Any endpoint within the `debug` or `simulation` boundary must strictly check the environment variables. If `NODE_ENV === 'production'`, the endpoint must immediately return a `403 Forbidden` to prevent artificial score manipulation on live servers.
7. **Deterministic Scoring Constraints**: The engine must calculate scores strictly based on the predefined variables (A: Age, B: Consistency, C: Network, D: Volume). Any Fast-Track bypass requires a strict >= 70% Squad volume match.
8. **Safety Brake Enforcement**: Credit limit algorithms are subordinate to risk rules. Users exceeding 80% utilization must incur compounding penalties, and negative tier drops with outstanding debt must trigger a `Repayment-Only` lock.