"use client"

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PixelButton } from '@/components/pixel/PixelButton';
import { Game } from '@/types/game';
import { Star, Play, Share2, Maximize2, Minimize2, ArrowLeft, Loader2, RefreshCw, Heart, Check, Info } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import Script from 'next/script';
import { cn } from '@/lib/utils';
import { useGameStore } from '@/context/GameContext';
import { GameWalkthrough } from './GameWalkthrough';
import { useArcadeState } from '@/hooks/useArcadeState';

interface GameViewProps {
  game: Game;
  discoveryPool: Game[];
}

function getFullscreenElement(): Element | null {
  if (typeof document === 'undefined') return null;
  const doc = document as Document & { webkitFullscreenElement?: Element | null };
  return doc.fullscreenElement ?? doc.webkitFullscreenElement ?? null;
}

export function GameView({ game, discoveryPool }: GameViewProps) {
  const [displayGames, setDisplayGames] = useState<Game[]>([]);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { recordPlay } = useGameStore();
  const { addRecent, toggleFavorite, isFavorite } = useArcadeState();
  const isFav = isFavorite(game.slug);
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [sdkLoaded, setSdkLoaded] = useState(false);

  const gameUrl = game.iframe_url || game.url || '';
  const hasGameUrl = gameUrl.length > 0;

  // Targeted SDK Initialization for GameMonetize
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).SDK_OPTIONS = {
        gameId: game.gameId || game.id.replace('gm_', ''),
        onEvent: (event: any) => {
          switch (event.name) {
            case 'SDK_READY':
              console.log('GameMonetize SDK Ready');
              setSdkLoaded(true);
              break;
            case 'SDK_ERROR':
              console.warn('GameMonetize SDK Error');
              setSdkLoaded(true); // Proceed anyway to unblock iframe
              break;
          }
        },
      };
    }
  }, [game.id, game.gameId]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!getFullscreenElement());
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, []);

  const shuffleDiscovery = useCallback(() => {
    const shuffled = [...discoveryPool]
      .filter(g => g.id !== game.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 36);
    setDisplayGames(shuffled);
  }, [discoveryPool, game.id]);

  useEffect(() => {
    shuffleDiscovery();
  }, [shuffleDiscovery]);

  useEffect(() => {
    const timer = setTimeout(() => {
      recordPlay();
      addRecent({
        slug: game.slug,
        title: game.title,
        category: game.category,
        thumb: game.thumbnail || game.thumb || ''
      });
    }, 5000);
    return () => clearTimeout(timer);
  }, [game.id, recordPlay, addRecent, game]);

  const toggleFullscreen = async () => {
    const el = playerContainerRef.current;
    if (!el) return;
    const doc = document as Document & { webkitExitFullscreen?: () => Promise<void> };
    try {
      if (getFullscreenElement()) {
        if (doc.exitFullscreen) await doc.exitFullscreen();
        else if (doc.webkitExitFullscreen) await doc.webkitExitFullscreen();
      } else if (el.requestFullscreen) {
        await el.requestFullscreen();
      } else if ((el as any).webkitRequestFullscreen) {
        await (el as any).webkitRequestFullscreen();
      }
    } catch {
      setIsFullscreen(!!getFullscreenElement());
    }
  };

  const handleShare = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Play ${game.title} on YoriGames`,
          text: `Check out this game: ${game.title}`,
          url: url,
        });
      } catch (err) {
        copyToClipboard(url);
      }
    } else {
      copyToClipboard(url);
    }
  };

  const copyToClipboard = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Clipboard failed", err);
    }
  };

  const handleAboutScroll = () => {
    const element = document.getElementById('about-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <main className="min-h-screen w-full overflow-x-hidden relative flex flex-col bg-[#09061B]">
      <Navbar />
      
      {/* Targeted SDK Script */}
      <Script 
        src="https://api.gamemonetize.com/sdk.js" 
        strategy="afterInteractive" 
        onLoad={() => console.log('GM SDK Script Loaded')}
      />

      <div className="flex-1 max-w-[1600px] mx-auto w-full px-4 py-4 sm:py-6">
        <div className="mb-4 flex items-center gap-3">
          <Link href="/games/" className="font-pixel text-[8px] text-muted hover:text-white flex items-center gap-2 uppercase transition-colors py-2">
            <ArrowLeft className="w-3 h-3" /> Back
          </Link>
          <div className="w-1 h-1 bg-muted rounded-full" />
          <span className="font-pixel text-[8px] text-neon-purple uppercase">{game.category}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
          {/* Main Player Area - 75% on Desktop */}
          <div className="lg:col-span-9 flex flex-col gap-4">
            <div
              ref={playerContainerRef}
              className={cn(
                "relative w-full aspect-video max-h-[75vh] bg-black border-4 border-[#1B123D] shadow-[8px_8px_0_0_#000] overflow-hidden group rounded-xl flex items-center justify-center mx-auto",
                "[&:fullscreen]:max-h-none [&:fullscreen]:!h-[100dvh] [&:fullscreen]:!w-[100dvw] [&:fullscreen]:rounded-none [&:fullscreen]:border-0"
              )}
            >
              {!hasGameUrl ? (
                <div className="flex flex-col items-center justify-center p-6 text-center">
                  <Info className="w-10 h-10 text-neon-pink mb-4" />
                  <p className="font-pixel text-[10px] text-white uppercase tracking-widest">Link Unavailable</p>
                </div>
              ) : (
                <>
                  <iframe
                    ref={iframeRef}
                    src={gameUrl}
                    className="w-full h-full border-none z-10"
                    allow="fullscreen; autoplay; gamepad; accelerometer; gyroscope"
                  />
                  
                  {/* Fullscreen Overlay Controls */}
                  <div className={cn(
                    "absolute top-0 right-0 z-50 p-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100",
                    isFullscreen && "opacity-100"
                  )}>
                    <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md p-1.5 border border-white/10 rounded-lg">
                      <button onClick={toggleFullscreen} className="p-2 hover:bg-white/10 rounded-md transition-colors">
                        {isFullscreen ? <Minimize2 className="w-5 h-5 text-white" /> : <Maximize2 className="w-5 h-5 text-white" />}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Quick Actions Bar */}
            <div className="flex flex-wrap gap-4 items-center justify-between bg-[#140A2E] p-4 border-2 border-[#1B123D] shadow-[4px_4px_0_0_#000] rounded-xl">
              <div className="flex gap-4">
                <button
                  onClick={() => toggleFavorite({ slug: game.slug, title: game.title, category: game.category, thumb: game.thumbnail || game.thumb || '' })}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 font-pixel text-[8px] uppercase border-2 transition-all active:scale-95",
                    isFav ? "bg-neon-pink border-neon-pink text-white" : "bg-[#09061B] border-[#1B123D] text-muted hover:text-white"
                  )}
                >
                  <Heart className={cn("w-3 h-3", isFav && "fill-current")} />
                  {isFav ? 'SAVED' : 'SAVE'}
                </button>
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 px-4 py-2 font-pixel text-[8px] uppercase bg-[#09061B] border-2 border-[#1B123D] text-muted hover:text-neon-cyan hover:border-neon-cyan transition-all active:scale-95"
                >
                  {copied ? <Check className="w-3 h-3 text-green-500" /> : <Share2 className="w-3 h-3 text-neon-cyan" />}
                  {copied ? 'COPIED' : 'SHARE'}
                </button>
                <button
                  onClick={handleAboutScroll}
                  className="flex items-center gap-2 px-4 py-2 font-pixel text-[8px] uppercase bg-[#09061B] border-2 border-[#1B123D] text-muted hover:text-neon-gold hover:border-neon-gold transition-all active:scale-95"
                >
                  <Info className="w-3 h-3 text-neon-gold" />
                  ABOUT
                </button>
              </div>
              <div className="hidden sm:flex items-center gap-2 text-muted font-pixel text-[6px] uppercase tracking-widest">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                Live Uplink Active
              </div>
            </div>
          </div>

          {/* Recommended Sidebar - 25% on Desktop */}
          <div className="lg:col-span-3">
            <div className="flex flex-col gap-4">
              <div className="font-pixel text-[8px] text-white uppercase tracking-widest mb-2 px-2">Recommended</div>
              <div className="grid grid-cols-2 lg:grid-cols-2 gap-4">
                {displayGames.slice(0, 6).map((g) => (
                  <Link 
                    key={`side-${g.id}`} 
                    href={`/games/${g.slug}/`} 
                    className="relative aspect-square overflow-hidden border-2 border-[#1B123D] hover:border-neon-cyan transition-all group rounded-2xl bg-black"
                  >
                    <Image
                      src={g.thumbnail || g.thumb || 'https://picsum.photos/seed/yori/400/400'}
                      alt={g.title}
                      fill
                      unoptimized={true}
                      className="object-cover group-hover:scale-110 transition-transform opacity-80 group-hover:opacity-100"
                      sizes="15vw"
                    />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Shuffled Bottom Grid */}
        <div className="space-y-6 mb-12">
          <div className="flex items-center justify-between border-b border-[#1B123D] pb-4">
            <div className="font-pixel text-xs text-white uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 bg-neon-cyan animate-pulse rounded-full" /> Discovery Sector
            </div>
            <button
              onClick={shuffleDiscovery}
              className="flex items-center gap-2 font-pixel text-[8px] text-muted hover:text-neon-cyan transition-colors uppercase group"
            >
              <RefreshCw className="w-3 h-3 group-active:rotate-180 transition-transform duration-500" />
              Recalibrate
            </button>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9 gap-4">
            {displayGames.slice(6).map((g) => (
              <Link
                key={`floor-${g.id}`}
                href={`/games/${g.slug}/`}
                className="relative aspect-square overflow-hidden border-2 border-[#1B123D] hover:border-neon-purple hover:scale-105 transition-all group rounded-2xl shadow-lg bg-black"
              >
                <Image
                  src={g.thumbnail || g.thumb || 'https://picsum.photos/seed/yori/400/400'}
                  alt={g.title}
                  fill
                  unoptimized={true}
                  className="object-cover opacity-70 group-hover:opacity-100"
                  sizes="(max-width: 640px) 33vw, 12vw"
                />
              </Link>
            ))}
          </div>
        </div>

        {/* Game Details Section */}
        <div id="about-section" className="border-t-4 border-[#1B123D] pt-12 pb-16 bg-[#0d051c]/50 rounded-b-3xl px-6 sm:px-12">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
              <div className="flex-1">
                <h1 className="font-pixel text-2xl sm:text-4xl text-white mb-4 uppercase tracking-tighter">{game.title}</h1>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2 bg-neon-gold/10 px-3 py-1 border border-neon-gold/30">
                    <Star className="w-4 h-4 text-neon-gold fill-neon-gold" />
                    <span className="font-pixel text-xs text-neon-gold">{(game.rating ?? 5.0).toFixed(1)}</span>
                  </div>
                  <div className="font-pixel text-[10px] text-muted uppercase tracking-widest">
                    {(game.play_count || 0).toLocaleString()} Active Sessions
                  </div>
                </div>
              </div>
              <div className="flex gap-4 w-full md:w-auto">
                <PixelButton variant="primary" className="flex-1 md:flex-none py-4" onClick={() => iframeRef.current?.focus()}>
                  <Play className="w-4 h-4 fill-white" /> FOCUS INPUT
                </PixelButton>
              </div>
            </div>

            <GameWalkthrough
              gameUrl={gameUrl}
              thumbnail={game.thumbnail || game.thumb}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-muted leading-relaxed">
              <div className="space-y-6">
                <h2 className="font-pixel text-xs text-white uppercase border-b border-[#1B123D] pb-2">Intelligence Briefing</h2>
                <p className="font-body text-base">{game.description}</p>
              </div>
              <div className="space-y-6">
                <h2 className="font-pixel text-xs text-white uppercase border-b border-[#1B123D] pb-2">Mission Parameters</h2>
                <p className="font-body text-base italic">{game.instructions || "Manual calibration required. Follow in-game cues."}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
