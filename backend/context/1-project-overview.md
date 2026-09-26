# Project Overview

Vouch is trust infrastructure for independent online businesses. Vendors and freelancers turn completed work and customer confirmations into a portable, shareable profile that a new customer, collaborator, supplier, opportunity provider, or future partner can check before deciding whether to trust them.

North star: give a vendor or freelancer one credible Vouch link they can share before someone decides whether to trust them.

## Target Users (V1)
* Online vendors: people completing orders, deliveries, and customer requests through channels such as WhatsApp and Instagram.
* Freelancers: people completing client projects, services, and short contracts across platforms or direct referrals.

## Core User Flow
1. Create profile: vendor or freelancer chooses a business identity and a public Vouch slug.
2. Add evidence: they add a completed order, project, delivery, service, or other completed activity.
3. Request confirmation: they generate a customer link for one specific evidence item.
4. Confirm: the customer reviews a plain statement and confirms or declines the record.
5. Share: the business shares `/p/:slug` as an explainable public profile.

## What Vouch Must NOT Claim in V1
* Automatic loans, credit approval, financial underwriting, or insurance access.
* Live banking partnerships, real-money Ajo, Squad transfers, or verified nationwide credit data.
* AI risk scoring or fraud detection, unless a specific visible, tested, and explainable rule exists.
* That fictional sample profiles are real customers.

## Team and Ownership
* David Gilbert: frontend, product experience, public presentation, integration review, validation. Owns the active frontend integration on `rebuild/trust-profile-mvp`.
* Emmanuel: backend data model and API for the Trust Profile flow, on `backend/trust-profile-api`. Should challenge anything in the contract that is unnecessarily complicated, while keeping the first version small, safe, and usable.

## Scope for V1 (Release Gate, October 1, 2026)
* Vendor and Freelancer profiles can be created.
* Evidence can be added and displayed accurately.
* A customer can confirm an evidence item through a secure link.
* A public profile is shareable and mobile usable.
* All labels are explainable and claims are truthful.
* No loan, automatic credit, or unsupported fintech claims remain publicly visible.
* Frontend and backend builds pass on the laptop environment.
* No secrets, archives, or generated folders were committed.
* A real end to end test has been recorded.

## Out of Scope for V1
* Any loan, credit, insurance, or underwriting feature.
* Live banking partnerships, real money Ajo, or Squad transfers.
* AI risk scoring or fraud detection (unless later backed by a specific, visible, tested, explainable rule).
* Verified nationwide credit data.

## Success Criteria
The full trust loop works without manual database editing: profile creation, evidence addition, customer confirmation through a secure link, and a truthful, explainable, mobile usable public profile, ending with `rebuild/trust-profile-mvp` merged into `main` and tagged `v0.1.0`.
