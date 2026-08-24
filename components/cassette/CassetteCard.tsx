'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Disc3, BookOpen, Music2, Sparkles, Check } from 'lucide-react';
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
  const [isHovered, setIsHovered] = useState(false);

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

  // Body color variants
  const bodyStyles: Record<string, string> = {
    black: 'bg-gradient-to-b from-[#1c1c1f] via-[#141416] to-[#0d0d0f] border-[#2d2d32]',
    smoke: 'bg-gradient-to-b from-[#2a2624]/95 via-[#1a1614]/95 to-[#120f0d]/95 border-[#453629]/70',
    clear: 'bg-gradient-to-b from-[#22272e]/90 via-[#181c22]/90 to-[#101317]/90 border-[#384250]/60',
    red: 'bg-gradient-to-b from-[#4a1210] via-[#310908] to-[#1f0504] border-[#701e1a]',
    gold: 'bg-gradient-to-b from-[#3d2e11] via-[#281d07] to-[#171003] border-[#73531b]',
    teal: 'bg-gradient-to-b from-[#0e2f38] via-[#081e24] to-[#041217] border-[#185361]',
  };

  const activeBodyStyle = bodyStyles[cassette.coverColor.tapeBody] || bodyStyles.black;
  const currentSideTracks = currentSide === 'A' ? cassette.sideA : cassette.sideB;

  return (
    <motion.div
      className="group relative flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Tape Body Shell */}
      <motion.div
        whileHover={{
          scale: 1.025,
          y: -6,
          rotateX: 4,
          boxShadow: '0 24px 45px -8px rgba(0, 0, 0, 0.85), 0 0 20px rgba(217, 155, 38, 0.25)',
        }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        onClick={handlePlayClick}
        className={`cursor-pointer relative w-full aspect-[1.58/1] rounded-xl p-3 sm:p-3.5 border-2 ${activeBodyStyle} shadow-cassette select-none overflow-hidden transition-all duration-300 backdrop-blur-sm`}
        style={{
          boxShadow: isCurrentlyLoaded
            ? '0 0 0 2px #d99b26, 0 16px 36px -4px rgba(217, 155, 38, 0.4)'
            : undefined,
        }}
      >
        {/* Subtle Plastic Scratch & Glare Texture */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-white/[0.03] via-transparent to-white/[0.08] rounded-xl" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/[0.06] to-transparent opacity-60" />

        {/* 4 Corner Screws */}
        <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-[#52525b] border border-[#3f3f46] flex items-center justify-center shadow-inner">
          <div className="w-1 h-[1px] bg-[#27272a] transform rotate-45" />
        </div>
        <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#52525b] border border-[#3f3f46] flex items-center justify-center shadow-inner">
          <div className="w-1 h-[1px] bg-[#27272a] transform -rotate-12" />
        </div>
        <div className="absolute bottom-2.5 left-2.5 w-2 h-2 rounded-full bg-[#52525b] border border-[#3f3f46] flex items-center justify-center shadow-inner">
          <div className="w-1 h-[1px] bg-[#27272a] transform rotate-90" />
        </div>
        <div className="absolute bottom-2.5 right-2.5 w-2 h-2 rounded-full bg-[#52525b] border border-[#3f3f46] flex items-center justify-center shadow-inner">
          <div className="w-1 h-[1px] bg-[#27272a] transform rotate-30" />
        </div>

        {/* Center Screw */}
        <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#52525b] border border-[#3f3f46] flex items-center justify-center shadow-inner">
          <div className="w-1 h-[1px] bg-[#27272a] transform rotate-60" />
        </div>

        {/* Adhesive Paper Cassette Label */}
        <div
          className="relative w-full h-[62%] rounded-lg p-2 sm:p-2.5 flex flex-col justify-between border shadow-inner transition-colors duration-300"
          style={{
            backgroundColor: cassette.coverColor.labelBg,
            borderColor: cassette.coverColor.border,
            color: cassette.coverColor.labelText,
          }}
        >
          {/* Label Header Banner */}
          <div
            className="flex items-center justify-between px-2 py-0.5 rounded text-[10px] sm:text-xs font-bold uppercase tracking-wider text-white shadow-sm"
            style={{ backgroundColor: cassette.coverColor.base }}
          >
            <span className="truncate max-w-[140px] sm:max-w-[180px] font-display">
              {cassette.recordLabel ? cassette.recordLabel.split(' ')[0] : 'SUPER HIT'} STEREO
            </span>
            <div className="flex items-center gap-1.5 font-mono text-[9px] sm:text-[10px]">
              <span className="bg-black/40 px-1 rounded border border-white/20">
                SIDE {currentSide}
              </span>
              <span className="hidden sm:inline opacity-80">{cassette.yearRange}</span>
            </div>
          </div>

          {/* Title & Handwritten Style */}
          <div className="px-1 py-0.5 my-auto">
            <h3 className="font-hindi text-base sm:text-lg md:text-xl font-bold leading-tight line-clamp-1 tracking-wide">
              {cassette.title}
            </h3>
            <p className="text-[10px] sm:text-xs opacity-75 font-sans truncate font-medium">
              {cassette.subtitle}
            </p>
          </div>

          {/* Bottom Label Stripe */}
          <div className="flex items-center justify-between text-[9px] sm:text-[10px] font-mono border-t border-black/15 pt-0.5 opacity-85">
            <span className="truncate max-w-[110px] font-bold tracking-tight">
              {cassette.featuredBadge || 'C-90 HIGH OUTPUT'}
            </span>
            <div className="flex items-center gap-1">
              <span className="bg-black/10 px-1 rounded text-[8px]">DOLBY B NR</span>
              <span className="font-semibold text-retro-red">{cassette.era}</span>
            </div>
          </div>
        </div>

        {/* Central Transparent Acrylic Window with Spools */}
        <div className="relative mt-2 w-[72%] mx-auto h-[26%] bg-black/60 rounded-md border border-[#444]/60 px-3 py-1 flex items-center justify-between shadow-inner overflow-hidden">
          {/* Left Spool */}
          <CassetteSpool
            isSpinning={isCurrentlyLoaded && isPlaying}
            speed="normal"
            direction="forward"
            tapeAmountPercent={isCurrentlyLoaded ? (currentSide === 'A' ? 65 : 35) : 55}
            size="sm"
          />

          {/* Tape Bridge & Ruler Tick Marks */}
          <div className="flex-1 flex flex-col items-center justify-center px-1">
            <div className="w-full flex justify-between text-[7px] text-[#888] font-mono select-none px-1">
              <span>100</span>
              <span>50</span>
              <span>0</span>
            </div>
            {/* Magnetic Tape Bridge Bar */}
            <div className="w-full h-2 bg-gradient-to-r from-[#2c1d13] via-[#3d2719] to-[#2c1d13] rounded-sm my-0.5 border-y border-[#523725]/50 flex items-center justify-center">
              <div className="w-full h-[1px] bg-black/40" />
            </div>
            <span className="text-[7px] text-[#aaa] tracking-widest font-mono uppercase">
              {isCurrentlyLoaded ? (isPlaying ? '▶ PLAYING' : '❚❚ PAUSED') : 'COMPACT CASSETTE'}
            </span>
          </div>

          {/* Right Spool */}
          <CassetteSpool
            isSpinning={isCurrentlyLoaded && isPlaying}
            speed="normal"
            direction="forward"
            tapeAmountPercent={isCurrentlyLoaded ? (currentSide === 'A' ? 35 : 65) : 45}
            size="sm"
          />
        </div>

        {/* Bottom Trapezoid Tape Head Opening Notch */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[52%] h-2 bg-[#121214] rounded-t-sm border-t border-[#333] flex items-center justify-around px-4">
          <div className="w-2 h-1 bg-[#222] rounded-full" />
          <div className="w-3 h-1 bg-[#18181a] rounded-sm border border-[#2a2a2c]" />
          <div className="w-2 h-1 bg-[#222] rounded-full" />
        </div>

        {/* Active Glow Badge if Loaded */}
        {isCurrentlyLoaded && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-retro-gold text-wood-950 text-[9px] font-bold px-2 py-0.5 rounded-full shadow-lg flex items-center gap-1 animate-pulse border border-yellow-200">
            <Sparkles className="w-2.5 h-2.5" />
            <span>DECK MEIN HAI</span>
          </div>
        )}
      </motion.div>

      {/* Cassette Info & Action Controls */}
      <div className="mt-3 flex items-center justify-between gap-2 px-1">
        <div className="flex-1 min-w-0">
          <p className="text-xs text-amber-200/90 font-medium truncate font-sans">
            {cassette.hindiTitle || cassette.title}
          </p>
          <p className="text-[11px] text-stone-400 truncate">
            {cassette.source} • {cassette.trackCount} Tracks
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Flip Side Button */}
          <button
            onClick={handleFlip}
            aria-label={`Flip to Side ${currentSide === 'A' ? 'B' : 'A'}`}
            title={`Flip to Side ${currentSide === 'A' ? 'B' : 'A'}`}
            className="px-2 py-1 bg-wood-800/90 hover:bg-wood-700 text-stone-300 hover:text-amber-300 text-[10px] font-mono font-bold rounded border border-wood-600 transition-colors flex items-center gap-1 shadow-sm active:scale-95"
          >
            <span>SIDE {currentSide}</span>
            <span className="text-[9px] text-stone-400">⇄</span>
          </button>

          {/* J-Card Booklet Button */}
          <button
            onClick={handleJCardClick}
            aria-label="View Inlay / J-Card"
            title="View Inlay / J-Card"
            className="p-1.5 bg-wood-800/90 hover:bg-wood-700 text-stone-300 hover:text-amber-200 rounded border border-wood-600 transition-colors shadow-sm active:scale-95"
          >
            <BookOpen className="w-3.5 h-3.5" />
          </button>

          {/* Main Insert & Play Button */}
          <button
            onClick={handlePlayClick}
            aria-label={isCurrentlyLoaded && isPlaying ? "Playing" : "Insert & Play Cassette"}
            className={`px-3 py-1 text-xs font-bold rounded flex items-center gap-1.5 transition-all shadow-md active:scale-95 ${
              isCurrentlyLoaded
                ? 'bg-retro-gold text-wood-950 hover:bg-amber-400'
                : 'bg-retro-red hover:bg-retro-crimson text-white hover:shadow-amber-glow'
            }`}
          >
            {isCurrentlyLoaded && isPlaying ? (
              <>
                <Disc3 className="w-3.5 h-3.5 animate-spin text-wood-950" />
                <span className="hidden xs:inline font-mono">PLAYING</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span className="font-mono">PLAY</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Mini Track Preview Accordion on Hover */}
      <div className="mt-1.5 px-2 py-1 rounded bg-wood-900/60 border border-wood-800/60 text-[10px] text-stone-400 flex items-center justify-between">
        <span className="truncate max-w-[200px]">
          🎵 {currentSideTracks[0] || 'Original Sound Track'}
        </span>
        <span className="text-[9px] font-mono text-stone-500 shrink-0">
          {cassette.durationApprox}
        </span>
      </div>
    </motion.div>
  );
};
