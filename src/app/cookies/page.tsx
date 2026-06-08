import React from 'react';
import { SpaceBackground } from '@/components/layout/SpaceBackground';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export const metadata = {
  title: 'Cookie Policy | YoriGames',
  description: 'How we use local storage and cookies.',
};

export default function CookiesPage() {
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
          COOKIE <span className="text-neon-gold">POLICY</span>
        </h1>
        
        <div className="bg-[#140A2E] border-4 border-[#1B123D] p-8 sm:p-16 shadow-[8px_8px_0_0_#000]">
          <div className="font-pixel text-[10px] text-neon-gold uppercase mb-12 border-b border-[#1B123D] pb-4">
            Last Updated: {lastUpdated}
          </div>

          <div className="font-body text-muted space-y-12">
            <section>
              <h2 className="font-pixel text-xs text-white uppercase mb-6 tracking-widest">1. Small Data Modules (Cookies)</h2>
              <p className="leading-relaxed">
                YoriGames uses small data packets called "cookies" to enhance your arcade experience. These modules are stored locally on your device to help us recognize you when you return to base.
              </p>
            </section>

            <section>
              <h2 className="font-pixel text-xs text-white uppercase mb-6 tracking-widest">2. Essential Cookies</h2>
              <p className="leading-relaxed">
                These are critical for platform operation. They manage your session authentication and ensure that your security permissions are maintained during your stay. These cannot be disabled.
              </p>
            </section>

            <section>
              <h2 className="font-pixel text-xs text-white uppercase mb-6 tracking-widest">3. Preference Cookies</h2>
              <p className="leading-relaxed">
                These remember your custom settings, such as volume levels, selected avatars, and UI color preferences. They ensure your arcade experience feels like home.
              </p>
            </section>

            <section>
              <h2 className="font-pixel text-xs text-white uppercase mb-6 tracking-widest">4. Advertising & Analytics</h2>
              <p className="leading-relaxed">
                We use cookies from partners like Google to deliver relevant game recommendations and measure how many players are visiting different sectors of the platform.
              </p>
            </section>

            <section>
              <h2 className="font-pixel text-xs text-white uppercase mb-6 tracking-widest">5. Managing Modules</h2>
              <p className="leading-relaxed">
                You can configure your browser to reject all cookies, but please be aware that many platform features, including game save synchronization, will malfunction without them.
              </p>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}