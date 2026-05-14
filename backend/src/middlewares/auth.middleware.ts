import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { config } from '../config/env';

export function requireSupabaseAuth(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7).trim() : null;

  if (!token) {
    res.status(401).json({ data: null, error: 'Missing authorization token' });
    return;
  }

  // Try plain secret first, then base64-decoded (Supabase uses base64-encoded secret)
  const secrets = [
    config.supabaseJwtSecret,
    Buffer.from(config.supabaseJwtSecret, 'base64'),
  ];

  for (const secret of secrets) {
    try {
      verify(token, secret, { algorithms: ['HS256'] });
      next();
      return;
    } catch {
      // try next secret
    }
  }

  res.status(401).json({ data: null, error: 'Invalid or expired token' });
}