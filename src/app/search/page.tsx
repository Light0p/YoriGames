"use client"

import React, { useState, useMemo } from 'react';
import { SpaceBackground } from '@/components/layout/SpaceBackground';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { GameCard } from '@/components/pixel/GameCard';
import gamesData from '@/data/games.json';
import { Search, Gamepad2 } from 'lucide-react';
import Link from 'next/link';

export default function SearchPage() {
  const [query, setQuery] = useState('');

  const filteredGames = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return gamesData.filter(g => 
      g.title.toLowerCase().includes(q) || 
      g.category.toLowerCase().includes(q) ||
      g.tags.some(t => t.toLowerCase().includes(q))
    );
  }, [query]);

  return (
    <main className="min-h-screen w-full overflow-x-hidden">
      <SpaceBackground />
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-16">
        <div className="relative mb-12 sm:mb-16 max-w-2xl mx-auto">
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-[#140A2E] border-4 border-[#1B123D] px-4 sm:px-12 py-4 sm:py-6 text-white font-headline text-xl sm:text-2xl uppercase focus:outline-none focus:border-neon-purple transition-all shadow-[4px_4px_0_0_#000] sm:shadow-[8px_8px_0_0_#000]"
            placeholder="SEARCH UNIVERSE..."
            autoFocus
          />
          <Search className="absolute right-4 sm:left-4 top-1/2 -translate-y-1/2 w-6 h-6 sm:w-8 sm:h-8 text-muted" />
        </div>

        {query && filteredGames.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
            {filteredGames.map(game => (
              <Link key={game.id} href={`/games/${game.slug}`}>
                <GameCard 
                  title={game.title}
                  genre={game.category}
                  rating={game.rating}
                  imageUrl={game.thumbnail}
                />
              </Link>
            ))}
          </div>
        )}

        {query && filteredGames.length === 0 && (
          <div className="text-center py-16 sm:py-20 bg-[#140A2E]/50 border-2 border-dashed border-[#1B123D]">
            <Gamepad2 className="w-12 h-12 sm:w-16 sm:h-16 text-muted mx-auto mb-4 opacity-30" />
            <p className="font-pixel text-[10px] text-muted uppercase tracking-widest px-4">No anomalies found for "{query}"</p>
          </div>
        )}

        {!query && (
          <div className="text-center py-16 sm:py-20">
            <p className="font-pixel text-[10px] text-muted uppercase tracking-widest px-4">Scan title, category, or tags...</p>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}