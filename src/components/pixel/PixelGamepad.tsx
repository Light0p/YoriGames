import React from 'react';

export const PixelGamepad = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    shapeRendering="crispEdges"
  >
    <path fill="#A855F7" d="M6 6h12v2h2v2h2v4h-2v4h-4v-2H8v2H4v-4H2v-4h2V8h2V6z"/>
    
    <path fill="#FFFFFF" d="M6 10h2v2h2v2h-2v2H6v-2H4v-2h2v-2z"/>
    
    <rect x="16" y="10" width="2" height="2" fill="#00F0FF"/>
    <rect x="14" y="12" width="2" height="2" fill="#E046B1"/>
    <rect x="18" y="12" width="2" height="2" fill="#E046B1"/>
    <rect x="16" y="14" width="2" height="2" fill="#00F0FF"/>
    
    <rect x="10" y="14" width="2" height="2" fill="#FFFFFF" opacity="0.7"/>
    <rect x="13" y="14" width="2" height="2" fill="#FFFFFF" opacity="0.7"/>
  </svg>
);
