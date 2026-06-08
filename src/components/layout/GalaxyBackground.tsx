"use client"

import React, { useEffect, useState } from 'react';

export const GalaxyBackground = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="fixed inset-0 z-[-1] bg-[#09061B]" />;

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-[#09061B] pointer-events-none select-none">
      {/* Subtle Star Particles */}
      <div className="absolute inset-0 opacity-40">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="pixelate">
              <feFlood x="0" y="0" width="1" height="1" />
              <feComposite width="2" height="2" />
              <feTile />
              <feComposite in="SourceGraphic" operator="in" />
            </filter>
          </defs>
          <rect width="100%" height="100%" fill="none" />
          {/* Generating a few static "pixel" stars */}
          {[...Array(50)].map((_, i) => (
            <rect
              key={i}
              x={`${Math.random() * 100}%`}
              y={`${Math.random() * 100}%`}
              width="2"
              height="2"
              fill="white"
              className="animate-pulse"
              style={{ animationDelay: `${Math.random() * 5}s`, opacity: Math.random() * 0.5 + 0.2 }}
            />
          ))}
        </svg>
      </div>

      {/* Galaxy Core / Spiral Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vw] h-[150vw] md:w-[100vw] md:h-[100vw] opacity-30 mix-blend-screen pointer-events-none">
        <div className="w-full h-full relative animate-spin-slow">
          {/* Simulated Spiral Arms with Pixel Dots */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-none shadow-[0_0_20px_10px_rgba(168,85,247,0.6)]" />
            {[...Array(200)].map((_, i) => {
              const angle = i * 0.15;
              const radius = i * 4;
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;
              return (
                <div
                  key={i}
                  className="absolute w-[2px] h-[2px] bg-white"
                  style={{
                    transform: `translate(${x}px, ${y}px)`,
                    backgroundColor: i % 2 === 0 ? '#A855F7' : '#EC4899',
                    opacity: Math.max(0.1, 1 - i / 200),
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Decorative Glows */}
      <div className="absolute top-[-20%] right-[-10%] w-[80%] h-[80%] rounded-full bg-neon-purple/5 blur-[120px] animate-pulse will-change-transform" />
      <div className="absolute bottom-[-10%] left-[-20%] w-[70%] h-[70%] rounded-full bg-neon-pink/5 blur-[120px] animate-pulse will-change-transform" style={{ animationDelay: '2s' }} />
    </div>
  );
};
