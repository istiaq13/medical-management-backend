import express, { Application, Request, Response, NextFunction } from 'express';
import { configureGlobalMiddlewares } from '../middleware';
import apiRouter from './routes';
import { HealthController } from '../controllers/health.controller';
import { errorHandler } from '../middlewares/error.middleware';
import { ApiError } from '../helpers/api-error';

export const createApp = (): Application => {
  const app: Application = express();

  // 1. Configure global middlewares
  configureGlobalMiddlewares(app);

  // 2. Root welcome endpoint
  app.get('/', (req: Request, res: Response) => {
    res.status(200).json({
      success: true,
      message: '🩺 Doctor Tracker RESTful API is live and healthy',
      version: '1.0.0',
      endpoints: {
        health: '/health',
        apiBase: '/api/v1',
        auth: '/api/v1/auth',
        doctors: '/api/v1/doctors',
        patients: '/api/v1/patients',
        dashboard: '/api/v1/dashboard/analytics',
      },
    });
  });

  // Favicon handler (avoids 404 in browsers)
  app.get('/favicon.ico', (req: Request, res: Response) => {
    res.status(204).end();
  });

  // 3. Health check route (used by Docker, Kubernetes, AWS, Render probes)
  app.get('/health', HealthController.getHealth);

  // 4. API V1 Routes
  app.use('/api/v1', apiRouter);

  // 5. Handle 404 Route Not Found
  app.use((req: Request, res: Response, next: NextFunction) => {
    next(new ApiError(404, `Cannot find ${req.method} ${req.originalUrl} on this server`));
  });

  // 6. Global Error Handler
  app.use(errorHandler);

  return app;
};

export default createApp();
