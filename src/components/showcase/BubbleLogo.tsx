'use client';

import React from 'react';

interface BubbleLogoProps {
  text?: string;
  variant?: 'blush' | 'sky' | 'dual' | 'charcoal';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const BubbleLogo: React.FC<BubbleLogoProps> = ({
  text = 'WARDROBE',
  variant = 'blush',
  size = 'md',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'text-2xl sm:text-3xl tracking-tight',
    md: 'text-3xl sm:text-4xl tracking-tighter',
    lg: 'text-5xl sm:text-6xl md:text-7xl tracking-tighter',
    xl: 'text-6xl sm:text-7xl md:text-8xl lg:text-9xl tracking-tighter',
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'sky':
        return 'text-[#38BDF8] drop-shadow-[0_4px_12px_rgba(56,189,248,0.25)]';
      case 'dual':
        return 'bg-gradient-to-r from-[#F498A9] via-[#C084FC] to-[#38BDF8] bg-clip-text text-transparent drop-shadow-[0_4px_16px_rgba(244,152,169,0.3)]';
      case 'charcoal':
        return 'text-[#1C1917] drop-shadow-[0_2px_8px_rgba(0,0,0,0.1)]';
      case 'blush':
      default:
        return 'text-[#E87A90] drop-shadow-[0_4px_14px_rgba(232,122,144,0.28)]';
    }
  };

  return (
    <div
      className={`inline-block select-none font-bubble uppercase leading-none font-black ${sizeClasses[size]} ${getVariantStyles()} ${className}`}
      style={{
        fontFamily: "'Fredoka', 'Comfortaa', 'Sniglet', 'Nunito', 'Arial Rounded MT Bold', sans-serif",
        WebkitTextStroke: variant === 'charcoal' ? '0px transparent' : '1px rgba(255,255,255,0.4)',
      }}
    >
      {text}
    </div>
  );
};
