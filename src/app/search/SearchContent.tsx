"use client"

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { GameCard } from '@/components/pixel/GameCard';
import { Search, Gamepad2, Loader2, Sparkles } from 'lucide-react';
import Link from 'next/link';
import Fuse from 'fuse.js';

interface SearchContentProps {
  initialGames: any[];
}

export function SearchContent({ initialGames }: SearchContentProps) {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [query, setQuery] = useState(initialQuery);
  const fuseRef = useRef<Fuse<any> | null>(null);

  useEffect(() => {
    fuseRef.current = new Fuse(initialGames, {
      keys: ['title', 'category', 'tags'],
      threshold: 0.3,
    });
  }, [initialGames]);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const filteredGames = useMemo(() => {
    if (!query.trim() || !fuseRef.current) return [];
    return fuseRef.current.search(query).map(r => r.item);
  }, [query]);

  const recommendations = useMemo(() => {
    if (filteredGames.length > 0 || !initialGames.length) return [];
    return initialGames.slice(0, 10).sort(() => Math.random() - 0.5).slice(0, 5);
  }, [filteredGames, initialGames]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:py-16">
      <div className="relative mb-12 sm:mb-16 max-w-2xl mx-auto">
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-[#140A2E] border-4 border-[#1B123D] px-4 sm:px-12 py-4 sm:py-6 text-white font-headline text-xl sm:text-2xl uppercase focus:outline-none focus:border-neon-purple transition-all shadow-[8px_8px_0_0_#000]"
          placeholder="SEARCH UNIVERSE..."
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
                rating={game.rating || 5.0}
                imageUrl={game.thumbnail}
              />
            </Link>
          ))}
        </div>
      )}

      {query && filteredGames.length === 0 && (
        <div className="space-y-16">
          <div className="text-center py-20 bg-[#140A2E]/50 border-2 border-dashed border-[#1B123D]">
            <Gamepad2 className="w-16 h-16 text-muted mx-auto mb-4 opacity-30" />
            <p className="font-pixel text-[10px] text-muted uppercase tracking-widest px-4">No anomalies found for "{query}"</p>
          </div>

          {recommendations.length > 0 && (
            <section>
              <div className="flex items-center gap-4 mb-8">
                <Sparkles className="w-5 h-5 text-neon-gold" />
                <h2 className="font-pixel text-lg text-white uppercase">Alternative Missions</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
                {recommendations.map(game => (
                  <Link key={game.id} href={`/games/${game.slug}`}>
                    <GameCard 
                      title={game.title}
                      genre={game.category}
                      rating={game.rating || 5.0}
                      imageUrl={game.thumbnail}
                    />
                  </Link>
                ))}
              </div>
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