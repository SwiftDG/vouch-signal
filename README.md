# Vouch

Vouch explores whether a small business's consented payment history could help a lender understand its trading pattern. It does not offer loans. A lender would make its own decision.

## Current site

The home page explains the idea. `/dashboard` is a self-contained interactive example: start with a zero score, load a month of sample sales, then try three patterns that the illustrative rules ignore. The sample is fictional. No bank account, transaction provider, or lender is connected. Google sign-in is available, but it does not import account activity or create a real score.

## Run locally

```sh
cd frontend
npm ci
npm run dev
```

The independent `backend` has a `/api/v1/health` endpoint and returns JSON 404 for other API paths. It does not process money. The frontend demo does not depend on it.

## Production work still needed

Obtain a lawful consent-based transaction source; design identity and merchant controls; test the rules on permitted data; assess fraud, accuracy, bias, security and regulatory requirements with prospective lenders. The illustrative score must not be presented as validated creditworthiness.

## Photograph

The cropped market photograph in `frontend/public/images/abuja-stall-crop.webp` is from [Muhammad-Taha Ibrahim on Pexels](https://www.pexels.com/photo/local-nigerian-market-stall-with-packaged-goods-30730008/). It depicts a stall in Abuja and is not Mama Ngozi's business. Cropped to show the goods without a person.
