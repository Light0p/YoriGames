import type { Metadata, Viewport } from 'next';
import { Inter, Pixelify_Sans, Press_Start_2P } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { cn } from '@/lib/utils';
import { GalaxyBackground } from '@/components/layout/GalaxyBackground';
import { FirebaseClientProvider } from '@/firebase/client-provider';

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
    template: '%s | YoriGames Arcade',
    default: 'YoriGames | Play Instantly. No Downloads.',
  },
  description: 'Experience the galaxy\'s most curated collection of premium indie pixel-art arcade games. Play instantly in your browser.',
  keywords: ['pixel art', 'arcade', 'browser games', 'indie games', 'retro gaming', 'free games'],
  openGraph: {
    title: 'YoriGames | Play Instantly',
    description: 'The ultimate pixel-art arcade and game launcher.',
    url: 'https://yorigamesonline.online',
    siteName: 'YoriGames',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'YoriGames Arcade',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'YoriGames | Play Instantly',
    description: 'The ultimate pixel-art arcade and game launcher.',
    images: ['/og-image.png'],
    creator: '@yorigames',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: '/',
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
          <GalaxyBackground />
          <div className="relative z-10 overflow-x-hidden w-full">
            {children}
          </div>
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
