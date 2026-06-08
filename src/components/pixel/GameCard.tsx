"use client"

import React, { memo } from 'react';
import Image from 'next/image';
import { Star, Play } from 'lucide-react';

interface GameCardProps {
  title: string;
  genre: string;
  rating: number;
  imageUrl: string;
}

const GameCardComponent = ({ title, genre, rating, imageUrl }: GameCardProps) => {
  return (
    <div className="group relative w-full overflow-hidden bg-[#1B123D] border-2 md:border-4 border-[#140A2E] cursor-pointer transition-all duration-300 hover:-translate-y-1 md:hover:-translate-y-2 hover:border-neon-purple hover:shadow-[0_0_15px_rgba(168,85,247,0.4)]">
      {/* Game Image Container - Aspect ratio maintained for CLS prevention */}
      <div className="relative aspect-video w-full overflow-hidden bg-[#09061B]">
        <Image 
          src={imageUrl} 
          alt={`Play ${title} - ${genre} arcade game`}
          fill
          loading="lazy"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1B123D] to-transparent opacity-60" />
        
        {/* Play Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-neon-pink p-2 md:p-3 border-2 md:border-4 border-black transform translate-y-4 group-hover:translate-y-0 transition-transform">
            <Play className="w-4 h-4 md:w-6 md:h-6 text-white fill-white" aria-hidden="true" />
          </div>
        </div>
      </div>

      {/* Game Info */}
      <div className="p-2 md:p-3 flex flex-col justify-between">
        <div className="min-w-0">
          <h3 className="font-headline text-sm md:text-base leading-tight truncate group-hover:text-neon-cyan transition-colors">
            {title}
          </h3>
          <p className="text-[10px] md:text-xs font-pixel text-muted uppercase mt-0.5 md:mt-1 truncate">
            {genre}
          </p>
        </div>
        
        <div className="flex items-center justify-between mt-2 md:mt-3">
          <div className="flex items-center gap-1">
            <Star className="w-2.5 h-2.5 md:w-3 md:h-3 text-neon-gold fill-neon-gold" aria-hidden="true" />
            <span className="text-[10px] md:text-xs font-pixel text-neon-gold">{rating.toFixed(1)}</span>
          </div>
          <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-neon-purple animate-pulse rounded-full shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
        </div>
      </div>

      {/* Cartridge Style Ribs */}
      <div className="absolute left-0.5 top-2 flex flex-col gap-0.5">
        {[1,2,3].map(i => <div key={i} className="w-1 md:w-1.5 h-0.5 md:h-1 bg-white/10" />)}
      </div>
    </div>
  );
};

// Memoize to prevent re-renders when global auth state changes
export const GameCard = memo(GameCardComponent);
