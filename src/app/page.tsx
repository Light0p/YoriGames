import React from 'react';
import { SpaceBackground } from '@/components/layout/SpaceBackground';
import { Navbar } from '@/components/layout/Navbar';
import { Hero } from '@/components/sections/Hero';
import { GameStrip } from '@/components/sections/GameStrip';
import { Footer } from '@/components/layout/Footer';
import { getFeaturedGames, getTrendingGames, getNewArrivals, getDiscoveryGames } from '@/lib/games';
import { ArcadeInsightWrapper } from '@/components/ai/ArcadeInsightWrapper';
import { YourArcade } from '@/components/sections/YourArcade';
import { ClientEnhancements } from '@/components/layout/ClientEnhancements';

export default async function Home() {
  // Parallel fetch using server-side caching (ISR)
  // We fetch a larger pool of discovery games to allow for quality randomization on the client.
  const [featuredGames, trendingGames, newGames, discoveryPool] = await Promise.all([
    getFeaturedGames(8),
    getTrendingGames(100), // Larger pool for randomization
    getNewArrivals(100),   // Larger pool for randomization
    getDiscoveryGames(100)
  ]);

  return (
    <main className="min-h-screen">
      <SpaceBackground />
      <Navbar />
      
      <Hero />

      <div className="relative z-10 -mt-10">
        <ClientEnhancements>
          <YourArcade />
        </ClientEnhancements>

        <section aria-label="Newest Additions">
          <GameStrip 
            title="New Arrivals" 
            category="LATEST" 
            games={newGames} 
            viewAllHref="/games/"
            randomize={true}
          />
        </section>
        
        <section aria-label="Community Favorites">
          <GameStrip 
            title="Trending" 
            category="POPULAR" 
            games={trendingGames} 
            viewAllHref="/trending/"
            randomize={true}
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
            viewAllHref="/arcade/"
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

export const revalidate = 3600;
