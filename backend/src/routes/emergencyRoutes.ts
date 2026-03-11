import { Router } from 'express';
import { requestEmergency } from '../controllers/emergencyController';

const router = Router();

router.post('/', requestEmergency);

export default router;
