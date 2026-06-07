"use client"

import React, { useEffect, useState } from 'react';

export const SpaceBackground = () => {
  const [elements, setElements] = useState<{
    stars: any[];
    asteroids: any[];
    planets: any[];
    ships: any[];
    mounted: boolean;
  }>({ stars: [], asteroids: [], planets: [], ships: [], mounted: false });

  useEffect(() => {
    // Distant stars
    const stars = Array.from({ length: 150 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      duration: Math.random() * 3 + 2,
    }));

    // Drifting Asteroids
    const asteroids = Array.from({ length: 12 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 15 + 10,
      speed: Math.random() * 40 + 60,
      delay: Math.random() * -10,
      rotation: Math.random() * 360,
    }));

    // Rotating Planets
    const planets = [
      { id: 1, x: 15, y: 20, size: 80, color: '#2E1A47', glow: '#A855F7', duration: 45 },
      { id: 2, x: 80, y: 70, size: 120, color: '#1B123D', glow: '#EC4899', duration: 60 },
      { id: 3, x: 60, y: 35, size: 40, color: '#140A2E', glow: '#22D3EE', duration: 30 },
    ];

    // Flying Ships
    const ships = Array.from({ length: 3 }).map((_, i) => ({
      id: i,
      y: 20 + i * 25,
      speed: Math.random() * 10 + 15,
      delay: i * 5,
    }));

    setElements({ stars, asteroids, planets, ships, mounted: true });
  }, []);

  if (!elements.mounted) return <div className="fixed inset-0 z-[-1] bg-[#09061B]" />;

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-[#09061B] pointer-events-none select-none">
      {/* Dynamic Noise Overlay */}
      <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      
      {/* Nebula Glows */}
      <div className="absolute top-[-20%] right-[-10%] w-[80%] h-[80%] rounded-full bg-neon-purple/5 blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-20%] w-[70%] h-[70%] rounded-full bg-neon-pink/5 blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />

      {/* Twinkling Stars */}
      {elements.stars.map((star) => (
        <div
          key={`star-${star.id}`}
          className="absolute bg-white/40 animate-pulse rounded-full"
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

      {/* Parallax Planets */}
      {elements.planets.map((planet) => (
        <div
          key={`planet-${planet.id}`}
          className="absolute rounded-full border-2 border-white/5 animate-float"
          style={{
            left: `${planet.x}%`,
            top: `${planet.y}%`,
            width: `${planet.size}px`,
            height: `${planet.size}px`,
            backgroundColor: planet.color,
            boxShadow: `inset -20px -20px 40px rgba(0,0,0,0.8), 0 0 40px ${planet.glow}22`,
            animationDuration: `${planet.duration}s`,
          }}
        >
          <div className="absolute top-1/4 left-1/4 w-1/3 h-1/3 bg-white/5 rounded-full blur-md" />
        </div>
      ))}

      {/* Drifting Asteroids */}
      {elements.asteroids.map((ast) => (
        <div
          key={`ast-${ast.id}`}
          className="absolute bg-[#1B123D] border-2 border-white/5"
          style={{
            left: `${ast.x}%`,
            top: `${ast.y}%`,
            width: `${ast.size}px`,
            height: `${ast.size}px`,
            transform: `rotate(${ast.rotation}deg)`,
            opacity: 0.3,
            animation: `drift ${ast.speed}s linear infinite`,
            animationDelay: `${ast.delay}s`,
          }}
        />
      ))}

      {/* Pixel Ships */}
      {elements.ships.map((ship) => (
        <div
          key={`ship-${ship.id}`}
          className="absolute w-8 h-4 bg-neon-cyan flex items-center justify-center"
          style={{
            top: `${ship.y}%`,
            left: '-10%',
            animation: `flyBy ${ship.speed}s linear infinite`,
            animationDelay: `${ship.delay}s`,
            boxShadow: '0 0 10px #22D3EE',
          }}
        >
          <div className="w-2 h-full bg-neon-pink absolute left-full opacity-50 blur-sm" />
          <div className="font-pixel text-[4px] text-black">UFO</div>
        </div>
      ))}

      <style jsx global>{`
        @keyframes flyBy {
          from { left: -10%; }
          to { left: 110%; }
        }
        @keyframes drift {
          from { transform: translate(0, 0) rotate(0deg); }
          to { transform: translate(200px, 200px) rotate(360deg); }
        }
        .shooting-star {
          position: absolute;
          width: 2px;
          height: 2px;
          background: #fff;
          border-radius: 50%;
          box-shadow: 0 0 20px #fff;
          animation: shooting 5s linear infinite;
        }
        @keyframes shooting {
          0% { transform: rotate(315deg) translateX(0); opacity: 0; }
          10% { opacity: 1; }
          30% { transform: rotate(315deg) translateX(-600px); opacity: 0; }
          100% { transform: rotate(315deg) translateX(-600px); opacity: 0; }
        }
      `}</style>
    </div>
  );
};