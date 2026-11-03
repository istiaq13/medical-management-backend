import { Types } from 'mongoose';
import { Doctor, IDoctor } from '../models/doctor.model';
import { Patient } from '../models/patient.model';
import { ApiError } from '../helpers/api-error';
import { buildPaginationMeta } from '../helpers/pagination.helper';

export interface DoctorQueryParams {
  search?: string;
  specialization?: string;
  hospital?: string;
  startDate?: string;
  endDate?: string;
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export class DoctorService {
  static async createDoctor(data: Partial<IDoctor>) {
    const existing = await Doctor.findOne({ email: data.email });
    if (existing) {
      throw new ApiError(409, 'Doctor with this email already exists');
    }
    const doctor = await Doctor.create(data);
    return doctor;
  }

  static async getDoctors(query: DoctorQueryParams) {
    const {
      search,
      specialization,
      hospital,
      startDate,
      endDate,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;

    const filter: any = {};

    // Multi-field search
    if (search && search.trim() !== '') {
      const regex = new RegExp(search.trim(), 'i');
      filter.$or = [
        { name: regex },
        { specialization: regex },
        { hospital: regex },
        { email: regex },
      ];
    }

    // Exact or case-insensitive filter
    if (specialization && specialization.trim() !== '') {
      filter.specialization = new RegExp(`^${specialization.trim()}$`, 'i');
    }

    if (hospital && hospital.trim() !== '') {
      filter.hospital = new RegExp(`^${hospital.trim()}$`, 'i');
    }

    // Date-wise filtering
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) {
        filter.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        filter.createdAt.$lte = end;
      }
    }

    const skip = (page - 1) * limit;
    const sortDirective: { [key: string]: 1 | -1 } = {
      [sortBy]: sortOrder === 'asc' ? 1 : -1,
    };

    // Use aggregation pipeline to include patient count efficiently in a single query
    const [result] = await Doctor.aggregate([
      { $match: filter },
      {
        $facet: {
          total: [{ $count: 'count' }],
          doctors: [
            { $sort: sortDirective },
            { $skip: skip },
            { $limit: limit },
            {
              $lookup: {
                from: 'patients',
                localField: '_id',
                foreignField: 'doctorId',
                as: 'patients',
              },
            },
            {
              $addFields: {
                patientCount: { $size: '$patients' },
              },
            },
            {
              $project: {
                patients: 0,
              },
            },
          ],
        },
      },
    ]);

    const total = result.total[0] ? result.total[0].count : 0;
    const doctors = result.doctors;
    const meta = buildPaginationMeta(page, limit, total);

    return { doctors, meta };
  }

  static async getDoctorById(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new ApiError(400, 'Invalid doctor ID');
    }

    const doctor = await Doctor.findById(id).lean();
    if (!doctor) {
      throw new ApiError(404, 'Doctor not found');
    }

    const patientCount = await Patient.countDocuments({ doctorId: id });
    return { ...doctor, patientCount };
  }

  static async updateDoctor(id: string, data: Partial<IDoctor>) {
    if (!Types.ObjectId.isValid(id)) {
      throw new ApiError(400, 'Invalid doctor ID');
    }

    if (data.email) {
      const existing = await Doctor.findOne({ email: data.email, _id: { $ne: id } });
      if (existing) {
        throw new ApiError(409, 'Doctor with this email already exists');
      }
    }

    const doctor = await Doctor.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).lean();

    if (!doctor) {
      throw new ApiError(404, 'Doctor not found');
    }

    return doctor;
  }

  static async deleteDoctor(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new ApiError(400, 'Invalid doctor ID');
    }

    const doctor = await Doctor.findById(id);
    if (!doctor) {
      throw new ApiError(404, 'Doctor not found');
    }

    const deletedPatients = await Patient.deleteMany({ doctorId: id });
    await Doctor.findByIdAndDelete(id);

    return { doctor, deletedPatientsCount: deletedPatients.deletedCount };
  }

  static async getDoctorPatients(
    doctorId: string,
    query: { page?: number; limit?: number; search?: string }
  ) {
    if (!Types.ObjectId.isValid(doctorId)) {
      throw new ApiError(400, 'Invalid doctor ID');
    }

    const doctor = await Doctor.findById(doctorId).lean();
    if (!doctor) {
      throw new ApiError(404, 'Doctor not found');
    }

    const page = query.page ? Number(query.page) : 1;
    const limit = query.limit ? Number(query.limit) : 10;
    const skip = (page - 1) * limit;

    const filter: any = { doctorId: new Types.ObjectId(doctorId) };

    if (query.search && query.search.trim() !== '') {
      const regex = new RegExp(query.search.trim(), 'i');
      filter.$or = [{ name: regex }, { phone: regex }, { condition: regex }];
    }

    const [patients, total] = await Promise.all([
      Patient.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Patient.countDocuments(filter),
    ]);

    const meta = buildPaginationMeta(page, limit, total);
    return { doctor, patients, meta };
  }

  static async addPatientToDoctor(doctorId: string, patientData: any) {
    if (!Types.ObjectId.isValid(doctorId)) {
      throw new ApiError(400, 'Invalid doctor ID');
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      throw new ApiError(404, 'Doctor not found');
    }

    const patient = await Patient.create({
      ...patientData,
      doctorId: new Types.ObjectId(doctorId),
    });

    return patient;
  }

  static async removePatientFromDoctor(doctorId: string, patientId: string) {
    if (!Types.ObjectId.isValid(doctorId) || !Types.ObjectId.isValid(patientId)) {
      throw new ApiError(400, 'Invalid doctor or patient ID');
    }

    const patient = await Patient.findOneAndDelete({
      _id: patientId,
      doctorId: doctorId,
    });

    if (!patient) {
      throw new ApiError(404, 'Patient not found under this doctor');
    }

    return patient;
  }
}

