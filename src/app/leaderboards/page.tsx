import React from 'react';
import { SpaceBackground } from '@/components/layout/SpaceBackground';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Trophy, ShieldAlert, Cpu } from 'lucide-react';

export const metadata = {
  title: 'Leaderboards | YoriGames',
  description: 'Check the highest scores across the galaxy.',
};

export default function LeaderboardsPage() {
  return (
    <main className="min-h-screen">
      <SpaceBackground />
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-24 sm:px-8">
        <div className="text-center mb-16">
          <div className="font-pixel text-[10px] text-neon-pink uppercase tracking-widest mb-4">HALL OF FAME</div>
          <h1 className="font-pixel text-4xl sm:text-6xl text-white uppercase tracking-tighter mb-6">
            LEADER<span className="text-neon-pink">BOARDS</span>
          </h1>
          <p className="font-headline text-xl text-muted uppercase max-w-2xl mx-auto">
            The elite players of the universe gathered in one place.
          </p>
        </div>

        <div className="max-w-4xl mx-auto bg-[#140A2E] border-4 border-[#1B123D] p-12 shadow-[8px_8px_0_0_#000] relative overflow-hidden group">
          {/* Decorative Corner Pixels */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-neon-pink" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-neon-pink" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-neon-pink" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-neon-pink" />

          <div className="flex flex-col items-center py-10">
            <div className="relative mb-8">
              <Cpu className="w-20 h-20 text-neon-pink animate-pulse" />
              <div className="absolute inset-0 bg-neon-pink/20 blur-2xl rounded-full animate-pulse-glow" />
            </div>
            
            <h2 className="font-pixel text-xl text-white uppercase mb-4">Data Uplink In Progress...</h2>
            
            <div className="w-full max-w-md h-2 bg-[#09061B] border border-[#1B123D] mb-8 overflow-hidden">
              <div className="h-full bg-neon-pink animate-loading-bar" />
            </div>

            <div className="flex items-center gap-3 bg-neon-pink/10 border border-neon-pink/30 px-4 py-2 mb-8">
              <ShieldAlert className="w-4 h-4 text-neon-pink" />
              <span className="font-pixel text-[8px] text-neon-pink uppercase">STATUS: INITIALIZING SYNC</span>
            </div>

            <p className="font-body text-muted text-center max-w-md uppercase tracking-tight text-sm leading-relaxed">
              We are currently synchronizing global score databases. Estimated completion: Sector 7 deployment.
            </p>

            <div className="mt-12 grid grid-cols-2 gap-4 w-full opacity-40">
              <div className="bg-[#1B123D] p-4 border border-white/5 flex flex-col items-center">
                <Trophy className="w-6 h-6 text-neon-gold mb-2" />
                <span className="font-pixel text-[8px] text-white">DAILY TOP 100</span>
              </div>
              <div className="bg-[#1B123D] p-4 border border-white/5 flex flex-col items-center">
                <Trophy className="w-6 h-6 text-neon-cyan mb-2" />
                <span className="font-pixel text-[8px] text-white">ALL-TIME LEGENDS</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}