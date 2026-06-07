
"use client"

import React from 'react';
import Link from 'next/link';
import { SpaceBackground } from '@/components/layout/SpaceBackground';
import { PixelButton } from '@/components/pixel/PixelButton';
import { Rocket } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 text-center">
      <SpaceBackground />
      <div className="max-w-xl">
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <Rocket className="w-24 h-24 text-neon-pink animate-bounce" />
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-12 h-4 bg-black/40 blur-sm rounded-full" />
          </div>
        </div>
        <h1 className="font-pixel text-4xl md:text-6xl text-white mb-6 uppercase tracking-tighter">
          404: LOST IN <span className="text-neon-cyan">SPACE</span>
        </h1>
        <p className="font-headline text-xl text-muted mb-12 uppercase">
          Even our fastest ships can't find this page. It might have been sucked into a black hole!
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link href="/" className="w-full sm:w-auto">
            <PixelButton variant="primary" className="w-full">
              RETURN TO BASE
            </PixelButton>
          </Link>
          <Link href="/arcade" className="w-full sm:w-auto">
            <PixelButton variant="gold" className="w-full">
              BROWSE GAMES
            </PixelButton>
          </Link>
        </div>
      </div>
    </div>
  );
}
