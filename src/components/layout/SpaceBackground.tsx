
"use client"

import React, { useEffect, useState } from 'react';

export const SpaceBackground = () => {
  const [elements, setElements] = useState<{
    stars: any[];
    asteroids: any[];
    planets: any[];
    ships: any[];
  }>({ stars: [], asteroids: [], planets: [], ships: [] });

  useEffect(() => {
    const stars = Array.from({ length: 150 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      duration: Math.random() * 3 + 2,
    }));

    const asteroids = Array.from({ length: 8 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 20 + 10,
      duration: Math.random() * 20 + 20,
      delay: Math.random() * 10,
    }));

    const planets = Array.from({ length: 3 }).map((_, i) => ({
      id: i,
      x: [15, 85, 70][i],
      y: [20, 75, 40][i],
      size: [60, 40, 100][i],
      color: ['#1B123D', '#2E1A47', '#140A2E'][i],
      borderColor: ['#3B2263', '#4E2B7A', '#1B123D'][i],
      duration: [40, 60, 80][i],
    }));

    setElements({ stars, asteroids, planets, ships: [] });
  }, []);

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-[#09061B] pointer-events-none">
      {/* Dynamic Noise Overlay */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      
      {/* Distant Nebula Glows */}
      <div className="absolute top-[-20%] right-[-10%] w-[80%] h-[80%] rounded-full bg-neon-purple/5 blur-[150px] animate-pulse-glow" />
      <div className="absolute bottom-[-10%] left-[-20%] w-[70%] h-[70%] rounded-full bg-neon-pink/5 blur-[150px] animate-pulse-glow" style={{ animationDelay: '1s' }} />

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

      {/* Rotating Planets */}
      {elements.planets.map((planet) => (
        <div
          key={`planet-${planet.id}`}
          className="absolute rounded-full border-4 animate-float"
          style={{
            left: `${planet.x}%`,
            top: `${planet.y}%`,
            width: `${planet.size}px`,
            height: `${planet.size}px`,
            backgroundColor: planet.color,
            borderColor: planet.borderColor,
            animationDuration: `${planet.duration}s`,
            opacity: 0.4,
          }}
        >
          <div className="absolute top-1/4 left-1/4 w-1/4 h-1/4 bg-white/5 rounded-full" />
        </div>
      ))}

      {/* Drifting Asteroids */}
      {elements.asteroids.map((ast) => (
        <div
          key={`ast-${ast.id}`}
          className="absolute bg-[#1B123D] border-2 border-[#140A2E] opacity-20"
          style={{
            left: `${ast.x}%`,
            top: `${ast.y}%`,
            width: `${ast.size}px`,
            height: `${ast.size}px`,
            transform: 'rotate(45deg)',
            animation: `float ${ast.duration}s infinite linear`,
            animationDelay: `${ast.delay}s`,
          }}
        />
      ))}

      {/* Shooting Stars */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="shooting-star" />
        <div className="shooting-star" style={{ animationDelay: '5s', top: '30%', left: '70%' }} />
      </div>

      <style jsx>{`
        .shooting-star {
          position: absolute;
          top: 0;
          left: 50%;
          width: 2px;
          height: 2px;
          background: #fff;
          border-radius: 50%;
          box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.1), 0 0 0 8px rgba(255, 255, 255, 0.1), 0 0 20px rgba(255, 255, 255, 1);
          animation: animate 3s linear infinite;
        }
        .shooting-star::before {
          content: '';
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 300px;
          height: 1px;
          background: linear-gradient(90deg, #fff, transparent);
        }
        @keyframes animate {
          0% { transform: rotate(315deg) translateX(0); opacity: 1; }
          70% { opacity: 1; }
          100% { transform: rotate(315deg) translateX(-1000px); opacity: 0; }
        }
      `}</style>
    </div>
  );
};
