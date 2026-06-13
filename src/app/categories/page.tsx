import React from 'react';
import { Metadata } from 'next';
import { SpaceBackground } from '@/components/layout/SpaceBackground';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { GameCard } from '@/components/pixel/GameCard';
import { getSearchableGames } from '@/lib/games';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Game Categories | YoriGames',
  description: 'Browse games by category. Action, Arcade, Platformer, and more.',
  alternates: {
    canonical: '/categories',
  },
};

export default async function CategoriesPage() {
  const gamesData = await getSearchableGames(1000);
  const categories = Array.from(new Set(gamesData.map(g => g.category)));

  return (
    <main className="min-h-screen">
      <SpaceBackground />
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-8">
        <div className="text-center mb-16">
          <div className="font-pixel text-[8px] text-neon-cyan uppercase tracking-[0.4em] mb-4">SECTOR DIRECTORY</div>
          <h1 className="font-pixel text-4xl text-white uppercase">Browse by <span className="text-neon-pink">Category</span></h1>
          <p className="font-body text-muted mt-4 max-w-2xl mx-auto leading-relaxed">
            Explore our curated selection of indie titles organized by genre. Choose a sector to begin your mission.
          </p>
        </div>
        
        <div className="space-y-24">
          {categories.map(cat => {
            const catGames = gamesData.filter(g => g.category === cat).slice(0, 10);
            return (
              <section key={cat} id={cat.toLowerCase()}>
                <div className="flex items-center gap-6 mb-8 border-b-2 border-[#1B123D] pb-6">
                  <h2 className="font-pixel text-2xl text-white uppercase tracking-tighter">{cat}</h2>
                  <div className="h-[2px] flex-1 bg-gradient-to-r from-[#1B123D] to-transparent" />
                  <div className="bg-[#140A2E] border-2 border-[#1B123D] px-3 py-1 font-pixel text-[8px] text-muted-foreground uppercase">
                    {gamesData.filter(g => g.category === cat).length} Games
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
                  {catGames.map(game => (
                    <Link key={game.id} href={`/games/${game.slug}`}>
                      <GameCard 
                        title={game.title}
                        genre={game.category}
                        rating={game.rating}
                        imageUrl={game.thumb || game.thumbnail}
                      />
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>

      <Footer />
    </main>
  );
}

export const revalidate = 3600;
