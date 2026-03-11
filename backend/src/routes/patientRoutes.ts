import { Router } from 'express';
import { createPatient, getPatient } from '../controllers/patientController';

const router = Router();

router.post('/', createPatient);
router.get('/:id', getPatient);

export default router;
