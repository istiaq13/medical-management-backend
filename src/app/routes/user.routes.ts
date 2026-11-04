import { Router } from 'express';
import { AuthController } from '../../controllers/auth.controller';
import { authenticate, authorize } from '../../middlewares/auth.middleware';
import { validateRequest } from '../../middlewares/validate.middleware';
import { registerSchema } from '../../validators/auth.validator';

const router = Router();

// Protect all user management endpoints: Token & Admin access only
router.use(authenticate, authorize('ADMIN'));

router
  .route('/')
  .get(AuthController.getAllUsers)
  .post(validateRequest({ body: registerSchema }), AuthController.register);

router
  .route('/:id')
  .get(AuthController.getUserById)
  .put(AuthController.updateUser)
  .delete(AuthController.deleteUser);

export default router;

