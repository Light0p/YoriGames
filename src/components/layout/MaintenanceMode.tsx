"use client"

import React, { useState, useEffect } from 'react';
import { PixelGamepad } from '@/components/pixel/PixelGamepad';
import { Wrench, Zap, Cpu, Terminal } from 'lucide-react';

export const MaintenanceMode = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 99) {
          clearInterval(timer);
          return 99;
        }
        return prev + 1;
      });
    }, 50);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] bg-[#09061B] flex items-center justify-center overflow-hidden font-body">
      {/* CRT Scanline Effect */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
      
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#1B123D_1px,transparent_1px),linear-gradient(to_bottom,#1B123D_1px,transparent_1px)] bg-[size:40px_40px]" />

      <div className="relative z-10 max-w-2xl w-full px-4 sm:px-6 text-center">
        <div className="inline-block relative mb-8 sm:mb-12">
          <div className="absolute inset-0 bg-neon-purple/20 blur-3xl rounded-full animate-pulse" />
          <div className="bg-[#140A2E] p-6 sm:p-8 border-4 border-neon-purple shadow-[0_0_30px_rgba(168,85,247,0.4)] relative">
            <PixelGamepad className="w-16 h-16 sm:w-24 sm:h-24 text-white" />
            <div className="absolute -top-4 -right-4 bg-neon-pink p-2 sm:p-3 border-2 border-black animate-bounce">
              <Wrench className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
            </div>
          </div>
        </div>

        <h1 className="font-pixel text-2xl sm:text-4xl md:text-5xl text-white uppercase tracking-tighter mb-6 text-pixel-shadow leading-tight">
          LEVELING <span className="text-neon-cyan">UP!</span> 🚀
        </h1>

        <p className="font-headline text-sm sm:text-lg md:text-xl text-neon-pink uppercase mb-8 sm:mb-12 tracking-wider leading-relaxed px-4">
          YoriGames is currently under construction.<br className="hidden sm:block" />
          We are optimizing our game engine and refreshing the arcade floor.
        </p>

        <div className="max-w-md mx-auto mb-10 sm:mb-16 px-4">
          <div className="flex justify-between font-pixel text-[6px] sm:text-[8px] text-muted-foreground uppercase mb-3">
            <span>System Calibration</span>
            <span className="text-neon-cyan">{progress}%</span>
          </div>
          <div className="h-4 sm:h-6 bg-[#140A2E] border-2 border-[#1B123D] p-0.5 sm:p-1 relative overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-neon-purple to-neon-cyan transition-all duration-300 ease-out relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.2)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0.2)_75%,transparent_75%,transparent)] bg-[size:10px_10px]" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 sm:gap-6 mb-10 sm:mb-16 px-4">
          <div className="bg-[#140A2E]/50 border-2 border-[#1B123D] p-3 sm:p-4 flex flex-col items-center">
            <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-neon-gold mb-1 sm:mb-2" />
            <span className="font-pixel text-[5px] sm:text-[6px] text-white uppercase">Sync</span>
          </div>
          <div className="bg-[#140A2E]/50 border-2 border-[#1B123D] p-3 sm:p-4 flex flex-col items-center border-neon-cyan/30">
            <Cpu className="w-4 h-4 sm:w-5 sm:h-5 text-neon-cyan mb-1 sm:mb-2" />
            <span className="font-pixel text-[5px] sm:text-[6px] text-white uppercase">Cores</span>
          </div>
          <div className="bg-[#140A2E]/50 border-2 border-[#1B123D] p-3 sm:p-4 flex flex-col items-center">
            <Terminal className="w-4 h-4 sm:w-5 sm:h-5 text-neon-pink mb-1 sm:mb-2" />
            <span className="font-pixel text-[5px] sm:text-[6px] text-white uppercase">Safe</span>
          </div>
        </div>

        <div className="space-y-4 px-4">
          <div className="flex items-center justify-center gap-2 sm:gap-3 bg-neon-gold/10 border border-neon-gold/30 px-4 py-2 sm:px-6 sm:py-3 inline-block">
             <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-neon-gold animate-ping rounded-full" />
             <span className="font-pixel text-[8px] sm:text-[10px] text-neon-gold uppercase">Status: BACK ONLINE SOON!</span>
          </div>
          <p className="font-pixel text-[6px] sm:text-[8px] text-muted-foreground uppercase tracking-widest mt-8">
            Stay tuned, gamer. The high scores await.
          </p>
        </div>
      </div>
    </div>
  );
};
