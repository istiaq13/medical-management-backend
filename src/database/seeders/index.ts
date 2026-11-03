import { User } from '../../models/user.model';
import { Doctor } from '../../models/doctor.model';
import { Patient } from '../../models/patient.model';
import { dbProvider } from '../../provider/database.provider';
import { ENV } from '../../lib/env';

const sampleDoctors = [
  {
    name: 'Dr. Sarah Jenkins',
    specialization: 'Cardiology',
    hospital: 'Metropolitan Heart Institute',
    phone: '+1 555-0101',
    email: 'sarah.jenkins@metroheart.org',
  },
  {
    name: 'Dr. Michael Chang',
    specialization: 'Neurology',
    hospital: 'Central Neurosciences Center',
    phone: '+1 555-0102',
    email: 'm.chang@centralneuro.org',
  },
  {
    name: 'Dr. Emily Rodriguez',
    specialization: 'Pediatrics',
    hospital: 'St. Jude Children Hospital',
    phone: '+1 555-0103',
    email: 'e.rodriguez@stjude-health.org',
  },
  {
    name: 'Dr. James Wilson',
    specialization: 'Orthopedics',
    hospital: 'Apex Bone & Joint Clinic',
    phone: '+1 555-0104',
    email: 'j.wilson@apexortho.org',
  },
  {
    name: 'Dr. Aisha Patel',
    specialization: 'Dermatology',
    hospital: 'Global Skin Care Institute',
    phone: '+1 555-0105',
    email: 'aisha.patel@globalskin.org',
  },
  {
    name: 'Dr. Robert Martinez',
    specialization: 'General Medicine',
    hospital: 'City General Medical Center',
    phone: '+1 555-0106',
    email: 'r.martinez@citygeneral.org',
  },
  {
    name: 'Dr. Olivia Taylor',
    specialization: 'Oncology',
    hospital: 'Memorial Cancer Institute',
    phone: '+1 555-0107',
    email: 'o.taylor@memorialcancer.org',
  },
];

const samplePatients = [
  { name: 'John Doe', age: 45, gender: 'MALE', phone: '+1 555-1001', email: 'john.doe@example.com', condition: 'Hypertension', notes: 'Blood pressure monitoring needed' },
  { name: 'Emma Watson', age: 29, gender: 'FEMALE', phone: '+1 555-1002', email: 'emma.w@example.com', condition: 'Asthma', notes: 'Prescribed inhaler' },
  { name: 'David Smith', age: 62, gender: 'MALE', phone: '+1 555-1003', email: 'david.smith@example.com', condition: 'Type 2 Diabetes', notes: 'Insulin level tracking' },
  { name: 'Sophia Miller', age: 8, gender: 'FEMALE', phone: '+1 555-1004', email: 'miller.parents@example.com', condition: 'Allergic Rhinitis', notes: 'Seasonal pollen allergies' },
  { name: 'James Brown', age: 54, gender: 'MALE', phone: '+1 555-1005', email: 'jbrown@example.com', condition: 'Coronary Artery Disease', notes: 'Scheduled for ECG' },
  { name: 'Ava Johnson', age: 34, gender: 'FEMALE', phone: '+1 555-1006', email: 'ava.j@example.com', condition: 'Migraine', notes: 'Chronic cluster migraines' },
  { name: 'Liam Wilson', age: 23, gender: 'MALE', phone: '+1 555-1007', email: 'liam.w@example.com', condition: 'ACL Tear', notes: 'Post-op physiotherapy' },
  { name: 'Mia Martinez', age: 41, gender: 'FEMALE', phone: '+1 555-1008', email: 'mia.m@example.com', condition: 'Eczema', notes: 'Topical corticosteroid prescribed' },
  { name: 'Noah Davis', age: 67, gender: 'MALE', phone: '+1 555-1009', email: 'noah.davis@example.com', condition: 'Osteoarthritis', notes: 'Knee joint stiffness' },
  { name: 'Isabella Garcia', age: 12, gender: 'FEMALE', phone: '+1 555-1010', email: 'garcia.fam@example.com', condition: 'Bronchitis', notes: 'Nebulization treatment' },
  { name: 'Lucas Anderson', age: 50, gender: 'MALE', phone: '+1 555-1011', email: 'lucas.a@example.com', condition: 'Hypertension', notes: 'Dietary sodium reduction' },
  { name: 'Charlotte Thomas', age: 38, gender: 'FEMALE', phone: '+1 555-1012', email: 'charlotte.t@example.com', condition: 'Psoriasis', notes: 'Phototherapy candidate' },
  { name: 'Henry Jackson', age: 71, gender: 'MALE', phone: '+1 555-1013', email: 'henry.j@example.com', condition: 'Heart Failure', notes: 'Ejection fraction 40%' },
  { name: 'Amelia White', age: 4, gender: 'FEMALE', phone: '+1 555-1014', email: 'white.parents@example.com', condition: 'Viral Fever', notes: 'Hydration and rest advised' },
  { name: 'Alexander Harris', age: 31, gender: 'MALE', phone: '+1 555-1015', email: 'alex.harris@example.com', condition: 'Lumbar Strain', notes: 'Ergonomic assessment needed' },
  { name: 'Harper Martin', age: 58, gender: 'FEMALE', phone: '+1 555-1016', email: 'harper.m@example.com', condition: 'Type 2 Diabetes', notes: 'HbA1c quarterly review' },
  { name: 'Sebastian Clark', age: 49, gender: 'MALE', phone: '+1 555-1017', email: 'sebastian.c@example.com', condition: 'Epilepsy', notes: 'Anticonvulsant maintenance' },
  { name: 'Evelyn Lewis', age: 65, gender: 'FEMALE', phone: '+1 555-1018', email: 'evelyn.lewis@example.com', condition: 'Breast Neoplasm', notes: 'Chemotherapy cycle 2' },
];

