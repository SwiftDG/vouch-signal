# UI Context - Frontend Integration Guide

## Overview
This document defines the data structures, API endpoints, and integration patterns for the Vouch Signal frontend. The backend provides a complete RESTful API for trader onboarding, score tracking, and external partner integration.

---

## API Base URL
- **Development**: `http://localhost:3000/api/v1`
- **Production**: `https://your-domain.com/api/v1`

---

## Authentication

### Internal Dashboard (Traders)
- **Method**: Supabase JWT tokens
- **Header**: `Authorization: Bearer <supabase_jwt_token>`
- **Used for**: Trader onboarding, dashboard access

### External Partners (Lenders)
- **Method**: API Keys
- **Header**: `x-api-key: <partner_api_key>`
- **Used for**: Score queries by banks/lenders

---

## Core API Endpoints

### 1. Health Check
```
GET /health
```
**Response:**
```json
{
  "status": "OK",
  "timestamp": "2026-05-15T06:00:00.000Z"
}
```

### 2. Trader Onboarding
```
POST /traders/onboard
Headers: Authorization: Bearer <jwt_token>
```
**Request:**
```json
{
  "phoneNumber": "08012345678",
  "businessName": "Emma Fashion Store",
  "firstName": "Emma",
  "lastName": "Olayinka",
  "email": "emma@example.com",
  "bvn": "12345678901",
  "dob": "01/15/1990",
  "address": "123 Lagos Street, Victoria Island",
  "gender": "2",
  "beneficiaryAccount": "1234567890"
}
```
**Response:**
```json
{
  "data": {
    "traderId": "cmp5qqb0x0000x1kyvrvgvs9a",
    "virtualAccount": "3582398343"
  },
  "error": null
}
```

### 3. External Score Query (For Lenders)
```
GET /lenders/score/:virtualAccount
Headers: x-api-key: <partner_key>
```
**Response:**
```json
{
  "data": {
    "virtualAccount": "3582398343",
    "currentScore": 420,
    "activeTier": 2,
    "creditLimit": 50000,
    "fraudFlag": false,
    "accountState": "Active",
    "lastUpdated": "2026-05-15T06:00:00.000Z"
  },
  "error": null
}
```

### 4. Demo Simulation (Development Only)
```
POST /debug/simulate-history
```
**Request:**
```json
{
  "traderId": "cmp5qqb0x0000x1kyvrvgvs9a"
}
```
**Response:**
```json
{
  "message": "Time skip successful. 30 days of data injected.",
  "injectedTransactions": 93,
  "newProfile": {
    "Final_Score": 750,
    "Current_Tier": 3,
    "Credit_Limit": 150000,
    "Account_State": "Active"
  },
  "trader": {
    "id": "cmp5qqb0x0000x1kyvrvgvs9a",
    "currentScore": 750,
    "activeTier": 3,
    "creditLimit": 150000
  }
}
```
**Note:** This endpoint generates 30 days of perfectly crafted transaction history (93 transactions totaling ₦225,000) designed to maximize VouchEngine variables and instantly elevate a trader to Tier 3. Only available in development mode.

### 5. Trader Score Query
```
GET /traders/score
Headers: Authorization: Bearer <jwt_token>
```
**Response:**
```json
{
  "data": {
    "traderId": "cmp5qqb0x0000x1kyvrvgvs9a",
    "businessName": "Demo Fashion Store",
    "virtualAccount": "9012345678",
    "currentScore": 750,
    "activeTier": 3,
    "creditLimit": 150000,
    "outstandingBalance": 0,
    "lastUpdated": "2026-05-15T12:00:00.000Z"
  },
  "error": null
}
```

### 6. Transaction History
```
GET /traders/transactions
Headers: Authorization: Bearer <jwt_token>
```
**Response:**
```json
{
  "data": {
    "traderId": "cmp5qqb0x0000x1kyvrvgvs9a",
    "transactions": [
      {
        "id": "tx_001",
        "amount": 2500,
        "senderAccount": "0123456789",
        "squadReference": "SIM_SQ_abc123",
        "transactionType": "INBOUND",
        "timestamp": "2026-05-15T11:30:00.000Z"
      }
    ]
  },
  "error": null
}
```

### 7. Loan Acceptance
```
POST /loans/accept
Headers: Authorization: Bearer <jwt_token>
```
**Request:**
```json
{
  "amount": 25000,
  "traderId": "cmp5qqb0x0000x1kyvrvgvs9a"
}
```
**Response:**
```json
{
  "data": {
    "traderId": "cmp5qqb0x0000x1kyvrvgvs9a",
    "loanAmount": 25000,
    "transactionReference": "LOAN_1778729253_x1kyvrvg",
    "newOutstandingBalance": 25000,
    "availableCreditRemaining": 125000,
    "disbursementStatus": "completed"
  },
  "error": null
}
```

