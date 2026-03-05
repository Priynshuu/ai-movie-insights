'use client';

import { useEffect, useRef } from 'react';
import { AIInsightsProps } from '../types';
import gsap from 'gsap';

export default function AIInsights({ insights, error }: AIInsightsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const positiveRef = useRef<HTMLDivElement>(null);
  const neutralRef = useRef<HTMLDivElement>(null);
  const negativeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !insights) return;

    const ctx = gsap.context(() => {
      // Container entrance - no delay
      gsap.from(containerRef.current, {
        opacity: 0,
        y: 30,
        duration: 0.5,
        ease: 'power3.out'
      });

      // Header with badge animation - no delay
      gsap.from(headerRef.current, {
        opacity: 0,
        scale: 0.95,
        duration: 0.4,
        ease: 'back.out(1.7)'
      });

      // Summary fade and slide - no delay
      gsap.from(summaryRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.5,
        ease: 'power2.out'
      });

      // DISABLED ANIMATIONS FOR THEME ITEMS - they were causing visibility issues
    }, containerRef);

    return () => ctx.revert();
  }, [insights]);

  if (error) {
    return (
      <div className="bg-dark-card rounded-lg p-6 border border-dark-border">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  if (!insights) {
    return (
      <div className="bg-dark-card rounded-lg p-6 border border-dark-border">
        <p className="text-dark-muted">AI insights could not be generated at this time.</p>
      </div>
    );
  }

  const sentimentColors = {
    Positive: 'bg-green-500/20 text-green-400 border-green-500',
    Mixed: 'bg-yellow-500/20 text-yellow-400 border-yellow-500',
    Negative: 'bg-red-500/20 text-red-400 border-red-500'
  };

  return (
    <div
      ref={containerRef}
      className="bg-dark-card rounded-lg p-6 border border-dark-border shadow-lg space-y-6"
    >
      <div ref={headerRef} className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-dark-text">AI Sentiment Analysis</h2>
        <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${sentimentColors[insights.overallSentiment]} hover:scale-110 transition-transform duration-300`}>
          {insights.overallSentiment}
        </span>
      </div>

      <div ref={summaryRef}>
        <h3 className="text-lg font-semibold text-dark-text mb-2">Summary</h3>
        <p className="text-dark-muted leading-relaxed text-justify">{insights.summary}</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Positive Themes */}
        <div>
          <h3 className="text-lg font-semibold text-green-400 mb-3 flex items-center gap-2">
            <span className="text-xl">✓</span> Positive Themes
          </h3>
          <div ref={positiveRef} className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {insights.positiveThemes.length > 0 ? (
              insights.positiveThemes.map((theme, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 p-3 bg-green-500/10 rounded-lg border border-green-500/30 hover:bg-green-500/20 hover:border-green-500/50 hover:scale-105 transition-all duration-300 cursor-pointer"
                  style={{ minHeight: '50px' }}
                >
                  <span className="text-green-400 mt-0.5 flex-shrink-0">•</span>
                  <span className="text-dark-text text-sm" style={{ color: '#e2e8f0', fontSize: '14px' }}>{theme}</span>
                </div>
              ))
            ) : (
              <p className="text-dark-muted" style={{ color: '#94a3b8' }}>No specific positive themes identified</p>
            )}
          </div>
        </div>

        {/* Neutral Themes */}
        {insights.neutralThemes && insights.neutralThemes.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-blue-400 mb-3 flex items-center gap-2">
              <span className="text-xl">◐</span> Neutral Observations
            </h3>
            <div ref={neutralRef} className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {insights.neutralThemes.map((theme, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 p-3 bg-blue-500/10 rounded-lg border border-blue-500/30 hover:bg-blue-500/20 hover:border-blue-500/50 hover:scale-105 transition-all duration-300 cursor-pointer"
                  style={{ minHeight: '50px' }}
                >
                  <span className="text-blue-400 mt-0.5 flex-shrink-0">•</span>
                  <span className="text-dark-text text-sm" style={{ color: '#e2e8f0', fontSize: '14px' }}>{theme}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Negative Themes */}
        <div>
          <h3 className="text-lg font-semibold text-red-400 mb-3 flex items-center gap-2">
            <span className="text-xl">✗</span> Negative Themes
          </h3>
          <div ref={negativeRef} className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {insights.negativeThemes.length > 0 ? (
              insights.negativeThemes.map((theme, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 p-3 bg-red-500/10 rounded-lg border border-red-500/30 hover:bg-red-500/20 hover:border-red-500/50 hover:scale-105 transition-all duration-300 cursor-pointer"
                  style={{ minHeight: '50px' }}
                >
                  <span className="text-red-400 mt-0.5 flex-shrink-0">•</span>
                  <span className="text-dark-text text-sm" style={{ color: '#e2e8f0', fontSize: '14px' }}>{theme}</span>
                </div>
              ))
            ) : (
              <p className="text-dark-muted" style={{ color: '#94a3b8' }}>No specific negative themes identified</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
