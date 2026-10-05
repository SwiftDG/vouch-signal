# Backend Progress

## Current goal
Deliver the Trust Profile backend and its confirmation flow as a backend-only change.

## Current state
* Profile onboarding and read/update endpoints are implemented.
* Evidence creation/listing and owner-scoped confirmation request generation are implemented.
* Public profile reads select only public fields and customer-confirmed evidence.
* Customer confirmation supports confirmed and declined responses, expiry, and one-time tokens.
* Frontend integration is outside this backend change.

## Verification
Run the backend build, available trust-profile verification scripts, and `git diff --check` before publishing.
