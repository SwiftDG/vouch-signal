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

This documentation provides everything needed to build a complete frontend interface for the Vouch Signal platform.