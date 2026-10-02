# Trust Profile API Audit

## Unit 1: Branch and Middleware Audit

### Branch
- Working branch: `backend/trust-profile-api`
- Current branch confirmed by git: `backend/trust-profile-api`
- This repo snapshot does not currently contain the `rebuild/trust-profile-mvp` branch locally, so the audit is being recorded against the available local base in this checkout.

### Existing Supabase JWT middleware
The existing middleware is located at:

- `backend/src/middlewares/auth.middleware.ts`

This middleware does the following:

1. Reads the bearer token from the `Authorization` header.
2. Validates that the header starts with `Bearer `.
3. Fetches the Supabase JWKS key from `${config.supabaseUrl}/auth/v1/.well-known/jwks.json` via `jwks-rsa`.
4. Verifies the JWT using `jwt.verify` with:
   - algorithms: `['RS256', 'ES256']`
   - audience: `'authenticated'`
   - issuer: `${config.supabaseUrl}/auth/v1`
5. Reads the user UUID from the JWT `sub` claim.
6. Attaches it to the request as `req.user = { id: payload.sub }`.
7. Returns `401` for missing, invalid, or expired tokens.

Relevant code from the repository history:

```ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';
import { config } from '../config/env';

declare global {
  namespace Express {
    interface Request {
      user?: { id: string };
    }
  }
}

const client = jwksClient({
  jwksUri: `${config.supabaseUrl}/auth/v1/.well-known/jwks.json`,
  cache: true,
  rateLimit: true
});

function getKey(header: jwt.JwtHeader, callback: jwt.SigningKeyCallback) {
  client.getSigningKey(header.kid, function(err, key) {
    if (err || !key) {
      console.error('Failed to fetch Supabase Public Key:', err);
      return callback(err, undefined);
    }
    const signingKey = key.getPublicKey();
    callback(null, signingKey);
  });
}

export const requireSupabaseAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ data: null, error: 'Missing or invalid authorization header' });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(
    token,
    getKey,
    {
      algorithms: ['RS256', 'ES256'],
      audience: 'authenticated',
      issuer: `${config.supabaseUrl}/auth/v1`
    },
    (err, decoded) => {
      if (err || !decoded) {
        console.error('JWT Verification failed:', err);
        return res.status(401).json({ data: null, error: 'Invalid or expired token' });
      }

      const payload = decoded as jwt.JwtPayload;

      if (!payload.sub) {
        return res.status(401).json({ data: null, error: 'Invalid token payload' });
      }

      req.user = { id: payload.sub };
      next();
    }
  );
};
```

### Usage pattern
The authenticated route pattern attaches the existing JWT middleware before the controller:

```ts
import { Router } from 'express';
import { requireSupabaseAuth } from '../middlewares/auth.middleware';

const router = Router();

router.get('/me', requireSupabaseAuth, getMyProfile);
```

Owner-only Trust Profile endpoints attach the Supabase auth middleware before the controller and validate ownership against `req.user.id`.

### Conclusion
Unit 1 is complete in the repo sense: the branch exists, the middleware is confirmed, and the request-user attachment pattern has been documented and is ready to reuse for the Trust Profile API work.

---

## Unit 2: BusinessProfile Migration

### Schema
The additive migration introduces the `BusinessProfile` table and the `BusinessType` enum in the Prisma schema.

```prisma
enum BusinessType {
  VENDOR
  FREELANCER
}

model BusinessProfile {
  id              String       @id @default(cuid())
  supabaseUserId  String       @unique
  publicSlug      String       @unique
  businessName    String
  businessType    BusinessType
  category        String?
  bio             String?
  location        String?
  contactUrl      String?
  createdAt       DateTime     @default(now())
  updatedAt       DateTime     @updatedAt
}
```

### Migration file
- `backend/prisma/migrations/20260926000000_business_profile/migration.sql`

This migration is additive only. It creates:
- the enum `BusinessType`
- the `BusinessProfile` table
- unique indexes for `supabaseUserId` and `publicSlug`

### Done criteria
This unit is complete once the migration can be applied without destructive statements and the table is scoped to one profile per authenticated Supabase user, with a unique public slug for the public profile endpoint.

---

## Unit 3: Evidence Migration

### Schema
The additive migration introduces the `Evidence` table and the required enums for evidence type and verification status.

