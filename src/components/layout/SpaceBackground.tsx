"use client"

import React, { useEffect, useState } from 'react';

export const SpaceBackground = () => {
  const [stars, setStars] = useState<{ id: number; x: number; y: number; size: number; duration: number }[]>([]);

  useEffect(() => {
    const newStars = Array.from({ length: 100 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 3 + 2,
    }));
    setStars(newStars);
  }, []);

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-[#09061B] pointer-events-none">
      {/* Static Noise Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      
      {/* Pixel Stars */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute bg-white/40 animate-pulse"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDuration: `${star.duration}s`,
            boxShadow: star.size > 2 ? `0 0 4px #fff` : 'none',
          }}
        />
      ))}

      {/* Subtle Purple Nebula Glows */}
      <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-neon-purple/5 blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-neon-pink/5 blur-[120px]" />

      {/* Floating Pixel Planets (Simplified) */}
      <div className="absolute top-20 left-[15%] w-16 h-16 bg-[#140A2E] border-4 border-[#1B123D] rounded-full animate-float opacity-40">
        <div className="absolute top-2 left-2 w-4 h-4 bg-white/10 rounded-full" />
      </div>
      
      <div className="absolute bottom-40 right-[10%] w-24 h-24 bg-[#140A2E] border-4 border-[#1B123D] rounded-full animate-float opacity-30" style={{ animationDelay: '1s' }}>
        <div className="absolute top-4 left-4 w-6 h-6 bg-white/5 rounded-full" />
      </div>
    </div>
  );
};
