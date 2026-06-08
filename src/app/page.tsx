
import React from 'react';
import { SpaceBackground } from '@/components/layout/SpaceBackground';
import { Navbar } from '@/components/layout/Navbar';
import { Hero } from '@/components/sections/Hero';
import { GameStrip } from '@/components/sections/GameStrip';
import { Footer } from '@/components/layout/Footer';
import { getFeaturedGames, getTrendingGames, getNewArrivals } from '@/lib/games';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ArcadeInsightWrapper } from '@/components/ai/ArcadeInsightWrapper';

export default function Home() {
  const featuredGames = getFeaturedGames();
  const trendingGames = getTrendingGames();
  const newGames = getNewArrivals();

  const categories = [
    { name: 'Action', color: 'hover:border-neon-pink hover:bg-neon-pink/10' },
    { name: 'RPG', color: 'hover:border-neon-purple hover:bg-neon-purple/10' },
    { name: 'Puzzle', color: 'hover:border-neon-cyan hover:bg-neon-cyan/10' },
    { name: 'Sports', color: 'hover:border-neon-gold hover:bg-neon-gold/10' },
    { name: 'Racing', color: 'hover:border-neon-pink hover:bg-neon-pink/10' },
    { name: 'Adventure', color: 'hover:border-neon-cyan hover:bg-neon-cyan/10' },
  ];

  return (
    <main className="min-h-screen selection:bg-neon-purple selection:text-white">
      <SpaceBackground />
      <Navbar />
      
      <Hero />

      <div className="relative z-10 -mt-20">
        <GameStrip title="New Arrivals" category="LATEST" games={newGames} />
        
        <GameStrip title="Trending Now" category="POPULAR" games={trendingGames} />

        <section className="py-20 px-4">
          <ArcadeInsightWrapper />
        </section>

        <GameStrip title="Featured Hits" category="FEATURED" games={featuredGames} />

        <div className="w-full py-12 flex justify-center opacity-20 overflow-hidden">
          <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-neon-purple to-transparent" />
        </div>

        <section className="py-24 px-4 sm:px-8">
          <div className="mx-auto max-w-7xl">
             <div className="text-center mb-12">
               <div className="font-pixel text-[8px] text-neon-cyan uppercase mb-4">EXPLORE UNIVERSE</div>
               <h2 className="font-pixel text-3xl text-white uppercase">Browse Categories</h2>
             </div>
             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
               {categories.map((cat) => (
                 <Link 
                   key={cat.name} 
                   href={`/categories/${cat.name.toLowerCase()}`} 
                   className={cn(
                     "h-24 bg-[#1B123D] border-2 border-[#140A2E] font-pixel text-[10px] text-white transition-all uppercase group flex flex-col items-center justify-center gap-2",
                     cat.color
                   )}
                 >
                   <span className="group-hover:scale-110 transition-transform block">{cat.name}</span>
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
