# Backend Project Overview

The Vouch backend provides a Trust Profile API for independent businesses and skilled workers to record completed work and request customer confirmations.

## Core workflow
1. An authenticated user creates a business profile and public slug.
2. The profile owner records completed work as evidence.
3. The owner generates a time-limited confirmation link for an evidence record.
4. A customer confirms or declines the record once.
5. The public profile shows only customer-confirmed evidence and explicitly public profile fields.

## Backend scope
The API owns profile onboarding and updates, evidence creation and listing, confirmation requests and responses, and public profile reads. It does not own frontend presentation or integration.

## Release requirements
* Authenticated profile and evidence endpoints enforce ownership.
* Confirmation tokens are random, expire, and cannot be used more than once.
* Public responses contain only explicitly selected public fields.
* Database migrations are additive and preserve existing data.
* The backend build and relevant verification checks pass.
