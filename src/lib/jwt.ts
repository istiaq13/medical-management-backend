import jwt from 'jsonwebtoken';
import { ENV } from './env';
import { AUTH_CONFIG } from './constants';

export interface JwtPayload {
  id: string;
  email: string;
  role: string;
}

export const signToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, ENV.JWT_SECRET, {
    expiresIn: AUTH_CONFIG.TOKEN_EXPIRY,
  });
};

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, ENV.JWT_SECRET) as JwtPayload;
};
