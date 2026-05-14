import { Router } from 'express';
import { onboardTrader } from '../controllers/trader.controller';

const router = Router();

// TODO: re-add requireSupabaseAuth before production
router.post('/onboard', onboardTrader);

export default router;
