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

export interface Review {
  text: string;
  rating: number;
  username: string;
}

export interface SentimentAnalysis {
  summary: string;
  positiveThemes: string[];
  neutralThemes: string[];
  negativeThemes: string[];
  overallSentiment: 'Positive' | 'Mixed' | 'Negative';
}

export interface MovieInsightResponse {
  movie: Movie;
  aiInsights: SentimentAnalysis | null;
}

export interface OMDbResponse {
  Title: string;
  Year: string;
  Released: string;
  Poster: string;
  imdbRating: string;
  Actors: string;
  Director: string;
  Writer: string;
  Genre: string;
  Runtime: string;
  Plot: string;
  Awards: string;
  Country: string;
  Language: string;
  Response: string;
  Error?: string;
}

export interface CacheEntry {
  data: MovieInsightResponse;
  timestamp: number;
  expiresAt: number;
}
