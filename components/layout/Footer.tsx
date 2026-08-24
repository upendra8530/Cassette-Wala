'use client';

import React from 'react';
import { Radio, Heart, Disc, Music, Sparkles } from 'lucide-react';
import { soundSynth } from '@/lib/soundSynth';

export const Footer: React.FC = () => {
  return (
    <footer className="relative bg-[#0d0906] text-stone-300 pt-12 pb-24 border-t-4 border-[#3d2719] select-none">
      {/* Top Wooden Trim Pattern */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-retro-rust via-retro-gold to-retro-red opacity-80" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-wood-800">
          {/* Col 1: Shop Story */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-gradient-to-br from-retro-gold to-retro-rust flex items-center justify-center shadow">
                <Radio className="w-4 h-4 text-wood-950" />
              </div>
              <span className="font-serif font-black text-xl text-stone-100 uppercase tracking-wider">
                CASSETTE WALA
              </span>
            </div>

            <p className="text-xs sm:text-sm text-stone-400 font-sans leading-relaxed">
              Step back into the golden era of Indian music. Before streaming algorithms and infinite feeds, there were physical magnetic tapes, pencil-rewound spools, and songs that defined our lives.
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs font-mono text-retro-gold">
              <span>📍 Shop No. 9, Novelty Cinema Lane, Estd. 1982</span>
            </div>
          </div>

          {/* Col 2: Era Quick Links */}
          <div className="space-y-2.5">
            <h4 className="font-mono text-xs font-bold uppercase tracking-widest text-amber-200">
              NOSTALGIC ERAS
            </h4>
            <ul className="space-y-1.5 text-xs text-stone-400 font-sans">
              <li className="hover:text-retro-gold transition-colors">📼 1980s: Disco, Vinyl & RD Burman</li>
              <li className="hover:text-retro-gold transition-colors">❤️ 1990s: Nadeem-Shravan & Romance</li>
              <li className="hover:text-retro-gold transition-colors">💿 2000s: Lucky Ali, Indipop & CDs</li>
              <li className="hover:text-retro-gold transition-colors">📻 Radio Days & Ameen Sayani</li>
            </ul>
          </div>

          {/* Col 3: Nostalgic Details & Stamp */}
          <div className="space-y-3">
            <h4 className="font-mono text-xs font-bold uppercase tracking-widest text-amber-200">
              AUTHENTICITY SEAL
            </h4>
            <div className="border-2 border-dashed border-retro-red bg-retro-red/10 p-3 rounded-lg text-center transform -rotate-1">
              <span className="block text-[10px] font-mono font-bold text-retro-red uppercase">
                GUARANTEED NOSTALGIA
              </span>
              <span className="text-xs font-hindi text-amber-200 block mt-1">
                &ldquo;पुरानी यादें, पुराने नगमे&rdquo;
              </span>
              <span className="text-[9px] font-mono text-stone-400 block mt-1">
                C-90 HIGH OUTPUT STEREO
              </span>
            </div>
          </div>
        </div>

        {/* Tributes to Indian Playback Legends */}
        <div className="py-6 border-b border-wood-800 text-center">
          <p className="text-xs font-mono text-stone-400 mb-2 uppercase tracking-wider">
            Dedicated with reverence to the timeless masters:
          </p>
          <p className="text-xs sm:text-sm font-sans text-stone-300 leading-relaxed max-w-4xl mx-auto">
            Kishore Kumar • Lata Mangeshkar • Mohammed Rafi • Asha Bhosle • RD Burman • Bappi Lahiri • Kumar Sanu • Udit Narayan • Alka Yagnik • Sonu Nigam • Lucky Ali • Jagjit Singh • AR Rahman • Pankaj Udhas • KK • Gulzar • Anand Bakshi
          </p>
        </div>

        {/* Bottom copyright & disclaimer */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-stone-400 font-sans">
          <p>
            © {new Date().getFullYear()} Cassette Wala. Designed with <Heart className="w-3.5 h-3.5 inline text-retro-red fill-current mx-0.5" /> for Indian music lovers worldwide.
          </p>
          <p className="text-stone-400">
            Powered by YouTube IFrame Player API. All tracks belong to respective record labels.
          </p>
        </div>
      </div>
    </footer>
  );
};
