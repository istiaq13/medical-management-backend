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

  // 2. Root Health check route (used by Docker, Kubernetes, AWS, Render probes)
  app.get('/health', HealthController.getHealth);

  // 3. API V1 Routes
  app.use('/api/v1', apiRouter);

  // 4. Handle 404 Route Not Found
  app.use((req: Request, res: Response, next: NextFunction) => {
    next(new ApiError(404, `Cannot find ${req.method} ${req.originalUrl} on this server`));
  });

  // 5. Global Error Handler
  app.use(errorHandler);

  return app;
};

export default createApp();
