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
}

