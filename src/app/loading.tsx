
import React from 'react';
import { SpaceBackground } from '@/components/layout/SpaceBackground';
import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <SpaceBackground />
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-neon-purple/20 border-t-neon-purple rounded-full animate-spin" />
          <Loader2 className="absolute inset-0 m-auto w-6 h-6 text-neon-purple animate-pulse" />
        </div>
        <div className="font-pixel text-[10px] text-white uppercase tracking-[0.3em] animate-pulse">
          Loading Universe...
        </div>
      </div>
    </div>
  );
}
