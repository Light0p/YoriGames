import React from 'react';
import { Metadata } from 'next';
import { SpaceBackground } from '@/components/layout/SpaceBackground';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { GameGrid } from '@/components/pixel/GameGrid';
import { getPaginatedGames } from '@/lib/games';

export const metadata: Metadata = {
  title: 'All Games | YoriGames Arcade',
  description: 'Browse our complete library of premium pixel-art arcade games. Play instantly in your browser.',
  alternates: {
    canonical: '/arcade',
  },
};

export default async function ArcadePage() {
  // Use the standardized data layer instead of direct import
  const { games } = await getPaginatedGames(1, 50);

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

        <GameGrid games={games} />
      </div>

      <Footer />
    </main>
  );
}
