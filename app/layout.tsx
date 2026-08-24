import type { Metadata, Viewport } from 'next';
import { Playfair_Display, Kalam, Caveat, Share_Tech_Mono, Outfit } from 'next/font/google';
import './globals.css';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const kalam = Kalam({
  weight: ['400', '700'],
  subsets: ['latin', 'devanagari'],
  variable: '--font-kalam',
  display: 'swap',
});

const caveat = Caveat({
  subsets: ['latin'],
  variable: '--font-caveat',
  display: 'swap',
});

const shareTechMono = Share_Tech_Mono({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-share-tech-mono',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#18100b',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: 'Cassette Wala | Rewind. Play. Relive.',
  description:
    'Relive the golden era of 80s, 90s and 2000s Bollywood music. Explore nostalgic playlists through an authentic interactive cassette player experience.',
  keywords: [
    'Cassette Wala',
    '80s Bollywood songs',
    '90s Bollywood evergreen',
    '2000s Indian pop',
    'Kumar Sanu romantic songs',
    'Alka Yagnik hits',
    'Udit Narayan duets',
    'Retro Indian music player',
    'Nostalgic Hindi songs',
    'Vintage cassette player',
  ],
  authors: [{ name: 'Cassette Wala' }],
  creator: 'Cassette Wala',
  openGraph: {
    title: 'Cassette Wala | Rewind. Play. Relive.',
    description:
      'Your favourite 80s, 90s and 2000s memories — one physical cassette at a time. Step into an old Indian cassette shop.',
    type: 'website',
    locale: 'en_IN',
    siteName: 'Cassette Wala',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cassette Wala | Rewind. Play. Relive.',
    description:
      'Relive the golden era of 80s, 90s and 2000s Bollywood music through an authentic interactive cassette player experience.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${kalam.variable} ${caveat.variable} ${shareTechMono.variable} ${outfit.variable}`}
    >
      <body className="bg-[#120d09] text-stone-200 antialiased font-sans min-h-screen selection:bg-retro-gold selection:text-wood-950">
        {children}
      </body>
    </html>
  );
}
