'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { MovieCardProps } from '../types';
import CastGrid from './CastGrid';
import gsap from 'gsap';

export default function MovieCard({ movie }: MovieCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const posterRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const ratingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(cardRef.current, {
        opacity: 0,
        y: 30,
        duration: 0.5,
        ease: 'power3.out'
      });

      gsap.from(posterRef.current, {
        opacity: 0,
        scale: 0.9,
        rotationY: -10,
        duration: 0.6,
        ease: 'back.out(1.7)'
      });

      gsap.from(titleRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.5,
        ease: 'power3.out'
      });

      gsap.from(ratingRef.current, {
        opacity: 0,
        scale: 0,
        duration: 0.5,
        ease: 'elastic.out(1, 0.5)'
      });

      gsap.from(contentRef.current?.children || [], {
        opacity: 0,
        y: 15,
        duration: 0.4,
        stagger: 0.08,
        ease: 'power2.out'
      });
    }, cardRef);

    return () => ctx.revert();
  }, [movie]);

  return (
    <div ref={cardRef} className="bg-dark-card rounded-lg p-6 border border-dark-border shadow-lg">
      <div className="flex flex-col md:flex-row gap-6">
        <div ref={posterRef} className="w-full md:w-64 flex-shrink-0">
          <div className="relative w-full aspect-[2/3] rounded-lg overflow-hidden bg-dark-bg shadow-xl hover:shadow-2xl transition-shadow duration-300">
            {movie.poster && movie.poster !== 'N/A' ? (
              <Image
                src={movie.poster}
                alt={`${movie.title} poster`}
                fill
                className="object-cover hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, 256px"
                priority
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-dark-bg border border-dark-border">
                <div className="text-center p-4">
                  <svg className="w-16 h-16 mx-auto text-dark-muted mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-dark-muted text-sm">No poster available</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 space-y-4">
          <div>
            <h1 ref={titleRef} className="text-3xl font-bold text-dark-text mb-2 hover:text-blue-400 transition-colors duration-300">
              {movie.title}
            </h1>
            <div className="flex flex-wrap gap-3 text-dark-muted">
              <span className="font-semibold">{movie.year}</span>
              <span>•</span>
              <span>Released: {movie.released}</span>
              <span>•</span>
              <span>{movie.runtime}</span>
              <span>•</span>
              <span>{movie.genre}</span>
            </div>
          </div>

          <div ref={ratingRef} className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-yellow-400/10 px-4 py-2 rounded-lg border border-yellow-400/30 hover:border-yellow-400/60 transition-colors duration-300">
              <span className="text-3xl font-bold text-yellow-400">⭐ {movie.rating}</span>
              <span className="text-dark-muted text-lg">/ 10</span>
            </div>
            <div className="h-8 w-px bg-dark-border"></div>
            <div className="text-sm text-dark-muted">
              <div>IMDb Rating</div>
            </div>
          </div>

          <div ref={contentRef}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="hover:text-blue-400 transition-colors duration-200">
                <span className="text-dark-muted">Director:</span>
                <span className="text-dark-text ml-2 font-medium">{movie.director}</span>
              </div>
              <div className="hover:text-blue-400 transition-colors duration-200">
                <span className="text-dark-muted">Country:</span>
                <span className="text-dark-text ml-2">{movie.country}</span>
              </div>
              <div className="hover:text-blue-400 transition-colors duration-200">
                <span className="text-dark-muted">Language:</span>
                <span className="text-dark-text ml-2">{movie.language}</span>
              </div>
              {movie.awards !== 'N/A' && (
                <div className="hover:text-yellow-400 transition-colors duration-200">
                  <span className="text-dark-muted">Awards:</span>
                  <span className="text-dark-text ml-2">{movie.awards}</span>
                </div>
              )}
            </div>

            <div className="mt-4">
              <h3 className="text-lg font-semibold text-dark-text mb-2">Plot</h3>
              <p className="text-dark-muted leading-relaxed">{movie.plot}</p>
            </div>

            <div className="mt-4">
              <h3 className="text-lg font-semibold text-dark-text mb-3">Cast</h3>
              <CastGrid cast={movie.cast} />
            </div>

            {movie.writer !== 'N/A' && (
              <div className="text-sm mt-4 hover:text-blue-400 transition-colors duration-200">
                <span className="text-dark-muted">Writer:</span>
                <span className="text-dark-text ml-2">{movie.writer}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
