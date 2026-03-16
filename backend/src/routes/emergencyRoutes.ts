import { Router } from 'express';
import { requestEmergency } from '../controllers/emergencyController';
import { authenticateToken } from '../utils/authMiddleware';

const router = Router();

router.post('/', authenticateToken as any, requestEmergency);

export default router;
