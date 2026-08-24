'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Disc3, ShieldAlert, Sparkles, Music } from 'lucide-react';
import { CassetteData } from '@/lib/types';
import { soundSynth } from '@/lib/soundSynth';

interface JCardModalProps {
  cassette: CassetteData | null;
  isOpen: boolean;
  onClose: () => void;
  onPlay: (cassette: CassetteData) => void;
}

export const JCardModal: React.FC<JCardModalProps> = ({
  cassette,
  isOpen,
  onClose,
  onPlay,
}) => {
  if (!isOpen || !cassette) return null;

  const handlePlay = () => {
    soundSynth.playTapeInsert();
    onPlay(cassette);
    onClose();
  };

  const handleClose = () => {
    soundSynth.playButtonClick();
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
        {/* Backdrop click */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0"
        />

        {/* Unfolded J-Card Container */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, rotateY: 20 }}
          animate={{ scale: 1, opacity: 1, rotateY: 0 }}
          exit={{ scale: 0.9, opacity: 0, rotateY: -10 }}
          transition={{ type: 'spring', stiffness: 280, damping: 24 }}
          className="relative z-10 w-full max-w-2xl bg-[#faf4e6] text-[#1c130d] rounded-lg shadow-2xl border-4 border-[#3d2719] overflow-hidden my-auto select-none"
          style={{
            backgroundImage:
              'radial-gradient(#e5d8be 1px, transparent 1px), radial-gradient(#e5d8be 1px, #faf4e6 1px)',
            backgroundSize: '20px 20px',
            backgroundPosition: '0 0, 10px 10px',
          }}
        >
          {/* Paper Vintage Fold Lines & Crease Shadows */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/5 via-transparent to-black/10" />
          <div className="pointer-events-none absolute left-1/3 inset-y-0 w-[1px] bg-black/15 shadow-sm" />
          <div className="pointer-events-none absolute right-1/3 inset-y-0 w-[1px] bg-black/15 shadow-sm" />

          {/* Header Bar / J-Card Spine */}
          <div
            className="p-3 sm:p-4 text-white flex items-center justify-between border-b-2 border-black/30 shadow-md"
            style={{ backgroundColor: cassette.coverColor.base }}
          >
            <div className="flex items-center gap-2">
              <span className="bg-black/30 px-2 py-0.5 rounded text-xs font-mono tracking-widest uppercase border border-white/20">
                {cassette.featuredBadge || 'ORIGINAL STEREO TAPE'}
              </span>
              <span className="font-hindi text-sm sm:text-base font-bold text-amber-200">
                {cassette.hindiTitle || cassette.title}
              </span>
            </div>
            <button
              onClick={handleClose}
              className="p-1 rounded-full bg-black/30 hover:bg-black/60 text-white transition-colors"
              aria-label="Close J-Card"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* J-Card Unfolded Content Layout */}
          <div className="p-4 sm:p-6 space-y-6">
            {/* Title & Record Label Details */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-[#1c130d]/20 pb-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-serif font-black tracking-tight text-[#1c130d]">
                  {cassette.title}
                </h2>
                <p className="text-sm font-sans font-medium text-[#5a3b26] mt-0.5">
                  {cassette.subtitle}
                </p>
                <p className="text-xs font-mono text-[#8a6240] mt-1">
                  {cassette.recordLabel} • {cassette.yearRange}
                </p>
              </div>

              {/* Price MRP Stamp */}
              <div className="shrink-0 flex flex-col items-end">
                <div className="border-2 border-dashed border-[#b93826] bg-[#b93826]/10 px-3 py-1.5 rounded text-center transform rotate-1">
                  <span className="block text-[10px] font-mono font-bold text-[#b93826] uppercase">
                    MAXIMUM RETAIL PRICE
                  </span>
                  <span className="text-sm sm:text-base font-bold font-mono text-[#b93826]">
                    {cassette.priceMRP || '₹ 28.00 (M.R.P.)'}
                  </span>
                </div>
                <span className="text-[9px] font-mono text-[#777] mt-1">
                  C-90 CASSETTE • NORMAL BIAS
                </span>
              </div>
            </div>

            {/* Side A & Side B Detailed Track Columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {/* SIDE A */}
              <div className="bg-[#f0e6d2] p-3.5 rounded-md border border-[#d6c7a3] shadow-inner">
                <div className="flex items-center justify-between border-b border-[#c2b291] pb-1.5 mb-2.5">
                  <span className="text-xs font-mono font-bold bg-[#1c130d] text-[#faf4e6] px-2 py-0.5 rounded">
                    SIDE — A
                  </span>
                  <span className="text-[11px] font-mono text-[#6d5138]">
                    ~45 MINS STEREO
                  </span>
                </div>
                <ul className="space-y-1.5 text-xs font-sans text-[#271911]">
                  {cassette.sideA.map((song, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <Music className="w-3 h-3 text-[#b93826] mt-0.5 shrink-0" />
                      <span className="leading-snug">{song}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* SIDE B */}
              <div className="bg-[#f0e6d2] p-3.5 rounded-md border border-[#d6c7a3] shadow-inner">
                <div className="flex items-center justify-between border-b border-[#c2b291] pb-1.5 mb-2.5">
                  <span className="text-xs font-mono font-bold bg-[#1c130d] text-[#faf4e6] px-2 py-0.5 rounded">
                    SIDE — B
                  </span>
                  <span className="text-[11px] font-mono text-[#6d5138]">
                    ~45 MINS STEREO
                  </span>
                </div>
                <ul className="space-y-1.5 text-xs font-sans text-[#271911]">
                  {cassette.sideB.map((song, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <Music className="w-3 h-3 text-[#b93826] mt-0.5 shrink-0" />
                      <span className="leading-snug">{song}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Handwritten Sound Engineer & Collector Notes */}
            {cassette.jCardNotes && (
              <div className="p-3 rounded bg-[#fff9ee] border border-dashed border-[#b89f78] text-xs font-handwriting text-[#3d2719] text-base leading-relaxed">
                <span className="font-bold font-sans text-xs uppercase tracking-wider block text-[#8a5d3b] mb-1">
                  📝 Master Tape Collector Notes:
                </span>
                &ldquo;{cassette.jCardNotes}&rdquo;
              </div>
            )}

            {/* Vintage Cassette Care Advisory & Legal Warning */}
            <div className="flex items-start gap-2.5 p-2.5 rounded bg-[#ebdcc0]/60 border border-[#d6c7a3] text-[10px] sm:text-[11px] text-[#553723] font-mono leading-tight">
              <ShieldAlert className="w-4 h-4 text-[#b93826] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#1c130d]">CASSETTE CARE ADVICE:</strong> Store in case away from direct sunlight, heaters, and magnetic fields. Clean player tape head regularly with isopropyl alcohol and cotton swab.
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-black/15">
              <span className="text-xs text-[#744b30] font-sans">
                Source: <strong className="text-[#1c130d]">{cassette.source}</strong>
              </span>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={handleClose}
                  className="flex-1 sm:flex-none px-4 py-2 rounded font-sans text-xs font-bold text-[#553723] hover:bg-black/5 transition-colors"
                >
                  BAND KAREIN (CLOSE)
                </button>
                <button
                  onClick={handlePlay}
                  className="flex-1 sm:flex-none px-5 py-2 rounded font-sans text-xs font-bold bg-[#b93826] hover:bg-[#8a1c14] text-white flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>CASSETTE BAJAO (PLAY NOW)</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
