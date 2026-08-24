'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Sparkles, Coffee } from 'lucide-react';
import { soundSynth } from '@/lib/soundSynth';

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupportModal: React.FC<SupportModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0"
        />

        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 15 }}
          className="relative z-10 w-full max-w-md bg-gradient-to-b from-[#2b0b06] to-[#120806] text-white rounded-3xl p-6 sm:p-8 border border-amber-500/30 shadow-2xl text-center select-none"
        >
          <button
            onClick={() => {
              soundSynth.playButtonClick();
              onClose();
            }}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/80 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center mx-auto mb-3">
            <Heart className="w-6 h-6 text-red-500 fill-current animate-pulse" />
          </div>

          <h3 className="font-display text-2xl text-white">
            Support Cassette Wala
          </h3>
          <p className="font-hindi text-amber-300 text-sm mt-1 font-bold">
            &ldquo;एक कप चाय हमारे नाम&rdquo;
          </p>

          <p className="text-xs text-white/70 font-sans mt-3 leading-relaxed">
            Cassette Wala is a completely free, ad-free nostalgic Indian music passion project. If this brought back childhood memories of rewinding tapes with a Natraj pencil, consider buying us a cutting chai!
          </p>

          {/* UPI ID / QR representation */}
          <div className="mt-5 p-4 rounded-2xl bg-black/50 border border-white/15 flex flex-col items-center">
            <div className="w-36 h-36 bg-white p-2 rounded-xl flex items-center justify-center shadow-inner">
              <div className="w-full h-full border-2 border-dashed border-stone-800 rounded flex flex-col items-center justify-center text-black">
                <Coffee className="w-8 h-8 text-amber-600 mb-1" />
                <span className="font-mono text-[9px] font-bold">UPI / CHAI</span>
                <span className="font-mono text-[8px] text-stone-600">cassettewala@upi</span>
              </div>
            </div>

            <span className="font-mono text-xs text-amber-400 font-bold mt-3">
              UPI: upendra@upi
            </span>
          </div>

          <button
            onClick={() => {
              soundSynth.playButtonClick();
              onClose();
            }}
            className="mt-6 w-full py-2.5 rounded-full bg-amber-500 hover:bg-amber-400 text-black font-sans font-bold text-xs transition-colors shadow-lg"
          >
            THANK YOU (धन्यवाद)
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
