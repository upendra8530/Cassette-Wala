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
  Share2,
} from 'lucide-react';
import { CassetteData, PlaybackStatus } from '@/lib/types';
import { soundSynth } from '@/lib/soundSynth';
import { formatTime } from '@/lib/youtubeHelper';

interface HeroSectionProps {
  cassette: CassetteData | null;
  allCassettes: CassetteData[];
  onSelectCassette: (tape: CassetteData) => void;
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

  // Mechanical Tape Counter (000 to 999 based on current time)
  const tapeCounter = Math.min(999, Math.floor((currentTime % 3600) / 3))
    .toString()
    .padStart(3, '0');

  // Fluctuating online listeners
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

  const handleShare = () => {
    soundSynth.playButtonClick();
    if (typeof window !== 'undefined') {
      const shareUrl = window.location.href;
      const shareText = encodeURIComponent(
        'Listen to 1990s Bollywood Evergreen Hits on Cassette Wala! 📼🎶 ' + shareUrl
      );
      window.open(`https://api.whatsapp.com/send?text=${shareText}`, '_blank');
    }
  };

  return (
    <div className="relative w-full h-[100svh] min-h-[100svh] max-h-[100svh] overflow-hidden flex flex-col justify-between items-center py-2.5 sm:py-4 px-3 sm:px-6 select-none z-10">
      {/* =========================================================
          1. TOP GLASSY HEADER BAR (Logo integrated on Left)
         ========================================================= */}
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-6xl flex items-center justify-between gap-2 z-20 shrink-0"
      >
        {/* Left: Brand Logo & Online Counter */}
        <div className="flex items-center gap-2 xs:gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt="Cassette Wala Logo"
            className="h-8 xs:h-9 sm:h-11 w-auto object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] transition-transform duration-200 hover:scale-105"
          />

          {/* Online Listeners Pill */}
          <div className="header-pill px-2.5 xs:px-3 py-1 text-emerald-400 gap-1.5 shrink-0 select-none">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            <span className="text-white/95 font-mono font-bold text-xs">
              {onlineCount.toLocaleString()}
            </span>
            <span className="text-white/50 text-[10px] hidden sm:inline font-normal">
              listening
            </span>
          </div>
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

          <button
            onClick={handleShare}
            className="tweak-pill hover:border-emerald-400/60 hover:text-emerald-200"
            title="Share via WhatsApp"
          >
            <Share2 className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline text-xs">Share</span>
          </button>

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
      </motion.header>

      {/* =========================================================
          2. CENTERPIECE: OPEN VIEW OF DUBEYJI MUSIC CENTER + MUSIC PLAYER
         ========================================================= */}
      <div className="flex-1 w-full max-w-4xl flex flex-col items-center justify-end my-auto pb-2 sm:pb-4">
        {/* Floating Nostalgic Tape Status Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center justify-center mb-2"
        >
          {/* Hindi Tagline */}
          <p className="font-hindi text-base sm:text-xl text-amber-300 font-bold text-center tracking-wide drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
            &ldquo;हर कैसेट में एक याद है&rdquo;
          </p>

          {/* Mini Analog Tape Index Bar */}
          <div className="flex items-center gap-2.5 mt-1 px-3 py-0.5 rounded-full bg-black/75 border border-amber-500/30 text-[10px] sm:text-[11px] font-mono text-amber-300/90 shadow-lg backdrop-blur-md">
            <span className="text-red-400 font-bold">SIDE A</span>
            <span className="text-white/30">•</span>
            <div className="flex items-center gap-1">
              <span className="text-white/50 text-[9px]">TAPE NO.</span>
              <span className="text-amber-400 font-bold tracking-wider">{tapeCounter}</span>
            </div>
            <span className="text-white/30">•</span>
            <div className="flex items-center gap-1.5">
              <span
                className={`w-2 h-2 rounded-full ${
                  isPlaying
                    ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)] animate-pulse'
                    : 'bg-red-700'
                }`}
              />
              <span className="text-white/80 font-bold uppercase text-[9px]">
                {isPlaying ? 'PLAYING' : 'STOP'}
              </span>
            </div>
          </div>
        </motion.div>

        {/* =========================================================
            3. DELUX SALON-STYLE FLOATING MUSIC PLAYER STRIP
           ========================================================= */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-full max-w-xl px-2"
        >
          <div className="music-player mx-auto shadow-2xl backdrop-blur-xl border border-white/20">
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

            {/* Track Info & Progress Bar */}
            <div className="flex-1 min-w-0 flex flex-col gap-1">
              <div className="flex items-center justify-between gap-2">
                <span className="font-hindi text-sm sm:text-base font-bold text-white truncate">
                  {currentTrackName || cassette?.title || '1990 Hits Playlist'}
                </span>
                <span className="font-mono text-[9px] text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/20 shrink-0">
                  {cassette?.category || '1990 Hits'}
                </span>
              </div>

              <p className="text-[11px] text-white/60 font-sans truncate">
                {cassette?.subtitle || cassette?.source || '1990 Hits Collection'}
              </p>

              {/* Progress Slider */}
              <div className="flex items-center gap-2 mt-0.5 font-mono text-[10px] text-white/50">
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
            <div className="mt-2 flex items-center justify-center gap-2">
              <button
                onClick={() => {
                  soundSynth.playButtonClick();
                  onOpenJCard();
                }}
                className="text-[11px] font-mono text-white/70 hover:text-amber-300 flex items-center gap-1.5 transition-colors drop-shadow"
              >
                <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                <span>View Cassette Inlay / J-Card (ट्रैक लिस्ट व कैसेट कवर)</span>
              </button>
            </div>
          )}
        </motion.div>
      </div>

      {/* =========================================================
          4. SUBTLE 1-LINE FOOTER (deluxsalon.in style)
         ========================================================= */}
      <footer className="relative z-10 text-[11px] text-white/50 font-mono text-center pb-1 shrink-0 drop-shadow">
        <span>© {new Date().getFullYear()} Cassette Wala • Dubeyji Music Center • 1990 Hits Nostalgia</span>
      </footer>
    </div>
  );
};
