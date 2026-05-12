import { Router } from 'express';
import { requireSupabaseAuth } from '../middlewares/auth.middleware';
import { onboardTrader } from '../controllers/trader.controller';

const router = Router();

router.post('/onboard', requireSupabaseAuth, onboardTrader);

export default router;
