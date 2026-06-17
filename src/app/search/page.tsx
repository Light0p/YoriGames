import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { SpaceBackground } from '@/components/layout/SpaceBackground';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SearchContent } from './SearchContent';
import { Loader2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Search Universe | YoriGames',
  description: 'Search for your favorite indie pixel art games.',
};

export default function SearchPage() {
  return (
    <main className="min-h-screen w-full overflow-x-hidden">
      <SpaceBackground />
      <Navbar />
      
      {/* PHASE 2 CRITICAL: Suspense boundary for useSearchParams in static export */}
      <Suspense fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="w-12 h-12 text-neon-purple animate-spin" />
        </div>
      }>
        <SearchContent />
      </Suspense>

      <Footer />
    </main>
  );
}