import { Request, Response, NextFunction } from 'express';
import { MovieInsightRequestSchema } from '../utils/validation';
import { ValidationError } from '../utils/errors';
import { logger } from '../utils/logger';

export function validateMovieInsightRequest(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  try {
    // Validate content-type
    const contentType = req.headers['content-type'];
    if (!contentType || !contentType.includes('application/json')) {
      throw new ValidationError('Content-Type must be application/json');
    }

    // Validate request body
    const result = MovieInsightRequestSchema.safeParse(req.body);
    
    if (!result.success) {
      const errors = result.error.errors.map(e => ({
        field: e.path.join('.'),
        message: e.message
      }));
      
      logger.warn('Request validation failed', { errors, body: req.body });
      throw new ValidationError('Invalid request body', errors);
    }

    // Attach validated data to request
    req.body = result.data;
    next();
  } catch (error) {
    next(error);
  }
}
