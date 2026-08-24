'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { CASSETTE_PLAYLISTS } from '@/data/playlists';
import { CassetteData, Era, Mood, PlaybackStatus } from '@/lib/types';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/ui/HeroSection';
import { EraSelector } from '@/components/ui/EraSelector';
import { MoodSelector } from '@/components/ui/MoodSelector';
import { SearchBar } from '@/components/ui/SearchBar';
import { ShopAtmosphere } from '@/components/ui/ShopAtmosphere';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { SurpriseMeModal } from '@/components/ui/SurpriseMeModal';
import { SupportModal } from '@/components/ui/SupportModal';
import { CassetteShelf } from '@/components/cassette/CassetteShelf';
import { JCardModal } from '@/components/cassette/JCardModal';
import { CustomMixtapeModal } from '@/components/cassette/CustomMixtapeModal';
import { YouTubePlayer, YouTubePlayerRef } from '@/components/player/YouTubePlayer';
import { soundSynth } from '@/lib/soundSynth';

export default function Home() {
  // 1. Core State
  const [isLoading, setIsLoading] = useState(true);
  const [cassettes, setCassettes] = useState<CassetteData[]>(CASSETTE_PLAYLISTS);
  const [loadedCassette, setLoadedCassette] = useState<CassetteData | null>(CASSETTE_PLAYLISTS[0]);
  const [playbackStatus, setPlaybackStatus] = useState<PlaybackStatus>('unstarted');
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const [currentTrackName, setCurrentTrackName] = useState<string>('');
  const [volume, setVolume] = useState<number>(100);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // 2. Atmospheric Toggles
  const [isRainActive, setIsRainActive] = useState<boolean>(false);
  const [isTapeHissActive, setIsTapeHissActive] = useState<boolean>(false);

  // 3. Filters & Modals
  const [selectedEra, setSelectedEra] = useState<Era>('all');
  const [selectedMood, setSelectedMood] = useState<Mood>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [jCardCassette, setJCardCassette] = useState<CassetteData | null>(null);
  const [isMixtapeModalOpen, setIsMixtapeModalOpen] = useState<boolean>(false);
  const [surpriseCassette, setSurpriseCassette] = useState<CassetteData | null>(null);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState<boolean>(false);

  const ytPlayerRef = useRef<YouTubePlayerRef>(null);
  const shelfSectionRef = useRef<HTMLDivElement>(null);

  // 4. Update track title when cassette changes
  useEffect(() => {
    if (loadedCassette) {
      setCurrentTrackIndex(0);
      setCurrentTrackName(loadedCassette.tracksDetailed?.[0]?.title || loadedCassette.title);
    }
  }, [loadedCassette]);

  // 5. Toggle Atmospheric Rain & Tape Hiss
  const handleToggleRain = () => {
    setIsRainActive((prev) => !prev);
  };

  const handleToggleTapeHiss = () => {
    setIsTapeHissActive((prev) => {
      const next = !prev;
      if (next) soundSynth.startTapeHiss(0.04);
      else soundSynth.stopTapeHiss();
      return next;
    });
  };

  // 6. Synchronize current track name with elapsed time
  const handleTimeUpdate = (cur: number, dur: number) => {
    setCurrentTime(cur);
    setDuration(dur);

    if (loadedCassette?.tracksDetailed && loadedCassette.tracksDetailed.length > 0) {
      const tracks = loadedCassette.tracksDetailed;
      let activeIdx = 0;
      for (let i = 0; i < tracks.length; i++) {
        if (cur >= (tracks[i].timestampSeconds || 0)) {
          activeIdx = i;
        } else {
          break;
        }
      }
      if (activeIdx !== currentTrackIndex) {
        setCurrentTrackIndex(activeIdx);
        setCurrentTrackName(tracks[activeIdx].title);
      }
    }
  };

  // 7. Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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
          handleNext();
          break;
        case 'KeyP':
          e.preventDefault();
          soundSynth.playButtonClick();
          handlePrevious();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [playbackStatus, currentTrackIndex, loadedCassette, currentTime, duration, cassettes]);

  // 8. Filter Cassettes
  const filteredCassettes = useMemo(() => {
    return cassettes.filter((tape) => {
      if (selectedEra !== 'all' && tape.era !== selectedEra) {
        return false;
      }

      if (selectedMood !== 'all' && !tape.moods.includes(selectedMood)) {
        return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = tape.title.toLowerCase().includes(q);
        const matchesSubtitle = tape.subtitle?.toLowerCase().includes(q) || false;
        const matchesHindi = tape.hindiTitle?.toLowerCase().includes(q) || false;
        const matchesDesc = tape.description.toLowerCase().includes(q);
        const matchesSource = tape.source.toLowerCase().includes(q);
        const matchesSideA = tape.sideA.some((s) => s.toLowerCase().includes(q));
        const matchesSideB = tape.sideB.some((s) => s.toLowerCase().includes(q));

        if (!matchesTitle && !matchesSubtitle && !matchesHindi && !matchesDesc && !matchesSource && !matchesSideA && !matchesSideB) {
          return false;
        }
      }

      return true;
    });
  }, [cassettes, selectedEra, selectedMood, searchQuery]);

  // 9. Player Controls & Track Navigation
  const handleSelectCassette = (tape: CassetteData) => {
    setLoadedCassette(tape);
    setPlaybackStatus('playing');
    setCurrentTime(0);
    setCurrentTrackIndex(0);
    setCurrentTrackName(tape.tracksDetailed?.[0]?.title || tape.title);
    soundSynth.playTapeInsert();

    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });

    setTimeout(() => {
      ytPlayerRef.current?.play();
    }, 300);
  };

  const handlePlay = () => {
    setPlaybackStatus('playing');
    ytPlayerRef.current?.play();
  };

  const handlePause = () => {
    setPlaybackStatus('paused');
    ytPlayerRef.current?.pause();
  };

  // Next Track / Next Cassette
  const handleNext = () => {
    soundSynth.playRewindWhoosh();

    // 1. If current cassette has chapter tracks and next track exists within this tape
    if (loadedCassette?.tracksDetailed && currentTrackIndex + 1 < loadedCassette.tracksDetailed.length) {
      const nextIdx = currentTrackIndex + 1;
      const nextTrack = loadedCassette.tracksDetailed[nextIdx];
      setCurrentTrackIndex(nextIdx);
      setCurrentTrackName(nextTrack.title);
      ytPlayerRef.current?.seekTo(nextTrack.timestampSeconds || 0);
      return;
    }

    // 2. If it's a YouTube playlist, call next
    if (loadedCassette?.type === 'youtube-playlist') {
      ytPlayerRef.current?.next();
      return;
    }

    // 3. Otherwise, move to the next cassette in the rack
    const curIdx = cassettes.findIndex((c) => c.id === loadedCassette?.id);
    const nextTape = cassettes[(curIdx + 1) % cassettes.length];
    handleSelectCassette(nextTape);
  };

  // Previous Track / Previous Cassette
  const handlePrevious = () => {
    soundSynth.playRewindWhoosh();

    // 1. If more than 5s played into current track, restart current track
    const currentTrackStart = loadedCassette?.tracksDetailed?.[currentTrackIndex]?.timestampSeconds || 0;
    if (currentTime > currentTrackStart + 5) {
      ytPlayerRef.current?.seekTo(currentTrackStart);
      return;
    }

    // 2. If previous track exists in this cassette, jump back to it
    if (loadedCassette?.tracksDetailed && currentTrackIndex > 0) {
      const prevIdx = currentTrackIndex - 1;
      const prevTrack = loadedCassette.tracksDetailed[prevIdx];
      setCurrentTrackIndex(prevIdx);
      setCurrentTrackName(prevTrack.title);
      ytPlayerRef.current?.seekTo(prevTrack.timestampSeconds || 0);
      return;
    }

    // 3. If it's a YouTube playlist, call prev
    if (loadedCassette?.type === 'youtube-playlist') {
      ytPlayerRef.current?.previous();
      return;
    }

    // 4. Otherwise, jump to the previous cassette in the shelf
    const curIdx = cassettes.findIndex((c) => c.id === loadedCassette?.id);
    const prevTape = cassettes[(curIdx - 1 + cassettes.length) % cassettes.length];
    handleSelectCassette(prevTape);
  };

  const handleSeek = (seconds: number) => {
    setCurrentTime(seconds);
    ytPlayerRef.current?.seekTo(seconds);
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

  const handleResetFilters = () => {
    setSelectedEra('all');
    setSelectedMood('all');
    setSearchQuery('');
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-x-hidden">
      {/* Intro Loading Screen */}
      {isLoading && (
        <LoadingScreen onComplete={() => setIsLoading(false)} />
      )}

      {/* Atmospheric Rain & Lightning Engine */}
      <ShopAtmosphere isRainActive={isRainActive} />

      {/* Navbar (Delux Salon glass pill design) */}
      <Navbar
        onScrollToShelf={handleScrollToShelf}
        onSurpriseMe={handleSurpriseMe}
        onOpenMixtape={() => setIsMixtapeModalOpen(true)}
        onOpenSupport={() => setIsSupportModalOpen(true)}
        isRainActive={isRainActive}
        onToggleRain={handleToggleRain}
        isTapeHissActive={isTapeHissActive}
        onToggleTapeHiss={handleToggleTapeHiss}
        selectedEra={selectedEra}
        onSelectEra={setSelectedEra}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6">
        {/* Hero Section with Delux Music Player */}
        <HeroSection
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
          onScrollToShelf={handleScrollToShelf}
          onSurpriseMe={handleSurpriseMe}
          onOpenJCard={() => {
            if (loadedCassette) setJCardCassette(loadedCassette);
          }}
        />

        {/* Hidden Reliable YouTube IFrame Player */}
        <YouTubePlayer
          ref={ytPlayerRef}
          cassette={loadedCassette}
          isPlaying={playbackStatus === 'playing'}
          volume={volume}
          isMuted={isMuted}
          onStatusChange={setPlaybackStatus}
          onTimeUpdate={handleTimeUpdate}
          onTrackChange={(trackTitle) => {
            if (!loadedCassette?.tracksDetailed || loadedCassette.tracksDetailed.length === 0) {
              setCurrentTrackName(trackTitle);
            }
          }}
        />

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

        {/* The Cassette Rack / Shelf */}
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

      {/* J-Card Unfolding Booklet Modal */}
      <JCardModal
        cassette={jCardCassette}
        isOpen={!!jCardCassette}
        onClose={() => setJCardCassette(null)}
        onPlay={handleSelectCassette}
      />

      {/* Custom Mixtape Creator Modal */}
      <CustomMixtapeModal
        isOpen={isMixtapeModalOpen}
        onClose={() => setIsMixtapeModalOpen(false)}
        onMixtapeCreated={handleCustomMixtapeCreated}
      />

      {/* Surprise Me Modal */}
      <SurpriseMeModal
        cassette={surpriseCassette}
        isOpen={!!surpriseCassette}
        onClose={() => setSurpriseCassette(null)}
        onConfirmPlay={handleSelectCassette}
      />

      {/* Support Us Modal */}
      <SupportModal
        isOpen={isSupportModalOpen}
        onClose={() => setIsSupportModalOpen(false)}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
