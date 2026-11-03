import { Request, Response, NextFunction } from 'express';
import { DoctorService } from '../services/doctor.service';
import { ApiResponse } from '../helpers/api-response';

export class DoctorController {
  static async createDoctor(req: Request, res: Response, next: NextFunction) {
    try {
      const doctor = await DoctorService.createDoctor(req.body);
      return ApiResponse.success(res, doctor, 'Doctor created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  static async getDoctors(req: Request, res: Response, next: NextFunction) {
    try {
      const { doctors, meta } = await DoctorService.getDoctors(req.query as any);
      return ApiResponse.success(res, doctors, 'Doctors retrieved successfully', 200, meta);
    } catch (error) {
      next(error);
    }
  }

  static async getDoctorById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const doctor = await DoctorService.getDoctorById(id);
      return ApiResponse.success(res, doctor, 'Doctor details retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  static async updateDoctor(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const doctor = await DoctorService.updateDoctor(id, req.body);
      return ApiResponse.success(res, doctor, 'Doctor updated successfully');
    } catch (error) {
      next(error);
    }
  }

  static async deleteDoctor(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const result = await DoctorService.deleteDoctor(id);
      return ApiResponse.success(res, result, 'Doctor and associated records removed successfully');
    } catch (error) {
      next(error);
    }
  }

  static async getDoctorPatients(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const { doctor, patients, meta } = await DoctorService.getDoctorPatients(
        id,
        req.query as any
      );
      return ApiResponse.success(
        res,
        { doctor, patients },
        'Doctor patients retrieved successfully',
        200,
        meta
      );
    } catch (error) {
      next(error);
    }
  }

  static async addPatientToDoctor(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const patient = await DoctorService.addPatientToDoctor(id, req.body);
      return ApiResponse.success(res, patient, 'Patient added under doctor successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  static async removePatientFromDoctor(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const patientId = Array.isArray(req.params.patientId) ? req.params.patientId[0] : req.params.patientId;
      const patient = await DoctorService.removePatientFromDoctor(id, patientId);
      return ApiResponse.success(res, patient, 'Patient removed from doctor successfully');
    } catch (error) {
      next(error);
    }
  }
}

