import React from 'react';
import { Metadata } from 'next';
import { SpaceBackground } from '@/components/layout/SpaceBackground';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { GameCard } from '@/components/pixel/GameCard';
import gamesData from '@/data/games.json';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Game Categories | YoriGames',
  description: 'Browse games by category. Action, Arcade, Platformer, and more.',
  alternates: {
    canonical: '/categories',
  },
};

export default function CategoriesPage() {
  const categories = Array.from(new Set(gamesData.map(g => g.category)));

  return (
    <main className="min-h-screen">
      <SpaceBackground />
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-8">
        <h1 className="font-pixel text-4xl text-white uppercase mb-12 text-center">Browse by <span className="text-neon-pink">Category</span></h1>
        
        <div className="space-y-20">
          {categories.map(cat => {
            const catGames = gamesData.filter(g => g.category === cat);
            return (
              <section key={cat}>
                <div className="flex items-center justify-between mb-8 border-b-2 border-[#1B123D] pb-4">
                  <h2 className="font-pixel text-2xl text-white uppercase">{cat}</h2>
                  <span className="font-pixel text-[10px] text-muted">{catGames.length} Games</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                  {catGames.map(game => (
                    <Link key={game.id} href={`/games/${game.slug}`}>
                      <GameCard 
                        title={game.title}
                        genre={game.category}
                        rating={game.rating}
                        imageUrl={game.thumbnail}
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
