import { Router } from 'express';
import { getPublicProfile } from '../controllers/public-profile.controller';

const router = Router();

router.get('/:slug', getPublicProfile);

export default router;