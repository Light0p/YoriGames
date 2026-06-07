"use client"

import React from 'react';
import { PixelButton } from '@/components/pixel/PixelButton';
import { Gamepad2, ChevronRight, Zap } from 'lucide-react';

export const Hero = () => {
  return (
    <section className="relative w-full h-[90vh] flex items-center justify-center overflow-hidden px-6 pt-20">
      {/* Decorative Pixel Elements */}
      <div className="absolute top-[20%] left-[10%] animate-float opacity-30">
        <Zap className="w-12 h-12 text-neon-cyan" />
      </div>
      <div className="absolute bottom-[25%] right-[15%] animate-float opacity-20" style={{ animationDelay: '2s' }}>
        <div className="w-16 h-16 border-4 border-neon-pink rounded-none" />
      </div>

      <div className="relative z-10 text-center max-w-4xl">
        <div className="inline-block px-4 py-2 mb-6 bg-neon-purple/20 border-2 border-neon-purple font-pixel text-[10px] text-neon-purple tracking-widest animate-pulse-glow">
          SYSTEM ONLINE: READY TO PLAY
        </div>

        <h1 className="font-pixel text-5xl md:text-8xl mb-6 text-white text-pixel-shadow leading-none tracking-tighter">
          YORI<span className="text-neon-pink">GAMES</span>
        </h1>
        
        <p className="font-headline text-2xl md:text-4xl text-neon-cyan mb-8 uppercase tracking-wide">
          Play Instantly. Discover Endless Fun.
        </p>

        <p className="font-body text-muted text-lg mb-12 max-w-2xl mx-auto">
          Experience the galaxy's most curated collection of indie pixel adventures. 
          No downloads, just pure arcade magic right in your browser.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <PixelButton variant="primary" size="lg" className="w-full sm:w-auto">
            <Gamepad2 className="w-6 h-6" />
            <span>PLAY NOW</span>
          </PixelButton>
          
          <PixelButton variant="gold" size="lg" className="w-full sm:w-auto">
            <span>BROWSE LIBRARY</span>
            <ChevronRight className="w-6 h-6" />
          </PixelButton>
        </div>

        <div className="mt-16 flex items-center justify-center gap-12 opacity-50">
          <div className="flex flex-col items-center">
            <span className="font-pixel text-2xl">500+</span>
            <span className="text-[10px] font-pixel text-muted">GAMES</span>
          </div>
          <div className="w-[1px] h-10 bg-white/20" />
          <div className="flex flex-col items-center">
            <span className="font-pixel text-2xl">10K</span>
            <span className="text-[10px] font-pixel text-muted">PLAYERS</span>
          </div>
          <div className="w-[1px] h-10 bg-white/20" />
          <div className="flex flex-col items-center">
            <span className="font-pixel text-2xl">100%</span>
            <span className="text-[10px] font-pixel text-muted">FREE</span>
          </div>
        </div>
      </div>
    </section>
  );
};
