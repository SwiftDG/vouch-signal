import { Router } from 'express';
import { confirmRequest, getConfirmation } from '../controllers/confirmation.controller';

const router = Router();

router.get('/:token', getConfirmation);
router.post('/:token/confirm', confirmRequest);

export default router;