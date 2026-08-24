'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Radio } from 'lucide-react';
import { soundSynth } from '@/lib/soundSynth';

interface LoadingScreenProps {
  onComplete: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [counter, setCounter] = useState(1980);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Play mechanical click
    soundSynth.playRewindWhoosh();

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            onComplete();
          }, 400);
          return 100;
        }
        return prev + 2;
      });

      setCounter((prev) => {
        if (prev >= 2005) return 2005;
        return prev + 1;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7, ease: 'easeInOut' }}
      className="fixed inset-0 z-50 bg-[#0f0a07] text-[#f4eedb] flex flex-col items-center justify-center p-6 select-none overflow-hidden"
    >
      {/* Background warm vintage vignette */}
      <div className="absolute inset-0 bg-radial from-[#2d1d13]/60 via-[#18100b] to-[#0a0705] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center max-w-md w-full">
        {/* Animated Cassette with Rewinding Reels */}
        <div className="relative w-64 sm:w-72 aspect-[1.58/1] rounded-2xl bg-gradient-to-b from-[#222] via-[#151515] to-[#0e0e0e] border-4 border-[#3e3428] shadow-2xl p-4 flex flex-col justify-between mb-8">
          {/* Screw details */}
          <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-[#555]" />
          <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#555]" />
          <div className="absolute bottom-2 left-2 w-2 h-2 rounded-full bg-[#555]" />
          <div className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-[#555]" />

          {/* Cassette Label */}
          <div className="w-full bg-[#f4eedb] text-[#1c130d] rounded-lg p-2 border border-[#c8b38d] shadow-inner text-center">
            <div className="bg-[#b93826] text-white text-[9px] font-mono font-bold uppercase tracking-widest py-0.5 rounded">
              CASSETTE WALA • TIME MACHINE
            </div>
            <h2 className="font-hindi text-lg font-bold mt-1 text-[#b93826]">
              यादों का कैसेट रिवाइंड हो रहा है...
            </h2>
          </div>

          {/* Spools & Pencil Rewind Animation */}
          <div className="w-4/5 mx-auto h-12 bg-black/80 rounded-lg border border-stone-700 px-4 flex items-center justify-between shadow-inner relative">
            {/* Left Spool */}
            <div className="w-9 h-9 rounded-full bg-[#f4ecd8] border border-[#d6c7a3] flex items-center justify-center animate-spin-fast-reverse shadow">
              <div className="w-2 h-2 rounded-full bg-black" />
            </div>

            {/* Middle Tape Counter */}
            <div className="font-mono text-xs text-amber-400 font-bold tracking-widest bg-black px-2 py-0.5 rounded border border-stone-800">
              {counter}
            </div>

            {/* Right Spool */}
            <div className="w-9 h-9 rounded-full bg-[#f4ecd8] border border-[#d6c7a3] flex items-center justify-center animate-spin-fast-reverse shadow">
              <div className="w-2 h-2 rounded-full bg-black" />
            </div>
          </div>
        </div>

        {/* Text & Progress */}
        <h1 className="font-serif text-2xl sm:text-3xl font-black text-amber-200 uppercase tracking-widest mb-2">
          REWINDING TIME...
        </h1>
        <p className="text-xs sm:text-sm font-hindi text-amber-100/80 mb-6">
          &ldquo;हर कैसेट में एक याद है।&rdquo;
        </p>

        {/* Progress Bar */}
        <div className="w-full max-w-xs h-2 bg-stone-900 rounded-full overflow-hidden border border-stone-700 shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-retro-red via-retro-mustard to-retro-gold transition-all duration-100 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <span className="font-mono text-xs text-stone-400 mt-2">
          {progress}% LOADED
        </span>
      </div>
    </motion.div>
  );
};
