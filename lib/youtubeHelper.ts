export interface ParsedYouTubeInput {
  type: 'playlist' | 'video' | 'invalid';
  id: string;
  originalUrl: string;
}

/**
 * Extracts a playlist ID or video ID from any YouTube URL or raw ID string.
 * Supports:
 * - https://www.youtube.com/playlist?list=PLxxx
 * - https://youtube.com/playlist?list=PLxxx
 * - https://www.youtube.com/watch?v=VIDEO_ID&list=PLxxx
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - Raw playlist IDs like PL123456789 or RD123456789
 * - Raw video IDs like ePSzjF0WzSg
 */
export function parseYouTubeSource(input: string): ParsedYouTubeInput {
  if (!input || typeof input !== 'string') {
    return { type: 'invalid', id: '', originalUrl: '' };
  }

  const trimmed = input.trim();

  // 1. Check for playlist parameter ?list= or &list=
  const playlistMatch = trimmed.match(/[?&]list=([a-zA-Z0-9_-]+)/);
  if (playlistMatch && playlistMatch[1]) {
    return {
      type: 'playlist',
      id: playlistMatch[1],
      originalUrl: trimmed,
    };
  }

  // 2. Direct playlist URL format: /playlist?list=...
  if (trimmed.includes('/playlist')) {
    try {
      const url = new URL(trimmed.startsWith('http') ? trimmed : `https://${trimmed}`);
      const listParam = url.searchParams.get('list');
      if (listParam) {
        return { type: 'playlist', id: listParam, originalUrl: trimmed };
      }
    } catch {
      // Continue to pattern checks
    }
  }

  // 3. Raw Playlist ID heuristic (starts with PL, OLAK, RD, etc. and long)
  if (/^(PL|OLAK|RD|FL|UU|TL)[a-zA-Z0-9_-]{10,}$/i.test(trimmed)) {
    return {
      type: 'playlist',
      id: trimmed,
      originalUrl: `https://www.youtube.com/playlist?list=${trimmed}`,
    };
  }

  // 4. youtu.be/VIDEO_ID
  const youtuBeMatch = trimmed.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (youtuBeMatch && youtuBeMatch[1]) {
    return {
      type: 'video',
      id: youtuBeMatch[1],
      originalUrl: trimmed,
    };
  }

  // 5. youtube.com/watch?v=VIDEO_ID
  const watchMatch = trimmed.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (watchMatch && watchMatch[1]) {
    return {
      type: 'video',
      id: watchMatch[1],
      originalUrl: trimmed,
    };
  }

  // 6. Raw 11-char Video ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return {
      type: 'video',
      id: trimmed,
      originalUrl: `https://www.youtube.com/watch?v=${trimmed}`,
    };
  }

  return { type: 'invalid', id: '', originalUrl: trimmed };
}

/**
 * Format seconds into vintage tape counter / MM:SS string
 */
export function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '00:00';
  const totalSec = Math.floor(seconds);
  const hrs = Math.floor(totalSec / 3600);
  const mins = Math.floor((totalSec % 3600) / 60);
  const secs = totalSec % 60;

  const pad = (n: number) => n.toString().padStart(2, '0');

  if (hrs > 0) {
    return `${hrs}:${pad(mins)}:${pad(secs)}`;
  }
  return `${pad(mins)}:${pad(secs)}`;
}

/**
 * Converts elapsed seconds to a 3-digit mechanical tape counter number (000 - 999)
 */
export function calculateTapeCounter(seconds: number, rate: number = 0.4): string {
  const counterVal = Math.floor(seconds * rate) % 1000;
  return counterVal.toString().padStart(3, '0');
}

/**
 * Get YouTube Thumbnail URL for a video ID
 */
export function getYouTubeThumbnail(videoId: string, quality: 'hq' | 'maxres' = 'hq'): string {
  if (!videoId) return '';
  if (quality === 'maxres') {
    return `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;
  }
  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
}
