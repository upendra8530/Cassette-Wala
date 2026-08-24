'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  CloudRain,
  Radio,
  Plus,
  Heart,
  BookOpen,
} from 'lucide-react';
import { CassetteData, PlaybackStatus } from '@/lib/types';
import { soundSynth } from '@/lib/soundSynth';
import { formatTime } from '@/lib/youtubeHelper';

interface HeroSectionProps {
  cassette: CassetteData | null;
  playbackStatus: PlaybackStatus;
  currentTime: number;
  duration: number;
  currentTrackName?: string;
  volume: number;
  isMuted: boolean;
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onSeek: (seconds: number) => void;
  onVolumeChange: (vol: number) => void;
  onToggleMute: () => void;
  onOpenJCard?: () => void;
  onOpenMixtape?: () => void;
  onOpenSupport?: () => void;
  isRainActive?: boolean;
  onToggleRain?: () => void;
  isTapeHissActive?: boolean;
  onToggleTapeHiss?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  cassette,
  playbackStatus,
  currentTime,
  duration,
  currentTrackName,
  volume,
  isMuted,
  onPlay,
  onPause,
  onNext,
  onPrevious,
  onSeek,
  onOpenJCard,
  onOpenMixtape,
  onOpenSupport,
  isRainActive = false,
  onToggleRain,
  isTapeHissActive = false,
  onToggleTapeHiss,
}) => {
  const [onlineCount, setOnlineCount] = useState(1284);
  const isPlaying = playbackStatus === 'playing';
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineCount((prev) => prev + (Math.floor(Math.random() * 5) - 2));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handlePlayToggle = () => {
    if (isPlaying) {
      soundSynth.playTapeStop();
      onPause();
    } else {
      soundSynth.playTapeStart();
      onPlay();
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between items-center py-6 px-4 select-none">
      {/* Top Floating Controls Row */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-5xl flex items-center justify-between gap-2 z-20"
      >
        {/* Left: Online Listeners Pill */}
        <div className="header-pill px-3 py-1 text-emerald-400 gap-1.5 shrink-0 select-none">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
          <span className="text-white/95 font-mono font-bold text-xs">
            {onlineCount.toLocaleString()}
          </span>
          <span className="text-white/50 text-[10px] hidden sm:inline font-normal">
            listening
          </span>
        </div>

        {/* Right: Ambient & Action Tweak Pills */}
        <div className="flex items-center gap-1.5 xs:gap-2">
          {onToggleRain && (
            <button
              onClick={() => {
                soundSynth.playSwitchClick();
                onToggleRain();
              }}
              className={`tweak-pill ${isRainActive ? 'active' : ''}`}
              title="Toggle Monsoon Rain"
            >
              <CloudRain className="w-3.5 h-3.5 text-sky-400" />
              <span className="hidden sm:inline text-xs">Baarish</span>
            </button>
          )}

          {onToggleTapeHiss && (
            <button
              onClick={() => {
                soundSynth.playSwitchClick();
                onToggleTapeHiss();
              }}
              className={`tweak-pill ${isTapeHissActive ? 'active' : ''}`}
              title="Toggle Tape Hiss"
            >
              <Radio className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline text-xs">Tape Hiss</span>
            </button>
          )}

          {onOpenMixtape && (
            <button
              onClick={() => {
                soundSynth.playButtonClick();
                onOpenMixtape();
              }}
              className="tweak-pill hover:border-amber-400/60 hover:text-amber-200"
              title="Create Custom Mixtape"
            >
              <Plus className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline text-xs">+ Mixtape</span>
            </button>
          )}

          {onOpenSupport && (
            <button
              onClick={() => {
                soundSynth.playButtonClick();
                onOpenSupport();
              }}
              className="header-pill px-3 gap-1.5 hover:border-amber-400/50 hover:text-amber-200"
              title="Support Us"
            >
              <Heart className="w-3.5 h-3.5 text-red-500 fill-current animate-pulse" />
              <span className="text-xs hidden xs:inline">Support</span>
            </button>
          )}
        </div>
      </motion.div>

      {/* Centerpiece: Nostalgic Cassette Shop Atmosphere & Player */}
      <div className="flex-1 w-full max-w-3xl flex flex-col items-center justify-center my-auto py-6">
        {/* Brand Stamp with Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-black/50 border border-white/20 backdrop-blur-md mb-5 shadow-lg"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/favicon-32.png"
            alt="Cassette Wala"
            className="w-6 h-6 rounded-md object-cover border border-amber-400/40"
          />
          <span className="font-hindi text-amber-300 font-bold text-sm">
            कैसेट वाला
          </span>
          <span className="text-white/40 text-xs">•</span>
          <span className="font-mono text-[11px] text-white/70">
            ESTD. 1982
          </span>
        </motion.div>

        {/* Main Editorial Headlines */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="font-display text-4xl sm:text-6xl md:text-7xl text-white tracking-tight leading-[1.1] text-center"
        >
          Cassette Wala
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-3 font-hindi text-2xl sm:text-3xl text-amber-300 font-bold text-center"
        >
          &ldquo;हर कैसेट में एक याद है&rdquo;
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-2 text-xs sm:text-sm text-white/70 font-sans text-center max-w-md"
        >
          Rewind. Play. Relive. Pure Indian retro melodies.
        </motion.p>

        {/* Delux Salon-Style Floating Music Player Strip */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="w-full max-w-xl mt-8"
        >
          <div className="music-player mx-auto">
            {/* Spinning Cassette Spool Disc Hub */}
            <div
              onClick={handlePlayToggle}
              className="music-cover-frame"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              <div
                className={`music-cover ${isPlaying ? 'spinning' : ''}`}
                style={{
                  backgroundImage: cassette
                    ? `radial-gradient(circle at center, #2b120c 0%, ${cassette.coverColor.base} 100%)`
                    : 'radial-gradient(circle at center, #2b120c 0%, #1c0704 100%)',
                }}
              >
                <div className="w-full h-full flex items-center justify-center relative">
                  <div className="w-6 h-6 rounded-full border border-amber-400/40 bg-black/40 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-amber-400" />
                  </div>
                </div>
              </div>
              <div className="music-cover-hole" />
            </div>

            {/* Track Info & Progress Slider */}
            <div className="flex-1 min-w-0 flex flex-col gap-1">
              <div className="flex items-center justify-between gap-2">
                <span className="font-hindi text-sm sm:text-base font-bold text-white truncate">
                  {currentTrackName || cassette?.title || 'Dil Laga Liya'}
                </span>
                <span className="font-mono text-[10px] text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/20 shrink-0">
                  {cassette?.category || '90s Evergreen'}
                </span>
              </div>

              <p className="text-[11px] text-white/60 font-sans truncate">
                {cassette?.subtitle || 'Dil Hai Tumhaara (2002)'}
              </p>

              {/* Progress Bar */}
              <div className="flex items-center gap-2 mt-1 font-mono text-[10px] text-white/50">
                <span className="w-9 text-left">{formatTime(currentTime)}</span>
                <div
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const clickX = e.clientX - rect.left;
                    const newPct = clickX / rect.width;
                    onSeek(newPct * (duration || 100));
                  }}
                  className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden cursor-pointer relative"
                >
                  <div
                    className="h-full bg-amber-500 rounded-full transition-all duration-200"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <span className="w-9 text-right">{formatTime(duration)}</span>
              </div>
            </div>

            {/* Controls: Prev, Play, Next */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => {
                  soundSynth.playButtonClick();
                  onPrevious();
                }}
                aria-label="Previous"
                className="icon-button"
              >
                <SkipBack className="w-4 h-4 fill-current" />
              </button>

              <button
                onClick={handlePlayToggle}
                aria-label={isPlaying ? 'Pause' : 'Play'}
                className="play-button"
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 fill-current text-black" />
                ) : (
                  <Play className="w-5 h-5 fill-current text-black ml-0.5" />
                )}
              </button>

              <button
                onClick={() => {
                  soundSynth.playButtonClick();
                  onNext();
                }}
                aria-label="Next"
                className="icon-button"
              >
                <SkipForward className="w-4 h-4 fill-current" />
              </button>
            </div>
          </div>

          {/* View J-Card Booklet Inlay Link */}
          {cassette && onOpenJCard && (
            <div className="mt-3 flex items-center justify-center gap-2">
              <button
                onClick={() => {
                  soundSynth.playButtonClick();
                  onOpenJCard();
                }}
                className="text-[11px] font-mono text-white/60 hover:text-amber-300 flex items-center gap-1.5 transition-colors"
              >
                <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                <span>View Cassette Inlay / J-Card (ट्रैक लिस्ट व कैसेट कवर)</span>
              </button>
            </div>
          )}
        </motion.div>
      </div>

      {/* Minimal Bottom Subtle Credit */}
      <div className="relative z-10 text-[11px] text-white/40 font-mono text-center pb-2">
        <span>© {new Date().getFullYear()} Cassette Wala • Made for Indian retro music lovers</span>
      </div>
    </div>
  );
};
