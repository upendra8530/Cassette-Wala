'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Plus, Disc, Check, AlertCircle, Music } from 'lucide-react';
import { CassetteData } from '@/lib/types';
import { parseYouTubeSource } from '@/lib/youtubeHelper';
import { soundSynth } from '@/lib/soundSynth';

interface CustomMixtapeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMixtapeCreated: (cassette: CassetteData) => void;
}

export const CustomMixtapeModal: React.FC<CustomMixtapeModalProps> = ({
  isOpen,
  onClose,
  onMixtapeCreated,
}) => {
  const [urlInput, setUrlInput] = useState('');
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [dedication, setDedication] = useState('');
  const [selectedColor, setSelectedColor] = useState<'black' | 'clear' | 'smoke' | 'red' | 'gold' | 'teal'>('red');
  const [selectedEra, setSelectedEra] = useState<'1980s' | '1990s' | '2000s'>('1990s');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const colorOptions = [
    { id: 'red', name: 'Vintage Red', bg: '#b93826', labelBg: '#faf0ca', text: '#1f1b16' },
    { id: 'gold', name: 'Gold Edition', bg: '#b05d15', labelBg: '#fef3c7', text: '#451a03' },
    { id: 'black', name: 'Matte Charcoal', bg: '#1c1c1f', labelBg: '#f4eedb', text: '#18100b' },
    { id: 'clear', name: 'Clear Acrylic', bg: '#1b4965', labelBg: '#fefae0', text: '#0b2545' },
    { id: 'teal', name: 'Peacock Teal', bg: '#1f4e5b', labelBg: '#e0f2fe', text: '#082f49' },
    { id: 'smoke', name: 'Smoky Glass', bg: '#3d2719', labelBg: '#faf4e6', text: '#1c130d' },
  ] as const;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!urlInput.trim()) {
      setError('Kripya ek YouTube Playlist ya Video link dalein.');
      return;
    }

    const parsed = parseYouTubeSource(urlInput);
    if (parsed.type === 'invalid') {
      setError('Amanaye YouTube URL. Sahi YouTube Playlist URL ya Video URL dalein.');
      return;
    }

    const tapeTitle = title.trim() || (parsed.type === 'playlist' ? 'Mera YouTube Mixtape' : 'Mera Gaana');
    const tapeSubtitle = subtitle.trim() || 'Recorded from YouTube';

    const colorConfig = colorOptions.find((c) => c.id === selectedColor) || colorOptions[0];

    const newCassette: CassetteData = {
      id: `custom-mixtape-${Date.now()}`,
      title: tapeTitle,
      subtitle: tapeSubtitle,
      hindiTitle: `📼 ${tapeTitle}`,
      description: dedication.trim() || 'Custom recorded mixtape created on Cassette Wala.',
      era: selectedEra,
      yearRange: 'Custom Mix',
      moods: ['all', 'romance', 'safar'],
      type: parsed.type,
      youtubeId: parsed.type === 'video' ? parsed.id : undefined,
      youtubePlaylistId: parsed.type === 'playlist' ? parsed.id : undefined,
      youtubeUrl: parsed.originalUrl,
      source: 'Custom User Mixtape',
      trackCount: parsed.type === 'playlist' ? 15 : 1,
      durationApprox: 'Custom',
      featuredBadge: 'CUSTOM MIXTAPE C-90',
      recordLabel: 'Apna Record Label (Cassette Wala)',
      priceMRP: 'NOT FOR SALE (Pyaar Se Banaya)',
      jCardNotes: dedication.trim() ? `Dedication: "${dedication.trim()}"` : 'Handcrafted mixtape with special personal memories.',
      sideA: [
        `1. ${tapeTitle} (Track 1)`,
        '2. Nostalgic Melody (Track 2)',
        '3. Road Trip Memory (Track 3)',
      ],
      sideB: [
        '1. Late Night Special (Track 4)',
        '2. Unplugged Favorite (Track 5)',
      ],
      coverColor: {
        base: colorConfig.bg,
        border: '#d99b26',
        accent: '#f5edd8',
        labelBg: colorConfig.labelBg,
        labelText: colorConfig.text,
        tapeBody: selectedColor,
        ribbonColor: colorConfig.bg,
      },
    };

    soundSynth.playTapeInsert();
    onMixtapeCreated(newCassette);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0"
        />

        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', stiffness: 280, damping: 24 }}
          className="relative z-10 w-full max-w-xl bg-wood-900 text-stone-100 rounded-xl shadow-2xl border-2 border-wood-600 overflow-hidden my-auto"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-retro-red via-retro-rust to-wood-800 p-4 text-white flex items-center justify-between border-b border-wood-700">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-retro-gold" />
              <div>
                <h3 className="font-serif text-lg font-bold">Apna Mixtape Banao</h3>
                <p className="text-[11px] text-amber-200">Custom YouTube Playlist / Video Cassette</p>
              </div>
            </div>
            <button
              onClick={() => {
                soundSynth.playButtonClick();
                onClose();
              }}
              className="p-1 rounded-full bg-black/30 hover:bg-black/60 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
            {error && (
              <div className="p-2.5 rounded bg-red-950/80 border border-red-700 text-red-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* YouTube URL */}
            <div>
              <label className="block text-xs font-mono text-amber-200/90 uppercase tracking-wider mb-1">
                1. YouTube Playlist ya Video Link / ID *
              </label>
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://www.youtube.com/playlist?list=PL... ya youtu.be/..."
                className="w-full bg-wood-950 border border-wood-700 rounded px-3 py-2 text-sm text-amber-100 placeholder-stone-500 focus:outline-none focus:border-retro-gold font-mono"
                required
              />
              <p className="text-[10px] text-stone-400 mt-1">
                💡 Paste any YouTube playlist URL or single video link.
              </p>
            </div>

            {/* Title & Subtitle */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono text-amber-200/90 uppercase tracking-wider mb-1">
                  2. Cassette Title (Label Naam)
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. 90s Hostel Yaadein"
                  className="w-full bg-wood-950 border border-wood-700 rounded px-3 py-2 text-sm text-amber-100 placeholder-stone-500 focus:outline-none focus:border-retro-gold font-hindi"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-amber-200/90 uppercase tracking-wider mb-1">
                  3. Artist / Subtitle
                </label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="e.g. Romantic Road Trip Mix"
                  className="w-full bg-wood-950 border border-wood-700 rounded px-3 py-2 text-sm text-amber-100 placeholder-stone-500 focus:outline-none focus:border-retro-gold"
                />
              </div>
            </div>

            {/* Dedication / Notes */}
            <div>
              <label className="block text-xs font-mono text-amber-200/90 uppercase tracking-wider mb-1">
                4. Dedication / Handwritten Note
              </label>
              <textarea
                value={dedication}
                onChange={(e) => setDedication(e.target.value)}
                placeholder="e.g. 'For Priya — un sabhi shaamon ke naam jo saath guzari...'"
                rows={2}
                className="w-full bg-wood-950 border border-wood-700 rounded px-3 py-2 text-sm text-amber-100 placeholder-stone-500 focus:outline-none focus:border-retro-gold font-handwriting text-base"
              />
            </div>

            {/* Era & Color Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div>
                <label className="block text-xs font-mono text-amber-200/90 uppercase tracking-wider mb-1.5">
                  5. Pick Era Vibe
                </label>
                <div className="flex gap-2">
                  {(['1980s', '1990s', '2000s'] as const).map((era) => (
                    <button
                      type="button"
                      key={era}
                      onClick={() => setSelectedEra(era)}
                      className={`flex-1 py-1.5 rounded text-xs font-mono font-bold transition-colors ${
                        selectedEra === era
                          ? 'bg-retro-gold text-wood-950'
                          : 'bg-wood-800 text-stone-300 hover:bg-wood-700'
                      }`}
                    >
                      {era}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-amber-200/90 uppercase tracking-wider mb-1.5">
                  6. Cassette Body Color
                </label>
                <div className="flex items-center gap-2">
                  {colorOptions.map((c) => (
                    <button
                      type="button"
                      key={c.id}
                      onClick={() => setSelectedColor(c.id as any)}
                      className="relative w-7 h-7 rounded-full border-2 transition-transform active:scale-95"
                      style={{
                        backgroundColor: c.bg,
                        borderColor: selectedColor === c.id ? '#ffffff' : '#555',
                        transform: selectedColor === c.id ? 'scale(1.15)' : 'scale(1)',
                      }}
                      title={c.name}
                    >
                      {selectedColor === c.id && (
                        <Check className="w-3.5 h-3.5 text-white absolute inset-0 m-auto" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-wood-800">
              <button
                type="button"
                onClick={() => {
                  soundSynth.playButtonClick();
                  onClose();
                }}
                className="px-4 py-2 text-xs font-mono text-stone-400 hover:text-stone-200 transition-colors"
              >
                CANCEL
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded bg-retro-gold hover:bg-amber-400 text-wood-950 font-sans text-xs font-bold flex items-center gap-2 shadow-lg transition-all active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>CASSETTE RECORD KAREIN & PLAY</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
