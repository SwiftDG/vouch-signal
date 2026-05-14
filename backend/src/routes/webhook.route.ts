import { Router, Request, Response, NextFunction } from 'express';
import { verifySquadSignature } from '../middlewares/webhook.middleware';
import { handleSquadWebhook } from '../controllers/webhook.controller';

const router = Router();

// Capture raw body for HMAC verification before JSON parsing
router.post(
  '/squad',
  (req: Request, _res: Response, next: NextFunction): void => {
    let data = Buffer.alloc(0);
    req.on('data', (chunk: Buffer) => {
      data = Buffer.concat([data, chunk]);
    });
    req.on('end', () => {
      (req as Request & { rawBody?: Buffer }).rawBody = data;
      try {
        (req as Request & { body?: unknown }).body = JSON.parse(data.toString('utf8'));
      } catch {
        (req as Request & { body?: unknown }).body = {};
      }
      next();
    });
  },
  verifySquadSignature,
  handleSquadWebhook
);

export default router;
