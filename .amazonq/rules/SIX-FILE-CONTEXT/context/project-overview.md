# Vouch(Squad Hackathon 3.0)

## Overview
Vouch Signal is an AI-powered financial reputation scoring system designed for Nigeria's informal economy. It solves the problem of over 40 million informal traders being rejected by traditional finance due to a lack of conventional credit history, collateral, or payslips. By analyzing real economic behavior through Squad inbound payments, Vouch Signal generates a "Market Reputation Score" that serves as a verifiable financial identity for lenders, suppliers, and service providers.

## Goals
1. **Build Financial Identity**: Connect informal traders to financial services using an intelligent economic system based on their actual transaction history, addressing Hackathon Challenge 2.
2. **Detect Fraud**: Utilize the same AI scoring engine to identify circular fraud, fake merchants, and synthetic customer networks, addressing Hackathon Challenge 1.
3. **Automate Credit Access**: Seamlessly unlock tiered financial services—from microloans to inventory financing—as a trader's score naturally improves through daily operations.

## Core User Flow (Demo Journey)
1. **Onboarding**: A trader registers with a phone number, business details, and their BVN. The BVN input must be visually masked on the UI (like a password field) to protect privacy over-the-shoulder. A Squad Virtual Account is generated instantly.
2. **Transaction Inflow**: Simulated customer payments arrive via the Squad Payment Gateway, triggering real-time webhooks that visibly update the score on the dashboard.
3. **Credit Unlock**: Once the score crosses the 500 threshold, a loan offer automatically appears; upon acceptance, funds are instantly disbursed via the Squad Transfer API.
4. **Active Fraud Detection**: A secondary account attempts circular fraud by rotating money back and forth. The AI flags the anomaly, dropping the score immediately and revoking loan access with an explanation.

## Features

### AI-Powered Scoring Engine
- **Squad Inbound Payments (Primary)**: Evaluates payment volume, consistency, number of unique customers, dispute rates, and seasonal trends.
- **Ajo Circle Contributions**: Tracks savings discipline through completed cycles and the consistency of contribution timing.
- **Transaction Pattern Analysis**: Evaluates business growth vectors and flags anomalous spikes indicative of fraud.

### Squad API Backbone
- **Virtual Accounts & Gateway**: Provides a permanent digital identity and processes all customer purchases to feed the scoring engine.
- **Webhooks & Transfer API**: Enables live score updates as payments arrive and handles direct loan disbursements.
- **Recurring Payments & Disputes**: Automates Ajo contributions and tracks resolved/unresolved disputes to adjust the score.

### Dynamic Access Tiers
- **Score 0–299**: Basic Virtual Account (Thin file, building phase).
- **Score 300–499**: Access to small emergency microloans.
- **Score 500–699**: Inventory financing (buy stock now, pay from sales).
- **Score 700–849**: BNPL for larger orders and insurance products.
- **Score 850–1000**: Full credit access, premium lender rates, and merchant verification badge.

## Scope

### In Scope
- Deep integration of the core Squad APIs (Virtual Accounts, Gateway, Webhooks, Transfers, Recurring, Disputes).
- Real-time AI scoring engine capable of both trust verification and fraud detection.
- Trader dashboard reflecting live, event-driven score updates and automated loan unlocks.

### Out of Scope
- Evaluation based on formal documentation, salary slips, or traditional collateral.
- Manual lending approvals (the system provides the API data for automated lender decisions).

## Business Model
1. **Lender API Access**: Subscriptions and per-query fees for financial partners checking scores.
2. **Loan Origination Fee**: 1–3% cut of every loan facilitated through the platform.
3. **Trader Subscription**: ₦500/month for a Business Profile tracking score history and lender introductions.
4. **Squad Card Interchange**: Revenue earned on transactions made by high-tier traders unlocking a debit card.