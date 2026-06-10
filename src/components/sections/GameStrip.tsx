"use client"

import React from 'react';
import { GameCard } from '@/components/pixel/GameCard';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Game } from '@/types/game';

interface GameStripProps {
  title: string;
  category?: string;
  games?: any[];
}

export const GameStrip = ({ title, category = "FEATURED", games = [] }: GameStripProps) => {
  return (
    <div className="w-full py-12 px-6 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-end justify-between mb-10">
          <div className="flex-1">
            <div className="font-pixel text-[8px] text-neon-pink uppercase tracking-[0.2em] mb-3">{category}</div>
            <h2 className="font-pixel text-xl sm:text-2xl text-white uppercase flex items-center gap-4">
              {title}
              <div className="hidden sm:block h-[1px] flex-1 bg-gradient-to-r from-[#1B123D] to-transparent" />
            </h2>
          </div>
          <Link href="/games" className="flex items-center gap-2 font-pixel text-[9px] text-muted hover:text-white transition-colors uppercase group pb-1">
            Browse All <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {games.map((game: any) => (
            <Link key={game.id} href={`/games/${game.slug}`} className="block">
              <GameCard 
                title={game.title}
                genre={game.category}
                rating={game.rating}
                imageUrl={game.thumbnail}
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
