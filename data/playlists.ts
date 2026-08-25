import { CassetteData } from '@/lib/types';

export const CASSETTE_SECTIONS = [
  {
    id: '1990-hits',
    title: '1990 Hits Playlist',
    hindiTitle: '१९९० के सुपरहिट नगमे',
    description: 'Live 1990s Bollywood Hits YouTube playlist.',
  },
] as const;

export const CASSETTE_PLAYLISTS: CassetteData[] = [
  {
    id: '1990-hits-master',
    section_id: '1990-hits',
    section_title: '1990 Hits Playlist',
    category: '1990s Bollywood',
    title: '1990 Hits Playlist',
    subtitle: 'Nostalgic 1990s Bollywood Evergreen Hits',
    hindiTitle: '१९९० के सदाबहार सुपरहिट नगमे',
    description: 'Live YouTube playlist streaming all 1990s Bollywood timeless tracks continuously.',
    source: 'YouTube Playlist',
    era: '1990s',
    yearRange: '1990 - 1999',
    moods: ['all', 'romance', 'safar', 'latenight', 'masti', 'heartbreak', 'baarish'],
    type: 'youtube-playlist',
    youtubePlaylistId: 'PLUidBbOgoG6A',
    youtube_video_id: 'ODu7OyAqK-Q',
    youtubeVideoId: 'ODu7OyAqK-Q',
    youtubeId: 'ODu7OyAqK-Q',
    youtube_url: 'https://www.youtube.com/watch?v=ODu7OyAqK-Q&list=PLUidBbOgoG6A',
    youtubeUrl: 'https://www.youtube.com/watch?v=ODu7OyAqK-Q&list=PLUidBbOgoG6A',
    channel_name: 'YouTube Music',
    channel_url: 'https://www.youtube.com',
    contains_individual_videos: true,
    official: true,
    verified_official: true,
    trackCount: 13,
    durationApprox: 'Continuous Playlist',
    featuredBadge: '1990 SUPERHIT C-90',
    recordLabel: 'Indian Vintage Cassettes',
    priceMRP: '₹ 35.00 (M.R.P. Incl. of all taxes)',
    jCardNotes: 'Live dynamic playlist streamed directly from YouTube with Dolby NR Type B analog simulation.',
    sideA: [
      '1. Pehla Nasha - Jo Jeeta Wohi Sikandar',
      '2. Dheere Dheere Se Meri Zindagi Mein Aana - Aashiqui',
      '3. Nazar Ke Samne - Aashiqui',
      '4. Tu Meri Zindagi Hai - Aashiqui',
      '5. Bahut Pyaar Karte Hai - Saajan',
      '6. Mera Dil Bhi Kitna Pagal Hai - Saajan',
      '7. Tumse Milne Ki Tamanna Hai - Saajan',
    ],
    sideB: [
      '1. Jeeye To Jeeye Kaise - Saajan',
      '2. Adayein Bhi Hain Mohabbat Bhi Hai - Dil Hai Ke Manta Nahin',
      '3. O Mere Sapno Ke Saudagar - Dil Hai Ke Manta Nahin',
      '4. Dil Hai Ke Manta Nahin - Title Track',
      '5. Aisi Deewangi - Deewana',
      '6. Sochenge Tumhe Pyar - Deewana',
      '+ Live Added Songs from Playlist',
    ],
    coverColor: {
      base: '#991b1b',
      border: '#f59e0b',
      accent: '#fef3c7',
      labelBg: '#faf4e6',
      labelText: '#1c0704',
      tapeBody: 'smoke',
      ribbonColor: '#dc2626',
    },
  },
];

export const ERA_FILTERS = [
  {
    id: 'all',
    label: 'All Tracks',
    tagline: 'सुनहरा सफर',
    years: '1990 - 1999',
    icon: '📼',
    color: '#f59e0b',
    description: 'Complete 1990s playlist collection.',
  },
] as const;

export const MOOD_FILTERS = [
  { id: 'all', label: 'All Moods', emoji: '✨' },
] as const;
