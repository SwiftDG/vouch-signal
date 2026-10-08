import { Router } from 'express';
import { acceptLoan } from '../controllers/loan.controller';
import { requireSupabaseAuth } from '../middlewares/auth.middleware';

const router = Router();

// POST /api/v1/loans/accept
router.post('/accept', requireSupabaseAuth, acceptLoan);

export default router;