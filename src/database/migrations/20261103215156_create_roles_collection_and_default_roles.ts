import { Db } from 'mongodb';
import { Role } from '../../models/role.model';

export const id = '20261103215156_create_roles_collection_and_default_roles';

const defaultRoles = [
  {
    name: 'ADMIN',
    description: 'Full administrative privileges across doctors, patients, and analytics',
    permissions: [
      'manage:doctors',
      'manage:patients',
      'view:dashboard',
      'manage:roles',
      'manage:users',
    ],
    isSystem: true,
  },
  {
    name: 'DOCTOR',
    description: 'Medical practitioner with access to view and manage assigned patients',
    permissions: ['view:patients', 'manage:assigned_patients', 'view:doctors'],
    isSystem: true,
  },
  {
    name: 'STAFF',
    description: 'Hospital support and scheduling staff',
    permissions: ['view:doctors', 'view:patients', 'create:patients'],
    isSystem: false,
  },
  {
    name: 'USER',
    description: 'Standard authenticated portal user',
    permissions: ['view:profile'],
    isSystem: true,
  },
];

/**
 * Run migration forward: Create roles collection, unique index, and seed system roles
 */
export async function up(db: Db): Promise<void> {
  console.log(`  ▶ Executing migration up: ${id}`);

  // 1. Sync Role indexes (unique index on name)
  await Role.syncIndexes();
  console.log('    ✓ Role indexes synchronized');

  // 2. Seed initial default roles
  for (const roleData of defaultRoles) {
    const existing = await Role.findOne({ name: roleData.name });
    if (!existing) {
      await Role.create(roleData);
      console.log(`    ✓ Default role created: ${roleData.name}`);
    } else {
      console.log(`    ✓ Role already exists: ${roleData.name}`);
    }
  }
}

/**
 * Revert migration changes
 */
export async function down(db: Db): Promise<void> {
  console.log(`  ◀ Reverting migration down: ${id}`);
  await db.collection('roles').dropIndexes().catch(() => {});
  await db.collection('roles').deleteMany({
    name: { $in: ['STAFF'] }, // Only remove non-system roles on rollback
  });
}
