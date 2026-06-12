import React from 'react';
import { Metadata } from 'next';
import { SpaceBackground } from '@/components/layout/SpaceBackground';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { GameGrid } from '@/components/pixel/GameGrid';
import { getPaginatedGames } from '@/lib/games';
import { Pagination } from '@/components/pixel/Pagination';
import { AlertCircle, Terminal } from 'lucide-react';

interface Props {
  searchParams: Promise<{ page?: string | string[] }>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const resolvedParams = await searchParams;
  const pageStr = Array.isArray(resolvedParams?.page) ? resolvedParams.page[0] : resolvedParams?.page;
  const page = pageStr ? ` - Page ${pageStr}` : '';
  
  return {
    title: `All Games${page} | YoriGames Arcade`,
    description: `Browse our complete library of premium pixel-art arcade games. Currently on page ${pageStr || '1'}.`,
    alternates: {
      canonical: '/games',
    },
  };
}

export default async function GamesPage({ searchParams }: Props) {
  const resolvedParams = await searchParams;
  const pageParam = Array.isArray(resolvedParams?.page) ? resolvedParams.page[0] : resolvedParams?.page;
  const currentPage = Math.max(1, parseInt(pageParam || '1', 10) || 1);
  const pageSize = 24;

  try {
    const data = await getPaginatedGames(currentPage, pageSize);
    const games = data?.games || [];
    const total = data?.total || 0;

    const actualTotalPages = Math.ceil(total / pageSize);
    const totalPages = Math.min(actualTotalPages, 20); 

    const startRange = total > 0 ? (currentPage - 1) * pageSize + 1 : 0;
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
  } catch (error) {
    console.error("Critical failure in library sector:", error);
    return (
      <main className="min-h-screen flex flex-col">
        <SpaceBackground />
        <Navbar />
        <div className="flex-grow flex items-center justify-center p-8">
          <div className="max-w-md w-full bg-destructive/10 border-4 border-destructive p-8 text-center shadow-[8px_8px_0_0_#000]">
            <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-6" />
            <h2 className="font-pixel text-xl text-white uppercase mb-4">SYSTEM OFFLINE</h2>
            <p className="font-body text-sm text-muted leading-relaxed uppercase mb-8">
              The orbital database is currently unreachable due to high traffic or quota limits. Please return later.
            </p>
            <div className="font-pixel text-[8px] text-destructive opacity-50">ERROR_CODE: FIREBASE_QUOTA_EXCEEDED</div>
          </div>
        </div>
        <Footer />
      </main>
    );
  }
}

export const revalidate = 3600;
export const dynamic = 'force-static';