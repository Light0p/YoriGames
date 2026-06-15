"use client"

import React, { useEffect, useState } from 'react';
import { Play, Video } from 'lucide-react';
import Image from 'next/image';

/**
 * GameWalkthrough Component
 * Performance-optimized version with high-contrast event listeners.
 * Features an interactive overlay to prevent background script overhead during initial load.
 */
export const GameWalkthrough = ({ gameUrl, thumbnail }: { gameUrl: string, thumbnail?: string }) => {
  const [extractedId, setExtractedId] = useState<string>("");
  const [hasFailed, setHasFailed] = useState(false);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (!gameUrl) {
      setHasFailed(true);
      return;
    }
    
    try {
      const urlObj = new URL(gameUrl);
      const pathParts = urlObj.pathname.split('/').filter(Boolean);
      if (pathParts.length > 0) {
        setExtractedId(pathParts[0]); 
      } else {
        setHasFailed(true);
      }
    } catch (e) {
      console.error("Walkthrough ID extraction failed:", e);
      setHasFailed(true);
    }
  }, [gameUrl]);

  // Script injection only occurs once the user clicks "Initialize"
  useEffect(() => {
    if (!extractedId || hasFailed || !isActive) return;

    // Set the Global Config required by the GameMonetize API
    (window as any).VIDEO_OPTIONS = {
      gameid: extractedId,
      width: "100%",
      height: "480px",
      color: "#A855F7",
      getAds: "false"
    };

    const scriptId = "gm-video-script";
    const script = document.createElement("script");
    script.id = scriptId;
    script.src = "https://api.gamemonetize.com/video.js";
    script.async = true;
    document.body.appendChild(script);

    // Watchdog: If no iframe is injected within 8s, fallback
    const watchdogTimer = setTimeout(() => {
      const container = document.getElementById("gamemonetize-video");
      if (container && !container.querySelector('iframe')) {
        setHasFailed(true);
      }
    }, 8000);

    return () => {
      clearTimeout(watchdogTimer);
      const scriptEl = document.getElementById(scriptId);
      if (scriptEl) scriptEl.remove();
      
      const container = document.getElementById("gamemonetize-video");
      if (container) container.innerHTML = ''; 
    };
  }, [extractedId, hasFailed, isActive]);

  if (hasFailed) return null;

  return (
    <div className="bg-[#140A2E] p-5 sm:p-8 border-2 border-[#1B123D] relative overflow-hidden group rounded-xl">
      <h3 className="font-pixel text-[10px] sm:text-xs text-white uppercase mb-6 border-b border-[#1B123D] pb-2 tracking-widest flex items-center gap-3">
        <Video className="w-4 h-4 text-neon-purple" /> Mission Walkthrough
      </h3>
      
      <div className="w-full relative min-h-[480px] bg-black/20 flex items-center justify-center overflow-hidden border border-white/5 rounded-lg">
        
        {!isActive ? (
          /* High-Contrast Event Listener Overlay */
          <button 
            onClick={() => setIsActive(true)}
            className="absolute inset-0 z-20 flex flex-col items-center justify-center group/btn outline-none focus-visible:ring-4 focus-visible:ring-neon-purple"
            aria-label="Load Game Walkthrough"
          >
            {thumbnail && (
              <div className="absolute inset-0 opacity-40 grayscale group-hover:grayscale-0 group-hover:opacity-60 transition-all duration-700 pointer-events-none">
                <Image 
                  src={thumbnail} 
                  alt="" 
                  fill 
                  className="object-cover" 
                />
              </div>
            )}
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors pointer-events-none" />
            
            <div className="relative z-30 bg-[#A855F7] p-6 rounded-full border-4 border-black shadow-[0_0_30px_rgba(168,85,247,0.4)] group-hover:scale-110 transition-transform duration-300">
              <Play className="w-8 h-8 text-white fill-white ml-1" />
            </div>
            
            <span className="relative z-30 font-pixel text-[10px] text-white mt-6 uppercase tracking-[0.2em] drop-shadow-lg group-hover:text-neon-cyan transition-colors">
              Initialize Video Uplink
            </span>
          </button>
        ) : (
          /* The GameMonetize Video Target */
          <div id="gamemonetize-video" className="w-full h-full z-10 relative">
             <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10">
               <div className="font-pixel text-[8px] text-muted animate-pulse uppercase">Syncing Visual Stream...</div>
             </div>
          </div>
        )}
      </div>
      
      <div className="mt-6 flex items-center justify-between opacity-40">
        <p className="font-pixel text-[6px] text-muted uppercase tracking-widest">
          Source: GM-Uplink-Video
        </p>
        <div className="flex gap-2">
          <div className="w-1.5 h-1.5 bg-neon-purple animate-pulse" />
          <div className="w-1.5 h-1.5 bg-neon-cyan animate-pulse delay-75" />
        </div>
      </div>
    </div>
  );
};
