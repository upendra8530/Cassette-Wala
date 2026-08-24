'use client';

import React from 'react';
import { Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="relative bg-[#0d0503] text-white/70 pt-12 pb-24 border-t border-white/10 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-white/10">
          {/* Col 1: Shop Story */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/favicon-192.png"
                alt="Cassette Wala"
                className="w-8 h-8 rounded-lg object-cover border border-amber-400/40 shadow-md"
              />
              <span className="font-display text-2xl text-white">
                Cassette Wala
              </span>
              <span className="font-hindi text-amber-400 text-lg">
                (कैसेट वाला)
              </span>
            </div>

            <p className="text-xs sm:text-sm text-white/60 font-sans leading-relaxed">
              Step back into the golden era of Indian music. Before streaming algorithms and infinite feeds, there were physical magnetic tapes, pencil-rewound spools, and songs that defined our lives.
            </p>

            <div className="pt-1 text-xs font-mono text-amber-400">
              📍 Shop No. 9, Novelty Cinema Lane, Estd. 1982
            </div>
          </div>

          {/* Col 2: Eras */}
          <div className="space-y-2">
            <h4 className="font-mono text-xs font-bold uppercase tracking-widest text-amber-300">
              Nostalgic Eras
            </h4>
            <ul className="space-y-1.5 text-xs text-white/60 font-sans">
              <li>📼 1980s: Disco, Vinyl & RD Burman</li>
              <li>❤️ 1990s: Nadeem-Shravan & Romance</li>
              <li>💿 2000s: Lucky Ali, Indipop & CDs</li>
              <li>📻 Radio Days & Ameen Sayani</li>
            </ul>
          </div>

          {/* Col 3: Stamp */}
          <div className="space-y-2">
            <h4 className="font-mono text-xs font-bold uppercase tracking-widest text-amber-300">
              Authenticity Seal
            </h4>
            <div className="border border-dashed border-red-500/40 bg-red-950/20 p-3 rounded-xl text-center">
              <span className="block text-[10px] font-mono font-bold text-red-400 uppercase">
                GUARANTEED NOSTALGIA
              </span>
              <span className="text-xs font-hindi text-amber-200 block mt-1">
                &ldquo;पुरानी यादें, पुराने नगमे&rdquo;
              </span>
              <span className="text-[9px] font-mono text-white/50 block mt-1">
                C-90 HIGH OUTPUT STEREO
              </span>
            </div>
          </div>
        </div>

        {/* Tributes */}
        <div className="py-6 border-b border-white/10 text-center">
          <p className="text-xs font-mono text-white/40 mb-2 uppercase tracking-wider">
            Dedicated with reverence to Indian playback legends:
          </p>
          <p className="text-xs font-sans text-white/60 leading-relaxed max-w-4xl mx-auto">
            Kishore Kumar • Lata Mangeshkar • Mohammed Rafi • Asha Bhosle • RD Burman • Bappi Lahiri • Kumar Sanu • Udit Narayan • Alka Yagnik • Sonu Nigam • Lucky Ali • Jagjit Singh • AR Rahman • Pankaj Udhas • KK • Gulzar • Anand Bakshi
          </p>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-white/40 font-sans">
          <p>
            © {new Date().getFullYear()} Cassette Wala. Made with <Heart className="w-3.5 h-3.5 inline text-red-500 fill-current mx-0.5" /> for Indian music lovers worldwide.
          </p>
          <p>
            Powered by YouTube IFrame Player API. All tracks belong to respective official record labels.
          </p>
        </div>
      </div>
    </footer>
  );
};
