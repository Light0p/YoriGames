
import React from 'react';
import { Metadata } from 'next';
import { SpaceBackground } from '@/components/layout/SpaceBackground';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Gamepad2, Rocket, Heart, Zap, Shield, Users } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Our Mission',
  description: 'Discover the story behind YoriGames. We are bringing the magic of arcade gaming back to the web with a modern, high-performance twist.',
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
        <div className="text-center mb-24">
          <div className="font-pixel text-[10px] text-neon-cyan uppercase tracking-[0.5em] mb-4">ESTABLISHED 2024</div>
          <h1 className="font-pixel text-4xl sm:text-7xl text-white uppercase tracking-tighter mb-8">
            PIXEL <span className="text-neon-cyan">EVOLUTION</span>
          </h1>
          <p className="font-headline text-xl text-muted uppercase max-w-3xl mx-auto leading-relaxed">
            Reclaiming the "Click and Play" era. We build bridges between the nostalgia of the past and the technology of the future.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-40">
          <div className="space-y-10">
            <h2 className="font-pixel text-2xl text-white uppercase leading-tight border-l-4 border-neon-cyan pl-6">The Yori Manifesto</h2>
            <div className="font-body text-lg text-muted space-y-8 leading-relaxed">
              <p>
                In a digital landscape cluttered with massive downloads, intrusive updates, and complex launchers, YoriGames stands as a sanctuary for the "Pure Player".
              </p>
              <p>
                Founded by Yogesh Yadav, our mission is simple: high-performance, browser-native gaming that respects your time and your hardware. We curate and develop premium indie titles that prove greatness doesn't require gigabytes—just great ideas and pixel-perfect execution.
              </p>
            </div>
            <div className="flex flex-wrap gap-6 pt-4">
              <div className="bg-[#140A2E] border-2 border-neon-cyan p-6 flex items-center gap-4 shadow-[4px_4px_0_0_rgba(34,211,238,0.2)]">
                <Zap className="w-6 h-6 text-neon-cyan" />
                <span className="font-pixel text-[10px] text-white uppercase">ZERO INSTALLS</span>
              </div>
              <div className="bg-[#140A2E] border-2 border-neon-pink p-6 flex items-center gap-4 shadow-[4px_4px_0_0_rgba(236,72,153,0.2)]">
                <Shield className="w-6 h-6 text-neon-pink" />
                <span className="font-pixel text-[10px] text-white uppercase">SECURE BY DESIGN</span>
              </div>
            </div>
          </div>
          <div className="relative aspect-square sm:aspect-video bg-[#140A2E] border-4 border-[#1B123D] shadow-[12px_12px_0_0_#000] overflow-hidden flex items-center justify-center">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10" />
            <Gamepad2 className="w-32 h-32 text-neon-cyan opacity-20 animate-pulse" />
            <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/5 to-transparent" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-32">
          {[
            {
              title: "Retro Future",
              icon: <Rocket className="w-10 h-10 text-neon-purple" />,
              desc: "Leveraging modern WebGL and HTML5 standards to deliver 60FPS pixel-art experiences without the friction of traditional apps."
            },
            {
              title: "Indie First",
              icon: <Users className="w-10 h-10 text-neon-gold" />,
              desc: "A platform designed specifically for independent creators. We provide the stage; they provide the magic."
            },
            {
              title: "Cross Link",
              icon: <Zap className="w-10 h-10 text-neon-cyan" />,
              desc: "Available across the entire digital spectrum. Mobile, tablet, or desktop—your saves and stats follow your profile."
            }
          ].map((item, i) => (
            <div key={i} className="bg-[#140A2E] border-2 border-[#1B123D] p-12 hover:border-neon-cyan transition-all group relative">
              <div className="mb-8 group-hover:scale-110 transition-transform origin-left">{item.icon}</div>
              <h3 className="font-pixel text-xs text-white uppercase mb-6 tracking-widest">{item.title}</h3>
              <p className="font-body text-base text-muted leading-relaxed">{item.desc}</p>
              <div className="absolute bottom-0 right-0 w-8 h-8 bg-white/5 group-hover:bg-neon-cyan/10 transition-colors" />
            </div>
          ))}
        </div>
        
        <div className="bg-[#09061B] border-4 border-dashed border-[#1B123D] p-16 text-center">
           <Heart className="w-12 h-12 text-neon-pink mx-auto mb-8 animate-pulse" />
           <h2 className="font-pixel text-xl text-white uppercase mb-6">Join the Revolution</h2>
           <p className="font-body text-lg text-muted mb-10 max-w-2xl mx-auto leading-relaxed">
             Help us build the next generation of web gaming. Whether you're a player, developer, or enthusiast, there's a seat for you at our table.
           </p>
        </div>
      </div>

      <Footer />
    </main>
  );
}
