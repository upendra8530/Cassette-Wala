export type Era = '1980s' | '1990s' | '2000s' | 'all';

export type Mood =
  | 'all'
  | 'romance'
  | 'heartbreak'
  | 'baarish'
  | 'safar'
  | 'latenight'
  | 'masti'
  | 'party'
  | 'radio';

export interface TrackInfo {
  title: string;
  artist?: string;
  movie?: string;
  year?: string;
  duration?: string;
  timestampSeconds?: number;
}

export interface CassetteData {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  hindiTitle?: string;
  era: '1980s' | '1990s' | '2000s';
  yearRange: string;
  moods: Mood[];
  type: 'video' | 'playlist';
  youtubeId?: string; // For single video jukebox
  youtubePlaylistId?: string; // For YouTube playlist
  youtubeUrl: string;
  source: string; // e.g. "T-Series Bollywood Classics", "Tips Official"
  trackCount: number;
  durationApprox: string;
  sideA: string[];
  sideB: string[];
  tracksDetailed?: TrackInfo[];
  coverColor: {
    base: string;
    border: string;
    accent: string;
    labelBg: string;
    labelText: string;
    tapeBody: string; // 'black' | 'clear' | 'smoke' | 'red' | 'gold' | 'teal'
    ribbonColor?: string;
  };
  featuredBadge?: string;
  jCardNotes?: string;
  recordLabel?: string;
  priceMRP?: string;
}

export type PlaybackStatus = 'unstarted' | 'ended' | 'playing' | 'paused' | 'buffering' | 'cued';

export interface AudioSettings {
  sfxEnabled: boolean;
  sfxVolume: number;
  tapeHissEnabled: boolean;
  tapeHissVolume: number;
  tapeType: 'Type I (Normal)' | 'Type II (Chrome)' | 'Type IV (Metal)';
  dolbyNR: 'OFF' | 'B' | 'C';
  crtEffect: boolean;
}
