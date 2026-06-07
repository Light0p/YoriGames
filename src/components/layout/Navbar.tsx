"use client"

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Gamepad2, Search, User, Menu, LogOut, Settings, ChevronDown } from 'lucide-react';
import { PixelButton } from '@/components/pixel/PixelButton';
import { cn } from '@/lib/utils';
import { useUser, useAuth } from '@/firebase';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export const Navbar = () => {
  const pathname = usePathname();
  const { user, loading } = useUser();
  const auth = useAuth();

  const navLinks = [
    { href: '/arcade', label: 'Arcade', color: 'text-neon-purple' },
    { href: '/trending', label: 'Trending', color: 'text-neon-pink' },
    { href: '/categories', label: 'Categories', color: 'text-neon-cyan' },
    { href: '/store', label: 'Store', color: 'text-neon-gold' },
  ];

  const handleLogout = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

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

        <div className="hidden lg:flex items-center gap-8 font-pixel text-[10px] tracking-widest uppercase">
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

          {loading ? (
            <div className="w-10 h-10 border-2 border-[#1B123D] animate-pulse rounded-full" />
          ) : (
            user ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="focus:outline-none flex items-center gap-3 group">
                  <div className="hidden sm:flex items-center">
                    <span className="font-pixel text-[8px] text-white uppercase truncate max-w-[150px]">
                      {user.displayName || 'PLAYER'}
                    </span>
                  </div>
                  <div className="relative">
                    <Avatar className="border-2 border-neon-purple cursor-pointer group-hover:scale-105 transition-transform">
                      <AvatarImage src={user.photoURL || undefined} />
                      <AvatarFallback className="bg-neon-purple text-white font-pixel text-[10px]">
                        {user.displayName?.charAt(0) || user.email?.charAt(0) || 'P'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 bg-[#140A2E] border border-[#1B123D] rounded-full p-0.5 sm:hidden">
                      <ChevronDown className="w-2 h-2 text-white" />
                    </div>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-[#140A2E] border-2 border-[#1B123D] text-white rounded-none min-w-[200px] mt-2">
                  <div className="px-3 py-3 border-b border-[#1B123D] bg-[#09061B]/50">
                    <p className="font-pixel text-[8px] text-white uppercase truncate">{user.displayName || 'UNNAMED PLAYER'}</p>
                  </div>
                  <DropdownMenuItem className="hover:bg-neon-purple/20 focus:bg-neon-purple/20 cursor-pointer py-4" asChild>
                    <Link href="/profile" className="flex items-center gap-2 font-pixel text-[8px] uppercase">
                      <Settings className="w-3 h-3 text-neon-cyan" /> PROFILE SETTINGS
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-[#1B123D]" />
                  <DropdownMenuItem 
                    className="hover:bg-destructive/20 focus:bg-destructive/20 cursor-pointer py-4 text-destructive"
                    onClick={handleLogout}
                  >
                    <div className="flex items-center gap-2 font-pixel text-[8px] uppercase w-full">
                      <LogOut className="w-3 h-3" /> EXIT SYSTEM
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login" className="block">
                <PixelButton variant="primary" size="sm">
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">PLAYER LOGIN</span>
                  <span className="sm:hidden">LOGIN</span>
                </PixelButton>
              </Link>
            )
          )}

          <button className="lg:hidden p-3 text-white min-w-[44px] min-h-[44px] flex items-center justify-center">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
    </nav>
  );
};