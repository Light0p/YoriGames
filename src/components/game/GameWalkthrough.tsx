"use client"

import React, { useEffect, useRef } from 'react';

interface GameWalkthroughProps {
  gameId: string;
}

/**
 * GameWalkthrough Component
 * Safely handles the injection of the GameMonetize walkthrough video script.
 * Uses React refs and effects to prevent hydration mismatches and clean up external resources.
 */
export const GameWalkthrough = ({ gameId }: GameWalkthroughProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!gameId || !containerRef.current) return;

    // Reset container for fresh uplink
    containerRef.current.innerHTML = '<div id="gamemonetize-video" style="width:100%; height:480px;"></div>';

    // Set global configuration required by video.js
    (window as any).VIDEO_OPTIONS = {
      gameid: gameId,
      width: "100%",
      height: "480px",
      color: "#A855F7", // Neon Purple
      getAds: "false"
    };

    const script = document.createElement("script");
    script.src = "https://api.gamemonetize.com/video.js";
    script.async = true;
    
    containerRef.current.appendChild(script);

    return () => {
      // Cleanup: Remove global variable and clear the DOM injection site
      delete (window as any).VIDEO_OPTIONS;
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [gameId]);

  return (
    <div className="bg-[#140A2E] p-5 sm:p-8 border-2 border-[#1B123D]">
      <h3 className="font-pixel text-[10px] sm:text-xs text-white uppercase mb-6 border-b border-[#1B123D] pb-2 tracking-widest flex items-center gap-3">
        <span className="w-2 h-2 bg-neon-purple animate-pulse" /> Mission Walkthrough
      </h3>
      
      <div 
        ref={containerRef} 
        className="w-full relative min-h-[300px] bg-black/20 flex items-center justify-center overflow-hidden border border-white/5"
      >
        {/* The video script will inject its iframe here */}
        <div className="font-pixel text-[8px] text-muted animate-pulse uppercase">Establishing Visual Link...</div>
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