```prisma
enum EvidenceType {
  ORDER
  PROJECT
  DELIVERY
  SERVICE
  OTHER
}

enum VerificationStatus {
  SELF_REPORTED
  CUSTOMER_CONFIRMED
}

model Evidence {
  id                 String             @id @default(cuid())
  businessProfileId  String
  title              String
  description        String?
  evidenceType       EvidenceType
  completedDate      DateTime
  customerName       String?
  verificationStatus VerificationStatus @default(SELF_REPORTED)
  createdAt          DateTime           @default(now())
  updatedAt          DateTime           @updatedAt

  businessProfile BusinessProfile @relation(fields: [businessProfileId], references: [id])
}
```

### Migration file
- `backend/prisma/migrations/20260926000001_evidence/migration.sql`

This migration creates:
- the `EvidenceType` enum
- the `VerificationStatus` enum
- the `Evidence` table
- a foreign key to `BusinessProfile` via `businessProfileId`
- a default status of `SELF_REPORTED` for newly created evidence

### Done criteria
Unit 3 is complete when the migration applies cleanly and the `Evidence.businessProfileId` foreign key is enforced to the owning `BusinessProfile` row.

---

## Unit 4: ConfirmationRequest Migration

### Schema
The additive migration introduces the `ConfirmationRequest` table and the required confirmation state enum.

```prisma
enum ConfirmationState {
  PENDING
  CONFIRMED
  EXPIRED
}

model ConfirmationRequest {
  id             String            @id @default(cuid())
  evidenceId     String            @unique
  token          String            @unique
  state          ConfirmationState @default(PENDING)
  expiresAt      DateTime
  confirmerName  String?
  confirmedAt    DateTime?
  createdAt      DateTime          @default(now())
  updatedAt      DateTime          @updatedAt

  evidence Evidence @relation(fields: [evidenceId], references: [id])
}
```

### Migration file
- `backend/prisma/migrations/20260926000002_confirmation_request/migration.sql`

This migration creates:
- the `ConfirmationState` enum
- the `ConfirmationRequest` table
- a unique one-to-one link from `evidenceId` to the owning evidence item
- a unique `token` column with a database index via the unique constraint
- expiry and status tracking for the public confirmation flow

### Done criteria
Unit 4 is complete when the migration applies cleanly, the token column is unique and indexed, and the confirmation record is tied to exactly one evidence item.

---

## Unit 5: Onboarding Endpoint

### Request
`POST /api/v1/profiles/onboard` requires a Supabase bearer token. The authenticated user ID comes from `req.user.id`; callers cannot provide or override it in the body.

```json
{
  "businessName": "Amara Cakes",
  "businessType": "VENDOR",
  "publicSlug": "amara-cakes",
  "category": "Bakery",
  "bio": "Custom cakes for celebrations",
  "location": "Lagos",
  "contactUrl": "https://example.com/contact"
}
```

`businessName`, `businessType` (`VENDOR` or `FREELANCER`), and `publicSlug` are required. The slug must contain lowercase letters, digits, and single hyphens between segments. `category`, `bio`, `location`, and `contactUrl` are optional strings or `null`.

### Responses
Success returns HTTP 200 with the profile fields, excluding the Supabase user ID:

```json
{
  "data": {
    "id": "...",
    "publicSlug": "amara-cakes",
    "businessName": "Amara Cakes",
    "businessType": "VENDOR",
    "category": "Bakery",
    "bio": "Custom cakes for celebrations",
    "location": "Lagos",
    "contactUrl": "https://example.com/contact",
    "createdAt": "...",
    "updatedAt": "..."
  },
  "error": null
}
```

Repeating a valid request for the same authenticated user returns that user's existing profile without changing it. A slug already owned by another user returns HTTP 409. Missing/invalid bearer credentials return HTTP 401; invalid fields return HTTP 400.

### Manual verification
1. Send a valid authenticated onboarding request and record the returned profile ID.
2. Repeat the request with the same bearer token; confirm the same profile ID is returned and only one row exists for that `supabaseUserId`.
3. Try the same slug with a different authenticated user; confirm HTTP 409.
4. Omit the bearer token and try an invalid business type; confirm HTTP 401 and HTTP 400 respectively.

---

## Unit 6: Profile Read and Update

### Requests
- `GET /api/v1/profiles/me` requires a Supabase bearer token and looks up the profile using only the authenticated `req.user.id`.
- `PATCH /api/v1/profiles/me` requires a Supabase bearer token. It accepts one or more of `businessName`, `businessType`, `publicSlug`, `category`, `bio`, `location`, and `contactUrl`. The authenticated owner ID cannot be changed through the body.

Example PATCH body:

```json
{
  "businessName": "Amara Cakes and Bakes",
  "bio": "Custom cakes and desserts"
}
```

### Responses and ownership
Both successful endpoints return HTTP 200 with the caller's profile and exclude `supabaseUserId`. A missing profile returns HTTP 404; invalid PATCH data returns HTTP 400; a duplicate public slug returns HTTP 409. Unauthenticated requests return HTTP 401.

