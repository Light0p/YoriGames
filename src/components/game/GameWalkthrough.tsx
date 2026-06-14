"use client"

import React, { useEffect, useState } from 'react';

interface GameWalkthroughProps {
  gameUrl: string;
}

export const GameWalkthrough = ({ gameUrl }: GameWalkthroughProps) => {
  const [isMounted, setIsMounted] = useState(false);

  // Helper to extract the unique hash from GameMonetize URLs
  // e.g. https://html5.gamemonetize.co/lcw5kj735t9wseirvvxd5rtdj2jx5d1m/ -> lcw5kj735t9wseirvvxd5rtdj2jx5d1m
  const extractGameHash = (url: string) => {
    if (!url) return null;
    const cleanUrl = url.trim().replace(/\/$/, '');
    const parts = cleanUrl.split('/');
    return parts[parts.length - 1];
  };

  useEffect(() => {
    setIsMounted(true);
    const hashId = extractGameHash(gameUrl);
    
    if (!hashId) return;

    // Set global configuration required by the GameMonetize video script
    (window as any).VIDEO_OPTIONS = {
      gameid: hashId,
      width: "100%",
      height: "480px",
      color: "#A855F7", // YoriGames Neon Purple
      getAds: "false"
    };

    const scriptId = "gm-video-script";

    // Inject script into document body to ensure it runs correctly across the full DOM
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://api.gamemonetize.com/video.js";
      script.async = true;
      document.body.appendChild(script);
    }

    return () => {
      // Cleanup: Remove the specific script and global options on unmount or game change
      const scriptEl = document.getElementById(scriptId);
      if (scriptEl) scriptEl.remove();
      
      delete (window as any).VIDEO_OPTIONS;
      
      const container = document.getElementById("gamemonetize-video");
      if (container) container.innerHTML = ''; 
    };
  }, [gameUrl]);

  if (!isMounted) return null;

  return (
    <div className="bg-[#140A2E] p-5 sm:p-8 border-2 border-[#1B123D]">
      <h3 className="font-pixel text-[10px] sm:text-xs text-white uppercase mb-6 border-b border-[#1B123D] pb-2 tracking-widest flex items-center gap-3">
        <span className="w-2 h-2 bg-neon-purple animate-pulse" /> Mission Walkthrough
      </h3>
      
      <div className="w-full relative min-h-[480px] bg-black/20 flex items-center justify-center overflow-hidden border border-white/5">
        
        {/* Loading Overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <div className="font-pixel text-[8px] text-muted animate-pulse uppercase">Establishing Visual Link...</div>
        </div>

        {/* The video script will inject its iframe inside this specific ID */}
        <div id="gamemonetize-video" className="w-full h-full z-10 relative"></div>
      </div>
      
      <div className="mt-6 flex items-center justify-between opacity-40">
        <p className="font-pixel text-[6px] text-muted uppercase tracking-widest">
          Source: GM-Uplink-Video
        </p>
        <div className="flex gap-1">
          <div className="w-1 h-1 bg-neon-purple" />
          <div className="w-1 h-1 bg-neon-cyan" />
          <div className="w-1 h-1 bg-neon-pink" />
        </div>
      </div>
    </div>
  );
};
