import React from 'react';
import { SpaceBackground } from '@/components/layout/SpaceBackground';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export const metadata = {
  title: 'Privacy Policy | YoriGames',
  description: 'How we handle your transmission data.',
};

export default function PrivacyPage() {
  const lastUpdated = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <main className="min-h-screen">
      <SpaceBackground />
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-24">
        <h1 className="font-pixel text-4xl sm:text-6xl text-white uppercase tracking-tighter mb-8">
          PRIVACY <span className="text-neon-cyan">POLICY</span>
        </h1>
        
        <div className="bg-[#140A2E] border-4 border-[#1B123D] p-8 sm:p-16 shadow-[8px_8px_0_0_#000]">
          <div className="font-pixel text-[10px] text-neon-cyan uppercase mb-12 border-b border-[#1B123D] pb-4">
            Last Updated: {lastUpdated}
          </div>

          <div className="font-body text-muted space-y-12">
            <section>
              <h2 className="font-pixel text-xs text-white uppercase mb-6 tracking-widest">1. Data Transmission</h2>
              <p className="leading-relaxed">
                At YoriGames, we prioritize the security of your digital footprint. We collect minimal information required to provide our gaming services, including your Call Sign (username), encrypted credentials, and orbital coordinates (IP address) for regional game server optimization.
              </p>
            </section>

            <section>
              <h2 className="font-pixel text-xs text-white uppercase mb-6 tracking-widest">2. High Score Synchronization</h2>
              <p className="leading-relaxed">
                When you play games on our platform, we record performance metrics such as high scores, achievements, and play duration. this data is publicly visible on our global Leaderboards unless you explicitly set your profile to "Stealth Mode" in your Dossier settings.
              </p>
            </section>

            <section>
              <h2 className="font-pixel text-xs text-white uppercase mb-6 tracking-widest">3. Analytics & telemetry</h2>
              <p className="leading-relaxed">
                We utilize chiptune telemetry (analytics) to understand which sectors of our galaxy are most popular. This includes browser type, device information, and game interaction events. We do not sell this data to third-party corporate entities.
              </p>
            </section>

            <section>
              <h2 className="font-pixel text-xs text-white uppercase mb-6 tracking-widest">4. Sub-Processor Security</h2>
              <p className="leading-relaxed">
                We employ trusted sub-processors for cloud hosting and authentication services (Google Firebase). Your data is protected by military-grade encryption during transit and at rest within their secure data vaults.
              </p>
            </section>

            <section>
              <h2 className="font-pixel text-xs text-white uppercase mb-6 tracking-widest">5. Your Digital Rights</h2>
              <p className="leading-relaxed">
                You retain the right to self-destruct your account at any time. Upon deletion, all personal identifiers are purged from our active systems within 30 orbital cycles, though some anonymized high score data may persist for platform integrity.
              </p>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}