### 8. Real-Time Score Stream (SSE)
```
GET /traders/score/stream
Headers: Authorization: Bearer <jwt_token>
```
**Response (Server-Sent Events):**
```
data: {"currentScore":750,"activeTier":3,"creditLimit":150000,"outstandingBalance":25000,"lastUpdated":"2026-05-15T12:05:00.000Z","timestamp":"2026-05-15T12:05:00.000Z"}

data: {"currentScore":755,"activeTier":3,"creditLimit":150000,"outstandingBalance":25000,"lastUpdated":"2026-05-15T12:05:05.000Z","timestamp":"2026-05-15T12:05:05.000Z"}
```
**Note:** Updates every 5 seconds with current trader state

---

## Data Models

### Trader Profile
```typescript
interface TraderProfile {
  id: string;
  phoneNumber: string;
  businessName: string;
  squadVirtualAccount: string;
  currentScore: number;
  activeTier: number;
  creditLimit: number;
  outstandingBalance: number;
  createdAt: string; // ISO date
  updatedAt: string; // ISO date
}
```

### Score Breakdown
```typescript
interface ScoreBreakdown {
  Var_A_Age: number;        // Max 150 pts
  Var_B_Consistency: number; // Max 300 pts
  Var_C_Network: number;     // Max 250 pts
  Var_D_Volume: number;      // Tier-dependent
}
```

### Tier System
```typescript
interface TierData {
  level: 1 | 2 | 3 | 4;
  name: "Probation" | "Bronze" | "Silver" | "Gold";
  scoreRange: string;
  creditLimit: number;
  targetVolume: number;
  benefits: string[];
}

const TIERS: TierData[] = [
  {
    level: 1,
    name: "Probation",
    scoreRange: "0-399",
    creditLimit: 0,
    targetVolume: 0,
    benefits: ["Basic Virtual Account", "Score Building"]
  },
  {
    level: 2,
    name: "Bronze", 
    scoreRange: "400-599",
    creditLimit: 50000,
    targetVolume: 50000,
    benefits: ["₦50K Credit Limit", "Emergency Microloans"]
  },
  {
    level: 3,
    name: "Silver",
    scoreRange: "600-799", 
    creditLimit: 150000,
    targetVolume: 150000,
    benefits: ["₦150K Credit Limit", "Inventory Financing"]
  },
  {
    level: 4,
    name: "Gold",
    scoreRange: "800-1000",
    creditLimit: 500000,
    targetVolume: 500000,
    benefits: ["₦500K Credit Limit", "BNPL", "Premium Rates"]
  }
];
```

### Transaction History
```typescript
interface Transaction {
  id: string;
  amount: number; // In Naira
  senderAccount: string | null;
  squadReference: string;
  transactionType: "INBOUND" | "OUTBOUND" | "AJO_CONTRIBUTION";
  timestamp: string; // ISO date
}
```

### Score Ledger Entry
```typescript
interface ScoreLedgerEntry {
  id: string;
  scoreChange: number;
  newTotalScore: number;
  reason: string;
  timestamp: string; // ISO date
}
```

### Loan Acceptance Response
```typescript
interface LoanAcceptanceResponse {
  traderId: string;
  loanAmount: number;
  transactionReference: string;
  newOutstandingBalance: number;
  availableCreditRemaining: number;
  disbursementStatus: 'completed' | 'failed';
}
```

### Real-Time Score Update (SSE)
```typescript
interface ScoreStreamData {
  currentScore: number;
  activeTier: number;
  creditLimit: number;
  outstandingBalance: number;
  lastUpdated: string; // ISO date
  timestamp: string; // ISO date
}
```

---

## Error Handling

### Standard Error Response
```json
{
  "data": null,
  "error": "Error message here"
}
```

### Common HTTP Status Codes
- `200` - Success
- `201` - Created (onboarding)
- `400` - Bad Request (invalid payload)
- `401` - Unauthorized (missing/invalid auth)
- `404` - Not Found (trader not found)
- `500` - Internal Server Error

---

## Real-Time Updates

### Webhook Integration (Optional)
If implementing real-time score updates, the frontend can listen for:
- Score changes
- Tier unlocks
- Loan disbursements
- Fraud alerts

