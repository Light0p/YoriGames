import React from 'react';
import { Metadata } from 'next';
import { SpaceBackground } from '@/components/layout/SpaceBackground';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { getFeaturedGames, getTotalGameCount } from '@/lib/games';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Categories | YoriGames Sector Directory',
  description: 'Select a mission sector to instantly filter the YoriGames archives.',
};

/**
 * Helper to map category names to representative images
 */
const getCategoryThumb = (category: string) => {
  const cat = category.toLowerCase();
  if (cat.includes('race') || cat.includes('car')) return { url: 'https://picsum.photos/seed/yori-race/400/250', hint: 'racing cars' };
  if (cat.includes('sport') || cat.includes('ball')) return { url: 'https://picsum.photos/seed/yori-sports/400/250', hint: 'sports pixels' };
  if (cat.includes('action') || cat.includes('shoot')) return { url: 'https://picsum.photos/seed/yori-action/400/250', hint: 'action combat' };
  if (cat.includes('adventure') || cat.includes('quest')) return { url: 'https://picsum.photos/seed/yori-adv/400/250', hint: 'adventure pixel' };
  if (cat.includes('io') || cat.includes('multi')) return { url: 'https://picsum.photos/seed/yori-io/400/250', hint: 'io games' };
  return { url: `https://picsum.photos/seed/yori-${cat}/400/250`, hint: `${cat} game` };
};

/**
 * CategoriesPage Server Component
 * Displays a directory of mission sectors.
 * Redirects users to paginated sector pages.
 */
export default async function CategoriesPage() {
  // We only fetch a small subset for representative data
  const sampleGames = await getFeaturedGames(500);
  const uniqueCategories = Array.from(new Set(sampleGames.map(g => g.category))).sort();

  return (
    <main className="min-h-screen flex flex-col">
      <SpaceBackground />
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-8 z-10 relative">
        <div className="text-center mb-16">
          <div className="font-pixel text-[8px] text-neon-cyan uppercase tracking-[0.4em] mb-4">SECTOR DIRECTORY</div>
          <h1 className="font-pixel text-3xl sm:text-5xl text-white uppercase tracking-tighter">
            Browse by <span className="text-neon-pink">Category</span>
          </h1>
          <p className="font-body text-muted mt-4 max-w-2xl mx-auto leading-relaxed">
            Select a mission sector to instantly filter the YoriGames archives.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {uniqueCategories.map((cat, i) => {
            const thumb = getCategoryThumb(cat);
            const slug = cat.toLowerCase().replace(/\s+/g, '-');
            
            return (
              <Link
                key={cat}
                href={`/categories/${slug}`}
                className={cn(
                  "group relative flex flex-col bg-[#140A2E] border-4 border-[#1B123D] transition-all duration-300",
                  "hover:-translate-y-2 hover:border-neon-cyan active:translate-y-0 shadow-[8px_8px_0_0_#000]"
                )}
              >
                <div className="relative w-full aspect-[16/10] overflow-hidden bg-black border-b-4 border-[#1B123D]">
                  <Image 
                    src={thumb.url}
                    alt={`${cat} Games Sector`}
                    fill
                    className="object-cover transition-all duration-500 group-hover:scale-110 opacity-60 grayscale group-hover:grayscale-0 group-hover:opacity-100"
                    sizes="(max-width: 768px) 50vw, 20vw"
                    data-ai-hint={thumb.hint}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#140A2E] via-transparent to-transparent opacity-80" />
                </div>
                
                <div className="p-6">
                  <h3 className="font-pixel text-xs text-white uppercase tracking-tighter text-left group-hover:text-neon-cyan transition-colors">
                    {cat}
                  </h3>
                  <div className="mt-2 font-pixel text-[6px] text-muted-foreground opacity-50 uppercase tracking-widest">
                    Enter Sector <span>→</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <Footer />
    </main>
  );
}

export const revalidate = 3600;
