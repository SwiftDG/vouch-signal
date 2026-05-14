# Vouch Signal (Squad Hackathon 3.0)

## Overview
Vouch Signal is a deterministic financial reputation scoring system designed for Nigeria's informal economy. It solves the problem of over 40 million informal traders being rejected by traditional finance due to a lack of conventional credit history, collateral, or payslips. By analyzing real economic behavior through Squad inbound payments, Vouch Signal generates a "Market Reputation Score" that serves as a verifiable financial identity for lenders, suppliers, and service providers.

## Goals
1. **Build Financial Identity**: Connect informal traders to financial services using an intelligent economic system based on their actual transaction history, addressing Hackathon Challenge 2.
2. **Detect Fraud**: Utilize native PostgreSQL graph traversal (Recursive CTEs) to identify circular fraud, fake merchants, and synthetic customer networks, addressing Hackathon Challenge 1 without the overhead of heavy AI models.
3. **Automate Credit Access**: Seamlessly unlock tiered financial services—from microloans to inventory financing—as a trader's score naturally improves through daily operations.

## Core User Flow (Demo Journey)
1. **Onboarding**: A trader registers with a phone number, business details, and their BVN. The BVN input is encrypted (AES-256-GCM) at the service layer and masked on the UI. A Squad Virtual Account is generated instantly.
2. **Transaction Inflow**: Simulated customer payments arrive via the Squad Payment Gateway, triggering real-time webhooks that visibly update the score on the dashboard.
3. **Credit Unlock**: Once the score crosses the Tier 2 threshold, a loan offer automatically appears; upon acceptance, funds are instantly disbursed via the Squad Transfer API.
4. **Active Fraud Detection**: A secondary account attempts circular fraud by rotating money back and forth. The fraud detector flags the 4-hop anomaly, dropping the score immediately and revoking loan access (triggering the "Repayment-Only" safety brake).

## Features

### The Vouch Engine (Deterministic Scoring)
- **Variable A (Account Age & Activity)**: Rewards tenure, capping at 150 pts (Requires min. 10 unique tx/month to activate).
- **Variable B (Consistency)**: Direct correlation to daily interaction and Squad inbound volume frequency.
- **Variable C (Network Spread)**: Weighted evaluation of unique customers (repeat vs. new senders).
- **Variable D (Volume Capacity)**: Evaluates actual 30-day volume against the target volume of the user's base tier.
- **Safety Brakes & Risk Management**: Automated utilization penalties (>80% limit) and soft-landing protocols if a tier drops.

### Squad API Backbone
- **Virtual Accounts & Gateway**: Provides a permanent digital identity and processes all customer purchases to feed the scoring engine.
- **Webhooks & Transfer API**: Enables live score updates as payments arrive and handles direct loan disbursements.
- **Recurring Payments & Disputes**: Automates Ajo (Vouch Circles) contributions and tracks resolved/unresolved disputes to adjust the score.

### Dynamic Access Tiers
*Aligned with `VouchEngine.ts` logic*
- **Tier 1 (Base - Probation)**: 0-399 Score | ₦0 Limit | Basic Virtual Account (Thin file, building phase).
- **Tier 2 (Bronze)**: 400-599 Score | ₦50,000 Limit | Target Vol: ₦50,000 | Access to small emergency microloans.
- **Tier 3 (Silver)**: 600-799 Score | ₦150,000 Limit | Target Vol: ₦150,000 | Inventory financing (buy stock now, pay from sales).
- **Tier 4 (Gold)**: 800-1000 Score | ₦500,000 Limit | Target Vol: ₦500,000 | BNPL for larger orders and premium lender rates.

## Scope

### In Scope
- Deep integration of the core Squad APIs (Virtual Accounts, Gateway, Webhooks, Transfers, Recurring, Disputes).
- Real-time deterministic scoring engine capable of both trust verification and fraud detection.
- Trader dashboard reflecting live, event-driven score updates and automated loan unlocks.

### Out of Scope
- Evaluation based on formal documentation, salary slips, or traditional collateral.
- Manual lending approvals (the system provides the API data for automated lender decisions).
- Front-end UI implementation for the actual Hackathon API submission (strictly backend infrastructure).

## Business Model
1. **Lender API Access**: Subscriptions and per-query fees for financial partners checking scores.
2. **Loan Origination Fee**: 1–3% cut of every loan facilitated through the platform.
3. **Trader Subscription**: ₦500/month for a Business Profile tracking score history and lender introductions.
4. **Squad Card Interchange**: Revenue earned on transactions made by high-tier traders unlocking a debit card.