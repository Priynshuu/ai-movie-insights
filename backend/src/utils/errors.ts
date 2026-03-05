export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public code?: string,
    public details?: any
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: any) {
    super(400, message, 'VALIDATION_ERROR', details);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(404, message, 'NOT_FOUND');
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = 'Rate limit exceeded. Please try again later') {
    super(429, message, 'RATE_LIMIT_EXCEEDED');
  }
}

export class ExternalAPIError extends AppError {
  constructor(message: string, statusCode: number = 502, details?: any) {
    super(statusCode, message, 'EXTERNAL_API_ERROR', details);
  }
}

export class TimeoutError extends AppError {
  constructor(message: string = 'Request timeout') {
    super(504, message, 'TIMEOUT');
  }
}
