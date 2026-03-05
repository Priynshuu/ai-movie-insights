'use client';

import { useEffect, useRef } from 'react';
import { useMovieInsight } from '../hooks/useMovieInsight';
import SearchInput from '../components/SearchInput';
import MovieCard from '../components/MovieCard';
import AIInsights from '../components/AIInsightsGSAP';
import LoadingState from '../components/LoadingState';
import ParticlesBackground from '../components/ParticlesBackground';
import gsap from 'gsap';

export default function Home() {
  const { data, loading, error, fetchInsight, clearError } = useMovieInsight();
  const headerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header animation
      gsap.from(headerRef.current, {
        opacity: 0,
        y: -50,
        duration: 1,
        ease: 'power3.out'
      });

      // Search input animation
      gsap.from(searchRef.current, {
        opacity: 0,
        scale: 0.9,
        duration: 0.8,
        ease: 'back.out(1.7)',
        delay: 0.3
      });

      // Footer animation
      gsap.from(footerRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: 'power2.out',
        delay: 0.6
      });
    });

    return () => ctx.revert();
  }, []);

  const handleSubmit = (imdbId: string) => {
    clearError();
    fetchInsight(imdbId);
  };

  return (
    <main className="min-h-screen p-4 md:p-8">
      {/* Animated Particles Background */}
      <ParticlesBackground />
      
      <div className="max-w-6xl mx-auto space-y-8" style={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div ref={headerRef} className="text-center space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold text-dark-text bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            AI Movie Insights
          </h1>
          <p className="text-dark-muted text-lg">
            Get comprehensive movie information and AI-powered sentiment analysis
          </p>
        </div>

        {/* Search Input */}
        <div ref={searchRef}>
          <SearchInput onSubmit={handleSubmit} isLoading={loading} error={error} />
        </div>

        {/* Loading State */}
        {loading && <LoadingState type="full" />}

        {/* Results */}
        {!loading && data && (
          <div className="space-y-6">
            <MovieCard movie={data.movie} isLoading={false} />
            <AIInsights insights={data.aiInsights} error={null} />
          </div>
        )}

        {/* Footer */}
        <footer ref={footerRef} className="text-center text-dark-muted text-sm pt-8">
          <p>©Copyright2026 reserved Powered by OMDb API and OpenAI • Enhanced with GSAP Animations • Made by Priyanshu Singh❤️</p>
        </footer>
      </div>
    </main>
  );
}
