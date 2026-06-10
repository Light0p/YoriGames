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
    { name: 'Action', color: 'hover:border-neon-pink hover:bg-neon-pink/5', description: 'Fast-paced challenges and reflex-testing gameplay.' },
    { name: 'RPG', color: 'hover:border-neon-purple hover:bg-neon-purple/5', description: 'Narratives and character-driven indie adventures.' },
    { name: 'Puzzle', color: 'hover:border-neon-cyan hover:bg-neon-cyan/5', description: 'Brain-teasing logic and geometric satisfaction.' },
    { name: 'Sports', color: 'hover:border-neon-gold hover:bg-neon-gold/5', description: 'Competitive athletics in glorious pixel art.' },
    { name: 'Racing', color: 'hover:border-neon-pink hover:bg-neon-pink/5', description: 'Speed across retro-style tracks and stars.' },
    { name: 'Adventure', color: 'hover:border-neon-cyan hover:bg-neon-cyan/5', description: 'Explore simple worlds and uncover secrets.' },
  ];

  return (
    <main className="min-h-screen">
      <SpaceBackground />
      <Navbar />
      
      <Hero />

      <div className="relative z-10 -mt-10">
        <section aria-label="Newest Additions">
          <GameStrip title="New Arrivals" category="LATEST" games={newGames} />
        </section>
        
        <section aria-label="Community Favorites">
          <GameStrip title="Trending" category="POPULAR" games={trendingGames} />
        </section>

        <section className="py-20 px-4" aria-label="AI Search Tool">
          <ArcadeInsightWrapper />
        </section>

        <section aria-label="Curated Hits">
          <GameStrip title="Featured" category="CURATED" games={featuredGames} />
        </section>

        <div className="w-full py-16 flex justify-center opacity-10 overflow-hidden" aria-hidden="true">
          <div className="w-full h-px bg-gradient-to-r from-transparent via-white to-transparent" />
        </div>

        <section className="py-24 px-6 sm:px-8">
          <div className="mx-auto max-w-7xl">
             <div className="text-center mb-16">
               <div className="font-pixel text-[8px] text-neon-cyan uppercase mb-4 tracking-[0.4em]">EXPLORE SECTORS</div>
               <h2 className="font-pixel text-2xl sm:text-3xl text-white uppercase tracking-tighter">Browse by Category</h2>
               <p className="font-body text-muted mt-4 max-w-2xl mx-auto">
                 Find your next session by exploring our specialized game collections.
               </p>
             </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
               {categories.map((cat) => (
                 <Link 
                   key={cat.name} 
                   href={`/categories/${cat.name.toLowerCase()}`} 
                   className={cn(
                     "p-8 bg-[#140A2E] border border-[#1B123D] transition-all group relative overflow-hidden",
                     cat.color
                   )}
                 >
                   <div className="relative z-10">
                     <h3 className="font-pixel text-xs text-white uppercase mb-2">
                       {cat.name}
                     </h3>
                     <p className="font-body text-xs text-muted leading-relaxed">
                       {cat.description}
                     </p>
                   </div>
                   <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                     <span className="font-pixel text-3xl">{cat.name.charAt(0)}</span>
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
