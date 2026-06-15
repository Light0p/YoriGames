"use client"

import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PixelButton } from '@/components/pixel/PixelButton';
import { Game } from '@/types/game';
import { Star, Play, Share2, Maximize2, ArrowLeft, Loader2, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useGameStore } from '@/context/GameContext';
import { GameWalkthrough } from './GameWalkthrough';

interface GameViewProps {
  game: Game;
  discoveryPool: Game[];
}

export function GameView({ game, discoveryPool }: GameViewProps) {
  const [loading, setLoading] = useState(true);
  const [displayGames, setDisplayGames] = useState<Game[]>([]);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { recordPlay } = useGameStore();
  const hasCountedRef = useRef(false);

  // Discovery logic: exactly 36 games for the Poki-style surround grid
  useEffect(() => {
    shuffleDiscovery();
  }, [discoveryPool, game.id]);

  const shuffleDiscovery = () => {
    const shuffled = [...discoveryPool]
      .filter(g => g.id !== game.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 36);
    setDisplayGames(shuffled);
  };

  // Engagement tracking: 10 seconds of verified gameplay
  useEffect(() => {
    hasCountedRef.current = false;
    const timer = setTimeout(() => {
      if (!hasCountedRef.current) {
        recordPlay();
        hasCountedRef.current = true;
      }
    }, 10000);
    return () => clearTimeout(timer);
  }, [game.id, recordPlay]);

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
      } catch (err) {}
    } else {
      try { await navigator.clipboard.writeText(url); } catch (err) {}
    }
  };

  return (
    <main className="min-h-screen w-full overflow-x-hidden relative flex flex-col bg-[#09061B]">
      <Navbar />

      <div className="flex-1 max-w-[1600px] mx-auto w-full px-4 py-4 sm:py-6">
        {/* Navigation Breadcrumbs */}
        <div className="mb-4 flex items-center gap-3">
          <Link href="/games" className="font-pixel text-[8px] text-muted hover:text-white flex items-center gap-2 uppercase transition-colors py-2">
            <ArrowLeft className="w-3 h-3" /> Back
          </Link>
          <div className="w-1 h-1 bg-muted rounded-full" />
          <span className="font-pixel text-[8px] text-neon-purple uppercase">{game.category}</span>
        </div>

        {/* TOP SECTION: Player + Side Discovery */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-4">
          {/* Main Player Area */}
          <div className="lg:col-span-9">
            <div className="relative w-full aspect-video bg-black border-4 border-[#1B123D] shadow-[8px_8px_0_0_#000] overflow-hidden group rounded-xl">
              {loading && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#0d051c]">
                  <Loader2 className="w-10 h-10 text-neon-purple animate-spin mb-4" />
                  <div className="font-pixel text-[8px] text-white uppercase animate-pulse">Initializing Interface...</div>
                </div>
              )}
              {/* Primary Game Iframe: Mounted instantly for Ad SDK sync, loading eager */}
              <iframe 
                ref={iframeRef}
                src={game.iframe_url || game.url || ''}
                className="absolute inset-0 w-full h-full border-none z-10"
                allow="fullscreen; autoplay; gamepad; accelerometer; gyroscope"
                onLoad={() => setLoading(false)}
                loading="eager"
              />
              <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-30">
                <button 
                  onClick={toggleFullscreen}
                  className="bg-black/80 p-3 border-2 border-white/20 hover:border-white transition-all backdrop-blur-sm rounded-lg"
                  title="Fullscreen"
                >
                  <Maximize2 className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </div>

          {/* Side Discovery Grid: unoptimized={true} to save bandwidth */}
          <div className="hidden lg:grid lg:col-span-3 grid-cols-2 grid-rows-3 gap-3">
            {displayGames.slice(0, 6).map((g) => (
              <Link key={`side-${g.id}`} href={`/games/${g.slug}`} className="relative aspect-square overflow-hidden border-2 border-[#1B123D] hover:border-neon-cyan transition-all group rounded-2xl">
                <Image 
                  src={g.thumbnail || g.thumb || 'https://picsum.photos/seed/yori/400/400'} 
                  alt={g.title} 
                  fill 
                  unoptimized={true}
                  className="object-cover group-hover:scale-110 transition-transform" 
                  sizes="15vw"
                />
              </Link>
            ))}
          </div>
        </div>

        {/* MIDDLE SECTION: Discovery Floor */}
        <div className="space-y-6 mb-12">
          <div className="flex items-center justify-between">
            <h2 className="font-pixel text-xs text-white uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 bg-neon-cyan animate-pulse rounded-full" /> Suggested Missions
            </h2>
            <button 
              onClick={shuffleDiscovery}
              className="flex items-center gap-2 font-pixel text-[8px] text-muted hover:text-neon-cyan transition-colors uppercase group"
            >
              <RefreshCw className="w-3 h-3 group-active:rotate-180 transition-transform duration-500" />
              Refresh Shroud
            </button>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9 gap-3">
            {/* Massive Grid: ALL images unoptimized to protect Vercel credits */}
            {displayGames.slice(6).map((g) => (
              <Link 
                key={`floor-${g.id}`} 
                href={`/games/${g.slug}`} 
                className="relative aspect-square overflow-hidden border-2 border-[#1B123D] hover:border-neon-purple hover:scale-105 transition-all group rounded-2xl shadow-lg"
              >
                <Image 
                  src={g.thumbnail || g.thumb || 'https://picsum.photos/seed/yori/400/400'} 
                  alt={g.title} 
                  fill 
                  unoptimized={true}
                  className="object-cover" 
                  sizes="(max-width: 640px) 33vw, 12vw"
                />
              </Link>
            ))}
          </div>
        </div>

        {/* BOTTOM SECTION: Metadata & Walkthrough */}
        <div className="border-t-4 border-[#1B123D] pt-12 pb-16 bg-[#0d051c]/50 rounded-b-3xl px-6 sm:px-12">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
              <div className="flex-1">
                <h1 className="font-pixel text-2xl sm:text-4xl text-white mb-4 uppercase tracking-tighter">{game.title}</h1>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2 bg-neon-gold/10 px-3 py-1 border border-neon-gold/30">
                    <Star className="w-4 h-4 text-neon-gold fill-neon-gold" />
                    <span className="font-pixel text-xs text-neon-gold">{game.rating.toFixed(1)}</span>
                  </div>
                  <div className="font-pixel text-[10px] text-muted uppercase tracking-widest">
                    {(game.play_count || 0).toLocaleString()} Verified Plays
                  </div>
                </div>
              </div>
              <div className="flex gap-4 w-full md:w-auto">
                <PixelButton variant="primary" className="flex-1 md:flex-none py-4" onClick={() => iframeRef.current?.focus()}>
                  <Play className="w-4 h-4 fill-white" /> FOCUS ENGINE
                </PixelButton>
                <PixelButton variant="secondary" className="px-6" onClick={handleShare}>
                  <Share2 className="w-4 h-4" />
                </PixelButton>
              </div>
            </div>

            {/* Walkthrough Section with Poster Support */}
            <GameWalkthrough 
              gameUrl={game.iframe_url || game.url || ''} 
              thumbnail={game.thumbnail || game.thumb}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-muted leading-relaxed">
              <div className="space-y-6">
                <h3 className="font-pixel text-xs text-white uppercase border-b border-[#1B123D] pb-2">About this game</h3>
                <p className="font-body text-base">{game.description}</p>
                <div className="flex flex-wrap gap-2 pt-4">
                  {game.tags?.map(tag => (
                    <Link href={`/search?q=${tag}`} key={tag} className="font-pixel text-[7px] px-3 py-2 bg-[#1B123D] border border-white/5 text-muted hover:text-neon-cyan transition-colors uppercase rounded-lg">
                      #{tag}
                    </Link>
                  ))}
                </div>
              </div>
              <div className="space-y-6">
                <h3 className="font-pixel text-xs text-white uppercase border-b border-[#1B123D] pb-2">Controls & Guide</h3>
                <p className="font-body text-base italic">{game.instructions || "Follow the in-game tutorial to master this mission."}</p>
                <div className="bg-[#140A2E] p-6 border-l-4 border-neon-pink mt-4">
                  <p className="font-pixel text-[8px] text-white uppercase mb-2">Pro Tip:</p>
                  <p className="text-xs">Use the Focus button above to capture your keyboard input directly into the game engine.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
