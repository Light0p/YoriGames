import React from 'react';
import { SpaceBackground } from '@/components/layout/SpaceBackground';
import { Navbar } from '@/components/layout/Navbar';
import { Hero } from '@/components/sections/Hero';
import { GameStrip } from '@/components/sections/GameStrip';
import { ArcadeInsightTool } from '@/components/ai/ArcadeInsightTool';
import { Footer } from '@/components/layout/Footer';

export default function Home() {
  return (
    <main className="min-h-screen selection:bg-neon-purple selection:text-white">
      <SpaceBackground />
      <Navbar />
      
      {/* Hero Title Screen */}
      <Hero />

      {/* Floating Panel Layout Container */}
      <div className="relative z-10 -mt-20">
        
        {/* Strip 1: Featured */}
        <GameStrip title="Trending Now" category="POPULAR" />

        {/* AI Tool Section */}
        <section className="py-20 px-4">
          <ArcadeInsightTool />
        </section>

        {/* Strip 2: Recently Added */}
        <GameStrip title="Recently Added" category="NEW ARRIVALS" />

        {/* Visual Break / Divider */}
        <div className="w-full py-12 flex justify-center opacity-20 overflow-hidden">
          <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-neon-purple to-transparent" />
        </div>

        {/* Strip 3: Recommended for you */}
        <GameStrip title="Curated Picks" category="RECOMMENDED" />

        {/* Category Browsing Mini Section */}
        <section className="py-24 px-4 sm:px-8">
          <div className="mx-auto max-w-7xl">
             <div className="text-center mb-12">
               <div className="font-pixel text-[8px] text-neon-cyan uppercase mb-4">EXPLORE UNIVERSE</div>
               <h2 className="font-pixel text-3xl text-white uppercase">Browse Categories</h2>
             </div>
             <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
               {['Action', 'RPG', 'Puzzle', 'Sports', 'Racing', 'Strategy'].map((cat) => (
                 <button key={cat} className="h-20 bg-[#1B123D] border-2 border-[#140A2E] font-pixel text-xs text-white hover:border-neon-purple hover:bg-neon-purple/10 transition-all uppercase group">
                   <span className="group-hover:scale-110 transition-transform block">{cat}</span>
                 </button>
               ))}
             </div>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}
