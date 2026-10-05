import { Router } from 'express';
import { getConfirmation, respondConfirmation } from '../controllers/confirmation.controller';

const router = Router();

router.post('/:token', getConfirmation);
router.post('/:token/respond', respondConfirmation);

export default router;