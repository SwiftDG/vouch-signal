# API Contract Rules

## Evidence status
Evidence uses only `SELF_REPORTED` and `CUSTOMER_CONFIRMED`. New evidence is self-reported. Only a successful customer confirmation changes it to customer-confirmed.

## Confirmation lifecycle
The API exposes confirmation states as `pending`, `confirmed`, `declined`, or `expired`. A customer response contains exactly one supported decision: `confirmed` or `declined`. A response is recorded once; expired and consumed tokens cannot be used again.

## Public data
Public-profile responses include only the public slug, business name and type, category, bio, location, contact URL, and customer-confirmed evidence fields. Confirmation reads contain only the statement, state, and expiry needed for the customer flow.

Never return owner email, Supabase user IDs, customer names, confirmation tokens, private notes, database-only identifiers, or unselected internal fields from public endpoints.
