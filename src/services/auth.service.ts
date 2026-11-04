import { User, IUser } from '../models/user.model';
import { signToken } from '../lib/jwt';
import { ApiError } from '../helpers/api-error';

export class AuthService {
  static async login(email: string, password: string) {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new ApiError(401, 'Invalid email or password');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new ApiError(401, 'Invalid email or password');
    }

    const token = signToken({
      id: (user._id as any).toString(),
      email: user.email,
      role: user.role,
    });

    return {
      user: user.toJSON(),
      token,
    };
  }

  static async register(
    name: string,
    email: string,
    password: string,
    role: 'ADMIN' | 'USER' = 'ADMIN'
  ) {
    const existing = await User.findOne({ email });
    if (existing) {
      throw new ApiError(409, 'User with this email already exists');
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
    });

    const token = signToken({
      id: (user._id as any).toString(),
      email: user.email,
      role: user.role,
    });

    return {
      user: user.toJSON(),
      token,
    };
  }

  static async getMe(userId: string) {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }
    return user;
  }

  static async getAllUsers() {
    return await User.find().select('-password').sort({ createdAt: -1 });
  }

  static async getUserById(id: string) {
    const user = await User.findById(id).select('-password');
    if (!user) {
      throw new ApiError(404, 'User not found');
    }
    return user;
  }

  static async updateUser(
    id: string,
    data: { name?: string; email?: string; password?: string; role?: string }
  ) {
    const user = await User.findById(id);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    if (data.name) user.name = data.name;
    if (data.email) {
      const existing = await User.findOne({ email: data.email, _id: { $ne: id } });
      if (existing) {
        throw new ApiError(409, 'User with this email already exists');
      }
      user.email = data.email;
    }
    if (data.role) user.role = data.role;
    if (data.password && data.password.trim().length >= 6) {
      user.password = data.password;
    }

    await user.save();
    return await User.findById(id).select('-password');
  }

  static async deleteUser(id: string) {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }
    return { message: 'User deleted successfully' };
  }
}

