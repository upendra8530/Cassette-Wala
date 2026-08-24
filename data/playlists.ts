import { CassetteData } from '@/lib/types';

export const CASSETTE_PLAYLISTS: CassetteData[] = [
  {
    id: '90s-evergreen-001',
    category: '90s Evergreen',
    title: 'Dil Laga Liya',
    film: 'Dil Hai Tumhaara',
    artists: ['Alka Yagnik', 'Udit Narayan'],
    youtube_video_id: 'kYv9iD09Sg4',
    youtubeVideoId: 'kYv9iD09Sg4',
    youtubeId: 'kYv9iD09Sg4',
    youtube_url: 'https://www.youtube.com/watch?v=kYv9iD09Sg4',
    youtubeUrl: 'https://www.youtube.com/watch?v=kYv9iD09Sg4',
    channel_name: 'Tips Official',
    channel_url: 'https://www.youtube.com/@tipsofficial',
    is_individual_video: true,
    verified_official: true,
    source: 'Tips Official',
    subtitle: 'Film: Dil Hai Tumhaara (2002) • Nadeem-Shravan',
    hindiTitle: 'दिल लगा लिया मैंने तुमसे प्यार करके',
    description: 'The immortal 90s/2000s love anthem sung by Alka Yagnik & Udit Narayan, composed by Nadeem-Shravan.',
    era: '1990s',
    yearRange: '2002 (90s Sound)',
    moods: ['all', 'romance', 'safar'],
    type: 'youtube-video',
    trackCount: 1,
    durationApprox: '4:31 min',
    featuredBadge: 'TIPS OFFICIAL STEREO',
    recordLabel: 'Tips Industries Ltd. Bombay',
    priceMRP: '₹ 35.00 (M.R.P. Incl. of all taxes)',
    jCardNotes: 'Singers: Alka Yagnik, Udit Narayan | Music: Nadeem-Shravan | Lyrics: Sameer | Film: Dil Hai Tumhaara (Preity Zinta, Jimmy Shergill, Arjun Rampal)',
    sideA: [
      '1. Dil Laga Liya (Dil Hai Tumhaara)',
    ],
    sideB: [
      '1. Dil Laga Liya - Instrumental / Repeat',
    ],
    tracksDetailed: [
      {
        title: 'Dil Laga Liya',
        artist: 'Alka Yagnik, Udit Narayan',
        movie: 'Dil Hai Tumhaara',
        duration: '4:31',
        timestampSeconds: 0,
      },
    ],
    coverColor: {
      base: '#b91c1c',
      border: '#f59e0b',
      accent: '#fef3c7',
      labelBg: '#faf0ca',
      labelText: '#1f1b16',
      tapeBody: 'red',
      ribbonColor: '#ef4444',
    },
  },
];

export const ERA_FILTERS = [
  {
    id: 'all',
    label: 'All Eras (सभी दौर)',
    tagline: 'सुनहरा सफर',
    years: 'All Time',
    icon: '📼',
    color: '#f59e0b',
    description: 'Explore nostalgic Indian music from Bollywood golden eras.',
  },
  {
    id: '1990s',
    label: '90s Evergreen',
    tagline: 'दिलकश और यादगार नगमे',
    years: '1990s - 2000s',
    icon: '❤️',
    color: '#b91c1c',
    description: 'The golden age of cassette shops, Nadeem-Shravan melodies, Alka Yagnik and Udit Narayan duets.',
  },
] as const;

export const MOOD_FILTERS = [
  { id: 'all', label: 'All Moods (सभी रंग)', emoji: '✨' },
  { id: 'romance', label: 'Romance (इश्क़)', emoji: '❤️' },
  { id: 'safar', label: 'Safar (सफ़र)', emoji: '🚗' },
  { id: 'latenight', label: 'Late Night (देर रात)', emoji: '🌙' },
] as const;
