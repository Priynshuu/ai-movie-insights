import axios from 'axios';
import { MovieInsightResponse, ApiError } from '../types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export async function fetchMovieInsight(imdbId: string): Promise<MovieInsightResponse> {
  try {
    const response = await axios.post<MovieInsightResponse>(
      `${API_URL}/movie-insight`,
      { imdbId },
      {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 15000
      }
    );
    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      const apiError: ApiError = error.response.data;
      throw new Error(apiError.error || 'Failed to fetch movie insights');
    }
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout. Please try again.');
    }
    throw new Error('Network error. Please check your connection.');
  }
}
