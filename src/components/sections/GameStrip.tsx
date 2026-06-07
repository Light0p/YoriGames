"use client"

import React from 'react';
import { GameCard } from '@/components/pixel/GameCard';
import { ChevronRight } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

interface GameStripProps {
  title: string;
  category?: string;
}

export const GameStrip = ({ title, category = "FEATURED" }: GameStripProps) => {
  // Mock data for display
  const games = [
    { title: "Star Dash", genre: "Arcade", rating: 4.8, img: PlaceHolderImages[0].imageUrl },
    { title: "Neon City", genre: "Runner", rating: 4.5, img: PlaceHolderImages[1].imageUrl },
    { title: "Cosmo Quest", genre: "Platformer", rating: 4.9, img: PlaceHolderImages[2].imageUrl },
    { title: "Cyber Punks", genre: "Action", rating: 4.2, img: PlaceHolderImages[3].imageUrl },
    { title: "Ocean Deep", genre: "Exploration", rating: 4.7, img: PlaceHolderImages[4].imageUrl },
  ];

  return (
    <div className="w-full py-12 px-4 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="font-pixel text-[8px] text-neon-pink uppercase tracking-[0.2em] mb-2">{category}</div>
            <h2 className="font-pixel text-2xl text-white uppercase flex items-center gap-3">
              {title}
              <div className="h-1 flex-1 min-w-[50px] bg-gradient-to-r from-neon-purple to-transparent opacity-30" />
            </h2>
          </div>
          <button className="flex items-center gap-2 font-pixel text-[10px] text-muted hover:text-neon-cyan transition-colors uppercase group">
            See All <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {games.map((game, i) => (
            <GameCard 
              key={i}
              title={game.title}
              genre={game.genre}
              rating={game.rating}
              imageUrl={game.img}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
