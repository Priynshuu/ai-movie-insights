export interface Movie {
  title: string;
  year: string;
  released: string;
  poster: string;
  rating: string;
  cast: string[];
  director: string;
  writer: string;
  genre: string;
  runtime: string;
  plot: string;
  awards: string;
  country: string;
  language: string;
}

export interface AIInsights {
  summary: string;
  positiveThemes: string[];
  neutralThemes: string[];
  negativeThemes: string[];
  overallSentiment: 'Positive' | 'Mixed' | 'Negative';
}

export interface MovieInsightResponse {
  movie: Movie;
  aiInsights: AIInsights | null;
}

export interface ApiError {
  error: string;
  code?: string;
  details?: any;
}

export interface SearchInputProps {
  onSubmit: (imdbId: string) => void;
  isLoading: boolean;
  error: string | null;
}

export interface MovieCardProps {
  movie: Movie;
  isLoading: boolean;
}

export interface CastGridProps {
  cast: string[];
}

export interface AIInsightsProps {
  insights: AIInsights | null;
  error: string | null;
}

export interface LoadingStateProps {
  type: 'movie' | 'insights' | 'full';
}
