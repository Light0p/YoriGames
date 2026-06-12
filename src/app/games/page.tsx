import React from 'react';
import { Metadata } from 'next';
import { SpaceBackground } from '@/components/layout/SpaceBackground';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { GameGrid } from '@/components/pixel/GameGrid';
import { getPaginatedGames } from '@/lib/games';
import { Pagination } from '@/components/pixel/Pagination';

interface Props {
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { page: pageStr } = await searchParams;
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
  const { page: pageStr } = await searchParams;
  const currentPage = Math.max(1, parseInt(pageStr || '1', 10));
  const pageSize = 24;

  const { games, total } = await getPaginatedGames(currentPage, pageSize);
  const totalPages = Math.ceil(total / pageSize);

  const startRange = total > 0 ? (currentPage - 1) * pageSize + 1 : 0;
  const endRange = Math.min(currentPage * pageSize, total);

  return (
    <main className="min-h-screen">
      <SpaceBackground />
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-8">
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

        <GameGrid games={games} />

        <Pagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          baseUrl="/games" 
        />
      </div>

      <Footer />
    </main>
  );
}

export const dynamic = 'force-dynamic';