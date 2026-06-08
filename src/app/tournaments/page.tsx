import React from 'react';
import { SpaceBackground } from '@/components/layout/SpaceBackground';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Sword, Radio, Zap } from 'lucide-react';

export const metadata = {
  title: 'Tournaments | YoriGames',
  description: 'Join the galaxy\'s most competitive gaming events.',
};

export default function TournamentsPage() {
  return (
    <main className="min-h-screen">
      <SpaceBackground />
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-24 sm:px-8">
        <div className="text-center mb-16">
          <div className="font-pixel text-[10px] text-neon-cyan uppercase tracking-widest mb-4">COMPETITIVE OPS</div>
          <h1 className="font-pixel text-4xl sm:text-6xl text-white uppercase tracking-tighter mb-6">
            TOURNA<span className="text-neon-cyan">MENTS</span>
          </h1>
          <p className="font-headline text-xl text-muted uppercase max-w-2xl mx-auto">
            Stake your claim as the ultimate champion in scheduled events.
          </p>
        </div>

        <div className="max-w-4xl mx-auto bg-[#140A2E] border-4 border-[#1B123D] p-12 shadow-[8px_8px_0_0_#000] relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neon-cyan to-transparent opacity-30" />
          
          <div className="flex flex-col items-center py-10">
            <div className="relative mb-8">
              <Radio className="w-20 h-20 text-neon-cyan animate-bounce" style={{ animationDuration: '3s' }} />
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-16 h-2 bg-black/40 blur-sm rounded-full" />
            </div>
            
            <h2 className="font-pixel text-xl text-white uppercase mb-4">Tournament Servers Coming Online...</h2>
            
            <div className="w-full max-w-md h-2 bg-[#09061B] border border-[#1B123D] mb-8 overflow-hidden relative">
              <div className="h-full bg-neon-cyan animate-pulse" />
              <div className="absolute inset-0 bg-neon-cyan/20 animate-loading-bar" />
            </div>

            <div className="flex items-center gap-3 bg-neon-cyan/10 border border-neon-cyan/30 px-4 py-2 mb-8">
              <Zap className="w-4 h-4 text-neon-cyan" />
              <span className="font-pixel text-[8px] text-neon-cyan uppercase">LINK STATUS: HANDSHAKING</span>
            </div>

            <p className="font-body text-muted text-center max-w-md uppercase tracking-tight text-sm leading-relaxed">
              Regional battle nodes are currently initializing. Prepare your equipment for high-stakes competition.
            </p>

            <div className="mt-12 flex flex-wrap justify-center gap-8 w-full">
              <div className="flex items-center gap-4 group/item">
                <div className="w-12 h-12 bg-[#1B123D] border-2 border-neon-cyan flex items-center justify-center rotate-45 group-hover/item:scale-110 transition-transform">
                  <Sword className="w-6 h-6 text-neon-cyan -rotate-45" />
                </div>
                <div>
                  <div className="font-pixel text-[8px] text-white">1v1 DUELS</div>
                  <div className="font-pixel text-[6px] text-muted">COMING SOON</div>
                </div>
              </div>
              <div className="flex items-center gap-4 group/item">
                <div className="w-12 h-12 bg-[#1B123D] border-2 border-neon-pink flex items-center justify-center rotate-45 group-hover/item:scale-110 transition-transform">
                  <Sword className="w-6 h-6 text-neon-pink -rotate-45" />
                </div>
                <div>
                  <div className="font-pixel text-[8px] text-white">SQUAD BATTLES</div>
                  <div className="font-pixel text-[6px] text-muted">COMING SOON</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}