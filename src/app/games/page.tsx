import React from 'react';
import { Metadata } from 'next';
import { SpaceBackground } from '@/components/layout/SpaceBackground';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { GameGrid } from '@/components/pixel/GameGrid';
import { getPaginatedGames } from '@/lib/games';
import { Pagination } from '@/components/pixel/Pagination';
import { Terminal } from 'lucide-react';

export const metadata: Metadata = {
  title: 'All Games | YoriGames Arcade',
  description: 'Browse our complete library of premium pixel-art arcade games. Play instantly in your browser.',
};

interface Props {
  searchParams: Promise<{ page?: string }>;
}

/**
 * GamesPage Server Component
 * Implements Server-Side Pagination to avoid client-side memory bloat.
 * Only the required 50 games are fetched and sent to the browser.
 */
export default async function GamesPage({ searchParams }: Props) {
  const { page: pageStr } = await searchParams;
  const currentPage = Math.max(1, parseInt(pageStr || '1', 10));
  const pageSize = 50;

  // Optimized fetch: Only retrieves the required slice from the server data layer
  const { games, total } = await getPaginatedGames(currentPage, pageSize);
  const totalPages = Math.ceil(total / pageSize);
  
  const startRange = total > 0 ? (currentPage - 1) * pageSize + 1 : 0;
  const endRange = Math.min(currentPage * pageSize, total);

  return (
    <main className="min-h-screen flex flex-col">
      <SpaceBackground />
      <Navbar />
      
      <div className="flex-grow max-w-7xl w-full mx-auto px-4 py-16 sm:px-8 z-10 relative">
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex-1">
            <div className="font-pixel text-[8px] text-neon-purple uppercase tracking-[0.2em] mb-4">LIBRARY</div>
            <h1 className="font-pixel text-4xl text-white uppercase mb-4">The Arcade</h1>
            <p className="font-body text-muted max-w-2xl">
              Explore our curated selection of high-quality indie pixel games. 
              Instant play, zero downloads.
            </p>
          </div>
          <div className="bg-[#140A2E] border-2 border-[#1B123D] px-4 py-2 font-pixel text-[8px] text-muted uppercase">
            Showing <span className="text-white">{startRange}-{endRange}</span> of <span className="text-white">{total.toLocaleString()}</span> Games
          </div>
        </div>

        {games.length === 0 ? (
          <div className="text-center py-32 bg-[#140A2E]/50 border-4 border-dashed border-[#1B123D]">
            <Terminal className="w-16 h-16 text-muted mx-auto mb-6 opacity-20" />
            <p className="font-pixel text-xs text-muted uppercase tracking-[0.2em]">No games detected in this sector.</p>
          </div>
        ) : (
          <GameGrid games={games} />
        )}

        {totalPages > 1 && (
          <div className="mt-16 flex justify-center">
            <Pagination 
              currentPage={currentPage} 
              totalPages={totalPages} 
              baseUrl="/games" 
            />
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}

export const revalidate = 3600;
