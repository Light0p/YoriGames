import React from 'react';
import { Metadata } from 'next';
import { SpaceBackground } from '@/components/layout/SpaceBackground';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SearchContent } from './SearchContent';

export const metadata: Metadata = {
  title: 'Search Universe | YoriGames',
  description: 'Search for your favorite indie pixel art games.',
};

export default function SearchPage() {
  return (
    <main className="min-h-screen w-full overflow-x-hidden">
      <SpaceBackground />
      <Navbar />
      <SearchContent />
      <Footer />
    </main>
  );
}
