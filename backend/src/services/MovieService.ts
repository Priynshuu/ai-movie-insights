import axios from 'axios';
import { config } from '../config';
import { logger } from '../utils/logger';
import { NotFoundError, ExternalAPIError, RateLimitError } from '../utils/errors';
import { Movie, OMDbResponse } from '../types';

export class MovieService {
  private readonly baseURL = 'http://www.omdbapi.com/';

  async getMovieMetadata(imdbId: string): Promise<Movie> {
    try {
      logger.info('Fetching movie metadata', { imdbId });

      const response = await axios.get<OMDbResponse>(this.baseURL, {
        params: {
          apikey: config.omdbApiKey,
          i: imdbId,
          plot: 'full'
        },
        timeout: 5000
      });

      const data = response.data;

      if (data.Response === 'False') {
        if (data.Error?.includes('not found')) {
          throw new NotFoundError('Movie not found for the provided IMDb ID');
        }
        throw new ExternalAPIError(data.Error || 'Failed to fetch movie data');
      }

      // Validate required fields
      const requiredFields = ['Title', 'Year', 'Released', 'Poster', 'imdbRating', 'Actors', 'Director', 'Genre', 'Runtime', 'Plot'];
      const missingFields = requiredFields.filter(field => !data[field as keyof OMDbResponse]);
      
      if (missingFields.length > 0) {
        throw new ExternalAPIError('Incomplete movie data received', 502, { missingFields });
      }

      const movie: Movie = {
        title: data.Title,
        year: data.Year,
        released: data.Released,
        poster: data.Poster,
        rating: data.imdbRating,
        cast: data.Actors.split(',').map(actor => actor.trim()),
        director: data.Director,
        writer: data.Writer || 'N/A',
        genre: data.Genre,
        runtime: data.Runtime,
        plot: data.Plot,
        awards: data.Awards || 'N/A',
        country: data.Country || 'N/A',
        language: data.Language || 'N/A'
      };

      logger.info('Movie metadata fetched successfully', { imdbId, title: movie.title });
      return movie;

    } catch (error: any) {
      if (error instanceof NotFoundError || error instanceof ExternalAPIError) {
        throw error;
      }

      if (error.response?.status === 429) {
        logger.error('OMDb rate limit exceeded', { imdbId });
        throw new RateLimitError('OMDb API rate limit exceeded');
      }

      if (error.code === 'ECONNABORTED') {
        logger.error('OMDb API timeout', { imdbId });
        throw new ExternalAPIError('OMDb API request timeout', 504);
      }

      logger.error('OMDb API call failed', { imdbId, error: error.message });
      throw new ExternalAPIError('Failed to fetch movie metadata');
    }
  }
}
