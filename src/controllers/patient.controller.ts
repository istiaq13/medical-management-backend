import { Request, Response, NextFunction } from 'express';
import { PatientService } from '../services/patient.service';
import { ApiResponse } from '../helpers/api-response';

export class PatientController {
  static async createPatient(req: Request, res: Response, next: NextFunction) {
    try {
      const patient = await PatientService.createPatient(req.body);
      return ApiResponse.success(res, patient, 'Patient created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  static async getPatients(req: Request, res: Response, next: NextFunction) {
    try {
      const { patients, meta } = await PatientService.getPatients(req.query as any);
      return ApiResponse.success(res, patients, 'Patients retrieved successfully', 200, meta);
    } catch (error) {
      next(error);
    }
  }

  static async getPatientById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const patient = await PatientService.getPatientById(id);
      return ApiResponse.success(res, patient, 'Patient retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  static async updatePatient(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const patient = await PatientService.updatePatient(id, req.body);
      return ApiResponse.success(res, patient, 'Patient updated successfully');
    } catch (error) {
      next(error);
    }
  }

  static async deletePatient(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const patient = await PatientService.deletePatient(id);
      return ApiResponse.success(res, patient, 'Patient deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

