"use client"

import React, { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import { PixelButton } from '@/components/pixel/PixelButton';
import { Gamepad2, ChevronRight } from 'lucide-react';
import { useGameStore } from '@/context/GameContext';

export const Hero = () => {
  const { allGames } = useGameStore();
  
  // Believable base number for total arcade plays
  const [totalPlays, setTotalPlays] = useState(2543000);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    // Recursive timeout to allow for a randomized delay between every single tick
    const scheduleNextTick = () => {
      const delay = Math.floor(Math.random() * 5000) + 3000; // 3 to 8 seconds
      timeoutId = setTimeout(() => {
        setTotalPlays(prev => prev + Math.floor(Math.random() * 4) + 1); // Increment by 1 to 4
        scheduleNextTick();
      }, delay);
    };

    scheduleNextTick();
    return () => clearTimeout(timeoutId);
  }, []);

  // Instant calculation for stats
  const stats = useMemo(() => {
    return {
      games: allGames.length || 0,
      playsFormatted: totalPlays.toLocaleString('en-US') // Clean comma-separated formatting
    };
  }, [allGames, totalPlays]);

  return (
    <section className="relative w-full min-h-[50vh] sm:min-h-[60vh] flex items-center justify-center overflow-hidden px-4 py-12 sm:py-24">
      <div className="relative z-10 text-center max-w-4xl mx-auto w-full">
        <div className="inline-block px-3 py-1.5 mb-6 sm:mb-8 bg-neon-purple/10 border border-neon-purple/30 font-pixel text-[6px] sm:text-[10px] text-neon-purple tracking-widest uppercase">
          Simple Games. Fast Loading.
        </div>

        <h1 className="font-pixel text-3xl sm:text-6xl md:text-7xl mb-6 sm:mb-8 text-white text-pixel-shadow leading-tight tracking-tighter uppercase px-2">
          YORI<span className="text-neon-pink">GAMES</span>
        </h1>
        
        <p className="font-headline text-base sm:text-2xl md:text-3xl text-neon-cyan mb-6 sm:mb-8 uppercase tracking-wide px-4">
          Play great browser games instantly.
        </p>

        <p className="font-body text-xs sm:text-lg mb-10 sm:mb-12 max-w-2xl mx-auto px-6 text-muted leading-relaxed">
          A growing collection of fun, indie pixel-art adventures built for quick sessions. 
          No downloads, no installations—just pure arcade magic right in your browser.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 px-6">
          <Link href="/trending" className="w-full sm:w-auto">
            <PixelButton variant="primary" size="lg" className="w-full">
              <Gamepad2 className="w-5 h-5" />
              <span>START PLAYING</span>
            </PixelButton>
          </Link>
          
          <Link href="#categories" className="w-full sm:w-auto">
            <PixelButton variant="gold" size="lg" className="w-full">
              <span>EXPLORE LIBRARY</span>
              <ChevronRight className="w-5 h-5" />
            </PixelButton>
          </Link>
        </div>

        <div className="relative z-20 mt-16 sm:mt-20 grid grid-cols-3 gap-2 sm:gap-4 opacity-80 px-4 max-w-2xl mx-auto border-t border-white/10 pt-8 sm:pt-10">
          <div className="flex flex-col items-center">
            <span className="font-pixel text-sm sm:text-xl text-white">{stats.games}</span>
            <span className="text-[6px] sm:text-[10px] font-pixel text-muted mt-2 tracking-widest uppercase">Games</span>
          </div>
          <div className="flex flex-col items-center border-x border-white/20 px-2 sm:px-8">
            <span className="font-pixel text-sm sm:text-xl text-neon-cyan tabular-nums transition-all">
              {stats.playsFormatted}
            </span>
            <span className="text-[6px] sm:text-[10px] font-pixel text-muted mt-2 tracking-widest uppercase">Plays</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-pixel text-sm sm:text-xl text-white">100%</span>
            <span className="text-[6px] sm:text-[10px] font-pixel text-muted mt-2 tracking-widest uppercase">Free</span>
          </div>
        </div>
      </div>
    </section>
  );
};
