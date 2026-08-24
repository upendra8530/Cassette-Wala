'use client';

import React from 'react';

interface CassetteSpoolProps {
  isSpinning: boolean;
  speed?: 'normal' | 'fast';
  direction?: 'forward' | 'reverse';
  tapeAmountPercent?: number; // 0 to 100 representing how much tape is wound around this spool
  size?: 'sm' | 'md' | 'lg';
}

export const CassetteSpool: React.FC<CassetteSpoolProps> = ({
  isSpinning,
  speed = 'normal',
  direction = 'forward',
  tapeAmountPercent = 50,
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'w-7 h-7',
    md: 'w-11 h-11',
    lg: 'w-16 h-16',
  }[size];

  const hubSizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-7 h-7',
    lg: 'w-10 h-10',
  }[size];

  const tapeRadiusMax = size === 'sm' ? 16 : size === 'md' ? 24 : 34;
  const tapeRadiusMin = size === 'sm' ? 8 : size === 'md' ? 14 : 20;
  const currentTapeRadius = tapeRadiusMin + ((tapeRadiusMax - tapeRadiusMin) * (tapeAmountPercent / 100));

  const animationClass = isSpinning
    ? speed === 'fast'
      ? direction === 'forward'
        ? 'animate-spin-fast'
        : 'animate-spin-fast-reverse'
      : direction === 'forward'
      ? 'animate-spin-slow'
      : 'animate-spin-reverse'
    : '';

  return (
    <div className={`relative flex items-center justify-center ${sizeClasses}`}>
      {/* Wound Magnetic Tape Layer */}
      <div
        className="absolute rounded-full bg-gradient-to-tr from-[#1b120c] via-[#2d1b11] to-[#120a06] transition-all duration-700 ease-out border border-[#3b2416]/60 shadow-inner"
        style={{
          width: `${currentTapeRadius * 2}px`,
          height: `${currentTapeRadius * 2}px`,
        }}
      >
        {/* Subtle tape winding ridges */}
        <div className="absolute inset-0 rounded-full border border-dashed border-[#5a3b26]/30" />
      </div>

      {/* Outer White/Ivory Toothed Cog Spool */}
      <div
        className={`relative rounded-full bg-[#f4ecd8] border border-[#d6c7a3] shadow-md flex items-center justify-center ${hubSizeClasses} ${animationClass}`}
        style={{ transformOrigin: 'center center' }}
      >
        {/* Center Axle Hole */}
        <div className="w-2.5 h-2.5 rounded-full bg-[#111112] border border-[#555] shadow-inner relative flex items-center justify-center">
          {/* Spindle peg hint */}
          <div className="w-1 h-1 rounded-full bg-[#2a2a2c]" />
        </div>

        {/* 6 Teeth / Spokes for the tape drive gear */}
        {[0, 60, 120, 180, 240, 300].map((deg) => (
          <div
            key={deg}
            className="absolute w-[2px] h-[5px] bg-[#3a352d] rounded-sm"
            style={{
              top: '1px',
              left: 'calc(50% - 1px)',
              transformOrigin: '50% calc(100% + 2px)',
              transform: `rotate(${deg}deg)`,
            }}
          />
        ))}

        {/* 3 Drive slots */}
        {[0, 120, 240].map((deg) => (
          <div
            key={`slot-${deg}`}
            className="absolute w-[3px] h-[3px] bg-[#c2b291] rounded-full"
            style={{
              top: '3px',
              left: 'calc(50% - 1.5px)',
              transformOrigin: '50% calc(100% + 1px)',
              transform: `rotate(${deg}deg)`,
            }}
          />
        ))}
      </div>
    </div>
  );
};
