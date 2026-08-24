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
      <div className="text-center mb-6">
        <h2 className="text-2xl sm:text-3xl font-display text-white tracking-tight">
          Pick Your Era
        </h2>
        <p className="text-xs sm:text-sm font-hindi text-amber-300/80 mt-0.5">
          अपना पसंदीदा दौर चुनें — हर दशक की अपनी कहानी
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto px-4">
        {ERA_FILTERS.map((era) => {
          const isSelected = selectedEra === era.id;

          return (
            <motion.button
              key={era.id}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                soundSynth.playSwitchClick();
                onSelectEra(era.id as Era);
              }}
              className={`relative text-left p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between select-none ${
                isSelected
                  ? 'bg-gradient-to-b from-[#2b0b06] to-[#150503] border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.3)]'
                  : 'bg-black/40 hover:bg-black/60 border-white/10 hover:border-white/20'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">{era.icon}</span>
                  <span
                    className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${
                      isSelected
                        ? 'bg-amber-400 text-black border-amber-300'
                        : 'bg-white/10 text-white/60 border-white/15'
                    }`}
                  >
                    {era.years}
                  </span>
                </div>

                <h3 className="font-display text-lg text-white">
                  {era.label}
                </h3>
                <p className="text-xs font-hindi text-amber-300 font-bold mt-0.5">
                  {era.tagline}
                </p>
                <p className="text-xs text-white/60 font-sans mt-2 leading-relaxed">
                  {era.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                <span className={isSelected ? 'text-amber-400 font-bold' : 'text-white/40'}>
                  {isSelected ? '● ACTIVE' : 'SELECT'}
                </span>
                <span>{isSelected ? '✓' : '→'}</span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
};
