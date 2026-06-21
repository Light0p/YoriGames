"use client"

import React from 'react';
import Link from 'next/link';
import { GameCard } from './GameCard';
import { LazyGrid } from './LazyGrid';
import { Game } from '@/types/game';

interface GameGridProps {
  games: Game[];
}

export const GameGrid = ({ games }: GameGridProps) => {
  return (
    <LazyGrid
      items={games}
      getKey={(game) => game.id || game.slug}
      className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 sm:gap-3"
      renderItem={(game) => (
        <Link
          href={`/games/${game.slug}/`}
          className="block focus:outline-none focus-visible:ring-4 focus-visible:ring-neon-cyan"
          aria-label={`Play ${game.title} - ${game.category} game`}
        >
          <GameCard
            slug={game.slug}
            title={game.title}
            genre={game.category}
            rating={game.rating}
            imageUrl={game.thumbnail || game.thumb || ''}
          />
        </Link>
      )}
    />
  );
};
