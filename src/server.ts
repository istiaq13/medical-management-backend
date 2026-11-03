import app from './app';
import { register as runInstrumentation } from './instrumentation';
import { dbProvider } from './provider/database.provider';
import { ENV } from './lib/env';

const startServer = async () => {
  try {
    // 1. Run instrumentation (DB connection & environment verification)
    await runInstrumentation();

    // 2. Start Express server
    const server = app.listen(ENV.PORT, () => {
      console.log(`🚀 Doctor Tracker Backend listening on http://localhost:${ENV.PORT}`);
      console.log(`🩺 Environment: ${ENV.NODE_ENV}`);
      console.log(`📋 API Base URL: http://localhost:${ENV.PORT}/api/v1`);
    });

    // Graceful shutdown handling
    const shutdown = async () => {
      console.log('Received kill signal, shutting down gracefully...');
      server.close(async () => {
        await dbProvider.disconnect();
        console.log('Closed out remaining connections');
        process.exit(0);
      });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
