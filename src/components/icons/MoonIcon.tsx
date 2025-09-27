// @ts-ignore
import React from 'react';

interface MoonIconProps {
  size?: number;
  className?: string;
}

export const MoonIcon = ({ size = 18, className = '' }: MoonIconProps) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    height={size} 
    viewBox="0 0 18 18" 
    width={size}
    className={className}
  >
    <rect id="Canvas" fill="transparent" opacity="0" width="18" height="18" />
    <path fill="currentColor" d="M9,1a8,8,0,1,0,8,8A8,8,0,0,0,9,1Zm.5,14.982c-.165.0115-.332.018-.5.018A7,7,0,0,1,9,2c.168,0,.335.0065.5.018A11,11,0,0,0,9.5,15.982Z" />
  </svg>
);