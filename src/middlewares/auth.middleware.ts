import { Request, Response, NextFunction } from 'express';
import { verifyToken, JwtPayload } from '../lib/jwt';
import { ApiError } from '../helpers/api-error';
import { User, IUser } from '../models/user.model';

export interface AuthRequest extends Request {
  user?: IUser;
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    let token: string | undefined;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new ApiError(401, 'Authentication token missing. Please sign in.'));
    }

    const decoded: JwtPayload = verifyToken(token);

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return next(new ApiError(401, 'User account no longer exists. Please sign in again.'));
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new ApiError(403, 'Forbidden: Insufficient permissions'));
    }
    next();
  };
};
