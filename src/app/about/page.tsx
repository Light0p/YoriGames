import React from 'react';
import { Metadata } from 'next';
import { SpaceBackground } from '@/components/layout/SpaceBackground';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Gamepad2, Rocket, Heart, Zap } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us | YoriGames',
  description: 'Learn about YoriGames, our mission to bring back the golden age of arcade gaming with a modern twist.',
  alternates: {
    canonical: '/about',
  },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <SpaceBackground />
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-24 sm:px-8">
        <div className="text-center mb-20">
          <div className="font-pixel text-[10px] text-neon-cyan uppercase tracking-widest mb-4">OUR MISSION</div>
          <h1 className="font-pixel text-4xl sm:text-6xl text-white uppercase tracking-tighter mb-6">
            PIXEL <span className="text-neon-cyan">POWERED</span>
          </h1>
          <p className="font-headline text-xl text-muted uppercase max-w-2xl mx-auto">
            Bringing the magic of the arcade back to your browser.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
          <div className="space-y-8">
            <h2 className="font-pixel text-2xl text-white uppercase leading-tight">What is YoriGames?</h2>
            <div className="font-body text-muted space-y-6 leading-relaxed">
              <p>
                YoriGames is a passion project dedicated to the art of pixelated gameplay. In an era of massive downloads and complex installations, we believe in the power of "Click and Play".
              </p>
              <p>
                Our platform hosts a curated collection of high-quality indie games that run directly in your browser. No downloads, no hassle—just pure, unadulterated fun.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <div className="bg-[#140A2E] border-2 border-neon-cyan p-4 flex items-center gap-3">
                <Zap className="w-5 h-5 text-neon-cyan" />
                <span className="font-pixel text-[8px] text-white uppercase">INSTANT PLAY</span>
              </div>
              <div className="bg-[#140A2E] border-2 border-neon-pink p-4 flex items-center gap-3">
                <Heart className="w-5 h-5 text-neon-pink" />
                <span className="font-pixel text-[8px] text-white uppercase">COMMUNITY DRIVEN</span>
              </div>
            </div>
          </div>
          <div className="relative aspect-video bg-[#140A2E] border-4 border-[#1B123D] shadow-[8px_8px_0_0_#000] overflow-hidden flex items-center justify-center">
            <Gamepad2 className="w-24 h-24 text-neon-cyan opacity-20 animate-pulse" />
            <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/10 to-transparent" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Retro Modern",
              icon: <Rocket className="w-8 h-8 text-neon-purple" />,
              desc: "We blend classic pixel aesthetics with modern web technologies for a seamless experience."
            },
            {
              title: "Indie Support",
              icon: <Zap className="w-8 h-8 text-neon-gold" />,
              desc: "A platform designed by developers for developers, ensuring indie voices are heard."
            },
            {
              title: "Galaxy Wide",
              icon: <Gamepad2 className="w-8 h-8 text-neon-cyan" />,
              desc: "Available on all devices, from mobile to ultra-wide desktops, across the entire digital galaxy."
            }
          ].map((item, i) => (
            <div key={i} className="bg-[#140A2E] border-2 border-[#1B123D] p-10 hover:border-neon-cyan transition-colors group">
              <div className="mb-6 group-hover:scale-110 transition-transform">{item.icon}</div>
              <h3 className="font-pixel text-xs text-white uppercase mb-4">{item.title}</h3>
              <p className="font-body text-sm text-muted leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </main>
  );
}
