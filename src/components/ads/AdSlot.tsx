"use client"

import React, { useEffect } from 'react';
import { cn } from '@/lib/utils';

interface AdSlotProps {
  className?: string;
  slot: string;
  format?: 'auto' | 'fluid' | 'rectangle' | 'horizontal';
  responsive?: 'true' | 'false';
}

/**
 * Standard AdSlot Component.
 */
export const AdSlot = ({ 
  className, 
  slot, 
  format = 'auto', 
  responsive = 'true'
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
    <div className={cn("w-full flex items-center justify-center my-8", className)}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-7395050320323237"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive}
      />
    </div>
  );
};
