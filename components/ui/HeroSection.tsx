'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Play, Sparkles, Disc, Radio, Music, Compass } from 'lucide-react';
import { soundSynth } from '@/lib/soundSynth';

interface HeroSectionProps {
  onPlayCassetteClick: () => void;
  onSurpriseMeClick: () => void;
  onOpenMixtape: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onPlayCassetteClick,
  onSurpriseMeClick,
  onOpenMixtape,
}) => {
  return (
    <section className="relative pt-6 pb-12 sm:pb-16 text-center overflow-hidden">
      {/* Warm Retro Shop Lighting Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-br from-retro-gold/15 via-retro-red/10 to-transparent blur-3xl pointer-events-none rounded-full" />

      <div className="relative z-10 max-w-4xl mx-auto px-4">
        {/* Retro Shop Signboard / Vintage Stamp Badge */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-wood-900/90 border border-wood-600/80 shadow-md text-amber-200/90 mb-5"
        >
          <span className="w-2 h-2 rounded-full bg-retro-gold animate-ping" />
          <span className="font-mono text-xs uppercase tracking-widest font-bold">
            ESTD. 1982 • OLD INDIAN CASSETTE SHOP
          </span>
          <span className="text-stone-500">•</span>
          <span className="font-hindi text-xs font-bold text-amber-300">
            &ldquo;हर कैसेट में एक याद है&rdquo;
          </span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl md:text-7xl font-serif font-black tracking-tight text-stone-100 leading-[1.1]"
        >
          Rewind. Play.{' '}
          <span className="bg-gradient-to-r from-retro-gold via-retro-mustard to-retro-red bg-clip-text text-transparent italic">
            Relive.
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-4 sm:mt-5 text-base sm:text-xl text-stone-300 max-w-2xl mx-auto font-sans leading-relaxed font-normal"
        >
          Your favourite <strong className="text-amber-200 font-semibold">80s, 90s and 2000s</strong> memories — one physical cassette at a time.
        </motion.p>

        {/* Secondary Nostalgic Indian Quote */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-2 text-xs sm:text-sm font-hindi text-amber-300/80 font-medium"
        >
          &ldquo;यार, ये तो बचपन वाला कैसेट टाइम याद दिला दिया!&rdquo;
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3.5 sm:gap-4"
        >
          {/* Primary CTA: PLAY A CASSETTE */}
          <button
            onClick={() => {
              soundSynth.playTapeInsert();
              onPlayCassetteClick();
            }}
            className="group px-7 py-3.5 rounded-xl bg-gradient-to-r from-retro-red via-retro-crimson to-retro-rust text-white font-sans text-sm sm:text-base font-bold shadow-xl hover:shadow-amber-glow transition-all duration-300 flex items-center gap-2.5 active:scale-95 border border-red-400/40"
          >
            <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current group-hover:scale-110 transition-transform" />
            <span>PLAY A CASSETTE</span>
          </button>

          {/* Secondary CTA: SURPRISE ME 🎲 */}
          <button
            onClick={() => {
              soundSynth.playRewindWhoosh();
              onSurpriseMeClick();
            }}
            className="px-6 py-3.5 rounded-xl bg-wood-900/90 hover:bg-wood-800 text-amber-200 hover:text-amber-100 font-sans text-sm sm:text-base font-bold border-2 border-retro-gold/70 shadow-lg transition-all duration-300 flex items-center gap-2 active:scale-95 hover:border-amber-300"
          >
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-retro-gold animate-spin-slow" />
            <span>SURPRISE ME 🎲</span>
          </button>

          {/* Tertiary CTA: CREATE MIXTAPE */}
          <button
            onClick={() => {
              soundSynth.playButtonClick();
              onOpenMixtape();
            }}
            className="px-5 py-3.5 rounded-xl bg-wood-900/50 hover:bg-wood-800/80 text-stone-300 hover:text-stone-100 font-mono text-xs sm:text-sm font-semibold border border-wood-700 transition-all flex items-center gap-1.5 active:scale-95"
          >
            <Music className="w-4 h-4 text-retro-mustard" />
            <span>APNA MIXTAPE BANAO</span>
          </button>
        </motion.div>
      </div>
    </section>
  );
};
