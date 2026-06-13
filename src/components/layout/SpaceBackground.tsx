"use client"

import React, { useEffect, useState } from 'react';

export const SpaceBackground = () => {
  const [elements, setElements] = useState<{
    stars: any[];
    asteroids: any[];
    planets: any[];
    shootingStars: any[];
    mounted: boolean;
  }>({ 
    stars: [], 
    asteroids: [], 
    planets: [], 
    shootingStars: [],
    mounted: false 
  });

  useEffect(() => {
    // Distant twinkling stars
    const stars = Array.from({ length: 200 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      duration: Math.random() * 3 + 2,
      opacity: Math.random() * 0.5 + 0.2,
    }));

    // Drifting Asteroids
    const asteroids = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 20 + 10,
      speed: Math.random() * 60 + 40,
      delay: Math.random() * -20,
      rotation: Math.random() * 360,
    }));

    // Large Parallax Planets
    const planets = [
      { id: 1, x: 10, y: 15, size: 100, color: '#2E1A47', glow: '#A855F7', duration: 45, type: 'purple' },
      { id: 2, x: 75, y: 65, size: 150, color: '#1B123D', glow: '#EC4899', duration: 60, type: 'pink' },
      { id: 3, x: 55, y: 30, size: 60, color: '#140A2E', glow: '#22D3EE', duration: 35, type: 'cyan' },
      { id: 4, x: 20, y: 80, size: 40, color: '#1B123D', glow: '#FFD34D', duration: 50, type: 'gold' },
    ];

    // Randomized Shooting Stars
    const shootingStars = Array.from({ length: 5 }).map((_, i) => ({
      id: i,
      delay: Math.random() * 10,
      duration: Math.random() * 2 + 3,
      top: Math.random() * 50,
      left: Math.random() * 100,
    }));

    setElements({ stars, asteroids, planets, shootingStars, mounted: true });
  }, []);

  if (!elements.mounted) return <div className="fixed inset-0 z-[-1] bg-[#09061B]" />;

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-[#09061B] pointer-events-none select-none">
      {/* Nebula/Galaxy Glows (GPU Accelerated via Will-Change) */}
      <div className="absolute top-[-20%] right-[-10%] w-[80%] h-[80%] rounded-full bg-neon-purple/5 blur-[120px] animate-pulse will-change-transform" />
      <div className="absolute bottom-[-10%] left-[-20%] w-[70%] h-[70%] rounded-full bg-neon-pink/5 blur-[120px] animate-pulse will-change-transform" style={{ animationDelay: '2s' }} />
      <div className="absolute top-[30%] left-[20%] w-[40%] h-[40%] rounded-full bg-neon-cyan/5 blur-[100px] animate-pulse will-change-transform" style={{ animationDelay: '4s' }} />

      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay" />

      {/* Stars Layer */}
      {elements.stars.map((star) => (
        <div
          key={`star-${star.id}`}
          className="absolute bg-white/60 animate-pulse rounded-full"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDuration: `${star.duration}s`,
            opacity: star.opacity,
            boxShadow: star.size > 2 ? `0 0 6px #fff` : 'none',
          }}
        />
      ))}

      {/* Shooting Stars */}
      {elements.shootingStars.map((ss) => (
        <div 
          key={`ss-${ss.id}`}
          className="shooting-star animate-shooting"
          style={{
            top: `${ss.top}%`,
            left: `${ss.left}%`,
            animationDelay: `${ss.delay}s`,
            animationDuration: `${ss.duration}s`,
          }}
        />
      ))}

      {/* Planets Layer (Parallax via float animation) */}
      {elements.planets.map((planet) => (
        <div
          key={`planet-${planet.id}`}
          className="absolute rounded-full border border-white/5 animate-float will-change-transform"
          style={{
            left: `${planet.x}%`,
            top: `${planet.y}%`,
            width: `${planet.size}px`,
            height: `${planet.size}px`,
            backgroundColor: planet.color,
            boxShadow: `inset -20px -20px 50px rgba(0,0,0,0.9), 0 0 40px ${planet.glow}22`,
            animationDuration: `${planet.duration}s`,
          }}
        >
          {/* Surface Detail/Reflection */}
          <div className="absolute top-[15%] left-[15%] w-[40%] h-[40%] bg-white/5 rounded-full blur-xl" />
        </div>
      ))}

      {/* Asteroids Layer */}
      {elements.asteroids.map((ast) => (
        <div
          key={`ast-${ast.id}`}
          className="absolute bg-[#1B123D] border-2 border-white/10 animate-drift"
          style={{
            left: `${ast.x}%`,
            top: `${ast.y}%`,
            width: `${ast.size}px`,
            height: `${ast.size}px`,
            transform: `rotate(${ast.rotation}deg)`,
            opacity: 0.2,
            animationDuration: `${ast.speed}s`,
            animationDelay: `${ast.delay}s`,
          }}
        />
      ))}
    </div>
  );
};
