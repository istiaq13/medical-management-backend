import { Router } from 'express';
import authRoutes from './auth.routes';
import doctorRoutes from './doctor.routes';
import patientRoutes from './patient.routes';
import dashboardRoutes from './dashboard.routes';
import { HealthController } from '../../controllers/health.controller';

const apiRouter = Router();

// Health check endpoint under /api/v1/health
apiRouter.get('/health', HealthController.getHealth);

apiRouter.use('/auth', authRoutes);
apiRouter.use('/doctors', doctorRoutes);
apiRouter.use('/patients', patientRoutes);
apiRouter.use('/dashboard', dashboardRoutes);

export default apiRouter;
