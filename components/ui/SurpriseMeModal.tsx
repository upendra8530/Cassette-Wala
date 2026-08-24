'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Play, Disc3, X } from 'lucide-react';
import { CassetteData } from '@/lib/types';
import { CassetteSpool } from '../cassette/CassetteSpool';
import { soundSynth } from '@/lib/soundSynth';

interface SurpriseMeModalProps {
  cassette: CassetteData | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmPlay: (cassette: CassetteData) => void;
}

export const SurpriseMeModal: React.FC<SurpriseMeModalProps> = ({
  cassette,
  isOpen,
  onClose,
  onConfirmPlay,
}) => {
  if (!isOpen || !cassette) return null;

  const handlePlayNow = () => {
    soundSynth.playTapeInsert();
    onConfirmPlay(cassette);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0"
        />

        <motion.div
          initial={{ scale: 0.85, opacity: 0, rotate: -3 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          exit={{ scale: 0.85, opacity: 0, rotate: 3 }}
          transition={{ type: 'spring', stiffness: 300, damping: 22 }}
          className="relative z-10 w-full max-w-md bg-[#faf4e6] text-[#1c130d] rounded-2xl shadow-2xl border-4 border-retro-gold p-6 text-center select-none overflow-hidden"
        >
          {/* Postcard stamp header */}
          <div className="flex items-center justify-between border-b-2 border-[#1c130d]/20 pb-3 mb-4">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-retro-red uppercase">
              <Sparkles className="w-4 h-4 text-retro-gold" />
              <span>NOSTALGIA ROULETTE</span>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-black/10 text-stone-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="my-2">
            <span className="font-handwriting text-xl text-[#8a5d3b] block">
              Tonight, you&apos;re listening to...
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-black text-[#1c130d] mt-1">
              {cassette.title}
            </h2>
            <p className="text-xs font-mono text-retro-red font-bold mt-1">
              {cassette.era} • {cassette.yearRange}
            </p>
            <p className="text-xs font-sans text-[#553723] mt-2 italic px-4">
              &ldquo;{cassette.description}&rdquo;
            </p>
          </div>

          {/* Cassette Graphic Preview */}
          <div className="my-5 p-3 rounded-xl bg-[#1c1c1f] border-2 border-[#3d2719] flex items-center justify-between text-white shadow-inner">
            <CassetteSpool isSpinning={true} speed="fast" size="sm" />
            <div className="text-center px-2">
              <span className="text-[10px] font-mono text-amber-300 block font-bold">
                {cassette.featuredBadge || 'AUTHENTIC C-90 STEREO'}
              </span>
              <span className="text-xs font-hindi text-stone-200">
                {cassette.hindiTitle || cassette.title}
              </span>
            </div>
            <CassetteSpool isSpinning={true} speed="fast" size="sm" />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl font-mono text-xs text-[#553723] hover:bg-black/5 font-bold transition-colors"
            >
              CHOOSE ANOTHER
            </button>
            <button
              onClick={handlePlayNow}
              className="px-6 py-2.5 rounded-xl bg-retro-red hover:bg-retro-crimson text-white font-sans text-xs font-bold flex items-center gap-2 shadow-lg transition-all active:scale-95 border border-red-400"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>INSERT & PLAY NOW</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
