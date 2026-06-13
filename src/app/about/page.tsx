import React from 'react';
import { Metadata } from 'next';
import { SpaceBackground } from '@/components/layout/SpaceBackground';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Gamepad2, Rocket, Zap, Shield, Heart } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About | YoriGames',
  description: 'The story behind YoriGames—a project built for the love of browser gaming and pixel art.',
  alternates: {
    canonical: '/about',
  },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <SpaceBackground />
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-24">
          <div className="font-pixel text-[10px] text-neon-cyan uppercase tracking-[0.5em] mb-4">PROJECT ORIGIN</div>
          <h1 className="font-pixel text-4xl sm:text-6xl text-white uppercase tracking-tighter mb-8 leading-tight">
            PIXEL <span className="text-neon-cyan">PASSION</span>
          </h1>
          <p className="font-headline text-lg sm:text-xl text-muted uppercase max-w-2xl mx-auto leading-relaxed">
            Simple games. Fast loading. Built for fun.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-40">
          <div className="space-y-8">
            <h2 className="font-pixel text-lg text-white uppercase leading-tight border-l-4 border-neon-cyan pl-6">The Developer Note</h2>
            <div className="font-body text-base text-muted space-y-6 leading-relaxed">
              <p>
                YoriGames started as a personal challenge: to build a platform that strips away the bloat of modern gaming. No massive downloads, no intrusive updates—just clean, browser-native experiences that respect your time.
              </p>
              <p>
                Founded by Yogesh Yadav, this project is a growing collection of indie titles that prove greatness doesn't require gigabytes. It's about that "click and play" magic we used to have, rebuilt with modern web technologies.
              </p>
            </div>
            <div className="flex flex-wrap gap-4 pt-4">
              <div className="bg-[#140A2E] border-2 border-[#1B123D] p-5 flex items-center gap-4">
                <Zap className="w-5 h-5 text-neon-cyan" />
                <span className="font-pixel text-[9px] text-white uppercase">Zero Installs</span>
              </div>
              <div className="bg-[#140A2E] border-2 border-[#1B123D] p-5 flex items-center gap-4">
                <Shield className="w-5 h-5 text-neon-pink" />
                <span className="font-pixel text-[9px] text-white uppercase">Privacy First</span>
              </div>
            </div>
          </div>
          <div className="relative aspect-video bg-[#140A2E] border-4 border-[#1B123D] overflow-hidden flex items-center justify-center">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
            <Gamepad2 className="w-24 h-24 text-neon-cyan opacity-20" />
            <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/5 to-transparent" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
          {[
            {
              title: "Retro Modern",
              icon: <Rocket className="w-8 h-8 text-neon-purple" />,
              desc: "Using WebGL and HTML5 to deliver smooth pixel-art experiences without the friction of traditional apps."
            },
            {
              title: "Indie First",
              icon: <Heart className="w-8 h-8 text-neon-pink" />,
              desc: "A platform designed for simplicity. We focus on the games and the players, keeping things straightforward."
            },
            {
              title: "Cross Play",
              icon: <Zap className="w-8 h-8 text-neon-cyan" />,
              desc: "Whether you're on mobile, tablet, or desktop, your session is just a click away. No barriers to entry."
            }
          ].map((item, i) => (
            <div key={i} className="bg-[#140A2E] border-2 border-[#1B123D] p-10 hover:border-neon-cyan transition-all group">
              <div className="mb-6 group-hover:scale-105 transition-transform origin-left">{item.icon}</div>
              <h3 className="font-pixel text-[10px] text-white uppercase mb-4 tracking-wider">{item.title}</h3>
              <p className="font-body text-sm text-muted leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
        
        <div className="bg-[#09061B] border-4 border-dashed border-[#1B123D] p-12 text-center">
           <h2 className="font-pixel text-lg text-white uppercase mb-6">Join the Journey</h2>
           <p className="font-body text-base text-muted mb-8 max-w-xl mx-auto leading-relaxed">
             YoriGames is constantly evolving. If you're a player or a creator who shares this vision of simple, fun web gaming, there's always a seat for you.
           </p>
        </div>
      </div>

      <Footer />
    </main>
  );
}
