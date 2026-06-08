import React from 'react';
import { SpaceBackground } from '@/components/layout/SpaceBackground';
import { Zap } from 'lucide-react';

// SSR-safe fallback for route transitions
export default function Loading() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#09061B] overflow-hidden">
      <SpaceBackground />
      
      <div className="relative z-50 flex flex-col items-center gap-8">
        <div className="relative">
          <div className="absolute inset-0 -m-4 border-4 border-neon-purple/10 rounded-full animate-ping" />
          <div className="w-20 h-20 border-4 border-[#1B123D] border-t-neon-purple rounded-full animate-spin" />
          <div className="absolute inset-0 m-auto w-8 h-8 flex items-center justify-center">
            <Zap className="w-6 h-6 text-neon-cyan animate-pulse" />
          </div>
        </div>

        <div className="flex flex-col items-center gap-3">
          <div className="font-pixel text-[10px] text-white uppercase tracking-[0.5em] animate-pulse">
            LOADING UNIVERSE...
          </div>
          <div className="w-48 h-1 bg-[#1B123D] overflow-hidden">
            <div className="h-full bg-neon-purple animate-loading-bar" />
          </div>
          <div className="font-pixel text-[6px] text-muted-foreground uppercase tracking-widest mt-2">
            Establishing Secure Link to Nexus-6
          </div>
        </div>
      </div>
    </div>
  );
}