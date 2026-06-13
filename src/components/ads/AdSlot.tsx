"use client"

import React, { memo, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface AdSlotProps {
  className?: string;
  slot: string;
  format?: 'auto' | 'fluid' | 'rectangle' | 'horizontal';
  responsive?: 'true' | 'false';
  minHeight?: string;
}

/**
 * CLS-Safe AdSlot Component.
 * Reserves layout space before the ad loads to prevent Cumulative Layout Shift.
 * Memoized to prevent unnecessary re-renders.
 */
const AdSlotComponent = ({ 
  className, 
  slot, 
  format = 'auto', 
  responsive = 'true',
  minHeight = '90px' 
}: AdSlotProps) => {
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error('AdSense push error:', err);
    }
  }, []);

  return (
    <div 
      className={cn(
        "w-full bg-[#140A2E]/30 border border-[#1B123D] flex items-center justify-center overflow-hidden my-8",
        className
      )}
      style={{ minHeight }}
    >
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: '100%', height: '100%' }}
        data-ad-client="ca-pub-7395050320323237"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive}
      />
    </div>
  );
};

export const AdSlot = memo(AdSlotComponent);
