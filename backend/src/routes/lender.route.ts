import { Router } from 'express';
import { getTraderScore } from '../controllers/lender.controller';
import { requirePartnerApiKey } from '../middlewares/partner.middleware';

const router = Router();

router.get('/score/:virtualAccount', requirePartnerApiKey, getTraderScore);

export default router;