
import React from 'react';
import { SpaceBackground } from '@/components/layout/SpaceBackground';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { GameGrid } from '@/components/pixel/GameGrid';
import gamesData from '@/data/games.json';
import { Game } from '@/types/game';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const categoryName = slug.charAt(0).toUpperCase() + slug.slice(1);
  return {
    title: `${categoryName} Games | YoriGames`,
    description: `Browse the best ${categoryName} pixel-art games on YoriGames. Play instantly in your browser.`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug).toLowerCase();
  
  const games: Game[] = gamesData.filter(g => g.category.toLowerCase() === decodedSlug);
  
  if (games.length === 0) {
    // If no games, check if category exists at all in our data
    const allCategories = gamesData.map(g => g.category.toLowerCase());
    if (!allCategories.includes(decodedSlug)) {
       notFound();
    }
  }

  const categoryName = games[0]?.category || decodedSlug.charAt(0).toUpperCase() + decodedSlug.slice(1);

  return (
    <main className="min-h-screen">
      <SpaceBackground />
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-8">
        <div className="mb-12">
          <div className="font-pixel text-[8px] text-neon-cyan uppercase tracking-[0.2em] mb-4">CATEGORY</div>
          <h1 className="font-pixel text-4xl text-white uppercase mb-4">{categoryName}</h1>
          <p className="font-body text-muted max-w-2xl">
            Check out all our premium pixel-art games in the {categoryName} genre.
          </p>
        </div>

        <GameGrid games={games} />
      </div>

      <Footer />
    </main>
  );
}

export async function generateStaticParams() {
  const categories = Array.from(new Set(gamesData.map(g => g.category.toLowerCase())));
  return categories.map(slug => ({ slug }));
}
