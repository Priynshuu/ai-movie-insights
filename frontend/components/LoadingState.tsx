'use client';

import { LoadingStateProps } from '../types';

export default function LoadingState({ type }: LoadingStateProps) {
  if (type === 'full') {
    return (
      <div className="w-full max-w-6xl mx-auto space-y-6 animate-pulse">
        <MovieSkeleton />
        <InsightsSkeleton />
      </div>
    );
  }

  if (type === 'movie') {
    return <MovieSkeleton />;
  }

  return <InsightsSkeleton />;
}

function MovieSkeleton() {
  return (
    <div className="bg-dark-card rounded-lg p-6 border border-dark-border">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-64 h-96 bg-dark-bg rounded-lg" />
        <div className="flex-1 space-y-4">
          <div className="h-8 bg-dark-bg rounded w-3/4" />
          <div className="h-4 bg-dark-bg rounded w-1/2" />
          <div className="h-4 bg-dark-bg rounded w-1/3" />
          <div className="space-y-2 mt-4">
            <div className="h-4 bg-dark-bg rounded" />
            <div className="h-4 bg-dark-bg rounded" />
            <div className="h-4 bg-dark-bg rounded w-5/6" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-8 bg-dark-bg rounded" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function InsightsSkeleton() {
  return (
    <div className="bg-dark-card rounded-lg p-6 border border-dark-border space-y-4">
      <div className="h-6 bg-dark-bg rounded w-1/4" />
      <div className="space-y-2">
        <div className="h-4 bg-dark-bg rounded" />
        <div className="h-4 bg-dark-bg rounded" />
        <div className="h-4 bg-dark-bg rounded w-4/5" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-8 bg-dark-bg rounded" />
          ))}
        </div>
        <div className="space-y-2">
          {[1, 2].map((i) => (
            <div key={i} className="h-8 bg-dark-bg rounded" />
          ))}
        </div>
      </div>
    </div>
  );
}
