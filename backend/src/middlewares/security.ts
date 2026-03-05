import express, { Express } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { config } from '../config';
import { RateLimitError } from '../utils/errors';

export function setupSecurity(app: Express): void {
  // Helmet for security headers
  app.use(helmet());

  // CORS configuration
  app.use(cors({
    origin: config.allowedOrigins,
    credentials: true
  }));

  // Body parser with size limit
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));
}

export const rateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 requests per minute
  message: 'Too many requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    throw new RateLimitError();
  }
});
