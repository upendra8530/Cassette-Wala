'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, Plus, CloudRain, Radio, Heart } from 'lucide-react';
import { Era } from '@/lib/types';
import { soundSynth } from '@/lib/soundSynth';

interface NavbarProps {
  onScrollToShelf: () => void;
  onSurpriseMe: () => void;
  onOpenMixtape: () => void;
  onOpenSupport: () => void;
  isRainActive: boolean;
  onToggleRain: () => void;
  isTapeHissActive: boolean;
  onToggleTapeHiss: () => void;
  selectedEra: Era;
  onSelectEra: (era: Era) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onScrollToShelf,
  onSurpriseMe,
  onOpenMixtape,
  onOpenSupport,
  isRainActive,
  onToggleRain,
  isTapeHissActive,
  onToggleTapeHiss,
  selectedEra,
  onSelectEra,
}) => {
  const [onlineCount, setOnlineCount] = useState(1284);

  // Subtle real-time online counter fluctuation
  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineCount((prev) => prev + (Math.floor(Math.random() * 5) - 2));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-40 px-2.5 xs:px-3 sm:px-6 py-3 max-w-7xl mx-auto w-full">
      <div className="flex items-center justify-between gap-1.5 xs:gap-2 sm:gap-3 w-full">
        {/* 1. Online Counter Badge */}
        <div className="header-pill flex-1 sm:flex-initial sm:min-w-[110px] px-2.5 xs:px-3.5 text-emerald-400 gap-1.5 shrink-0 select-none">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
          <span className="text-white/95 font-mono font-bold tracking-tight text-xs">
            {onlineCount.toLocaleString()}
          </span>
          <span className="text-white/60 text-[10px] font-normal hidden xs:inline">
            listening
          </span>
        </div>

        {/* 2. Brand & Era Switcher */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => {
              soundSynth.playSwitchClick();
              onScrollToShelf();
            }}
            className="header-pill px-2.5 sm:px-3.5 gap-2 hover:border-amber-400/60 hover:text-amber-200"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/favicon-32.png"
              alt="Cassette Wala"
              className="w-5 h-5 rounded-md object-cover border border-amber-400/30"
            />
            <span className="font-hindi text-amber-400 font-bold text-sm">
              कैसेट वाला
            </span>
            <span className="text-white/50 text-[10px] hidden md:inline">
              (ESTD. 1982)
            </span>
          </button>

          {/* Era Pills (Desktop) */}
          <div className="hidden lg:flex items-center gap-1 bg-black/40 p-0.5 rounded-full border border-white/15 backdrop-blur-md">
            {(['all', '1980s', '1990s', '2000s'] as const).map((era) => {
              const isSelected = selectedEra === era;
              const labels = {
                all: 'All',
                '1980s': '80s Disco',
                '1990s': '90s Evergreen',
                '2000s': '2000s Hits',
              };

              return (
                <button
                  key={era}
                  onClick={() => {
                    soundSynth.playSwitchClick();
                    onSelectEra(era);
                    onScrollToShelf();
                  }}
                  className={`px-3 py-1 rounded-full text-[11px] font-medium transition-all ${
                    isSelected
                      ? 'bg-amber-500 text-black font-bold shadow-[0_0_12px_rgba(245,158,11,0.5)]'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {labels[era]}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Action Tweak Pills (Baarish, Hiss, Surprise, Mixtape, Support) */}
        <nav className="flex items-center gap-1.5 xs:gap-2 shrink-0">
          {/* Baarish Toggle */}
          <button
            onClick={() => {
              soundSynth.playSwitchClick();
              onToggleRain();
            }}
            className={`tweak-pill ${isRainActive ? 'active' : ''}`}
            title="Toggle Monsoon Rain & Distant Thunder Ambience"
          >
            <CloudRain className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden sm:inline text-xs">Baarish</span>
          </button>

          {/* Tape Hiss Toggle */}
          <button
            onClick={() => {
              soundSynth.playSwitchClick();
              onToggleTapeHiss();
            }}
            className={`tweak-pill ${isTapeHissActive ? 'active' : ''}`}
            title="Toggle Vintage Tape Hiss & Vinyl Noise"
          >
            <Radio className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline text-xs">Tape Hiss</span>
          </button>

          {/* Surprise Me Button */}
          <button
            onClick={() => {
              soundSynth.playRewindWhoosh();
              onSurpriseMe();
            }}
            className="tweak-pill hover:border-amber-400/60 hover:text-amber-200"
            title="Random Nostalgic Tape"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline text-xs">Surprise Me</span>
          </button>

          {/* Create Mixtape */}
          <button
            onClick={() => {
              soundSynth.playButtonClick();
              onOpenMixtape();
            }}
            className="tweak-pill hover:border-amber-400/60 hover:text-amber-200"
            title="Make Custom Mixtape"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden md:inline text-xs">+ Mixtape</span>
          </button>

          {/* Support Us */}
          <button
            onClick={onOpenSupport}
            className="header-pill px-3 gap-1.5 hover:border-amber-400/50 hover:text-amber-200"
          >
            <Heart className="w-3.5 h-3.5 text-red-500 fill-current animate-pulse" />
            <span className="font-semibold text-white/90 text-xs hidden xs:inline">
              Support
            </span>
          </button>
        </nav>
      </div>
    </header>
  );
};
