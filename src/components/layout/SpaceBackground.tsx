"use client"

import React, { useEffect, useState } from 'react';

export const SpaceBackground = () => {
  const [elements, setElements] = useState<{
    stars: any[];
    asteroids: any[];
    planets: any[];
    ships: any[];
    shootingStars: any[];
    mounted: boolean;
  }>({ 
    stars: [], 
    asteroids: [], 
    planets: [], 
    ships: [], 
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

    // Rare Flying Pixel Ships
    const ships = Array.from({ length: 2 }).map((_, i) => ({
      id: i,
      y: 15 + i * 40,
      speed: Math.random() * 15 + 20,
      delay: i * 8,
    }));

    setElements({ stars, asteroids, planets, ships, shootingStars, mounted: true });
  }, []);

  if (!elements.mounted) return <div className="fixed inset-0 z-[-1] bg-[#09061B]" />;

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-[#09061B] pointer-events-none select-none">
      {/* Nebula/Galaxy Glows (GPU Accelerated via Will-Change) */}
      <div className="absolute top-[-20%] right-[-10%] w-[80%] h-[80%] rounded-full bg-neon-purple/5 blur-[120px] animate-pulse will-change-transform" />
      <div className="absolute bottom-[-10%] left-[-20%] w-[70%] h-[70%] rounded-full bg-neon-pink/5 blur-[120px] animate-pulse will-change-transform" style={{ animationDelay: '2s' }} />
      <div className="absolute top-[30%] left-[20%] w-[40%] h-[40%] rounded-full bg-neon-cyan/5 blur-[100px] animate-pulse will-change-transform" style={{ animationDelay: '4s' }} />

      {/* Static Grain/Noise for Texture */}
      <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

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
          className="shooting-star"
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
          className="absolute bg-[#1B123D] border-2 border-white/10"
          style={{
            left: `${ast.x}%`,
            top: `${ast.y}%`,
            width: `${ast.size}px`,
            height: `${ast.size}px`,
            transform: `rotate(${ast.rotation}deg)`,
            opacity: 0.2,
            animation: `drift ${ast.speed}s linear infinite`,
            animationDelay: `${ast.delay}s`,
          }}
        />
      ))}

      {/* Pixel Spaceships Layer */}
      {elements.ships.map((ship) => (
        <div
          key={`ship-${ship.id}`}
          className="absolute w-12 h-6 bg-neon-cyan/80 flex items-center justify-center border-b-2 border-r-2 border-black"
          style={{
            top: `${ship.y}%`,
            left: '-10%',
            animation: `flyBy ${ship.speed}s linear infinite`,
            animationDelay: `${ship.delay}s`,
            boxShadow: '0 0 15px #22D3EE',
          }}
        >
          <div className="w-4 h-full bg-neon-pink/40 absolute left-full opacity-50 blur-md animate-pulse" />
          <div className="font-pixel text-[6px] text-black font-bold">YORI</div>
        </div>
      ))}

      <style jsx global>{`
        @keyframes flyBy {
          from { left: -15%; }
          to { left: 115%; }
        }
        @keyframes drift {
          from { transform: translate(0, 0) rotate(0deg); }
          to { transform: translate(300px, 300px) rotate(360deg); }
        }
        .shooting-star {
          position: absolute;
          width: 3px;
          height: 3px;
          background: linear-gradient(to right, #fff, transparent);
          border-radius: 50%;
          filter: drop-shadow(0 0 10px #fff);
          animation: shooting linear infinite;
          opacity: 0;
        }
        @keyframes shooting {
          0% { transform: rotate(315deg) translateX(0); opacity: 0; }
          5% { opacity: 1; }
          15% { transform: rotate(315deg) translateX(-1000px); opacity: 0; }
          100% { transform: rotate(315deg) translateX(-1000px); opacity: 0; }
        }
      `}</style>
    </div>
  );
};
