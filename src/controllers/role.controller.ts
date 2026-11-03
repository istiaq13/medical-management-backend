import { Request, Response, NextFunction } from 'express';
import { RoleService } from '../services/role.service';
import { ApiResponse } from '../helpers/api-response';

export class RoleController {
  static async createRole(req: Request, res: Response, next: NextFunction) {
    try {
      const role = await RoleService.createRole(req.body);
      return ApiResponse.success(res, role, 'Role created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  static async getAllRoles(req: Request, res: Response, next: NextFunction) {
    try {
      const { roles, meta } = await RoleService.getAllRoles(req.query as any);
      return ApiResponse.success(res, roles, 'Roles retrieved successfully', 200, meta);
    } catch (error) {
      next(error);
    }
  }

  static async getRoleById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const role = await RoleService.getRoleById(id);
      return ApiResponse.success(res, role, 'Role retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  static async updateRole(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const role = await RoleService.updateRole(id, req.body);
      return ApiResponse.success(res, role, 'Role updated successfully');
    } catch (error) {
      next(error);
    }
  }

  static async deleteRole(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const result = await RoleService.deleteRole(id);
      return ApiResponse.success(res, result, 'Role deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}
