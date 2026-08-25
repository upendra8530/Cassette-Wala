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
    const activeCassetteIdRef = useRef<string | null>(null);

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

    const startTimeTracking = useCallback(() => {
      stopTimeTracking();
      timeIntervalRef.current = setInterval(() => {
        const player = playerRef.current;
        if (player && typeof player.getCurrentTime === 'function' && typeof player.getDuration === 'function') {
          try {
            const cur = player.getCurrentTime() || 0;
            const dur = player.getDuration() || 0;
            onTimeUpdateRef.current(cur, dur);

            if (typeof player.getVideoData === 'function') {
              const data = player.getVideoData();
              if (data && data.title && onTrackChangeRef.current) {
                const idx = typeof player.getPlaylistIndex === 'function' ? player.getPlaylistIndex() : 0;
                onTrackChangeRef.current(data.title, idx);
              }
            }
          } catch {
            // Ignore cross-origin tick glitches
          }
        }
      }, 400);
    }, [stopTimeTracking]);

    // 3. Initialize Player (Strictly Autoplay Disabled)
    useEffect(() => {
      if (!isApiReady || !containerRef.current || isReady) return;

      const playlistId = cassette?.youtubePlaylistId || 'PLUidBbOgoG6A';

      try {
        playerRef.current = new window.YT.Player(containerRef.current, {
          height: '200',
          width: '200',
          playerVars: {
            listType: 'playlist',
            list: playlistId,
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
                // Cue the playlist without playing automatically
                e.target.cuePlaylist({
                  list: playlistId,
                  listType: 'playlist',
                  index: 0,
                });
                const data = e.target.getVideoData?.();
                if (data?.title && onTrackChangeRef.current) {
                  onTrackChangeRef.current(data.title, 0);
                }
              } catch {}
            },
            onStateChange: (e: any) => {
              const state = e.data;
              let status: PlaybackStatus = 'unstarted';
              if (state === 1) {
                status = 'playing';
                startTimeTracking();
                try {
                  const data = e.target.getVideoData?.();
                  const idx = e.target.getPlaylistIndex?.() ?? 0;
                  if (data?.title && onTrackChangeRef.current) {
                    onTrackChangeRef.current(data.title, idx);
                  }
                } catch {}
              } else if (state === 2) {
                status = 'paused';
                stopTimeTracking();
              } else if (state === 3) {
                status = 'buffering';
              } else if (state === 0) {
                status = 'ended';
                stopTimeTracking();
                // Auto advance to next song in playlist
                try {
                  e.target.nextVideo();
                } catch {}
              } else if (state === 5) {
                status = 'cued';
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
    }, [isApiReady, isReady, startTimeTracking, stopTimeTracking, cassette?.youtubePlaylistId]);

    // 4. Load Playlist or Video when cassette changes
    useEffect(() => {
      const player = playerRef.current;
      if (!player || !isReady || !cassette) return;

      if (activeCassetteIdRef.current === cassette.id) return;
      activeCassetteIdRef.current = cassette.id;

      try {
        if (cassette.youtubePlaylistId) {
          if (isPlaying) {
            player.loadPlaylist({
              list: cassette.youtubePlaylistId,
              listType: 'playlist',
              index: 0,
            });
          } else {
            player.cuePlaylist({
              list: cassette.youtubePlaylistId,
              listType: 'playlist',
              index: 0,
            });
          }
        } else if (cassette.youtube_video_id || cassette.youtubeVideoId) {
          const videoIdToLoad = cassette.youtube_video_id || cassette.youtubeVideoId || 'ODu7OyAqK-Q';
          if (isPlaying) {
            player.loadVideoById({ videoId: videoIdToLoad });
          } else {
            player.cueVideoById({ videoId: videoIdToLoad });
          }
        }
      } catch (e) {
        console.warn('Error loading cassette media:', e);
      }
    }, [cassette, isReady, isPlaying]);

    // 5. Play / Pause Control (Only plays when isPlaying is explicitly true)
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
        if (typeof player.mute === 'function' && typeof player.unMute === 'function') {
          if (isMuted) player.mute();
          else player.unMute();
        }
      } catch {}
    }, [volume, isMuted, isReady]);

    // 7. Imperative Ref Methods
    React.useImperativeHandle(ref, () => ({
      play: () => {
        try {
          if (playerRef.current) {
            playerRef.current.unMute();
            playerRef.current.playVideo();
          }
        } catch {}
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
          if (typeof playerRef.current?.nextVideo === 'function') {
            playerRef.current.nextVideo();
          }
        } catch {}
      },
      previous: () => {
        try {
          if (typeof playerRef.current?.previousVideo === 'function') {
            playerRef.current.previousVideo();
          }
        } catch {}
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
