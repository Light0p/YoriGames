"use client"

import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PixelButton } from '@/components/pixel/PixelButton';
import { Game } from '@/types/game';
import { Star, Play, Share2, Maximize2, ArrowLeft, Loader2, Info, BookOpen } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface GameViewProps {
  game: Game;
  allGames: Game[];
}

export function GameView({ game, allGames }: GameViewProps) {
  const [loading, setLoading] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const relatedGames = allGames
    .filter(g => g.id !== game.id && g.category === game.category)
    .slice(0, 4);

  const toggleFullscreen = () => {
    if (iframeRef.current) {
      if (iframeRef.current.requestFullscreen) {
        iframeRef.current.requestFullscreen();
      } else if ((iframeRef.current as any).webkitRequestFullscreen) {
        (iframeRef.current as any).webkitRequestFullscreen();
      }
    }
  };

  const handleShare = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Play ${game.title} on YoriGames`,
          text: game.description,
          url: url,
        });
      } catch (err) {
        // Silent catch for user cancellation
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
      } catch (err) {
        // Fallback clipboard failure
      }
    }
  };

  return (
    <main className="min-h-screen w-full overflow-x-hidden relative flex flex-col">
      <Navbar />

      <div className="flex-1 max-w-7xl mx-auto w-full px-4 py-4 sm:py-8">
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <Link href="/games" className="font-pixel text-[8px] sm:text-[10px] text-muted hover:text-white flex items-center gap-2 uppercase transition-colors py-2 px-1 min-h-[44px]">
            <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" /> Back to Arcade
          </Link>
          <div className="w-1 h-1 bg-muted rounded-full hidden sm:block" />
          <Link href={`/categories/${game.category.toLowerCase()}`} className="font-pixel text-[8px] sm:text-[10px] text-neon-purple hover:underline uppercase transition-all py-2 px-1 min-h-[44px]">
            {game.category}
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            <div className="relative w-full aspect-video bg-black border-4 border-[#1B123D] shadow-[4px_4px_0_0_#000] sm:shadow-[8px_8px_0_0_#000] overflow-hidden group">
              {loading && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#09061B]">
                  <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 text-neon-purple animate-spin mb-4" />
                  <div className="font-pixel text-[8px] sm:text-[10px] text-white uppercase animate-pulse">Initializing Core Engine...</div>
                </div>
              )}
              <iframe 
                ref={iframeRef}
                src={game.iframe_url}
                className="absolute inset-0 w-full h-full border-none z-10"
                allow="fullscreen; autoplay; gamepad"
                onLoad={() => setLoading(false)}
                loading="lazy"
              />
              <div className="absolute bottom-4 right-4 flex gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity z-30">
                <button 
                  onClick={toggleFullscreen}
                  className="bg-black/80 p-3 sm:p-2 border-2 border-white/20 hover:border-white transition-all backdrop-blur-sm min-w-[44px] min-h-[44px] flex items-center justify-center"
                  title="Fullscreen"
                >
                  <Maximize2 className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-[#140A2E] p-5 sm:p-8 border-2 border-[#1B123D]">
              <div className="flex-1 min-w-0 w-full">
                <h1 className="font-pixel text-lg sm:text-2xl md:text-3xl text-white mb-2 uppercase tracking-tighter truncate">{game.title}</h1>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-neon-gold fill-neon-gold" />
                    <span className="font-pixel text-xs text-neon-gold">{game.rating.toFixed(1)}</span>
                  </div>
                  <div className="font-pixel text-[8px] sm:text-[10px] text-muted uppercase">{(game.play_count || 0).toLocaleString()} Plays</div>
                </div>
              </div>
              <div className="flex gap-3 w-full md:w-auto">
                <PixelButton 
                  variant="primary" 
                  className="flex-1 md:flex-none"
                  onClick={() => iframeRef.current?.focus()}
                >
                  <Play className="w-4 h-4 fill-white" /> FOCUS
                </PixelButton>
                <PixelButton 
                  variant="secondary" 
                  className="px-4 sm:px-6 flex items-center justify-center min-w-[48px]"
                  onClick={handleShare}
                >
                  <Share2 className="w-4 h-4" />
                </PixelButton>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-[#140A2E] p-5 sm:p-8 border-2 border-[#1B123D]">
                <h3 className="font-pixel text-[10px] sm:text-xs text-white uppercase mb-4 border-b border-[#1B123D] pb-2 tracking-widest flex items-center gap-3">
                  <Info className="w-4 h-4 text-neon-cyan" /> Mission Briefing
                </h3>
                <p className="font-body text-sm sm:text-base text-muted leading-relaxed">
                  {game.description}
                </p>
              </div>

              <div className="bg-[#140A2E] p-5 sm:p-8 border-2 border-[#1B123D]">
                <h3 className="font-pixel text-[10px] sm:text-xs text-white uppercase mb-4 border-b border-[#1B123D] pb-2 tracking-widest flex items-center gap-3">
                  <BookOpen className="w-4 h-4 text-neon-pink" /> Tactical Guide
                </h3>
                <p className="font-body text-sm sm:text-base text-muted leading-relaxed italic">
                  {game.instructions || "No special instructions provided for this mission."}
                </p>
                <div className="mt-6 sm:mt-8 flex flex-wrap gap-2">
                  {Array.isArray(game.tags) && game.tags.map(tag => (
                    <Link href={`/search?q=${tag}`} key={tag} className="font-pixel text-[7px] sm:text-[8px] px-3 py-3 sm:py-1 bg-neon-purple/10 border border-neon-purple/30 text-neon-purple uppercase hover:bg-neon-purple hover:text-white transition-colors min-h-[32px] flex items-center">
                      #{tag}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6 sm:space-y-8">
            <div className="bg-[#1B123D] border-4 border-[#140A2E] p-5 sm:p-6 shadow-[4px_4px_0_0_#000]">
              <h3 className="font-pixel text-[10px] sm:text-xs text-neon-pink uppercase mb-6 tracking-widest">Nearby Systems</h3>
              <div className="space-y-5 sm:space-y-6">
                {relatedGames.length > 0 ? (
                  relatedGames.map(g => (
                    <Link key={g.id} href={`/games/${g.slug}`} className="flex gap-4 group min-h-[64px]">
                      <div className="relative w-16 sm:w-20 aspect-square bg-[#140A2E] border-2 border-[#09061B] overflow-hidden flex-shrink-0">
                        <Image 
                          src={g.thumb || g.thumbnail} 
                          alt={g.title} 
                          fill 
                          className="object-cover group-hover:scale-110 transition-transform" 
                        />
                      </div>
                      <div className="min-w-0 flex flex-col justify-center">
                        <h4 className="font-headline text-base sm:text-lg text-white group-hover:text-neon-cyan transition-colors truncate leading-tight">{g.title}</h4>
                        <span className="font-pixel text-[8px] text-muted uppercase block mt-1">{g.category}</span>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="w-2 h-2 text-neon-gold fill-neon-gold" />
                          <span className="font-pixel text-[8px] text-neon-gold">{g.rating}</span>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className="font-pixel text-[8px] text-muted uppercase">Scanning for related anomalies...</p>
                )}
              </div>
              <Link href="/games" className="block mt-8 text-center font-pixel text-[8px] text-neon-cyan hover:underline uppercase py-4 border-t border-white/5">
                View All Missions
              </Link>
            </div>

            <div className="bg-[#09061B] border-2 border-[#1B123D] p-6 text-center">
              <div className="font-pixel text-[10px] text-muted uppercase mb-4 tracking-widest">Satisfaction</div>
              <div className="text-3xl sm:text-4xl font-pixel text-white mb-2">{game.rating}</div>
              <div className="flex justify-center gap-1 mb-6">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className={cn("w-4 h-4", i <= Math.floor(game.rating) ? "text-neon-gold fill-neon-gold" : "text-white/10")} />
                ))}
              </div>
              <PixelButton variant="gold" className="w-full text-xs">LOG RATING</PixelButton>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
