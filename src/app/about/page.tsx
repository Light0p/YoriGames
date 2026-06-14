import React from 'react';
import { Metadata } from 'next';
import { SpaceBackground } from '@/components/layout/SpaceBackground';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Monitor, Shield, Activity, Info } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About | YoriGames',
  description: 'Company overview and organizational background for the YoriGames platform.',
  alternates: {
    canonical: '/about',
  },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <SpaceBackground />
      <Navbar />

      <section className="max-w-6xl mx-auto px-4 sm:px-8 py-10 sm:py-16 md:py-24" aria-label="About YoriGames">
        <div className="text-center mb-12 sm:mb-20">
          <div className="font-pixel text-[8px] sm:text-[10px] text-neon-cyan uppercase tracking-[0.5em] mb-4">Company Overview</div>
          <h1 className="font-pixel text-3xl sm:text-5xl md:text-6xl text-white uppercase tracking-tighter mb-6 leading-tight">
            ABOUT <span className="text-neon-cyan">YoriGames</span>
          </h1>
          <p className="font-headline text-base sm:text-xl text-muted uppercase max-w-2xl mx-auto leading-relaxed">
            Specializing in high-performance browser-based software solutions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16 items-start mb-20 sm:mb-32">
          <div className="space-y-6 sm:space-y-8">
            <h2 className="font-pixel text-base sm:text-lg text-white uppercase leading-tight border-l-4 border-neon-cyan pl-6">
            The Developer Note
            </h2>
            <div className="font-body text-sm sm:text-base text-muted space-y-6 leading-relaxed">
              <p>
                YoriGames is an independent software development project focused on the creation of optimized, browser-native applications. Our objective is to provide efficient digital experiences that require zero installation while maintaining high standards for security and accessibility.
              </p>
              <p>
                Established as a commitment to web technology innovation, the platform utilizes modern protocols to deliver seamless performance across diverse hardware configurations. Our development process prioritizes user privacy and technical stability above all else.
              </p>
            </div>
            <div className="flex flex-wrap gap-4 pt-4">
              <div className="bg-[#140A2E] border-2 border-[#1B123D] p-4 sm:p-5 flex items-center gap-4">
                <Monitor className="w-5 h-5 text-neon-cyan" />
                <span className="font-pixel text-[8px] sm:text-[9px] text-white uppercase">Optimized Web-Core</span>
              </div>
              <div className="bg-[#140A2E] border-2 border-[#1B123D] p-4 sm:p-5 flex items-center gap-4">
                <Shield className="w-5 h-5 text-neon-pink" />
                <span className="font-pixel text-[8px] sm:text-[9px] text-white uppercase">Privacy Compliant</span>
              </div>
            </div>
          </div>
          
          <div className="relative aspect-video bg-[#140A2E] border-4 border-[#1B123D] overflow-hidden flex flex-col items-center justify-center p-6 sm:p-8 text-center">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/5 to-transparent pointer-events-none" />
            
            <div className="mb-6 z-10 relative">
              <Info className="w-10 h-10 sm:w-12 h-12 text-neon-cyan opacity-80" />
            </div>

            <div className="font-pixel text-[8px] sm:text-[10px] text-white leading-loose z-10">
              <span className="text-neon-pink mr-2">DOC:</span>
              SYSTEM DOCUMENTATION CURRENTLY UNDER REVIEW
              <span className="animate-pulse inline-block ml-2 w-2 h-3 bg-neon-cyan align-middle"></span>
            </div>
          </div>
        </div>

        {/* Coming Soon Banner */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-[#140A2E] border-4 border-[#1B123D] p-8 sm:p-12 text-center relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neon-cyan to-transparent opacity-30" />
            
            <div className="flex items-center justify-center gap-3 mb-6">
              <Activity className="w-5 h-5 text-neon-cyan animate-pulse" />
              <h2 className="font-pixel text-lg sm:text-xl text-white uppercase tracking-tight">Future Developments</h2>
            </div>
            
            <p className="font-body text-sm sm:text-base text-muted mb-8 leading-relaxed">
              New platform features and performance optimizations are currently in the implementation phase. We are expanding our service offerings to include more robust cross-platform synchronization and advanced user preferences.
            </p>

            <div className="inline-block bg-[#09061B] border border-neon-cyan/30 px-4 py-2">
              <span className="font-pixel text-[8px] text-neon-cyan uppercase tracking-widest">Status: Active Development</span>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
