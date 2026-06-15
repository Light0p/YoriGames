'use client';

import React, { useState } from 'react';
import { useArcadeState } from '@/hooks/useArcadeState';
import { GameCard } from '@/components/pixel/GameCard';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Sparkles, History, Heart } from 'lucide-react';

export function YourArcade() {
  const { recent, favorites } = useArcadeState();
  const [activeTab, setActiveTab] = useState<'recent' | 'favorites'>('recent');

  // If no data at all, hide the section
  if (recent.length === 0 && favorites.length === 0) return null;

  const currentTab = favorites.length > 0 ? activeTab : 'recent';
  const displayGames = currentTab === 'recent' ? recent : favorites;

  return (
    <section className="w-full py-12 px-6 sm:px-8 bg-[#0c0a1a] border-b-4 border-[#1B123D]">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-neon-purple/20 p-2 border-2 border-neon-purple">
                <Sparkles className="w-4 h-4 text-neon-purple" />
              </div>
              <h2 className="font-pixel text-[10px] text-white uppercase tracking-[0.2em]">
                YOUR ARCADE
              </h2>
            </div>
            
            <div className="flex w-fit bg-[#050410] border-2 border-[#1B123D] p-1">
              <button
                onClick={() => setActiveTab('recent')}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 font-pixel text-[8px] uppercase transition-all",
                  activeTab === 'recent'
                    ? "bg-neon-purple text-white shadow-[2px_2px_0_0_#000]"
                    : "text-muted hover:text-white"
                )}
              >
                <History className="w-3 h-3" /> RECENT
              </button>
              <button
                onClick={() => setActiveTab('favorites')}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 font-pixel text-[8px] uppercase transition-all",
                  activeTab === 'favorites'
                    ? "bg-neon-pink text-white shadow-[2px_2px_0_0_#000]"
                    : "text-muted hover:text-white"
                )}
              >
                <Heart className="w-3 h-3" /> FAVORITES
              </button>
            </div>
          </div>
        </div>

        {activeTab === 'favorites' && favorites.length === 0 ? (
          <div className="border-4 border-dashed border-[#1B123D] p-12 text-center bg-[#050410]/50">
            <div className="mb-4 flex justify-center">
               <Heart className="w-8 h-8 text-[#1B123D]" />
            </div>
            <p className="font-pixel text-[8px] text-muted uppercase leading-relaxed max-w-xs mx-auto">
              NO FAVORITES YET - Tap the heart on any game to save it here
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
            {displayGames.map((game) => (
              <Link key={game.slug} href={`/games/${game.slug}`}>
                <GameCard
                  slug={game.slug}
                  title={game.title}
                  genre={game.category}
                  rating={5}
                  imageUrl={game.thumb}
                />
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
