"use client"

import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PixelButton } from '@/components/pixel/PixelButton';
import { Game } from '@/types/game';
import { Star, Play, Share2, Maximize2, Minimize2, ArrowLeft, Loader2, RefreshCw, Heart, Check, Info } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useGameStore } from '@/context/GameContext';
import { GameWalkthrough } from './GameWalkthrough';
import { useArcadeState } from '@/hooks/useArcadeState';

interface GameViewProps {
  game: Game;
  discoveryPool: Game[];
}

/** Cross-browser helper — client-only, static-export safe. */
function getFullscreenElement(): Element | null {
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

  const sdkReady = useRef(false);
  const iframeMounted = useRef(false);
  const [showIframe, setShowIframe] = useState(false);

  // UI-only flag for control icons; never used to conditionally render player DOM.
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    function mountIframe() {
      if (iframeMounted.current) return;
      iframeMounted.current = true;
      setShowIframe(true);
    }

    const handleSDKReady = () => {
      sdkReady.current = true;
      mountIframe();
    };
    window.addEventListener('gmSDKReady', handleSDKReady);

    const script = document.createElement('script');
    script.src = 'https://api.gamemonetize.com/sdk.js';
    script.async = true;
    document.head.appendChild(script);

    const fallback = setTimeout(mountIframe, 2000);

    return () => {
      clearTimeout(fallback);
      window.removeEventListener('gmSDKReady', handleSDKReady);
    };
  }, []);

  // Keep React in sync when the browser exits fullscreen via ESC or native UI.
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!getFullscreenElement()) {
        setIsFullscreen(false);
      } else {
        setIsFullscreen(true);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, []);

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
      setIsFullscreen(false);
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

      <div className="flex-1 max-w-[1600px] mx-auto w-full px-4 py-4 sm:py-6">
        <div className="mb-4 flex items-center gap-3">
          <Link href="/games/" className="font-pixel text-[8px] text-muted hover:text-white flex items-center gap-2 uppercase transition-colors py-2">
            <ArrowLeft className="w-3 h-3" /> Back
          </Link>
          <div className="w-1 h-1 bg-muted rounded-full" />
          <span className="font-pixel text-[8px] text-neon-purple uppercase">{game.category}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-4">
          <div className="lg:col-span-9">
            {/*
              Stable player shell: fullscreen API targets this ref only.
              Never conditionally mount/unmount iframe or swap keys on fullscreen changes.
            */}
            <div
              ref={playerContainerRef}
              className="relative w-full aspect-video bg-black border-4 border-[#1B123D] shadow-[8px_8px_0_0_#000] overflow-hidden group rounded-xl flex items-center justify-center [&:fullscreen]:h-screen [&:fullscreen]:w-screen [&:fullscreen]:rounded-none [&:fullscreen]:border-0"
            >
              <div className="w-full h-full max-h-full max-w-full aspect-video mx-auto relative flex items-center justify-center [&:fullscreen]:aspect-auto [&:fullscreen]:h-full [&:fullscreen]:w-full">
                {!showIframe && (
                  <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#0d051c] pointer-events-none">
                    <Loader2 className="w-10 h-10 text-neon-purple animate-spin mb-4" />
                    <div className="font-pixel text-[8px] text-white uppercase animate-pulse">Initializing Interface...</div>
                  </div>
                )}
                {showIframe && (
                  <iframe
                    ref={iframeRef}
                    src={game.iframe_url || game.url || ''}
                    className="absolute inset-0 w-full h-full border-none z-10"
                    allow="fullscreen; autoplay; gamepad; accelerometer; gyroscope"
                    loading="eager"
                  />
                )}

                {/* Ad mount point — outer wrapper is fully click-through; inner has no forced size so empty state cannot trap touches */}
                <div className="absolute inset-0 z-40 pointer-events-none">
                  <div id="game-ad-container" className="pointer-events-auto inline-block w-auto h-auto" />
                </div>

                {/* Top-right controls — outer bar is click-through; only buttons capture touch/click */}
                <div
                  className={cn(
                    "absolute top-0 right-0 z-50 p-3",
                    "pointer-events-none opacity-0 transition-opacity duration-200",
                    "max-md:opacity-100 md:group-hover:opacity-100",
                    isFullscreen && "opacity-100"
                  )}
                >
                  <div className="flex flex-wrap items-center gap-2 pointer-events-none rounded-lg bg-black/80 p-1.5 border-2 border-white/20 backdrop-blur-sm">
                    <button
                      type="button"
                      onClick={toggleFullscreen}
                      className="pointer-events-auto touch-manipulation p-2 hover:bg-white/10 rounded-md transition-all active:scale-95"
                      title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
                      aria-pressed={isFullscreen}
                    >
                      {isFullscreen ? (
                        <Minimize2 className="w-5 h-5 text-white" />
                      ) : (
                        <Maximize2 className="w-5 h-5 text-white" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={handleShare}
                      className="pointer-events-auto touch-manipulation p-2 hover:bg-white/10 rounded-md transition-all active:scale-95 sm:hidden"
                      title="Share game"
                    >
                      {copied ? (
                        <Check className="w-5 h-5 text-green-500" />
                      ) : (
                        <Share2 className="w-5 h-5 text-neon-cyan" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-4 items-center justify-between bg-[#140A2E] p-4 border-2 border-[#1B123D] shadow-[4px_4px_0_0_#000]">
              <div className="flex gap-4">
                <button
                  onClick={() => toggleFavorite({ slug: game.slug, title: game.title, category: game.category, thumb: game.thumbnail || game.thumb || '' })}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 font-pixel text-[8px] uppercase border-2 transition-all active:scale-95",
                    isFav
                      ? "bg-neon-pink border-neon-pink text-white"
                      : "bg-[#09061B] border-[#1B123D] text-muted hover:text-white"
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
                  ABOUT GAME
                </button>
              </div>
              <div className="hidden sm:flex items-center gap-4 text-muted font-pixel text-[6px] uppercase tracking-widest">
                <span>Direct Link Established</span>
                <div className="flex gap-1">
                  <div className="w-1 h-1 bg-green-500 animate-pulse" />
                  <div className="w-1 h-1 bg-green-500 animate-pulse delay-75" />
                </div>
              </div>
            </div>
          </div>

          <div className="hidden lg:grid lg:col-span-3 grid-cols-2 grid-rows-3 gap-3">
            {displayGames.slice(0, 6).map((g) => (
              <Link key={`side-${g.id}`} href={`/games/${g.slug}/`} className="relative aspect-square overflow-hidden border-2 border-[#1B123D] hover:border-neon-cyan transition-all group rounded-2xl">
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
            {displayGames.slice(6).map((g) => (
              <Link
                key={`floor-${g.id}`}
                href={`/games/${g.slug}/`}
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

        <div id="about-section" className="border-t-4 border-[#1B123D] pt-12 pb-16 bg-[#0d051c]/50 rounded-b-3xl px-6 sm:px-12">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
              <div className="flex-1">
                <h1 className="font-pixel text-2xl sm:text-4xl text-white mb-4 uppercase tracking-tighter">{game.title}</h1>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2 bg-neon-gold/10 px-3 py-1 border border-neon-gold/30">
                    <Star className="w-4 h-4 text-neon-gold fill-neon-gold" />
                    <span className="font-pixel text-xs text-neon-gold">{(game.rating || 5.0).toFixed(1)}</span>
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
                    <Link href={`/search/?q=${encodeURIComponent('#' + tag)}`} key={tag} className="font-pixel text-[7px] px-3 py-2 bg-[#1B123D] border border-white/5 text-muted hover:text-neon-cyan transition-colors uppercase rounded-lg">
                      #{tag}
                    </Link>
                  ))}
                  <Link href={`/search/?q=${encodeURIComponent('#' + game.category)}`} className="font-pixel text-[7px] px-3 py-2 bg-[#1B123D] border border-white/5 text-muted hover:text-neon-pink transition-colors uppercase rounded-lg">
                    #{game.category}
                  </Link>
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
