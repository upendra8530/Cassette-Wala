'use client';

import React from 'react';
import { Radio, Sparkles, Plus, Disc, Music } from 'lucide-react';
import { SoundToggle } from '../ui/SoundToggle';
import { AudioSettings, Era } from '@/lib/types';
import { soundSynth } from '@/lib/soundSynth';

interface NavbarProps {
  onScrollToShelf: () => void;
  onScrollToDeck: () => void;
  onSurpriseMe: () => void;
  onOpenMixtape: () => void;
  audioSettings: AudioSettings;
  onUpdateAudioSettings: (settings: Partial<AudioSettings>) => void;
  selectedEra: Era;
  onSelectEra: (era: Era) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onScrollToShelf,
  onScrollToDeck,
  onSurpriseMe,
  onOpenMixtape,
  audioSettings,
  onUpdateAudioSettings,
  selectedEra,
  onSelectEra,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-wood-950/90 backdrop-blur-md border-b border-wood-800/80 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Brand Logo & Tagline */}
        <div
          onClick={onScrollToDeck}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-retro-gold via-retro-mustard to-retro-red flex items-center justify-center shadow-md group-hover:scale-105 transition-transform border border-amber-300/40">
            <Radio className="w-5 h-5 text-wood-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif font-black text-lg sm:text-xl text-stone-100 tracking-wider group-hover:text-amber-200 transition-colors uppercase">
                CASSETTE WALA
              </span>
              <span className="bg-retro-red text-white font-mono text-[9px] font-bold px-1.5 py-0.5 rounded shadow">
                STEREO
              </span>
            </div>
            <p className="text-[10px] font-sans text-stone-400 -mt-0.5">
              Rewind. Play. Relive.
            </p>
          </div>
        </div>

        {/* Quick Era Badges (Desktop) */}
        <nav className="hidden lg:flex items-center gap-1.5 bg-wood-900/80 p-1 rounded-xl border border-wood-700/80">
          {(['all', '1980s', '1990s', '2000s'] as const).map((era) => {
            const isSelected = selectedEra === era;
            const labels = {
              all: 'All Eras',
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
                className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                  isSelected
                    ? 'bg-retro-gold text-wood-950 shadow-sm'
                    : 'text-stone-300 hover:text-amber-200 hover:bg-wood-800'
                }`}
              >
                {labels[era]}
              </button>
            );
          })}
        </nav>

        {/* Action Buttons & Sound Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Sound & CRT Controls */}
          <SoundToggle
            settings={audioSettings}
            onUpdateSettings={onUpdateAudioSettings}
          />

          {/* Surprise Me Button */}
          <button
            onClick={() => {
              soundSynth.playRewindWhoosh();
              onSurpriseMe();
            }}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-wood-900 hover:bg-wood-800 text-amber-200 text-xs font-bold border border-retro-gold/60 shadow-sm transition-all active:scale-95"
            title="Surprise Me with a Random Nostalgic Tape"
          >
            <Sparkles className="w-3.5 h-3.5 text-retro-gold" />
            <span className="font-mono">SURPRISE ME</span>
          </button>

          {/* Create Mixtape Button */}
          <button
            onClick={() => {
              soundSynth.playButtonClick();
              onOpenMixtape();
            }}
            className="px-3 py-1.5 rounded-lg bg-retro-red hover:bg-retro-crimson text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5 active:scale-95 border border-red-400/30"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden xs:inline font-sans">MIXTAPE</span>
          </button>
        </div>
      </div>
    </header>
  );
};
