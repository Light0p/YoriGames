import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://yorigames.app'),
  title: {
    template: '%s | YoriGames Arcade',
    default: 'YoriGames | Play Instantly. No Downloads.',
  },
  description: 'Experience the galaxy\'s most curated collection of premium indie pixel-art arcade games. Play instantly in your browser.',
  keywords: ['pixel art', 'arcade', 'browser games', 'indie games', 'retro gaming', 'free games'],
  openGraph: {
    title: 'YoriGames | Play Instantly',
    description: 'The ultimate pixel-art arcade and game launcher.',
    url: 'https://yorigames.app',
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Pixelify+Sans:wght@400;700&family=Press+Start+2P&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background text-foreground overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
