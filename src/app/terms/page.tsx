import React from 'react';
import { SpaceBackground } from '@/components/layout/SpaceBackground';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export const metadata = {
  title: 'Terms of Service | YoriGames',
  description: 'The rules of engagement for our arcade.',
};

export default function TermsPage() {
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
          TERMS OF <span className="text-neon-pink">SERVICE</span>
        </h1>
        
        <div className="bg-[#140A2E] border-4 border-[#1B123D] p-8 sm:p-16 shadow-[8px_8px_0_0_#000]">
          <div className="font-pixel text-[10px] text-neon-pink uppercase mb-12 border-b border-[#1B123D] pb-4">
            Last Updated: {lastUpdated}
          </div>

          <div className="font-body text-muted space-y-12">
            <section>
              <h2 className="font-pixel text-xs text-white uppercase mb-6 tracking-widest">1. Acceptance of Terms</h2>
              <p className="leading-relaxed">
                By accessing YoriGames, you agree to abide by these Rules of Engagement. If you do not agree to these terms, you are prohibited from entering our airspace.
              </p>
            </section>

            <section>
              <h2 className="font-pixel text-xs text-white uppercase mb-6 tracking-widest">2. Player Conduct</h2>
              <p className="leading-relaxed">
                Users must maintain a respectful chiptune environment. Cheating, exploiting engine bugs for high scores, and utilizing automated scripts (bots) is strictly forbidden and will result in immediate profile termination.
              </p>
            </section>

            <section>
              <h2 className="font-pixel text-xs text-white uppercase mb-6 tracking-widest">3. Intellectual Property</h2>
              <p className="leading-relaxed">
                The pixel art, chiptunes, and game code hosted on YoriGames are the property of their respective creators. You may not extract or re-distribute these assets without explicit authorization from the orbital command.
              </p>
            </section>

            <section>
              <h2 className="font-pixel text-xs text-white uppercase mb-6 tracking-widest">4. Account Termination</h2>
              <p className="leading-relaxed">
                We reserve the right to suspend any player who violates community standards or poses a security threat to our systems. Suspension may be temporary or permanent depending on the severity of the breach.
              </p>
            </section>

            <section>
              <h2 className="font-pixel text-xs text-white uppercase mb-6 tracking-widest">5. Limitation of Liability</h2>
              <p className="leading-relaxed">
                YoriGames is provided "AS-IS". We are not responsible for any cosmic anomalies, loss of save data, or hardware failures resulting from the use of our platform.
              </p>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}