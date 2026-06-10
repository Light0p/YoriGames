"use client"

import React from 'react';
import { Github, MessageSquare } from 'lucide-react';
import Link from 'next/link';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#0D0925] border-t-2 border-[#1B123D] mt-24 py-16 px-6 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          {/* Project Info */}
          <div className="md:col-span-4 lg:col-span-5">
            <Link href="/" className="flex items-center gap-3 mb-6 group">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-8 h-8 shrink-0" shapeRendering="crispEdges">
                <path fill="#A855F7" d="M6 6h12v2h2v2h2v4h-2v4h-4v-2H8v2H4v-4H2v-4h2V8h2V6z"/>
                <path fill="#FFFFFF" d="M6 10h2v2h2v2h-2v2H6v-2H4v-2h2v-2z"/>
                <rect x="16" y="10" width="2" height="2" fill="#00F0FF"/>
                <rect x="14" y="12" width="2" height="2" fill="#E046B1"/>
                <rect x="18" y="12" width="2" height="2" fill="#E046B1"/>
                <rect x="16" y="14" width="2" height="2" fill="#00F0FF"/>
              </svg>
              <span className="font-pixel text-lg text-white uppercase tracking-tighter">YORIGAMES</span>
            </Link>
            <p className="font-body text-muted text-sm leading-relaxed max-w-sm mb-8">
              A collection of simple, fast-loading browser games built for quick, fun sessions. No downloads, no installations. Just click and play.
            </p>
            <div className="flex items-center gap-4">
              <Link href="#" className="p-2 border border-[#1B123D] hover:border-neon-purple hover:text-neon-purple transition-all" aria-label="X">
                <XIcon className="w-5 h-5" />
              </Link>
              <Link href="#" className="p-2 border border-[#1B123D] hover:border-neon-pink hover:text-neon-pink transition-all" aria-label="Discord">
                <MessageSquare className="w-5 h-5" />
              </Link>
              <Link href="https://github.com" target="_blank" className="p-2 border border-[#1B123D] hover:border-neon-cyan hover:text-neon-cyan transition-all" aria-label="GitHub">
                <Github className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-3 lg:col-span-2">
            <h4 className="font-pixel text-[10px] text-white uppercase mb-6 tracking-widest">Navigation</h4>
            <ul className="space-y-4 font-headline text-muted text-sm uppercase">
              <li><Link href="/games" className="hover:text-white transition-colors">Arcade</Link></li>
              <li><Link href="/categories" className="hover:text-white transition-colors">Categories</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">About Project</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Legal Links */}
          <div className="md:col-span-3 lg:col-span-2">
            <h4 className="font-pixel text-[10px] text-white uppercase mb-6 tracking-widest">Legal</h4>
            <ul className="space-y-4 font-headline text-muted text-sm uppercase">
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="/cookies" className="hover:text-white transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>

          {/* Developer Note */}
          <div className="md:col-span-12 lg:col-span-3">
            <div className="bg-[#140A2E] p-6 border border-[#1B123D] rounded-none">
              <h4 className="font-pixel text-[9px] text-neon-gold uppercase mb-3 tracking-widest">Built By</h4>
              <p className="font-pixel text-[11px] text-white mb-2 uppercase">Yogesh Yadav</p>
              <p className="font-body text-[11px] text-muted leading-relaxed">
                Independent developer building YoriGames one update at a time. Authentically indie.
              </p>
            </div>
          </div>
        </div>
        
        <div className="pt-8 border-t border-[#1B123D] flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="font-pixel text-[8px] text-muted/60 uppercase tracking-[0.2em]">
            © {currentYear} YORIGAMES — HANDCRAFTED PIXEL FUN
          </p>
          <div className="font-pixel text-[8px] text-muted/40 uppercase tracking-widest">
            v1.0.8 — STABLE UPLINK
          </div>
        </div>
      </div>
    </footer>
  );
};

const XIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.932zm-1.292 19.494h2.039L6.486 3.24H4.298l13.311 17.407z" />
  </svg>
);
