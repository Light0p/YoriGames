import type { Metadata, Viewport } from 'next';
import { Inter, Pixelify_Sans, Press_Start_2P } from 'next/font/google';
import Script from 'next/script';
import { Analytics } from "@vercel/analytics/next";
import './globals.css';
import { cn } from '@/lib/utils';
import { GalaxyBackground } from '@/components/layout/GalaxyBackground';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { GameProvider } from '@/context/GameContext';
import { MaintenanceMode } from '@/components/layout/MaintenanceMode';
import { getSearchableGames } from '@/lib/games';

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
};

// SET TO TRUE TO LOCK THE SITE BEHIND MAINTENANCE SCREEN
const isMaintenanceMode = false;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Static Pre-fetch: Read games at build time to hydrate the client instantly
  const initialGames = await getSearchableGames();

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
        {isMaintenanceMode ? (
          <MaintenanceMode />
        ) : (
          <FirebaseClientProvider>
            <GameProvider initialGames={initialGames}>
              <GalaxyBackground />
              <div className="relative z-10 overflow-x-hidden w-full">
                {children}
              </div>
            </GameProvider>
          </FirebaseClientProvider>
        )}
        <Analytics />
      </body>
    </html>
  );
}
