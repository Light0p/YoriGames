"use client"

import React, { memo } from 'react';
import Image from 'next/image';
import { Star, Play } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GameCardProps {
  title: string;
  genre: string;
  rating: number;
  imageUrl: string;
  className?: string;
}

const GameCardComponent = ({ title, genre, rating, imageUrl, className }: GameCardProps) => {
  return (
    <article 
      className={cn(
        "group relative w-full overflow-hidden bg-[#140A2E] border-2 border-[#1B123D] cursor-pointer transition-all duration-300 hover:border-neon-purple hover:-translate-y-1 shadow-[4px_4px_0_0_#000] flex flex-col focus-within:ring-4 focus-within:ring-neon-cyan",
        className
      )}
    >
      <div className="relative w-full aspect-[4/3] overflow-hidden bg-black border-b-2 border-[#1B123D]">
        <Image 
          src={imageUrl || 'https://picsum.photos/seed/yorigame/600/400'} 
          alt={`Thumbnail for ${title} game`}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 20vw, 15vw"
          loading="lazy"
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-[#140A2E] via-transparent to-transparent opacity-60" aria-hidden="true" />
        
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="bg-neon-pink p-2 border-2 border-black shadow-[2px_2px_0_0_#000] transform translate-y-4 group-hover:translate-y-0 transition-transform">
            <Play className="w-4 h-4 text-white fill-white" aria-hidden="true" />
          </div>
        </div>
      </div>

      <div className="p-2 bg-[#140A2E] shrink-0 min-w-0">
        <h3 className="font-headline text-[11px] leading-tight truncate text-white group-hover:text-neon-cyan transition-colors mb-1.5 uppercase">
          {title}
        </h3>
        
        <div className="flex items-center justify-between">
          <span className="text-[9px] font-pixel text-muted-foreground uppercase tracking-tighter truncate max-w-[65%] border-l-2 border-neon-purple pl-1.5">
            {genre}
          </span>
          
          <div className="flex items-center gap-0.5 bg-[#09061B] px-1 py-0.5 border border-[#1B123D]">
            <Star className="w-2 h-2 text-neon-gold fill-neon-gold" aria-hidden="true" />
            <span className="text-[9px] font-pixel text-neon-gold">
              {rating.toFixed(1)}
            </span>
          </div>
        </div>
      </div>

      <div className="absolute top-0 left-0 w-1 h-1 bg-white/10" aria-hidden="true" />
      <div className="absolute top-0 right-0 w-1 h-1 bg-white/10" aria-hidden="true" />
    </article>
  );
};

export const GameCard = memo(GameCardComponent);
