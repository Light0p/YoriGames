"use client"

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { Search, User, Menu, LogOut, Settings, X, Gamepad2, Loader2 } from 'lucide-react';
import { PixelButton } from '@/components/pixel/PixelButton';
import { cn } from '@/lib/utils';
import { useUser, useAuth } from '@/firebase';
import { useGameStore } from '@/context/GameContext';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Fuse from 'fuse.js';

export const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading: userLoading } = useUser();
  const auth = useAuth();
  const { allGames, loading: gamesLoading } = useGameStore();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchRef = useRef<HTMLDivElement>(null);

  const navLinks = [
    { href: '/games', label: 'Games', color: 'text-neon-purple', type: 'link' },
    { href: '/trending', label: 'Trending', color: 'text-neon-pink', type: 'link' },
    { href: '#categories', label: 'Categories', color: 'text-neon-cyan', type: 'scroll' },
    { href: '/contact', label: 'Contact', color: 'text-neon-gold', type: 'link' },
  ];

  const fuse = useMemo(() => {
    return new Fuse(allGames, {
      keys: ['title', 'category', 'tags'],
      threshold: 0.3,
      distance: 100,
    });
  }, [allGames]);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return fuse.search(searchQuery).slice(0, 5).map(r => r.item);
  }, [searchQuery, fuse]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavClick = (e: React.MouseEvent, type: string, href: string) => {
    if (type === 'scroll') {
      e.preventDefault();
      setIsMobileMenuOpen(false);
      if (pathname === '/') {
        const target = document.querySelector(href);
        target?.scrollIntoView({ behavior: 'smooth' });
      } else {
        router.push('/' + href);
      }
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearchOpen(false);
    router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      setIsMobileMenuOpen(false);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <>
      {/* Spacer to preserve layout flow since the nav is fixed */}
      <div className="h-20 sm:h-24" aria-hidden="true" />
      
      <nav 
        className="fixed top-4 left-0 right-0 z-[100] mx-auto w-[95%] max-w-7xl bg-[#0d051c]/95 backdrop-blur-md border border-[#2a1744] shadow-xl rounded-none" 
        aria-label="Main Navigation"
      >
        <div className="flex items-center justify-between px-4 sm:px-8 py-4 relative z-50">
          <Link href="/" className="flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan" aria-label="YoriGames Home" onClick={() => setIsMobileMenuOpen(false)}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-10 h-10 shrink-0" shapeRendering="crispEdges" aria-hidden="true">
              <path fill="#A855F7" d="M6 6h12v2h2v2h2v4h-2v4h-4v-2H8v2H4v-4H2v-4h2V8h2V6z"/>
              <path fill="#FFFFFF" d="M6 10h2v2h2v2h-2v2H6v-2H4v-2h2v-2z"/>
              <rect x="16" y="10" width="2" height="2" fill="#00F0FF"/>
              <rect x="14" y="12" width="2" height="2" fill="#E046B1"/>
              <rect x="18" y="12" width="2" height="2" fill="#E046B1"/>
              <rect x="16" y="14" width="2" height="2" fill="#00F0FF"/>
            </svg>
            <span className="font-pixel text-sm sm:text-lg tracking-tighter text-white uppercase">
              YORI<span className="text-neon-pink">GAMES</span>
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-8 font-pixel text-[10px] tracking-widest uppercase">
            {navLinks.map((link) => (
              <Link 
                key={link.label} 
                href={link.href} 
                onClick={(e) => handleNavClick(e, link.type, link.href)}
                className={cn(
                  "transition-colors py-2 px-1 min-h-[44px] flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan",
                  pathname === link.href ? link.color : "text-muted hover:text-white"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <div className="relative" ref={searchRef}>
              <button 
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                aria-label={isSearchOpen ? "Close Search" : "Open Search"}
                className={cn(
                  "p-2 text-muted hover:text-white hover:bg-white/5 transition-all min-w-[44px] min-h-[44px] flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan",
                  isSearchOpen && "text-neon-purple border-b-2 border-neon-purple"
                )}
              >
                <Search className="w-5 h-5" />
              </button>

              {isSearchOpen && (
                <div className="absolute top-full right-0 mt-4 w-[280px] sm:w-[400px] bg-[#140A2E] border-4 border-[#1B123D] shadow-[8px_8px_0_0_#000] p-4 animate-in fade-in slide-in-from-top-2" role="search">
                  <form onSubmit={handleSearchSubmit} className="relative mb-4">
                    <input 
                      type="text" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="SCAN UNIVERSE..."
                      autoFocus
                      aria-label="Search for games"
                      className="w-full bg-[#09061B] border-2 border-[#1B123D] px-4 py-3 text-white font-pixel text-[10px] focus:outline-none focus:border-neon-purple uppercase min-h-[44px]"
                    />
                    {gamesLoading && (
                      <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neon-purple animate-spin" aria-hidden="true" />
                    )}
                  </form>

                  <div className="space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar">
                    {searchResults.length > 0 ? (
                      searchResults.map((game) => (
                        <Link 
                          key={game.id} 
                          href={`/games/${game.slug}`}
                          onClick={() => {
                            setIsSearchOpen(false);
                            setSearchQuery('');
                          }}
                          aria-label={`Launch ${game.title}`}
                          className="flex items-center gap-4 p-2 bg-[#09061B]/50 border border-[#1B123D] hover:border-neon-cyan transition-colors group min-h-[50px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan"
                        >
                          <div className="relative w-12 h-10 bg-black border border-[#1B123D] overflow-hidden shrink-0">
                            <Image src={game.thumbnail || (game as any).thumb} alt="" fill className="object-cover group-hover:scale-110 transition-transform" />
                          </div>
                          <div className="min-w-0">
                            <div className="font-pixel text-[8px] text-white truncate uppercase">
                              {game.title}
                            </div>
                            <div className="font-pixel text-[6px] text-neon-purple uppercase mt-1">
                              {game.category}
                            </div>
                          </div>
                        </Link>
                      ))
                    ) : searchQuery.trim() ? (
                      <div className="py-8 text-center border-2 border-dashed border-[#1B123D]">
                        <Gamepad2 className="w-8 h-8 text-muted mx-auto mb-2 opacity-20" aria-hidden="true" />
                        <p className="font-pixel text-[8px] text-muted uppercase">No signals detected.</p>
                      </div>
                    ) : (
                      <p className="font-pixel text-[8px] text-muted text-center py-4 uppercase">Enter search query...</p>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            <div className="h-6 w-[1px] bg-border mx-1 hidden sm:block" aria-hidden="true" />

            {userLoading ? (
              <div className="w-10 h-10 border-2 border-[#1B123D] animate-pulse rounded-full" aria-hidden="true" />
            ) : (
              user ? (
                <div className="hidden sm:block">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="focus:outline-none flex items-center gap-3 group" asChild>
                      <button className="flex items-center gap-3 min-h-[44px] focus-visible:ring-2 focus-visible:ring-neon-cyan p-1" aria-label={`Open profile menu for ${user.displayName || 'Player'}`}>
                        <span className="font-pixel text-[8px] text-white uppercase truncate max-w-[150px]">
                          {user.displayName || 'PLAYER'}
                        </span>
                        <Avatar className="border-2 border-neon-purple cursor-pointer group-hover:scale-105 transition-transform">
                          <AvatarImage src={user.photoURL || undefined} alt="" />
                          <AvatarFallback className="bg-neon-purple text-white font-pixel text-[10px]">
                            {user.displayName?.charAt(0) || user.email?.charAt(0) || 'P'}
                          </AvatarFallback>
                        </Avatar>
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-[#140A2E] border-2 border-[#1B123D] text-white rounded-none min-w-[200px] mt-2">
                      <DropdownMenuItem className="hover:bg-neon-purple/20 cursor-pointer py-4" asChild>
                        <Link href="/profile" className="flex items-center gap-2 font-pixel text-[8px] uppercase w-full">
                          <Settings className="w-3 h-3 text-neon-cyan" aria-hidden="true" /> PROFILE SETTINGS
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-[#1B123D]" />
                      <DropdownMenuItem 
                        className="hover:bg-destructive/20 cursor-pointer py-4 text-destructive"
                        onClick={handleLogout}
                      >
                        <div className="flex items-center gap-2 font-pixel text-[8px] uppercase w-full">
                          <LogOut className="w-3 h-3" aria-hidden="true" /> EXIT SYSTEM
                        </div>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <Link href="/login" className="hidden sm:block">
                  <PixelButton variant="primary" size="sm" aria-label="Login to Player Account">
                    <User className="w-4 h-4" aria-hidden="true" />
                    <span>PLAYER LOGIN</span>
                  </PixelButton>
                </Link>
              )
            )}

            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Close Menu" : "Open Menu"}
              className="lg:hidden p-3 text-white min-w-[44px] min-h-[44px] flex items-center justify-center relative z-50 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-[45] bg-[#140A2E] flex flex-col pt-24 px-6 animate-in fade-in slide-in-from-top-4" role="dialog" aria-modal="true" aria-label="Mobile Navigation">
            <div className="flex flex-col gap-6 items-center w-full">
              {user && (
                <div className="flex flex-col items-center gap-4 mb-8 pb-8 border-b border-[#1B123D] w-full">
                  <Avatar className="w-20 h-20 border-4 border-neon-purple">
                    <AvatarImage src={user.photoURL || undefined} alt="" />
                    <AvatarFallback className="bg-neon-purple text-white font-pixel text-lg uppercase">
                      {user.displayName?.charAt(0) || user.email?.charAt(0) || 'P'}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-pixel text-xs text-white uppercase">{user.displayName || 'PLAYER'}</span>
                </div>
              )}

              <div className="flex flex-col gap-8 items-center w-full font-pixel text-xs tracking-[0.2em] uppercase">
                {navLinks.map((link) => (
                  <Link 
                    key={link.label} 
                    href={link.href} 
                    onClick={(e) => handleNavClick(e, link.type, link.href)}
                    className={cn(
                      "transition-all py-3 w-full text-center min-h-[44px] flex items-center justify-center focus-visible:ring-2 focus-visible:ring-neon-cyan",
                      pathname === link.href ? link.color : "text-muted"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              <div className="mt-12 w-full">
                {user ? (
                  <PixelButton variant="secondary" className="w-full py-6" onClick={handleLogout} aria-label="Logout">
                    <LogOut className="w-5 h-5" aria-hidden="true" /> EXIT SYSTEM
                  </PixelButton>
                ) : (
                  <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="w-full">
                    <PixelButton variant="primary" className="w-full py-6" aria-label="Login to account">
                      <User className="w-5 h-5" aria-hidden="true" /> PLAYER LOGIN
                    </PixelButton>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};