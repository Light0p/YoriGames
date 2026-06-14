"use client"

import React, { memo } from 'react';
import Image from 'next/image';
import { Play } from 'lucide-react';
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
        "group relative w-full overflow-hidden bg-[#140A2E] border-2 border-[#1B123D] cursor-pointer transition-all duration-300",
        "hover:border-neon-cyan hover:scale-105 hover:z-20 shadow-[4px_4px_0_0_#000] flex flex-col focus-within:ring-4 focus-within:ring-neon-cyan",
        className
      )}
      title={title} // Tooltip for accessibility since text is hidden
    >
      <div className="relative w-full aspect-[4/3] overflow-hidden bg-black">
        <Image 
          src={imageUrl || 'https://picsum.photos/seed/yorigame/600/400'} 
          alt={`Play ${title}`}
          fill
          className="object-cover transition-transform duration-500 group-hover:brightness-110"
          sizes="(max-width: 640px) 33vw, (max-width: 768px) 25vw, (max-width: 1024px) 16vw, 12vw"
          loading="lazy"
        />
        
        {/* Overlay gradient for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" aria-hidden="true" />
        
        {/* Simple Play Icon on Hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="bg-neon-cyan p-2 border-2 border-black shadow-[2px_2px_0_0_#000] transform scale-0 group-hover:scale-100 transition-transform duration-300">
            <Play className="w-4 h-4 text-black fill-black" aria-hidden="true" />
          </div>
        </div>
      </div>

      {/* Decorative corner pixels for the retro look */}
      <div className="absolute top-0 left-0 w-1 h-1 bg-white/10" aria-hidden="true" />
      <div className="absolute top-0 right-0 w-1 h-1 bg-white/10" aria-hidden="true" />
    </article>
  );
};

export const GameCard = memo(GameCardComponent);
