import { Router } from 'express';
import { DoctorController } from '../../controllers/doctor.controller';
import { authenticate, authorize } from '../../middlewares/auth.middleware';
import { validateRequest } from '../../middlewares/validate.middleware';
import {
  createDoctorSchema,
  updateDoctorSchema,
  doctorQuerySchema,
  addPatientUnderDoctorSchema,
} from '../../validators/doctor.validator';

const router = Router();

// Protect all doctor routes with authentication
router.use(authenticate);

// List & Create
router
  .route('/')
  .get(validateRequest({ query: doctorQuerySchema }), DoctorController.getDoctors)
  .post(
    authorize('ADMIN'),
    validateRequest({ body: createDoctorSchema }),
    DoctorController.createDoctor
  );

// Details, Update, Delete
router
  .route('/:id')
  .get(DoctorController.getDoctorById)
  .put(
    authorize('ADMIN'),
    validateRequest({ body: updateDoctorSchema }),
    DoctorController.updateDoctor
  )
  .delete(authorize('ADMIN'), DoctorController.deleteDoctor);

// Patients under a doctor
router
  .route('/:id/patients')
  .get(DoctorController.getDoctorPatients)
  .post(
    authorize('ADMIN'),
    validateRequest({ body: addPatientUnderDoctorSchema }),
    DoctorController.addPatientToDoctor
  );

router.delete(
  '/:id/patients/:patientId',
  authorize('ADMIN'),
  DoctorController.removePatientFromDoctor
);

export default router;
