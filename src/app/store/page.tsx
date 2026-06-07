
import React from 'react';
import { SpaceBackground } from '@/components/layout/SpaceBackground';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ShoppingBag, Sparkles } from 'lucide-react';
import { PixelButton } from '@/components/pixel/PixelButton';

export const metadata = {
  title: 'Store | YoriGames',
  description: 'Support indie developers and unlock premium skins, soundtracks, and more.',
};

export default function StorePage() {
  return (
    <main className="min-h-screen">
      <SpaceBackground />
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-24 sm:px-8 text-center">
        <div className="mb-8 inline-block p-4 bg-neon-gold/20 border-4 border-neon-gold">
          <ShoppingBag className="w-16 h-16 text-neon-gold" />
        </div>
        <h1 className="font-pixel text-5xl text-white uppercase mb-6 tracking-tighter">
          YORI <span className="text-neon-gold">STORE</span>
        </h1>
        <p className="font-headline text-2xl text-muted uppercase mb-12">
          Coming Soon: The Ultimate Digital Bazaar
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {[
            { title: "Exclusive Skins", desc: "Pixel-perfect character customization", icon: <Sparkles className="w-8 h-8" /> },
            { title: "Original OSTs", desc: "Digital high-quality chiptune soundtracks", icon: <Sparkles className="w-8 h-8" /> },
            { title: "Dev Support", desc: "Directly fund your favorite indie creators", icon: <Sparkles className="w-8 h-8" /> }
          ].map((item, i) => (
            <div key={i} className="bg-[#140A2E] border-2 border-[#1B123D] p-8 flex flex-col items-center group hover:border-neon-gold transition-all">
              <div className="text-neon-gold mb-4 group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <h3 className="font-pixel text-xs text-white uppercase mb-2">{item.title}</h3>
              <p className="font-body text-[10px] text-muted uppercase">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-16">
          <PixelButton variant="gold" size="lg">NOTIFY ME ON LAUNCH</PixelButton>
        </div>
      </div>

      <Footer />
    </main>
  );
}
