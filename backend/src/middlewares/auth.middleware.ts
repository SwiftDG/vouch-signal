import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';
import { config } from '../config/env';

declare global {
  namespace Express {
    interface Request {
      user?: { id: string };
    }
  }
}

// 1. Point the client to your Supabase project's public key endpoint
const client = jwksClient({
  jwksUri: `${config.supabaseUrl}/auth/v1/.well-known/jwks.json`,
  cache: true, // Caches the keys in memory so it doesn't slow down your API
  rateLimit: true
});

// 2. Helper function to fetch the specific key for the incoming token
function getKey(header: jwt.JwtHeader, callback: jwt.SigningKeyCallback) {
  client.getSigningKey(header.kid, function(err, key) {
    if (err || !key) {
      console.error('Failed to fetch Supabase Public Key:', err);
      return callback(err, undefined);
    }
    const signingKey = key.getPublicKey();
    callback(null, signingKey);
  });
}

export const requireSupabaseAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ data: null, error: 'Missing or invalid authorization header' });
  }

  const token = authHeader.split(' ')[1];

  // Development bypass for testing
  if (config.nodeEnv === 'development') {
    try {
      const decoded = jwt.decode(token) as jwt.JwtPayload;
      if (decoded?.sub) {
        console.log('✅ Development mode: JWT accepted for user:', decoded.email || decoded.sub);
        req.user = { id: decoded.sub };
        return next();
      }
    } catch (err) {
      // Fall through to normal verification
    }
  }

  // 3. Verify using the Asymmetric Public Key fetched from Supabase
  // We allow both RS256 and ES256 to cover all modern Supabase defaults
  jwt.verify(
    token,
    getKey,
    {
      algorithms: ['RS256', 'ES256'],
      audience: 'authenticated',
      issuer: `${config.supabaseUrl}/auth/v1`
    },
    (err, decoded) => {
    if (err || !decoded) {
      console.error('JWT Verification failed:', err);
      return res.status(401).json({ data: null, error: 'Invalid or expired token' });
    }

    const payload = decoded as jwt.JwtPayload;

    // Supabase stores the user's UUID in the 'sub' property of the token
    if (!payload.sub) {
      return res.status(401).json({ data: null, error: 'Invalid token payload' });
    }

    req.user = { id: payload.sub };
    next();
  });
};