import { Doctor } from '../models/doctor.model';
import { Patient } from '../models/patient.model';

export class DashboardService {
  static async getAnalytics() {
    // 1. Overview counts
    const [totalDoctors, totalPatients] = await Promise.all([
      Doctor.countDocuments(),
      Patient.countDocuments(),
    ]);

    const averagePatientsPerDoctor =
      totalDoctors > 0 ? Number((totalPatients / totalDoctors).toFixed(1)) : 0;

    // 2. Patients per doctor aggregation
    const patientsPerDoctor = await Doctor.aggregate([
      {
        $lookup: {
          from: 'patients',
          localField: '_id',
          foreignField: 'doctorId',
          as: 'patientsList',
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          specialization: 1,
          hospital: 1,
          patientCount: { $size: '$patientsList' },
        },
      },
      { $sort: { patientCount: -1 } },
      { $limit: 10 },
    ]);

    // 3. Date-based statistics (Patient registrations grouped by year-month)
    const dateBasedStats = await Patient.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      {
        $project: {
          _id: 0,
          date: {
            $concat: [
              { $toString: '$_id.year' },
              '-',
              {
                $cond: {
                  if: { $lt: ['$_id.month', 10] },
                  then: { $concat: ['0', { $toString: '$_id.month' }] },
                  else: { $toString: '$_id.month' },
                },
              },
            ],
          },
          count: 1,
        },
      },
    ]);

    // 4. Condition distribution for charts
    const conditionDistribution = await Patient.aggregate([
      {
        $group: {
          _id: '$condition',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      {
        $project: {
          _id: 0,
          condition: '$_id',
          count: 1,
        },
      },
    ]);

    // 5. Specialization distribution for charts
    const specializationDistribution = await Doctor.aggregate([
      {
        $group: {
          _id: '$specialization',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      {
        $project: {
          _id: 0,
          specialization: '$_id',
          count: 1,
        },
      },
    ]);

    return {
      summary: {
        totalDoctors,
        totalPatients,
        averagePatientsPerDoctor,
      },
      patientsPerDoctor,
      dateBasedStats,
      conditionDistribution,
      specializationDistribution,
    };
  }
}

