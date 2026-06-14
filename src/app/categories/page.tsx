"use client";

import React, { useMemo, Suspense } from 'react';
import { SpaceBackground } from '@/components/layout/SpaceBackground';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { GameCard } from '@/components/pixel/GameCard';
import { useGameStore } from '@/context/GameContext';
import { useSearchParams, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Rocket } from 'lucide-react';
import { Pagination } from '@/components/pixel/Pagination';
import Link from 'next/link';
import Image from 'next/image';

/**
 * Helper to map category names to representative images
 */
const getCategoryThumb = (category: string) => {
  const cat = category.toLowerCase();
  if (cat === 'all') return { url: 'https://picsum.photos/seed/yori-all/400/250', hint: 'arcade games' };
  if (cat.includes('race') || cat.includes('car')) return { url: 'https://picsum.photos/seed/yori-race/400/250', hint: 'racing cars' };
  if (cat.includes('sport') || cat.includes('ball')) return { url: 'https://picsum.photos/seed/yori-sports/400/250', hint: 'sports pixels' };
  if (cat.includes('action') || cat.includes('shoot')) return { url: 'https://picsum.photos/seed/yori-action/400/250', hint: 'action combat' };
  if (cat.includes('adventure') || cat.includes('quest')) return { url: 'https://picsum.photos/seed/yori-adv/400/250', hint: 'adventure pixel' };
  if (cat.includes('io') || cat.includes('multi')) return { url: 'https://picsum.photos/seed/yori-io/400/250', hint: 'io games' };
  if (cat.includes('2 player')) return { url: 'https://picsum.photos/seed/yori-2p/400/250', hint: 'multiplayer local' };
  return { url: `https://picsum.photos/seed/yori-${cat}/400/250`, hint: `${cat} game` };
};

const ITEMS_PER_PAGE = 50;

function CategoriesContent() {
  const { allGames, categories, loading } = useGameStore();
  const searchParams = useSearchParams();
  const router = useRouter();

  const activeGenre = searchParams.get('genre') || 'All';
  const pageParam = searchParams.get('page');
  const currentPage = Math.max(1, parseInt(pageParam || '1', 10));

  const filteredGames = useMemo(() => {
    if (activeGenre === 'All') return allGames;
    return allGames.filter(g => g.category === activeGenre);
  }, [allGames, activeGenre]);

  const totalPages = Math.ceil(filteredGames.length / ITEMS_PER_PAGE);

  const currentGames = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredGames.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredGames, currentPage]);

  const handleCategoryClick = (category: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (category === 'All') {
      params.delete('genre');
    } else {
      params.set('genre', category);
    }
    // RESET: Page to 1 on category change
    params.delete('page');
    // FORCE: Disable scroll on router push
    router.push(`/categories?${params.toString()}`, { scroll: false });
  };

  if (loading && allGames.length === 0) {
    return (
      <div className="flex-grow flex items-center justify-center min-h-[50vh]">
        <div className="font-pixel text-[10px] text-neon-purple animate-pulse uppercase">Syncing Sectors...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 sm:px-8 z-10 relative">
      <div className="text-center mb-16">
        <div className="font-pixel text-[8px] text-neon-cyan uppercase tracking-[0.4em] mb-4">SECTOR DIRECTORY</div>
        <h1 className="font-pixel text-3xl sm:text-5xl text-white uppercase tracking-tighter">
          Browse by <span className="text-neon-pink">Category</span>
        </h1>
        <p className="font-body text-muted mt-4 max-w-2xl mx-auto leading-relaxed">
          Select a mission sector to instantly filter the YoriGames archives.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-20">
        {categories.map((cat, i) => {
          const isActive = activeGenre === cat;
          const gameCount = allGames.filter(g => g.category === cat || (cat === 'All')).length;
          const thumb = getCategoryThumb(cat);
          
          return (
            <button
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              className={cn(
                "group relative flex flex-col bg-[#140A2E] border-4 border-[#1B123D] transition-all duration-300",
                "hover:-translate-y-1 hover:border-neon-cyan active:translate-y-0 shadow-[4px_4px_0_0_#000]",
                isActive && "border-neon-cyan ring-2 ring-neon-cyan/20"
              )}
            >
              <div className="relative w-full aspect-[16/10] overflow-hidden bg-black border-b-2 border-[#1B123D]">
                <Image 
                  src={thumb.url}
                  alt={`${cat} Games Sector`}
                  fill
                  className={cn(
                    "object-cover transition-all duration-500 group-hover:scale-110",
                    isActive ? "opacity-100 grayscale-0" : "opacity-40 grayscale group-hover:grayscale-0 group-hover:opacity-80"
                  )}
                  sizes="(max-width: 768px) 50vw, 20vw"
                  loading={i < 6 ? undefined : "lazy"}
                  priority={i < 6}
                  data-ai-hint={thumb.hint}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#140A2E] via-transparent to-transparent opacity-60" />
                {isActive && (
                  <div className="absolute top-2 left-2 w-2 h-2 bg-neon-cyan animate-pulse shadow-[0_0_8px_#22D3EE]" />
                )}
              </div>
              
              <div className="p-4 flex items-center justify-between">
                <h3 className={cn(
                  "font-pixel text-[9px] uppercase tracking-tighter text-left",
                  isActive ? "text-white" : "text-muted group-hover:text-white"
                )}>
                  {cat}
                </h3>
                <span className="font-pixel text-[6px] text-muted-foreground opacity-50 group-hover:opacity-100">
                  {gameCount}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="space-y-12">
        <div className="flex items-center gap-6 border-b-2 border-[#1B123D] pb-6">
          <h2 className="font-pixel text-xl text-white uppercase tracking-tighter">
            {activeGenre} <span className="text-muted-foreground ml-2">[{filteredGames.length}]</span>
          </h2>
          <div className="h-[2px] flex-1 bg-gradient-to-r from-[#1B123D] to-transparent" />
        </div>

        {currentGames.length > 0 ? (
          <>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 sm:gap-3">
              {currentGames.map((game) => (
                <Link key={game.id} href={`/games/${game.slug}`}>
                  <GameCard 
                    title={game.title}
                    genre={game.category}
                    rating={game.rating}
                    imageUrl={game.thumbnail || (game as any).thumb}
                    className="focus-within:ring-neon-cyan"
                  />
                </Link>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-16 flex justify-center">
                <Pagination 
                  currentPage={currentPage} 
                  totalPages={totalPages} 
                  baseUrl="/categories" 
                />
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20 bg-[#140A2E]/50 border-4 border-dashed border-[#1B123D]">
            <Rocket className="w-12 h-12 text-muted mx-auto mb-4 opacity-20" />
            <p className="font-pixel text-[10px] text-muted uppercase">No games detected in this quadrant.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CategoriesPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <SpaceBackground />
      <Navbar />
      <Suspense fallback={
        <div className="flex-grow flex items-center justify-center min-h-[50vh]">
          <div className="font-pixel text-[10px] text-neon-purple animate-pulse uppercase">Loading Sector Data...</div>
        </div>
      }>
        <CategoriesContent />
      </Suspense>
      <Footer />
    </main>
  );
}
