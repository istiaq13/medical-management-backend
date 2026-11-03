import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';
import { Db } from 'mongodb';
import { dbProvider } from '../../provider/database.provider';

interface MigrationFile {
  id: string;
  filePath: string;
}

const MIGRATIONS_COLLECTION = '_migrations';

/**
 * Discovers and sorts all timestamped migration files in chronological order
 */
function getMigrationFiles(): MigrationFile[] {
  const dir = path.resolve(__dirname);
  const files = fs.readdirSync(dir);

  // Match timestamped migration files: YYYYMMDDHHmmss_*.ts (or .js in compiled dist)
  const timestampPattern = /^(\d{14}_.+)\.(ts|js)$/;

  const migrations: MigrationFile[] = [];

  for (const file of files) {
    const match = file.match(timestampPattern);
    if (match) {
      migrations.push({
        id: match[1],
        filePath: path.join(dir, file),
      });
    }
  }

  // Sort chronologically by timestamp
  return migrations.sort((a, b) => a.id.localeCompare(b.id));
}

/**
 * Runs all pending migrations forward (up)
 */
export async function runMigrations(): Promise<void> {
  const mongoose = dbProvider.getConnection();
  const db: Db = mongoose.connection.db as any;

  if (!db) {
    throw new Error('Database connection is not initialized');
  }

  const migrationsCollection = db.collection(MIGRATIONS_COLLECTION);
  const appliedDocs = await migrationsCollection.find({}).toArray();
  const appliedIds = new Set(appliedDocs.map((doc) => doc.id));

  const allMigrations = getMigrationFiles();
  const pending = allMigrations.filter((m) => !appliedIds.has(m.id));

  if (pending.length === 0) {
    console.log('✅ [Migration] Database is already up to date. No pending migrations.');
    return;
  }

  console.log(`🚀 [Migration] Found ${pending.length} pending migration(s)...`);

  for (const migration of pending) {
    console.log(`⏳ Applying: ${migration.id}`);
    const fileUrl = pathToFileURL(migration.filePath).href;
    const mod = await import(fileUrl);

    if (typeof mod.up !== 'function') {
      throw new Error(`Migration ${migration.id} is missing an 'up' function export`);
    }

    await mod.up(db);

    await migrationsCollection.insertOne({
      id: migration.id,
      appliedAt: new Date(),
    });

    console.log(`✅ Applied: ${migration.id}`);
  }

  console.log('🎉 [Migration] All pending migrations executed successfully.');
}

/**
 * Reverts the most recently applied migration (down)
 */
export async function rollbackMigration(): Promise<void> {
  const mongoose = dbProvider.getConnection();
  const db: Db = mongoose.connection.db as any;

  if (!db) {
    throw new Error('Database connection is not initialized');
  }

  const migrationsCollection = db.collection(MIGRATIONS_COLLECTION);
  const lastApplied = await migrationsCollection.find({}).sort({ appliedAt: -1 }).limit(1).toArray();

  if (lastApplied.length === 0) {
    console.log('ℹ️ [Migration] No migrations to revert.');
    return;
  }

  const migrationToRevert = lastApplied[0];
  const allMigrations = getMigrationFiles();
  const file = allMigrations.find((m) => m.id === migrationToRevert.id);

  if (!file) {
    throw new Error(`Migration file for ${migrationToRevert.id} was not found on disk.`);
  }

  console.log(`🔄 Reverting migration: ${migrationToRevert.id}...`);
  const fileUrl = pathToFileURL(file.filePath).href;
  const mod = await import(fileUrl);

  if (typeof mod.down === 'function') {
    await mod.down(db);
  }

  await migrationsCollection.deleteOne({ id: migrationToRevert.id });
  console.log(`✅ Successfully reverted migration: ${migrationToRevert.id}`);
}

// Standalone execution via CLI
if (require.main === module) {
  const isDown = process.argv.includes('--down');
  (async () => {
    try {
      await dbProvider.connect();
      if (isDown) {
        await rollbackMigration();
      } else {
        await runMigrations();
      }
    } catch (error) {
      console.error('❌ [Migration] Failed:', error);
      process.exit(1);
    } finally {
      await dbProvider.disconnect();
      process.exit(0);
    }
  })();
}
