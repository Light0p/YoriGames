import React from 'react';

export const PixelGamepad = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    shapeRendering="crispEdges"
  >
    {/* Purple Outline Layer */}
    <path 
      d="M7 5H17V6H19V8H21V16H19V18H17V19H15V18H9V19H7V18H5V16H3V8H5V6H7V5Z" 
      fill="#A855F7" 
    />
    {/* Dark Inner Body Layer */}
    <path 
      d="M8 6H16V7H18V9H20V15H18V17H16V18H15V17H9V18H8V17H6V15H4V9H6V7H8V6Z" 
      fill="#09061B" 
    />
    {/* D-Pad Cross (Left Side) */}
    <path 
      d="M7 11H10V12H11V13H10V14H7V13H6V12H7V11Z" 
      fill="#A855F7" 
    />
    {/* Button Diamond (Right Side) */}
    <path 
      d="M15 12H16V13H15V12ZM16 11H17V12H16V11ZM16 13H17V14H16V13ZM17 12H18V13H17V12Z" 
      fill="#A855F7" 
    />
  </svg>
);
