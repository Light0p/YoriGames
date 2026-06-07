
"use client"

import React, { useEffect } from 'react';
import { SpaceBackground } from '@/components/layout/SpaceBackground';
import { PixelButton } from '@/components/pixel/PixelButton';
import { AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 text-center">
      <SpaceBackground />
      <div className="max-w-xl bg-[#140A2E] border-4 border-[#1B123D] p-12 shadow-[8px_8px_0_0_#000]">
        <div className="mb-8 flex justify-center">
          <div className="bg-destructive/20 p-4 border-4 border-destructive">
            <AlertCircle className="w-12 h-12 text-destructive" />
          </div>
        </div>
        <h1 className="font-pixel text-2xl text-white mb-4 uppercase">SYSTEM CRITICAL FAILURE</h1>
        <p className="font-body text-muted mb-8">
          A cosmic anomaly has occurred in the game engine. Our engineers are investigating.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <PixelButton variant="secondary" onClick={() => reset()} className="w-full sm:w-auto">
            REBOOT SYSTEM
          </PixelButton>
          <Link href="/" className="w-full sm:w-auto">
            <PixelButton variant="primary" className="w-full">
              RETURN TO BASE
            </PixelButton>
          </Link>
        </div>
      </div>
    </div>
  );
}
