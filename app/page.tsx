'use client';

import React, { useState, useRef, useEffect } from 'react';
import { CASSETTE_PLAYLISTS } from '@/data/playlists';
import { CassetteData, PlaybackStatus } from '@/lib/types';
import { HeroSection } from '@/components/ui/HeroSection';
import { ShopAtmosphere } from '@/components/ui/ShopAtmosphere';
import { SupportModal } from '@/components/ui/SupportModal';
import { JCardModal } from '@/components/cassette/JCardModal';
import { YouTubePlayer, YouTubePlayerRef } from '@/components/player/YouTubePlayer';
import { soundSynth } from '@/lib/soundSynth';

export default function Home() {
  // 1. Core State
  const [cassettes, setCassettes] = useState<CassetteData[]>(CASSETTE_PLAYLISTS);
  const [loadedCassette, setLoadedCassette] = useState<CassetteData | null>(CASSETTE_PLAYLISTS[0]);
  const [playbackStatus, setPlaybackStatus] = useState<PlaybackStatus>('unstarted');
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const [currentTrackName, setCurrentTrackName] = useState<string>('Pehla Nasha');
  const [volume, setVolume] = useState<number>(100);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // 2. Atmospheric Toggles
  const [isRainActive, setIsRainActive] = useState<boolean>(false);
  const [isTapeHissActive, setIsTapeHissActive] = useState<boolean>(false);

  // 3. Modals
  const [jCardCassette, setJCardCassette] = useState<CassetteData | null>(null);
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

  // 6. Synchronize time
  const handleTimeUpdate = (cur: number, dur: number) => {
    setCurrentTime(cur);
    setDuration(dur);
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

  // Next Track in Playlist
  const handleNext = () => {
    soundSynth.playRewindWhoosh();
    ytPlayerRef.current?.next();
  };

  // Previous Track in Playlist
  const handlePrevious = () => {
    soundSynth.playRewindWhoosh();
    if (currentTime > 5) {
      ytPlayerRef.current?.seekTo(0);
    } else {
      ytPlayerRef.current?.previous();
    }
  };

  const handleSeek = (seconds: number) => {
    setCurrentTime(seconds);
    ytPlayerRef.current?.seekTo(seconds);
  };

  return (
    <main className="relative min-h-screen w-full flex flex-col justify-between overflow-x-hidden">
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
        onTrackChange={(trackTitle, trackIdx) => {
          setCurrentTrackIndex(trackIdx);
          setCurrentTrackName(trackTitle);
        }}
      />

      {/* J-Card Inlay Booklet Modal */}
      <JCardModal
        cassette={jCardCassette}
        isOpen={!!jCardCassette}
        onClose={() => setJCardCassette(null)}
        onPlay={handleSelectCassette}
      />

      {/* Support Us Modal */}
      <SupportModal
        isOpen={isSupportModalOpen}
        onClose={() => setIsSupportModalOpen(false)}
      />
    </main>
  );
}
