
import React from 'react';
import { Metadata } from 'next';
import { SpaceBackground } from '@/components/layout/SpaceBackground';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'About Us | YoriGames',
  description: 'The story behind YoriGames—a solo developer project dedicated to fast browser gaming.',
  alternates: {
    canonical: '/about',
  },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#0d051c] text-gray-300 font-pixel py-16 px-4 relative overflow-x-hidden">
      <SpaceBackground />
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-24 relative z-10">
        {/* Hero Section */}
        <section className="text-center mb-24" aria-labelledby="about-heading">
          <h1 id="about-heading" className="text-3xl sm:text-5xl text-[#EC4899] uppercase tracking-tighter mb-8 [text-shadow:4px_4px_0px_#00f0ff]">
            ABOUT YORIGAMES
          </h1>
          <p className="font-headline text-xl sm:text-2xl text-[#00f0ff] uppercase max-w-3xl mx-auto leading-relaxed">
            A passion project dedicated to bringing high-performance, zero-install browser games to everyone.
          </p>
        </section>

        {/* The Developer Section */}
        <section className="max-w-4xl mx-auto mb-32" aria-labelledby="dev-heading">
          <div className="bg-[#110822] border-4 border-[#2a1744] p-8 sm:p-12 rounded-none shadow-[12px_12px_0_0_#000] relative overflow-hidden group">
            {/* Design Accent */}
            <div className="absolute top-0 left-0 w-full h-1 bg-[#EC4899]" />
            
            <div className="flex flex-col md:flex-row gap-10 items-center md:items-start relative z-10">
              <div className="w-24 h-24 bg-[#0d051c] border-2 border-[#2a1744] flex-shrink-0 flex items-center justify-center" aria-hidden="true">
                 <span className="text-2xl text-[#00f0ff] animate-pulse">Y</span>
              </div>
              
              <div className="flex-1">
                <h2 id="dev-heading" className="text-lg text-[#EC4899] uppercase mb-8 border-b-2 border-[#2a1744] pb-4 inline-block tracking-wider">
                  Yogesh - Solo Developer
                </h2>
                <p className="font-body text-base sm:text-lg leading-relaxed text-gray-300 normal-case">
                  I'm the solo developer behind YoriGames. I balance building this project alongside my college studies and a corporate night shift job. What started as a fun way to kill boredom quickly turned into an addictive hobby of creating fast, accessible web experiences. No massive team, just pure love for coding and retro games.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Core Features Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16" aria-label="Core platform features">
          {[
            {
              title: "Instant Play",
              desc: "No downloads required",
              border: "hover:border-[#00f0ff]"
            },
            {
              title: "Pure Pixels",
              desc: "Authentic arcade aesthetics",
              border: "hover:border-[#EC4899]"
            },
            {
              title: "Built for Fun",
              desc: "Constantly updated with new projects and ideas",
              border: "hover:border-[#00ff41]"
            }
          ].map((feature, i) => (
            <article key={i} className={`bg-[#110822] border-2 border-[#2a1744] p-10 rounded-none text-center transition-all shadow-[6px_6px_0_0_#000] active:translate-y-1 active:shadow-none ${feature.border}`}>
              <h3 className="text-[10px] text-white mb-6 uppercase tracking-[0.2em]">{feature.title}</h3>
              <div className="w-12 h-px bg-[#2a1744] mx-auto mb-6" aria-hidden="true" />
              <p className="font-body text-sm text-gray-400 uppercase tracking-tight leading-relaxed">
                {feature.desc}
              </p>
            </article>
          ))}
        </section>
      </div>

      <Footer />
    </main>
  );
}
