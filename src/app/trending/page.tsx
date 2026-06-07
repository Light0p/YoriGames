
import React from 'react';
import { SpaceBackground } from '@/components/layout/SpaceBackground';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { GameGrid } from '@/components/pixel/GameGrid';
import gamesData from '@/data/games.json';
import { Game } from '@/types/game';
import { TrendingUp } from 'lucide-react';

export const metadata = {
  title: 'Trending Games | YoriGames',
  description: 'Check out the hottest pixel-art games trending right now on YoriGames.',
};

export default function TrendingPage() {
  const trendingGames: Game[] = gamesData.filter(g => g.trending);

  return (
    <main className="min-h-screen">
      <SpaceBackground />
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-8">
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="font-pixel text-[8px] text-neon-pink uppercase tracking-[0.2em] mb-4">HOT RIGHT NOW</div>
            <h1 className="font-pixel text-4xl text-white uppercase mb-4 flex items-center gap-4">
              Trending <TrendingUp className="w-8 h-8 text-neon-pink" />
            </h1>
            <p className="font-body text-muted max-w-2xl">
              The games that the community is playing the most. Updated in real-time.
            </p>
          </div>
        </div>

        <GameGrid games={trendingGames} />
      </div>

      <Footer />
    </main>
  );
}
