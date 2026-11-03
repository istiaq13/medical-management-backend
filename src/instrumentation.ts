import { dbProvider } from './provider/database.provider';
import { runMigrations } from './database/migrations';
import { ENV } from './lib/env';

/**
 * Server instrumentation hook.
 * Runs on startup to initialize database connections, verify runtime environment,
 * and synchronize database indexes and default administrative state.
 */
export async function register(): Promise<void> {
  console.log('🩺 [Instrumentation] Initializing server runtime environment...');
  console.log(`🩺 [Instrumentation] Node Environment: ${ENV.NODE_ENV}`);

  // 1. Connect to Database via DatabaseProvider
  await dbProvider.connect();

  // 2. Synchronize indexes and schema integrity
  await runMigrations();

  console.log('🩺 [Instrumentation] Database connection and schema verified.');
}
