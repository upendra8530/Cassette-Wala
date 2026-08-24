'use client';

import React, { useState, useRef, useEffect } from 'react';
import { CASSETTE_PLAYLISTS } from '@/data/playlists';
import { CassetteData, PlaybackStatus } from '@/lib/types';
import { HeroSection } from '@/components/ui/HeroSection';
import { ShopAtmosphere } from '@/components/ui/ShopAtmosphere';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { SupportModal } from '@/components/ui/SupportModal';
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

  // 3. Modals
  const [jCardCassette, setJCardCassette] = useState<CassetteData | null>(null);
  const [isMixtapeModalOpen, setIsMixtapeModalOpen] = useState<boolean>(false);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState<boolean>(false);

  const ytPlayerRef = useRef<YouTubePlayerRef>(null);

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

  // 8. Player Controls
  const handleSelectCassette = (tape: CassetteData) => {
    setLoadedCassette(tape);
    setPlaybackStatus('playing');
    setCurrentTime(0);
    setCurrentTrackIndex(0);
    setCurrentTrackName(tape.tracksDetailed?.[0]?.title || tape.title);
    soundSynth.playTapeInsert();

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

  // Next Track / Repeat / Next Cassette
  const handleNext = () => {
    soundSynth.playRewindWhoosh();

    if (loadedCassette?.tracksDetailed && currentTrackIndex + 1 < loadedCassette.tracksDetailed.length) {
      const nextIdx = currentTrackIndex + 1;
      const nextTrack = loadedCassette.tracksDetailed[nextIdx];
      setCurrentTrackIndex(nextIdx);
      setCurrentTrackName(nextTrack.title);
      ytPlayerRef.current?.seekTo(nextTrack.timestampSeconds || 0);
      return;
    }

    if (loadedCassette?.type === 'youtube-playlist') {
      ytPlayerRef.current?.next();
      return;
    }

    if (cassettes.length > 1) {
      const curIdx = cassettes.findIndex((c) => c.id === loadedCassette?.id);
      const nextTape = cassettes[(curIdx + 1) % cassettes.length];
      handleSelectCassette(nextTape);
    } else {
      // Replay track
      ytPlayerRef.current?.seekTo(0);
    }
  };

  // Previous Track
  const handlePrevious = () => {
    soundSynth.playRewindWhoosh();

    const currentTrackStart = loadedCassette?.tracksDetailed?.[currentTrackIndex]?.timestampSeconds || 0;
    if (currentTime > currentTrackStart + 5) {
      ytPlayerRef.current?.seekTo(currentTrackStart);
      return;
    }

    if (loadedCassette?.tracksDetailed && currentTrackIndex > 0) {
      const prevIdx = currentTrackIndex - 1;
      const prevTrack = loadedCassette.tracksDetailed[prevIdx];
      setCurrentTrackIndex(prevIdx);
      setCurrentTrackName(prevTrack.title);
      ytPlayerRef.current?.seekTo(prevTrack.timestampSeconds || 0);
      return;
    }

    if (loadedCassette?.type === 'youtube-playlist') {
      ytPlayerRef.current?.previous();
      return;
    }

    if (cassettes.length > 1) {
      const curIdx = cassettes.findIndex((c) => c.id === loadedCassette?.id);
      const prevTape = cassettes[(curIdx - 1 + cassettes.length) % cassettes.length];
      handleSelectCassette(prevTape);
    } else {
      ytPlayerRef.current?.seekTo(0);
    }
  };

  const handleSeek = (seconds: number) => {
    setCurrentTime(seconds);
    ytPlayerRef.current?.seekTo(seconds);
  };

  const handleCustomMixtapeCreated = (newCassette: CassetteData) => {
    setCassettes((prev) => [newCassette, ...prev]);
    handleSelectCassette(newCassette);
  };

  return (
    <main className="relative min-h-screen w-full flex flex-col justify-between overflow-x-hidden">
      {/* Intro Loading Screen */}
      {isLoading && (
        <LoadingScreen onComplete={() => setIsLoading(false)} />
      )}

      {/* Atmospheric Rain & Lightning Engine */}
      <ShopAtmosphere isRainActive={isRainActive} />

      {/* Hero Section with Delux Music Player */}
      <HeroSection
        cassette={loadedCassette}
        allCassettes={cassettes}
        onSelectCassette={handleSelectCassette}
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
        onOpenJCard={() => {
          if (loadedCassette) setJCardCassette(loadedCassette);
        }}
        onOpenMixtape={() => setIsMixtapeModalOpen(true)}
        onOpenSupport={() => setIsSupportModalOpen(true)}
        isRainActive={isRainActive}
        onToggleRain={handleToggleRain}
        isTapeHissActive={isTapeHissActive}
        onToggleTapeHiss={handleToggleTapeHiss}
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

      {/* J-Card Inlay Booklet Modal */}
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

      {/* Support Us Modal */}
      <SupportModal
        isOpen={isSupportModalOpen}
        onClose={() => setIsSupportModalOpen(false)}
      />
    </main>
  );
}
