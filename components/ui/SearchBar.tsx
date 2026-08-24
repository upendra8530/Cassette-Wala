'use client';

import React, { useRef } from 'react';
import { Search, X, Sparkles } from 'lucide-react';
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
    'Rain',
    'Road Trip',
    'Jagjit Singh',
    'Lucky Ali',
    'Sad',
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
      {/* Search Input Box */}
      <div className="relative flex items-center">
        <div className="absolute left-3.5 text-retro-gold pointer-events-none">
          <Search className="w-4 h-4" />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Cassette, Singer, Movie ya Mood khojein (e.g. Kumar Sanu, Rain, 90s)..."
          className="w-full bg-wood-950/90 border-2 border-wood-700 focus:border-retro-gold rounded-xl pl-10 pr-24 py-3 text-sm text-stone-100 placeholder-stone-400 focus:outline-none shadow-inner transition-colors font-sans"
        />

        {/* Right Action: Result count & Clear button */}
        <div className="absolute right-3 flex items-center gap-2">
          {searchQuery ? (
            <button
              onClick={handleClear}
              className="p-1 rounded-full bg-wood-800 hover:bg-wood-700 text-stone-400 hover:text-stone-200 transition-colors"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : null}

          <span className="font-mono text-[10px] text-retro-gold bg-wood-900 border border-wood-700 px-2 py-0.5 rounded">
            {resultCount} CASSETTES
          </span>
        </div>
      </div>

      {/* Quick Search Chips */}
      <div className="flex flex-wrap items-center gap-1.5 mt-2.5 px-1">
        <span className="text-[11px] font-mono text-stone-400 font-bold uppercase mr-1">
          POPULAR:
        </span>
        {quickSearchTags.map((tag) => (
          <button
            key={tag}
            onClick={() => handleTagClick(tag)}
            className={`text-[11px] font-sans px-2.5 py-0.5 rounded-full border transition-colors ${
              searchQuery.toLowerCase() === tag.toLowerCase()
                ? 'bg-retro-gold text-wood-950 border-amber-300 font-bold'
                : 'bg-wood-900/60 hover:bg-wood-800 text-stone-300 border-wood-800 hover:border-wood-700'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
};
