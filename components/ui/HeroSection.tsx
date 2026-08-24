'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Disc3,
  ListMusic,
  ChevronDown,
} from 'lucide-react';
import { CassetteData, PlaybackStatus } from '@/lib/types';
import { CASSETTE_SECTIONS } from '@/data/playlists';
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
  allCassettes,
  onSelectCassette,
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
  const [activeSectionId, setActiveSectionId] = useState<'80s-90s' | '90s-2000s'>('80s-90s');
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);

  const isPlaying = playbackStatus === 'playing';
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineCount((prev) => prev + (Math.floor(Math.random() * 5) - 2));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Sync active section when cassette changes
  useEffect(() => {
    if (cassette?.section_id) {
      setActiveSectionId(cassette.section_id as '80s-90s' | '90s-2000s');
    }
  }, [cassette]);

  const handlePlayToggle = () => {
    if (isPlaying) {
      soundSynth.playTapeStop();
      onPause();
    } else {
      soundSynth.playTapeStart();
      onPlay();
    }
  };

  const activeSectionPlaylists = allCassettes.filter(
    (c) => c.section_id === activeSectionId
  );

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between items-center py-5 sm:py-6 px-3 sm:px-6 select-none">
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

        {/* Center/Right: Ambient & Action Tweak Pills */}
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
      <div className="flex-1 w-full max-w-3xl flex flex-col items-center justify-center my-auto py-4 sm:py-6">
        {/* Brand Stamp with Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/50 border border-white/20 backdrop-blur-md mb-3 shadow-lg"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/favicon-32.png"
            alt="Cassette Wala"
            className="w-5 h-5 rounded-md object-cover border border-amber-400/40"
          />
          <span className="font-hindi text-amber-300 font-bold text-sm">
            कैसेट वाला
          </span>
          <span className="text-white/40 text-xs">•</span>
          <span className="font-mono text-[10px] text-white/70">
            T-SERIES OFFICIAL
          </span>
        </motion.div>

        {/* Section Tabs (80s–90s Golden Hits & 90s–2000s Evergreen Hits) */}
        <div className="flex items-center gap-2 my-2 bg-black/40 p-1 rounded-full border border-white/15 backdrop-blur-md shadow-md">
          {CASSETTE_SECTIONS.map((sec) => {
            const isSelected = activeSectionId === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => {
                  soundSynth.playSwitchClick();
                  setActiveSectionId(sec.id as any);
                  const firstTape = allCassettes.find((c) => c.section_id === sec.id);
                  if (firstTape && firstTape.id !== cassette?.id) {
                    onSelectCassette(firstTape);
                  }
                }}
                className={`px-3 sm:px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-amber-500 text-black font-bold shadow-[0_0_14px_rgba(245,158,11,0.5)]'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <span>{sec.title}</span>
              </button>
            );
          })}
        </div>

        {/* Cassette / Playlist Selector Pill List */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 my-2 max-w-xl">
          {activeSectionPlaylists.map((tape) => {
            const isLoaded = cassette?.id === tape.id;
            return (
              <button
                key={tape.id}
                onClick={() => {
                  soundSynth.playTapeInsert();
                  onSelectCassette(tape);
                }}
                className={`px-3 py-1 rounded-full text-[11px] font-mono transition-all flex items-center gap-1.5 border ${
                  isLoaded
                    ? 'bg-red-950/80 border-amber-400 text-amber-200 shadow-[0_0_12px_rgba(245,158,11,0.35)]'
                    : 'bg-black/40 border-white/10 text-white/70 hover:text-white hover:border-white/30'
                }`}
              >
                <Disc3 className={`w-3 h-3 ${isLoaded && isPlaying ? 'animate-spin text-amber-400' : ''}`} />
                <span className="truncate max-w-[170px] sm:max-w-[200px]">{tape.title}</span>
              </button>
            );
          })}
        </div>

        {/* Main Editorial Title */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="font-display text-4xl sm:text-6xl text-white tracking-tight leading-[1.1] text-center mt-2"
        >
          Cassette Wala
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-1 font-hindi text-xl sm:text-2xl text-amber-300 font-bold text-center"
        >
          &ldquo;हर कैसेट में एक याद है&rdquo;
        </motion.p>

        {/* Delux Salon-Style Floating Music Player Strip */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full max-w-xl mt-5"
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
                  {currentTrackName || cassette?.title || 'T-Series Blockbusters'}
                </span>
                <span className="font-mono text-[9px] text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/20 shrink-0">
                  {cassette?.category || 'T-Series Official'}
                </span>
              </div>

              <p className="text-[11px] text-white/60 font-sans truncate">
                {cassette?.subtitle || cassette?.source || 'T-Series Bollywood Classics'}
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
        <span>© {new Date().getFullYear()} Cassette Wala • Official T-Series Collections</span>
      </div>
    </div>
  );
};
