'use client';

import React, { useState, useMemo } from 'react';
import { GameGrid } from '@/components/pixel/GameGrid';
import { Terminal, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Game } from '@/types/game';

interface Props {
  games: Game[];
}

/**
 * GamesPageClient Component
 * Handles pagination entirely in the browser to comply with static export rules.
 */
export default function GamesPageClient({ games }: Props) {
  const [currentPage, setCurrentPage] = useState(1);
  const [jumpPage, setJumpPage] = useState('');
  const pageSize = 50;
  
  const total = games.length;
  const totalPages = Math.ceil(total / pageSize);

  // Derived state for the current page's slice of games
  const currentGames = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return games.slice(start, start + pageSize);
  }, [currentPage, games]);

  const startRange = total > 0 ? (currentPage - 1) * pageSize + 1 : 0;
  const endRange = Math.min(currentPage * pageSize, total);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleJump = (e: React.FormEvent) => {
    e.preventDefault();
    const pageNum = parseInt(jumpPage, 10);
    if (pageNum >= 1 && pageNum <= totalPages) {
      handlePageChange(pageNum);
      setJumpPage('');
    }
  };

  const renderPageLink = (page: number, label?: React.ReactNode, isDisabled = false, ariaLabel?: string) => {
    const isActive = page === currentPage;

    return (
      <button
        key={page}
        onClick={() => !isDisabled && !isActive && handlePageChange(page)}
        disabled={isDisabled}
        aria-label={ariaLabel || `Go to page ${page}`}
        className={cn(
          "min-w-[40px] h-10 flex items-center justify-center font-pixel text-[10px] border-2 transition-all active:scale-95",
          isActive 
            ? "bg-neon-purple border-neon-purple text-white shadow-[2px_2px_0_0_#000]" 
            : "bg-[#140A2E] border-[#1B123D] text-muted hover:border-neon-purple hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
        )}
      >
        {label || page}
      </button>
    );
  };

  // Pagination Logic for visible page numbers
  const pages = [];
  const maxVisible = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let endPage = Math.min(totalPages, startPage + maxVisible - 1);

  if (endPage - startPage + 1 < maxVisible) {
    startPage = Math.max(1, endPage - maxVisible + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(renderPageLink(i));
  }

  return (
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

      {currentGames.length === 0 ? (
        <div className="text-center py-32 bg-[#140A2E]/50 border-4 border-dashed border-[#1B123D]">
          <Terminal className="w-16 h-16 text-muted mx-auto mb-6 opacity-20" />
          <p className="font-pixel text-xs text-muted uppercase tracking-[0.2em]">No games detected in this sector.</p>
        </div>
      ) : (
        <GameGrid games={currentGames} />
      )}

      {totalPages > 1 && (
        <nav className="flex flex-col items-center gap-8 mt-16" aria-label="Pagination Navigation">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {renderPageLink(1, <ChevronsLeft className="w-4 h-4" />, currentPage === 1, "First page")}
            {renderPageLink(currentPage - 1, <ChevronLeft className="w-4 h-4" />, currentPage === 1, "Previous page")}
            
            {startPage > 1 && (
              <>
                {renderPageLink(1)}
                {startPage > 2 && <span className="text-muted font-pixel text-[10px] px-2">...</span>}
              </>
            )}

            {pages}

            {endPage < totalPages && (
              <>
                {endPage < totalPages - 1 && <span className="text-muted font-pixel text-[10px] px-2">...</span>}
                {renderPageLink(totalPages)}
              </>
            )}

            {renderPageLink(currentPage + 1, <ChevronRight className="w-4 h-4" />, currentPage === totalPages, "Next page")}
            {renderPageLink(totalPages, <ChevronsRight className="w-4 h-4" />, currentPage === totalPages, "Last page")}
          </div>

          <form onSubmit={handleJump} className="flex items-center gap-3">
            <label htmlFor="jump-page-input" className="font-pixel text-[8px] text-muted uppercase tracking-widest">Jump to</label>
            <div className="relative">
              <input 
                id="jump-page-input"
                type="number" 
                min="1" 
                max={totalPages}
                value={jumpPage}
                onChange={(e) => setJumpPage(e.target.value)}
                className="w-20 bg-[#140A2E] border-2 border-[#1B123D] px-2 py-2 text-white font-pixel text-[10px] focus:outline-none focus:border-neon-purple text-center"
                placeholder="PG #"
              />
            </div>
            <button 
              type="submit"
              className="bg-[#1B123D] border-2 border-[#1B123D] hover:border-neon-purple p-2 transition-all active:scale-90"
            >
              <Search className="w-4 h-4 text-neon-purple" />
            </button>
          </form>
        </nav>
      )}
    </div>
  );
}
