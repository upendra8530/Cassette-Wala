'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  Square,
  SkipBack,
  SkipForward,
  RotateCcw,
  Volume2,
  VolumeX,
  Shuffle,
  Repeat,
  Radio,
  Disc3,
  Sliders,
  Tv,
  Sparkles,
  Info,
  Maximize2,
} from 'lucide-react';
import { CassetteData, PlaybackStatus, AudioSettings } from '@/lib/types';
import { CassetteSpool } from '../cassette/CassetteSpool';
import { soundSynth } from '@/lib/soundSynth';
import { formatTime, calculateTapeCounter } from '@/lib/youtubeHelper';

interface CassettePlayerDeckProps {
  cassette: CassetteData | null;
  playbackStatus: PlaybackStatus;
  currentTime: number;
  duration: number;
  currentTrackName?: string;
  volume: number;
  isMuted: boolean;
  audioSettings: AudioSettings;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onSeek: (seconds: number) => void;
  onVolumeChange: (vol: number) => void;
  onToggleMute: () => void;
  onEject: () => void;
  onToggleSettings: () => void;
  onToggleVideoPreview: () => void;
  showVideoPreview: boolean;
  onOpenJCard?: () => void;
}

export const CassettePlayerDeck: React.FC<CassettePlayerDeckProps> = ({
  cassette,
  playbackStatus,
  currentTime,
  duration,
  currentTrackName,
  volume,
  isMuted,
  audioSettings,
  onPlay,
  onPause,
  onStop,
  onNext,
  onPrevious,
  onSeek,
  onVolumeChange,
  onToggleMute,
  onEject,
  onToggleSettings,
  onToggleVideoPreview,
  showVideoPreview,
  onOpenJCard,
}) => {
  const isPlaying = playbackStatus === 'playing';
  const isBuffering = playbackStatus === 'buffering';

  const [counterValue, setCounterValue] = useState('000');
  const [isCounterResetting, setIsCounterResetting] = useState(false);
  const [activeButton, setActiveButton] = useState<string | null>(null);
  const [isShuffling, setIsShuffling] = useState(false);
  const [isRepeating, setIsRepeating] = useState(false);
  const [deckTapeType, setDeckTapeType] = useState<'Type I (Normal)' | 'Type II (Chrome)' | 'Type IV (Metal)'>('Type I (Normal)');
  const [deckDolby, setDeckDolby] = useState<'OFF' | 'B' | 'C'>('B');

  // Update mechanical counter
  useEffect(() => {
    if (!isCounterResetting) {
      setCounterValue(calculateTapeCounter(currentTime));
    }
  }, [currentTime, isCounterResetting]);

  const handleResetCounter = () => {
    soundSynth.playSwitchClick();
    setIsCounterResetting(true);
    setCounterValue('000');
    setTimeout(() => setIsCounterResetting(false), 800);
  };

  const handleButtonPress = (btnName: string, action: () => void) => {
    soundSynth.playButtonClick();
    setActiveButton(btnName);
    setTimeout(() => setActiveButton(null), 250);
    action();
  };

  const handlePlayToggle = () => {
    if (isPlaying) {
      soundSynth.playTapeStop();
      onPause();
    } else {
      soundSynth.playTapeStart();
      onPlay();
    }
  };

  const handleRewind5s = () => {
    soundSynth.playRewindWhoosh();
    onSeek(Math.max(0, currentTime - 10));
  };

  const handleForward5s = () => {
    soundSynth.playRewindWhoosh();
    onSeek(Math.min(duration || currentTime + 10, currentTime + 10));
  };

  const tapeProgress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const leftSpoolTape = Math.max(15, 85 - tapeProgress * 0.7);
  const rightSpoolTape = Math.min(85, 15 + tapeProgress * 0.7);

  return (
    <div className="relative w-full max-w-5xl mx-auto rounded-2xl bg-gradient-to-b from-[#2a241f] via-[#1a1511] to-[#120d09] p-4 sm:p-6 md:p-8 border-4 border-[#453629] shadow-deck text-stone-200 select-none overflow-hidden">
      {/* Metallic Brushed Texture & Warm Overhead Shop Lamp Highlight */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-amber-500/[0.04] to-white/[0.08]" />
      <div className="pointer-events-none absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-stone-600 via-amber-200/40 to-stone-600 opacity-70" />

      {/* Top Deck Branding Strip & Vintage Plate */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 mb-5 border-b-2 border-stone-800/80">
        {/* Brand Badge */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-retro-gold via-retro-mustard to-retro-rust flex items-center justify-center shadow-md border border-amber-300/40">
            <Radio className="w-5 h-5 text-wood-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif font-black tracking-widest text-lg sm:text-xl text-amber-200 uppercase">
                CASSETTE WALA
              </h2>
              <span className="bg-retro-red text-white font-mono text-[9px] font-bold px-1.5 py-0.5 rounded shadow">
                STEREO DECK-90
              </span>
            </div>
            <p className="text-[11px] font-mono text-stone-400">
              HIGH FIDELITY TAPE TRANSPORT SYSTEM • AUTO REVERSE
            </p>
          </div>
        </div>

        {/* LED / Counter / Status Panel */}
        <div className="flex items-center gap-3 bg-[#0d0a08] px-3 py-1.5 rounded-lg border border-stone-700/60 shadow-inner">
          {/* Mechanical 3-Digit Counter */}
          <div className="flex items-center gap-1.5 pr-3 border-r border-stone-800">
            <span className="text-[10px] font-mono text-stone-400 font-bold uppercase">INDEX</span>
            <div className="bg-[#000] border border-stone-700 px-2 py-0.5 rounded font-mono text-sm sm:text-base tracking-widest text-amber-400 font-bold shadow-inner">
              {counterValue}
            </div>
            <button
              onClick={handleResetCounter}
              title="Reset Counter"
              className="text-[9px] font-mono font-bold bg-stone-800 hover:bg-stone-700 text-stone-300 px-1.5 py-0.5 rounded border border-stone-600 transition-colors active:scale-95"
            >
              RESET
            </button>
          </div>

          {/* Tape Status LEDs */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <div
                className={`w-2.5 h-2.5 rounded-full ${
                  isPlaying
                    ? 'bg-green-500 shadow-[0_0_8px_#22c55e]'
                    : isBuffering
                    ? 'bg-amber-500 animate-ping'
                    : 'bg-stone-800'
                }`}
              />
              <span className="text-[10px] font-mono font-bold text-stone-400">
                {isPlaying ? 'PLAY' : isBuffering ? 'LOAD' : 'STOP'}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <div
                className={`w-2.5 h-2.5 rounded-full ${
                  deckDolby !== 'OFF' ? 'bg-amber-500 shadow-[0_0_8px_#f59e0b]' : 'bg-stone-800'
                }`}
              />
              <span className="text-[10px] font-mono font-bold text-stone-400">
                DOLBY {deckDolby}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Deck Faceplate Grid: Cassette Well + Dual VU Meters + LCD Display */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Column: Motorized Cassette Compartment (Tape Door) */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="relative w-full aspect-[1.65/1] max-w-[480px] rounded-xl bg-gradient-to-b from-[#141210] via-[#0a0908] to-[#120f0c] p-4 sm:p-5 border-4 border-[#3a2d22] shadow-[inset_0_4px_16px_rgba(0,0,0,0.95)] flex flex-col justify-between overflow-hidden">
            {/* Backlight Glow inside cassette well */}
            <div className="pointer-events-none absolute inset-0 bg-amber-500/[0.05] shadow-inner" />

            {/* Top Well Frame with Screw details */}
            <div className="flex items-center justify-between text-[10px] font-mono text-stone-500 border-b border-stone-800/80 pb-1 z-10">
              <span className="text-amber-300/80 font-bold">◄ CASSETTE COMPARTMENT ►</span>
              <span>{cassette ? cassette.era : 'NO CASSETTE LOADED'}</span>
            </div>

            {/* Cassette Slot / Loaded Tape Window */}
            {cassette ? (
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 220, damping: 20 }}
                className="relative w-full h-[72%] my-auto rounded-lg bg-gradient-to-b from-[#211f1d] to-[#151413] border-2 border-[#453629] p-2.5 shadow-xl flex flex-col justify-between"
              >
                {/* Tape Label Header inside deck */}
                <div
                  className="px-2 py-1 rounded flex items-center justify-between text-white shadow-sm"
                  style={{ backgroundColor: cassette.coverColor.base }}
                >
                  <div className="truncate max-w-[220px] font-hindi text-xs sm:text-sm font-bold">
                    {cassette.hindiTitle || cassette.title}
                  </div>
                  <span className="text-[9px] font-mono bg-black/40 px-1 rounded border border-white/20">
                    SIDE A • STEREO
                  </span>
                </div>

                {/* Rotating Spools & Tape Drive Well */}
                <div className="relative w-[85%] mx-auto h-[55%] bg-black/75 rounded-md border border-stone-800 px-4 py-1 flex items-center justify-between shadow-inner">
                  {/* Left Spool */}
                  <CassetteSpool
                    isSpinning={isPlaying}
                    speed="normal"
                    direction="forward"
                    tapeAmountPercent={leftSpoolTape}
                    size="md"
                  />

                  {/* Tape Bridge & Tape Window Ruler */}
                  <div className="flex-1 flex flex-col items-center justify-center px-2">
                    <div className="w-full flex justify-between text-[8px] text-[#888] font-mono select-none px-1">
                      <span>100</span>
                      <span>50</span>
                      <span>0</span>
                    </div>
                    <div className="w-full h-3 bg-gradient-to-r from-[#2c1d13] via-[#432918] to-[#2c1d13] rounded-sm my-1 border-y border-[#523725]/60 flex items-center justify-center">
                      <div className="w-full h-[1.5px] bg-black/60" />
                    </div>
                    <span className="text-[8px] text-amber-400 font-mono tracking-widest uppercase">
                      {isPlaying ? '● TAPE RUNNING' : '❚❚ STANDBY'}
                    </span>
                  </div>

                  {/* Right Spool */}
                  <CassetteSpool
                    isSpinning={isPlaying}
                    speed="normal"
                    direction="forward"
                    tapeAmountPercent={rightSpoolTape}
                    size="md"
                  />
                </div>
              </motion.div>
            ) : (
              /* Empty Deck Slot Placeholder */
              <div className="relative w-full h-[72%] my-auto rounded-lg border-2 border-dashed border-stone-700/60 bg-black/40 flex flex-col items-center justify-center text-center p-4">
                <Disc3 className="w-10 h-10 text-stone-600 mb-2 animate-pulse" />
                <p className="text-sm font-sans font-bold text-amber-200/90">
                  Koi Cassette Select Karein
                </p>
                <p className="text-xs text-stone-400 mt-0.5">
                  Neeche shelf se cassette click karein ya &quot;Surprise Me&quot; dabayein.
                </p>
              </div>
            )}

            {/* Bottom Tape Drive Heads and Pinch Rollers simulation */}
            <div className="flex items-center justify-between pt-1 border-t border-stone-800/80 text-[9px] font-mono text-stone-500 z-10">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-stone-700 inline-block" />
                PINCH ROLLER L
              </span>
              <span className="text-amber-400 font-bold">◄ 2-MOTOR DRIVE ►</span>
              <span className="flex items-center gap-1">
                FERRITE HEAD
                <span className="w-2 h-2 rounded-full bg-stone-700 inline-block" />
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Dual Backlit Analog VU Meters + Amber Phosphor VFD Display + Rotary Knobs */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Dual Backlit Analog VU Meters */}
          <div className="bg-[#120e0b] p-3 sm:p-4 rounded-xl border-2 border-[#3f3124] shadow-inner flex flex-col gap-2">
            <div className="flex items-center justify-between text-[10px] font-mono text-stone-400 uppercase tracking-wider font-bold">
              <span>PEAK LEVEL METERS (dB)</span>
              <span className="text-amber-400">VU STEREO</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Left Channel VU Meter */}
              <div className="relative h-20 sm:h-24 rounded-lg bg-gradient-to-b from-[#fbf3db] via-[#faebd0] to-[#ecd7b0] p-2 border-2 border-stone-700 shadow-inner overflow-hidden select-none">
                {/* Meter Scale Arc */}
                <div className="text-[9px] font-mono text-stone-700 font-bold flex justify-between px-1">
                  <span>-20</span>
                  <span>-7</span>
                  <span>0</span>
                  <span className="text-red-700">+3</span>
                </div>
                <div className="w-full h-1 bg-gradient-to-r from-stone-400 via-amber-600 to-red-600 rounded-full mt-1 opacity-70" />
                <span className="absolute bottom-1.5 left-2 text-[10px] font-mono font-black text-stone-800">
                  CH — L
                </span>

                {/* Animated Needle */}
                <div
                  className={`absolute bottom-0 left-1/2 w-[2px] h-16 sm:h-20 bg-red-700 origin-bottom shadow-sm transition-transform duration-100 ${
                    isPlaying ? 'animate-vu-bounce-1' : ''
                  }`}
                  style={{
                    transform: isPlaying ? undefined : 'rotate(-38deg)',
                  }}
                />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-2 bg-stone-900 rounded-t-full" />
              </div>

              {/* Right Channel VU Meter */}
              <div className="relative h-20 sm:h-24 rounded-lg bg-gradient-to-b from-[#fbf3db] via-[#faebd0] to-[#ecd7b0] p-2 border-2 border-stone-700 shadow-inner overflow-hidden select-none">
                {/* Meter Scale Arc */}
                <div className="text-[9px] font-mono text-stone-700 font-bold flex justify-between px-1">
                  <span>-20</span>
                  <span>-7</span>
                  <span>0</span>
                  <span className="text-red-700">+3</span>
                </div>
                <div className="w-full h-1 bg-gradient-to-r from-stone-400 via-amber-600 to-red-600 rounded-full mt-1 opacity-70" />
                <span className="absolute bottom-1.5 right-2 text-[10px] font-mono font-black text-stone-800">
                  CH — R
                </span>

                {/* Animated Needle */}
                <div
                  className={`absolute bottom-0 left-1/2 w-[2px] h-16 sm:h-20 bg-red-700 origin-bottom shadow-sm transition-transform duration-100 ${
                    isPlaying ? 'animate-vu-bounce-2' : ''
                  }`}
                  style={{
                    transform: isPlaying ? undefined : 'rotate(-36deg)',
                  }}
                />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-2 bg-stone-900 rounded-t-full" />
              </div>
            </div>
          </div>

          {/* Retro Amber / Green Phosphor Vacuum Fluorescent Display (VFD) */}
          <div className="bg-[#0b0c0e] rounded-xl border-2 border-[#2b303c] p-3 sm:p-3.5 shadow-inner">
            <div className="flex items-center justify-between text-[10px] font-mono text-emerald-400/80 mb-1 border-b border-emerald-950 pb-1">
              <span className="flex items-center gap-1 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
                {cassette ? `${cassette.era} CASSETTE` : 'SYSTEM IDLE'}
              </span>
              <span className="text-amber-300 font-mono">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            {/* Song / Cassette Title */}
            <div className="my-1">
              <p className="font-mono text-amber-400 text-sm sm:text-base font-bold truncate tracking-wide">
                {currentTrackName || (cassette ? cassette.title : 'Press Play to Start')}
              </p>
              <p className="text-[11px] font-mono text-stone-400 truncate">
                {cassette ? `${cassette.subtitle} • ${cassette.source}` : 'Rewind. Play. Relive.'}
              </p>
            </div>

            {/* Tape Travel Progress Bar */}
            <div className="mt-2 space-y-1">
              <div className="relative w-full h-3 bg-[#181a1f] rounded-full overflow-hidden border border-stone-700 cursor-pointer">
                <input
                  type="range"
                  min="0"
                  max={duration || 100}
                  value={currentTime}
                  onChange={(e) => onSeek(Number(e.target.value))}
                  aria-label="Track progress seek slider"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                {/* Progress bar fill */}
                <div
                  className="h-full bg-gradient-to-r from-retro-rust via-retro-amber to-retro-gold transition-all duration-300"
                  style={{ width: `${tapeProgress}%` }}
                />
              </div>
              <div className="flex justify-between text-[9px] font-mono text-stone-400">
                <span>HEAD: {formatTime(currentTime)}</span>
                <span>TOTAL: {formatTime(duration)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Heavy Mechanical Piano-Key Push Buttons (Transport Controls) */}
      <div className="mt-6 pt-5 border-t-2 border-stone-800 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Mechanical Buttons Group */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 overflow-x-auto max-w-full pb-1">
          {/* EJECT (⏏) */}
          <button
            onClick={() => handleButtonPress('eject', onEject)}
            disabled={!cassette}
            aria-label="Eject Cassette"
            className={`group flex flex-col items-center justify-center px-3 sm:px-4 py-2.5 rounded-lg border-2 font-mono text-xs font-bold transition-all shadow-md active:translate-y-1 ${
              activeButton === 'eject'
                ? 'bg-[#111] border-stone-700 text-stone-500 shadow-inner'
                : 'bg-gradient-to-b from-[#3a3530] via-[#2a2520] to-[#1c1815] border-[#554738] text-stone-200 hover:border-amber-400'
            }`}
          >
            <span className="text-base leading-none">⏏</span>
            <span className="text-[9px] uppercase tracking-wider text-stone-400 mt-1">EJECT</span>
          </button>

          {/* REWIND (⏪ / -10s) */}
          <button
            onClick={() => handleButtonPress('rewind', handleRewind5s)}
            disabled={!cassette}
            aria-label="Rewind 10 seconds"
            className={`group flex flex-col items-center justify-center px-3 sm:px-4 py-2.5 rounded-lg border-2 font-mono text-xs font-bold transition-all shadow-md active:translate-y-1 ${
              activeButton === 'rewind'
                ? 'bg-[#111] border-stone-700 text-stone-500 shadow-inner'
                : 'bg-gradient-to-b from-[#3a3530] via-[#2a2520] to-[#1c1815] border-[#554738] text-stone-200 hover:border-amber-400'
            }`}
          >
            <SkipBack className="w-4 h-4" />
            <span className="text-[9px] uppercase tracking-wider text-stone-400 mt-1">REW</span>
          </button>

          {/* PLAY (▶) - Hero Button */}
          <button
            onClick={() => handleButtonPress('play', handlePlayToggle)}
            disabled={!cassette}
            aria-label={isPlaying ? "Pause playback" : "Start playback"}
            className={`group flex flex-col items-center justify-center px-5 sm:px-7 py-2.5 rounded-lg border-2 font-mono text-xs font-black transition-all shadow-lg active:translate-y-1 ${
              isPlaying
                ? 'bg-gradient-to-b from-retro-gold via-amber-500 to-amber-600 border-amber-200 text-wood-950 shadow-amber-glow'
                : 'bg-gradient-to-b from-retro-red via-retro-crimson to-[#59100a] border-red-400 text-white hover:shadow-amber-glow'
            }`}
          >
            {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
            <span className="text-[10px] uppercase tracking-wider mt-1">
              {isPlaying ? 'PAUSE' : 'PLAY'}
            </span>
          </button>

          {/* FAST FORWARD (⏩ / +10s) */}
          <button
            onClick={() => handleButtonPress('ff', handleForward5s)}
            disabled={!cassette}
            aria-label="Fast forward 10 seconds"
            className={`group flex flex-col items-center justify-center px-3 sm:px-4 py-2.5 rounded-lg border-2 font-mono text-xs font-bold transition-all shadow-md active:translate-y-1 ${
              activeButton === 'ff'
                ? 'bg-[#111] border-stone-700 text-stone-500 shadow-inner'
                : 'bg-gradient-to-b from-[#3a3530] via-[#2a2520] to-[#1c1815] border-[#554738] text-stone-200 hover:border-amber-400'
            }`}
          >
            <SkipForward className="w-4 h-4" />
            <span className="text-[9px] uppercase tracking-wider text-stone-400 mt-1">F.FWD</span>
          </button>

          {/* STOP (⏹) */}
          <button
            onClick={() => handleButtonPress('stop', onStop)}
            disabled={!cassette}
            aria-label="Stop playback"
            className={`group flex flex-col items-center justify-center px-3 sm:px-4 py-2.5 rounded-lg border-2 font-mono text-xs font-bold transition-all shadow-md active:translate-y-1 ${
              activeButton === 'stop'
                ? 'bg-[#111] border-stone-700 text-stone-500 shadow-inner'
                : 'bg-gradient-to-b from-[#3a3530] via-[#2a2520] to-[#1c1815] border-[#554738] text-stone-200 hover:border-amber-400'
            }`}
          >
            <Square className="w-4 h-4 fill-current" />
            <span className="text-[9px] uppercase tracking-wider text-stone-400 mt-1">STOP</span>
          </button>

          {/* PREVIOUS TRACK */}
          <button
            onClick={() => handleButtonPress('prev', onPrevious)}
            disabled={!cassette}
            aria-label="Previous track"
            title="Previous Track"
            className="p-2.5 rounded-lg bg-wood-900 hover:bg-wood-800 border border-wood-700 text-stone-300 hover:text-amber-300 transition-colors active:scale-95"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          {/* NEXT TRACK */}
          <button
            onClick={() => handleButtonPress('next', onNext)}
            disabled={!cassette}
            aria-label="Next track"
            title="Next Track"
            className="p-2.5 rounded-lg bg-wood-900 hover:bg-wood-800 border border-wood-700 text-stone-300 hover:text-amber-300 transition-colors active:scale-95"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Rotary Volume Dial & Switches Group */}
        <div className="flex items-center gap-4 sm:gap-6 shrink-0">
          {/* Volume Rotary Knob */}
          <div className="flex items-center gap-2">
            <button
              onClick={onToggleMute}
              className="p-1.5 rounded-full hover:bg-stone-800 text-stone-300 transition-colors"
              title={isMuted ? 'Unmute' : 'Mute'}
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4 text-retro-red" />
              ) : (
                <Volume2 className="w-4 h-4 text-amber-300" />
              )}
            </button>

            <div className="flex flex-col items-center">
              <input
                type="range"
                min="0"
                max="100"
                value={isMuted ? 0 : volume}
                onChange={(e) => onVolumeChange(Number(e.target.value))}
                aria-label="Volume level control"
                className="w-20 sm:w-28 h-2 bg-stone-900 rounded-lg appearance-none cursor-pointer accent-retro-gold"
              />
              <span className="text-[9px] font-mono text-stone-400 mt-1">
                VOL {isMuted ? 'MUTE' : `${volume}%`}
              </span>
            </div>
          </div>

          {/* Inlay / J-Card Modal Trigger */}
          {cassette && onOpenJCard && (
            <button
              onClick={onOpenJCard}
              className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded bg-wood-900 hover:bg-wood-800 text-amber-200 text-xs font-mono font-bold border border-wood-700 transition-all shadow-sm active:scale-95"
            >
              <Info className="w-3.5 h-3.5" />
              <span>J-CARD</span>
            </button>
          )}

          {/* YouTube Video Toggle */}
          <button
            onClick={onToggleVideoPreview}
            title="Toggle YouTube Video Monitor"
            aria-label="Toggle YouTube Video Monitor"
            className={`p-2 rounded-lg border transition-colors ${
              showVideoPreview
                ? 'bg-retro-gold text-wood-950 border-amber-300'
                : 'bg-wood-900 text-stone-400 hover:text-amber-200 border-wood-700'
            }`}
          >
            <Tv className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
