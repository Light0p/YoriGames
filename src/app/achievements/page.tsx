import React from 'react';
import { SpaceBackground } from '@/components/layout/SpaceBackground';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Star, Lock, Boxes } from 'lucide-react';

export const metadata = {
  title: 'Achievements | YoriGames',
  description: 'Track your gaming milestones and unlock rare medals.',
};

export default function AchievementsPage() {
  return (
    <main className="min-h-screen">
      <SpaceBackground />
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-24 sm:px-8">
        <div className="text-center mb-16">
          <div className="font-pixel text-[10px] text-neon-gold uppercase tracking-widest mb-4">PERSONAL RECORDS</div>
          <h1 className="font-pixel text-4xl sm:text-6xl text-white uppercase tracking-tighter mb-6">
            ACHIEVE<span className="text-neon-gold">MENTS</span>
          </h1>
          <p className="font-headline text-xl text-muted uppercase max-w-2xl mx-auto">
            Document your journey through the pixelated stars.
          </p>
        </div>

        <div className="max-w-4xl mx-auto bg-[#140A2E] border-4 border-[#1B123D] p-12 shadow-[8px_8px_0_0_#000] relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-neon-gold/5 to-transparent pointer-events-none" />
          
          <div className="flex flex-col items-center py-10">
            <div className="relative mb-8">
              <Boxes className="w-20 h-20 text-neon-gold animate-pulse" />
              <div className="absolute -top-4 -right-4">
                <Star className="w-8 h-8 text-neon-gold animate-spin-slow fill-neon-gold/20" />
              </div>
            </div>
            
            <h2 className="font-pixel text-xl text-white uppercase mb-4">Database Initializing...</h2>
            
            <div className="w-full max-w-md h-2 bg-[#09061B] border border-[#1B123D] mb-8 overflow-hidden">
              <div className="h-full bg-neon-gold animate-loading-bar" />
            </div>

            <div className="flex items-center gap-3 bg-neon-gold/10 border border-neon-gold/30 px-4 py-2 mb-8">
              <Lock className="w-4 h-4 text-neon-gold" />
              <span className="font-pixel text-[8px] text-neon-gold uppercase">VAULT STATUS: ENCRYPTED</span>
            </div>

            <p className="font-body text-muted text-center max-w-md uppercase tracking-tight text-sm leading-relaxed">
              Milestone tracking and reward distribution systems are under final calibration. Unlockable badges coming in Sector 9 update.
            </p>

            <div className="mt-12 flex flex-col gap-4 w-full max-w-xs">
               <div className="h-12 bg-[#1B123D] border border-white/5 flex items-center px-4 gap-4 opacity-30">
                 <div className="w-6 h-6 bg-white/10 rounded-none" />
                 <div className="h-2 flex-1 bg-white/10 rounded-none" />
               </div>
               <div className="h-12 bg-[#1B123D] border border-white/5 flex items-center px-4 gap-4 opacity-20">
                 <div className="w-6 h-6 bg-white/10 rounded-none" />
                 <div className="h-2 flex-1 bg-white/10 rounded-none" />
               </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}