import React from 'react';
import { Metadata } from 'next';
import { SpaceBackground } from '@/components/layout/SpaceBackground';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { GameGrid } from '@/components/pixel/GameGrid';
import { getPaginatedGamesByCategory } from '@/lib/games';
import { Pagination } from '@/components/pixel/Pagination';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { page: pageStr } = await searchParams;
  const categoryName = slug.charAt(0).toUpperCase() + slug.slice(1);
  const page = pageStr ? ` - Page ${pageStr}` : '';
  
  return {
    title: `${categoryName} Games${page} | YoriGames`,
    description: `Browse the best ${categoryName} pixel-art games on YoriGames. Play instantly in your browser. Page ${pageStr || '1'}.`,
    alternates: {
      canonical: `/categories/${slug}`,
    },
  };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { page: pageStr } = await searchParams;
  const decodedSlug = decodeURIComponent(slug).toLowerCase();
  
  const currentPage = Math.max(1, parseInt(pageStr || '1', 10));
  const pageSize = 24;

  const { games, total } = await getPaginatedGamesByCategory(decodedSlug, currentPage, pageSize);
  
  // Calculate ranges and handle cases where no games are found
  const totalPages = Math.ceil(total / pageSize);
  const categoryName = games[0]?.category || slug.charAt(0).toUpperCase() + slug.slice(1);
  const startRange = total > 0 ? (currentPage - 1) * pageSize + 1 : 0;
  const endRange = Math.min(currentPage * pageSize, total);

  return (
    <main className="min-h-screen">
      <SpaceBackground />
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-8">
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex-1">
            <div className="font-pixel text-[8px] text-neon-cyan uppercase tracking-[0.2em] mb-4">CATEGORY</div>
            <h1 className="font-pixel text-4xl text-white uppercase mb-4">{categoryName}</h1>
            <p className="font-body text-muted max-w-2xl">
              Check out all our premium games in the {categoryName} genre.
            </p>
          </div>
          <div className="bg-[#140A2E] border-2 border-[#1B123D] px-4 py-2 font-pixel text-[8px] text-muted uppercase">
            Showing <span className="text-white">{startRange}-{endRange}</span> of <span className="text-white">{total.toLocaleString()}</span> Games
          </div>
        </div>

        {games.length === 0 ? (
          <div className="text-center py-20 text-muted font-pixel">
            No games found in this quadrant of space.
          </div>
        ) : (
          <GameGrid games={games} />
        )}

        <Pagination 
          currentPage={currentPage} 
          totalPages={Math.min(totalPages, 20)} 
          baseUrl={`/categories/${slug}`} 
        />
      </div>

      <Footer />
    </main>
  );
}

// 🚀 REVALIDATION: Category pages revalidate once per hour
export const revalidate = 3600;