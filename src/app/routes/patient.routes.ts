import { Router } from 'express';
import { PatientController } from '../../controllers/patient.controller';
import { authenticate, authorize } from '../../middlewares/auth.middleware';
import { validateRequest } from '../../middlewares/validate.middleware';
import {
  createPatientSchema,
  updatePatientSchema,
  patientQuerySchema,
} from '../../validators/patient.validator';

const router = Router();

// Protect all patient routes with authentication
router.use(authenticate);

router
  .route('/')
  .get(validateRequest({ query: patientQuerySchema }), PatientController.getPatients)
  .post(
    authorize('ADMIN'),
    validateRequest({ body: createPatientSchema }),
    PatientController.createPatient
  );

router
  .route('/:id')
  .get(PatientController.getPatientById)
  .put(
    authorize('ADMIN'),
    validateRequest({ body: updatePatientSchema }),
    PatientController.updatePatient
  )
  .delete(authorize('ADMIN'), PatientController.deletePatient);

export default router;
