import { Request, Response, NextFunction } from 'express';
import { createHmac, timingSafeEqual } from 'crypto';
import { config } from '../config/env';

export function verifySquadSignature(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const signature = req.headers['x-squad-encrypted-body'];

  if (typeof signature !== 'string') {
    res.status(401).json({ data: null, error: 'Missing webhook signature' });
    return;
  }

  const rawBody = (req as Request & { rawBody?: Buffer }).rawBody;

  if (!rawBody) {
    res.status(400).json({ data: null, error: 'Missing request body' });
    return;
  }

  const expected = createHmac('sha512', config.squadSecretKey)
    .update(rawBody)
    .digest('hex');

  const expectedBuf = Buffer.from(expected, 'utf8');
  const receivedBuf = Buffer.from(signature, 'utf8');

  if (
    expectedBuf.length !== receivedBuf.length ||
    !timingSafeEqual(expectedBuf, receivedBuf)
  ) {
    res.status(401).json({ data: null, error: 'Invalid webhook signature' });
    return;
  }

  next();
}
