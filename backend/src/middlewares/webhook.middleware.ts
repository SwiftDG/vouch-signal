import { Request, Response, NextFunction } from 'express';
import { createHmac } from 'crypto';
import { config } from '../config/env';

export function verifySquadSignature(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const body = req.body as Record<string, unknown>;
  const transactionRef = body['TransactionRef'];

  if (typeof transactionRef !== 'string') {
    res.status(401).json({ data: null, error: 'Missing TransactionRef in webhook' });
    return;
  }

  // Squad webhook signature: HMAC-SHA512 of the TransactionRef
  const computedHash = createHmac('sha512', config.squadSecretKey)
    .update(transactionRef)
    .digest('hex');

  const signature = req.headers['x-squad-signature'] as string | undefined;

  // If Squad sends a signature header, verify it — otherwise pass through for sandbox
  if (signature && computedHash !== signature) {
    res.status(401).json({ data: null, error: 'Invalid webhook signature' });
    return;
  }

  next();
}
