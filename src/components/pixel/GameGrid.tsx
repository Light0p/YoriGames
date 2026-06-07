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
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 sm:gap-6 md:gap-8">
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