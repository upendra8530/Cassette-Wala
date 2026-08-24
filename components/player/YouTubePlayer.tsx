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
            onTimeUpdate(cur, dur);

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
      }, 400);
    }, [onTimeUpdate, onTrackChange, stopTimeTracking]);

    // 3. Initialize Player
    useEffect(() => {
      if (!isApiReady || !containerRef.current || isReady) return;

      const initialVideoId =
        cassette?.youtube_video_id ||
        cassette?.youtubeVideoId ||
        cassette?.youtubeId ||
        'kYv9iD09Sg4';

      try {
        playerRef.current = new window.YT.Player(containerRef.current, {
          height: '200',
          width: '200',
          videoId: initialVideoId,
          playerVars: {
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
                e.target.setVolume(volume);
                if (isMuted) e.target.mute();
              } catch {}
            },
            onStateChange: (e: any) => {
              const state = e.data;
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
              console.warn('YouTube Player Error code:', err?.data);
              // Fallback to verified superhit video if specific video fails
              try {
                if (playerRef.current) {
                  playerRef.current.loadVideoById('ePSzjF0WzSg');
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
    }, [isApiReady, isReady, volume, isMuted, onStatusChange, startTimeTracking, stopTimeTracking]);

    // 4. Load New Cassette Video / Playlist
    useEffect(() => {
      const player = playerRef.current;
      if (!player || !isReady || !cassette) return;

      if (activeCassetteIdRef.current === cassette.id) return;
      activeCassetteIdRef.current = cassette.id;

      try {
        if (cassette.type === 'playlist' && cassette.youtubePlaylistId) {
          player.loadPlaylist({
            list: cassette.youtubePlaylistId,
            listType: 'playlist',
            index: 0,
          });
        } else {
          const videoIdToLoad =
            cassette.youtube_video_id ||
            cassette.youtubeVideoId ||
            cassette.youtubeId ||
            'kYv9iD09Sg4';
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
          onTimeUpdate(0, 0);
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
