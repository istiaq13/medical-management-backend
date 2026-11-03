import fs from 'fs';
import path from 'path';

function generateTimestamp(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  return `${year}${month}${day}${hours}${minutes}${seconds}`;
}

function createMigration() {
  const args = process.argv.slice(2);
  const rawName = args[0] || 'migration';
  const sanitizedName = rawName.toLowerCase().replace(/[^a-z0-9_]/g, '_');

  const timestamp = generateTimestamp();
  const migrationId = `${timestamp}_${sanitizedName}`;
  const fileName = `${migrationId}.ts`;
  const migrationsDir = path.resolve(__dirname);
  const filePath = path.join(migrationsDir, fileName);

  const template = `import { Db } from 'mongodb';

export const id = '${migrationId}';

/**
 * Run migration forward
 */
export async function up(db: Db): Promise<void> {
  console.log(\`  ▶ Executing migration up: \${id}\`);
  // TODO: Implement forward migration logic
  // e.g., await db.collection('example').createIndex({ field: 1 });
}

/**
 * Revert migration changes
 */
export async function down(db: Db): Promise<void> {
  console.log(\`  ◀ Reverting migration down: \${id}\`);
  // TODO: Implement rollback logic
  // e.g., await db.collection('example').dropIndex('field_1');
}
`;

  fs.writeFileSync(filePath, template, 'utf-8');
  console.log(`✅ Successfully generated new migration:`);
  console.log(`📁 ${filePath}`);
}

createMigration();

