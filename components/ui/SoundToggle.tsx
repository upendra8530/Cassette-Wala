'use client';

import React from 'react';
import { Volume2, VolumeX, Radio, Tv } from 'lucide-react';
import { AudioSettings } from '@/lib/types';
import { soundSynth } from '@/lib/soundSynth';

interface SoundToggleProps {
  settings: AudioSettings;
  onUpdateSettings: (newSettings: Partial<AudioSettings>) => void;
}

export const SoundToggle: React.FC<SoundToggleProps> = ({
  settings,
  onUpdateSettings,
}) => {
  const toggleSfx = () => {
    const nextState = !settings.sfxEnabled;
    soundSynth.setMuted(!nextState);
    if (nextState) soundSynth.playSwitchClick();
    onUpdateSettings({ sfxEnabled: nextState });
  };

  const toggleTapeHiss = () => {
    const nextHiss = !settings.tapeHissEnabled;
    soundSynth.playSwitchClick();
    if (nextHiss) {
      soundSynth.startTapeHiss(0.04);
    } else {
      soundSynth.stopTapeHiss();
    }
    onUpdateSettings({ tapeHissEnabled: nextHiss });
  };

  const toggleCrt = () => {
    soundSynth.playSwitchClick();
    onUpdateSettings({ crtEffect: !settings.crtEffect });
  };

  return (
    <div className="flex items-center gap-1.5 bg-wood-950/90 border border-wood-700/80 px-2.5 py-1 rounded-full text-stone-300 shadow-md">
      {/* SFX Audio Button */}
      <button
        onClick={toggleSfx}
        className={`p-1 rounded-full transition-colors flex items-center gap-1 ${
          settings.sfxEnabled
            ? 'text-retro-gold hover:text-amber-300'
            : 'text-stone-500 hover:text-stone-400'
        }`}
        title={settings.sfxEnabled ? 'Mute Mechanical SFX' : 'Enable Mechanical SFX'}
        aria-label={settings.sfxEnabled ? 'Mute Mechanical SFX' : 'Enable Mechanical SFX'}
      >
        {settings.sfxEnabled ? (
          <Volume2 className="w-3.5 h-3.5" />
        ) : (
          <VolumeX className="w-3.5 h-3.5" />
        )}
        <span className="text-[10px] font-mono font-bold hidden sm:inline">
          {settings.sfxEnabled ? 'SFX ON' : 'SFX OFF'}
        </span>
      </button>

      <span className="text-stone-700">|</span>

      {/* Tape Hiss Button */}
      <button
        onClick={toggleTapeHiss}
        className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold transition-colors flex items-center gap-1 ${
          settings.tapeHissEnabled
            ? 'bg-retro-gold/20 text-amber-300 border border-retro-gold/50'
            : 'text-stone-500 hover:text-stone-300'
        }`}
        title="Toggle Ambient Tape Hiss & Vinyl Crackle"
        aria-label="Toggle Ambient Tape Hiss & Vinyl Crackle"
      >
        <Radio className="w-3 h-3" />
        <span className="hidden md:inline">TAPE HISS</span>
      </button>

      <span className="text-stone-700">|</span>

      {/* CRT Scanline Toggle */}
      <button
        onClick={toggleCrt}
        className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold transition-colors flex items-center gap-1 ${
          settings.crtEffect
            ? 'bg-retro-gold/20 text-amber-300 border border-retro-gold/50'
            : 'text-stone-500 hover:text-stone-300'
        }`}
        title="Toggle Retro CRT Texture"
        aria-label="Toggle Retro CRT Texture"
      >
        <Tv className="w-3 h-3" />
        <span className="hidden md:inline">CRT</span>
      </button>
    </div>
  );
};
