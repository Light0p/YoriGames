
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
          <Link href="/arcade" className="flex items-center gap-2 font-pixel text-[10px] text-muted hover:text-neon-cyan transition-colors uppercase group">
            See All <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {games.map((game: any) => (
            <Link key={game.id} href={`/games/${game.slug}`}>
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
