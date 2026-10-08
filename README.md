# Vouch

Vouch reads a merchant's supplied payment records for days with sales, distinct named payers, returning payers and the length of activity. It flags simple circular, repeated and rapid-outflow patterns. The public application is usable after sign-in: import a CSV or enter transactions and inspect a score breakdown. Transactions are held in browser memory for the current session and are not sent to Vouch.

This is an **activity summary based on user-provided records**. It does not independently verify a bank statement, determine creditworthiness, connect to a lender or approve a loan. A lender needs verified, consented records and its own assessment. The presenter walkthrough at `/demo` is separate from the signed-in application and is linked only from the sign-in page.

## CSV format

Download the template from the dashboard. It accepts `date,direction,amount,counterparty,description` (description optional), or separate credit and debit columns. Dates may be `YYYY-MM-DD` or `DD/MM/YYYY`. Named payer data is required for customer-diversity measures. An uploaded file replaces the activity in the tab; reloading or closing clears it.

## Run locally

```sh
cd frontend
npm ci
npm run dev
```

The independent backend exposes `/api/v1/health` and has no payment operation. The frontend does not depend on it.

## Production work still needed

A permitted consent-based transaction source, verified payer identity, storage controls, security review, lender testing, and model validation are necessary before a bank can use these signals. Do not describe this score as verified creditworthiness.

## Photographs

The cropped market photograph `frontend/public/images/abuja-stall-crop.webp` is from [Muhammad-Taha Ibrahim on Pexels](https://www.pexels.com/photo/local-nigerian-market-stall-with-packaged-goods-30730008/). The produce photograph `frontend/public/images/jos-market-fruit.webp` is by [Jagaba Denis on Pexels](https://www.pexels.com/photo/fresh-tropical-fruits-display-at-nigerian-market-37126254/). Neither depicts an actual Vouch user.