export async function runSeeders(): Promise<void> {
  console.log('🌱 Starting database seeders...');

  // 1. Seed or update Admin
  let admin = await User.findOne({ email: ENV.ADMIN_EMAIL });
  if (!admin) {
    admin = await User.create({
      name: ENV.ADMIN_NAME,
      email: ENV.ADMIN_EMAIL,
      password: ENV.ADMIN_PASSWORD,
      role: 'ADMIN',
    });
    console.log(`✅ Admin created: ${admin.email}`);
  } else {
    console.log(`ℹ️ Admin already exists: ${admin.email}`);
  }

  // 2. Clear existing sample Doctors & Patients for a clean slate
  await Patient.deleteMany({});
  await Doctor.deleteMany({});
  console.log('🧹 Cleaned existing doctor and patient data');

  // 3. Insert Doctors
  const createdDoctors = await Doctor.insertMany(sampleDoctors);
  console.log(`✅ Seeded ${createdDoctors.length} doctors`);

  // 4. Insert Patients assigned to doctors across past months
  const now = new Date();
  const patientsToInsert = samplePatients.map((patient, index) => {
    const assignedDoctor = createdDoctors[index % createdDoctors.length];
    const monthsAgo = index % 5;
    const daysAgo = (index * 3) % 28;
    const creationDate = new Date(now.getFullYear(), now.getMonth() - monthsAgo, 28 - daysAgo);

    return {
      ...patient,
      doctorId: assignedDoctor._id,
      createdAt: creationDate,
      updatedAt: creationDate,
    };
  });

  const createdPatients = await Patient.insertMany(patientsToInsert);
  console.log(`✅ Seeded ${createdPatients.length} patients linked to doctors with historical dates`);

  console.log('🎉 Seeding successfully completed!');
}

if (require.main === module) {
  (async () => {
    try {
      await dbProvider.connect();
      await runSeeders();
    } catch (error) {
      console.error('❌ Seeding failed:', error);
      process.exit(1);
    } finally {
      await dbProvider.disconnect();
      process.exit(0);
    }
  })();
}

