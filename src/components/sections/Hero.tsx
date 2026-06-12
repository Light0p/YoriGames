"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { PixelButton } from '@/components/pixel/PixelButton';
import { Gamepad2, ChevronRight } from 'lucide-react';
import { useGameStore } from '@/context/GameContext';
import { useFirestore } from '@/firebase';
import { collection, getCountFromServer } from 'firebase/firestore'; 

export const Hero = () => {
  const { allGames } = useGameStore();
  const db = useFirestore();
  const [playerCount, setPlayerCount] = useState<number>(0);

  useEffect(() => {
    const fetchUserStats = async () => {
      const cachedPlayers = sessionStorage.getItem('yori_players_count');
      if (cachedPlayers) {
        setPlayerCount(parseInt(cachedPlayers, 10));
        return;
      }

      try {
        const usersSnapshot = await getCountFromServer(collection(db, 'users'));
        const totalUsers = usersSnapshot.data().count;
        setPlayerCount(totalUsers);
        sessionStorage.setItem('yori_players_count', totalUsers.toString());
      } catch (err) {
        console.error("User count fetch failed:", err);
      }
    };
    
    fetchUserStats();
  }, [db]);

  const formatNumber = (num: number) => {
    if (num === 0) return "0"; 
    if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    return num.toString();
  };

  return (
    <section className="relative w-full min-h-[60vh] flex items-center justify-center overflow-hidden px-4 py-16 sm:py-24">
      <div className="relative z-10 text-center max-w-4xl mx-auto w-full">
        <div className="inline-block px-3 py-1.5 mb-8 bg-neon-purple/10 border border-neon-purple/30 font-pixel text-[8px] md:text-[10px] text-neon-purple tracking-widest uppercase">
          Simple Games. Fast Loading.
        </div>

        <h1 className="font-pixel text-4xl sm:text-6xl md:text-7xl mb-8 text-white text-pixel-shadow leading-tight tracking-tighter uppercase">
          YORI<span className="text-neon-pink">GAMES</span>
        </h1>
        
        <p className="font-headline text-lg sm:text-2xl md:text-3xl text-neon-cyan mb-8 uppercase tracking-wide px-2">
          Play great browser games instantly.
        </p>

        <p className="font-body text-sm md:text-lg mb-12 max-w-2xl mx-auto px-4 text-muted leading-relaxed">
          A growing collection of fun, indie pixel-art adventures built for quick sessions. 
          No downloads, no installations—just pure arcade magic right in your browser.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 px-4">
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

        <div className="relative z-20 mt-20 grid grid-cols-3 gap-4 sm:gap-12 opacity-80 px-4 max-w-lg mx-auto border-t border-white/10 pt-10">
          <div className="flex flex-col items-center">
            <span className="font-pixel text-lg sm:text-xl text-white">{formatNumber(allGames.length)}</span>
            <span className="text-[10px] font-pixel text-muted mt-2 tracking-widest uppercase">Games</span>
          </div>
          <div className="flex flex-col items-center border-x border-white/20">
            <span className="font-pixel text-lg sm:text-xl text-white">{formatNumber(playerCount)}</span>
            <span className="text-[10px] font-pixel text-muted mt-2 tracking-widest uppercase">Players</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-pixel text-lg sm:text-xl text-white">100%</span>
            <span className="text-[10px] font-pixel text-muted mt-2 tracking-widest uppercase">Free</span>
          </div>
        </div>
      </div>
    </section>
  );
};
