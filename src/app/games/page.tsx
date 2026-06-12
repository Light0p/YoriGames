import React from 'react';
import { Metadata } from 'next';
import { SpaceBackground } from '@/components/layout/SpaceBackground';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { GameGrid } from '@/components/pixel/GameGrid';
import { getPaginatedGames } from '@/lib/games';
import { Pagination } from '@/components/pixel/Pagination';

interface Props {
  // 🛡️ Added string[] support in case URL gets weird (e.g. ?page=1&page=2)
  searchParams: Promise<{ page?: string | string[] }>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const resolvedParams = await searchParams;
  const pageStr = Array.isArray(resolvedParams?.page) ? resolvedParams.page[0] : resolvedParams?.page;
  const page = pageStr ? ` - Page ${pageStr}` : '';
  
  return {
    title: `All Games${page} | YoriGames Arcade`,
    description: `Browse our complete library of premium pixel-art arcade games. Play instantly in your browser. Currently on page ${pageStr || '1'}.`,
    alternates: {
      canonical: '/games',
    },
  };
}

export default async function GamesPage({ searchParams }: Props) {
  // 1. Safely parse the page parameter
  const resolvedParams = await searchParams;
  const pageParam = Array.isArray(resolvedParams?.page) ? resolvedParams.page[0] : resolvedParams?.page;
  const currentPage = Math.max(1, parseInt(pageParam || '1', 10) || 1);
  const pageSize = 24;

  try {
    // 2. Fetch games with defensive fallbacks in case DB fails
    const data = await getPaginatedGames(currentPage, pageSize);
    const games = data?.games || [];
    const total = data?.total || 0;

    // 3. 🚨 THE FIX: Sync frontend pages with our Backend Safety Cap (Max 20)
    const actualTotalPages = Math.ceil(total / pageSize);
    const totalPages = Math.min(actualTotalPages, 20); // Stops at 20!

    // 4. Calculate ranges safely
    const startRange = total > 0 ? (currentPage - 1) * pageSize + 1 : 0;
    // Don't show more than 480 (20*24) as the end range
    const maxAllowedGames = 20 * pageSize;
    const endRange = Math.min(currentPage * pageSize, total, maxAllowedGames);

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
                From cosmic runners to cyberpunk adventures, we have something for every player.
              </p>
            </div>
            <div className="bg-[#140A2E] border-2 border-[#1B123D] px-4 py-2 font-pixel text-[8px] text-muted uppercase">
              Showing <span className="text-white">{startRange}-{endRange}</span> of <span className="text-white">{total.toLocaleString()}</span> Games
            </div>
          </div>

          {/* Fallback agar list khali ho */}
          {games.length === 0 ? (
            <div className="text-center py-20 text-muted font-pixel">
              No games found in this quadrant of space.
            </div>
          ) : (
            <GameGrid games={games} />
          )}

          {/* 🛡️ Pagination tabhi dikhao jab 1 se zyada page hon */}
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
  } catch (error) {
    console.error("Failed to load games library:", error);
    // Yeh specifically aapke custom error boundary ko trigger karega properly
    throw new Error("Cosmic DB Failure"); 
  }
}

export const dynamic = 'force-dynamic';