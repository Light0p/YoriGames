"use client"

import React from 'react';
import { cn } from '@/lib/utils';

interface PixelButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'gold';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const PixelButton = ({ 
  variant = 'primary', 
  size = 'md', 
  children, 
  className, 
  type = 'button',
  ...props 
}: PixelButtonProps) => {
  // WCAG AA Contrast Adjustments:
  // Primary background darkened to #7C3AED for better contrast with white text.
  // Secondary background darkened to #BE185D for better contrast with white text.
  const variants = {
    primary: 'bg-[#7C3AED] border-[#6D28D9] hover:bg-[#6D28D9] text-white',
    secondary: 'bg-[#BE185D] border-[#9D174D] hover:bg-[#9D174D] text-white',
    accent: 'bg-neon-cyan border-[#0891B2] hover:bg-[#0E7490] text-black font-bold',
    gold: 'bg-neon-gold border-[#D97706] hover:bg-[#B45309] text-black font-bold',
  };

  const sizes = {
    sm: 'px-4 py-2.5 text-[10px] sm:text-xs min-h-[44px]',
    md: 'px-6 py-3.5 text-xs sm:text-sm min-h-[48px]',
    lg: 'px-8 sm:px-10 py-4.5 sm:py-4 text-sm sm:text-base min-h-[56px]',
  };

  return (
    <button
      type={type}
      className={cn(
        'relative inline-block font-pixel transition-transform active:scale-95 group overflow-hidden touch-manipulation uppercase tracking-wider',
        'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-neon-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-[#09061B]',
        variants[variant],
        sizes[size],
        'border-b-4 border-r-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)]',
        className
      )}
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center gap-2 whitespace-nowrap">
        {children}
      </span>
      {/* Pixel highlight */}
      <div className="absolute top-0 left-0 w-full h-1 bg-white/20 pointer-events-none" aria-hidden="true" />
      <div className="absolute top-0 left-0 w-1 h-full bg-white/20 pointer-events-none" aria-hidden="true" />
    </button>
  );
};