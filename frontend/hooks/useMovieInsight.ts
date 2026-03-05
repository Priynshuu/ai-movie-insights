import { useState, useCallback } from 'react';
import { MovieInsightResponse } from '../types';
import { fetchMovieInsight } from '../utils/api';

export function useMovieInsight() {
  const [data, setData] = useState<MovieInsightResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInsight = useCallback(async (imdbId: string) => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const result = await fetchMovieInsight(imdbId);
      setData(result);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    data,
    loading,
    error,
    fetchInsight,
    clearError
  };
}
