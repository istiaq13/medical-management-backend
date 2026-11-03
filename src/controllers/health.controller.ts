import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { ENV } from '../lib/env';

export class HealthController {
  static getHealth(req: Request, res: Response) {
    const isDbConnected = mongoose.connection.readyState === 1;
    const memory = process.memoryUsage();

    const healthData = {
      status: isDbConnected ? 'ok' : 'degraded',
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      environment: ENV.NODE_ENV,
      database: {
        status: isDbConnected ? 'connected' : 'disconnected',
        name: mongoose.connection.name || 'unknown',
      },
      system: {
        memoryHeapUsedMB: Math.round(memory.heapUsed / 1024 / 1024),
        nodeVersion: process.version,
      },
    };

    const statusCode = isDbConnected ? 200 : 503;
    return res.status(statusCode).json(healthData);
  }
}

