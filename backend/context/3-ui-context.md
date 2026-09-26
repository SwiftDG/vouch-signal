# API Response & Trust Language Context

The normal file 3 in this methodology covers the visual design system: colors, typography, layout. That is owned by David on the frontend and is out of scope for the backend role. For the backend, file 3 instead covers the trust language contract: the words, labels, and claims the API is allowed to produce, since these travel through response payloads and directly determine what the frontend can honestly display.

## Core Public Language
"Vouch helps independent businesses show the work they have completed and the evidence behind it."

## Approved Status Vocabulary
Use these terms, and only these, for evidence and profile state:
* Completed records
* Customer confirmed records
* Self reported records
* Latest recorded activity
* Profile completion status

In the data model this maps directly to the `verification_status` enum: `SELF_REPORTED` and `CUSTOMER_CONFIRMED`. API responses must use these exact values (or their approved plain language equivalents above), never anything resembling "credit score."

## Claims the API Must Never Make or Imply
Do not return, name, or structurally support any of the following unless and until they become true and are explicitly approved:
* Verified identity
* A specific fulfilment reliability percentage (for example, "94% fulfilment reliability")
* "No unresolved disputes"
* "Credit unlocked"
* "AI determines who is trustworthy"
* A guarantee that a business will perform

Concretely: no BVN, NIN, or bank detail fields; no loan or credit fields; no AI risk score field unless it is backed by a specific, visible, tested, explainable rule (not part of V1).

## Strength Indicators
If a strength indicator is ever introduced, it must be explainable from its inputs, for example: "Your profile is building because you have added 3 records, including 1 customer confirmed record." Any such field must be computed from concrete, visible counts, never an opaque score.

## Frontend Labels (for backend awareness)
David's UI uses transparent labels, SELF-REPORTED and CUSTOMER-CONFIRMED, and avoids calling it a credit score. The backend's field names and returned values should make it trivial for the frontend to render these labels directly, without translation or guesswork.
