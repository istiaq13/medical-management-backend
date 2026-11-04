import { Router } from 'express';
import { AuthController } from '../../controllers/auth.controller';
import { validateRequest } from '../../middlewares/validate.middleware';
import { loginSchema, registerSchema } from '../../validators/auth.validator';
import { authenticate, authorize } from '../../middlewares/auth.middleware';
import { authLimiter } from '../../middlewares/rate-limit.middleware';

const router = Router();

// Public login
router.post('/login', authLimiter, validateRequest({ body: loginSchema }), AuthController.login);

// Current user profile (Token Protected)
router.get('/me', authenticate, AuthController.getMe);

// Create new admin user (Protected: Auth token and ADMIN role required)
router.post(
  '/register',
  authenticate,
  authorize('ADMIN'),
  authLimiter,
  validateRequest({ body: registerSchema }),
  AuthController.register
);

// Admin users management (Protected: Auth token and ADMIN role required)
router.get('/users', authenticate, authorize('ADMIN'), AuthController.getAllUsers);
router.get('/users/:id', authenticate, authorize('ADMIN'), AuthController.getUserById);
router.put('/users/:id', authenticate, authorize('ADMIN'), AuthController.updateUser);
router.delete('/users/:id', authenticate, authorize('ADMIN'), AuthController.deleteUser);

export default router;

