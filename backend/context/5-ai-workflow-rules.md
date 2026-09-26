# AI Workflow Rules

**Act as an expert AI coding agent working on Vouch's backend Trust Profile API. You must strictly obey the following commands.**

## Overall Approach
* Spec driven: confirm the data model, endpoint contract, and ownership rules in `2-architecture.md` before writing code.
* Incremental execution: build one atomic unit (one model, one endpoint, one migration) at a time. Do not write the full API in a single response unless explicitly commanded.

## Scoping Rules
* No speculative changes outside `backend/trust-profile-api`.
* Do not touch, refactor, or "clean up" legacy loan, score, Ajo, Jobs, Squad, or demo code. It must stay isolated, not deleted, until the new flow supersedes it.
* No risky broad deletion before integration.

## Splitting Work
* If a task spans more than the three required backend layers (models, endpoints, auth and ownership middleware), or requires frontend coordination, halt. Propose a step by step plan and wait for approval before starting.

## Handling Ambiguity
* If a requirement contradicts `1-project-overview.md`, `2-architecture.md`, or `3-ui-context.md` (the trust language rules), or a critical detail is missing, stop. State the conflict clearly and ask for direction. Do not assume.

## File Restrictions
* Never modify a database migration once it has been applied.
* Never add BVN, NIN, bank detail, loan logic, or Squad call code.
* Never commit `.env` files, keys, database URLs, or archives.
* Never merge your own PR into `rebuild/trust-profile-mvp`.

## Documentation Sync
* Every new endpoint, model, or migration must be logged in `backend/TRUST_PROFILE_API.md` in the same session it is built.
* Flag `2-architecture.md` for an update whenever the actual implementation diverges from what it currently documents.

## Verification Checklist
Before declaring a backend step complete, verify internally:
* [ ] All owner endpoints use the existing Supabase JWT middleware.
* [ ] Every profile and evidence action validates ownership.
* [ ] Onboarding is idempotent (retrying creates no duplicates).
* [ ] The public endpoint exposes only deliberately public information.
* [ ] Confirmation moves evidence from `SELF_REPORTED` to `CUSTOMER_CONFIRMED`, and nothing else.
* [ ] The migration is additive and does not touch old production data.
* [ ] No BVN, NIN, bank details, loan logic, Squad calls, or secrets were added.
* [ ] The change is documented in `backend/TRUST_PROFILE_API.md`.
* [ ] Ownership bypass was tested (altering IDs to reach another profile or evidence record is rejected).
* [ ] Expired and reused confirmation links were tested.

*Only prompt the user for the next task after these checks are satisfied.*
