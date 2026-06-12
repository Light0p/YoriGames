"use client"

import React, { useState, useMemo } from 'react';
import { Game } from '@/types/game';
import { GameCard } from '@/components/pixel/GameCard';
import { PixelButton } from '@/components/pixel/PixelButton';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, Gamepad2 } from 'lucide-react';
import Link from 'next/link';

interface InteractiveArcadeProps {
  initialGames: Game[];
}

const ITEMS_PER_PAGE = 12;

const CATEGORIES = [
  'All', 'Action', 'Arcade', 'Puzzle', 'Sports', 'Racing', 'Adventure', 'RPG'
];

export const InteractiveArcade = ({ initialGames }: InteractiveArcadeProps) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);

  // 1. Local Filtering Logic (0 reads)
  const filteredGames = useMemo(() => {
    if (activeCategory === 'All') return initialGames;
    return initialGames.filter(game => game.category === activeCategory);
  }, [activeCategory, initialGames]);

  // 2. Local Pagination Logic (0 reads)
  const totalPages = Math.ceil(filteredGames.length / ITEMS_PER_PAGE);
  const currentGames = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredGames.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredGames, currentPage]);

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setCurrentPage(1);
  };

  return (
    <section id="categories" className="py-24 px-6 sm:px-8 bg-[#0D0925]/50 border-y border-[#1B123D]">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <div className="font-pixel text-[8px] text-neon-cyan uppercase mb-4 tracking-[0.4em]">EXPLORE SECTORS</div>
          <h2 className="font-pixel text-2xl sm:text-3xl text-white uppercase tracking-tighter">Browse by Category</h2>
          <p className="font-body text-muted mt-4 max-w-2xl mx-auto">
            Choose a genre to instantly filter through our indie collection.
          </p>
        </div>

        {/* Category Pill Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={cn(
                "px-6 py-3 font-pixel text-[8px] uppercase tracking-widest border-2 transition-all active:scale-95",
                activeCategory === cat 
                  ? "bg-neon-cyan border-neon-cyan text-black shadow-[4px_4px_0_0_#000]"
                  : "bg-[#140A2E] border-[#1B123D] text-muted hover:border-neon-cyan hover:text-white"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results Grid */}
        {currentGames.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 mb-16">
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
          <div className="text-center py-24 border-2 border-dashed border-[#1B123D]">
            <Gamepad2 className="w-12 h-12 text-muted mx-auto mb-4 opacity-20" />
            <p className="font-pixel text-[10px] text-muted uppercase tracking-widest">No signals found in this quadrant.</p>
          </div>
        )}

        {/* Local Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-6">
            <PixelButton 
              variant="secondary" 
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            >
              <ChevronLeft className="w-4 h-4" /> PREV
            </PixelButton>
            
            <div className="font-pixel text-[10px] text-white">
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
        )}
      </div>
    </section>
  );
};