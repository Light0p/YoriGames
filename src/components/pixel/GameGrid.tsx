"use client"

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { GameCard } from './GameCard';
import { Game } from '@/types/game';

interface GameGridProps {
  games: Game[];
}

export const GameGrid = ({ games }: GameGridProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const page = searchParams.get('page');

  // Smooth scroll to top of grid when page changes
  useEffect(() => {
    if (page && containerRef.current) {
      const offset = 120; // Room for fixed navbar
      const elementPosition = containerRef.current.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth'
      });
    }
  }, [page]);

  return (
    <div ref={containerRef} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
      {games.map((game) => (
        <Link 
          key={game.id} 
          href={`/games/${game.slug}`} 
          className="block focus:outline-none focus:ring-2 focus:ring-neon-purple focus:ring-offset-2 focus:ring-offset-[#09061B]"
          aria-label={`View details for ${game.title}`}
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
