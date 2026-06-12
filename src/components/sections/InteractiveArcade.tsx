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
        <Loader2 className="w-8 h-8 text-neon-cyan animate-spin mx-auto mb-4" />
        <p className="font-pixel text-[8px] text-muted uppercase">Scanning Arcade Nodes...</p>
      </div>
    );
  }

  return (
    <section id="categories" className="py-16 sm:py-24 px-4 sm:px-8 bg-[#0D0925]/50 border-y border-[#1B123D]">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-12 sm:mb-16">
          <div className="font-pixel text-[6px] sm:text-[8px] text-neon-cyan uppercase mb-4 tracking-[0.3em] sm:tracking-[0.4em]">EXPLORE SECTORS</div>
          <h2 className="font-pixel text-xl sm:text-3xl text-white uppercase tracking-tighter">Browse by Category</h2>
          <p className="font-body text-xs sm:text-base text-muted mt-4 max-w-2xl mx-auto leading-relaxed">
            Choose a genre to instantly filter through our indie collection.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-12 sm:mb-16">
          <button
            onClick={() => handleCategoryChange('All')}
            className={cn(
              "px-4 py-2.5 sm:px-6 sm:py-3 font-pixel text-[6px] sm:text-[8px] uppercase tracking-widest border-2 transition-all active:scale-95",
              activeCategory === 'All' 
                ? "bg-neon-cyan border-neon-cyan text-black shadow-[4px_4px_0_0_#000]"
                : "bg-[#140A2E] border-[#1B123D] text-muted hover:border-neon-cyan hover:text-white"
            )}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={cn(
                "px-4 py-2.5 sm:px-6 sm:py-3 font-pixel text-[6px] sm:text-[8px] uppercase tracking-widest border-2 transition-all active:scale-95",
                activeCategory === cat 
                  ? "bg-neon-cyan border-neon-cyan text-black shadow-[4px_4px_0_0_#000]"
                  : "bg-[#140A2E] border-[#1B123D] text-muted hover:border-neon-cyan hover:text-white"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {currentGames.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mb-12 sm:mb-16">
            {currentGames.map((game) => (
              <Link key={game.id} href={`/games/${game.slug}`} className="block">
                <GameCard 
                  title={game.title}
                  genre={game.category}
                  rating={game.rating}
                  imageUrl={game.thumbnail}
                />
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 sm:py-24 border-2 border-dashed border-[#1B123D] mx-4">
            <Gamepad2 className="w-10 h-10 sm:w-12 sm:h-12 text-muted mx-auto mb-4 opacity-20" />
            <p className="font-pixel text-[8px] sm:text-[10px] text-muted uppercase tracking-widest">No signals found in this quadrant.</p>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
            <div className="flex items-center gap-4">
              <PixelButton 
                variant="secondary" 
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              >
                <ChevronLeft className="w-4 h-4" /> PREV
              </PixelButton>
              
              <div className="font-pixel text-[8px] sm:text-[10px] text-white whitespace-nowrap">
                PAGE <span className="text-neon-cyan">{currentPage}</span> / {totalPages}
              </div>

              <PixelButton 
                variant="secondary" 
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
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
