# Vouch Signal — Project Overview

## What This Application Does

Vouch Signal is an AI-powered financial reputation scoring system for Nigeria's informal economy. It gives informal traders a Market Reputation Score built from real Squad transaction behaviour — unlocking loans, inventory credit, and financial services they have never had access to before.

Every payment a trader receives through their Squad Virtual Account becomes a trust signal. The AI engine analyses transaction patterns, customer diversity, consistency, and dispute history to generate a dynamic score. That score is their financial identity.

## Goals

1. Give 40M+ Nigerian informal traders a verifiable financial identity built from real economic behaviour
2. Connect traders to loans, inventory credit, and insurance using Squad transaction data as the alternative credit signal
3. Detect fraud and fake merchants through the same transaction intelligence that builds legitimate scores
4. Demonstrate deep Squad API integration across Virtual Accounts, Payment Gateway, Webhooks, Transfer API, and Recurring Payments
5. Win Squad Hackathon 3.0 with a technically rigorous, demable, and emotionally compelling product

## Core User Flow

1. Trader visits the Vouch Signal homepage and clicks Get Started
2. Trader registers with phone number and business details
3. Squad Virtual Account is created automatically via API
4. Trader receives a QR code and Squad payment link for their customers
5. Customers pay through Squad — every transaction feeds the scoring engine via webhooks
6. Trader watches their Market Reputation Score update in real time on their dashboard
7. Score crosses threshold — financial products unlock (microloans, inventory financing, insurance)
8. Trader accepts a loan offer — Squad Transfer API disburses funds instantly to their Virtual Account
9. Loan repayment is automated via Squad Recurring Payments

## Features

### Authentication & Onboarding
- Phone number registration
- Business details capture (name, category, location)
- Squad Virtual Account creation on signup
- QR code generation for customer payments

### Trader Dashboard
- Market Reputation Score display (0–1000)
- Score history chart
- Transaction feed (powered by Squad webhooks)
- Financial product unlock tracker
- Loan application and disbursement flow

### Scoring Engine (Backend)
- Real-time score update on every Squad webhook event
- Sender diversity analysis (fraud detection)
- Transaction consistency scoring
- Dispute rate tracking
- Ajo circle contribution tracking

### Landing Page (this frontend)
- Nav, Hero, Stats, Problem, HowItWorks, ScoreDisplay mockup, SquadAPIs, CTA sections
- Fully animated with Framer Motion
- Responsive for mobile and desktop

## Scope

### In Scope
- Landing homepage (all 8 sections)
- Trader registration and onboarding flow
- Trader dashboard with live score display
- Squad API integration (Virtual Accounts, Webhooks, Transfer API)
- AI scoring engine (Claude API)
- Loan application and disbursement demo flow

### Out of Scope
- Lender portal (Phase 2)
- Open Banking integration (Phase 2)
- Mobile app (Phase 2)
- B2B bank API licensing (Phase 2)
- Real loan product (demo only for hackathon)

## Success Criteria

- A trader can register and receive a Squad Virtual Account in under 60 seconds
- A simulated payment via Squad webhook visibly updates the score on the dashboard
- A loan offer appears when the score crosses 500 and disbursement completes via Transfer API
- The fraud detection engine flags circular transactions and reduces the score visibly
- The landing page is polished enough that judges mistake it for a funded startup
