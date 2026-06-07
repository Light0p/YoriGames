
import React from 'react';
import { SpaceBackground } from '@/components/layout/SpaceBackground';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { GameCard } from '@/components/pixel/GameCard';
import gamesData from '@/data/games.json';
import { Game } from '@/types/game';

export const metadata = {
  title: 'All Games | YoriGames Arcade',
  description: 'Browse our complete library of premium pixel-art arcade games. Play instantly in your browser.',
};

export default function ArcadePage() {
  const games: Game[] = gamesData;

  return (
    <main className="min-h-screen">
      <SpaceBackground />
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-8">
        <div className="mb-12">
          <div className="font-pixel text-[8px] text-neon-purple uppercase tracking-[0.2em] mb-4">LIBRARY</div>
          <h1 className="font-pixel text-4xl text-white uppercase mb-4">The Arcade</h1>
          <p className="font-body text-muted max-w-2xl">
            Explore our curated selection of high-quality indie pixel games. 
            From cosmic runners to cyberpunk adventures, we have something for every player.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {games.map((game) => (
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

      <Footer />
    </main>
  );
}

import Link from 'next/link';
