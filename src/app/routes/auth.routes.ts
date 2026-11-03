import { Router } from 'express';
import { AuthController } from '../../controllers/auth.controller';
import { validateRequest } from '../../middlewares/validate.middleware';
import { loginSchema, registerSchema } from '../../validators/auth.validator';
import { authenticate } from '../../middlewares/auth.middleware';

const router = Router();

router.post('/login', validateRequest({ body: loginSchema }), AuthController.login);
router.post('/register', validateRequest({ body: registerSchema }), AuthController.register);
router.get('/me', authenticate, AuthController.getMe);

export default router;

