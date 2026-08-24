'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MOOD_FILTERS } from '@/data/playlists';
import { Mood } from '@/lib/types';
import { soundSynth } from '@/lib/soundSynth';

interface MoodSelectorProps {
  selectedMood: Mood;
  onSelectMood: (mood: Mood) => void;
}

export const MoodSelector: React.FC<MoodSelectorProps> = ({
  selectedMood,
  onSelectMood,
}) => {
  return (
    <section className="my-8 sm:my-10">
      <div className="text-center mb-4">
        <h3 className="font-display text-xl sm:text-2xl text-white">
          What&apos;s Your Mood?
        </h3>
        <p className="text-xs sm:text-sm font-hindi text-amber-300/80">
          जैसा मिज़ाज, वैसा तराना
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto px-4">
        {MOOD_FILTERS.map((m) => {
          const isSelected = selectedMood === m.id;

          return (
            <button
              key={m.id}
              onClick={() => {
                soundSynth.playSwitchClick();
                onSelectMood(m.id as Mood);
              }}
              className={`tweak-pill ${
                isSelected
                  ? 'bg-amber-500/25 border-amber-400 text-amber-200 shadow-[0_0_12px_rgba(245,158,11,0.4)]'
                  : ''
              }`}
            >
              <span>{m.emoji}</span>
              <span>{m.label}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
};
