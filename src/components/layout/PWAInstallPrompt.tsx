'use client';

import React, { useState, useEffect } from 'react';
import { useArcadeState } from '@/hooks/useArcadeState';
import { X, Smartphone, Download, Share } from 'lucide-react';
import { cn } from '@/lib/utils';

export function PWAInstallPrompt() {
  const { recent } = useArcadeState();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if iOS
    const ua = window.navigator.userAgent;
    const isIosDevice = /iphone|ipad|ipod/.test(ua.toLowerCase()) && !(window as any).MSStream;
    setIsIOS(isIosDevice);

    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Engagement Check: Played at least one game
      if (recent.length >= 1) {
        setIsVisible(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // iOS Engagement Check
    if (isIosDevice && recent.length >= 1 && !(window.navigator as any).standalone) {
      // Check if it's already installed
      setIsVisible(true);
    }

    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, [recent.length]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsVisible(false);
    }
    setDeferredPrompt(null);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-[110] flex justify-center animate-in slide-in-from-bottom-full duration-500">
      <div className="w-full max-w-lg bg-[#140A2E] border-4 border-neon-cyan shadow-[12px_12px_0_0_#000] p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neon-cyan to-transparent opacity-30" />
        
        <button 
          onClick={() => setIsVisible(false)}
          className="absolute top-2 right-2 p-2 text-muted hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-6">
          <div className="bg-neon-cyan/20 p-4 border-2 border-neon-cyan shrink-0">
            <Smartphone className="w-8 h-8 text-neon-cyan" />
          </div>
          
          <div className="flex-1 space-y-4">
            <h3 className="font-pixel text-[10px] text-white uppercase tracking-widest leading-relaxed">
              Add YoriGames to Home Screen
            </h3>
            <p className="font-body text-xs text-muted leading-relaxed uppercase tracking-tight">
              Enjoy high-performance gaming with a single tap. Zero lag, full screen immersion.
            </p>

            {isIOS ? (
              <div className="flex items-center gap-3 bg-neon-pink/10 border border-neon-pink/30 p-3 text-neon-pink font-pixel text-[6px]">
                <Share className="w-3 h-3" />
                <span>TAP SHARE <span>→</span> ADD TO HOME SCREEN</span>
              </div>
            ) : (
              <button 
                onClick={handleInstallClick}
                className="w-full bg-neon-cyan text-black font-pixel text-[8px] py-4 uppercase tracking-widest border-b-4 border-r-4 border-[#0891B2] hover:brightness-110 active:translate-y-1 active:border-0 transition-all flex items-center justify-center gap-3"
              >
                <Download className="w-4 h-4" /> INSTALL APP
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
