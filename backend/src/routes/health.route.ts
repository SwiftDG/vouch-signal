import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.get('/health', async (_req: Request, res: Response): Promise<void> => {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: 'unknown',
    uptime: process.uptime()
  };

  try {
    // Test database connectivity
    await prisma.$queryRaw`SELECT 1`;
    health.database = 'connected';
    res.status(200).json({ data: health, error: null });
  } catch (error) {
    health.status = 'degraded';
    health.database = 'disconnected';
    res.status(503).json({ data: health, error: 'Database connection failed' });
  }
});

export default router;
