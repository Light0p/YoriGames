
"use client"

import React from 'react';
import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

/**
 * Client-side wrapper for the ArcadeInsightTool.
 * Using next/dynamic with ssr: false here is allowed because this is a Client Component.
 */
const DynamicArcadeInsight = dynamic(
  () => import('@/components/ai/ArcadeInsightTool').then((mod) => mod.ArcadeInsightTool),
  {
    loading: () => (
      <div className="w-full max-w-4xl mx-auto p-12 bg-[#1B123D] border-4 border-[#140A2E] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-8 h-8 text-neon-cyan animate-spin" />
        <div className="font-pixel text-[8px] text-muted uppercase animate-pulse">Loading AI Subsystems...</div>
      </div>
    ),
    ssr: false,
  }
);

export const ArcadeInsightWrapper = () => {
  return <DynamicArcadeInsight />;
};
