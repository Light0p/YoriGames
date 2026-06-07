"use client"

import React from 'react';
import Link from 'next/link';
import { GameCard } from './GameCard';
import { Game } from '@/types/game';

interface GameGridProps {
  games: Game[];
}

export const GameGrid = ({ games }: GameGridProps) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-6">
      {games.map((game) => (
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
  );
};
