import React from 'react';
import { SpaceBackground } from '@/components/layout/SpaceBackground';
import { Navbar } from '@/components/layout/Navbar';
import { Hero } from '@/components/sections/Hero';
import { GameStrip } from '@/components/sections/GameStrip';
import { Footer } from '@/components/layout/Footer';
import { getFeaturedGames, getTrendingGames, getNewArrivals, getDiscoveryGames } from '@/lib/games';
import { ArcadeInsightWrapper } from '@/components/ai/ArcadeInsightWrapper';

export default async function Home() {
  // Optimized Parallel fetch using ISR to minimize hits on request
  const [featuredGames, trendingGames, newGames, discoveryGames] = await Promise.all([
    getFeaturedGames(8),
    getTrendingGames(8),
    getNewArrivals(8),
    getDiscoveryGames(100)
  ]);

  return (
    <main className="min-h-screen">
      <SpaceBackground />
      <Navbar />
      
      <Hero />

      <div className="relative z-10 -mt-10">
        <section aria-label="Newest Additions">
          <GameStrip 
            title="New Arrivals" 
            category="LATEST" 
            games={newGames} 
            viewAllHref="/games"
          />
        </section>
        
        <section aria-label="Community Favorites">
          <GameStrip 
            title="Trending" 
            category="POPULAR" 
            games={trendingGames} 
            viewAllHref="/trending"
          />
        </section>

        <section className="py-20 px-4" aria-label="AI Search Tool">
          <ArcadeInsightWrapper />
        </section>

        <section aria-label="Curated Hits" className="mb-20">
          <GameStrip 
            title="Featured" 
            category="CURATED" 
            games={featuredGames} 
            viewAllHref="/arcade"
          />
        </section>

        <div className="w-full py-16 flex justify-center opacity-10 overflow-hidden" aria-hidden="true">
          <div className="w-full h-px bg-gradient-to-r from-transparent via-white to-transparent" />
        </div>
      </div>

      <Footer />
    </main>
  );
}

// 🚀 REVALIDATION: ISR Caching - Fetches data once per hour instead of every request.
export const revalidate = 3600;
