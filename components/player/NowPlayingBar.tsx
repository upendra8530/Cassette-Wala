'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Disc3,
  ChevronUp,
  X,
  BookOpen,
} from 'lucide-react';
import { CassetteData, PlaybackStatus } from '@/lib/types';
import { CassetteSpool } from '../cassette/CassetteSpool';
import { formatTime } from '@/lib/youtubeHelper';
import { soundSynth } from '@/lib/soundSynth';

interface NowPlayingBarProps {
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
  onEject: () => void;
  onFocusDeck: () => void;
  onOpenJCard?: () => void;
}

export const NowPlayingBar: React.FC<NowPlayingBarProps> = ({
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
  onEject,
  onFocusDeck,
  onOpenJCard,
}) => {
  if (!cassette) return null;

  const isPlaying = playbackStatus === 'playing';
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handlePlayPause = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPlaying) {
      soundSynth.playTapeStop();
      onPause();
    } else {
      soundSynth.playTapeStart();
      onPlay();
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundSynth.playButtonClick();
    onNext();
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundSynth.playButtonClick();
    onPrevious();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 24 }}
        className="fixed bottom-0 inset-x-0 z-40 bg-wood-950/95 backdrop-blur-md border-t-2 border-wood-700 shadow-[0_-8px_30px_rgba(0,0,0,0.8)] text-stone-200"
      >
        {/* Top Progress Line */}
        <div className="relative w-full h-1 bg-wood-900 overflow-hidden cursor-pointer">
          <input
            type="range"
            min="0"
            max={duration || 100}
            value={currentTime}
            onChange={(e) => onSeek(Number(e.target.value))}
            aria-label="Bottom player track progress"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <div
            className="h-full bg-gradient-to-r from-retro-rust via-retro-amber to-retro-gold transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 py-2.5 sm:py-3 flex items-center justify-between gap-3">
          {/* Left: Mini Spinning Cassette + Song Info */}
          <div
            onClick={onFocusDeck}
            className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer group"
          >
            {/* Mini Cassette Icon */}
            <div
              className="relative w-12 sm:w-14 aspect-[1.58/1] rounded bg-[#1c1c1f] border border-stone-600 p-1 flex items-center justify-between shadow-md shrink-0 group-hover:border-retro-gold transition-colors"
              style={{
                boxShadow: isPlaying ? '0 0 10px rgba(217, 155, 38, 0.4)' : undefined,
              }}
            >
              <CassetteSpool isSpinning={isPlaying} size="sm" />
              <div className="w-2 h-1 bg-stone-700 rounded-xs" />
              <CassetteSpool isSpinning={isPlaying} size="sm" />
            </div>

            {/* Song & Tape Meta */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-hindi text-xs sm:text-sm font-bold text-amber-200 truncate group-hover:text-amber-100 transition-colors">
                  {currentTrackName || cassette.title}
                </span>
                <span className="hidden sm:inline bg-retro-red/80 text-white font-mono text-[9px] px-1.5 py-0.5 rounded uppercase shrink-0">
                  {cassette.era}
                </span>
              </div>
              <p className="text-[11px] text-stone-400 font-sans truncate">
                {cassette.subtitle} • {cassette.source}
              </p>
            </div>
          </div>

          {/* Center: Playback Controls */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <button
              onClick={handlePrev}
              aria-label="Previous Track"
              title="Previous Track"
              className="p-1.5 sm:p-2 text-stone-400 hover:text-amber-300 transition-colors active:scale-95"
            >
              <SkipBack className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <button
              onClick={handlePlayPause}
              aria-label={isPlaying ? "Pause Track" : "Play Track"}
              className={`p-2.5 sm:p-3 rounded-full transition-all active:scale-95 shadow-lg ${
                isPlaying
                  ? 'bg-retro-gold text-wood-950 hover:bg-amber-400 shadow-amber-glow'
                  : 'bg-retro-red text-white hover:bg-retro-crimson'
              }`}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
              ) : (
                <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current ml-0.5" />
              )}
            </button>

            <button
              onClick={handleNext}
              aria-label="Next Track"
              title="Next Track"
              className="p-1.5 sm:p-2 text-stone-400 hover:text-amber-300 transition-colors active:scale-95"
            >
              <SkipForward className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          {/* Right: Time, Volume, Deck Jump */}
          <div className="hidden md:flex items-center gap-4 shrink-0">
            {/* Time Stamp */}
            <span className="font-mono text-xs text-stone-400">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>

            {/* Volume Control */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={onToggleMute}
                className="p-1 text-stone-400 hover:text-amber-300 transition-colors"
                aria-label={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-4 h-4 text-retro-red" />
                ) : (
                  <Volume2 className="w-4 h-4 text-stone-300" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="100"
                value={isMuted ? 0 : volume}
                onChange={(e) => onVolumeChange(Number(e.target.value))}
                aria-label="Sticky player volume control"
                className="w-16 sm:w-20 h-1.5 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-retro-gold"
              />
            </div>

            {/* J-Card Trigger */}
            {onOpenJCard && (
              <button
                onClick={onOpenJCard}
                className="p-1.5 text-stone-400 hover:text-amber-200 transition-colors"
                title="View Cassette Inlay / J-Card"
                aria-label="View Cassette Inlay / J-Card"
              >
                <BookOpen className="w-4 h-4" />
              </button>
            )}

            {/* Scroll to Deck button */}
            <button
              onClick={onFocusDeck}
              className="p-1.5 rounded bg-wood-800 hover:bg-wood-700 text-stone-300 hover:text-amber-200 text-xs flex items-center gap-1 border border-wood-700 transition-colors"
              title="Cassette Player Dekhein"
              aria-label="Scroll to Cassette Player"
            >
              <ChevronUp className="w-3.5 h-3.5" />
              <span className="font-mono text-[10px]">DECK</span>
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
