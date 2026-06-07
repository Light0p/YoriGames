"use client"

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Sparkles, Loader2, Gamepad2 } from 'lucide-react';
import { gameSearchByDescription, type GameSearchByDescriptionOutput } from '@/ai/flows/game-search-by-description';
import { PixelButton } from '@/components/pixel/PixelButton';
import { Badge } from '@/components/ui/badge';

export const ArcadeInsightTool = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GameSearchByDescriptionOutput | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    try {
      const output = await gameSearchByDescription({ description: query });
      setResult(output);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-8 bg-[#1B123D] border-4 border-[#140A2E] shadow-[8px_8px_0_0_#000]">
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-neon-cyan p-2 sm:p-3 border-4 border-black">
          <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-black" />
        </div>
        <div>
          <h2 className="font-pixel text-lg sm:text-2xl text-white uppercase leading-none">Arcade Insight</h2>
          <p className="font-headline text-sm sm:text-base text-neon-cyan uppercase mt-1 tracking-wider">AI-Powered Search</p>
        </div>
      </div>

      <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 mb-8 sm:mb-10">
        <div className="relative flex-1">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. 'cosmic runner with neon lights'"
            className="w-full h-14 bg-[#09061B] border-4 border-[#140A2E] px-4 sm:px-6 text-white focus:outline-none focus:border-neon-purple transition-colors font-body text-base sm:text-lg"
          />
          <div className="absolute top-1/2 right-4 -translate-y-1/2 opacity-30">
            <Search className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        </div>
        <PixelButton 
          variant="secondary" 
          type="submit" 
          disabled={loading}
          className="h-14 flex items-center justify-center min-w-[150px] w-full md:w-auto"
        >
          {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'GENERATE'}
        </PixelButton>
      </form>

      {result && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex flex-wrap gap-2">
            {result.keywords.map((kw, i) => (
              <Badge key={i} className="bg-neon-purple/20 text-neon-purple border-neon-purple hover:bg-neon-purple hover:text-white rounded-none font-pixel text-[7px] sm:text-[8px] uppercase py-2 px-3">
                {kw}
              </Badge>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {result.suggestedGames.map((game, i) => (
              <div key={i} className="bg-[#140A2E] border-2 border-[#1B123D] p-5 sm:p-6 group hover:border-neon-cyan transition-colors">
                <div className="w-10 h-10 bg-neon-cyan/20 border-2 border-neon-cyan flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Gamepad2 className="w-5 h-5 text-neon-cyan" />
                </div>
                <h4 className="font-headline text-lg sm:text-xl text-white mb-2 uppercase group-hover:text-neon-cyan transition-colors truncate">{game.name}</h4>
                <div className="font-pixel text-[8px] text-neon-pink mb-4 uppercase tracking-widest">{game.genre}</div>
                <p className="text-xs sm:text-sm text-muted line-clamp-4 leading-relaxed">{game.summary}</p>
                <Link 
                  href={`/search?q=${encodeURIComponent(game.name)}`}
                  className="mt-6 font-pixel text-[10px] text-neon-cyan hover:underline uppercase flex items-center gap-2 py-2"
                >
                  Launch Game <span>→</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {!result && !loading && (
        <div className="text-center py-10 sm:py-12 border-2 border-dashed border-[#1B123D]">
          <p className="font-pixel text-[8px] sm:text-[10px] text-muted uppercase tracking-widest">Waiting for input...</p>
        </div>
      )}
    </div>
  );
};