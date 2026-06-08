import React from 'react';
import { SpaceBackground } from '@/components/layout/SpaceBackground';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Terminal, Key, Database, RefreshCw, Layers } from 'lucide-react';

export const metadata = {
  title: 'API Reference | YoriGames',
  description: 'Integration documentation for the YoriGames backend services.',
};

export default function APIPage() {
  return (
    <main className="min-h-screen">
      <SpaceBackground />
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-24 sm:px-8 flex flex-col lg:flex-row gap-16">
        {/* Sidebar Nav */}
        <aside className="lg:w-64 flex-shrink-0">
          <div className="sticky top-32 space-y-10">
            <div>
              <h4 className="font-pixel text-[10px] text-white uppercase mb-6 tracking-widest">Introduction</h4>
              <ul className="space-y-4 font-headline text-muted text-sm uppercase">
                <li><button className="text-neon-gold border-l-2 border-neon-gold pl-4 block w-full text-left">Overview</button></li>
                <li><button className="hover:text-white pl-4 block w-full text-left transition-colors">Authentication</button></li>
                <li><button className="hover:text-white pl-4 block w-full text-left transition-colors">Rate Limits</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-pixel text-[10px] text-white uppercase mb-6 tracking-widest">Endpoints</h4>
              <ul className="space-y-4 font-headline text-muted text-sm uppercase">
                <li><button className="hover:text-white pl-4 block w-full text-left transition-colors">Games List</button></li>
                <li><button className="hover:text-white pl-4 block w-full text-left transition-colors">User Profiles</button></li>
                <li><button className="hover:text-white pl-4 block w-full text-left transition-colors">Leaderboards</button></li>
              </ul>
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <div className="flex-1 max-w-4xl">
          <div className="mb-16">
            <h1 className="font-pixel text-4xl text-white uppercase tracking-tighter mb-6">
              API <span className="text-neon-gold">DOCS</span>
            </h1>
            <p className="font-body text-lg text-muted leading-relaxed">
              Programmatic access to the YoriGames universe. Our RESTful API allows you to integrate game data, player stats, and leaderboards into your own applications.
            </p>
          </div>

          <section className="mb-16">
            <h2 className="font-pixel text-xl text-white uppercase mb-8 flex items-center gap-4">
              <Key className="w-6 h-6 text-neon-gold" /> Authentication
            </h2>
            <p className="font-body text-muted leading-relaxed mb-8">
              All API requests must include your Nexus Bearer Token in the authorization header. You can generate tokens in the Developer Console.
            </p>
            <div className="bg-[#140A2E] border-2 border-[#1B123D] p-6 font-mono text-sm text-neon-gold shadow-inner">
               <code>Authorization: Bearer YOUR_API_KEY</code>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="font-pixel text-xl text-white uppercase mb-8 flex items-center gap-4">
              <Database className="w-6 h-6 text-neon-gold" /> GET /api/v1/games
            </h2>
            <p className="font-body text-muted leading-relaxed mb-8">
              Retrieve a paginated list of all active games in the YoriGames library, including categories and metadata.
            </p>
            <div className="bg-[#140A2E] border-2 border-[#1B123D] p-8 font-mono text-sm text-white/80 space-y-4">
               <div className="text-neon-cyan">// Response Example</div>
               <pre className="overflow-x-auto">
{`{
  "status": "success",
  "data": [
    {
      "id": "star-dash",
      "title": "Star Dash",
      "genre": "Arcade",
      "rating": 4.8
    }
  ],
  "pagination": {
    "current": 1,
    "total": 50
  }
}`}
               </pre>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="font-pixel text-xl text-white uppercase mb-8 flex items-center gap-4">
              <RefreshCw className="w-6 h-6 text-neon-gold" /> Rate Limiting
            </h2>
            <p className="font-body text-muted leading-relaxed">
              Standard tier API keys are limited to <span className="text-white">1,000 requests per hour</span>. For high-volume needs, please contact the orbital engineering team.
            </p>
          </section>

          <div className="bg-neon-gold/5 border-2 border-neon-gold/20 p-8 flex items-start gap-6">
            <Layers className="w-8 h-8 text-neon-gold flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-pixel text-[10px] text-white uppercase mb-2">SDK Alternative</h4>
              <p className="font-body text-xs text-muted leading-relaxed">
                If you are building a game for our platform, we strongly recommend using the <span className="text-white">Yori-Universal-SDK</span> which handles authentication and data syncing automatically.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}