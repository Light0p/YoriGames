"use client"

import React, { useEffect, useState } from 'react';
import { Video } from 'lucide-react';

/**
 * GameWalkthrough Component
 * Nukes custom overlays to prevent click blocking and uses strict aspect-video 
 * constraints to prevent horizontal squishing on mobile.
 */
export const GameWalkthrough = ({ gameUrl }: { gameUrl: string, thumbnail?: string }) => {
  const [extractedId, setExtractedId] = useState<string>("");
  const [hasFailed, setHasFailed] = useState(false);

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

  useEffect(() => {
    if (!extractedId || hasFailed) return;

    // Set the Global Config required by the GameMonetize API
    (window as any).VIDEO_OPTIONS = {
      gameid: extractedId,
      width: "100%",
      height: "100%",
      color: "#A855F7",
      getAds: "false"
    };

    const scriptId = "gm-video-script";
    const script = document.createElement("script");
    script.id = scriptId;
    script.src = "https://api.gamemonetize.com/video.js";
    script.async = true;
    document.body.appendChild(script);

    // Watchdog to check if iframe fails to load
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
  }, [extractedId, hasFailed]);

  if (hasFailed) return null;

  return (
    <div className="bg-[#140A2E] p-5 sm:p-8 border-2 border-[#1B123D] relative overflow-hidden group rounded-xl">
      <h3 className="font-pixel text-[10px] sm:text-xs text-white uppercase mb-6 border-b border-[#1B123D] pb-2 tracking-widest flex items-center gap-3">
        <Video className="w-4 h-4 text-neon-purple" /> Mission Walkthrough
      </h3>
      
      {/* Responsive aspect-video container - Fixed Squishing & Blocked Clicks */}
      <div className="relative w-full aspect-video rounded-md overflow-hidden bg-black/20">
        <div id="gamemonetize-video" className="absolute top-0 left-0 w-full h-full" />
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