'use client';

import { useState, useEffect } from 'react';
import { SearchInputProps } from '../types';

const IMDB_ID_REGEX = /^tt\d{7,9}$/;

export default function SearchInput({ onSubmit, isLoading, error }: SearchInputProps) {
  const [input, setInput] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    if (!input) {
      setValidationError(null);
      setIsValid(false);
      return;
    }

    const trimmed = input.trim();
    if (IMDB_ID_REGEX.test(trimmed)) {
      setValidationError(null);
      setIsValid(true);
    } else {
      setValidationError('Invalid IMDb ID format. Expected: tt followed by 7-9 digits (e.g., tt0111161)');
      setIsValid(false);
    }
  }, [input]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid && !isLoading) {
      onSubmit(input.trim());
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="imdbId" className="block text-sm font-medium text-dark-text mb-2">
            Enter IMDb Movie ID
          </label>
          <div className="flex gap-3">
            <input
              id="imdbId"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g., tt0111161"
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-dark-card border border-dark-border rounded-lg text-dark-text placeholder-dark-muted focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 min-h-[44px]"
            />
            <button
              type="submit"
              disabled={!isValid || isLoading || !input}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-h-[44px] min-w-[100px]"
            >
              {isLoading ? 'Loading...' : 'Search'}
            </button>
          </div>
          {validationError && (
            <p className="mt-2 text-sm text-red-400">{validationError}</p>
          )}
          {error && (
            <p className="mt-2 text-sm text-red-400">{error}</p>
          )}
        </div>
      </form>
      <div className="mt-4 text-sm text-dark-muted">
        <p>Try these examples:</p>
        <div className="flex flex-wrap gap-2 mt-2">
          {['tt0111161', 'tt0068646', 'tt0468569'].map((id) => (
            <button
              key={id}
              onClick={() => setInput(id)}
              className="px-3 py-1 bg-dark-card border border-dark-border rounded hover:border-blue-500 transition-colors"
            >
              {id}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
