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
  film?: string;
  artists?: string[];
  subtitle?: string;
  description: string;
  hindiTitle?: string;
  source: string; // e.g. "T-Series Bollywood Classics"
  section_id?: '80s-90s' | '90s-2000s' | string;
  section_title?: string;
  category?: '1980s' | '1990s' | '2000s' | 'Artist' | 'Mood' | '80s–90s Golden Hits' | '90s–2000s Evergreen Hits' | string;
  era: '1980s' | '1990s' | '2000s';
  yearRange: string;
  moods: Mood[];
  type?: 'youtube-video' | 'youtube-playlist' | 'video' | 'playlist';
  youtube_video_id?: string;
  youtubeVideoId?: string;
  youtubeId?: string;
  youtube_url?: string;
  youtubeUrl?: string | null;
  youtubePlaylistId?: string | null;
  channel_name?: string;
  channel_url?: string;
  is_individual_video?: boolean;
  contains_individual_videos?: boolean;
  use_for?: string;
  verified_official?: boolean;
  official?: boolean;
  status?: string;
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
