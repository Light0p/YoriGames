
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
    <article className="group relative w-full overflow-hidden bg-[#1B123D] border-2 md:border-4 border-[#140A2E] cursor-pointer transition-all duration-300 hover:-translate-y-1 md:hover:-translate-y-2 hover:border-neon-purple hover:shadow-[0_0_20px_rgba(168,85,247,0.3)]">
      {/* Game Image Container */}
      <div className="relative aspect-video w-full overflow-hidden bg-[#09061B]">
        <Image 
          src={imageUrl} 
          alt={`Thumbnail for ${title} - a premium ${genre} game`}
          fill
          loading="lazy"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          data-ai-hint="pixel art"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1B123D] via-transparent to-transparent opacity-80" />
        
        {/* Play Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="bg-neon-pink p-3 border-4 border-black shadow-[4px_4px_0_0_#000] transform translate-y-4 group-hover:translate-y-0 transition-transform">
            <Play className="w-6 h-6 text-white fill-white" aria-hidden="true" />
          </div>
        </div>
      </div>

      {/* Game Info */}
      <div className="p-3 md:p-4 flex flex-col justify-between">
        <div className="min-w-0">
          <h3 className="font-headline text-base md:text-lg leading-tight truncate group-hover:text-neon-cyan transition-colors">
            {title}
          </h3>
          <p className="text-[10px] md:text-xs font-pixel text-muted uppercase mt-1 md:mt-1.5 truncate tracking-widest">
            {genre}
          </p>
        </div>
        
        <div className="flex items-center justify-between mt-3 md:mt-4">
          <div className="flex items-center gap-1.5 bg-neon-gold/10 px-2 py-0.5 border border-neon-gold/20">
            <Star className="w-3 h-3 text-neon-gold fill-neon-gold" aria-hidden="true" />
            <span className="text-[10px] md:text-xs font-pixel text-neon-gold">{rating.toFixed(1)}</span>
          </div>
          <div className="w-2 h-2 bg-neon-purple animate-pulse rounded-full shadow-[0_0_10px_rgba(168,85,247,0.9)]" />
        </div>
      </div>

      {/* Decorative Ribs */}
      <div className="absolute left-1 top-3 flex flex-col gap-1 opacity-30">
        {[1,2,3].map(i => <div key={i} className="w-2 h-0.5 bg-white" />)}
      </div>
    </article>
  );
};

export const GameCard = memo(GameCardComponent);
