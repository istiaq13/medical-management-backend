import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../helpers/api-error';
import { ENV } from '../lib/env';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errors = err.errors || undefined;

  // Handle Mongoose CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid resource identifier format: ${err.value}`;
  }

  // Handle Mongoose duplicate key error (11000)
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    const value = err.keyValue ? err.keyValue[field] : '';
    message = `A record with this ${field} "${value}" already exists.`;
  }

  // Handle JSON Syntax Error (e.g. malformed body payload)
  if (err instanceof SyntaxError && 'status' in err && (err as any).status === 400 && 'body' in err) {
    statusCode = 400;
    message = 'Malformed JSON payload in request body';
  }

  // Handle Multer/Upload Errors (e.g. File too large)
  if (err.code === 'LIMIT_FILE_SIZE') {
    statusCode = 413;
    message = 'Uploaded file exceeds the maximum allowed size limit';
  }

  // Handle Mongoose ValidationError
  if (err.name === 'ValidationError') {
    statusCode = 400;
    errors = Object.values(err.errors).map((e: any) => e.message);
    message = 'Validation failed';
  }

  // Handle JWT authentication errors
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Your session has expired. Please sign in again.';
  }

  // Preserve explicit authentication messages (like "Invalid email or password")
  // Only fallback to "Unauthenticated" if no specific message was set
  if (statusCode === 401 && (!message || message === 'Internal Server Error')) {
    message = 'Authentication required. Please sign in.';
  }

  return res.status(statusCode).json({
    success: false,
    message,
    ...(errors ? { errors } : {}),
    ...(ENV.NODE_ENV === 'development' && statusCode !== 401 ? { stack: err.stack } : {}),
  });
};
