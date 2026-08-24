'use client';

import React from 'react';
import { CassetteData } from '@/lib/types';
import { CassetteCard } from './CassetteCard';
import { RotateCcw } from 'lucide-react';

interface CassetteShelfProps {
  cassettes: CassetteData[];
  loadedCassette: CassetteData | null;
  isPlaying: boolean;
  onSelectCassette: (cassette: CassetteData) => void;
  onViewJCard: (cassette: CassetteData) => void;
  onResetFilters: () => void;
}

export const CassetteShelf: React.FC<CassetteShelfProps> = ({
  cassettes,
  loadedCassette,
  isPlaying,
  onSelectCassette,
  onViewJCard,
  onResetFilters,
}) => {
  return (
    <section id="cassette-shelf" className="relative my-10 sm:my-14 scroll-mt-20">
      {/* Shelf Header */}
      <div className="max-w-7xl mx-auto px-4 mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <h2 className="text-2xl sm:text-3xl font-display text-white tracking-tight">
              The Cassette Rack
            </h2>
          </div>
          <p className="text-xs sm:text-sm font-hindi text-amber-300/80 mt-0.5">
            लकड़ी की अलमारी से अपनी पसंद की कैसेट चुनें — क्लिक करके बजाएं
          </p>
        </div>

        <div>
          <span className="font-mono text-xs text-amber-400 bg-black/40 px-3 py-1 rounded-full border border-white/15">
            {cassettes.length} {cassettes.length === 1 ? 'CASSETTE' : 'CASSETTES'} READY
          </span>
        </div>
      </div>

      {/* Cassette Grid */}
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
                {/* Subtle shelf ledge line */}
                <div className="mt-3.5 h-1 rounded-full bg-gradient-to-r from-stone-800 via-amber-900/60 to-stone-800" />
              </div>
            ))}
          </div>
        ) : (
          /* Empty state */
          <div className="py-16 text-center bg-black/40 rounded-3xl border border-dashed border-white/15 max-w-lg mx-auto p-6">
            <h3 className="font-display text-lg text-white">
              Koi Cassette Nahi Mili
            </h3>
            <p className="text-xs text-white/60 font-sans mt-1">
              Aapke search ya filter ke mutabiq cassette shelf par uplabdh nahi hai.
            </p>
            <button
              onClick={onResetFilters}
              className="mt-4 px-4 py-2 rounded-full bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold font-sans inline-flex items-center gap-1.5 transition-colors shadow-lg"
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
