import mongoose from 'mongoose';
import { connectDB, disconnectDB } from '../database/connection';

class DatabaseProvider {
  private static instance: DatabaseProvider;
  private isConnected = false;

  private constructor() {}

  public static getInstance(): DatabaseProvider {
    if (!DatabaseProvider.instance) {
      DatabaseProvider.instance = new DatabaseProvider();
    }
    return DatabaseProvider.instance;
  }

  public async connect(): Promise<typeof mongoose> {
    if (this.isConnected) {
      return mongoose;
    }
    const connection = await connectDB();
    this.isConnected = true;
    return connection;
  }

  public async disconnect(): Promise<void> {
    if (this.isConnected) {
      await disconnectDB();
      this.isConnected = false;
    }
  }

  public getConnection(): typeof mongoose {
    return mongoose;
  }
}

export const dbProvider = DatabaseProvider.getInstance();

