"use client"

import React, { useRef } from 'react';
import Link from 'next/link';
import { GameCard } from './GameCard';
import { Game } from '@/types/game';

interface GameGridProps {
  games: Game[];
}

export const GameGrid = ({ games }: GameGridProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-8 gap-2">
      {games.map((game) => (
        <Link 
          key={game.id} 
          href={`/games/${game.slug}`} 
          className="block focus:outline-none focus-visible:ring-4 focus-visible:ring-neon-cyan"
          aria-label={`Play ${game.title} - ${game.category} game`}
        >
          <GameCard 
            title={game.title}
            genre={game.category}
            rating={game.rating}
            imageUrl={game.thumbnail || (game as any).thumb}
          />
        </Link>
      ))}
    </div>
  );
};
