# Vouch

> Trust infrastructure for Nigeria's informal economy. Built on Squad.

**Live Demo:** [vouchsignal.vercel.app](https://vouchsignal.vercel.app)  
**Built for:** Squad Hackathon 3.0 — Challenge 02: The Intelligent Economy

---

## The Problem

40 million Nigerian informal traders are economically active but financially invisible. Mama Ngozi has sold fabric in Balogun Market for 15 years. The bank still says no — not because she isn't creditworthy, but because she has no paper trail they recognize.

Traditional credit systems require tax documents, collateral, and formal bank history. The informal economy runs on trust, consistency, and community — none of which existing systems can measure.

---

## The Solution

Vouch turns every Squad transaction into a financial identity.

Every payment a trader receives, every repeat customer who comes back, every consistent day of sales — all of it becomes data that feeds the **Market Reputation Score** (0–1,000). When the score crosses thresholds, financial products unlock automatically. No applications. No paperwork. No loan officers.

---

## How It Works

1. **Onboard** — Register with your phone number. A Squad Virtual Account is created instantly as your permanent digital financial identity.
2. **Transact** — Customers pay you through Squad. Every payment, every recurring customer, every on-time supplier payment becomes a trust signal.
3. **Score Builds** — The Vouch Engine analyses your transaction patterns in real time, generating your Market Reputation Score — updated with every payment.
4. **Access Unlocks** — Cross the threshold and financial products unlock automatically. Microloans, inventory credit, insurance — powered by your Squad history.

---

## The Vouch Engine

The scoring algorithm operates on a **30-Day Rolling Window** across four variables:

| Variable | Description | Max Points |
|----------|-------------|------------|
| **A — Account Age** | +12 pts/month if 10+ unique transactions | 150 |
| **B — Daily Consistency** | +3 pts per unique sender/day, max 15/day | 300 |
| **C — Network Retention** | +13 repeat sender, +7 new sender | 250 |
| **D — Volume Scaling** | Proportional to tier target volume | 300 |

### Tier System

| Tier | Score Range | Credit Limit |
|------|-------------|-------------|
| Probation | 0 – 399 | ₦0 |
| Bronze | 400 – 599 | ₦50,000 |
| Silver | 600 – 799 | ₦150,000 |
| Gold | 800 – 1,000 | ₦500,000 |

### Safety Brakes

- **Silent Nullifier** — Detects circular fraud (A→B→A) via recursive graph traversal and drops transactions to 0 points
- **Daily Rapid-Sweep Allowance** — Forgives first 2 rapid sweeps/day (traders buying supplies), flags the 3rd as bot activity
- **Utilization Brake** — -50 pts if outstanding debt exceeds 80% of credit limit
- **Soft Landing Protocol** — Waives utilization penalty on tier demotion, enters Repayment-Only state instead of destroying the score

---

## Squad API Integration

Vouch is built entirely on Squad's infrastructure — not as an add-on, but as the foundation.

| API | Role |
|-----|------|
| **Virtual Accounts API** | Creates a dedicated digital ledger for each trader on registration |
| **Webhooks API** | Every incoming payment fires a webhook that recalculates the score in real time |
| **Transfers API** | Disburses approved microloans instantly to the trader's Virtual Account |

> "Why Squad Virtual Accounts instead of personal bank accounts? Mixing personal rent money with business revenue corrupts the data. A dedicated Squad Virtual Account isolates pure business cash flow — giving the engine 100% clean data to underwrite credit risk."

---

## Tech Stack

### Frontend
- **React** + Vite
- **Tailwind CSS v4**
- **Framer Motion** — animations and transitions
- **Supabase JS** — authentication (Google OAuth + email/password)
- **Deployed on Vercel**

### Backend
- **Node.js** + Express + TypeScript
- **Prisma ORM**
- **Supabase PostgreSQL** — transaction ledger and trader profiles
- **Server-Sent Events (SSE)** — real-time score streaming to frontend
- **Deployed on Render**

### AI / Scoring Engine
- Deterministic rule-based heuristic algorithm
- Recursive CTE fraud detection (4-hop cycle detection in PostgreSQL)
- Chosen over black-box ML deliberately — financial algorithms must be legally explainable and auditable by regulators

---

## Architecture

```
Squad Webhook → Express Server → HMAC Verification → Transaction Service
                                                    → Scoring Engine (A+B+C+D)
                                                    → Fraud Detector (Recursive CTE)
                                                    → Prisma → Supabase PostgreSQL
                                                    → SSE Stream → React Dashboard
```

---

## Running Locally

### Prerequisites
- Node.js 18+
- npm
- Supabase account
- Squad Sandbox API keys

### Frontend
```bash
cd frontend
npm install
cp .env.example .env
# Add VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, VITE_API_BASE_URL
npm run dev
```

### Backend
```bash
cd backend
npm install
cp .env.example .env
# Add DATABASE_URL, SUPABASE_URL, SUPABASE_ANON_KEY, SQUAD_SECRET_KEY
npx prisma generate
npm run dev
```

### Environment Variables

**Frontend `.env`:**
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

**Backend `.env`:**
```
PORT=3000
DATABASE_URL=your_supabase_postgres_url
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SQUAD_SECRET_KEY=your_squad_secret_key
SQUAD_BASE_URL=https://sandbox-api-d.squadco.com
```

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/v1/health` | None | Server health check |
| POST | `/api/v1/traders/onboard` | JWT | Create trader + Squad Virtual Account |
| GET | `/api/v1/traders/score` | JWT | Get current score and tier |
| GET | `/api/v1/traders/transactions` | JWT | Get transaction history |
| GET | `/api/v1/traders/score/stream` | JWT | Real-time SSE score stream |
| POST | `/api/v1/loans/accept` | JWT | Accept and disburse loan |
| POST | `/api/v1/webhooks/squad` | HMAC | Receive Squad payment webhooks |
| GET | `/api/v1/lenders/score/:account` | API Key | Partner score query |
| POST | `/api/v1/debug/simulate-history` | None | Inject 30 days of demo data |

---

## Demo

1. Visit [vouchsignal.vercel.app](https://vouchsignal.vercel.app)
2. Click **Get Started** → **Log in as Mama Ngozi (Demo)**
3. Press **Shift+S** to simulate Squad payments
4. Watch the score climb in real time
5. When score crosses 400 → **Bronze Tier unlocks** → click **Get a Loan**
6. Select amount, choose repayment method, apply

---

## V2 Roadmap

- **BNPL Inventory Financing** — Buy Now Pay Later for bulk stock orders
- **Business Insurance** — Micro-insurance for informal traders
- **Digital Ajo Circles** — Automated rotating savings groups
- **Verified Employer Directory** — Match unemployed youth to high-tier verified businesses
- **B2B Fast-Track** — 70% volume match rule for established wholesalers
- **Lender API Marketplace** — Risk-as-a-Service for Nigerian banks

---

## Team

| Member | Role |
|--------|------|
| **Goodness** | Product Manager · Algorithm Design |
| **Emmanuel** | Backend Engineer |
| **David** | Frontend Engineer |
| **Oki** | Pitch Lead · User Research |

---

## Judging Criteria Coverage

| Pillar | Weight | Our Approach |
|--------|--------|-------------|
| Squad API Integration | 25% | Virtual Accounts + Webhooks + Transfers — Squad IS the product |
| Technical Architecture | 20% | Deterministic scoring engine, SSE real-time updates, recursive fraud detection |
| Problem Understanding | 20% | Rapid-Sweep Allowance, Soft Landing Protocol, B2B Fast-Track |
| Economic Viability | 20% | SaaS + RaaS revenue model, B2B/SME not B2C payday lending |
| Presentation + Impact | 15% + 10% | Live demo with real score animation, ethical Soft Landing design |

---

*© 2026 VouchSignal. Built for Squad Hackathon 3.0.*
