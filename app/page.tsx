'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { CASSETTE_PLAYLISTS } from '@/data/playlists';
import { CassetteData, Era, Mood, PlaybackStatus, AudioSettings } from '@/lib/types';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/ui/HeroSection';
import { EraSelector } from '@/components/ui/EraSelector';
import { MoodSelector } from '@/components/ui/MoodSelector';
import { SearchBar } from '@/components/ui/SearchBar';
import { ShopAtmosphere } from '@/components/ui/ShopAtmosphere';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { SurpriseMeModal } from '@/components/ui/SurpriseMeModal';
import { CassetteShelf } from '@/components/cassette/CassetteShelf';
import { JCardModal } from '@/components/cassette/JCardModal';
import { CustomMixtapeModal } from '@/components/cassette/CustomMixtapeModal';
import { CassettePlayerDeck } from '@/components/player/CassettePlayerDeck';
import { YouTubePlayer, YouTubePlayerRef } from '@/components/player/YouTubePlayer';
import { NowPlayingBar } from '@/components/player/NowPlayingBar';
import { soundSynth } from '@/lib/soundSynth';

export default function Home() {
  // 1. Initial State
  const [isLoading, setIsLoading] = useState(true);
  const [cassettes, setCassettes] = useState<CassetteData[]>(CASSETTE_PLAYLISTS);
  const [loadedCassette, setLoadedCassette] = useState<CassetteData | null>(CASSETTE_PLAYLISTS[0]);
  const [playbackStatus, setPlaybackStatus] = useState<PlaybackStatus>('unstarted');
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [currentTrackName, setCurrentTrackName] = useState<string>('');
  const [volume, setVolume] = useState<number>(80);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [showVideoPreview, setShowVideoPreview] = useState<boolean>(false);

  // 2. Filters & Modals
  const [selectedEra, setSelectedEra] = useState<Era>('all');
  const [selectedMood, setSelectedMood] = useState<Mood>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [jCardCassette, setJCardCassette] = useState<CassetteData | null>(null);
  const [isMixtapeModalOpen, setIsMixtapeModalOpen] = useState<boolean>(false);
  const [surpriseCassette, setSurpriseCassette] = useState<CassetteData | null>(null);

  // 3. Audio & Vintage FX Settings
  const [audioSettings, setAudioSettings] = useState<AudioSettings>({
    sfxEnabled: true,
    sfxVolume: 0.6,
    tapeHissEnabled: false,
    tapeHissVolume: 0.04,
    tapeType: 'Type I (Normal)',
    dolbyNR: 'B',
    crtEffect: false,
  });

  const ytPlayerRef = useRef<YouTubePlayerRef>(null);
  const deckSectionRef = useRef<HTMLDivElement>(null);
  const shelfSectionRef = useRef<HTMLDivElement>(null);

  // 4. Update track title if loadedCassette changes
  useEffect(() => {
    if (loadedCassette) {
      setCurrentTrackName(loadedCassette.tracksDetailed?.[0]?.title || loadedCassette.title);
    }
  }, [loadedCassette]);

  // 5. Keyboard Navigation & Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept when user is typing in an input/textarea
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          if (playbackStatus === 'playing') {
            soundSynth.playTapeStop();
            ytPlayerRef.current?.pause();
            setPlaybackStatus('paused');
          } else {
            soundSynth.playTapeStart();
            ytPlayerRef.current?.play();
            setPlaybackStatus('playing');
          }
          break;
        case 'ArrowLeft':
          e.preventDefault();
          soundSynth.playRewindWhoosh();
          ytPlayerRef.current?.seekRelative(-10);
          break;
        case 'ArrowRight':
          e.preventDefault();
          soundSynth.playRewindWhoosh();
          ytPlayerRef.current?.seekRelative(10);
          break;
        case 'KeyM':
          e.preventDefault();
          soundSynth.playSwitchClick();
          setIsMuted((prev) => !prev);
          break;
        case 'KeyN':
          e.preventDefault();
          soundSynth.playButtonClick();
          ytPlayerRef.current?.next();
          break;
        case 'KeyP':
          e.preventDefault();
          soundSynth.playButtonClick();
          ytPlayerRef.current?.previous();
          break;
        case 'KeyE':
          e.preventDefault();
          soundSynth.playTapeEject();
          handleEject();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [playbackStatus]);

  // 6. Filter Cassettes by Era, Mood, and Search Query
  const filteredCassettes = useMemo(() => {
    return cassettes.filter((tape) => {
      // Era filter
      if (selectedEra !== 'all' && tape.era !== selectedEra) {
        return false;
      }

      // Mood filter
      if (selectedMood !== 'all' && !tape.moods.includes(selectedMood)) {
        return false;
      }

      // Search Query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesTitle = tape.title.toLowerCase().includes(query);
        const matchesSubtitle = tape.subtitle.toLowerCase().includes(query);
        const matchesHindi = tape.hindiTitle?.toLowerCase().includes(query) || false;
        const matchesDescription = tape.description.toLowerCase().includes(query);
        const matchesSource = tape.source.toLowerCase().includes(query);
        const matchesEra = tape.era.toLowerCase().includes(query);
        const matchesTracks =
          tape.sideA.some((t) => t.toLowerCase().includes(query)) ||
          tape.sideB.some((t) => t.toLowerCase().includes(query)) ||
          tape.tracksDetailed?.some((t) => t.title.toLowerCase().includes(query) || t.artist?.toLowerCase().includes(query) || t.movie?.toLowerCase().includes(query));

        if (!matchesTitle && !matchesSubtitle && !matchesHindi && !matchesDescription && !matchesSource && !matchesEra && !matchesTracks) {
          return false;
        }
      }

      return true;
    });
  }, [cassettes, selectedEra, selectedMood, searchQuery]);

  // 7. Player Control Handlers
  const handleSelectCassette = (tape: CassetteData) => {
    setLoadedCassette(tape);
    setPlaybackStatus('playing');
    setCurrentTime(0);
    setCurrentTrackName(tape.tracksDetailed?.[0]?.title || tape.title);
    soundSynth.playTapeInsert();

    // Scroll to player deck smoothly
    deckSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });

    setTimeout(() => {
      ytPlayerRef.current?.play();
    }, 400);
  };

  const handlePlay = () => {
    setPlaybackStatus('playing');
    ytPlayerRef.current?.play();
  };

  const handlePause = () => {
    setPlaybackStatus('paused');
    ytPlayerRef.current?.pause();
  };

  const handleStop = () => {
    setPlaybackStatus('paused');
    ytPlayerRef.current?.stop();
    setCurrentTime(0);
  };

  const handleNext = () => {
    ytPlayerRef.current?.next();
  };

  const handlePrevious = () => {
    ytPlayerRef.current?.previous();
  };

  const handleSeek = (seconds: number) => {
    setCurrentTime(seconds);
    ytPlayerRef.current?.seekTo(seconds);
  };

  const handleEject = () => {
    soundSynth.playTapeEject();
    handleStop();
    setLoadedCassette(null);
  };

  const handleSurpriseMe = () => {
    const randomIndex = Math.floor(Math.random() * cassettes.length);
    const chosen = cassettes[randomIndex];
    setSurpriseCassette(chosen);
  };

  const handleCustomMixtapeCreated = (newCassette: CassetteData) => {
    setCassettes((prev) => [newCassette, ...prev]);
    handleSelectCassette(newCassette);
  };

  const handleScrollToShelf = () => {
    shelfSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleScrollToDeck = () => {
    deckSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handleResetFilters = () => {
    setSelectedEra('all');
    setSelectedMood('all');
    setSearchQuery('');
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-x-hidden">
      {/* Initial Loading Screen */}
      {isLoading && (
        <LoadingScreen onComplete={() => setIsLoading(false)} />
      )}

      {/* Atmospheric dust particles & film grain overlay */}
      <ShopAtmosphere crtEnabled={audioSettings.crtEffect} />

      {/* Top Navbar */}
      <Navbar
        onScrollToShelf={handleScrollToShelf}
        onScrollToDeck={handleScrollToDeck}
        onSurpriseMe={handleSurpriseMe}
        onOpenMixtape={() => setIsMixtapeModalOpen(true)}
        audioSettings={audioSettings}
        onUpdateAudioSettings={(newSettings) =>
          setAudioSettings((prev) => ({ ...prev, ...newSettings }))
        }
        selectedEra={selectedEra}
        onSelectEra={setSelectedEra}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6">
        {/* Hero Section */}
        <HeroSection
          onPlayCassetteClick={handleScrollToShelf}
          onSurpriseMeClick={handleSurpriseMe}
          onOpenMixtape={() => setIsMixtapeModalOpen(true)}
        />

        {/* Masterpiece Vintage Cassette Player Deck */}
        <section ref={deckSectionRef} className="my-8 sm:my-12 scroll-mt-24">
          <CassettePlayerDeck
            cassette={loadedCassette}
            playbackStatus={playbackStatus}
            currentTime={currentTime}
            duration={duration}
            currentTrackName={currentTrackName}
            volume={volume}
            isMuted={isMuted}
            audioSettings={audioSettings}
            onPlay={handlePlay}
            onPause={handlePause}
            onStop={handleStop}
            onNext={handleNext}
            onPrevious={handlePrevious}
            onSeek={handleSeek}
            onVolumeChange={setVolume}
            onToggleMute={() => setIsMuted((prev) => !prev)}
            onEject={handleEject}
            onToggleSettings={() => {}}
            onToggleVideoPreview={() => setShowVideoPreview((prev) => !prev)}
            showVideoPreview={showVideoPreview}
            onOpenJCard={() => {
              if (loadedCassette) setJCardCassette(loadedCassette);
            }}
          />

          {/* Hidden / Toggleable YouTube IFrame Player */}
          <YouTubePlayer
            ref={ytPlayerRef}
            cassette={loadedCassette}
            isPlaying={playbackStatus === 'playing'}
            volume={volume}
            isMuted={isMuted}
            showVideoDebug={showVideoPreview}
            onStatusChange={setPlaybackStatus}
            onTimeUpdate={(cur, dur) => {
              setCurrentTime(cur);
              setDuration(dur);
            }}
            onTrackChange={(trackTitle) => {
              setCurrentTrackName(trackTitle);
            }}
          />
        </section>

        {/* Pick Your Era Section */}
        <EraSelector
          selectedEra={selectedEra}
          onSelectEra={(era) => {
            setSelectedEra(era);
            handleScrollToShelf();
          }}
        />

        {/* What's Your Mood? Section */}
        <MoodSelector
          selectedMood={selectedMood}
          onSelectMood={(mood) => {
            setSelectedMood(mood);
            handleScrollToShelf();
          }}
        />

        {/* Search Bar */}
        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          resultCount={filteredCassettes.length}
        />

        {/* The Wooden Cassette Rack / Shelf */}
        <div ref={shelfSectionRef}>
          <CassetteShelf
            cassettes={filteredCassettes}
            loadedCassette={loadedCassette}
            isPlaying={playbackStatus === 'playing'}
            onSelectCassette={handleSelectCassette}
            onViewJCard={setJCardCassette}
            onResetFilters={handleResetFilters}
          />
        </div>
      </main>

      {/* Sticky Now Playing Bar (Desktop & Mobile) */}
      <NowPlayingBar
        cassette={loadedCassette}
        playbackStatus={playbackStatus}
        currentTime={currentTime}
        duration={duration}
        currentTrackName={currentTrackName}
        volume={volume}
        isMuted={isMuted}
        onPlay={handlePlay}
        onPause={handlePause}
        onNext={handleNext}
        onPrevious={handlePrevious}
        onSeek={handleSeek}
        onVolumeChange={setVolume}
        onToggleMute={() => setIsMuted((prev) => !prev)}
        onEject={handleEject}
        onFocusDeck={handleScrollToDeck}
        onOpenJCard={() => {
          if (loadedCassette) setJCardCassette(loadedCassette);
        }}
      />

      {/* J-Card Unfolding Booklet Modal */}
      <JCardModal
        cassette={jCardCassette}
        isOpen={!!jCardCassette}
        onClose={() => setJCardCassette(null)}
        onPlay={handleSelectCassette}
      />

      {/* Custom Mixtape Creator Modal ("Apna Mixtape Banao") */}
      <CustomMixtapeModal
        isOpen={isMixtapeModalOpen}
        onClose={() => setIsMixtapeModalOpen(false)}
        onMixtapeCreated={handleCustomMixtapeCreated}
      />

      {/* Surprise Me Postcard Modal */}
      <SurpriseMeModal
        cassette={surpriseCassette}
        isOpen={!!surpriseCassette}
        onClose={() => setSurpriseCassette(null)}
        onConfirmPlay={handleSelectCassette}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
