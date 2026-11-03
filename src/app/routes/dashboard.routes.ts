import { Router } from 'express';
import { DashboardController } from '../../controllers/dashboard.controller';
import { authenticate, authorize } from '../../middlewares/auth.middleware';

const router = Router();

// Protect all dashboard analytics routes: Admin access only
router.use(authenticate, authorize('ADMIN'));

router.get('/analytics', DashboardController.getAnalytics);

export default router;
