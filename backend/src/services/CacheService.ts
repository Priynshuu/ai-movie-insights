import { createClient, RedisClientType } from 'redis';
import { logger } from '../utils/logger';
import { CacheEntry, MovieInsightResponse } from '../types';
import { config } from '../config';

export class CacheService {
  private memoryCache: Map<string, CacheEntry> = new Map();
  private redisClient: RedisClientType | null = null;
  private readonly ttl: number;
  private readonly useRedis: boolean;

  constructor() {
    this.ttl = config.cacheTTL;
    this.useRedis = config.cacheType === 'redis';
    
    if (this.useRedis) {
      // Initialize Redis asynchronously without blocking
      this.initRedis().catch((err) => {
        logger.error('Redis initialization failed', { error: err.message });
      });
    }
  }

  private async initRedis(): Promise<void> {
    try {
      this.redisClient = createClient({
        socket: {
          host: config.redis.host,
          port: config.redis.port,
          connectTimeout: 5000, // 5 second timeout
          reconnectStrategy: false // Don't auto-reconnect
        },
        password: config.redis.password || undefined,
        database: config.redis.db
      });

      this.redisClient.on('error', (err) => {
        logger.warn('Redis error, using memory cache', { error: err.message });
        this.redisClient = null;
      });

      this.redisClient.on('connect', () => {
        logger.info('Redis connected successfully', {
          host: config.redis.host,
          port: config.redis.port
        });
      });

      await this.redisClient.connect();
    } catch (error: any) {
      logger.warn('Redis unavailable, using memory cache', { error: error.message });
      this.redisClient = null;
    }
  }

  async get(key: string): Promise<MovieInsightResponse | null> {
    if (!config.cacheEnabled) {
      return null;
    }

    try {
      // Try Redis first if available and connected
      if (this.redisClient?.isOpen) {
        try {
          const data = await this.redisClient.get(key);
          if (data) {
            logger.debug('Redis cache hit', { key });
            return JSON.parse(data);
          }
        } catch (redisError: any) {
          logger.debug('Redis get failed, trying memory cache', { error: redisError.message });
        }
      }

      // Use memory cache
      const entry = this.memoryCache.get(key);
      
      if (!entry) {
        logger.debug('Cache miss', { key });
        return null;
      }

      if (Date.now() > entry.expiresAt) {
        logger.debug('Cache expired', { key });
        this.memoryCache.delete(key);
        return null;
      }

      logger.debug('Memory cache hit', { key });
      return entry.data;
    } catch (error: any) {
      logger.error('Cache get error', { key, error: error.message });
      return null;
    }
  }

  async set(key: string, data: MovieInsightResponse): Promise<void> {
    if (!config.cacheEnabled) {
      return;
    }

    try {
      // Always set in memory cache first (fast)
      const entry: CacheEntry = {
        data,
        timestamp: Date.now(),
        expiresAt: Date.now() + (this.ttl * 1000)
      };
      this.memoryCache.set(key, entry);
      logger.debug('Memory cache set', { key });

      // Try Redis if available (don't wait for it)
      if (this.redisClient?.isOpen) {
        this.redisClient.setEx(key, this.ttl, JSON.stringify(data))
          .then(() => logger.debug('Redis cache set', { key }))
          .catch((err) => logger.debug('Redis set failed', { error: err.message }));
      }
    } catch (error: any) {
      logger.error('Cache set error', { key, error: error.message });
    }
  }

  async clear(): Promise<void> {
    try {
      if (this.redisClient && this.redisClient.isOpen) {
        await this.redisClient.flushDb();
        logger.info('Redis cache cleared');
      }
      
      this.memoryCache.clear();
      logger.info('Memory cache cleared');
    } catch (error: any) {
      logger.error('Cache clear error', { error: error.message });
    }
  }

  async getStats(): Promise<{ type: string; size: number; keys?: string[] }> {
    try {
      if (this.redisClient && this.redisClient.isOpen) {
        const keys = await this.redisClient.keys('*');
        return {
          type: 'redis',
          size: keys.length,
          keys: keys.slice(0, 10) // Return first 10 keys
        };
      }

      return {
        type: 'memory',
        size: this.memoryCache.size,
        keys: Array.from(this.memoryCache.keys()).slice(0, 10)
      };
    } catch (error: any) {
      logger.error('Cache stats error', { error: error.message });
      return { type: 'error', size: 0 };
    }
  }

  async disconnect(): Promise<void> {
    if (this.redisClient && this.redisClient.isOpen) {
      await this.redisClient.quit();
      logger.info('Redis disconnected');
    }
  }
}
