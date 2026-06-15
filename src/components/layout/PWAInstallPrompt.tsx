'use client';

import React, { useState, useEffect } from 'react';
import { useArcadeState } from '@/hooks/useArcadeState';
import { X, Smartphone, Share } from 'lucide-react';

export function PWAInstallPrompt() {
  const { recent } = useArcadeState();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // 1. Check if user already dismissed the prompt
    const isDismissed = localStorage.getItem('pwa_prompt_dismissed') === 'true';
    if (isDismissed) return;

    // 2. Check if iOS
    const ua = window.navigator.userAgent;
    const isIosDevice = /iphone|ipad|ipod/.test(ua.toLowerCase()) && !(window as any).MSStream;
    setIsIOS(isIosDevice);

    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Engagement Check: Show only if user has played at least one game
      if (recent.length >= 1) {
        setIsVisible(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // iOS Engagement Check (since beforeinstallprompt doesn't fire on iOS)
    if (isIosDevice && recent.length >= 1 && !(window.navigator as any).standalone) {
      setIsVisible(true);
    }

    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, [recent.length]);

  const handleDismiss = () => {
    localStorage.setItem('pwa_prompt_dismissed', 'true');
    setIsVisible(false);
  };

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      handleDismiss();
    }
    setDeferredPrompt(null);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-sm bg-[#1a1530] border border-[#2d2650] rounded-xl p-4 shadow-2xl z-50 animate-in slide-in-from-bottom-4 duration-300">
      {/* Dismiss Button */}
      <button 
        onClick={handleDismiss}
        className="absolute top-2 right-2 p-1 text-muted-foreground hover:text-white transition-colors"
        aria-label="Close"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="flex items-center gap-4">
        {/* Left: Icon */}
        <div className="bg-[#2d2650] p-2 rounded-lg shrink-0">
          {isIOS ? (
            <Share className="w-5 h-5 text-[#ec4899]" />
          ) : (
            <Smartphone className="w-5 h-5 text-neon-cyan" />
          )}
        </div>
        
        {/* Middle: Text Area */}
        <div className="flex-1 min-w-0 pr-4">
          <h3 className="font-pixel text-[8px] text-white uppercase mb-1">
            Add to Home Screen
          </h3>
          
          {isIOS ? (
            <p className="text-[7px] text-[#ec4899] font-pixel leading-tight uppercase">
              Tap Share <span>→</span> Add to Home Screen
            </p>
          ) : (
            <p className="text-[10px] text-muted-foreground truncate">
              Play offline, no app store
            </p>
          )}
        </div>

        {/* Right: Action (Android/Chrome only) */}
        {!isIOS && deferredPrompt && (
          <button 
            onClick={handleInstallClick}
            className="bg-neon-cyan text-black font-pixel text-[8px] px-3 py-2 rounded uppercase tracking-tighter shrink-0 hover:brightness-110 active:scale-95 transition-all"
          >
            Install
          </button>
        )}
      </div>
    </div>
  );
}
