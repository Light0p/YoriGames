"use client"

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { SpaceBackground } from '@/components/layout/SpaceBackground';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { GameCard } from '@/components/pixel/GameCard';
import { getSearchableGames } from '@/lib/games';
import { Search, Gamepad2, Loader2, Sparkles } from 'lucide-react';
import Link from 'next/link';
import Fuse from 'fuse.js';

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [query, setQuery] = useState(initialQuery);
  const [allGames, setAllGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const fuseRef = useRef<Fuse<any> | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const games = await getSearchableGames(1000);
        setAllGames(games);
        fuseRef.current = new Fuse(games, {
          keys: ['title', 'category', 'tags'],
          threshold: 0.3,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const filteredGames = useMemo(() => {
    if (!query.trim() || !fuseRef.current) return [];
    return fuseRef.current.search(query).map(r => r.item);
  }, [query]);

  // Recommendation logic for "Similar Games"
  const recommendations = useMemo(() => {
    if (filteredGames.length > 0 || !allGames.length) return [];
    // If no results, show a few random games or from a similar predicted category
    return allGames.slice(0, 10).sort(() => Math.random() - 0.5).slice(0, 5);
  }, [filteredGames, allGames]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:py-16">
      <div className="relative mb-12 sm:mb-16 max-w-2xl mx-auto">
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-[#140A2E] border-4 border-[#1B123D] px-4 sm:px-12 py-4 sm:py-6 text-white font-headline text-xl sm:text-2xl uppercase focus:outline-none focus:border-neon-purple transition-all shadow-[4px_4px_0_0_#000] sm:shadow-[8px_8px_0_0_#000]"
          placeholder="SEARCH UNIVERSE..."
        />
        <Search className="absolute right-4 sm:left-4 top-1/2 -translate-y-1/2 w-6 h-6 sm:w-8 sm:h-8 text-muted" />
      </div>

      {loading ? (
        <div className="flex flex-col items-center py-20 gap-4">
          <Loader2 className="w-12 h-12 text-neon-purple animate-spin" />
          <p className="font-pixel text-[10px] text-muted uppercase tracking-[0.2em]">Synchronizing Archives...</p>
        </div>
      ) : (
        <>
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
              <div className="text-center py-16 sm:py-20 bg-[#140A2E]/50 border-2 border-dashed border-[#1B123D]">
                <Gamepad2 className="w-12 h-12 sm:w-16 sm:h-16 text-muted mx-auto mb-4 opacity-30" />
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
            <div className="text-center py-16 sm:py-20">
              <p className="font-pixel text-[10px] text-muted uppercase tracking-widest px-4">Scan title, category, or tags...</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// Fixed missing useRef import
import { useRef } from 'react';

export default function SearchPage() {
  return (
    <main className="min-h-screen w-full overflow-x-hidden">
      <SpaceBackground />
      <Navbar />
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-12 h-12 text-neon-purple animate-spin" />
        </div>
      }>
        <SearchContent />
      </Suspense>
      <Footer />
    </main>
  );
}
