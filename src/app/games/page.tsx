export const dynamic = 'force-static';

import React from 'react';
import { Metadata } from 'next';
import { SpaceBackground } from '@/components/layout/SpaceBackground';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { getSearchableGames } from '@/lib/games';
import GamesPageClient from './GamesPageClient';

export const metadata: Metadata = {
  title: 'All Games | YoriGames Arcade',
  description: 'Browse our complete library of premium pixel-art arcade games. Play instantly in your browser.',
};

/**
 * GamesPage Server Component
 * Converted to force-static for build-time generation.
 * Fetches all games and passes them to the Client Component for local pagination.
 */
export default async function GamesPage() {
  // Fetch all games data at build time
  const games = await getSearchableGames(5000);

  return (
    <main className="min-h-screen flex flex-col">
      <SpaceBackground />
      <Navbar />
      
      <GamesPageClient games={games} />

      <Footer />
    </main>
  );
}
