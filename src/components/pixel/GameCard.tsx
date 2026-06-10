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
    <article className="group relative w-full overflow-hidden bg-[#140A2E] border-2 border-[#1B123D] cursor-pointer transition-all duration-300 hover:border-neon-purple hover:-translate-y-1">
      {/* Game Image */}
      <div className="relative aspect-video w-full overflow-hidden bg-[#09061B]">
        <Image 
          src={imageUrl} 
          alt={title}
          fill
          loading="lazy"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#140A2E] via-transparent to-transparent opacity-40" />
        
        {/* Play Icon */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="bg-neon-pink p-2 border-2 border-black transform translate-y-2 group-hover:translate-y-0 transition-transform">
            <Play className="w-5 h-5 text-white fill-white" />
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="font-headline text-base leading-tight truncate group-hover:text-neon-cyan transition-colors mb-1">
          {title}
        </h3>
        <div className="flex items-center justify-between mt-2">
          <span className="text-[8px] font-pixel text-muted uppercase tracking-widest truncate max-w-[70%]">
            {genre}
          </span>
          <div className="flex items-center gap-1">
            <Star className="w-2.5 h-2.5 text-neon-gold fill-neon-gold" />
            <span className="text-[8px] font-pixel text-neon-gold">{rating.toFixed(1)}</span>
          </div>
        </div>
      </div>
    </article>
  );
};

export const GameCard = memo(GameCardComponent);
