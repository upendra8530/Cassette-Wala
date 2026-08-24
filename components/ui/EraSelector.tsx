'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ERA_FILTERS } from '@/data/playlists';
import { Era } from '@/lib/types';
import { soundSynth } from '@/lib/soundSynth';

interface EraSelectorProps {
  selectedEra: Era;
  onSelectEra: (era: Era) => void;
}

export const EraSelector: React.FC<EraSelectorProps> = ({
  selectedEra,
  onSelectEra,
}) => {
  return (
    <section className="my-10 sm:my-14">
      {/* Section Header */}
      <div className="text-center mb-6 sm:mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-wood-900 border border-wood-700 text-[11px] font-mono font-bold uppercase tracking-widest text-retro-gold mb-2">
          <span>TIME TRAVEL DIAL</span>
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-black text-stone-100 tracking-tight">
          PICK YOUR ERA
        </h2>
        <p className="text-xs sm:text-sm font-hindi text-amber-200/80 mt-1">
          अपना पसंदीदा दौर चुनें — हर दशक का अपना जादू
        </p>
      </div>

      {/* 3 Era Cards Grid (+ All option) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto px-4">
        {ERA_FILTERS.map((era) => {
          const isSelected = selectedEra === era.id;

          return (
            <motion.button
              key={era.id}
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                soundSynth.playSwitchClick();
                onSelectEra(era.id as Era);
              }}
              className={`relative text-left p-5 rounded-2xl border-2 transition-all duration-300 overflow-hidden flex flex-col justify-between select-none ${
                isSelected
                  ? 'bg-gradient-to-b from-[#3d2719] via-[#2a1a11] to-[#1a100a] border-retro-gold shadow-cassette-hover'
                  : 'bg-wood-950/80 hover:bg-wood-900 border-wood-800 hover:border-wood-600 shadow-md'
              }`}
            >
              {/* Background Glow for selected card */}
              {isSelected && (
                <div
                  className="pointer-events-none absolute -top-10 -right-10 w-32 h-32 rounded-full blur-2xl opacity-30"
                  style={{ backgroundColor: era.color }}
                />
              )}

              <div>
                {/* Era Header */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl">{era.icon}</span>
                  <span
                    className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${
                      isSelected
                        ? 'bg-retro-gold text-wood-950 border-amber-300'
                        : 'bg-wood-900 text-stone-400 border-wood-700'
                    }`}
                  >
                    {era.years}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-serif text-lg sm:text-xl font-black text-stone-100">
                  {era.label}
                </h3>
                <p className="text-xs font-mono text-retro-gold font-bold mt-0.5">
                  {era.tagline}
                </p>

                {/* Description */}
                <p className="text-xs text-stone-400 font-sans mt-2.5 leading-relaxed">
                  {era.description}
                </p>
              </div>

              {/* Bottom selection indicator */}
              <div className="mt-4 pt-3 border-t border-wood-800/80 flex items-center justify-between text-xs font-mono">
                <span className={isSelected ? 'text-amber-300 font-bold' : 'text-stone-500'}>
                  {isSelected ? '● ACTIVE ERA' : 'SELECT ERA'}
                </span>
                <span className="text-sm">{isSelected ? '✓' : '→'}</span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
};
