'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { CassetteData, PlaybackStatus } from '@/lib/types';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

interface YouTubePlayerProps {
  cassette: CassetteData | null;
  isPlaying: boolean;
  volume: number; // 0 to 100
  isMuted: boolean;
  onStatusChange: (status: PlaybackStatus) => void;
  onTimeUpdate: (currentTime: number, duration: number) => void;
  onTrackChange?: (trackTitle: string, trackIndex: number) => void;
  showVideoDebug?: boolean;
}

export interface YouTubePlayerRef {
  play: () => void;
  pause: () => void;
  stop: () => void;
  next: () => void;
  previous: () => void;
  seekTo: (seconds: number) => void;
  seekRelative: (offsetSeconds: number) => void;
}

export const YouTubePlayer = React.forwardRef<YouTubePlayerRef, YouTubePlayerProps>(
  (
    {
      cassette,
      isPlaying,
      volume,
      isMuted,
      onStatusChange,
      onTimeUpdate,
      onTrackChange,
      showVideoDebug = false,
    },
    ref
  ) => {
    const playerContainerRef = useRef<HTMLDivElement>(null);
    const playerInstanceRef = useRef<any>(null);
    const timeIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const [isApiReady, setIsApiReady] = useState(false);
    const [isPlayerInitialized, setIsPlayerInitialized] = useState(false);
    const currentCassetteIdRef = useRef<string | null>(null);

    // 1. Load YouTube IFrame API script
    useEffect(() => {
      if (typeof window === 'undefined') return;

      if (window.YT && window.YT.Player) {
        setIsApiReady(true);
        return;
      }

      const existingScript = document.getElementById('youtube-iframe-api');
      if (!existingScript) {
        const tag = document.createElement('script');
        tag.id = 'youtube-iframe-api';
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);

        window.onYouTubeIframeAPIReady = () => {
          setIsApiReady(true);
        };
      } else {
        const checkReady = setInterval(() => {
          if (window.YT && window.YT.Player) {
            setIsApiReady(true);
            clearInterval(checkReady);
          }
        }, 100);
        return () => clearInterval(checkReady);
      }
    }, []);

    // 2. Clear timer on unmount
    const stopTimeTracking = useCallback(() => {
      if (timeIntervalRef.current) {
        clearInterval(timeIntervalRef.current);
        timeIntervalRef.current = null;
      }
    }, []);

    // 3. Start timer for progress updates
    const startTimeTracking = useCallback(() => {
      stopTimeTracking();
      timeIntervalRef.current = setInterval(() => {
        const player = playerInstanceRef.current;
        if (player && typeof player.getCurrentTime === 'function' && typeof player.getDuration === 'function') {
          try {
            const curTime = player.getCurrentTime() || 0;
            const dur = player.getDuration() || 0;
            onTimeUpdate(curTime, dur);

            // Check if title changed
            if (typeof player.getVideoData === 'function') {
              const data = player.getVideoData();
              if (data && data.title && onTrackChange) {
                const idx = typeof player.getPlaylistIndex === 'function' ? player.getPlaylistIndex() : 0;
                onTrackChange(data.title, idx);
              }
            }
          } catch {
            // Ignore cross-origin tick glitches
          }
        }
      }, 500);
    }, [onTimeUpdate, onTrackChange, stopTimeTracking]);

    // 4. Initialize Player Instance once API is ready
    useEffect(() => {
      if (!isApiReady || !playerContainerRef.current || isPlayerInitialized) return;

      try {
        playerInstanceRef.current = new window.YT.Player(playerContainerRef.current, {
          height: '100%',
          width: '100%',
          playerVars: {
            autoplay: 0,
            controls: 1,
            disablekb: 0,
            enablejsapi: 1,
            fs: 0,
            iv_load_policy: 3,
            modestbranding: 1,
            playsinline: 1,
            rel: 0,
            origin: typeof window !== 'undefined' ? window.location.origin : '',
          },
          events: {
            onReady: (event: any) => {
              setIsPlayerInitialized(true);
              event.target.setVolume(volume);
              if (isMuted) event.target.mute();
            },
            onStateChange: (event: any) => {
              const state = event.data;
              // YT.PlayerState: UNSTARTED (-1), ENDED (0), PLAYING (1), PAUSED (2), BUFFERING (3), CUED (5)
              let status: PlaybackStatus = 'unstarted';
              if (state === 1) {
                status = 'playing';
                startTimeTracking();
              } else if (state === 2) {
                status = 'paused';
                stopTimeTracking();
              } else if (state === 3) {
                status = 'buffering';
              } else if (state === 0) {
                status = 'ended';
                stopTimeTracking();
              } else if (state === 5) {
                status = 'cued';
              }
              onStatusChange(status);
            },
            onError: (err: any) => {
              console.warn('YouTube Player Event Error:', err);
            },
          },
        });
      } catch (err) {
        console.error('Error creating YouTube player instance:', err);
      }

      return () => {
        stopTimeTracking();
      };
    }, [isApiReady, isPlayerInitialized, isMuted, volume, onStatusChange, startTimeTracking, stopTimeTracking]);

    // 5. Load or update media when cassette changes
    useEffect(() => {
      const player = playerInstanceRef.current;
      if (!player || !isPlayerInitialized || !cassette) return;

      if (currentCassetteIdRef.current === cassette.id) return;
      currentCassetteIdRef.current = cassette.id;

      try {
        if (cassette.type === 'playlist' && cassette.youtubePlaylistId) {
          player.loadPlaylist({
            list: cassette.youtubePlaylistId,
            listType: 'playlist',
            index: 0,
            suggestedQuality: 'hd720',
          });
        } else if (cassette.youtubeId) {
          player.loadVideoById({
            videoId: cassette.youtubeId,
            suggestedQuality: 'hd720',
          });
        }
      } catch (e) {
        console.warn('Error loading video/playlist on player:', e);
      }
    }, [cassette, isPlayerInitialized]);

    // 6. Handle play/pause commands from parent
    useEffect(() => {
      const player = playerInstanceRef.current;
      if (!player || !isPlayerInitialized) return;

      try {
        const state = typeof player.getPlayerState === 'function' ? player.getPlayerState() : -1;
        if (isPlaying && state !== 1 && state !== 3) {
          player.playVideo();
        } else if (!isPlaying && state === 1) {
          player.pauseVideo();
        }
      } catch (e) {
        console.warn('Playback toggle error:', e);
      }
    }, [isPlaying, isPlayerInitialized]);

    // 7. Volume and mute updates
    useEffect(() => {
      const player = playerInstanceRef.current;
      if (!player || !isPlayerInitialized) return;
      try {
        if (typeof player.setVolume === 'function') {
          player.setVolume(volume);
        }
        if (typeof player.mute === 'function' && typeof player.unMute === 'function') {
          if (isMuted) {
            player.mute();
          } else {
            player.unMute();
          }
        }
      } catch (e) {
        console.warn('Volume update error:', e);
      }
    }, [volume, isMuted, isPlayerInitialized]);

    // 8. Expose imperative commands via React ref
    React.useImperativeHandle(ref, () => ({
      play: () => {
        try {
          playerInstanceRef.current?.playVideo();
        } catch {}
      },
      pause: () => {
        try {
          playerInstanceRef.current?.pauseVideo();
        } catch {}
      },
      stop: () => {
        try {
          playerInstanceRef.current?.stopVideo();
          stopTimeTracking();
          onTimeUpdate(0, 0);
        } catch {}
      },
      next: () => {
        try {
          if (typeof playerInstanceRef.current?.nextVideo === 'function') {
            playerInstanceRef.current.nextVideo();
          }
        } catch {}
      },
      previous: () => {
        try {
          if (typeof playerInstanceRef.current?.previousVideo === 'function') {
            playerInstanceRef.current.previousVideo();
          }
        } catch {}
      },
      seekTo: (seconds: number) => {
        try {
          if (typeof playerInstanceRef.current?.seekTo === 'function') {
            playerInstanceRef.current.seekTo(seconds, true);
          }
        } catch {}
      },
      seekRelative: (offsetSeconds: number) => {
        try {
          const cur = playerInstanceRef.current?.getCurrentTime() || 0;
          const nextTime = Math.max(0, cur + offsetSeconds);
          playerInstanceRef.current?.seekTo(nextTime, true);
        } catch {}
      },
    }));

    return (
      <div
        className={`transition-all duration-300 ${
          showVideoDebug
            ? 'relative w-full aspect-video rounded-lg overflow-hidden border-2 border-retro-gold shadow-2xl bg-black my-4'
            : 'absolute -top-[9999px] -left-[9999px] w-1 h-1 opacity-0 pointer-events-none'
        }`}
      >
        <div ref={playerContainerRef} className="w-full h-full" />
      </div>
    );
  }
);

YouTubePlayer.displayName = 'YouTubePlayer';
