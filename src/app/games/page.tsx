"use client"

import React, { useMemo, Suspense } from 'react';
import { SpaceBackground } from '@/components/layout/SpaceBackground';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { GameGrid } from '@/components/pixel/GameGrid';
import { useGameStore } from '@/context/GameContext';
import { Pagination } from '@/components/pixel/Pagination';
import { useSearchParams } from 'next/navigation';
import { AlertCircle, Terminal, Loader2 } from 'lucide-react';

/**
 * ArcadeContent Component
 * Handles the logic for slicing the game catalog based on URL parameters.
 * Implements "Zero-Cost" pagination by avoiding database calls on navigation.
 */
function ArcadeContent() {
  const { allGames, loading } = useGameStore();
  const searchParams = useSearchParams();
  
  // 1. Read the current page from URL parameters
  const pageParam = searchParams.get('page');
  const currentPage = Math.max(1, parseInt(pageParam || '1', 10) || 1);
  const pageSize = 24;

  // 2. Apply Slicing Logic locally
  const { currentGames, totalPages, startRange, endRange, total } = useMemo(() => {
    const total = allGames.length;
    // SEO Guard: Limit crawlable pages to 20 for performance and relevance
    const actualTotalPages = Math.ceil(total / pageSize);
    const totalPages = Math.min(actualTotalPages, 20); 
    
    const startIndex = (currentPage - 1) * pageSize;
    const currentGames = allGames.slice(startIndex, startIndex + pageSize);
    
    const startRange = total > 0 ? startIndex + 1 : 0;
    const endRange = Math.min(startIndex + pageSize, total);
    
    return { currentGames, totalPages, startRange, endRange, total };
  }, [allGames, currentPage]);

  if (loading && allGames.length === 0) {
    return (
      <div className="flex-grow flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-12 h-12 text-neon-purple animate-spin" />
      </div>
    );
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
        <div className="mt-16 flex justify-center">
          <Pagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            baseUrl="/games" 
          />
        </div>
      )}
    </div>
  );
}

export default function GamesPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <SpaceBackground />
      <Navbar />
      <Suspense fallback={
        <div className="flex-grow flex items-center justify-center">
          <Loader2 className="w-12 h-12 text-neon-purple animate-spin" />
        </div>
      }>
        <ArcadeContent />
      </Suspense>
      <Footer />
    </main>
  );
}
