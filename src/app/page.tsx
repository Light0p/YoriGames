
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
    { name: 'Action', color: 'hover:border-neon-pink hover:bg-neon-pink/10', description: 'High-octane battles and reflex-testing challenges.' },
    { name: 'RPG', color: 'hover:border-neon-purple hover:bg-neon-purple/10', description: 'Deep narratives and character-driven adventures.' },
    { name: 'Puzzle', color: 'hover:border-neon-cyan hover:bg-neon-cyan/10', description: 'Brain-teasing logic and geometric satisfaction.' },
    { name: 'Sports', color: 'hover:border-neon-gold hover:bg-neon-gold/10', description: 'Competitive athletics in glorious pixel art.' },
    { name: 'Racing', color: 'hover:border-neon-pink hover:bg-neon-pink/10', description: 'Speed across the stars in retro-style vehicles.' },
    { name: 'Adventure', color: 'hover:border-neon-cyan hover:bg-neon-cyan/10', description: 'Explore vast worlds and uncover hidden secrets.' },
  ];

  return (
    <main className="min-h-screen">
      <SpaceBackground />
      <Navbar />
      
      <Hero />

      <div className="relative z-10 -mt-20">
        <section aria-label="Newest Additions">
          <GameStrip title="New Arrivals" category="LATEST" games={newGames} />
        </section>
        
        <section aria-label="Community Favorites">
          <GameStrip title="Trending Now" category="POPULAR" games={trendingGames} />
        </section>

        <section className="py-20 px-4" aria-label="AI Search Tool">
          <ArcadeInsightWrapper />
        </section>

        <section aria-label="Curated Hits">
          <GameStrip title="Featured Hits" category="FEATURED" games={featuredGames} />
        </section>

        <div className="w-full py-12 flex justify-center opacity-20 overflow-hidden" aria-hidden="true">
          <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-neon-purple to-transparent" />
        </div>

        <section className="py-24 px-4 sm:px-8">
          <div className="mx-auto max-w-7xl">
             <div className="text-center mb-16">
               <div className="font-pixel text-[8px] text-neon-cyan uppercase mb-4 tracking-[0.4em]">EXPLORE UNIVERSE</div>
               <h2 className="font-pixel text-3xl text-white uppercase tracking-tighter">Browse Categories</h2>
               <p className="font-body text-muted mt-4 max-w-2xl mx-auto">
                 Find your next mission by exploring our specialized game sectors.
               </p>
             </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
               {categories.map((cat) => (
                 <Link 
                   key={cat.name} 
                   href={`/categories/${cat.name.toLowerCase()}`} 
                   className={cn(
                     "p-8 bg-[#1B123D] border-2 border-[#140A2E] transition-all group relative overflow-hidden",
                     cat.color
                   )}
                 >
                   <div className="relative z-10">
                     <h3 className="font-pixel text-xs text-white uppercase group-hover:text-white transition-colors mb-2">
                       {cat.name}
                     </h3>
                     <p className="font-body text-xs text-muted leading-relaxed">
                       {cat.description}
                     </p>
                   </div>
                   <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
                     <span className="font-pixel text-4xl">{cat.name.charAt(0)}</span>
                   </div>
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
