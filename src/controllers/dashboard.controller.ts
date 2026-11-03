import { Request, Response, NextFunction } from 'express';
import { DashboardService } from '../services/dashboard.service';
import { ApiResponse } from '../helpers/api-response';

export class DashboardController {
  static async getAnalytics(req: Request, res: Response, next: NextFunction) {
    try {
      const analytics = await DashboardService.getAnalytics();
      return ApiResponse.success(res, analytics, 'Dashboard analytics retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
}

