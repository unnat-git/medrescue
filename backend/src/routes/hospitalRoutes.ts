import { Router } from 'express';
import { getNearbyHospitals } from '../controllers/hospitalController';

const router = Router();

router.get('/nearby', getNearbyHospitals);

export default router;
