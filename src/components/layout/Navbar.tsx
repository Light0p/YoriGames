"use client"

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search, User, Menu, LogOut, Settings, UserPlus, Loader2, X } from 'lucide-react';
import { PixelButton } from '@/components/pixel/PixelButton';
import { cn } from '@/lib/utils';
import { useUser, useAuth, useFirestore } from '@/firebase';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { collection, query, where, onSnapshot, addDoc, serverTimestamp, limit } from 'firebase/firestore';

export const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useUser();
  const auth = useAuth();
  const db = useFirestore();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [sentRequests, setSentRequests] = useState<string[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  const navLinks = [
    { href: '/games', label: 'Games', color: 'text-neon-purple', type: 'link' },
    { href: '/trending', label: 'Trending', color: 'text-neon-pink', type: 'link' },
    { href: '#categories', label: 'Categories', color: 'text-neon-cyan', type: 'scroll' },
    { href: '/contact', label: 'Contact', color: 'text-neon-gold', type: 'link' },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!searchQuery.trim() || !user) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    let unsubscribe: () => void;
    setIsSearching(true);

    const delayDebounceFn = setTimeout(() => {
      const usersRef = collection(db, 'users');
      const normalizedInput = searchQuery.toLowerCase();
      
      const q = query(
        usersRef, 
        where('searchName', '>=', normalizedInput),
        where('searchName', '<=', normalizedInput + '\uf8ff'),
        limit(10)
      );
      
      unsubscribe = onSnapshot(q, (snapshot) => {
        const results = snapshot.docs
          .map(doc => ({ ...doc.data(), id: doc.id }))
          .filter((u: any) => u.uid !== user?.uid); 
          
        setSearchResults(results);
        setIsSearching(false);
      }, (error) => {
        console.error("Real-time player search failed:", error);
        setIsSearching(false);
      });
    }, 300);

    return () => {
      clearTimeout(delayDebounceFn);
      if (unsubscribe) unsubscribe();
    };
  }, [searchQuery, db, user?.uid]);

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

  const handleSendFriendRequest = async (receiverId: string) => {
    if (!user) return;
    try {
      await addDoc(collection(db, 'friendRequests'), {
        senderId: user.uid,
        receiverId: receiverId,
        status: 'pending',
        createdAt: serverTimestamp()
      });
      setSentRequests(prev => [...prev, receiverId]);
    } catch (error) {
      console.error("Failed to send request", error);
    }
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
    <nav className="sticky top-0 z-50 w-full px-2 sm:px-8 py-4">
      <div className="mx-auto max-w-7xl flex items-center justify-between bg-[#140A2E]/90 backdrop-blur-md border-2 border-[#1B123D] px-4 sm:px-6 py-3 shadow-[0_4px_0_0_#000] relative z-50">
        <Link href="/" className="flex items-center gap-3 group" onClick={() => setIsMobileMenuOpen(false)}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-10 h-10 shrink-0" shapeRendering="crispEdges">
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

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-8 font-pixel text-[10px] tracking-widest uppercase">
          {navLinks.map((link) => (
            <Link 
              key={link.label} 
              href={link.href} 
              onClick={(e) => handleNavClick(e, link.type, link.href)}
              className={cn(
                "transition-colors",
                pathname === link.href ? link.color : "text-muted hover:text-white"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          {user && (
            <div className="relative" ref={searchRef}>
              <button 
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className={cn(
                  "p-2 text-muted hover:text-white hover:bg-white/5 transition-all min-w-[44px] min-h-[44px] flex items-center justify-center",
                  isSearchOpen && "text-neon-purple border-b-2 border-neon-purple"
                )}
              >
                <Search className="w-5 h-5" />
              </button>

              {isSearchOpen && (
                <div className="absolute top-full right-0 mt-4 w-[280px] sm:w-[350px] bg-[#140A2E] border-4 border-[#1B123D] shadow-[8px_8px_0_0_#000] p-4 animate-in fade-in slide-in-from-top-2">
                  <div className="relative mb-4">
                    <input 
                      type="text" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="SCAN FOR PLAYERS..."
                      autoFocus
                      className="w-full bg-[#09061B] border-2 border-[#1B123D] px-4 py-2 text-white font-pixel text-[10px] focus:outline-none focus:border-neon-purple"
                    />
                    {isSearching && (
                      <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neon-purple animate-spin" />
                    )}
                  </div>

                  <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar">
                    {searchResults.map((player) => (
                      <div key={player.id} className="flex items-center justify-between p-2 bg-[#09061B]/50 border border-[#1B123D] hover:border-neon-cyan transition-colors">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8 border border-neon-purple">
                            <AvatarImage src={player.photoURL} alt={player.displayName} />
                            <AvatarFallback className="bg-neon-purple text-white text-[10px] font-pixel">
                              {player.displayName?.charAt(0) || 'P'}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-pixel text-[8px] text-white truncate max-w-[120px] uppercase">
                            {player.displayName}
                          </span>
                        </div>
                        
                        {sentRequests.includes(player.uid) ? (
                          <div className="bg-green-500/20 text-green-500 font-pixel text-[8px] px-2 py-1 border border-green-500">
                            SENT
                          </div>
                        ) : (
                          <button 
                            onClick={() => handleSendFriendRequest(player.uid)}
                            className="p-2 bg-neon-cyan text-black hover:scale-110 transition-transform border-b-2 border-r-2 border-black"
                          >
                            <UserPlus className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          
          <div className="h-6 w-[1px] bg-border mx-1 hidden sm:block" />

          {loading ? (
            <div className="w-10 h-10 border-2 border-[#1B123D] animate-pulse rounded-full" />
          ) : (
            user ? (
              <div className="hidden sm:block">
                <DropdownMenu>
                  <DropdownMenuTrigger className="focus:outline-none flex items-center gap-3 group" asChild>
                    <button className="flex items-center gap-3">
                      <span className="font-pixel text-[8px] text-white uppercase truncate max-w-[150px]">
                        {user.displayName || 'PLAYER'}
                      </span>
                      <Avatar className="border-2 border-neon-purple cursor-pointer group-hover:scale-105 transition-transform">
                        <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User Avatar'} />
                        <AvatarFallback className="bg-neon-purple text-white font-pixel text-[10px]">
                          {user.displayName?.charAt(0) || user.email?.charAt(0) || 'P'}
                        </AvatarFallback>
                      </Avatar>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-[#140A2E] border-2 border-[#1B123D] text-white rounded-none min-w-[200px] mt-2">
                    <DropdownMenuItem className="hover:bg-neon-purple/20 cursor-pointer py-4" asChild>
                      <Link href="/profile" className="flex items-center gap-2 font-pixel text-[8px] uppercase">
                        <Settings className="w-3 h-3 text-neon-cyan" /> PROFILE SETTINGS
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-[#1B123D]" />
                    <DropdownMenuItem 
                      className="hover:bg-destructive/20 cursor-pointer py-4 text-destructive"
                      onClick={handleLogout}
                    >
                      <div className="flex items-center gap-2 font-pixel text-[8px] uppercase w-full">
                        <LogOut className="w-3 h-3" /> EXIT SYSTEM
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <Link href="/login" className="hidden sm:block">
                <PixelButton variant="primary" size="sm">
                  <User className="w-4 h-4" />
                  <span>PLAYER LOGIN</span>
                </PixelButton>
              </Link>
            )
          )}

          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-3 text-white min-w-[44px] min-h-[44px] flex items-center justify-center relative z-50 cursor-pointer"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-[45] bg-[#140A2E] flex flex-col pt-24 px-6 animate-in fade-in slide-in-from-top-4">
          <div className="flex flex-col gap-6 items-center w-full">
            {user && (
              <div className="flex flex-col items-center gap-4 mb-8 pb-8 border-b border-[#1B123D] w-full">
                <Avatar className="w-20 h-20 border-4 border-neon-purple">
                  <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User Avatar'} />
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
                    "transition-all py-2 w-full text-center",
                    pathname === link.href ? link.color : "text-muted"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="mt-12 w-full">
              {user ? (
                <PixelButton variant="secondary" className="w-full py-6" onClick={handleLogout}>
                  <LogOut className="w-5 h-5" /> EXIT SYSTEM
                </PixelButton>
              ) : (
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="w-full">
                  <PixelButton variant="primary" className="w-full py-6">
                    <User className="w-5 h-5" /> PLAYER LOGIN
                  </PixelButton>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};