import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('3001'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  OMDB_API_KEY: z.string().min(1, 'OMDB_API_KEY is required'),
  OPENAI_API_KEY: z.string().min(1, 'OPENAI_API_KEY is required'),
  ALLOWED_ORIGINS: z.string().default('http://localhost:3000'),
  CACHE_ENABLED: z.string().default('false'),
  CACHE_TTL: z.string().default('3600'),
  CACHE_TYPE: z.enum(['memory', 'redis']).default('memory'),
  REDIS_HOST: z.string().default('localhost'),
  REDIS_PORT: z.string().default('6379'),
  REDIS_PASSWORD: z.string().optional(),
  REDIS_DB: z.string().default('0'),
  LOG_LEVEL: z.string().default('info')
});

function validateEnv() {
  try {
    const env = envSchema.parse(process.env);
    const origins = env.ALLOWED_ORIGINS || 'http://localhost:3000';
    return {
      port: parseInt(env.PORT, 10),
      nodeEnv: env.NODE_ENV,
      omdbApiKey: env.OMDB_API_KEY,
      openaiApiKey: env.OPENAI_API_KEY,
      allowedOrigins: origins.split(',').map((o: string) => o.trim()),
      cacheEnabled: env.CACHE_ENABLED === 'true',
      cacheTTL: parseInt(env.CACHE_TTL, 10),
      cacheType: env.CACHE_TYPE,
      redis: {
        host: env.REDIS_HOST,
        port: parseInt(env.REDIS_PORT, 10),
        password: env.REDIS_PASSWORD,
        db: parseInt(env.REDIS_DB, 10)
      },
      logLevel: env.LOG_LEVEL
    };
  } catch (error) {
    console.error('Environment validation failed:', error);
    process.exit(1);
  }
}

export const config = validateEnv();
