import type { Metadata, Viewport } from 'next';
import { Inter, Pixelify_Sans, Press_Start_2P } from 'next/font/google';
import Script from 'next/script';
import { Analytics } from "@vercel/analytics/next";
import './globals.css';
import { cn } from '@/lib/utils';
import { GalaxyBackground } from '@/components/layout/GalaxyBackground';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { GameProvider } from '@/context/GameContext';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const pixelify = Pixelify_Sans({ 
  subsets: ['latin'],
  variable: '--font-pixelify',
  display: 'swap',
});

const pressStart = Press_Start_2P({ 
  weight: '400',
  subsets: ['latin'],
  variable: '--font-press-start',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#09061B',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://yorigamesonline.online'),
  title: {
    template: '%s | YoriGames',
    default: 'YoriGames | Play Great Browser Games Instantly',
  },
  description: 'A growing collection of fun, fast-loading browser games built for quick sessions. No downloads, no installations—just pure arcade magic right in your browser.',
  keywords: ['pixel art', 'arcade', 'browser games', 'indie games', 'retro gaming', 'free games', 'no download games', 'html5 games'],
  openGraph: {
    title: 'YoriGames | Simple Browser Gaming',
    description: 'A collection of fun, fast-loading indie games. No downloads, just pure arcade magic right in your browser.',
    url: 'https://yorigamesonline.online',
    siteName: 'YoriGames',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'YoriGames - Simple Browser Gaming',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'YoriGames | Simple Browser Games',
    description: 'Play fun, fast-loading indie games instantly. No downloads required.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: '/',
  },
  other: {
    "google-adsense-account": "ca-pub-7395050320323237",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <Script 
          async 
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7395050320323237"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className={cn(
        "min-h-screen bg-background font-body antialiased selection:bg-neon-purple selection:text-white overflow-x-hidden w-full relative",
        inter.variable,
        pixelify.variable,
        pressStart.variable
      )}>
        <FirebaseClientProvider>
          <GameProvider>
            <GalaxyBackground />
            <div className="relative z-10 overflow-x-hidden w-full">
              {children}
            </div>
          </GameProvider>
        </FirebaseClientProvider>
        <Analytics />
      </body>
    </html>
  );
}
