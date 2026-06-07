
import React from 'react';
import { SpaceBackground } from '@/components/layout/SpaceBackground';
import { Navbar } from '@/components/layout/Navbar';
import { Hero } from '@/components/sections/Hero';
import { GameStrip } from '@/components/sections/GameStrip';
import { ArcadeInsightTool } from '@/components/ai/ArcadeInsightTool';
import { Footer } from '@/components/layout/Footer';
import gamesData from '@/data/games.json';

export default function Home() {
  const featuredGames = gamesData.filter(g => g.featured);
  const trendingGames = gamesData.filter(g => g.trending);

  return (
    <main className="min-h-screen selection:bg-neon-purple selection:text-white">
      <SpaceBackground />
      <Navbar />
      
      <Hero />

      <div className="relative z-10 -mt-20">
        
        <GameStrip title="Trending Now" category="POPULAR" games={trendingGames} />

        <section className="py-20 px-4">
          <ArcadeInsightTool />
        </section>

        <GameStrip title="Featured Hits" category="FEATURED" games={featuredGames} />

        <div className="w-full py-12 flex justify-center opacity-20 overflow-hidden">
          <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-neon-purple to-transparent" />
        </div>

        <GameStrip title="Curated Picks" category="RECOMMENDED" games={gamesData.slice(0, 5)} />

        <section className="py-24 px-4 sm:px-8">
          <div className="mx-auto max-w-7xl">
             <div className="text-center mb-12">
               <div className="font-pixel text-[8px] text-neon-cyan uppercase mb-4">EXPLORE UNIVERSE</div>
               <h2 className="font-pixel text-3xl text-white uppercase">Browse Categories</h2>
             </div>
             <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
               {['Action', 'RPG', 'Puzzle', 'Sports', 'Racing', 'Strategy'].map((cat) => (
                 <Link key={cat} href={`/categories?cat=${cat.toLowerCase()}`} className="h-20 bg-[#1B123D] border-2 border-[#140A2E] font-pixel text-xs text-white hover:border-neon-purple hover:bg-neon-purple/10 transition-all uppercase group flex items-center justify-center">
                   <span className="group-hover:scale-110 transition-transform block">{cat}</span>
                 </Link>
               ))}
             </div>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}

import Link from 'next/link';
