import React from 'react';
import { Metadata } from 'next';
import gamesData from '@/data/games.json';
import { Game } from '@/types/game';
import { notFound } from 'next/navigation';
import { GameView } from '@/components/game/GameView';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const game = (gamesData as Game[]).find((g) => g.slug === slug);

  if (!game) {
    return {
      title: 'Game Not Found',
    };
  }

  const title = `Play ${game.title} Online Free | YoriGames`;
  const description = `Play ${game.title} instantly in your browser. No download required. ${game.description.substring(0, 120)}...`;

  return {
    title,
    description,
    alternates: {
      canonical: `/games/${game.slug}`,
    },
    openGraph: {
      title,
      description,
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
  const game = (gamesData as Game[]).find((g) => g.slug === slug);

  if (!game) {
    notFound();
  }

  return <GameView game={game} allGames={gamesData as Game[]} />;
}

export async function generateStaticParams() {
  return gamesData.map((game) => ({
    slug: game.slug,
  }));
}
