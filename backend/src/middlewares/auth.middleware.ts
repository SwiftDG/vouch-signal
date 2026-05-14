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

  try {
    const decoded = verify(token, config.supabaseJwtSecret, {
      algorithms: ['HS256'],
      audience: 'authenticated',
    });
    (req as any).user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ data: null, error: 'Invalid or expired token' });
  }
}