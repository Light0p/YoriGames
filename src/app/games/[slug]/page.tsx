import React from 'react';
import { Metadata } from 'next';
import { getGameBySlug, getAllGames } from '@/lib/games';
import { notFound } from 'next/navigation';
import { GameView } from '@/components/game/GameView';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const game = await getGameBySlug(slug);

  if (!game) {
    return { title: 'Game Not Found' };
  }

  const title = `Play ${game.title} Online Free | YoriGames Arcade`;
  const description = `Play ${game.title} instantly in your browser. No download required. ${game.description.substring(0, 150)}`;

  return {
    title,
    description,
    alternates: { canonical: `/games/${game.slug}` },
    openGraph: {
      title,
      description,
      url: `https://yorigamesonline.online/games/${game.slug}`,
      images: [game.thumbnail],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [game.thumbnail],
    },
  };
}

export default async function GamePage({ params }: Props) {
  const { slug } = await params;
  const game = await getGameBySlug(slug);

  if (!game) notFound();

  // Fetch related games from Firestore
  const relatedGamesRef = await getAllGames(50); 

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'VideoGame',
    name: game.title,
    description: game.description,
    genre: game.category,
    image: game.thumbnail,
    url: `https://yorigamesonline.online/games/${game.slug}`,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: game.rating,
      reviewCount: game.play_count,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <GameView game={game} allGames={relatedGamesRef} />
    </>
  );
}

// Disable static params to ensure new GameMonetize games are served instantly
export const dynamic = 'force-dynamic';
