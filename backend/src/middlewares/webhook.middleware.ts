import { Request, Response, NextFunction } from 'express';
import { createHmac } from 'crypto';
import { config } from '../config/env';

export function verifySquadSignature(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const signature = req.headers['x-squad-encrypted-body'] as string | undefined;

  if (!signature) {
    console.log('⚠️ No x-squad-encrypted-body header found, proceeding anyway for sandbox');
    next();
    return;
  }

  // Squad signature: HMAC-SHA512 of JSON.stringify(body).toUpperCase()
  const hash = createHmac('sha512', config.squadSecretKey)
    .update(JSON.stringify(req.body))
    .digest('hex')
    .toUpperCase();

  if (hash !== signature) {
    res.status(401).json({ data: null, error: 'Invalid webhook signature' });
    return;
  }
  next();
}
