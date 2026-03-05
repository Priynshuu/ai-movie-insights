'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function ParticlesBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const particleCount = 50;
    const particles: HTMLDivElement[] = [];

    // Create particles
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      
      // Random size between 2-6px
      const size = Math.random() * 4 + 2;
      
      // Random starting position
      const startX = Math.random() * window.innerWidth;
      const startY = Math.random() * window.innerHeight;
      
      // Random color - blue/purple/white tones
      const colors = [
        'rgba(99, 102, 241, 0.6)',   // Indigo
        'rgba(139, 92, 246, 0.6)',   // Purple
        'rgba(59, 130, 246, 0.6)',   // Blue
        'rgba(255, 255, 255, 0.4)',  // White
        'rgba(167, 139, 250, 0.6)',  // Light purple
      ];
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        border-radius: 50%;
        pointer-events: none;
        box-shadow: 0 0 ${size * 2}px ${color};
        left: ${startX}px;
        top: ${startY}px;
      `;
      
      container.appendChild(particle);
      particles.push(particle);
      
      // Animate each particle
      const duration = Math.random() * 20 + 15; // 15-35 seconds
      const endX = Math.random() * window.innerWidth;
      const endY = Math.random() * window.innerHeight;
      
      gsap.to(particle, {
        x: endX - startX,
        y: endY - startY,
        duration: duration,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: Math.random() * 5,
      });
      
      // Add floating animation
      gsap.to(particle, {
        scale: Math.random() * 0.5 + 0.8,
        opacity: Math.random() * 0.3 + 0.4,
        duration: Math.random() * 3 + 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }

    // Cleanup
    return () => {
      particles.forEach(particle => {
        gsap.killTweensOf(particle);
        particle.remove();
      });
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
}
