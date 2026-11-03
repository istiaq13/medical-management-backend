import { Types } from 'mongoose';
import { Patient, IPatient } from '../models/patient.model';
import { Doctor } from '../models/doctor.model';
import { ApiError } from '../helpers/api-error';
import { buildPaginationMeta } from '../helpers/pagination.helper';

export interface PatientQueryParams {
  search?: string;
  condition?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  doctorId?: string;
  startDate?: string;
  endDate?: string;
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export class PatientService {
  static async createPatient(data: any) {
    if (!Types.ObjectId.isValid(data.doctorId)) {
      throw new ApiError(400, 'Invalid doctor ID');
    }

    const doctor = await Doctor.findById(data.doctorId);
    if (!doctor) {
      throw new ApiError(404, 'Assigned doctor does not exist');
    }

    const patient = await Patient.create(data);
    return patient.populate('doctorId', 'name specialization hospital email phone');
  }

  static async getPatients(query: PatientQueryParams) {
    const {
      search,
      condition,
      gender,
      doctorId,
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
        { phone: regex },
        { email: regex },
        { condition: regex },
      ];
    }

    // Condition filter
    if (condition && condition.trim() !== '') {
      filter.condition = new RegExp(`^${condition.trim()}$`, 'i');
    }

    // Gender filter
    if (gender) {
      filter.gender = gender;
    }

    // Doctor filter
    if (doctorId && doctorId.trim() !== '') {
      if (!Types.ObjectId.isValid(doctorId)) {
        throw new ApiError(400, 'Invalid doctor ID filter');
      }
      filter.doctorId = new Types.ObjectId(doctorId);
    }

    // Date range filter
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

    const [patients, total] = await Promise.all([
      Patient.find(filter)
        .populate('doctorId', 'name specialization hospital email')
        .sort(sortDirective)
        .skip(skip)
        .limit(limit)
        .lean(),
      Patient.countDocuments(filter),
    ]);

    const meta = buildPaginationMeta(page, limit, total);
    return { patients, meta };
  }

  static async getPatientById(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new ApiError(400, 'Invalid patient ID');
    }

    const patient = await Patient.findById(id)
      .populate('doctorId', 'name specialization hospital email phone')
      .lean();

    if (!patient) {
      throw new ApiError(404, 'Patient not found');
    }

    return patient;
  }

  static async updatePatient(id: string, data: Partial<IPatient>) {
    if (!Types.ObjectId.isValid(id)) {
      throw new ApiError(400, 'Invalid patient ID');
    }

    if (data.doctorId) {
      if (!Types.ObjectId.isValid(data.doctorId as any)) {
        throw new ApiError(400, 'Invalid doctor ID');
      }
      const doctor = await Doctor.findById(data.doctorId);
      if (!doctor) {
        throw new ApiError(404, 'Assigned doctor does not exist');
      }
    }

    const patient = await Patient.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    })
      .populate('doctorId', 'name specialization hospital email phone')
      .lean();

    if (!patient) {
      throw new ApiError(404, 'Patient not found');
    }

    return patient;
  }

  static async deletePatient(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new ApiError(400, 'Invalid patient ID');
    }

    const patient = await Patient.findByIdAndDelete(id).lean();
    if (!patient) {
      throw new ApiError(404, 'Patient not found');
    }

    return patient;
  }
}

