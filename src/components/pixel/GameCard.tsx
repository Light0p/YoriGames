"use client"

import React, { memo } from 'react';
import Image from 'next/image';
import { Play, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useArcadeState } from '@/hooks/useArcadeState';

interface GameCardProps {
  slug: string;
  title: string;
  genre: string;
  rating: number;
  imageUrl: string;
  className?: string;
}

const GameCardComponent = ({ slug, title, genre, rating, imageUrl, className }: GameCardProps) => {
  const { toggleFavorite, isFavorite } = useArcadeState();
  const active = isFavorite(slug);

  const handleHeartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite({ slug, title, category: genre, thumb: imageUrl });
  };

  return (
    <article 
      className={cn(
        "group relative w-full overflow-hidden bg-[#140A2E] border-2 border-[#1B123D] cursor-pointer transition-all duration-300",
        "hover:border-neon-cyan hover:scale-105 hover:z-20 shadow-[4px_4px_0_0_#000] flex flex-col focus-within:ring-4 focus-within:ring-neon-cyan",
        className
      )}
      title={title}
    >
      <div className="relative w-full aspect-[4/3] overflow-hidden bg-black">
        <Image 
          src={imageUrl || 'https://picsum.photos/seed/yorigame/600/400'} 
          alt={`Play ${title}`}
          fill
          unoptimized={true}
          className="object-cover transition-transform duration-500 group-hover:brightness-110"
          sizes="(max-width: 640px) 33vw, (max-width: 768px) 25vw, (max-width: 1024px) 16vw, 12vw"
          loading="lazy"
        />
        
        {/* Heart Toggle Badge */}
        <button 
          onClick={handleHeartClick}
          className={cn(
            "absolute top-1.5 right-1.5 z-30 p-1.5 rounded-full transition-all duration-300 transform active:scale-75",
            active 
              ? "bg-neon-pink text-white shadow-[0_0_10px_#ec4899] scale-110" 
              : "bg-black/40 text-white/60 hover:bg-black/60 hover:text-white"
          )}
          aria-label={active ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart className={cn("w-3 h-3 sm:w-3.5 sm:h-3.5", active && "fill-current")} />
        </button>

        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" aria-hidden="true" />
        
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="bg-neon-cyan p-2 border-2 border-black shadow-[2px_2px_0_0_#000] transform scale-0 group-hover:scale-100 transition-transform duration-300">
            <Play className="w-4 h-4 text-black fill-black" aria-hidden="true" />
          </div>
        </div>
      </div>

      <div className="absolute top-0 left-0 w-1 h-1 bg-white/10" aria-hidden="true" />
      <div className="absolute top-0 right-0 w-1 h-1 bg-white/10" aria-hidden="true" />
    </article>
  );
};

export const GameCard = memo(GameCardComponent);
