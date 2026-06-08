"use client"

import React from 'react';
import { Twitter, Github, Globe } from 'lucide-react';
import { PixelGamepad } from '@/components/pixel/PixelGamepad';
import Link from 'next/link';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#140A2E] border-t-4 border-[#1B123D] mt-20 py-12 sm:py-16 px-4 sm:px-8">
      <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-1">
          <Link href="/" className="flex items-center gap-3 mb-6">
            <div className="bg-neon-purple p-2 border-b-4 border-r-4 border-black">
              <PixelGamepad className="w-6 h-6" />
            </div>
            <span className="font-pixel text-xl text-white uppercase">YORIGAMES</span>
          </Link>
          <p className="font-body text-muted text-sm leading-relaxed mb-6">
            The world's leading destination for premium indie pixel art games. 
            Play instantly on any device.
          </p>
          <div className="flex items-center gap-4">
            <Link href="#" className="p-3 border-2 border-[#1B123D] hover:border-neon-purple hover:text-neon-purple transition-all min-w-[44px] min-h-[44px] flex items-center justify-center">
              <Twitter className="w-5 h-5" />
            </Link>
            <Link href="#" className="p-3 border-2 border-[#1B123D] hover:border-neon-pink hover:text-neon-pink transition-all min-w-[44px] min-h-[44px] flex items-center justify-center">
              <Github className="w-5 h-5" />
            </Link>
            <Link href="#" className="p-3 border-2 border-[#1B123D] hover:border-neon-cyan hover:text-neon-cyan transition-all min-w-[44px] min-h-[44px] flex items-center justify-center">
              <Globe className="w-5 h-5" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 md:grid-cols-2 md:col-span-2">
          <div>
            <h4 className="font-pixel text-[12px] text-white uppercase mb-6 tracking-widest">Navigation</h4>
            <ul className="space-y-4 font-headline text-muted text-sm uppercase">
              <li><Link href="/arcade" className="hover:text-neon-purple transition-colors block py-1">Arcade</Link></li>
              <li><Link href="/leaderboards" className="hover:text-neon-pink transition-colors block py-1">Leaderboards</Link></li>
              <li><Link href="/tournaments" className="hover:text-neon-cyan transition-colors block py-1">Tournaments</Link></li>
              <li><Link href="/achievements" className="hover:text-neon-gold transition-colors block py-1">Achievements</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-pixel text-[12px] text-white uppercase mb-6 tracking-widest">Support</h4>
            <ul className="space-y-4 font-headline text-muted text-sm uppercase">
              <li><Link href="/faq" className="hover:text-neon-purple transition-colors block py-1">FAQ</Link></li>
              <li><Link href="/help" className="hover:text-neon-pink transition-colors block py-1">Help Center</Link></li>
              <li><Link href="/developers" className="hover:text-neon-cyan transition-colors block py-1">Developers</Link></li>
              <li><Link href="/api" className="hover:text-neon-gold transition-colors block py-1">API</Link></li>
            </ul>
          </div>
        </div>

        <div className="bg-[#09061B] p-6 border-2 border-[#1B123D] flex flex-col items-center justify-center text-center">
          <div className="font-pixel text-[10px] text-neon-gold mb-4 animate-pulse">LEGACY EDITION v1.0.4</div>
          <div className="font-pixel text-xs text-white mb-2 uppercase">Server Status: <span className="text-green-400">ONLINE</span></div>
          <div className="font-pixel text-[8px] text-muted uppercase tracking-widest">Latency: 24ms</div>
        </div>
      </div>
      
      <div className="mx-auto max-w-7xl mt-12 sm:mt-16 pt-8 border-t border-[#1B123D] flex flex-col md:flex-row items-center justify-between gap-6">
        <p className="font-pixel text-[8px] text-muted uppercase tracking-widest">© {currentYear} YORIGAMES - PIXEL POWERED</p>
        <div className="flex flex-wrap justify-center gap-6 sm:gap-8 font-pixel text-[8px] text-muted uppercase tracking-widest">
          <Link href="/privacy" className="hover:text-white transition-colors py-2">Privacy</Link>
          <Link href="/terms" className="hover:text-white transition-colors py-2">Terms</Link>
          <Link href="/cookies" className="hover:text-white transition-colors py-2">Cookies</Link>
        </div>
      </div>
    </footer>
  );
};
