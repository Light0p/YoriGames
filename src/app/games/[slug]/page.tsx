import React from 'react';
import { Metadata } from 'next';
import { getGameBySlug, getRelatedGames } from '@/lib/games'; 
import { notFound } from 'next/navigation';
import { GameView } from '@/components/game/GameView';

export const dynamic = 'force-static';
export const revalidate = 3600;

interface Props {
  params: Promise<{ slug: string }>;
}

/**
 * Dynamic Metadata Generator for SEO.
 * Implements the specific Title and Description patterns requested.
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const game = await getGameBySlug(slug);

  if (!game) {
    return { title: 'Game Not Found | YoriGames' };
  }

  const title = `Play ${game.title} Online Free - YoriGames`;
  const description = `Play ${game.title} for free right in your browser. No downloads, no lag. Experience the best ${game.category} HTML5 games on YoriGames.`;

  return {
    title,
    description,
    alternates: { canonical: `/games/${game.slug}` },
    openGraph: {
      title,
      description,
      url: `https://yorigamesonline.online/games/${game.slug}`,
      images: [game.thumbnail || game.thumb],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [game.thumbnail || game.thumb],
    },
  };
}

export default async function GamePage({ params }: Props) {
  const { slug } = await params;
  const game = await getGameBySlug(slug);

  if (!game) notFound();

  // Deterministic random review count between 100-500 based on slug length
  const reviewCount = 100 + (slug.length * 13) % 400;

  // VideoGame Rich Snippets (Schema.org)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'VideoGame',
    name: game.title,
    description: game.description,
    genre: game.category,
    image: game.thumbnail || game.thumb,
    url: `https://yorigamesonline.online/games/${game.slug}`,
    applicationCategory: 'Game',
    operatingSystem: 'Any',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5',
      reviewCount: reviewCount.toString(),
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock'
    }
  };

  const relatedGames = await getRelatedGames(game.category, game.id, 6); 

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <GameView game={game} allGames={relatedGames} />
    </>
  );
}
