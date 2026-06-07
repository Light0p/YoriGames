"use client"

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Gamepad2, Search, User, Menu } from 'lucide-react';
import { PixelButton } from '@/components/pixel/PixelButton';
import { cn } from '@/lib/utils';

export const Navbar = () => {
  const pathname = usePathname();

  const navLinks = [
    { href: '/arcade', label: 'Arcade', color: 'text-neon-purple' },
    { href: '/trending', label: 'Trending', color: 'text-neon-pink' },
    { href: '/categories', label: 'Categories', color: 'text-neon-cyan' },
    { href: '/store', label: 'Store', color: 'text-neon-gold' },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full px-2 sm:px-8 py-4">
      <div className="mx-auto max-w-7xl flex items-center justify-between bg-[#140A2E]/80 backdrop-blur-md border-2 border-[#1B123D] px-4 sm:px-6 py-3 shadow-[0_4px_0_0_#000]">
        <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
          <div className="bg-neon-purple p-2 border-b-4 border-r-4 border-black group-hover:scale-110 transition-transform">
            <Gamepad2 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <span className="font-pixel text-sm sm:text-xl tracking-tighter text-white group-hover:text-neon-cyan transition-colors">
            YORI<span className="text-neon-pink">GAMES</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8 font-pixel text-[10px] tracking-widest uppercase">
          {navLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href} 
              className={cn(
                "transition-all border-b-2 border-transparent hover:pb-1",
                pathname === link.href ? cn(link.color, "border-current") : "text-muted hover:text-white"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <Link 
            href="/search" 
            className="p-3 sm:p-2 text-muted hover:text-white hover:bg-white/5 rounded-none border-b-2 border-transparent hover:border-neon-purple transition-all min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            <Search className="w-5 h-5" />
          </Link>
          <div className="h-6 w-[1px] bg-border mx-1 hidden sm:block" />
          <Link href="/login" className="hidden sm:block">
            <PixelButton variant="primary" size="sm">
              <User className="w-4 h-4" />
              <span>LOGIN</span>
            </PixelButton>
          </Link>
          <button className="md:hidden p-3 text-white min-w-[44px] min-h-[44px] flex items-center justify-center">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
    </nav>
  );
};