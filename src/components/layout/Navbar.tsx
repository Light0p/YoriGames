"use client"

import React from 'react';
import Link from 'next/link';
import { Gamepad2, Search, User, Menu } from 'lucide-react';
import { PixelButton } from '@/components/pixel/PixelButton';

export const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 w-full px-4 py-4 sm:px-8">
      <div className="mx-auto max-w-7xl flex items-center justify-between bg-[#140A2E]/80 backdrop-blur-md border-2 border-[#1B123D] px-6 py-3 shadow-[0_4px_0_0_#000]">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="bg-neon-purple p-2 border-b-4 border-r-4 border-black group-hover:scale-110 transition-transform">
            <Gamepad2 className="w-6 h-6 text-white" />
          </div>
          <span className="font-pixel text-xl tracking-tighter text-white group-hover:text-neon-cyan transition-colors">
            YORI<span className="text-neon-pink">GAMES</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8 font-pixel text-[10px] tracking-widest uppercase">
          <Link href="/games" className="hover:text-neon-purple transition-colors">Arcade</Link>
          <Link href="/trending" className="hover:text-neon-pink transition-colors">Trending</Link>
          <Link href="/categories" className="hover:text-neon-cyan transition-colors">Categories</Link>
          <Link href="/about" className="hover:text-neon-gold transition-colors">Store</Link>
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 text-muted hover:text-white hover:bg-white/5 rounded-none border-b-2 border-transparent hover:border-neon-purple transition-all">
            <Search className="w-5 h-5" />
          </button>
          <div className="h-6 w-[1px] bg-border mx-2 hidden sm:block" />
          <PixelButton variant="primary" size="sm" className="hidden sm:flex">
            <User className="w-4 h-4" />
            <span>LOGIN</span>
          </PixelButton>
          <button className="md:hidden p-2 text-white">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
    </nav>
  );
};