**Webhook Payload Example:**
```json
{
  "event": "score_updated",
  "traderId": "cmp5qqb0x0000x1kyvrvgvs9a",
  "data": {
    "oldScore": 350,
    "newScore": 420,
    "tierUnlocked": 2,
    "creditLimit": 50000
  }
}
```

---

## UI Component Suggestions

### 1. Score Display Component
```typescript
interface ScoreDisplayProps {
  score: number;
  tier: number;
  breakdown: ScoreBreakdown;
  showAnimation?: boolean;
}
```

### 2. Tier Progress Component
```typescript
interface TierProgressProps {
  currentTier: number;
  currentScore: number;
  nextTierThreshold: number;
  creditLimit: number;
}
```

### 3. Transaction Feed Component
```typescript
interface TransactionFeedProps {
  transactions: Transaction[];
  virtualAccount: string;
  onRefresh: () => void;
}
```

### 4. Loan Unlock Modal
```typescript
interface LoanUnlockProps {
  isOpen: boolean;
  loanAmount: number;
  newTier: number;
  onAccept: () => void;
  onDecline: () => void;
}
```

---

## Environment Variables (Frontend)

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3000/api/v1
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key

# Feature Flags
VITE_ENABLE_REAL_TIME=true
VITE_ENABLE_ANIMATIONS=true
VITE_DEBUG_MODE=false
```

---

## Integration Notes

### 1. Score Calculation
- Scores are calculated deterministically from complete transaction history
- No incremental updates - always fetch fresh data
- Score updates happen automatically via Squad webhooks

### 2. Virtual Account Display
- Always show the full 10-digit virtual account number
- Format as: `3582 398 343` for readability
- Include copy-to-clipboard functionality

### 3. Currency Formatting
- All amounts are in Naira (₦)
- Use `Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' })`
- Example: ₦50,000.00

### 4. Date Formatting
- All dates are ISO strings from backend
- Convert to local timezone for display
- Use relative time for recent activities ("2 hours ago")

### 5. Error States
- Handle network failures gracefully
- Show retry buttons for failed requests
- Display user-friendly error messages

---

## Security Considerations

### 1. Token Management
- Store Supabase JWT securely (httpOnly cookies recommended)
- Implement token refresh logic
- Clear tokens on logout

### 2. Data Validation
- Validate all form inputs client-side
- Sanitize user inputs before display
- Never expose sensitive data in console logs

### 3. API Key Protection
- Partner API keys should never be exposed to frontend
- Use server-side proxy for external partner integrations

---

## Testing Data

### Sample Trader Data
```json
{
  "phoneNumber": "08012345678",
  "businessName": "Emma Fashion Store", 
  "virtualAccount": "3582398343",
  "currentScore": 420,
  "activeTier": 2,
  "creditLimit": 50000
}
```

### Sample Transactions
```json
[
  {
    "amount": 5000,
    "senderAccount": "Customer A",
    "timestamp": "2026-05-15T10:30:00Z",
    "transactionType": "INBOUND"
  },
  {
    "amount": 3000,
    "senderAccount": "Customer B", 
    "timestamp": "2026-05-15T14:15:00Z",
    "transactionType": "INBOUND"
  }
]
```

## Unit 09 Testing Instructions

### Prerequisites
1. **Server Running**: `npm run dev` in backend directory
2. **Fresh JWT Token**: Run `node get-fresh-token.mjs` or use development bypass
3. **Trader Created**: Use Unit 02 onboarding to get a `traderId`
4. **Demo Data**: Run Unit 08 simulation to populate trader with Tier 3 status

### Test Sequence

#### **Step 1: Create & Elevate Trader**
```bash
# 1. Create trader (Unit 02)
POST http://localhost:3000/api/v1/traders/onboard
Headers: Authorization: Bearer JWT_TOKEN
Body: { trader onboarding data }
# → Get traderId from response

# 2. Elevate to Tier 3 (Unit 08)
POST http://localhost:3000/api/v1/debug/simulate-history
Body: { "traderId": "your-trader-id" }
# → Trader now has 750+ score, Tier 3, ₦150K limit
```

#### **Step 2: Test Score Query**
```bash
GET http://localhost:3000/api/v1/traders/score
Headers: Authorization: Bearer JWT_TOKEN
```
**Expected Response:**
```json
{
  "data": {
    "currentScore": 750,
    "activeTier": 3,
    "creditLimit": 150000,
    "outstandingBalance": 0
  }
}
```

#### **Step 3: Test Transaction History**
```bash
GET http://localhost:3000/api/v1/traders/transactions
Headers: Authorization: Bearer JWT_TOKEN
```
**Expected Response:**
```json
{
  "data": {
    "transactions": [
      {
        "amount": 2500,
        "transactionType": "INBOUND",
        "timestamp": "2026-05-15T..."
      }
    ]
  }
}
```
**Should show 93 transactions from simulation**

