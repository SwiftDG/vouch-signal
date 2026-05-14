import { Router } from 'express';
import { onboardTrader } from '../controllers/trader.controller';

const router = Router();

router.post('/onboard', onboardTrader);

export default router;
