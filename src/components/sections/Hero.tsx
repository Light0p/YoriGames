"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { PixelButton } from '@/components/pixel/PixelButton';
import { Gamepad2, ChevronRight, Zap } from 'lucide-react';
import { useFirestore } from '@/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { getAllGames } from '@/lib/games';

export const Hero = () => {
  const db = useFirestore();
  const [playerCount, setPlayerCount] = useState<number>(0);
  const games = getAllGames();
  const gameCount = games.length;

  useEffect(() => {
    // Real-time listener for user count
    const unsubscribe = onSnapshot(collection(db, 'users'), (snapshot) => {
      setPlayerCount(snapshot.size);
    }, (error) => {
      console.error("Failed to sync player stats:", error);
    });

    return () => unsubscribe();
  }, [db]);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    return num.toString();
  };

  return (
    <section className="relative w-full min-h-[80vh] flex items-center justify-center overflow-hidden px-4 py-16 sm:py-32">
      {/* Decorative Pixel Elements */}
      <div className="absolute top-[10%] left-[5%] animate-float opacity-30 hidden sm:block">
        <Zap className="w-8 h-8 md:w-12 md:h-12 text-neon-cyan" />
      </div>
      <div className="absolute bottom-[15%] right-[10%] animate-float opacity-20 hidden sm:block" style={{ animationDelay: '2s' }}>
        <div className="w-12 h-12 md:w-16 md:h-16 border-4 border-neon-pink rounded-none" />
      </div>

      <div className="relative z-10 text-center max-w-4xl mx-auto w-full">
        <div className="inline-block px-3 py-1.5 mb-6 bg-neon-purple/20 border-2 border-neon-purple font-pixel text-[8px] md:text-[10px] text-neon-purple tracking-widest animate-pulse-glow">
          SYSTEM ONLINE: READY TO PLAY
        </div>

        <h1 className="font-pixel text-4xl sm:text-6xl md:text-8xl mb-6 text-white text-pixel-shadow leading-tight tracking-tighter uppercase">
          YORI<span className="text-neon-pink">GAMES</span>
        </h1>
        
        <p className="font-headline text-lg sm:text-2xl md:text-4xl text-neon-cyan mb-8 uppercase tracking-wide px-2">
          Play Instantly. Discover Endless Fun.
        </p>

        <p className="font-body text-sm md:text-lg mb-12 max-w-2xl mx-auto px-4 text-muted leading-relaxed">
          Experience the galaxy's most curated collection of indie pixel adventures. 
          No downloads, just pure arcade magic right in your browser.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 px-4">
          <Link href="/arcade" className="w-full sm:w-auto">
            <PixelButton variant="primary" size="lg" className="w-full">
              <Gamepad2 className="w-5 h-5 sm:w-6 sm:h-6" />
              <span>PLAY NOW</span>
            </PixelButton>
          </Link>
          
          <Link href="/arcade" className="w-full sm:w-auto">
            <PixelButton variant="gold" size="lg" className="w-full">
              <span>BROWSE LIBRARY</span>
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </PixelButton>
          </Link>
        </div>

        {/* Real-time Stats Grid */}
        <div className="relative z-20 mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12 opacity-60 px-4 max-w-lg mx-auto border-t border-white/10 pt-8 sm:border-t-0 sm:pt-0">
          <div className="flex flex-col items-center">
            <span className="font-pixel text-xl sm:text-2xl text-white">{gameCount}+</span>
            <span className="text-[10px] font-pixel text-muted mt-2 tracking-widest uppercase">GAMES</span>
          </div>
          <div className="flex flex-col items-center sm:border-x sm:border-white/20">
            <span className="font-pixel text-xl sm:text-2xl text-white">{formatNumber(playerCount)}</span>
            <span className="text-[10px] font-pixel text-muted mt-2 tracking-widest uppercase">PLAYERS</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-pixel text-xl sm:text-2xl text-white">100%</span>
            <span className="text-[10px] font-pixel text-muted mt-2 tracking-widest uppercase">FREE</span>
          </div>
        </div>
      </div>
    </section>
  );
};