#### **Step 4: Test Loan Acceptance**
```bash
POST http://localhost:3000/api/v1/loans/accept
Headers: Authorization: Bearer JWT_TOKEN
Body: {
  "amount": 25000,
  "traderId": "your-trader-id"
}
```
**Expected Response:**
```json
{
  "data": {
    "loanAmount": 25000,
    "newOutstandingBalance": 25000,
    "availableCreditRemaining": 125000,
    "disbursementStatus": "completed"
  }
}
```

#### **Step 5: Test Credit Limit Validation**
```bash
POST http://localhost:3000/api/v1/loans/accept
Headers: Authorization: Bearer JWT_TOKEN
Body: {
  "amount": 200000,
  "traderId": "your-trader-id"
}
```
**Expected Response:** `400 Bad Request`
```json
{
  "data": null,
  "error": "Loan amount ₦200,000 exceeds available credit limit of ₦125,000"
}
```

#### **Step 6: Test Real-Time Stream (SSE)**

**Option A: Browser Test**
1. Open browser to: `http://localhost:3000/api/v1/traders/score/stream`
2. Add Authorization header (use browser dev tools or extension)
3. Should see continuous data stream every 5 seconds

**Option B: Postman Test**
1. **Method:** `GET`
2. **URL:** `http://localhost:3000/api/v1/traders/score/stream`
3. **Headers:** `Authorization: Bearer JWT_TOKEN`
4. **Send** → Should see streaming responses

**Option C: cURL Test**
```bash
curl -H "Authorization: Bearer JWT_TOKEN" \
     -H "Accept: text/event-stream" \
     http://localhost:3000/api/v1/traders/score/stream
```

**Expected SSE Output:**
```
data: {"currentScore":750,"activeTier":3,"creditLimit":150000,"outstandingBalance":25000,"timestamp":"2026-05-15T12:05:00.000Z"}

data: {"currentScore":750,"activeTier":3,"creditLimit":150000,"outstandingBalance":25000,"timestamp":"2026-05-15T12:05:05.000Z"}
```

### **Error Cases to Test**

#### **Authentication Errors**
```bash
# Missing JWT token
GET http://localhost:3000/api/v1/traders/score
# Expected: 401 Unauthorized

# Invalid JWT token
GET http://localhost:3000/api/v1/traders/score
Headers: Authorization: Bearer invalid_token
# Expected: 401 Unauthorized
```

#### **Loan Validation Errors**
```bash
# Negative amount
POST http://localhost:3000/api/v1/loans/accept
Body: { "amount": -1000 }
# Expected: 400 Bad Request

# Amount too small
POST http://localhost:3000/api/v1/loans/accept
Body: { "amount": 500 }
# Expected: 400 Bad Request (minimum ₦1,000)

# Missing amount
POST http://localhost:3000/api/v1/loans/accept
Body: { "traderId": "..." }
# Expected: 400 Bad Request
```

### **Integration Test Flow**

**Complete End-to-End Test:**
1. ✅ Create trader (Unit 02)
2. ✅ Simulate 30-day history (Unit 08)
3. ✅ Query elevated score (Unit 09)
4. ✅ View transaction history (Unit 09)
5. ✅ Accept loan within limit (Unit 09)
6. ✅ Verify updated balance (Unit 09)
7. ✅ Test real-time stream (Unit 09)
8. ✅ Attempt over-limit loan (Unit 09)

### **Production Testing**

For your deployed Render app (`https://vouch-w5z1.onrender.com`):

```bash
# Replace localhost with your Render URL
GET https://vouch-w5z1.onrender.com/api/v1/traders/score
Headers: Authorization: Bearer JWT_TOKEN

# Note: Debug endpoints will be blocked in production
POST https://vouch-w5z1.onrender.com/api/v1/debug/simulate-history
# Expected: 403 Forbidden (production safety)
```

### **Frontend Integration Notes**

**JavaScript EventSource Example:**
```javascript
const eventSource = new EventSource('/api/v1/traders/score/stream', {
  headers: {
    'Authorization': 'Bearer ' + jwtToken
  }
});

eventSource.onmessage = function(event) {
  const scoreData = JSON.parse(event.data);
  console.log('Score update:', scoreData);
  // Update UI with new score/tier data
};

eventSource.onerror = function(error) {
  console.error('SSE error:', error);
};
```

This completes the comprehensive testing guide for all Unit 09 endpoints!