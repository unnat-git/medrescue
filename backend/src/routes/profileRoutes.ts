import { Router } from 'express';
import { createProfile, updateProfile, getProfile, getPublicProfile } from '../controllers/medicalProfileController';

import { authenticateToken } from '../utils/authMiddleware';

const router = Router();

router.post('/', authenticateToken, createProfile);
router.put('/', authenticateToken, updateProfile);
router.get('/', authenticateToken, getProfile);
router.get('/:id', getPublicProfile);


export default router;
