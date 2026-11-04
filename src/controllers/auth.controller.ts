import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { ApiResponse } from '../helpers/api-response';
import { AuthRequest } from '../middlewares/auth.middleware';

export class AuthController {
  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const result = await AuthService.login(email, password);
      return ApiResponse.success(res, result, 'Logged in successfully');
    } catch (error) {
      next(error);
    }
  }

  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, password, role } = req.body;
      const result = await AuthService.register(name, email, password, role);
      return ApiResponse.success(res, result, 'User registered successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  static async getMe(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      return ApiResponse.success(res, req.user, 'Current user profile fetched');
    } catch (error) {
      next(error);
    }
  }

  static async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await AuthService.getAllUsers();
      return ApiResponse.success(res, users, 'Users retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  static async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const user = await AuthService.getUserById(id);
      return ApiResponse.success(res, user, 'User retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  static async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const user = await AuthService.updateUser(id, req.body);
      return ApiResponse.success(res, user, 'User updated successfully');
    } catch (error) {
      next(error);
    }
  }

  static async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const result = await AuthService.deleteUser(id);
      return ApiResponse.success(res, result, 'User deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

