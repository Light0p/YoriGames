"use client"

import React from 'react';
import { GameCard } from '@/components/pixel/GameCard';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface GameStripProps {
  title: string;
  category?: string;
  games?: any[];
  viewAllHref?: string;
}

export const GameStrip = ({ title, category = "FEATURED", games = [], viewAllHref = "/games" }: GameStripProps) => {
  return (
    <div className="w-full py-16 px-6 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-end justify-between mb-12">
          <div className="flex-1">
            <div className="font-pixel text-[8px] text-neon-pink uppercase tracking-[0.2em] mb-4">{category}</div>
            <h2 className="font-pixel text-xl sm:text-3xl text-white uppercase flex items-center gap-6">
              {title}
              <div className="hidden sm:block h-[2px] flex-1 bg-gradient-to-r from-[#1B123D] to-transparent" />
            </h2>
          </div>
          <Link href={viewAllHref} className="flex items-center gap-3 font-pixel text-[10px] text-muted hover:text-white transition-colors uppercase group pb-1">
            Browse All <ChevronRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 sm:gap-3">
          {games.map((game: any) => (
            <Link key={game.id} href={`/games/${game.slug}`} className="block">
              <GameCard 
                title={game.title}
                genre={game.category}
                rating={game.rating}
                imageUrl={game.thumbnail || game.thumb}
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
