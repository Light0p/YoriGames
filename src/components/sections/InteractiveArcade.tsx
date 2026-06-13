"use client"

import React, { useState, useMemo } from 'react';
import { GameCard } from '@/components/pixel/GameCard';
import { PixelButton } from '@/components/pixel/PixelButton';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, Gamepad2, Loader2 } from 'lucide-react';
import { useGameStore } from '@/context/GameContext';
import Link from 'next/link';

const ITEMS_PER_PAGE = 12;

export const InteractiveArcade = () => {
  const { allGames, categories, loading } = useGameStore();
  const [activeCategory, setActiveCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredGames = useMemo(() => {
    if (activeCategory === 'All') return allGames;
    return allGames.filter(game => game.category === activeCategory);
  }, [activeCategory, allGames]);

  const totalPages = Math.ceil(filteredGames.length / ITEMS_PER_PAGE);
  
  const currentGames = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredGames.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredGames, currentPage]);

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setCurrentPage(1);
  };

  if (loading && allGames.length <= 1) {
    return (
      <div className="py-24 text-center px-6">
        <Loader2 className="w-12 h-12 text-neon-cyan animate-spin mx-auto mb-4" />
        <p className="font-pixel text-[10px] text-muted uppercase animate-pulse">Syncing Arcade Floor...</p>
      </div>
    );
  }

  return (
    <section id="categories" className="py-16 sm:py-24 px-4 sm:px-8 bg-[#0D0925]/50 border-y-4 border-[#1B123D]">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-12 sm:mb-20">
          <div className="font-pixel text-[8px] text-neon-cyan uppercase mb-4 tracking-[0.4em]">EXPLORE SECTORS</div>
          <h2 className="font-pixel text-2xl sm:text-4xl text-white uppercase tracking-tighter">Browse by Category</h2>
          <p className="font-body text-sm sm:text-lg text-muted mt-6 max-w-2xl mx-auto leading-relaxed">
            Choose a genre to instantly filter through our high-performance indie collection.
          </p>
        </div>

        {/* Category Filters - Touch targets optimized */}
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-16 sm:mb-20">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={cn(
                "px-5 py-3 sm:px-8 sm:py-4 font-pixel text-[8px] sm:text-[10px] uppercase tracking-widest border-4 transition-all active:scale-95 shadow-[4px_4px_0_0_#000] min-h-[44px]",
                activeCategory === cat 
                  ? "bg-neon-cyan border-white text-black -translate-y-1"
                  : "bg-[#140A2E] border-[#1B123D] text-muted hover:border-neon-cyan hover:text-white"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Optimized Grid System */}
        {currentGames.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-10 mb-16 sm:mb-24">
            {currentGames.map((game) => (
              <Link 
                key={game.id} 
                href={`/games/${game.slug}`} 
                className="block focus:outline-none"
                aria-label={`Play ${game.title}`}
              >
                <GameCard 
                  title={game.title}
                  genre={game.category}
                  rating={game.rating}
                  imageUrl={game.thumbnail || (game as any).thumb}
                />
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 border-4 border-dashed border-[#1B123D] mx-4 bg-[#140A2E]/30">
            <Gamepad2 className="w-16 h-16 text-muted mx-auto mb-6 opacity-20" />
            <p className="font-pixel text-[10px] text-muted uppercase tracking-widest px-4">No data detected in this sector.</p>
          </div>
        )}

        {/* Pagination - Touch Targets >= 44px */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 border-t-2 border-[#1B123D] pt-12">
            <div className="flex items-center gap-4">
              <PixelButton 
                variant="secondary" 
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                className="min-w-[100px]"
              >
                <ChevronLeft className="w-4 h-4" /> PREV
              </PixelButton>
              
              <div className="font-pixel text-[10px] text-white bg-[#140A2E] px-4 py-2 border-2 border-[#1B123D] whitespace-nowrap">
                PAGE <span className="text-neon-cyan">{currentPage}</span> / {totalPages}
              </div>

              <PixelButton 
                variant="secondary" 
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                className="min-w-[100px]"
              >
                NEXT <ChevronRight className="w-4 h-4" />
              </PixelButton>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};