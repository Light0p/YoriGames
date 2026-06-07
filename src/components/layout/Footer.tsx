"use client"

import React from 'react';
import { Gamepad2, Twitter, Github, Globe } from 'lucide-react';
import Link from 'next/link';

export const Footer = () => {
  return (
    <footer className="w-full bg-[#140A2E] border-t-4 border-[#1B123D] mt-20 py-16 px-4 sm:px-8">
      <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-1">
          <Link href="/" className="flex items-center gap-3 mb-6">
            <div className="bg-neon-purple p-2 border-b-4 border-r-4 border-black">
              <Gamepad2 className="w-6 h-6 text-white" />
            </div>
            <span className="font-pixel text-xl text-white uppercase">YORIGAMES</span>
          </Link>
          <p className="font-body text-muted text-sm leading-relaxed mb-6">
            The world's leading destination for premium indie pixel art games. 
            Play instantly on any device.
          </p>
          <div className="flex items-center gap-4">
            <button className="p-2 border-2 border-[#1B123D] hover:border-neon-purple hover:text-neon-purple transition-all">
              <Twitter className="w-5 h-5" />
            </button>
            <button className="p-2 border-2 border-[#1B123D] hover:border-neon-pink hover:text-neon-pink transition-all">
              <Github className="w-5 h-5" />
            </button>
            <button className="p-2 border-2 border-[#1B123D] hover:border-neon-cyan hover:text-neon-cyan transition-all">
              <Globe className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div>
          <h4 className="font-pixel text-[12px] text-white uppercase mb-6 tracking-widest">Navigation</h4>
          <ul className="space-y-4 font-headline text-muted text-sm uppercase">
            <li><Link href="#" className="hover:text-neon-purple transition-colors">Arcade</Link></li>
            <li><Link href="#" className="hover:text-neon-pink transition-colors">Leaderboards</Link></li>
            <li><Link href="#" className="hover:text-neon-cyan transition-colors">Tournaments</Link></li>
            <li><Link href="#" className="hover:text-neon-gold transition-colors">Achievements</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-pixel text-[12px] text-white uppercase mb-6 tracking-widest">Support</h4>
          <ul className="space-y-4 font-headline text-muted text-sm uppercase">
            <li><Link href="#" className="hover:text-neon-purple transition-colors">FAQ</Link></li>
            <li><Link href="#" className="hover:text-neon-pink transition-colors">Help Center</Link></li>
            <li><Link href="#" className="hover:text-neon-cyan transition-colors">Developers</Link></li>
            <li><Link href="#" className="hover:text-neon-gold transition-colors">API</Link></li>
          </ul>
        </div>

        <div className="bg-[#09061B] p-6 border-2 border-[#1B123D] flex flex-col items-center justify-center text-center">
          <div className="font-pixel text-[10px] text-neon-gold mb-4 animate-pulse">LEGACY EDITION v1.0.4</div>
          <div className="font-pixel text-xs text-white mb-2 uppercase">Server Status: <span className="text-green-400">ONLINE</span></div>
          <div className="font-pixel text-[8px] text-muted uppercase">Latency: 24ms</div>
        </div>
      </div>
      
      <div className="mx-auto max-w-7xl mt-16 pt-8 border-t border-[#1B123D] flex flex-col md:flex-row items-center justify-between gap-6">
        <p className="font-pixel text-[8px] text-muted uppercase">© 2024 YORIGAMES - PIXEL POWERED</p>
        <div className="flex gap-8 font-pixel text-[8px] text-muted uppercase">
          <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
          <Link href="#" className="hover:text-white transition-colors">Terms</Link>
          <Link href="#" className="hover:text-white transition-colors">Cookies</Link>
        </div>
      </div>
    </footer>
  );
};
