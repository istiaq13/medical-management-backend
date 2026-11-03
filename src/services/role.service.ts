import { Types } from 'mongoose';
import { Role, IRole } from '../models/role.model';
import { User } from '../models/user.model';
import { ApiError } from '../helpers/api-error';
import { buildPaginationMeta } from '../helpers/pagination.helper';

export interface RoleQueryParams {
  search?: string;
  page?: number;
  limit?: number;
}

export class RoleService {
  static async createRole(data: Partial<IRole>) {
    const existing = await Role.findOne({ name: data.name });
    if (existing) {
      throw new ApiError(409, `Role '${data.name}' already exists`);
    }

    const role = await Role.create(data);
    return role;
  }

  static async getAllRoles(query: RoleQueryParams) {
    const page = query.page ? Number(query.page) : 1;
    const limit = query.limit ? Number(query.limit) : 20;
    const skip = (page - 1) * limit;

    const filter: any = {};
    if (query.search && query.search.trim() !== '') {
      const regex = new RegExp(query.search.trim(), 'i');
      filter.$or = [{ name: regex }, { description: regex }];
    }

    const [roles, total] = await Promise.all([
      Role.find(filter).sort({ isSystem: -1, name: 1 }).skip(skip).limit(limit).lean(),
      Role.countDocuments(filter),
    ]);

    const meta = buildPaginationMeta(page, limit, total);
    return { roles, meta };
  }

  static async getRoleById(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new ApiError(400, 'Invalid role ID');
    }

    const role = await Role.findById(id).lean();
    if (!role) {
      throw new ApiError(404, 'Role not found');
    }

    return role;
  }

  static async updateRole(id: string, data: Partial<IRole>) {
    if (!Types.ObjectId.isValid(id)) {
      throw new ApiError(400, 'Invalid role ID');
    }

    const role = await Role.findById(id);
    if (!role) {
      throw new ApiError(404, 'Role not found');
    }

    // Protect system role names
    if (role.isSystem && data.name && data.name !== role.name) {
      throw new ApiError(400, 'System role name cannot be modified');
    }

    // Check duplicate name
    if (data.name && data.name !== role.name) {
      const existing = await Role.findOne({ name: data.name });
      if (existing) {
        throw new ApiError(409, `Role with name '${data.name}' already exists`);
      }
    }

    Object.assign(role, data);
    await role.save();
    return role;
  }

  static async deleteRole(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new ApiError(400, 'Invalid role ID');
    }

    const role = await Role.findById(id);
    if (!role) {
      throw new ApiError(404, 'Role not found');
    }

    if (role.isSystem) {
      throw new ApiError(400, 'Cannot delete a protected system role');
    }

    // Check if any users are assigned this role
    const usersWithRole = await User.countDocuments({ role: role.name });
    if (usersWithRole > 0) {
      throw new ApiError(
        400,
        `Cannot delete role '${role.name}' because ${usersWithRole} user(s) are assigned to it`
      );
    }

    await Role.findByIdAndDelete(id);
    return { success: true, message: `Role '${role.name}' deleted successfully` };
  }
}

