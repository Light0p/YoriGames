import React from 'react';
import { SpaceBackground } from '@/components/layout/SpaceBackground';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { LifeBuoy, Mail, MessageSquare, BookOpen, Bug } from 'lucide-react';
import { PixelButton } from '@/components/pixel/PixelButton';

export const metadata = {
  title: 'Help Center | YoriGames',
  description: 'Support and troubleshooting for YoriGames players.',
};

export default function HelpPage() {
  const supportCategories = [
    {
      title: "Technical Support",
      icon: <Bug className="w-6 h-6 text-neon-pink" />,
      desc: "Troubleshoot game loading, performance issues, or browser errors.",
      color: "border-neon-pink"
    },
    {
      title: "Account Issues",
      icon: <Mail className="w-6 h-6 text-neon-purple" />,
      desc: "Manage your profile, password recovery, or account data.",
      color: "border-neon-purple"
    },
    {
      title: "Billing & Store",
      icon: <MessageSquare className="w-6 h-6 text-neon-gold" />,
      desc: "Inquiries regarding the Yori Store and supporter transactions.",
      color: "border-neon-gold"
    },
    {
      title: "Guides & Documentation",
      icon: <BookOpen className="w-6 h-6 text-neon-cyan" />,
      desc: "Deep dives into game controls and platform features.",
      color: "border-neon-cyan"
    }
  ];

  return (
    <main className="min-h-screen">
      <SpaceBackground />
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-24 sm:px-8">
        <div className="text-center mb-20">
          <div className="inline-block p-4 bg-neon-pink/10 border-4 border-neon-pink mb-8">
            <LifeBuoy className="w-12 h-12 text-neon-pink" />
          </div>
          <h1 className="font-pixel text-4xl sm:text-6xl text-white uppercase tracking-tighter mb-6">
            HELP <span className="text-neon-pink">CENTER</span>
          </h1>
          <p className="font-headline text-xl text-muted uppercase max-w-2xl mx-auto">
            Operational support for the YoriGames ecosystem.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {supportCategories.map((cat, i) => (
            <div key={i} className={`bg-[#140A2E] border-2 ${cat.color} p-8 hover:-translate-y-2 transition-transform shadow-[4px_4px_0_0_#000]`}>
              <div className="mb-6">{cat.icon}</div>
              <h3 className="font-pixel text-xs text-white uppercase mb-4">{cat.title}</h3>
              <p className="font-body text-sm text-muted leading-relaxed mb-8">{cat.desc}</p>
              <button className="font-pixel text-[8px] text-white underline uppercase hover:text-neon-pink transition-colors">Open Ticket</button>
            </div>
          ))}
        </div>

        <div className="bg-[#1B123D] border-4 border-[#140A2E] p-10 sm:p-16 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="max-w-xl">
            <h2 className="font-pixel text-2xl text-white uppercase mb-6">Still Lost in Space?</h2>
            <p className="font-body text-muted leading-relaxed mb-8">
              Our direct transmission channels are open 24/7. Reach out to our human support staff for specialized assistance with any anomaly.
            </p>
            <div className="flex flex-wrap gap-4">
              <PixelButton variant="secondary">EMAIL SUPPORT</PixelButton>
              <PixelButton variant="primary">JOIN DISCORD</PixelButton>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="w-48 h-48 bg-[#140A2E] border-4 border-neon-pink p-8 flex items-center justify-center animate-float">
               {/* Replaced unimported Radio icon with native SVG signal icon */}
               <svg 
                 viewBox="0 0 24 24" 
                 fill="none" 
                 stroke="currentColor" 
                 strokeWidth="2" 
                 strokeLinecap="round" 
                 strokeLinejoin="round" 
                 className="w-20 h-20 text-neon-pink"
               >
                 <path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9" />
                 <path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5" />
                 <circle cx="12" cy="12" r="2" />
                 <path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5" />
                 <path d="M19.1 4.9C23 8.8 23 15.2 19.1 19.1" />
               </svg>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
