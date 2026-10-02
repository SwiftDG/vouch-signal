# Vouch — Project Overview

## What This Application Does

Vouch helps independent businesses and skilled workers present completed work and customer confirmations in a portable public profile. It is a portfolio and evidence tool, not a payment, lending, or financial product.

## Goals

1. Help vendors and freelancers describe their skills and services.
2. Give each person a shareable public work profile.
3. Let customers confirm a specific completed project, order, delivery, or service.
4. Clearly distinguish self-reported work from customer-confirmed work.
5. Keep public claims factual, limited, and explainable.

## Core User Flow

1. A person signs up or signs in with Supabase Auth.
2. They create a profile with a name, work type, skills/category, description, location, and public slug.
3. They record a completed piece of work.
4. They request a one-time, expiring confirmation link for that item.
5. A customer reviews a plain statement and confirms it.
6. The person shares `/p/:slug`; only customer-confirmed work is displayed publicly.

## Features

### Account and profile
- Email/password or Google authentication through Supabase.
- Vendor or freelancer profile with a unique public slug.
- Profile details editable by the authenticated owner.

### Completed work
- Records for orders, projects, deliveries, services, and other work.
- New records are `SELF_REPORTED`.
- Confirmation links expire after seven days; confirmed tokens cannot be reused.

### Public profile
- Shows selected public profile fields and `CUSTOMER_CONFIRMED` work only.
- Never exposes owner IDs, confirmation tokens, customer names, or private evidence.

### Landing page
- Explains profiles, completed work, and customer confirmation.
- Responsive for mobile and desktop.

## Scope

### In Scope
- Landing homepage for skills and work profiles.
- Supabase authentication and profile onboarding.
- Completed-work management and customer confirmation.
- Public profile with explicitly filtered fields.

### Out of Scope
- Payment processing, bank integrations, transfers, loans, credit, insurance, and financial underwriting.
- Ajo, transaction-ledger scoring, payment webhooks, and financial risk scoring.
- Claims that a business is guaranteed to perform or has verified identity.

## Success Criteria

- A person can create and edit a profile without manual database changes.
- They can add completed work and request customer confirmation.
- A customer can confirm once through a secure expiring link.
- The public profile contains only deliberately public fields and confirmed work.
- Frontend and backend builds pass, and a real end-to-end test is recorded.
