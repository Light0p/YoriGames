"use client"

import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { LazyGrid } from '@/components/pixel/LazyGrid';
import { GameCard } from '@/components/pixel/GameCard';
import { Search, Gamepad2, Loader2, Sparkles, Hash, ChevronLeft, ChevronRight } from 'lucide-react';
import { useGameStore } from '@/context/GameContext';
import Link from 'next/link';
import Fuse from 'fuse.js';
import { cn } from '@/lib/utils';

export function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const { allGames, loading } = useGameStore();
  
  const [query, setQuery] = useState(initialQuery);
  const [currentPage, setCurrentPage] = useState(1);
  const gamesPerPage = 36;

  // Phase 2: High-performance fuzzy search configuration
  const fuse = useMemo(() => {
    return new Fuse(allGames, {
      keys: ['title', 'category', 'tags'],
      threshold: 0.35,
      minMatchCharLength: 2,
    });
  }, [allGames]);

  // Reset page whenever the URL search param changes
  useEffect(() => {
    setQuery(initialQuery);
    setCurrentPage(1);
  }, [initialQuery]);

  const filteredGames = useMemo(() => {
    if (!query.trim()) return [];
    
    // Check if it's a hashtag search from hashtag navigation
    if (query.startsWith('#')) {
      const tag = query.substring(1).toLowerCase();
      return allGames.filter(g => {
        // Defensive check: Ensure tags is an array
        const gameTags = Array.isArray(g.tags) ? g.tags : [];
        const gameCategory = (g.category || "").toLowerCase();
        return gameTags.some(t => String(t).toLowerCase() === tag) || 
               gameCategory === tag;
      });
    }

    // Standard Fuzzy Search
    const results = fuse.search(query);
    
    // PHASE 2 SAFETY RULE: Unwrap Fuse result safely
    return results.map(r => {
      const actualGame = (r as any).item ? (r as any).item : r;
      return actualGame;
    }).filter(g => !!g.slug);
  }, [query, fuse, allGames]);

  // Pagination Calculations
  const totalPages = Math.ceil(filteredGames.length / gamesPerPage);
  const indexOfLastGame = currentPage * gamesPerPage;
  const indexOfFirstGame = indexOfLastGame - gamesPerPage;
  const currentGames = filteredGames.slice(indexOfFirstGame, indexOfLastGame);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const recommendations = useMemo(() => {
    if (filteredGames.length > 0 || !allGames.length) return [];
    return [...allGames].sort(() => Math.random() - 0.5).slice(0, 16);
  }, [filteredGames, allGames]);

  if (loading && allGames.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center">
        <Loader2 className="w-12 h-12 text-neon-purple animate-spin mx-auto mb-6" />
        <p className="font-pixel text-[10px] text-muted uppercase">Indexing Universal Data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:py-16">
      <div className="relative mb-12 sm:mb-16 max-w-2xl mx-auto">
        <input 
          type="text" 
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setCurrentPage(1); // Reset page on input
          }}
          className="w-full bg-[#140A2E] border-4 border-[#1B123D] px-4 sm:px-12 py-4 sm:py-6 text-white font-headline text-xl sm:text-2xl uppercase focus:outline-none focus:border-neon-purple transition-all shadow-[8px_8px_0_0_#000]"
          placeholder="SEARCH UNIVERSE..."
        />
        <div className="absolute right-4 sm:left-4 top-1/2 -translate-y-1/2 opacity-30">
          {query.startsWith('#') ? <Hash className="w-6 h-6 sm:w-8 sm:h-8 text-neon-cyan" /> : <Search className="w-6 h-6 sm:w-8 sm:h-8 text-muted" />}
        </div>
      </div>

      {query && filteredGames.length > 0 && (
        <>
          <LazyGrid
            items={currentGames}
            getKey={(game, idx) => `${game.id || game.slug}-${idx}`}
            className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 sm:gap-3"
            renderItem={(game) => (
              <Link href={`/games/${game.slug}/`}>
                <GameCard
                  slug={game.slug}
                  title={game.title}
                  genre={game.category}
                  rating={game.rating ?? 5.0}
                  imageUrl={game.thumbnail || game.thumb || ''}
                />
              </Link>
            )}
          />

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-16 flex flex-wrap items-center justify-center gap-2 sm:gap-4">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-3 bg-[#140A2E] border-2 border-[#1B123D] text-white disabled:opacity-30 disabled:cursor-not-allowed hover:border-neon-purple transition-all active:scale-95"
                aria-label="Previous Page"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum = currentPage;
                  if (currentPage <= 3) pageNum = i + 1;
                  else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                  else pageNum = currentPage - 2 + i;

                  if (pageNum < 1 || pageNum > totalPages) return null;

                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={cn(
                        "min-w-[44px] h-11 flex items-center justify-center font-pixel text-[10px] border-2 transition-all active:scale-95",
                        currentPage === pageNum 
                          ? "bg-neon-purple border-neon-purple text-white shadow-[2px_2px_0_0_#000]" 
                          : "bg-[#140A2E] border-[#1B123D] text-muted hover:text-white"
                      )}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-3 bg-[#140A2E] border-2 border-[#1B123D] text-white disabled:opacity-30 disabled:cursor-not-allowed hover:border-neon-purple transition-all active:scale-95"
                aria-label="Next Page"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              <div className="w-full text-center mt-4 font-pixel text-[8px] text-muted-foreground uppercase tracking-widest">
                Sector {currentPage} of {totalPages}
              </div>
            </div>
          )}
        </>
      )}

      {query && filteredGames.length === 0 && (
        <div className="space-y-16">
          <div className="text-center py-20 bg-[#140A2E]/50 border-2 border-dashed border-[#1B123D]">
            <Gamepad2 className="w-16 h-16 text-muted mx-auto mb-4 opacity-30" />
            <p className="font-pixel text-[10px] text-muted uppercase tracking-widest px-4">No signals detected for "{query}"</p>
          </div>

          {recommendations.length > 0 && (
            <section>
              <div className="flex items-center gap-4 mb-8">
                <Sparkles className="w-5 h-5 text-neon-gold" />
                <h2 className="font-pixel text-lg text-white uppercase">Alternative Missions</h2>
              </div>
              <LazyGrid
                items={recommendations}
                getKey={(game, idx) => `${game.id || game.slug}-${idx}`}
                className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 sm:gap-3"
                renderItem={(game) => (
                  <Link href={`/games/${game.slug}/`}>
                    <GameCard
                      slug={game.slug}
                      title={game.title}
                      genre={game.category}
                      rating={game.rating ?? 5.0}
                      imageUrl={game.thumbnail || game.thumb || ''}
                    />
                  </Link>
                )}
              />
            </section>
          )}
        </div>
      )}

      {!query && (
        <div className="text-center py-20">
          <p className="font-pixel text-[10px] text-muted uppercase tracking-widest px-4">Scanning archives by title, category, or tags...</p>
        </div>
      )}
    </div>
  );
}