### Manual verification
1. Authenticate as user A and read/update `/api/v1/profiles/me`; confirm the response matches A's profile.
2. Include another user's ID in a PATCH body; confirm it is ignored and no other profile is changed.
3. Authenticate as a user with no profile and call GET/PATCH; confirm HTTP 404.

---

## Unit 7: Evidence Create and List

### Create request
`POST /api/v1/profiles/me/evidence` requires a Supabase bearer token.

```json
{
  "title": "Delivered birthday cake order",
  "evidenceType": "ORDER",
  "completedDate": "2026-09-20",
  "description": "Three-tier custom cake delivered to the customer",
  "customerName": "Ada"
}
```

`title`, `evidenceType` (`ORDER`, `PROJECT`, `DELIVERY`, `SERVICE`, or `OTHER`), and a valid `completedDate` are required. `description` and `customerName` are optional strings or `null`. The server selects the `BusinessProfile` using the authenticated user ID; the caller cannot supply the profile ID or verification status. New rows use the database's `SELF_REPORTED` default.

### Responses
Creation returns HTTP 201 with the new evidence, including its `SELF_REPORTED` status. `GET /api/v1/profiles/me/evidence` returns only evidence belonging to the caller's profile, ordered by completion date descending. Both endpoints return HTTP 404 if the caller has no profile, HTTP 401 without valid authentication, and HTTP 400 for invalid create data.

### Manual verification
1. Create evidence for user A and confirm `verificationStatus` is `SELF_REPORTED`.
2. List evidence as user A and confirm the new item appears.
3. List evidence as user B and confirm user A's item is absent.
4. Try to submit a different `businessProfileId` or `verificationStatus`; confirm neither field can change the ownership or default verification status.

---

## Unit 8: Confirmation Request

### Request
`POST /api/v1/profiles/me/evidence/:evidenceId/confirmation-request` requires a Supabase bearer token and has no request body. The evidence must belong to the authenticated user. Each token is generated with 32 random bytes and expires seven days after issuance.

### Response
New requests and reissued pending/expired requests return HTTP 201:

```json
{
  "data": {
    "token": "<unguessable-token>",
    "expiresAt": "..."
  },
  "error": null
}
```

The owner must share the returned token with the intended confirmer. Unknown or other-user evidence returns HTTP 404; a previously confirmed item returns HTTP 409; missing/invalid authentication returns HTTP 401. Reissuing an unconfirmed request rotates its token and expiry, invalidating the previous link.

---

## Unit 9: Public Confirmation Read

### Request
`GET /api/v1/confirmations/:token` is public and requires no authentication.

### Responses
A pending request returns HTTP 200 with a plain statement, state, and expiry. A confirmed request returns HTTP 200 with its statement and `CONFIRMED` state. Unknown tokens return HTTP 404 with state `UNKNOWN`; expired requests return HTTP 410 with state `EXPIRED`.

```json
{
  "data": {
    "kind": "available",
    "state": "PENDING",
    "statement": "Did Amara Cakes complete \"Birthday cake order\" on 2026-09-20?",
    "expiresAt": "..."
  },
  "error": null
}
```

The response contains no owner email, Supabase user ID, confirmation token, or customer name. An expired GET reports effective expiry without mutating database state.

---

## Unit 10: Confirmation Action

### Request
`POST /api/v1/confirmations/:token/confirm` is public and accepts an optional confirmer name:

```json
{ "confirmerName": "Ada" }
```

### Behavior and responses
A successful request atomically changes the confirmation request to `CONFIRMED` and its linked evidence to `CUSTOMER_CONFIRMED`, recording `confirmedAt` and the optional confirmer name. It returns HTTP 200. Unknown tokens return HTTP 404, expired links return HTTP 410, and already-confirmed/reused tokens return HTTP 409. Invalid confirmer data returns HTTP 400.

The confirmation update is conditional on the request still being `PENDING` and unexpired, preventing concurrent/repeated requests from confirming the same token twice. No other evidence fields are changed.

---

## Unit 11: Public Profile

### Request
`GET /api/v1/public/profiles/:slug` is public and requires no authentication.

### Response
HTTP 200 returns only the public slug, business name/type, category, bio, location, contact URL, and evidence fields needed to show customer-confirmed work (`title`, `description`, `evidenceType`, `completedDate`, `verificationStatus`). Evidence is filtered in the database to `CUSTOMER_CONFIRMED` only. Internal profile/evidence IDs, Supabase user ID, owner email, confirmation tokens, and customer names are never returned. Unknown slugs return HTTP 404.
