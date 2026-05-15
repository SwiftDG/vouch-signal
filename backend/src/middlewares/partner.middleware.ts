import { Request, Response, NextFunction } from 'express';
import { config } from '../config/env';

export function requirePartnerApiKey(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const apiKey = req.headers['x-api-key'] as string | undefined;

  if (!apiKey) {
    res.status(401).json({ data: null, error: 'Missing API key' });
    return;
  }

  // Check against allowed partner keys from environment
  const allowedKeys = config.partnerApiKeys;
  
  if (!allowedKeys.includes(apiKey)) {
    res.status(401).json({ data: null, error: 'Invalid API key' });
    return;
  }

  next();
}