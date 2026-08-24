'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Sparkles,
  BookOpen,
  Radio,
  Music,
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
  onScrollToShelf: () => void;
  onSurpriseMe: () => void;
  onOpenJCard?: () => void;
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
  onVolumeChange,
  onToggleMute,
  onScrollToShelf,
  onSurpriseMe,
  onOpenJCard,
}) => {
  const isPlaying = playbackStatus === 'playing';
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handlePlayToggle = () => {
    if (isPlaying) {
      soundSynth.playTapeStop();
      onPause();
    } else {
      soundSynth.playTapeStart();
      onPlay();
    }
  };

  const handleNextClick = () => {
    soundSynth.playButtonClick();
    onNext();
  };

  const handlePrevClick = () => {
    soundSynth.playButtonClick();
    onPrevious();
  };

  return (
    <section className="relative w-full min-h-[85vh] sm:min-h-[90vh] flex flex-col items-center justify-between pt-8 pb-12 px-4 text-center select-none overflow-hidden">
      {/* Warm Ambient Retro Glows */}
      <div className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-b from-amber-600/15 via-red-900/10 to-transparent blur-3xl rounded-full" />

      {/* Top Branding & Nostalgic Editorial Headlines */}
      <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center mt-2 sm:mt-6">
        {/* Vintage Shop Stamp */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-black/40 border border-white/15 backdrop-blur-md text-[11px] font-mono text-amber-300 mb-4 shadow-sm"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          <span>ESTD. 1982 • NOVELTY CINEMA LANE</span>
          <span className="text-white/40">•</span>
          <span className="font-hindi text-xs text-amber-200">
            पुरानी यादें, पुराने नगमे
          </span>
        </motion.div>

        {/* Main Title with Authentic Rozha Hindi Display Font */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="font-display text-4xl sm:text-6xl md:text-7xl text-white tracking-tight leading-[1.1]"
        >
          Cassette Wala
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-3 font-hindi text-xl sm:text-2xl md:text-3xl text-amber-300 font-bold"
        >
          &ldquo;हर कैसेट में एक याद है&rdquo;
        </motion.p>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-3 text-xs sm:text-sm text-white/70 max-w-xl font-sans leading-relaxed"
        >
          Your favourite <strong className="text-amber-200">80s, 90s and 2000s</strong> Bollywood memories — one physical cassette at a time.
        </motion.p>
      </div>

      {/* Centerpiece: Authentic Delux Music Player Strip (Just like Delux Salon & Chaiwala) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="relative z-10 w-full max-w-xl my-8 sm:my-10"
      >
        <div className="music-player mx-auto">
          {/* Circular Spinning Cassette Spool Hub */}
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
              {/* Spinning Spool Spokes */}
              <div className="w-full h-full flex items-center justify-center relative">
                <div className="w-6 h-6 rounded-full border border-amber-400/40 bg-black/40 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-amber-400" />
                </div>
              </div>
            </div>
            <div className="music-cover-hole" />
          </div>

          {/* Track Details & Progress Bar */}
          <div className="flex-1 min-w-0 flex flex-col gap-1">
            <div className="flex items-center justify-between gap-2">
              <span className="font-hindi text-sm sm:text-base font-bold text-white truncate">
                {currentTrackName || cassette?.title || '80s Golden Hits'}
              </span>
              <span className="font-mono text-[10px] text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/20 shrink-0">
                {cassette?.era || '1980s'}
              </span>
            </div>

            <p className="text-[11px] text-white/60 font-sans truncate">
              {cassette?.subtitle || 'T-Series Bollywood Classics'}
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

          {/* Action Buttons: Prev, Play, Next */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handlePrevClick}
              aria-label="Previous track"
              className="icon-button"
            >
              <SkipBack className="w-4 h-4 fill-current" />
            </button>

            <button
              onClick={handlePlayToggle}
              aria-label={isPlaying ? 'Pause music' : 'Play music'}
              className="play-button"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 fill-current text-black" />
              ) : (
                <Play className="w-5 h-5 fill-current text-black ml-0.5" />
              )}
            </button>

            <button
              onClick={handleNextClick}
              aria-label="Next track"
              className="icon-button"
            >
              <SkipForward className="w-4 h-4 fill-current" />
            </button>
          </div>
        </div>

        {/* J-Card / Inlay Quick Button */}
        {cassette && onOpenJCard && (
          <div className="mt-3 flex items-center justify-center gap-2">
            <button
              onClick={onOpenJCard}
              className="text-[11px] font-mono text-white/60 hover:text-amber-300 flex items-center gap-1 transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              <span>View Cassette Inlay / J-Card (ट्रैक लिस्ट)</span>
            </button>
          </div>
        )}
      </motion.div>

      {/* Bottom CTA Row: Browse Shelf & Surprise Me */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="relative z-10 flex flex-wrap items-center justify-center gap-3 mt-4"
      >
        <button
          onClick={() => {
            soundSynth.playTapeInsert();
            onScrollToShelf();
          }}
          className="px-6 py-2.5 rounded-full bg-amber-500 hover:bg-amber-400 text-black font-sans text-xs sm:text-sm font-bold shadow-[0_0_24px_rgba(245,158,11,0.5)] transition-all flex items-center gap-2 active:scale-95"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>PLAY A CASSETTE</span>
        </button>

        <button
          onClick={() => {
            soundSynth.playRewindWhoosh();
            onSurpriseMe();
          }}
          className="px-5 py-2.5 rounded-full bg-black/50 hover:bg-black/80 text-white font-sans text-xs sm:text-sm font-semibold border border-white/25 hover:border-amber-400/60 shadow-md transition-all flex items-center gap-2 active:scale-95"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>SURPRISE ME 🎲</span>
        </button>
      </motion.div>
    </section>
  );
};
