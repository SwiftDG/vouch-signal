import { Router } from 'express';
import { createEvidence, getMyEvidence, getMyProfile, onboardProfile, requestEvidenceConfirmation, updateMyProfile } from '../controllers/profile.controller';
import { requireSupabaseAuth } from '../middlewares/auth.middleware';

const router = Router();

router.post('/onboard', requireSupabaseAuth, onboardProfile);
router.get('/me', requireSupabaseAuth, getMyProfile);
router.patch('/me', requireSupabaseAuth, updateMyProfile);
router.post('/me/evidence', requireSupabaseAuth, createEvidence);
router.get('/me/evidence', requireSupabaseAuth, getMyEvidence);
router.post('/me/evidence/:id/confirmation-request', requireSupabaseAuth, requestEvidenceConfirmation);

export default router;