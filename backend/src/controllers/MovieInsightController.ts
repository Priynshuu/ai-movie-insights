import { Request, Response, NextFunction } from 'express';
import { MovieService } from '../services/MovieService';
import { ReviewService } from '../services/ReviewService';
import { AIService } from '../services/AIService';
import { CacheService } from '../services/CacheService';
import { logger } from '../utils/logger';
import { TimeoutError } from '../utils/errors';

export class MovieInsightController {
  private movieService: MovieService;
  private reviewService: ReviewService;
  private aiService: AIService;
  private cacheService: CacheService;

  constructor() {
    this.movieService = new MovieService();
    this.reviewService = new ReviewService();
    this.aiService = new AIService();
    this.cacheService = new CacheService();
  }

  async getMovieInsight(req: Request, res: Response, next: NextFunction): Promise<void> {
    const startTime = Date.now();
    const { imdbId } = req.body;

    try {
      logger.info('Processing movie insight request', { imdbId });

      // Check cache
      const cached = await this.cacheService.get(imdbId);
      if (cached) {
        logger.info('Returning cached result', { imdbId });
        res.json(cached);
        return;
      }

      // Set timeout
      const timeout = setTimeout(() => {
        throw new TimeoutError('Request processing timeout');
      }, 30000);

      try {
        // Fetch movie metadata
        const movie = await this.movieService.getMovieMetadata(imdbId);

        // Fetch reviews
        const reviews = await this.reviewService.getReviews(imdbId);

        // Generate AI insights
        let aiInsights = null;
        try {
          aiInsights = await this.aiService.analyzeSentiment(reviews);
        } catch (error: any) {
          logger.warn('AI analysis failed, returning without insights', { 
            imdbId, 
            error: error.message 
          });
        }

        clearTimeout(timeout);

        const response = {
          movie,
          aiInsights
        };

        // Log the response for debugging
        logger.info('Sending response', { 
          imdbId,
          hasAiInsights: !!aiInsights,
          positiveThemesCount: aiInsights?.positiveThemes?.length || 0,
          neutralThemesCount: aiInsights?.neutralThemes?.length || 0,
          negativeThemesCount: aiInsights?.negativeThemes?.length || 0
        });

        // Cache the result
        await this.cacheService.set(imdbId, response);

        const duration = Date.now() - startTime;
        logger.info('Movie insight request completed', { imdbId, duration: `${duration}ms` });

        res.json(response);
      } catch (error) {
        clearTimeout(timeout);
        throw error;
      }
    } catch (error) {
      next(error);
    }
  }
}
