import { Router } from 'express';
import { onboardTrader, getTraderScore, getTraderTransactions, streamTraderScore } from '../controllers/trader.controller';
import { requireSupabaseAuth } from '../middlewares/auth.middleware';

const router = Router();

// POST /api/v1/traders/onboard
router.post('/onboard', requireSupabaseAuth, onboardTrader);

// GET /api/v1/traders/score
router.get('/score', requireSupabaseAuth, getTraderScore);

// GET /api/v1/traders/transactions
router.get('/transactions', requireSupabaseAuth, getTraderTransactions);

// GET /api/v1/traders/score/stream (SSE)
router.get('/score/stream', requireSupabaseAuth, streamTraderScore);

export default router;
