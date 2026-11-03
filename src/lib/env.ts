import dotenv from 'dotenv';
dotenv.config();

/**
 * Validates and retrieves required environment variables without hardcoded fallbacks.
 * Throws a descriptive error on boot if any essential secret is missing.
 */
const getRequiredEnv = (key: string): string => {
  const value = process.env[key];
  if (!value || value.trim() === '') {
    throw new Error(`[Configuration Error] Missing required environment variable: ${key}`);
  }
  return value.trim();
};

export const ENV = {
  PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGODB_URI: getRequiredEnv('MONGODB_URI'),
  JWT_SECRET: getRequiredEnv('JWT_SECRET'),
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
  ADMIN_NAME: getRequiredEnv('ADMIN_NAME'),
  ADMIN_EMAIL: getRequiredEnv('ADMIN_EMAIL'),
  ADMIN_PASSWORD: getRequiredEnv('ADMIN_PASSWORD'),
};
