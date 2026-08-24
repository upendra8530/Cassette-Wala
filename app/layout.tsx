import type { Metadata, Viewport } from 'next';
import { Rozha_One, Yatra_One, Space_Grotesk, Share_Tech_Mono, Kalam } from 'next/font/google';
import './globals.css';

const rozhaOne = Rozha_One({
  weight: '400',
  subsets: ['latin', 'devanagari'],
  variable: '--font-rozha',
  display: 'swap',
});

const yatraOne = Yatra_One({
  weight: '400',
  subsets: ['latin', 'devanagari'],
  variable: '--font-yatra',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space',
  display: 'swap',
});

const shareTechMono = Share_Tech_Mono({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-mono-tech',
  display: 'swap',
});

const kalam = Kalam({
  weight: ['400', '700'],
  subsets: ['latin', 'devanagari'],
  variable: '--font-kalam',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#120806',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://cassettewala.in'),
  title: 'Cassette Wala | Delux 80s, 90s & 2000s Indian Retro Cassette Shop',
  description:
    'Cassette Wala (कैसेट वाला) is a nostalgic Indian retro cassette player and ambient music shop. Explore physical cassette tapes from 80s, 90s & 2000s Bollywood, Kumar Sanu, Udit Narayan, Alka Yagnik, and indie classics.',
  keywords: [
    'Cassette Wala',
    'Cassette Wala music',
    '90s Bollywood songs',
    '80s Hindi songs',
    '2000s Hindi nostalgia',
    'Kumar Sanu romantic songs',
    'Alka Yagnik hits',
    'Indian retro ambient radio',
    'cassettewala.in',
  ],
  authors: [{ name: 'Cassette Wala' }],
  icons: {
    icon: [
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon.png', sizes: '192x192', type: 'image/png' },
      { url: '/logo.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/favicon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/logo.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: '/favicon-32.png',
  },
  openGraph: {
    title: 'Cassette Wala | Rewind. Play. Relive.',
    description:
      'Step into an old Indian cassette shop. Physical cassettes, rotating spools, and nostalgic Bollywood music.',
    type: 'website',
    locale: 'en_IN',
    siteName: 'Cassette Wala',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Cassette Wala',
      },
    ],
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
      className={`${rozhaOne.variable} ${yatraOne.variable} ${spaceGrotesk.variable} ${shareTechMono.variable} ${kalam.variable} scroll-smooth`}
    >
      <body className="bg-[#120806] text-white selection:bg-amber-500/40 font-sans antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
