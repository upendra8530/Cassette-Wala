'use client';

import React, { useRef } from 'react';
import { Search, X } from 'lucide-react';
import { soundSynth } from '@/lib/soundSynth';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  resultCount: number;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  onSearchChange,
  resultCount,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const quickSearchTags = [
    'Kumar Sanu',
    'Alka Yagnik',
    '80s Golden',
    'Baarish',
    'Jagjit Singh',
    'Lucky Ali',
    'Safar',
  ];

  const handleTagClick = (tag: string) => {
    soundSynth.playButtonClick();
    onSearchChange(tag);
  };

  const handleClear = () => {
    soundSynth.playButtonClick();
    onSearchChange('');
    inputRef.current?.focus();
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 my-6">
      <div className="relative flex items-center">
        <div className="absolute left-4 text-amber-400 pointer-events-none">
          <Search className="w-4 h-4" />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Cassette, Singer ya Mood khojein (e.g. Kumar Sanu, Baarish, 90s)..."
          className="w-full bg-black/50 border border-white/20 focus:border-amber-400 rounded-full pl-11 pr-24 py-3 text-sm text-white placeholder-white/40 focus:outline-none shadow-inner transition-colors font-sans"
        />

        <div className="absolute right-3 flex items-center gap-2">
          {searchQuery && (
            <button
              onClick={handleClear}
              className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-white/60 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          <span className="font-mono text-[10px] text-amber-300 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-full">
            {resultCount} CASSETTES
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-1.5 mt-3">
        <span className="text-[11px] font-mono text-white/40 font-bold uppercase mr-1">
          POPULAR:
        </span>
        {quickSearchTags.map((tag) => (
          <button
            key={tag}
            onClick={() => handleTagClick(tag)}
            className={`text-[11px] px-3 py-0.5 rounded-full border transition-colors ${
              searchQuery.toLowerCase() === tag.toLowerCase()
                ? 'bg-amber-500 text-black border-amber-400 font-bold'
                : 'bg-white/5 hover:bg-white/10 text-white/70 border-white/10'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
};
