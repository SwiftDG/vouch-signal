import { Router } from 'express';
import { simulatePayments, simulateHistory } from '../../controllers/debug.controller';

const router = Router();

// POST /api/v1/debug/simulate-payments
router.post('/simulate-payments', simulatePayments);

// POST /api/v1/debug/simulate-history
router.post('/simulate-history', simulateHistory);

export default router;