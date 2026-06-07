
"use client"

import React, { useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { SpaceBackground } from '@/components/layout/SpaceBackground';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PixelButton } from '@/components/pixel/PixelButton';
import gamesData from '@/data/games.json';
import { Game } from '@/types/game';
import { Star, Play, Share2, Maximize2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function GamePage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const game = useMemo(() => {
    return (gamesData as Game[]).find(g => g.slug === slug);
  }, [slug]);

  if (!game) {
    return null; // Next.js will handle 404 if this is empty or we could redirect
  }

  const relatedGames = (gamesData as Game[])
    .filter(g => g.id !== game.id && g.category === game.category)
    .slice(0, 4);

  return (
    <main className="min-h-screen">
      <SpaceBackground />
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-8">
        {/* Breadcrumbs / Back */}
        <div className="mb-8 flex items-center gap-4">
          <Link href="/arcade" className="font-pixel text-[10px] text-muted hover:text-white flex items-center gap-2 uppercase">
            <ArrowLeft className="w-4 h-4" /> Back to Arcade
          </Link>
          <div className="w-1 h-1 bg-muted rounded-full" />
          <span className="font-pixel text-[10px] text-neon-purple uppercase">{game.category}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Game Area */}
          <div className="lg:col-span-2 space-y-8">
            <div className="relative aspect-video bg-black border-4 border-[#1B123D] shadow-[8px_8px_0_0_#000] overflow-hidden group">
              <iframe 
                src={game.iframe_url}
                className="w-full h-full border-none"
                allowFullScreen
              />
              {/* Optional UI Controls for Iframe */}
              <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="bg-black/80 p-2 border-2 border-white/20 hover:border-white transition-all">
                  <Maximize2 className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-[#140A2E] p-8 border-2 border-[#1B123D]">
              <div>
                <h1 className="font-pixel text-3xl text-white mb-2 uppercase tracking-tighter">{game.title}</h1>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-neon-gold fill-neon-gold" />
                    <span className="font-pixel text-xs text-neon-gold">{game.rating.toFixed(1)}</span>
                  </div>
                  <div className="font-pixel text-[10px] text-muted uppercase">{game.play_count.toLocaleString()} Plays</div>
                </div>
              </div>
              <div className="flex gap-4 w-full md:w-auto">
                <PixelButton variant="primary" className="flex-1 md:flex-none">
                  <Play className="w-4 h-4 fill-white" /> PLAY
                </PixelButton>
                <PixelButton variant="secondary" className="px-4">
                  <Share2 className="w-4 h-4" />
                </PixelButton>
              </div>
            </div>

            <div className="bg-[#140A2E] p-8 border-2 border-[#1B123D]">
              <h3 className="font-pixel text-xs text-white uppercase mb-4 border-b border-[#1B123D] pb-2">Description</h3>
              <p className="font-body text-muted leading-relaxed">
                {game.description}
              </p>
              <div className="mt-8 flex flex-wrap gap-2">
                {game.tags.map(tag => (
                  <span key={tag} className="font-pixel text-[8px] px-3 py-1 bg-neon-purple/10 border border-neon-purple/30 text-neon-purple uppercase">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-[#1B123D] border-4 border-[#140A2E] p-6 shadow-[4px_4px_0_0_#000]">
              <h3 className="font-pixel text-xs text-neon-pink uppercase mb-6 tracking-widest">Recommended</h3>
              <div className="space-y-6">
                {relatedGames.map(g => (
                  <Link key={g.id} href={`/games/${g.slug}`} className="flex gap-4 group">
                    <div className="relative w-24 aspect-square bg-[#140A2E] border-2 border-[#09061B] overflow-hidden flex-shrink-0">
                      <Image 
                        src={g.thumbnail} 
                        alt={g.title} 
                        fill 
                        className="object-cover group-hover:scale-110 transition-transform" 
                      />
                    </div>
                    <div>
                      <h4 className="font-headline text-lg text-white group-hover:text-neon-cyan transition-colors">{g.title}</h4>
                      <span className="font-pixel text-[8px] text-muted uppercase">{g.category}</span>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="w-2 h-2 text-neon-gold fill-neon-gold" />
                        <span className="font-pixel text-[8px] text-neon-gold">{g.rating}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              <Link href="/arcade" className="block mt-8 text-center font-pixel text-[8px] text-neon-cyan hover:underline uppercase">
                View All Games
              </Link>
            </div>

            {/* Stats Card */}
            <div className="bg-[#09061B] border-2 border-[#1B123D] p-6 text-center">
              <div className="font-pixel text-[10px] text-muted uppercase mb-4">Community Rating</div>
              <div className="text-4xl font-pixel text-white mb-2">{game.rating}</div>
              <div className="flex justify-center gap-1 mb-6">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className={cn("w-4 h-4", i <= Math.floor(game.rating) ? "text-neon-gold fill-neon-gold" : "text-white/10")} />
                ))}
              </div>
              <PixelButton variant="gold" className="w-full text-xs">RATE THIS GAME</PixelButton>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}

import { cn } from '@/lib/utils';
