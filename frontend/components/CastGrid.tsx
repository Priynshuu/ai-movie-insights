'use client';

import { CastGridProps } from '../types';

export default function CastGrid({ cast }: CastGridProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {cast.map((actor, index) => (
        <span
          key={index}
          className="px-3 py-1.5 bg-dark-bg rounded-full text-sm text-dark-text border border-dark-border hover:border-blue-400 hover:text-blue-400 transition-all duration-300 cursor-pointer"
        >
          {actor}
        </span>
      ))}
    </div>
  );
}
