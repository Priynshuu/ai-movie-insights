import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import { logger, sanitizeLogData } from '../utils/logger';
import { config } from '../config';

export function errorHandler(
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // Log error
  const logData = sanitizeLogData({
    method: req.method,
    path: req.path,
    body: req.body,
    error: err.message,
    stack: err.stack
  });

  if (err instanceof AppError) {
    logger.error('Application error', { ...logData, statusCode: err.statusCode, code: err.code });
  } else {
    logger.error('Unhandled error', logData);
  }

  // Determine status code
  const statusCode = err instanceof AppError ? err.statusCode : 500;

  // Prepare error response
  const errorResponse: any = {
    error: err.message || 'An error occurred while processing your request'
  };

  if (err instanceof AppError && err.code) {
    errorResponse.code = err.code;
  }

  // Include details in development mode only
  if (config.nodeEnv === 'development') {
    if (err instanceof AppError && err.details) {
      errorResponse.details = err.details;
    }
    if (err.stack) {
      errorResponse.stack = err.stack;
    }
  }

  res.status(statusCode).json(errorResponse);
}

export function notFoundHandler(req: Request, res: Response): void {
  logger.warn('Route not found', { method: req.method, path: req.path });
  res.status(404).json({
    error: 'Endpoint not found',
    code: 'NOT_FOUND'
  });
}
