'use client';

import React, { useEffect, useRef, useState, useCallback, useImperativeHandle } from 'react';
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
    },
    ref
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const playerRef = useRef<any>(null);
    const timeIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const [isApiReady, setIsApiReady] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const activePlaylistIdRef = useRef<string | null>(null);

    // Keep latest props in refs to prevent player re-initialization
    const onStatusChangeRef = useRef(onStatusChange);
    const onTimeUpdateRef = useRef(onTimeUpdate);
    const onTrackChangeRef = useRef(onTrackChange);
    const isMutedRef = useRef(isMuted);
    const volumeRef = useRef(volume);

    useEffect(() => {
      onStatusChangeRef.current = onStatusChange;
      onTimeUpdateRef.current = onTimeUpdate;
      onTrackChangeRef.current = onTrackChange;
      isMutedRef.current = isMuted;
      volumeRef.current = volume;
    });

    // 1. Load YouTube IFrame API
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
        const timer = setInterval(() => {
          if (window.YT && window.YT.Player) {
            setIsApiReady(true);
            clearInterval(timer);
          }
        }, 100);
        return () => clearInterval(timer);
      }
    }, []);

    // 2. Start / Stop Progress Tracking
    const stopTimeTracking = useCallback(() => {
      if (timeIntervalRef.current) {
        clearInterval(timeIntervalRef.current);
        timeIntervalRef.current = null;
      }
    }, []);

    const syncTrackInfo = useCallback(() => {
      const player = playerRef.current;
      if (!player) return;
      try {
        if (typeof player.getVideoData === 'function') {
          const data = player.getVideoData();
          if (data && data.title && onTrackChangeRef.current) {
            const idx = typeof player.getPlaylistIndex === 'function' ? player.getPlaylistIndex() : 0;
            onTrackChangeRef.current(data.title, idx);
          }
        }
      } catch {}
    }, []);

    const startTimeTracking = useCallback(() => {
      stopTimeTracking();
      timeIntervalRef.current = setInterval(() => {
        const player = playerRef.current;
        if (player && typeof player.getCurrentTime === 'function' && typeof player.getDuration === 'function') {
          try {
            const cur = player.getCurrentTime() || 0;
            const dur = player.getDuration() || 0;
            onTimeUpdateRef.current(cur, dur);
            syncTrackInfo();
          } catch {
            // Ignore cross-origin tick glitches
          }
        }
      }, 400);
    }, [stopTimeTracking, syncTrackInfo]);

    // 3. Initialize Player
    useEffect(() => {
      if (!isApiReady || !containerRef.current || isReady) return;

      const initialPlaylistId = cassette?.youtubePlaylistId || 'PLcapRHvIb19A';
      activePlaylistIdRef.current = initialPlaylistId;

      try {
        playerRef.current = new window.YT.Player(containerRef.current, {
          height: '200',
          width: '200',
          playerVars: {
            listType: 'playlist',
            list: initialPlaylistId,
            autoplay: 0,
            controls: 0,
            disablekb: 1,
            enablejsapi: 1,
            fs: 0,
            iv_load_policy: 3,
            modestbranding: 1,
            playsinline: 1,
            rel: 0,
            origin: typeof window !== 'undefined' ? window.location.origin : '',
          },
          events: {
            onReady: (e: any) => {
              setIsReady(true);
              try {
                e.target.setVolume(volumeRef.current);
                if (isMutedRef.current) e.target.mute();
                // Cue playlist ready to play on first user click
                e.target.cuePlaylist({
                  list: initialPlaylistId,
                  listType: 'playlist',
                  index: 0,
                });
                syncTrackInfo();
              } catch {}
            },
            onStateChange: (e: any) => {
              const state = e.data;
              let status: PlaybackStatus = 'unstarted';
              if (state === 1) {
                status = 'playing';
                startTimeTracking();
                syncTrackInfo();
              } else if (state === 2) {
                status = 'paused';
                stopTimeTracking();
              } else if (state === 3) {
                status = 'buffering';
                syncTrackInfo();
              } else if (state === 0) {
                status = 'ended';
                stopTimeTracking();
                // Auto advance to next track
                try {
                  e.target.nextVideo();
                } catch {}
              } else if (state === 5) {
                status = 'cued';
                syncTrackInfo();
              }
              onStatusChangeRef.current(status);
            },
            onError: (err: any) => {
              console.warn('YouTube Player Error code:', err?.data);
              try {
                if (playerRef.current && typeof playerRef.current.nextVideo === 'function') {
                  playerRef.current.nextVideo();
                }
              } catch {}
            },
          },
        });
      } catch (err) {
        console.error('Failed to instantiate YouTube player:', err);
      }

      return () => {
        stopTimeTracking();
      };
    }, [isApiReady, isReady, startTimeTracking, stopTimeTracking, syncTrackInfo, cassette?.youtubePlaylistId]);

    // 4. Forceful Cassette Playlist Switching
    useEffect(() => {
      const player = playerRef.current;
      if (!player || !isReady || !cassette) return;

      const targetPlaylistId = cassette.youtubePlaylistId || 'PLcapRHvIb19A';
      if (activePlaylistIdRef.current === targetPlaylistId) return;
      activePlaylistIdRef.current = targetPlaylistId;

      try {
        // 1. Force stop existing audio buffer
        if (typeof player.stopVideo === 'function') {
          player.stopVideo();
        }

        // 2. Load or Cue the target playlist from index 0
        if (isPlaying) {
          player.loadPlaylist({
            list: targetPlaylistId,
            listType: 'playlist',
            index: 0,
            startSeconds: 0,
          });
          if (typeof player.playVideoAt === 'function') {
            setTimeout(() => {
              try {
                player.playVideoAt(0);
              } catch {}
            }, 250);
          }
        } else {
          player.cuePlaylist({
            list: targetPlaylistId,
            listType: 'playlist',
            index: 0,
            startSeconds: 0,
          });
        }

        setTimeout(syncTrackInfo, 500);
      } catch (e) {
        console.warn('Error switching cassette playlist:', e);
      }
    }, [cassette?.id, cassette?.youtubePlaylistId, isReady, isPlaying, syncTrackInfo]);

    // 5. Play / Pause Control
    useEffect(() => {
      const player = playerRef.current;
      if (!player || !isReady) return;

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
    }, [isPlaying, isReady]);

    // 6. Volume & Mute Updates
    useEffect(() => {
      const player = playerRef.current;
      if (!player || !isReady) return;
      try {
        if (typeof player.setVolume === 'function') {
          player.setVolume(volume);
        }
        if (isMuted && typeof player.mute === 'function') {
          player.mute();
        } else if (!isMuted && typeof player.unMute === 'function') {
          player.unMute();
        }
      } catch {}
    }, [volume, isMuted, isReady]);

    // 7. Imperative Methods Exposed via Ref
    useImperativeHandle(ref, () => ({
      play: () => {
        try {
          const player = playerRef.current;
          if (!player) return;
          const state = typeof player.getPlayerState === 'function' ? player.getPlayerState() : -1;
          if (state === 5 || state === -1) {
            if (typeof player.playVideoAt === 'function') {
              player.playVideoAt(0);
            } else {
              player.playVideo();
            }
          } else {
            player.playVideo();
          }
        } catch (e) {
          console.warn('Play error:', e);
        }
      },
      pause: () => {
        try {
          playerRef.current?.pauseVideo();
        } catch {}
      },
      stop: () => {
        try {
          playerRef.current?.stopVideo();
          stopTimeTracking();
          onTimeUpdateRef.current(0, 0);
        } catch {}
      },
      next: () => {
        try {
          const player = playerRef.current;
          if (!player) return;
          if (typeof player.nextVideo === 'function') {
            player.nextVideo();
            player.playVideo();
          }
          setTimeout(syncTrackInfo, 500);
        } catch (e) {
          console.warn('Next track error:', e);
        }
      },
      previous: () => {
        try {
          const player = playerRef.current;
          if (!player) return;
          if (typeof player.previousVideo === 'function') {
            player.previousVideo();
            player.playVideo();
          }
          setTimeout(syncTrackInfo, 500);
        } catch (e) {
          console.warn('Previous track error:', e);
        }
      },
      seekTo: (seconds: number) => {
        try {
          if (typeof playerRef.current?.seekTo === 'function') {
            playerRef.current.seekTo(seconds, true);
          }
        } catch {}
      },
      seekRelative: (offsetSeconds: number) => {
        try {
          const cur = playerRef.current?.getCurrentTime() || 0;
          const next = Math.max(0, cur + offsetSeconds);
          playerRef.current?.seekTo(next, true);
        } catch {}
      },
    }));

    return (
      <div className="fixed -bottom-96 -right-96 w-48 h-48 opacity-[0.001] pointer-events-none z-[-10] overflow-hidden">
        <div ref={containerRef} id="youtubeBridge" />
      </div>
    );
  }
);

YouTubePlayer.displayName = 'YouTubePlayer';
