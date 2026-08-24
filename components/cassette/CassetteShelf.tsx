'use client';

import React from 'react';
import { CassetteData } from '@/lib/types';
import { CassetteCard } from './CassetteCard';
import { Sparkles, RotateCcw } from 'lucide-react';

interface CassetteShelfProps {
  cassettes: CassetteData[];
  loadedCassette: CassetteData | null;
  isPlaying: boolean;
  onSelectCassette: (cassette: CassetteData) => void;
  onViewJCard: (cassette: CassetteData) => void;
  onResetFilters: () => void;
  activeFilterTitle?: string;
}

export const CassetteShelf: React.FC<CassetteShelfProps> = ({
  cassettes,
  loadedCassette,
  isPlaying,
  onSelectCassette,
  onViewJCard,
  onResetFilters,
  activeFilterTitle,
}) => {
  return (
    <section id="cassette-shelf" className="relative my-8 sm:my-14 scroll-mt-20">
      {/* Wooden Rack Shelf Header */}
      <div className="max-w-7xl mx-auto px-4 mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b-2 border-wood-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-retro-gold" />
            <h2 className="text-2xl sm:text-3xl font-serif font-black text-stone-100 uppercase tracking-tight">
              THE CASSETTE RACK
            </h2>
          </div>
          <p className="text-xs sm:text-sm font-hindi text-amber-200/80 mt-0.5">
            लकड़ी की अलमारी से अपनी पसंदीदा कैसेट चुनें — क्लिक करके डेक में लोड करें
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="font-mono text-xs text-retro-gold bg-wood-900 px-3 py-1 rounded-full border border-wood-700">
            {cassettes.length} {cassettes.length === 1 ? 'CASSETTE' : 'CASSETTES'} AVAILABLE
          </span>
        </div>
      </div>

      {/* Cassette Cards Grid on Wooden Shelf */}
      <div className="max-w-7xl mx-auto px-4">
        {cassettes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {cassettes.map((cassette) => (
              <div key={cassette.id} className="relative">
                <CassetteCard
                  cassette={cassette}
                  isCurrentlyLoaded={loadedCassette?.id === cassette.id}
                  isPlaying={loadedCassette?.id === cassette.id && isPlaying}
                  onSelect={onSelectCassette}
                  onViewJCard={onViewJCard}
                />
                {/* Realistic Wooden Shelf Trim below each card on desktop */}
                <div className="mt-3 h-2.5 rounded bg-gradient-to-b from-wood-700 via-wood-800 to-wood-950 border-t border-wood-600 shadow-md" />
              </div>
            ))}
          </div>
        ) : (
          /* Empty Search / Filter State */
          <div className="py-16 text-center bg-wood-950/60 rounded-2xl border-2 border-dashed border-wood-800 max-w-xl mx-auto p-6">
            <div className="w-12 h-12 rounded-full bg-wood-900 flex items-center justify-center mx-auto mb-3 text-2xl">
              🔍
            </div>
            <h3 className="font-serif text-lg font-bold text-stone-200">
              Koi Cassette Nahi Mili
            </h3>
            <p className="text-xs text-stone-400 font-sans mt-1">
              Aapke search ya filter ke mutabiq cassette shelf par uplabdh nahi hai.
            </p>
            <button
              onClick={onResetFilters}
              className="mt-4 px-4 py-2 rounded-lg bg-retro-red hover:bg-retro-crimson text-white text-xs font-bold font-sans inline-flex items-center gap-1.5 transition-colors shadow"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>SABHI CASSETTE DEKHEIN (RESET)</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
