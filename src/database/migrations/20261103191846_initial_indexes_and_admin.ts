import { Db } from 'mongodb';
import { User } from '../../models/user.model';
import { Doctor } from '../../models/doctor.model';
import { Patient } from '../../models/patient.model';
import { ENV } from '../../lib/env';

export const id = '20261103191846_initial_indexes_and_admin';

/**
 * Run migration forward: Create performance indexes & ensure default Super Admin exists.
 */
export async function up(db: Db): Promise<void> {
  console.log(`  ▶ Executing migration up: ${id}`);

  // 1. Sync User unique indexes
  await User.syncIndexes();
  console.log('    ✓ User indexes synchronized');

  // 2. Sync Doctor text search, date, and specialization indexes
  await Doctor.syncIndexes();
  console.log('    ✓ Doctor indexes synchronized');

  // 3. Sync Patient doctorId reference, condition, and date indexes
  await Patient.syncIndexes();
  console.log('    ✓ Patient indexes synchronized');

  // 4. Ensure default Admin user exists
  const existingAdmin = await User.findOne({ email: ENV.ADMIN_EMAIL });
  if (!existingAdmin) {
    await User.create({
      name: ENV.ADMIN_NAME,
      email: ENV.ADMIN_EMAIL,
      password: ENV.ADMIN_PASSWORD,
      role: 'ADMIN',
    });
    console.log(`    ✓ Default admin created: ${ENV.ADMIN_EMAIL}`);
  } else {
    console.log(`    ✓ Admin verified: ${ENV.ADMIN_EMAIL}`);
  }
}

/**
 * Revert migration changes
 */
export async function down(db: Db): Promise<void> {
  console.log(`  ◀ Reverting migration down: ${id}`);
  await db.collection('doctors').dropIndexes().catch(() => {});
  await db.collection('patients').dropIndexes().catch(() => {});
  await db.collection('users').deleteOne({ email: ENV.ADMIN_EMAIL });
}
