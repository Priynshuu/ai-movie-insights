import winston from 'winston';
import { config } from '../config';

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
    let log = `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    if (Object.keys(meta).length > 0) {
      log += ` ${JSON.stringify(meta)}`;
    }
    if (stack && config.nodeEnv === 'development') {
      log += `\n${stack}`;
    }
    return log;
  })
);

export const logger = winston.createLogger({
  level: config.logLevel,
  format: logFormat,
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        logFormat
      )
    })
  ]
});

// Sanitize sensitive data from logs
export function sanitizeLogData(data: any): any {
  const sensitive = ['apiKey', 'api_key', 'password', 'token', 'secret'];
  if (typeof data !== 'object' || data === null) return data;
  
  const sanitized = { ...data };
  for (const key in sanitized) {
    if (sensitive.some(s => key.toLowerCase().includes(s))) {
      sanitized[key] = '***REDACTED***';
    } else if (typeof sanitized[key] === 'object') {
      sanitized[key] = sanitizeLogData(sanitized[key]);
    }
  }
  return sanitized;
}
