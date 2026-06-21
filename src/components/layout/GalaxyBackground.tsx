"use client"

import React, { useEffect, useState, useMemo, memo } from 'react';

const GalaxyBackgroundComponent = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Memoize static star field to prevent "jumping" positions on re-render
  const stars = useMemo(() => {
    return [...Array(50)].map((_, i) => ({
      id: i,
      x: `${Math.random() * 100}%`,
      y: `${Math.random() * 100}%`,
      delay: `${Math.random() * 5}s`,
      opacity: Math.random() * 0.5 + 0.2
    }));
  }, []);

  // Memoize spiral arm dots for stability
  const spiralDots = useMemo(() => {
    return [...Array(200)].map((_, i) => {
      const angle = i * 0.15;
      const radius = i * 4;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      const color = i % 2 === 0 ? '#A855F7' : '#EC4899';
      const opacity = Math.max(0.1, 1 - i / 200);
      
      return { id: i, x, y, color, opacity };
    });
  }, []);

  if (!mounted) return <div className="fixed inset-0 z-[-1] bg-[#09061B]" />;

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-[#09061B] pointer-events-none select-none">
      {/* Subtle Star Particles */}
      <div className="absolute inset-0 opacity-40">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <rect width="100%" height="100%" fill="none" />
          {stars.map((star) => (
            <rect
              key={star.id}
              x={star.x}
              y={star.y}
              width="2"
              height="2"
              fill="white"
              className="animate-pulse"
              style={{ animationDelay: star.delay, opacity: star.opacity }}
            />
          ))}
        </svg>
      </div>

      {/* Galaxy Core / Spiral Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vw] h-[150vw] md:w-[100vw] md:h-[100vw] opacity-30 mix-blend-screen pointer-events-none">
        <div className="w-full h-full relative animate-spin-slow">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-none shadow-[0_0_20px_10px_rgba(168,85,247,0.6)]" />
            {spiralDots.map((dot) => (
              <div
                key={dot.id}
                className="absolute w-[2px] h-[2px]"
                style={{
                  transform: `translate(${dot.x}px, ${dot.y}px)`,
                  backgroundColor: dot.color,
                  opacity: dot.opacity,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Decorative Glows */}
      <div className="absolute top-[-20%] right-[-10%] w-[80%] h-[80%] rounded-full bg-neon-purple/5 blur-[120px] animate-pulse will-change-transform" />
      <div className="absolute bottom-[-10%] left-[-20%] w-[70%] h-[70%] rounded-full bg-neon-pink/5 blur-[120px] animate-pulse will-change-transform" style={{ animationDelay: '2s' }} />
    </div>
  );
};

export const GalaxyBackground = memo(GalaxyBackgroundComponent);
