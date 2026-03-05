import axios from 'axios';
import { MovieInsightResponse, ApiError } from '../types';

const API_URL = '/api';

export async function fetchMovieInsight(imdbId: string): Promise<MovieInsightResponse> {
  try {
    console.log('Fetching movie insight for:', imdbId);
    console.log('API URL:', `${API_URL}/movie-insight`);
    
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
    
    console.log('Response received:', response.status);
    return response.data;
  } catch (error: any) {
    console.error('API Error:', error);
    console.error('Error response:', error.response?.data);
    console.error('Error status:', error.response?.status);
    
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
