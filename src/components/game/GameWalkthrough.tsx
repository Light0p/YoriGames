"use client"

import React, { useEffect, useState } from 'react';

/**
 * GameWalkthrough Component
 * Dynamically loads GameMonetize walkthrough videos based on hashed Game ID.
 * Features an auto-hide fallback if no video is available.
 */
export const GameWalkthrough = ({ gameUrl }: { gameUrl: string }) => {
  const [extractedId, setExtractedId] = useState<string>("");
  const [hasFailed, setHasFailed] = useState(false);

  useEffect(() => {
    if (!gameUrl) {
      setHasFailed(true);
      return;
    }
    
    // Safely extract the hash ID from the Game URL
    // Example: https://html5.gamemonetize.co/lcw5kj735t9wseirvvxd5rtdj2jx5d1m/
    try {
      const urlObj = new URL(gameUrl);
      const pathParts = urlObj.pathname.split('/').filter(Boolean);
      if (pathParts.length > 0) {
        setExtractedId(pathParts[0]); 
      } else {
        setHasFailed(true);
      }
    } catch (e) {
      console.error("Invalid URL format for walkthrough extraction:", e);
      setHasFailed(true);
    }
  }, [gameUrl]);

  useEffect(() => {
    if (!extractedId || hasFailed) return;

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

    // Watchdog: If no iframe is injected within 8s, assume no video exists and hide
    const watchdogTimer = setTimeout(() => {
      const container = document.getElementById("gamemonetize-video");
      if (container && !container.querySelector('iframe')) {
        console.info(`Walkthrough uplink timed out for ${extractedId}. Engaging stealth mode.`);
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
  }, [extractedId, hasFailed]);

  // Clean UI: If the video fails or doesn't exist, remove the section entirely
  if (hasFailed) return null;

  return (
    <div className="bg-[#140A2E] p-5 sm:p-8 border-2 border-[#1B123D] relative">
      <h3 className="font-pixel text-[10px] sm:text-xs text-white uppercase mb-6 border-b border-[#1B123D] pb-2 tracking-widest flex items-center gap-3">
        <span className="w-2 h-2 bg-neon-purple animate-pulse" /> Mission Walkthrough
      </h3>
      
      <div className="w-full relative min-h-[480px] bg-black/20 flex items-center justify-center overflow-hidden border border-white/5">
        
        {/* Visual Feedback during Handshake */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <div className="font-pixel text-[8px] text-muted animate-pulse uppercase">Establishing Visual Link...</div>
        </div>

        {/* The GameMonetize Video Target */}
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
