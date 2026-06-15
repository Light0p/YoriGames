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
    <div ref={containerRef} className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 sm:gap-3">
      {games.map((game) => (
        <Link 
          key={game.id} 
          href={`/games/${game.slug}`} 
          className="block focus:outline-none focus-visible:ring-4 focus-visible:ring-neon-cyan"
          aria-label={`Play ${game.title} - ${game.category} game`}
        >
          <GameCard 
            slug={game.slug}
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
