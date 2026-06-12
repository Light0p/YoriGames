import React from 'react';
import { SpaceBackground } from '@/components/layout/SpaceBackground';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Code, Terminal, Rocket, Globe, Share2, Boxes } from 'lucide-react';
import { PixelButton } from '@/components/pixel/PixelButton';

export const metadata = {
  title: 'Developers | YoriGames',
  description: 'Build and publish your pixel art games on the YoriGames platform.',
};

export default function DevelopersPage() {
  return (
    <main className="min-h-screen">
      <SpaceBackground />
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-24 sm:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16 mb-24">
          <div className="flex-1">
            <div className="font-pixel text-[10px] text-neon-cyan uppercase tracking-widest mb-4">ENGINEERING PORTAL</div>
            <h1 className="font-pixel text-4xl sm:text-6xl text-white uppercase tracking-tighter mb-8 leading-tight">
              Build for the <span className="text-neon-cyan text-glow">Galaxy</span>
            </h1>
            <p className="font-body text-lg text-muted leading-relaxed mb-10 max-w-xl">
              YoriGames provides high-performance SDKs and a distribution network designed specifically for indie pixel art creators. Reach millions of players instantly.
            </p>
            <div className="flex flex-wrap gap-6">
              <PixelButton variant="accent">GET THE SDK</PixelButton>
              <PixelButton variant="secondary">VIEW DOCS</PixelButton>
            </div>
          </div>
          <div className="flex-1 bg-[#140A2E] border-4 border-[#1B123D] p-10 relative">
             <div className="absolute -top-4 -left-4 w-12 h-12 bg-neon-cyan p-3 border-2 border-black">
               <Terminal className="w-full h-full text-black" />
             </div>
             <pre className="font-mono text-sm text-neon-cyan overflow-hidden opacity-80">
               <code>{`const yori = new YoriSDK({
  appId: 'NEXUS-7',
  debug: true
});

yori.on('ready', () => {
  yori.leaderboards.submit(1250);
});`}</code>
             </pre>
          </div>
        </div>

        <section className="mb-24">
          <h2 className="font-pixel text-2xl text-white uppercase mb-12 text-center">Development Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Universal SDK", icon: <Boxes className="w-8 h-8" />, desc: "Support for Unity, Godot, and pure JS/TS game engines." },
              { title: "Direct Upload", icon: <Rocket className="w-8 h-8" />, desc: "Deploy your game patches instantly through our developer console." },
              { title: "Analytics Kit", icon: <Share2 className="w-8 h-8" />, desc: "Real-time insights into player behavior and performance metrics." }
            ].map((item, i) => (
              <div key={i} className="bg-[#140A2E] border-2 border-[#1B123D] p-10 group hover:border-neon-cyan transition-colors">
                <div className="text-neon-cyan mb-6 group-hover:scale-110 transition-transform">{item.icon}</div>
                <h3 className="font-pixel text-xs text-white uppercase mb-4">{item.title}</h3>
                <p className="font-body text-sm text-muted leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-[#09061B] border-4 border-dashed border-[#1B123D] p-12 text-center">
           <h2 className="font-pixel text-xl text-white uppercase mb-6">Join the Community</h2>
           <p className="font-body text-muted mb-10 max-w-2xl mx-auto">
             Collaborate with thousands of other indie developers in our official dev community. Share tips, find artists, and showcase your latest builds.
           </p>
           <PixelButton variant="gold">JOIN THE DEV DISCORD</PixelButton>
        </section>
      </div>

      <Footer />
    </main>
  );
}
