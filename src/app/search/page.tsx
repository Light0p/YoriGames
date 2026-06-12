import React from 'react';
import { Metadata } from 'next';
import { SpaceBackground } from '@/components/layout/SpaceBackground';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { getSearchableGames } from '@/lib/games';
import { SearchContent } from './SearchContent';

export const metadata: Metadata = {
  title: 'Search Universe | YoriGames',
  description: 'Search for your favorite indie pixel art games.',
};

export default async function SearchPage() {
  // Fetch searchable games once on the server (ISR) to save quota
  const allGames = await getSearchableGames(1000);

  return (
    <main className="min-h-screen w-full overflow-x-hidden">
      <SpaceBackground />
      <Navbar />
      <SearchContent initialGames={allGames} />
      <Footer />
    </main>
  );
}

export const revalidate = 3600;