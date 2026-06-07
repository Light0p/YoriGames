"use client"

import React from 'react';
import Image from 'next/image';
import { Star, Play } from 'lucide-react';

interface GameCardProps {
  title: string;
  genre: string;
  rating: number;
  imageUrl: string;
}

export const GameCard = ({ title, genre, rating, imageUrl }: GameCardProps) => {
  return (
    <div className="group relative w-full aspect-[4/5] overflow-hidden bg-[#1B123D] border-4 border-[#140A2E] cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:border-neon-purple hover:shadow-[0_0_20px_rgba(168,85,247,0.4)]">
      {/* Game Image */}
      <div className="relative h-2/3 w-full overflow-hidden">
        <Image 
          src={imageUrl} 
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1B123D] to-transparent opacity-60" />
        
        {/* Play Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-neon-pink p-3 border-4 border-black transform translate-y-4 group-hover:translate-y-0 transition-transform">
            <Play className="w-6 h-6 text-white fill-white" />
          </div>
        </div>
      </div>

      {/* Game Info */}
      <div className="p-4 flex flex-col justify-between h-1/3">
        <div>
          <h3 className="font-headline text-lg leading-tight truncate group-hover:text-neon-cyan transition-colors">
            {title}
          </h3>
          <p className="text-[10px] font-pixel text-muted uppercase mt-1">
            {genre}
          </p>
        </div>
        
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 text-neon-gold fill-neon-gold" />
            <span className="text-xs font-pixel text-neon-gold">{rating.toFixed(1)}</span>
          </div>
          <div className="w-2 h-2 bg-neon-purple animate-pulse rounded-full shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
        </div>
      </div>

      {/* Cartridge Style Ribs */}
      <div className="absolute left-1 top-4 flex flex-col gap-1">
        {[1,2,3].map(i => <div key={i} className="w-1.5 h-1 bg-white/10" />)}
      </div>
    </div>
  );
};
