'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Disc3, BookOpen, Music2, Sparkles } from 'lucide-react';
import { CassetteData } from '@/lib/types';
import { CassetteSpool } from './CassetteSpool';
import { soundSynth } from '@/lib/soundSynth';

interface CassetteCardProps {
  cassette: CassetteData;
  isCurrentlyLoaded: boolean;
  isPlaying: boolean;
  onSelect: (cassette: CassetteData) => void;
  onViewJCard: (cassette: CassetteData) => void;
}

export const CassetteCard: React.FC<CassetteCardProps> = ({
  cassette,
  isCurrentlyLoaded,
  isPlaying,
  onSelect,
  onViewJCard,
}) => {
  const [currentSide, setCurrentSide] = useState<'A' | 'B'>('A');

  const handleFlip = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundSynth.playSwitchClick();
    setCurrentSide((prev) => (prev === 'A' ? 'B' : 'A'));
  };

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundSynth.playTapeInsert();
    onSelect(cassette);
  };

  const handleJCardClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundSynth.playButtonClick();
    onViewJCard(cassette);
  };

  const currentSideTracks = currentSide === 'A' ? cassette.sideA : cassette.sideB;

  return (
    <div className="group relative flex flex-col select-none">
      {/* Physical Cassette Tape Body */}
      <motion.div
        whileHover={{
          scale: 1.02,
          y: -4,
        }}
        transition={{ duration: 0.2 }}
        onClick={handlePlayClick}
        className="cursor-pointer relative w-full aspect-[1.58/1] rounded-2xl p-3 sm:p-4 bg-gradient-to-b from-[#220d08] via-[#150604] to-[#0e0402] border border-amber-500/25 shadow-cassette overflow-hidden transition-all duration-300"
        style={{
          boxShadow: isCurrentlyLoaded
            ? '0 0 0 2px #f59e0b, 0 16px 36px rgba(245, 158, 11, 0.35)'
            : undefined,
        }}
      >
        {/* Subtle Glare & Screws */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-white/[0.02] to-white/[0.06] rounded-2xl" />
        <div className="absolute top-2.5 left-2.5 w-1.5 h-1.5 rounded-full bg-stone-600 shadow-inner" />
        <div className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full bg-stone-600 shadow-inner" />
        <div className="absolute bottom-2.5 left-2.5 w-1.5 h-1.5 rounded-full bg-stone-600 shadow-inner" />
        <div className="absolute bottom-2.5 right-2.5 w-1.5 h-1.5 rounded-full bg-stone-600 shadow-inner" />

        {/* Paper Cassette Label */}
        <div
          className="relative w-full h-[62%] rounded-xl p-2 sm:p-2.5 flex flex-col justify-between border shadow-inner transition-colors duration-300"
          style={{
            backgroundColor: cassette.coverColor.labelBg,
            borderColor: cassette.coverColor.border,
            color: cassette.coverColor.labelText,
          }}
        >
          {/* Label Header Banner */}
          <div
            className="flex items-center justify-between px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider text-white shadow-sm"
            style={{ backgroundColor: cassette.coverColor.base }}
          >
            <span className="truncate max-w-[150px] font-mono">
              {cassette.recordLabel ? cassette.recordLabel.split(' ')[0] : 'SUPER HIT'} STEREO
            </span>
            <div className="flex items-center gap-1 font-mono text-[9px]">
              <span className="bg-black/30 px-1 rounded">
                SIDE {currentSide}
              </span>
              <span className="opacity-80">{cassette.yearRange}</span>
            </div>
          </div>

          {/* Title & Subtitle */}
          <div className="px-1 my-auto">
            <h3 className="font-hindi text-base sm:text-lg font-bold leading-tight line-clamp-1">
              {cassette.hindiTitle || cassette.title}
            </h3>
            <p className="text-[10px] sm:text-xs opacity-75 font-sans truncate font-medium">
              {cassette.subtitle}
            </p>
          </div>

          {/* Bottom Label Stripe */}
          <div className="flex items-center justify-between text-[9px] font-mono border-t border-black/15 pt-0.5 opacity-85">
            <span className="truncate max-w-[120px] font-bold">
              {cassette.featuredBadge || 'C-90 HIGH OUTPUT'}
            </span>
            <span className="font-bold text-red-700">{cassette.era}</span>
          </div>
        </div>

        {/* Acrylic Center Window with Spools */}
        <div className="relative mt-2 w-[76%] mx-auto h-[26%] bg-black/75 rounded-md border border-stone-800 px-3 py-1 flex items-center justify-between shadow-inner overflow-hidden">
          <CassetteSpool
            isSpinning={isCurrentlyLoaded && isPlaying}
            speed="normal"
            direction="forward"
            tapeAmountPercent={currentSide === 'A' ? 65 : 35}
            size="sm"
          />

          <div className="flex-1 flex flex-col items-center justify-center px-1 text-[7px] text-stone-400 font-mono">
            <div className="w-full flex justify-between px-1">
              <span>100</span>
              <span>50</span>
              <span>0</span>
            </div>
            <div className="w-full h-1.5 bg-stone-900 rounded-sm my-0.5 border border-stone-800" />
            <span className="tracking-widest text-[6.5px] uppercase text-amber-400">
              {isCurrentlyLoaded ? (isPlaying ? '● PLAYING' : '❚❚ PAUSED') : 'CASSETTE TAPE'}
            </span>
          </div>

          <CassetteSpool
            isSpinning={isCurrentlyLoaded && isPlaying}
            speed="normal"
            direction="forward"
            tapeAmountPercent={currentSide === 'A' ? 35 : 65}
            size="sm"
          />
        </div>

        {/* Loaded Badge */}
        {isCurrentlyLoaded && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-amber-500 text-black text-[9px] font-mono font-bold px-2 py-0.5 rounded-full shadow-lg flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5" />
            <span>NOW IN DECK</span>
          </div>
        )}
      </motion.div>

      {/* Cassette Info & Controls */}
      <div className="mt-3 flex items-center justify-between gap-2 px-1">
        <div className="flex-1 min-w-0">
          <p className="text-xs text-amber-200 font-hindi font-bold truncate">
            {cassette.title}
          </p>
          <p className="text-[11px] text-white/50 truncate font-sans">
            {cassette.source}
          </p>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {/* Flip Side */}
          <button
            onClick={handleFlip}
            className="px-2 py-1 bg-white/10 hover:bg-white/20 text-white/80 text-[10px] font-mono font-bold rounded-lg border border-white/15 transition-colors"
          >
            SIDE {currentSide} ⇄
          </button>

          {/* J-Card */}
          <button
            onClick={handleJCardClick}
            className="p-1.5 bg-white/10 hover:bg-white/20 text-white/80 rounded-lg border border-white/15 transition-colors"
            title="View J-Card Inlay"
          >
            <BookOpen className="w-3.5 h-3.5" />
          </button>

          {/* Play */}
          <button
            onClick={handlePlayClick}
            className={`px-3 py-1 text-xs font-bold rounded-lg flex items-center gap-1 shadow-md transition-all ${
              isCurrentlyLoaded && isPlaying
                ? 'bg-amber-500 text-black'
                : 'bg-red-800 hover:bg-red-700 text-white'
            }`}
          >
            {isCurrentlyLoaded && isPlaying ? (
              <>
                <Disc3 className="w-3.5 h-3.5 animate-spin" />
                <span className="font-mono text-[10px]">PLAYING</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3 fill-current" />
                <span className="font-mono text-[10px]">PLAY</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
