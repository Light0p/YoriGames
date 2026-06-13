import React from 'react';
import { SpaceBackground } from '@/components/layout/SpaceBackground';
import { Navbar } from '@/components/layout/Navbar';
import { Hero } from '@/components/sections/Hero';
import { GameStrip } from '@/components/sections/GameStrip';
import { Footer } from '@/components/layout/Footer';
import { getFeaturedGames, getTrendingGames, getNewArrivals, getDiscoveryGames } from '@/lib/games';
import { ArcadeInsightWrapper } from '@/components/ai/ArcadeInsightWrapper';
import { InteractiveArcade } from '@/components/sections/InteractiveArcade';

export default async function Home() {
  // Optimized Parallel fetch using ISR to minimize hits on request
  const [featuredGames, trendingGames, newGames, discoveryGames] = await Promise.all([
    getFeaturedGames(5),
    getTrendingGames(5),
    getNewArrivals(5),
    getDiscoveryGames(100) // Reduced from 300 to 100 to significantly save quota
  ]);

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

        {/* Quota-Safe Interactive Category Section */}
        <InteractiveArcade />

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
