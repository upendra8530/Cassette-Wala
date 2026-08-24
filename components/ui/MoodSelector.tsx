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
    <section className="my-8 sm:my-12">
      {/* Header */}
      <div className="text-center mb-5 sm:mb-6">
        <h3 className="font-serif text-xl sm:text-2xl font-black text-stone-100 uppercase tracking-wide">
          WHAT&apos;S YOUR MOOD?
        </h3>
        <p className="text-xs sm:text-sm font-hindi text-amber-200/80 mt-0.5">
          जैसा मिज़ाज, वैसा तराना
        </p>
      </div>

      {/* Mood Badges Carousel / Grid */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 max-w-5xl mx-auto px-4">
        {MOOD_FILTERS.map((m) => {
          const isSelected = selectedMood === m.id;

          return (
            <motion.button
              key={m.id}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                soundSynth.playSwitchClick();
                onSelectMood(m.id as Mood);
              }}
              className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 flex items-center gap-2 border shadow-sm ${
                isSelected
                  ? 'bg-gradient-to-r from-retro-red via-retro-rust to-retro-red text-white border-red-400 font-bold shadow-amber-glow'
                  : 'bg-wood-900/80 hover:bg-wood-800 text-stone-300 hover:text-amber-200 border-wood-700 hover:border-wood-600'
              }`}
            >
              <span className="text-base sm:text-lg">{m.emoji}</span>
              <span className="font-sans">{m.label}</span>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
};
